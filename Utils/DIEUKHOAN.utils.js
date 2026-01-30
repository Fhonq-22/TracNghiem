import { daDongYDieuKhoan } from "./CONSENT.utils.js";
import { PROJECT, TERMS } from "../Config/PROJECT.config.js";
import { THONGBAO } from "./Notice.utils.js";

export function yeuCauDongYDieuKhoan() {
    if (daDongYDieuKhoan(PROJECT, TERMS.VERSION)) return true;

    THONGBAO.CanDongYDieuKhoan();
    window.location.replace("s-dieukhoan.html");
    return false;
}