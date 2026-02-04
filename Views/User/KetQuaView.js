import { layKetQua } from "../../Controllers/KetQuaController.js";
import { yeuCauDangNhap } from "../../Utils/AUTH.utils.js";
import { yeuCauDongYDieuKhoan } from "../../Utils/DIEUKHOAN.utils.js";
import { HANHVI } from "../../Domain/HANHVI.domain.js";

function layLabelHanhVi(code) {
    return Object.values(HANHVI).find(h => h.CODE === code)?.LABEL ?? code;
}

function dinhDangThoiGian(iso) {
    const tg = new Date(iso);
    return tg.toLocaleDateString("vi-VN") + " " +
           tg.toLocaleTimeString("vi-VN");
}

async function hienThiKetQua(maKetQua) {
    const kq = await layKetQua(maKetQua);

    if (!kq) {
        $("#ketQuaContainer").html(
            `<p style="color:red">Không tìm thấy kết quả với mã: <b>${maKetQua}</b></p>`
        );
        return;
    }

    const hanhVi = kq.HanhViBatThuong ?? [];
    const htmlHanhVi = hanhVi.length
        ? `
            <ul>
                ${hanhVi.map(hv => `
                    <li>
                        <b>${layLabelHanhVi(hv.Code)}</b><br>
                        <small>${dinhDangThoiGian(hv.ThoiGian)}</small>
                    </li>
                `).join("")}
            </ul>
        `
        : `<p>Không ghi nhận hành vi bất thường</p>`;

    $("#ketQuaContainer").html(`
        <p>
            <b>Mã kết quả:</b>
            <span id="maKetQuaText">${maKetQua}</span>
            <button id="btnCopyMaKetQua">📋 Copy</button>
        </p>
        <p><b>Mã đề:</b> ${kq.MaDe}</p>
        <p><b>Tên người dùng:</b> ${kq.TenNguoiDung}</p>
        <p><b>Thời gian bắt đầu:</b> ${kq.ThoiGianBatDau}</p>
        <p><b>Thời gian nộp:</b> ${kq.ThoiGianNop}</p>
        <p><b>Điểm:</b> ${kq.Diem}</p>
        <hr>
        <h4>Hành vi trong quá trình làm bài</h4>
        ${htmlHanhVi}
    `);

    $("#btnCopyMaKetQua").on("click", async function () {
        try {
            await navigator.clipboard.writeText(maKetQua);
            alert("Đã copy mã kết quả!");
        } catch {
            const temp = $("<input>");
            $("body").append(temp);
            temp.val(maKetQua).select();
            document.execCommand("copy");
            temp.remove();
            alert("Đã copy mã kết quả!");
        }
    });
}

$(document).ready(async function () {
    if (!yeuCauDangNhap()) return;
    if (!yeuCauDongYDieuKhoan()) return;

    const maKetQuaURL = new URLSearchParams(window.location.search).get("maKetQua");
    if (maKetQuaURL) {
        $("#inputMaKetQua").val(maKetQuaURL);
        await hienThiKetQua(maKetQuaURL);
    }

    $("#btnTraCuu").on("click", async function () {
        const maKetQua = $("#inputMaKetQua").val().trim();
        if (!maKetQua) return;
        await hienThiKetQua(maKetQua);
    });

    $("#inputMaKetQua").on("keypress", function (e) {
        if (e.which === 13) {
            $("#btnTraCuu").click();
        }
    });
});