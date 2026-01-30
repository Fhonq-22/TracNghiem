import { PROJECT, SESSION } from "../Config/PROJECT.config.js";

const AUTH_KEY = "P-auth";

export function setAuth(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
        project: PROJECT,
        user: {
            TenNguoiDung: String(user.TenNguoiDung),
            VaiTro: user.VaiTro
        },
        loginAt: Date.now()
    }));
}

export function getAuthRaw() {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function isHetHanPhien() {
    const auth = getAuthRaw();
    if (!auth || auth.project !== PROJECT) return false;
    return Date.now() - auth.loginAt > SESSION.EXPIRE_TIME;
}

export function isDangNhap() {
    const auth = getAuthRaw();
    if (!auth || auth.project !== PROJECT) return false;
    return Date.now() - auth.loginAt <= SESSION.EXPIRE_TIME;
}

export function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
}