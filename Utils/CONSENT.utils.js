const CONSENT_KEY = "P-consent";

export function daDongYDieuKhoan(project, version) {
    const consent = JSON.parse(localStorage.getItem(CONSENT_KEY) || "{}");
    return consent[project]?.version === version;
}

export function dongYDieuKhoan(project, version) {
    const consent = JSON.parse(localStorage.getItem(CONSENT_KEY) || "{}");

    consent[project] = {
        version,
        acceptedAt: Date.now()
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}