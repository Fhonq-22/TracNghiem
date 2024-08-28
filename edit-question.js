import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

// Hàm để tải câu hỏi từ Firebase và hiển thị lên form
async function loadQuestion(questionKey) {
    const db = getDatabase();
    const questionRef = ref(db, `CauHoi/${questionKey}`);
    
    try {
        const snapshot = await get(questionRef);
        if (snapshot.exists()) {
            const questionData = snapshot.val();
            document.getElementById('questionContent').value = questionData.NoiDung;
            document.getElementById('option0').value = questionData.PhuongAn[0];
            document.getElementById('option1').value = questionData.PhuongAn[1];
            document.getElementById('option2').value = questionData.PhuongAn[2];
            document.getElementById('option3').value = questionData.PhuongAn[3];
            document.getElementById('correctAnswer').value = questionData.DapAnDung;
        } else {
            console.error('Câu hỏi không tồn tại.');
        }
    } catch (error) {
        console.error('Lỗi khi tải câu hỏi: ', error);
    }
}

// Hàm để lưu các thay đổi của câu hỏi vào Firebase
async function saveQuestion() {
    const questionKey = new URLSearchParams(window.location.search).get('key');
    const db = getDatabase();
    const questionRef = ref(db, `CauHoi/${questionKey}`);
    
    const updatedQuestion = {
        NoiDung: document.getElementById('questionContent').value,
        PhuongAn: [
            document.getElementById('option0').value,
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value,
        ],
        DapAnDung: parseInt(document.getElementById('correctAnswer').value, 10)
    };
    
    try {
        await set(questionRef, updatedQuestion);
        // Sau khi lưu thành công, chuyển về trang quản lý câu hỏi
        window.location.href = 'ql-cauhoi.html';
    } catch (error) {
        console.error('Lỗi khi lưu câu hỏi: ', error);
    }
}

// Khi DOM đã tải xong, gọi hàm loadQuestion để hiển thị câu hỏi
document.addEventListener('DOMContentLoaded', () => {
    const questionKey = new URLSearchParams(window.location.search).get('key');
    loadQuestion(questionKey);

    // Gán sự kiện click cho nút lưu
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveQuestion);
    }
});
