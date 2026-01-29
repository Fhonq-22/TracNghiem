const AUTH_KEY = "P-auth";
const PROJECT = "Quizie";

export function setAuth(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
        project: PROJECT,
        user: {
            TenNguoiDung: user.TenNguoiDung,
            VaiTro: user.VaiTro
        },
        loginAt: new Date().toISOString()
    }));
}

export function getAuth() {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function getUserHienTai() {
    const auth = getAuth();
    return auth && auth.project === PROJECT ? auth.user : null;
}

export function isDangNhap() {
    const auth = getAuth();
    return !!auth && auth.project === PROJECT;
}

export function isAdmin() {
    const auth = getAuth();
    return auth &&
           auth.project === PROJECT &&
           auth.user &&
           auth.user.VaiTro === "Admin";
}

export function isDungProject() {
    const auth = getAuth();
    return auth && auth.project === PROJECT;
}

export function removeAuth() {
    localStorage.removeItem(AUTH_KEY);
}

export { PROJECT };