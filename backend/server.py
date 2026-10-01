import os
import json
import secrets
import subprocess
import html
import re
import ipaddress
import logging
from datetime import datetime, timezone
from typing import List, Optional
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Response, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

load_dotenv()
logger = logging.getLogger(__name__)

app = FastAPI(title="DU-NZO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "dunzo")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

# Managed Email Proxy Configuration
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "DU-NZO")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO", "santosh@du-nzo.com")
LEAD_NOTIFY_EMAIL = os.environ.get("LEAD_NOTIFY_EMAIL", "santosh@du-nzo.com")

mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]
plans_col = db["plans"]
leads_col = db["leads"]


@app.on_event("startup")
async def startup_db_indexes():
    try:
        await plans_col.create_index("id", unique=True)
        await plans_col.create_index("createdAt")
        await leads_col.create_index("createdAt")
    except Exception as e:
        logger.warning(f"Index creation warning: {e}")


def new_id() -> str:
    return secrets.token_urlsafe(6)


# Models
class PlanInput(BaseModel):
    company: Optional[str] = Field(None, max_length=120)
    employees: Optional[str] = None
    maturity: Optional[str] = None
    hosting: Optional[str] = None
    sites: Optional[int] = Field(None, ge=1, le=50)
    frameworks: Optional[List[str]] = None
    alignments: Optional[List[str]] = None
    startDate: Optional[str] = None
    targetDate: Optional[str] = None


class TaskPatchInput(BaseModel):
    taskId: str = Field(..., max_length=60)
    done: bool


class LeadInput(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., max_length=200)
    company: Optional[str] = Field("", max_length=160)
    size: Optional[str] = Field("", max_length=40)
    frameworks: Optional[List[str]] = Field(default_factory=list)
    message: Optional[str] = Field("", max_length=4000)
    planId: Optional[str] = Field(None, max_length=40)
    source: Optional[str] = Field("contact", max_length=80)
    summary: Optional[str] = Field("", max_length=8000)
    marketing: Optional[bool] = False


def generate_plan(input_dict: dict) -> dict:
    code = f"""
    import {{ generatePlan }} from '/app/shared/planEngine.js';
    const input = {json.dumps(input_dict)};
    console.log(JSON.stringify(generatePlan(input)));
    """
    res = subprocess.run(
        ["node", "--input-type=module", "-e", code],
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(res.stdout)


def progress_of(plan: dict, done_ids: List[str]) -> dict:
    done_set = set(done_ids)
    all_tasks = [t for p in plan.get("phases", []) for t in p.get("tasks", [])]
    completed = sum(1 for t in all_tasks if t.get("id") in done_set)
    total = len(all_tasks)
    percent = round((completed / total) * 100) if total else 0
    return {"completed": completed, "total": total, "percent": percent}


def format_plan_view(rec: dict) -> dict:
    done = rec.get("done", [])
    plan = rec.get("plan", {})
    return {
        "id": rec.get("id"),
        "plan": plan,
        "done": done,
        "progress": progress_of(plan, done),
        "createdAt": rec.get("createdAt"),
        "updatedAt": rec.get("updatedAt"),
    }


def verify_admin(authorization: Optional[str] = Header(None)):
    token = (authorization or "").replace("Bearer ", "").replace("bearer ", "").strip()
    if not ADMIN_TOKEN or not secrets.compare_digest(token, ADMIN_TOKEN):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Admin token missing or incorrect"},
        )


# Guardrail Gate & Email Notification
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = (
    "reply with your password", "reply with the code", "send your password", "cvv",
    "send us your password", "enter your password below", "confirm your card number",
    "your full card number", "seed phrase", "recovery phrase", "verify your card",
    "social security number", "confirm your bank details",
)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _assert_safe_email(subject: str, html_content: str) -> None:
    if re.search(r"<\s*(form|input|textarea|select)\b", html_content, re.I):
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html_content}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks for credentials: {p} (G2)")
    urls = re.findall(r'(?:href|src)\s*=\s*["\']?([^"\'\s>]+)', html_content, re.I)
    for url in urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host):
            raise ValueError(f"Shortened/numeric-host URL: {url} (G3)")


