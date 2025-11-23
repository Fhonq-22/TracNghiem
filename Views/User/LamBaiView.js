import { layBoDe } from "../../Controllers/BoDeController.js";
import { layCauHoi } from "../../Controllers/CauHoiController.js";

let timerInterval = null;
let timeLeft = 0;
let userAnswers = {};

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

function submitExam() {
    $(".question").each(function(i, el) {
        const ma = $(el).data("ma");
        const ans = $(el).find("input[type=radio]:checked").val();
        userAnswers[ma] = ans !== undefined ? parseInt(ans) : null;
    });

    clearInterval(timerInterval);
    console.log("Kết quả của người dùng:", userAnswers);
    alert("Bài đã nộp! Xem console để kiểm tra kết quả.");
}