import { PROJECT, SESSION } from "../Config/PROJECT.config.js";
import { THONGBAO } from "./NOTICE.utils.js";

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
    return Date.now() < auth.loginAt || Date.now() - auth.loginAt > SESSION.EXPIRE_TIME;
}

export function isDangNhap() {
    const auth = getAuthRaw();
    if (!auth || auth.project !== PROJECT) return false;
    return Date.now() - auth.loginAt <= SESSION.EXPIRE_TIME;
}

export function getAuth() {
    return isDangNhap() ? getAuthRaw() : null;
}

export function getUserHienTai() {
    const auth = getAuth();
    return auth ? auth.user : null;
}

export function isAdmin() {
    const auth = getAuth();
    return auth && auth.user?.VaiTro === "Admin";
}

export function yeuCauDangNhap() {
    const auth = getAuthRaw();

    if (!auth) {
        THONGBAO.CanDangNhap();
        window.location.href = "./dang-nhap.html";
        return false;
    }

    if (isHetHanPhien()) {
        THONGBAO.HetHanPhien();
        removeAuth();
        window.location.href = "./dang-nhap.html";
        return false;
    }

    return true;
}

export function yeuCauAdmin() {
    if (!yeuCauDangNhap()) return false;

    if (!isAdmin()) {
        THONGBAO.KhongDuQuyen();
        window.location.href = "./index.html";
        return false;
    }

    return true;
}

export function removeAuth() {
    localStorage.removeItem(AUTH_KEY);
}