import { themPhienChoi, layPhienChoi, suaPhienChoi } from "../../Controllers/PhienChoiController.js";
import { layDanhSachBoDeDayDu, layBoDe } from "../../Controllers/BoDeController.js";
import { layCauHoi } from "../../Controllers/CauHoiController.js";
import { layCapDo } from "../../Controllers/CapDoController.js";
import { yeuCauDangNhap, getUserHienTai } from "../../Utils/AUTH.utils.js";
import { yeuCauDongYDieuKhoan } from "../../Utils/DIEUKHOAN.utils.js";

let phienChoi = null;
let maPhienChoi = null;
let mapBoDe = {};

let boDeDangChoi = null;
let capDoDangChoi = null;
let dsCauHoi = [];
let cauHoiIndex = 0;

let daTraLoiChinh = false;
let dangTraLoiPhu = false;

$(document).ready(function () {
    if (!yeuCauDangNhap()) return;
    if (!yeuCauDongYDieuKhoan()) return;

    maPhienChoi = new URLSearchParams(window.location.search).get("maPhienChoi");
    if (maPhienChoi) vaoPhien(maPhienChoi);

    $("#btnTaoDanhSach").click(taoDanhSachNhapTen);
    $("#btnTaoPhien").click(taoPhienChoi);
    $("#btnVaoPhien").click(() => {
        const ma = $("#maPhienNhap").val().trim();
        if (ma) vaoPhien(ma);
    });

    $("#btnChonChuDe").click(chonChuDe);
    $("#btnTraLoi").click(traLoiCauHoi);
    $("#btnNext").click(nextLuot);
    $("#btnNextCauHoi").click(sangCauHoi);
    $("#btnGiaiThich").click(hienGiaiThich);
});

function taoDanhSachNhapTen() {
    const soNguoi = parseInt($("#soNguoiChoi").val());
    const container = $("#dsNhapTen").empty();
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

    await themPhienChoi({
        MaPhienChoi: maPhien,
        DanhSachNguoiChoi: dsNguoiChoi,
        SoVong: soVong,
        VongHienTai: 1,
        NguoiChoiHienTai: tenNguoi[0],
        ChuDeHienTai: "",
        DaKetThuc: false,
        NguoiTao: getUserHienTai()?.TenNguoiDung || "",
        NgayTao: now.toLocaleDateString("vi-VN") + " " + now.toLocaleTimeString("vi-VN")
    });

    window.location.href = `u-phienchoi.html?maPhienChoi=${maPhien}`;
}

async function loadDanhSachBoDe() {
    if (Object.keys(mapBoDe).length) return;
    const select = $("#selectChuDe").empty().append(`<option value="">-- chọn chủ đề --</option>`);
    const dsBoDe = await layDanhSachBoDeDayDu();
    dsBoDe.forEach(bd => {
        mapBoDe[bd.MaBoDe] = bd.TenBoDe;
        select.append(`<option value="${bd.MaBoDe}">${bd.TenBoDe}</option>`);
    });
}

async function vaoPhien(ma) {
    phienChoi = await layPhienChoi(ma);
    if (!phienChoi) return;

    maPhienChoi = ma;
    $("#chonPhienSection").hide();
    $("#dieuKhienSection").show();

    await loadDanhSachBoDe();

    if (phienChoi.DaKetThuc) {
        $("#selectChuDe, #btnChonChuDe, #btnTraLoi, #btnNext, #btnNextCauHoi").prop("disabled", true);
        $("#lamCauHoiSection").hide();
        alert("Phiên chơi đã kết thúc");
        render();
        return;
    }

    $("#btnNext").prop("disabled", true);
    $("#selectChuDe, #btnChonChuDe").prop("disabled", false);
    $("#lamCauHoiSection").hide();
    render();
}

function render() {
    $("#vongHienTai").text(phienChoi.VongHienTai);
    $("#soVongHienThi").text(phienChoi.SoVong);
    $("#nguoiChoiHienTai").text(phienChoi.NguoiChoiHienTai);
    $("#chuDeHienTai").text(phienChoi.ChuDeHienTai ? mapBoDe[phienChoi.ChuDeHienTai] : "(chưa chọn)");

    const ul = $("#dsNguoiChoi").empty();
    Object.entries(phienChoi.DanhSachNguoiChoi).forEach(([ten, diem]) => {
        ul.append(`<li>${ten}: ${diem} điểm</li>`);
    });
}

async function chonChuDe() {
    if (phienChoi.DaKetThuc) return;

    const chuDe = $("#selectChuDe").val();
    if (!chuDe) return;

    phienChoi.ChuDeHienTai = chuDe;
    await suaPhienChoi(maPhienChoi, phienChoi);

    $("#selectChuDe, #btnChonChuDe").prop("disabled", true);

    boDeDangChoi = await layBoDe(chuDe);
    capDoDangChoi = await layCapDo(boDeDangChoi.CapDo);

    dsCauHoi = await Promise.all(
        boDeDangChoi.DanhSachCauHoi.map(ma => layCauHoi(ma))
    );

    cauHoiIndex = 0;
    hienCauHoi();
}

