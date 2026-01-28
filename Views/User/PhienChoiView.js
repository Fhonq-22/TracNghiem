import { themPhienChoi, layPhienChoi, suaPhienChoi } from "../../Controllers/PhienChoiController.js";
import { layDanhSachBoDeDayDu } from "../../Controllers/BoDeController.js";

let phienChoi = null;
let maPhienChoi = null;
let mapBoDe = {};

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    maPhienChoi = urlParams.get("maPhienChoi");

    if (maPhienChoi) {
        vaoPhien(maPhienChoi);
    }

    $("#btnTaoDanhSach").click(taoDanhSachNhapTen);
    $("#btnTaoPhien").click(taoPhienChoi);
    $("#btnVaoPhien").click(() => {
        const ma = $("#maPhienNhap").val().trim();
        if (ma) vaoPhien(ma);
    });

    $("#btnChonChuDe").click(chonChuDe);
    $("#btnNext").click(nextLuot);
});

function taoDanhSachNhapTen() {
    const soNguoi = parseInt($("#soNguoiChoi").val());
    const container = $("#dsNhapTen");
    container.empty();

    if (!soNguoi || soNguoi < 1) return;

    for (let i = 1; i <= soNguoi; i++) {
        container.append(`
            <div>
                <label>Người chơi ${i}:</label>
                <input type="text" class="tenNguoiChoi">
            </div>
        `);
    }
}

async function taoPhienChoi() {
    const soVong = parseInt($("#soVong").val());
    if (soVong < 1 || soVong > 4) return;

    const dsNguoiChoi = {};
    $(".tenNguoiChoi").each(function () {
        const ten = $(this).val().trim();
        if (ten) dsNguoiChoi[ten] = 0;
    });

    const tenNguoi = Object.keys(dsNguoiChoi);
    if (tenNguoi.length === 0) return;

    const maPhien = "PC" + Date.now();
    const now = new Date();
    const ngayTao = now.toLocaleDateString("vi-VN") + " " + now.toLocaleTimeString("vi-VN");

    const data = {
        MaPhienChoi: maPhien,
        DanhSachNguoiChoi: dsNguoiChoi,
        SoVong: soVong,
        VongHienTai: 1,
        NguoiChoiHienTai: tenNguoi[0],
        ChuDeHienTai: "",
        NguoiTao: localStorage.getItem("currentUser") || "Admin",
        NgayTao: ngayTao
    };

    await themPhienChoi(data);
    window.location.href = `u-phienchoi.html?maPhienChoi=${maPhien}`;
}

async function loadDanhSachBoDe() {
    if (Object.keys(mapBoDe).length > 0) return;

    const select = $("#selectChuDe");
    select.empty();
    select.append(`<option value="">-- chọn chủ đề --</option>`);

    const dsBoDe = await layDanhSachBoDeDayDu();
    mapBoDe = {};

    dsBoDe.forEach(bd => {
        mapBoDe[bd.MaBoDe] = bd.TenBoDe;
        select.append(
            `<option value="${bd.MaBoDe}">${bd.TenBoDe}</option>`
        );
    });

    $("#btnChonChuDe").prop("disabled", false);
}

async function vaoPhien(ma) {
    phienChoi = await layPhienChoi(ma);
    if (!phienChoi) return;

    maPhienChoi = ma;
    $("#chonPhienSection").hide();
    $("#dieuKhienSection").show();

    await loadDanhSachBoDe();
    render();
}

function render() {
    $("#vongHienTai").text(phienChoi.VongHienTai);
    $("#soVongHienThi").text(phienChoi.SoVong);
    $("#nguoiChoiHienTai").text(phienChoi.NguoiChoiHienTai);
    $("#chuDeHienTai").text(phienChoi.ChuDeHienTai ? mapBoDe[phienChoi.ChuDeHienTai] : "(chưa chọn)");

    const ul = $("#dsNguoiChoi");
    ul.empty();
    Object.entries(phienChoi.DanhSachNguoiChoi).forEach(([ten, diem]) => {
        ul.append(`<li>${ten}: ${diem} điểm</li>`);
    });
}

async function chonChuDe() {
    const chuDe = $("#selectChuDe").val();
    if (!chuDe) return;

    phienChoi.ChuDeHienTai = chuDe;
    await suaPhienChoi(maPhienChoi, phienChoi);

    $("#selectChuDe").prop("disabled", true);
    $("#btnChonChuDe").prop("disabled", true);
    render();
}

async function nextLuot() {
    $("#selectChuDe").prop("disabled", false);
    $("#btnChonChuDe").prop("disabled", false);

    const dsTen = Object.keys(phienChoi.DanhSachNguoiChoi);
    let idx = dsTen.indexOf(phienChoi.NguoiChoiHienTai);

    if (idx === -1 || idx === dsTen.length - 1) {
        phienChoi.VongHienTai++;
        idx = 0;
    } else {
        idx++;
    }

    if (phienChoi.VongHienTai > phienChoi.SoVong) return;

    phienChoi.NguoiChoiHienTai = dsTen[idx];
    phienChoi.ChuDeHienTai = "";

    await suaPhienChoi(maPhienChoi, phienChoi);
    render();
}