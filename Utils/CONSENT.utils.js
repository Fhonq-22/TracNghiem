const CONSENT_KEY = "P-consent";

export function daDongYDieuKhoan(username, project, version) {
    const consent = JSON.parse(localStorage.getItem(CONSENT_KEY) || "{}");
    return consent[username]?.[project]?.version === version;
}

export function dongYDieuKhoan(username, project, version) {
    const consent = JSON.parse(localStorage.getItem(CONSENT_KEY) || "{}");

    if (!consent[username]) consent[username] = {};

    consent[username][project] = {
        version,
        acceptedAt: Date.now()
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}