async def send_lead_notification(lead_dict: dict):
    if not EMAIL_KEY or not LEAD_NOTIFY_EMAIL:
        return
    source_labels = {
        "contact": "Contact form",
        "trust-center": "Trust Center document request",
        "launchpad": "Startup Compliance Launchpad roadmap request",
    }
    label = source_labels.get(lead_dict.get("source", "contact"), "Website lead")
    name = html.escape(str(lead_dict.get("name", "")))
    email_val = html.escape(str(lead_dict.get("email", "")))
    company = html.escape(str(lead_dict.get("company", "")))
    size = html.escape(str(lead_dict.get("size", "")))
    frameworks = html.escape(", ".join(lead_dict.get("frameworks", [])))
    source = html.escape(str(lead_dict.get("source", "")))
    message = html.escape(str(lead_dict.get("message", "")))
    summary = html.escape(str(lead_dict.get("summary", "")))
    plan_id = html.escape(str(lead_dict.get("planId", "")))
    marketing = "Yes" if lead_dict.get("marketing") else "No"

    def row(k, v):
        if not v:
            return ""
        return (
            f'<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-family:Arial,sans-serif;font-size:13px;vertical-align:top">{k}</td>'
            f'<td style="padding:4px 0;color:#0f172a;font-family:Arial,sans-serif;font-size:13px">{v}</td></tr>'
        )

    subject = f"New {label} — {lead_dict.get('name') or lead_dict.get('email')}"
    html_content = (
        f'<table role="presentation" width="100%" style="max-width:560px"><tr><td style="padding:24px;font-family:Arial,sans-serif">'
        f'<p style="margin:0 0 4px;font-size:16px;color:#0f172a"><strong>New {html.escape(label)}</strong></p>'
        f'<p style="margin:0 0 16px;font-size:13px;color:#64748b">A new submission arrived on du-nzo.com.</p>'
        f'<table role="presentation">'
        f'{row("Name", name)}'
        f'{row("Email", email_val)}'
        f'{row("Company", company)}'
        f'{row("Size", size)}'
        f'{row("Frameworks", frameworks)}'
        f'{row("Source", source)}'
        f'{row("Updates consent", marketing)}'
        f'{row("Message", message)}'
        f'{row("Summary", summary)}'
        f'{row("Plan ID", plan_id)}'
        f'</table>'
        f'<p style="margin:16px 0 0;font-size:12px;color:#94a3b8">Sent by {html.escape(EMAIL_FROM_NAME)}. We never ask for your password or card details by email.</p>'
        f'</td></tr></table>'
    )
    _assert_safe_email(subject, html_content)

    payload = {
        "to": [LEAD_NOTIFY_EMAIL],
        "subject": subject,
        "html": html_content,
        "from_name": EMAIL_FROM_NAME,
    }
    if EMAIL_REPLY_TO:
        payload["contact_email"] = EMAIL_REPLY_TO

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"Content-Type": "application/json", "X-Email-Key": EMAIL_KEY},
                json=payload,
            )
            if resp.status_code >= 400:
                logger.error(f"Email send error {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.error(f"Failed to send email notification: {e}")


# Public Endpoints
@app.get("/api/health")
async def health():
    return {"ok": True}


@app.post("/api/plans/preview")
async def plan_preview(body: PlanInput):
    clean_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    plan = generate_plan(clean_dict)
    return {"plan": plan}


@app.post("/api/plans", status_code=status.HTTP_201_CREATED)
async def create_plan(body: PlanInput):
    clean_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    plan = generate_plan(clean_dict)
    now = datetime.now(timezone.utc).isoformat()
    record = {
        "id": new_id(),
        "plan": plan,
        "done": [],
        "createdAt": now,
        "updatedAt": now,
    }
    await plans_col.insert_one(record)
    return format_plan_view(record)


@app.get("/api/plans/{plan_id}")
async def get_plan(plan_id: str):
    rec = await plans_col.find_one({"id": plan_id}, {"_id": 0})
    if not rec:
        raise HTTPException(status_code=404, detail="Plan not found")
    return format_plan_view(rec)


@app.patch("/api/plans/{plan_id}/tasks")
async def update_plan_tasks(plan_id: str, body: TaskPatchInput):
    rec = await plans_col.find_one({"id": plan_id})
    if not rec:
        raise HTTPException(status_code=404, detail="Plan not found")
    plan = rec.get("plan", {})
    known = any(
        any(t.get("id") == body.taskId for t in p.get("tasks", []))
        for p in plan.get("phases", [])
    )
    if not known:
        raise HTTPException(status_code=400, detail="Unknown task")
    done_set = set(rec.get("done", []))
    if body.done:
        done_set.add(body.taskId)
    else:
        done_set.discard(body.taskId)
    updated_done = list(done_set)
    now = datetime.now(timezone.utc).isoformat()
    await plans_col.update_one(
        {"id": plan_id},
        {"$set": {"done": updated_done, "updatedAt": now}},
    )
    rec["done"] = updated_done
    rec["updatedAt"] = now
    return format_plan_view(rec)


@app.get("/api/plans/{plan_id}/export.csv")
async def export_csv(plan_id: str):
    rec = await plans_col.find_one({"id": plan_id})
    if not rec:
        raise HTTPException(status_code=404, detail="Plan not found")
    plan = rec.get("plan", {})
    done_set = set(rec.get("done", []))

    def csv_cell(v):
        s = str(v if v is not None else "").replace('"', '""')
        return f'"{s}"'

    rows = [["Phase", "Task", "Owner", "Reference", "Deliverable", "Start", "End", "Status"]]
    for p in plan.get("phases", []):
        p_name = p.get("name", "")
        p_start = p.get("startDate", "")
        p_end = p.get("endDate", "")
        for t in p.get("tasks", []):
            status_str = "Done" if t.get("id") in done_set else "Open"
            rows.append([
                p_name,
                t.get("title", ""),
                t.get("owner", ""),
                t.get("ref", ""),
                t.get("deliverable", ""),
                p_start,
                p_end,
                status_str,
            ])
    csv_text = "\r\n".join(",".join(csv_cell(c) for c in r) for r in rows)
    return Response(
        content=csv_text.encode("utf-8"),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="iso-plan-{plan_id}.csv"'},
    )


@app.get("/api/plans/{plan_id}/milestones.ics")
async def export_ics(plan_id: str):
    rec = await plans_col.find_one({"id": plan_id})
    if not rec:
        raise HTTPException(status_code=404, detail="Plan not found")
    plan = rec.get("plan", {})

    def d(s: str) -> str:
        return s.replace("-", "")

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    events = []
    for m in plan.get("milestones", []):
        m_id = m.get("id", "")
        m_name = m.get("name", "")
        m_est = " (estimate)" if m.get("estimate") else ""
        m_date = d(m.get("date", ""))
        events.append(
            f"BEGIN:VEVENT\r\n"
            f"UID:{plan_id}-{m_id}@du-nzo.com\r\n"
            f"DTSTAMP:{stamp}\r\n"
            f"DTSTART;VALUE=DATE:{m_date}\r\n"
            f"SUMMARY:{m_name}{m_est}\r\n"
            f"END:VEVENT"
        )
    ics_text = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DU-NZO//ISO Planner//EN\r\n" + "\r\n".join(events) + "\r\nEND:VCALENDAR\r\n"
    return Response(
        content=ics_text.encode("utf-8"),
        media_type="text/calendar; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="iso-milestones-{plan_id}.ics"'},
    )


@app.post("/api/leads", status_code=status.HTTP_201_CREATED)
async def submit_lead(body: LeadInput, background_tasks: BackgroundTasks):
    lead_id = new_id()
    now = datetime.now(timezone.utc).isoformat()
    record = {
        "id": lead_id,
        "name": body.name,
        "email": body.email,
        "company": body.company or "",
        "size": body.size or "",
        "frameworks": body.frameworks or [],
        "message": body.message or "",
        "planId": body.planId or "",
        "source": body.source or "contact",
        "summary": body.summary or "",
        "marketing": bool(body.marketing),
        "createdAt": now,
    }
    await leads_col.insert_one(record)
    background_tasks.add_task(send_lead_notification, record)
    return {"ok": True, "id": lead_id}


# Admin Endpoints
@app.get("/api/admin/leads")
async def admin_list_leads(_auth=Header(None, alias="authorization")):
    verify_admin(_auth)
    cursor = leads_col.find({}, {"_id": 0}).sort("createdAt", -1)
    return await cursor.to_list(length=1000)


@app.get("/api/admin/plans")
async def admin_list_plans(_auth=Header(None, alias="authorization")):
    verify_admin(_auth)
    cursor = plans_col.find({}, {"_id": 0}).sort("createdAt", -1)
    docs = await cursor.to_list(length=1000)
    summaries = []
    for d in docs:
        p = d.get("plan", {})
        inp = p.get("input", {})
        summ = p.get("summary", {})
        done = d.get("done", [])
        summaries.append({
            "id": d.get("id"),
            "createdAt": d.get("createdAt"),
            "updatedAt": d.get("updatedAt"),
            "company": inp.get("company"),
            "frameworks": inp.get("frameworks"),
            "certificationDate": summ.get("certificationDate"),
            "done": len(done),
            "total": summ.get("taskCount", 0),
        })
    return summaries
