"""DU-NZO Backend Tests — Copilot SSE, history, regression on /health, /leads, /plans/preview."""
import json
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fall back to frontend/.env
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
    except Exception:
        pass

assert BASE_URL, "REACT_APP_BACKEND_URL not configured"


# ---------- Regression ----------
def test_health():
    r = requests.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200
    assert r.json() == {"ok": True}


def test_leads_create():
    payload = {
        "name": "TEST_User",
        "email": "test@example.com",
        "company": "TEST_Co",
        "frameworks": ["ISO 27001"],
        "source": "contact",
        "message": "automated test",
    }
    r = requests.post(f"{BASE_URL}/api/leads", json=payload, timeout=20)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data.get("ok") is True
    assert isinstance(data.get("id"), str) and len(data["id"]) > 0


def test_plans_preview():
    payload = {
        "company": "TEST_Co",
        "employees": "10-50",
        "maturity": "early",
        "hosting": "cloud",
        "sites": 1,
        "frameworks": ["ISO 27001"],
        "startDate": "2026-02-01",
        "targetDate": "2026-12-01",
    }
    r = requests.post(f"{BASE_URL}/api/plans/preview", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "plan" in data
    assert "phases" in data["plan"]


# ---------- Copilot SSE ----------
def _consume_sse(session_id, message, timeout=90):
    """POST to /api/copilot/chat and consume SSE lines. Returns (deltas_text, done_seen, error_seen)."""
    url = f"{BASE_URL}/api/copilot/chat"
    deltas = []
    done_seen = False
    error_seen = None
    with requests.post(url, json={"session_id": session_id, "message": message},
                       stream=True, timeout=timeout) as r:
        assert r.status_code == 200, f"status={r.status_code} body={r.text[:300]}"
        ctype = r.headers.get("content-type", "")
        assert "text/event-stream" in ctype, f"Expected SSE, got {ctype}"
        start = time.time()
        for raw in r.iter_lines(decode_unicode=True):
            if raw is None:
                continue
            if not raw:
                continue
            if raw.startswith("data: "):
                payload = raw[6:]
                try:
                    obj = json.loads(payload)
                except Exception:
                    continue
                if "delta" in obj:
                    deltas.append(obj["delta"])
                elif obj.get("done"):
                    done_seen = True
                    break
                elif "error" in obj:
                    error_seen = obj["error"]
            if time.time() - start > timeout:
                break
    return "".join(deltas), done_seen, error_seen


def test_copilot_chat_stream():
    sid = f"TEST_{uuid.uuid4().hex[:10]}"
    text, done, err = _consume_sse(sid, "In one sentence, what is ISO 27001?")
    assert err is None, f"Copilot error: {err}"
    assert done, "No done event received"
    assert len(text) > 20, f"Response too short: {text!r}"
    assert any(k in text.lower() for k in ["iso", "27001", "security", "information"]), \
        f"Response doesn't look compliance-related: {text!r}"


def test_copilot_multiturn_statefulness():
    sid = f"TEST_{uuid.uuid4().hex[:10]}"
    text1, done1, err1 = _consume_sse(sid, "My company is called Zephyr. Please remember that.")
    assert err1 is None and done1
    assert len(text1) > 0

    text2, done2, err2 = _consume_sse(sid, "What is my company name? Reply with just the name.")
    assert err2 is None and done2
    assert "zephyr" in text2.lower(), f"Expected 'Zephyr' in reply, got: {text2!r}"


def test_copilot_history():
    sid = f"TEST_{uuid.uuid4().hex[:10]}"
    _consume_sse(sid, "Hello Copilot, I'm testing you.")
    r = requests.get(f"{BASE_URL}/api/copilot/history/{sid}", timeout=15)
    assert r.status_code == 200
    msgs = r.json()
    assert isinstance(msgs, list)
    assert len(msgs) >= 2, f"Expected >=2 messages, got {len(msgs)}"
    roles = [m["role"] for m in msgs]
    assert roles[0] == "user"
    assert "assistant" in roles
    # verify order: user first, then assistant
    assert msgs[0]["content"].startswith("Hello Copilot")
