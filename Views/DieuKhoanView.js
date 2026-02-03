import { PROJECT, TERMS, SESSION } from "../Config/PROJECT.config.js";
import { dongYDieuKhoan } from "../Utils/CONSENT.utils.js";
import { getUserHienTai } from "../Utils/AUTH.utils.js";

function formatExpireTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} giờ ${minutes} phút ${seconds} giây`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("projectName").innerText = PROJECT;
    document.getElementById("sessionExpire").textContent =formatExpireTime(SESSION.EXPIRE_TIME);
    document.getElementById("termsVersion").textContent = TERMS.VERSION;
    document.getElementById("termsUpdatedAt").textContent = TERMS.UPDATED_AT;
});

document.getElementById("btnAccept").addEventListener("click", () => {
    const chk = document.getElementById("chkAccept");
    if (!chk.checked) {
        alert("Bạn cần đồng ý với điều khoản để tiếp tục.");
        return;
    }

    const user = getUserHienTai();
    if (!user) return;

    dongYDieuKhoan(user.TenNguoiDung, PROJECT, TERMS.VERSION);
    window.history.back();
});