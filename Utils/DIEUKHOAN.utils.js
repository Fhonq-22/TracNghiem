import { daDongYDieuKhoan } from "./CONSENT.utils.js";
import { PROJECT, TERMS } from "../Config/PROJECT.config.js";
import { THONGBAO } from "./NOTICE.utils.js";
import { getUserHienTai } from "./AUTH.utils.js";

export function yeuCauDongYDieuKhoan() {
    const user = getUserHienTai();
    if (!user) return false;

    if (daDongYDieuKhoan(user.TenNguoiDung, PROJECT, TERMS.VERSION)) return true;

    THONGBAO.CanDongYDieuKhoan();
    window.location.replace("s-dieukhoan.html");
    return false;
}