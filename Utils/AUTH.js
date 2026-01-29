const AUTH_KEY = "P-auth";
const PROJECT = "Quizie";
const EXPIRE_TIME = (2 *60*60*1000) + (22 * 60*1000) + (22 * 1000);

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
    return Date.now() - auth.loginAt > EXPIRE_TIME;
}

export function isDangNhap() {
    const auth = getAuthRaw();
    if (!auth || auth.project !== PROJECT) return false;
    return Date.now() - auth.loginAt <= EXPIRE_TIME;
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
        alert("Bạn chưa đăng nhập");
        window.location.href = "./dang-nhap.html";
        return false;
    }

    if (isHetHanPhien()) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        removeAuth();
        window.location.href = "./dang-nhap.html";
        return false;
    }

    return true;
}

export function yeuCauAdmin() {
    if (!yeuCauDangNhap()) return false;

    if (!isAdmin()) {
        alert("Bạn không có quyền truy cập trang này");
        window.location.href = "./index.html";
        return false;
    }

    return true;
}

export function removeAuth() {
    localStorage.removeItem(AUTH_KEY);
}

export { PROJECT };