"""Templates used to seed a new workspace's controls and risks, filtered by the
frameworks a user selects during onboarding. Mirrors the frontend mock data so
the experience is identical once data is real."""

CONTROL_TEMPLATES = [
    {"id": "A.5.1", "title": "Information security policy", "domain": "Governance", "frameworks": ["ISO/IEC 27001", "SOC 2"], "owner": "AS", "status": "operational", "automation": "Manual"},
    {"id": "A.5.15", "title": "Access control", "domain": "Access & Identity", "frameworks": ["ISO/IEC 27001", "SOC 2"], "owner": "PK", "status": "operational", "automation": "Automated"},
    {"id": "A.5.16", "title": "Identity management", "domain": "Access & Identity", "frameworks": ["ISO/IEC 27001"], "owner": "PK", "status": "attention", "automation": "Semi-automated"},
    {"id": "A.5.17", "title": "Authentication information", "domain": "Access & Identity", "frameworks": ["ISO/IEC 27001", "SOC 2"], "owner": "RK", "status": "operational", "automation": "Automated"},
    {"id": "A.8.9", "title": "Configuration management", "domain": "Engineering", "frameworks": ["ISO/IEC 27001", "SOC 2"], "owner": "MT", "status": "attention", "automation": "Semi-automated"},
    {"id": "A.8.16", "title": "Monitoring activities", "domain": "Engineering", "frameworks": ["ISO/IEC 27001", "SOC 2"], "owner": "MT", "status": "operational", "automation": "Automated"},
    {"id": "CC6.1", "title": "Logical access security", "domain": "Access & Identity", "frameworks": ["SOC 2"], "owner": "PK", "status": "operational", "automation": "Automated"},
    {"id": "CC6.6", "title": "Boundary protection", "domain": "Engineering", "frameworks": ["SOC 2"], "owner": "RK", "status": "missing", "automation": "Manual"},
    {"id": "CC7.2", "title": "System monitoring & detection", "domain": "Engineering", "frameworks": ["SOC 2"], "owner": "MT", "status": "attention", "automation": "Semi-automated"},
    {"id": "CC8.1", "title": "Change management", "domain": "Engineering", "frameworks": ["SOC 2"], "owner": "RK", "status": "operational", "automation": "Automated"},
    {"id": "DPDP-1", "title": "Consent management", "domain": "Privacy", "frameworks": ["DPDPA"], "owner": "AS", "status": "attention", "automation": "Manual"},
    {"id": "DPDP-4", "title": "Grievance redressal", "domain": "Privacy", "frameworks": ["DPDPA"], "owner": "AS", "status": "missing", "automation": "Manual"},
    {"id": "DPDP-7", "title": "Data breach notification", "domain": "Privacy", "frameworks": ["DPDPA", "ISO/IEC 27001"], "owner": "PK", "status": "draft", "automation": "Manual"},
    {"id": "AI-4.2", "title": "AI risk management process", "domain": "AI Governance", "frameworks": ["ISO/IEC 42001"], "owner": "MT", "status": "draft", "automation": "Manual"},
    {"id": "AI-6.1", "title": "AI system documentation", "domain": "AI Governance", "frameworks": ["ISO/IEC 42001"], "owner": "MT", "status": "missing", "automation": "Manual"},
    {"id": "A.5.24", "title": "Incident response planning", "domain": "Resilience", "frameworks": ["ISO/IEC 27001", "SOC 2"], "owner": "PK", "status": "operational", "automation": "Manual"},
    {"id": "A.5.30", "title": "ICT readiness for business continuity", "domain": "Resilience", "frameworks": ["ISO/IEC 27001"], "owner": "RK", "status": "attention", "automation": "Semi-automated"},
    {"id": "CC9.2", "title": "Vendor risk management", "domain": "Third parties", "frameworks": ["SOC 2"], "owner": "AS", "status": "operational", "automation": "Semi-automated"},
]

RISK_TEMPLATES = [
    {"id": "R-001", "title": "Unauthorized access to production systems", "category": "Security", "owner": "PK", "likelihood": 3, "impact": 5, "status": "mitigating", "controls": ["A.5.15", "CC6.1"]},
    {"id": "R-002", "title": "Personal data breach triggers DPDP penalties", "category": "Privacy", "owner": "AS", "likelihood": 2, "impact": 5, "status": "mitigating", "controls": ["DPDP-1", "DPDP-7"]},
    {"id": "R-003", "title": "Vendor compromise exposes customer data", "category": "Third-party", "owner": "AS", "likelihood": 3, "impact": 4, "status": "open", "controls": ["CC9.2"]},
    {"id": "R-004", "title": "Backup restore failure during an incident", "category": "Resilience", "owner": "RK", "likelihood": 2, "impact": 4, "status": "mitigating", "controls": ["A.5.30"]},
    {"id": "R-005", "title": "Unreviewed code reaches production", "category": "Operational", "owner": "RK", "likelihood": 3, "impact": 3, "status": "closed", "controls": ["CC8.1"]},
    {"id": "R-006", "title": "Undetected intrusion through logging gaps", "category": "Security", "owner": "MT", "likelihood": 2, "impact": 5, "status": "mitigating", "controls": ["A.8.16", "CC7.2"]},
    {"id": "R-007", "title": "AI model makes unsound decisions in production", "category": "AI", "owner": "MT", "likelihood": 3, "impact": 3, "status": "open", "controls": ["AI-4.2", "AI-6.1"]},
    {"id": "R-008", "title": "Late breach notification to the Data Protection Board", "category": "Compliance", "owner": "AS", "likelihood": 1, "impact": 4, "status": "open", "controls": ["DPDP-7"]},
    {"id": "R-009", "title": "Key-person dependency on infrastructure knowledge", "category": "Operational", "owner": "RK", "likelihood": 3, "impact": 2, "status": "accepted", "controls": []},
    {"id": "R-010", "title": "Certificate expiry gaps at critical vendors", "category": "Third-party", "owner": "AS", "likelihood": 4, "impact": 3, "status": "open", "controls": ["CC9.2"]},
]

# Frameworks always seeded even if only partially selected (cross-mapped controls stay useful).
ALL_FRAMEWORKS = ["ISO/IEC 27001", "SOC 2", "DPDPA", "ISO/IEC 42001"]


def seed_controls(frameworks: list) -> list:
    chosen = set(frameworks) or set(ALL_FRAMEWORKS)
    return [dict(c) for c in CONTROL_TEMPLATES if chosen.intersection(c["frameworks"])]


def seed_risks(control_ids: set) -> list:
    out = []
    for r in RISK_TEMPLATES:
        # keep a risk if it is unmapped or maps to at least one seeded control
        if not r["controls"] or control_ids.intersection(r["controls"]):
            out.append(dict(r))
    return out


def compute_pulse(controls: list) -> dict:
    total = len(controls) or 1
    operational = sum(1 for c in controls if c["status"] == "operational")
    attention = sum(1 for c in controls if c["status"] == "attention")
    missing = sum(1 for c in controls if c["status"] == "missing")
    draft = sum(1 for c in controls if c["status"] == "draft")
    score = round((operational * 100 + attention * 55 + draft * 35) / total)
    return {
        "score": max(0, min(100, score)),
        "operational": operational,
        "attention": attention,
        "missing": missing,
        "draft": draft,
        "total": len(controls),
    }
