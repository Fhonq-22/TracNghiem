import { PROJECT, TERMS } from "../Config/PROJECT.config.js";
import { dongYDieuKhoan } from "../Utils/CONSENT.utils.js";
import { getUserHienTai } from "../Utils/AUTH.utils.js";

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