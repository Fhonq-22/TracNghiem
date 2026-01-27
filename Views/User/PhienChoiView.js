import { themPhienChoi, layPhienChoi, suaPhienChoi } from "../../Controllers/PhienChoiController.js";
import { layBoDeTheoChuDe } from "../../Controllers/BoDeController.js";
import { layCauHoi } from "../../Controllers/CauHoiController.js";

let phienChoi = null;
let maPhienChoi = null;
let boDe = null;
let timerInterval = null;
let timeLeft = 0;
let userAnswers = {};

$(document).ready(function () {

    $("#soNguoi").on("change", function () {
        const n = parseInt($(this).val());
        const box = $("#dsTen");
        box.empty();
        for (let i = 0; i < n; i++) {
            box.append(`<input class="tenNguoi" placeholder="Tên người ${i + 1}">`);
        }
    });

    $("#btnTaoPhien").click(async function () {
        const soVong = parseInt($("#soVong").val());
        const tenNguoi = $(".tenNguoi").map((i, e) => $(e).val()).get();

        if (tenNguoi.some(t => !t)) return;

        maPhienChoi = "PC" + Date.now();
        const danhSach = {};
        tenNguoi.forEach(t => danhSach[t] = 0);

        phienChoi = {
            MaPhienChoi: maPhienChoi,
            DanhSachNguoiChoi: danhSach,
            SoVong: soVong,
            VongHienTai: 1,
            NguoiChoiHienTai: tenNguoi[0],
            ChuDeHienTai: "",
            NguoiTao: "User",
            NgayTao: new Date().toLocaleString("vi-VN")
        };

        await themPhienChoi(phienChoi);
        hienPhien();
    });

    $("#btnVaoPhien").click(async function () {
        maPhienChoi = $("#maPhienInput").val();
        phienChoi = await layPhienChoi(maPhienChoi);
        if (!phienChoi) return;
        hienPhien();
    });

    $("#btnXacNhanChuDe").click(async function () {
        const chuDe = $("#selectChuDe").val();
        if (!chuDe) return;

        phienChoi.ChuDeHienTai = chuDe;
        await suaPhienChoi(maPhienChoi, phienChoi);

        boDe = await layBoDeTheoChuDe(chuDe);
        batDauLamBai();
    });

    $("#btnSubmit").click(nopBai);
});

function hienPhien() {
    $("#taoPhien, #vaoPhien").hide();
    $("#phienContainer").show();
    $("#thongTinPhien").text(
        `Phiên ${maPhienChoi} - vòng ${phienChoi.VongHienTai}/${phienChoi.SoVong} - lượt ${phienChoi.NguoiChoiHienTai}`
    );
}

async function batDauLamBai() {
    $("#lamBai").show();
    $("#chonChuDe").hide();
    $("#questionContainer").empty();
    userAnswers = {};

    timeLeft = boDe.ThoiGian * 60;
    startTimer();

    for (let i = 0; i < boDe.DanhSachCauHoi.length; i++) {
        const ma = boDe.DanhSachCauHoi[i];
        const cauHoi = await layCauHoi(ma);

        $("#questionContainer").append(`
            <div class="question" data-ma="${ma}">
                <p><b>Câu ${i + 1}:</b> ${cauHoi.NoiDung}</p>
                ${cauHoi.PhuongAn.map((pa, idx) => `
                    <div>
                        <input type="radio" name="q${i}" value="${idx}">
                        ${pa}
                    </div>
                `).join("")}
            </div>
        `);
    }
}

function startTimer() {
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nopBai();
        }
        updateTimer();
    }, 1000);
}

function updateTimer() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    $("#timer").text(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
}

async function nopBai() {
    $(".question").each(function (_, el) {
        const ma = $(el).data("ma");
        const ans = $(el).find("input:checked").val();
        userAnswers[ma] = ans !== undefined ? parseInt(ans) : null;
    });

    clearInterval(timerInterval);

    let dung = 0;
    for (let ma of boDe.DanhSachCauHoi) {
        const ch = await layCauHoi(ma);
        if (userAnswers[ma] === ch.DapAnDung) dung++;
    }

    const diem = Math.round((dung / boDe.SoCauHoi * 10) * 100) / 100;
    phienChoi.DanhSachNguoiChoi[phienChoi.NguoiChoiHienTai] += diem;
    phienChoi.ChuDeHienTai = "";

    await suaPhienChoi(maPhienChoi, phienChoi);

    $("#lamBai").hide();
    $("#chonChuDe").show();
    hienPhien();
}