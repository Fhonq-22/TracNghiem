import { chuyenMotMa, chuyenHangLoat } from "../../Controllers/ChuyenMaController.js";

function log(msg) {
    $("#logBox").append(msg + "\n");
}

$(document).ready(() => {

    $("#btnChuyen1").click(async () => {
        const col = $("#collectionSelect").val();
        const oldKey = $("#oldKey").val().trim();
        const newKey = $("#newKey").val().trim();

        if (!oldKey || !newKey) return alert("nhập đúng mã!");

        log(`🔄 chuyển ${oldKey} → ${newKey}`);

        const res = await chuyenMotMa(col, oldKey, newKey);
        if (res.success) log("✔ xong!");
        else log("❌ " + res.message);
    });

    $("#btnChuyenNhieu").click(async () => {
        const col = $("#collectionSelect").val();
        const oldPat = $("#patternOld").val().trim();
        const newPat = $("#patternNew").val().trim();

        if (col === "User")
            return alert("Người dùng chỉ cho phép chuyển từng mã");

        if (!oldPat.includes("#") || !newPat.includes("#"))
            return alert("pattern phải có #");

        log(`🔧 chuyển toàn bộ theo pattern...`);

        const res = await chuyenHangLoat(col, oldPat, newPat);

        if (!res.success) return log("❌ " + res.message);

        res.changed.forEach(c => log(`→ ${c.from} → ${c.to}`));
        log("🎉 hoàn tất!");
    });

});