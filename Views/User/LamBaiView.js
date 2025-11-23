import { layBoDe } from "../../Controllers/BoDeController.js";
import { layCauHoi } from "../../Controllers/CauHoiController.js";
import { themKetQua } from "../../Controllers/KetQuaController.js";

let timerInterval = null;
let timeLeft = 0;
let userAnswers = {};
let startTime = null;

$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const maBoDe = urlParams.get("maBoDe");
    if (!maBoDe) {
        alert("Không có bộ đề");
        return;
    }

    const boDe = await layBoDe(maBoDe);
    if (!boDe) {
        alert("Không tìm thấy bộ đề");
        return;
    }

    startTime = new Date();
    timeLeft = boDe.ThoiGian * 60;
    startTimer();

    const questionContainer = $("#questionContainer");
    for (let i = 0; i < boDe.DanhSachCauHoi.length; i++) {
        const maCauHoi = boDe.DanhSachCauHoi[i];
        const cauHoi = await layCauHoi(maCauHoi);
        const questionDiv = $(`
            <div class="question" data-ma="${maCauHoi}">
                <p><b>Câu ${i+1}:</b> ${cauHoi.NoiDung}</p>
                ${cauHoi.PhuongAn.map((pa, idx) => `
                    <div>
                        <input type="radio" name="q${i}" value="${idx}">
                        ${pa}
                    </div>
                `).join("")}
            </div>
        `);
        questionContainer.append(questionDiv);
    }

    $("#btnSubmit").click(submitExam);
    $("#btnBack").click(() => window.location.href = "index.html");
});

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Hết thời gian! Bài sẽ được nộp tự động.");
            submitExam();
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    $("#timer").text(`${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
}

async function submitExam() {
    $(".question").each(function(i, el) {
        const ma = $(el).data("ma");
        const ans = $(el).find("input[type=radio]:checked").val();
        userAnswers[ma] = ans !== undefined ? parseInt(ans) : null;
    });

    clearInterval(timerInterval);
    $("#btnSubmit").prop("disabled", true);

    const endTime = new Date();
    const formatDateTime = dt => dt.toLocaleDateString("vi-VN") + " " + dt.toLocaleTimeString("vi-VN");

    const urlParams = new URLSearchParams(window.location.search);
    const maBoDe = urlParams.get("maBoDe");
    const boDe = await layBoDe(maBoDe);

    let correctCount = 0;
    for (let ma of boDe.DanhSachCauHoi) {
        const cauHoi = await layCauHoi(ma);
        if (userAnswers[ma] === cauHoi.DapAnDung) correctCount++;
    }
    const diem = Math.round((correctCount / boDe.SoCauHoi * 10) * 100) / 100;

    const maKetQua = "KQ" + Date.now();
    const ketQuaData = {
        MaKetQua: maKetQua,
        MaDe: maBoDe,
        TenNguoiDung: localStorage.getItem("currentUser") || "Khách",
        ThoiGianBatDau: formatDateTime(startTime),
        ThoiGianNop: formatDateTime(endTime),
        Diem: diem
    };

    await themKetQua(ketQuaData);
    alert(`Bài đã nộp! Điểm của bạn: ${diem}`);
    window.location.href = `u-ketqua.html?maKetQua=${maKetQua}`;
}