// Import Firebase và các mô-đun cần thiết
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrZ9U2m7nv8aHCBBN7mUCNHMiB2J8ATIw",
    authDomain: "quizdb-ffc85.firebaseapp.com",
    databaseURL: "https://quizdb-ffc85-default-rtdb.firebaseio.com",
    projectId: "quizdb-ffc85",
    storageBucket: "quizdb-ffc85.appspot.com",
    messagingSenderId: "890541011519",
    appId: "1:890541011519:web:d6bcd1ea8f88ae15157e8a",
    measurementId: "G-EZK98N7CJ8"
};

// Khởi tạo Firebase
initializeApp(firebaseConfig);

export async function loadQuestion(questionKey) {
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

export async function saveQuestion() {
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
    if (questionKey) {
        loadQuestion(questionKey);
    }

    // Gán sự kiện click cho nút lưu
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveQuestion);
    }
});
