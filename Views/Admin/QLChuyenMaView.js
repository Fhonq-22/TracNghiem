import { chuyenMotMa, chuyenHangLoat } from "../../Controllers/ChuyenMaController.js";
import { BANG_THAM_CHIEU, kiemTraThamChieu, doiMaCoRangBuoc } from "../../Controllers/REFERENCE.js";
import { yeuCauAdmin } from "../../Utils/AUTH.utils.js";

const $logBox = $("#logBox");
const $btnChuyen1 = $("#btnChuyen1");
const $btnChuyenNhieu = $("#btnChuyenNhieu");

function log(msg) {
    $logBox.append(msg + "\n");
    $logBox.scrollTop($logBox[0].scrollHeight);
}

function coRangBuoc(collection) {
    return !!BANG_THAM_CHIEU[collection];
}

function hienThiRangBuoc(ds, maCu, maMoi) {
    let msg = `Mã ${maCu} đang được sử dụng tại:\n\n`;
    ds.forEach(i => msg += `- ${i.collection} (${i.ma}) → ${i.field}\n`);
    msg += `\nBạn có chắc chắn muốn chuyển sang ${maMoi} không?`;
    return confirm(msg);
}

$(document).ready(() => {
    if (!yeuCauAdmin()) return;

    $btnChuyen1.click(async () => {
        const col = $("#collectionSelect").val();
        const oldKey = $("#oldKey").val().trim();
        const newKey = $("#newKey").val().trim();

        if (!oldKey || !newKey) return alert("Nhập đúng mã!");

        $btnChuyen1.prop("disabled", true);
        log(`🔄 chuyển ${oldKey} → ${newKey}`);

        try {
            let res;

            if (coRangBuoc(col)) {
                const ds = await kiemTraThamChieu(col, oldKey);
                if (ds.length && !hienThiRangBuoc(ds, oldKey, newKey)) {
                    log("⛔ đã hủy chuyển mã");
                    return;
                }
                res = await doiMaCoRangBuoc(col, oldKey, newKey);
            } else {
                res = await chuyenMotMa(col, oldKey, newKey);
            }

            res.success ? log("✔ xong!") : log("❌ " + res.message);
        } finally {
            $btnChuyen1.prop("disabled", false);
        }
    });

    $btnChuyenNhieu.click(async () => {
        const col = $("#collectionSelect").val();
        const oldPat = $("#patternOld").val().trim();
        const newPat = $("#patternNew").val().trim();

        if (col === "User")
            return alert("Người dùng chỉ cho phép chuyển từng mã");

        if (coRangBuoc(col))
            return alert("Collection này có ràng buộc, không cho phép chuyển hàng loạt");

        if (!oldPat.includes("#") || !newPat.includes("#"))
            return alert("Pattern phải có #");

        $btnChuyenNhieu.prop("disabled", true);
        log("🔧 chuyển toàn bộ theo pattern...");

        try {
            const res = await chuyenHangLoat(col, oldPat, newPat);
            if (!res.success) return log("❌ " + res.message);

            const logs = res.changed.map(c => `→ ${c.from} → ${c.to}`).join("\n");
            log(logs);
            log("🎉 hoàn tất!");
        } finally {
            $btnChuyenNhieu.prop("disabled", false);
        }
    });
});