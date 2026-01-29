import { chuyenMotMa, chuyenHangLoat } from "../../Controllers/ChuyenMaController.js";
import { BANG_THAM_CHIEU, kiemTraThamChieu, doiMaCoRangBuoc } from "../../Controllers/REFERENCE.js";
import { yeuCauAdmin } from "../../Utils/AUTH.js";

function log(msg) {
    $("#logBox").append(msg + "\n");
}

function coRangBuoc(collection) {
    return !!BANG_THAM_CHIEU[collection];
}

function hienThiRangBuoc(ds, maCu, maMoi) {
    let msg = `Mã ${maCu} đang được sử dụng tại:\n\n`;

    ds.forEach(item => {
        msg += `- ${item.collection} (${item.ma}) → ${item.field}\n`;
    });

    msg += `\nBạn có chắc chắn muốn chuyển sang ${maMoi} không?`;
    return confirm(msg);
}

$(document).ready(() => {
    if (!yeuCauAdmin()) return;

    $("#btnChuyen1").click(async () => {
        const col = $("#collectionSelect").val();
        const oldKey = $("#oldKey").val().trim();
        const newKey = $("#newKey").val().trim();

        if (!oldKey || !newKey) return alert("nhập đúng mã!");

        log(`🔄 chuyển ${oldKey} → ${newKey}`);

        let res;

        if (coRangBuoc(col)) {
            const dsLienQuan = await kiemTraThamChieu(col, oldKey);

            if (dsLienQuan.length > 0) {
                const ok = hienThiRangBuoc(dsLienQuan, oldKey, newKey);
                if (!ok) {
                    log("⛔ đã hủy chuyển mã");
                    return;
                }
            }

            res = await doiMaCoRangBuoc(col, oldKey, newKey);
        } else {
            res = await chuyenMotMa(col, oldKey, newKey);
        }

        if (res.success) log("✔ xong!");
        else log("❌ " + res.message);
    });

    $("#btnChuyenNhieu").click(async () => {
        const col = $("#collectionSelect").val();
        const oldPat = $("#patternOld").val().trim();
        const newPat = $("#patternNew").val().trim();

        if (col === "User")
            return alert("Người dùng chỉ cho phép chuyển từng mã");

        if (coRangBuoc(col))
            return alert("Collection này có ràng buộc, không cho phép chuyển hàng loạt");

        if (!oldPat.includes("#") || !newPat.includes("#"))
            return alert("pattern phải có #");

        log(`🔧 chuyển toàn bộ theo pattern...`);

        const res = await chuyenHangLoat(col, oldPat, newPat);

        if (!res.success) return log("❌ " + res.message);

        res.changed.forEach(c => log(`→ ${c.from} → ${c.to}`));
        log("🎉 hoàn tất!");
    });

});