"""Command 8: Auth + Workspace + Grounded Copilot backend tests."""
import os
import uuid
import time
import json
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://dunxzo-preview.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


def _unique_email():
    return f"test_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture(scope="module")
def new_user():
    email = _unique_email()
    password = "pw123456"
    r = requests.post(f"{API}/auth/register", json={"name": "T User", "email": email, "password": password}, timeout=30)
    assert r.status_code == 201, r.text
    data = r.json()
    return {"email": email, "password": password, "token": data["token"], "user": data["user"]}


@pytest.fixture(scope="module")
def onboarded_user():
    email = _unique_email()
    password = "pw123456"
    r = requests.post(f"{API}/auth/register", json={"name": "Zephyr Owner", "email": email, "password": password}, timeout=30)
    assert r.status_code == 201
    token = r.json()["token"]
    r = requests.post(
        f"{API}/onboarding",
        json={"company": "Zephyr Labs", "frameworks": ["ISO/IEC 27001", "DPDPA"], "size": "11-50"},
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    assert r.status_code == 201, r.text
    return {"email": email, "token": token, "workspace": r.json()}


# ---- Auth ----
class TestAuth:
    def test_register_returns_token_and_user(self, new_user):
        assert new_user["token"]
        assert new_user["user"]["onboarded"] is False
        assert new_user["user"]["email"] == new_user["email"]

    def test_register_duplicate_returns_409(self, new_user):
        r = requests.post(
            f"{API}/auth/register",
            json={"name": "Dup", "email": new_user["email"], "password": "pw123456"},
            timeout=30,
        )
        assert r.status_code == 409

    def test_login_success(self, new_user):
        r = requests.post(f"{API}/auth/login", json={"email": new_user["email"], "password": new_user["password"]}, timeout=30)
        assert r.status_code == 200
        assert "token" in r.json()

    def test_login_wrong_password(self, new_user):
        r = requests.post(f"{API}/auth/login", json={"email": new_user["email"], "password": "wrongpass"}, timeout=30)
        assert r.status_code == 401

    def test_me_with_token(self, new_user):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {new_user['token']}"}, timeout=30)
        assert r.status_code == 200
        assert r.json()["user"]["email"] == new_user["email"]

    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 401


# ---- Workspace ----
class TestWorkspace:
    def test_workspace_before_onboarding_404(self, new_user):
        r = requests.get(f"{API}/workspace", headers={"Authorization": f"Bearer {new_user['token']}"}, timeout=30)
        assert r.status_code == 404

    def test_workspace_without_token_401(self):
        r = requests.get(f"{API}/workspace", timeout=30)
        assert r.status_code == 401

    def test_onboarding_seeds_only_chosen_frameworks(self, onboarded_user):
        ws = onboarded_user["workspace"]
        assert ws["profile"]["company"] == "Zephyr Labs"
        ctrl_ids = {c["id"] for c in ws["controls"]}
        # ISO + DPDPA controls expected
        assert "A.5.1" in ctrl_ids
        assert "DPDP-4" in ctrl_ids
        # SOC2-only control should NOT be present
        assert "CC6.1" not in ctrl_ids
        # AI-only should NOT be present
        assert "AI-4.2" not in ctrl_ids
        assert ws["pulse"]["total"] == len(ws["controls"])

    def test_get_workspace_matches_onboarding(self, onboarded_user):
        r = requests.get(f"{API}/workspace", headers={"Authorization": f"Bearer {onboarded_user['token']}"}, timeout=30)
        assert r.status_code == 200
        assert r.json()["profile"]["company"] == "Zephyr Labs"

    def test_review_control(self, onboarded_user):
        r = requests.patch(
            f"{API}/workspace/controls/DPDP-4/review",
            headers={"Authorization": f"Bearer {onboarded_user['token']}"},
            timeout=30,
        )
        assert r.status_code == 200
        data = r.json()
        dpdp4 = next(c for c in data["controls"] if c["id"] == "DPDP-4")
        assert dpdp4["status"] == "operational"
        # pulse should have at least this one operational
        assert data["pulse"]["operational"] >= 1

    def test_accept_risk(self, onboarded_user):
        r = requests.patch(
            f"{API}/workspace/risks/R-002/accept",
            headers={"Authorization": f"Bearer {onboarded_user['token']}"},
            timeout=30,
        )
        assert r.status_code == 200
        risk = next(x for x in r.json()["risks"] if x["id"] == "R-002")
        assert risk["status"] == "accepted"


# ---- Grounded Copilot ----
class TestCopilotGrounded:
    def _collect_stream(self, resp, max_secs=45):
        text = ""
        start = time.time()
        for line in resp.iter_lines(decode_unicode=True):
            if time.time() - start > max_secs:
                break
            if not line or not line.startswith("data: "):
                continue
            try:
                evt = json.loads(line[6:])
            except Exception:
                continue
            if "delta" in evt:
                text += evt["delta"]
            elif evt.get("done"):
                break
            elif "error" in evt:
                break
        return text

    def test_copilot_grounded_references_company(self, onboarded_user):
        sess = f"TEST_{uuid.uuid4().hex[:8]}"
        with requests.post(
            f"{API}/copilot/chat",
            json={"session_id": sess, "message": "What is my company name and which controls need attention? List control IDs."},
            headers={"Authorization": f"Bearer {onboarded_user['token']}"},
            stream=True,
            timeout=60,
        ) as resp:
            assert resp.status_code == 200
            reply = self._collect_stream(resp)
        assert "Zephyr" in reply, f"Reply did not reference company. Got: {reply[:400]}"

    def test_copilot_anonymous_still_works(self):
        sess = f"TEST_anon_{uuid.uuid4().hex[:8]}"
        with requests.post(
            f"{API}/copilot/chat",
            json={"session_id": sess, "message": "Give me a one-sentence summary of ISO/IEC 27001."},
            stream=True,
            timeout=60,
        ) as resp:
            assert resp.status_code == 200
            reply = self._collect_stream(resp)
        assert len(reply) > 10


# ---- Regression ----
class TestRegression:
    def test_health(self):
        r = requests.get(f"{API}/health", timeout=15)
        assert r.status_code == 200 and r.json().get("ok") is True

    def test_leads_create(self):
        r = requests.post(
            f"{API}/leads",
            json={"name": "TEST_regression", "email": "test_reg@example.com", "source": "contact"},
            timeout=30,
        )
        assert r.status_code == 201
        assert r.json().get("ok") is True

    def test_plans_preview(self):
        r = requests.post(
            f"{API}/plans/preview",
            json={"company": "TEST_Co", "employees": "11-50", "frameworks": ["ISO/IEC 27001"]},
            timeout=60,
        )
        assert r.status_code == 200
        assert "plan" in r.json()