function hienCauHoi() {
    const ch = dsCauHoi[cauHoiIndex];
    if (!ch || phienChoi.DaKetThuc) return;

    daTraLoiChinh = false;
    dangTraLoiPhu = false;

    $("#btnTraLoi").prop("disabled", false);
    $("#btnNextCauHoi").prop("disabled", true);
    $("#ketQuaTraLoi").text("");
    $("#traLoiPhuSection").hide();
    $("#btnGiaiThich").hide();
    $("#giaiThichBox").hide().text("");

    $("#tieuDeCauHoi").text(`Câu ${cauHoiIndex + 1} / ${dsCauHoi.length}`);
    $("#noiDungCauHoi").html(`<p>${ch.NoiDung}</p>`);

    const pa = $("#dsPhuongAn").empty();
    ch.PhuongAn.forEach((p, i) => {
        pa.append(`
            <div>
                <input type="radio" name="pa" value="${i}">
                ${p}
            </div>
        `);
    });

    $("#lamCauHoiSection").show();
}

function traLoiCauHoi() {
    if (phienChoi.DaKetThuc) return;

    const ch = dsCauHoi[cauHoiIndex];
    const ans = $("input[name=pa]:checked");
    if (!ans.length) return;

    const value = parseInt(ans.val());
    const diemMoiCau = capDoDangChoi.DiemMoiCau;
    const heSoPhu = capDoDangChoi.HeSoTraLoiPhu;

    if (!daTraLoiChinh) {
        daTraLoiChinh = true;

        if (value === ch.DapAnDung) {
            phienChoi.DanhSachNguoiChoi[phienChoi.NguoiChoiHienTai] += diemMoiCau;
            $("#ketQuaTraLoi").text(`Đúng (+${diemMoiCau} điểm)`);
            $("#btnNextCauHoi").prop("disabled", false);
            $("#btnTraLoi").prop("disabled", true);
            $("#btnGiaiThich").show();
            render();
        } else {
            ans.prop("checked", false).prop("disabled", true);
            $("#ketQuaTraLoi").text("Sai – người khác được trả lời");
            $("#btnNextCauHoi").prop("disabled", false);
            $("#btnGiaiThich").show();
            hienTraLoiPhu();
        }
        return;
    }

    if (dangTraLoiPhu) {
        const nguoi = $("#selectNguoiTraLoiPhu").val();
        if (!nguoi) return;

        const diemPhu = Math.round(diemMoiCau * heSoPhu * 100) / 100;

        if (value === ch.DapAnDung) {
            phienChoi.DanhSachNguoiChoi[nguoi] += diemPhu;
            $("#ketQuaTraLoi").text(`${nguoi} trả lời đúng (+${diemPhu} điểm)`);
        } else {
            phienChoi.DanhSachNguoiChoi[nguoi] -= diemPhu;
            $("#ketQuaTraLoi").text(`${nguoi} trả lời sai (-${diemPhu} điểm)`);
        }

        $("#btnTraLoi").prop("disabled", true);
        $("#btnNextCauHoi").prop("disabled", false);
        $("#btnGiaiThich").show();
        render();
    }
}

function hienTraLoiPhu() {
    dangTraLoiPhu = true;
    const select = $("#selectNguoiTraLoiPhu").empty();
    Object.keys(phienChoi.DanhSachNguoiChoi)
        .filter(t => t !== phienChoi.NguoiChoiHienTai)
        .forEach(t => select.append(`<option value="${t}">${t}</option>`));
    $("#traLoiPhuSection").show();
}

function hienGiaiThich() {
    const ch = dsCauHoi[cauHoiIndex];
    if (!ch) return;

    const text = ch.GiaiThich && ch.GiaiThich.trim()
        ? ch.GiaiThich
        : "Không có lời giải thích cho câu hỏi này.";

    $("#giaiThichBox").text(text).show();
}

function sangCauHoi() {
    cauHoiIndex++;
    if (cauHoiIndex >= dsCauHoi.length) {
        ketThucLuot();
        return;
    }
    hienCauHoi();
}

async function ketThucLuot() {
    $("#lamCauHoiSection").hide();
    await suaPhienChoi(maPhienChoi, phienChoi);
    $("#btnNext").prop("disabled", false);
    render();
}

async function nextLuot() {
    if (phienChoi.DaKetThuc) return;

    const dsTen = Object.keys(phienChoi.DanhSachNguoiChoi);
    const idxHienTai = dsTen.indexOf(phienChoi.NguoiChoiHienTai);

    let nextIdx = idxHienTai + 1;
    let nextVong = phienChoi.VongHienTai;

    if (nextIdx >= dsTen.length) {
        nextIdx = 0;
        nextVong++;
    }

    if (nextVong > phienChoi.SoVong) {
        phienChoi.DaKetThuc = true;
        await suaPhienChoi(maPhienChoi, phienChoi);
        $("#selectChuDe, #btnChonChuDe, #btnNext").prop("disabled", true);
        alert("Phiên chơi đã kết thúc");
        return;
    }

    phienChoi.VongHienTai = nextVong;
    phienChoi.NguoiChoiHienTai = dsTen[nextIdx];
    phienChoi.ChuDeHienTai = "";

    $("#btnNext").prop("disabled", true);
    $("#selectChuDe, #btnChonChuDe").prop("disabled", false);

    await suaPhienChoi(maPhienChoi, phienChoi);
    render();
}