import { layBoDe } from "../../Controllers/BoDeController.js";
import { layCauHoi } from "../../Controllers/CauHoiController.js";
import { layCapDo } from "../../Controllers/CapDoController.js";
import { themKetQua } from "../../Controllers/KetQuaController.js";
import { yeuCauDangNhap } from "../../Utils/AUTH.js";

let boDemGio = null;
let soGiayConLai = 0;
let dapAnNguoiDung = {};
let thoiGianBatDau = null;

$(document).ready(async function () {
    if (!yeuCauDangNhap()) return;
    
    const thamSo = new URLSearchParams(window.location.search);
    const maBoDe = thamSo.get("maBoDe");
    if (!maBoDe) {
        alert("Không có bộ đề");
        return;
    }

    const boDe = await layBoDe(maBoDe);
    if (!boDe) {
        alert("Không tìm thấy bộ đề");
        return;
    }

    thoiGianBatDau = new Date();
    soGiayConLai = boDe.ThoiGian * 60;
    batDauDemGio();

    const khungCauHoi = $("#khungCauHoi");
    khungCauHoi.empty();

    for (let i = 0; i < boDe.DanhSachCauHoi.length; i++) {
        const maCauHoi = boDe.DanhSachCauHoi[i];
        const cauHoi = await layCauHoi(maCauHoi);
        if (!cauHoi) continue;

        const khoiCauHoi = $(`
            <div class="cau-hoi" data-ma="${maCauHoi}">
                <p><b>Câu ${i + 1}:</b> ${cauHoi.NoiDung}</p>
                ${cauHoi.PhuongAn.map((pa, idx) => `
                    <div>
                        <input type="radio" name="cau${i}" value="${idx}">
                        ${pa}
                    </div>
                `).join("")}
            </div>
        `);

        khungCauHoi.append(khoiCauHoi);
    }

    $("#btnNopBai").on("click", nopBai);
});

function batDauDemGio() {
    capNhatHienThiThoiGian();
    boDemGio = setInterval(() => {
        soGiayConLai--;
        if (soGiayConLai <= 0) {
            clearInterval(boDemGio);
            alert("Hết thời gian! Bài sẽ được nộp tự động.");
            nopBai();
        }
        capNhatHienThiThoiGian();
    }, 1000);
}

function capNhatHienThiThoiGian() {
    const phut = Math.floor(soGiayConLai / 60);
    const giay = soGiayConLai % 60;
    $("#thoiGianConLai").text(
        `${phut.toString().padStart(2, "0")}:${giay.toString().padStart(2, "0")}`
    );
}

async function nopBai() {
    $(".cau-hoi").each(function () {
        const maCauHoi = $(this).data("ma");
        const luaChon = $(this).find("input[type=radio]:checked").val();
        dapAnNguoiDung[maCauHoi] = luaChon !== undefined ? parseInt(luaChon) : null;
    });

    clearInterval(boDemGio);
    $("#btnNopBai").prop("disabled", true);

    const thoiGianNop = new Date();
    const dinhDangThoiGian = tg =>
        tg.toLocaleDateString("vi-VN") + " " + tg.toLocaleTimeString("vi-VN");

    const thamSo = new URLSearchParams(window.location.search);
    const maBoDe = thamSo.get("maBoDe");
    const boDe = await layBoDe(maBoDe);
    if (!boDe) return;

    const capDo = await layCapDo(boDe.CapDo);
    if (!capDo) {
        alert("Không tìm thấy cấp độ của bộ đề");
        return;
    }

    let tongDiem = 0;

    for (let maCauHoi of boDe.DanhSachCauHoi) {
        const cauHoi = await layCauHoi(maCauHoi);
        if (!cauHoi) continue;

        const dapAnChon = dapAnNguoiDung[maCauHoi];
        if (dapAnChon === null || dapAnChon === undefined) continue;

        if (dapAnChon === cauHoi.DapAnDung) {
            tongDiem += capDo.DiemMoiCau;
        }
    }

    const diem = Math.round(tongDiem * 100) / 100;
    const maKetQua = "KQ" + Date.now();

    const duLieuKetQua = {
        MaKetQua: maKetQua,
        MaDe: maBoDe,
        TenNguoiDung: localStorage.getItem("currentUser") || "Khách",
        ThoiGianBatDau: dinhDangThoiGian(thoiGianBatDau),
        ThoiGianNop: dinhDangThoiGian(thoiGianNop),
        Diem: diem
    };

    await themKetQua(duLieuKetQua);
    alert(`Bài đã nộp! Điểm của bạn: ${diem}`);
    window.location.href = `u-ketqua.html?maKetQua=${maKetQua}`;
}