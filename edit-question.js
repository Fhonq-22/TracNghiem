import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Cấu hình Firebase
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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function loadQuestion(questionKey) {
    const questionRef = ref(db, `CauHoi/${questionKey}`);
    const noiDungInput = document.getElementById('noiDung');
    const phuongAn1Input = document.getElementById('phuongAn1');
    const phuongAn2Input = document.getElementById('phuongAn2');
    const phuongAn3Input = document.getElementById('phuongAn3');
    const phuongAn4Input = document.getElementById('phuongAn4');
    const dapAnDungInput = document.getElementById('dapAnDung');
    const questionKeyInput = document.getElementById('questionKey');

    if (noiDungInput && phuongAn1Input && phuongAn2Input && phuongAn3Input && phuongAn4Input && dapAnDungInput && questionKeyInput) {
        try {
            const snapshot = await get(questionRef);
            if (snapshot.exists()) {
                const question = snapshot.val();
                noiDungInput.value = question.NoiDung || '';
                phuongAn1Input.value = question.PhuongAn[0] || '';
                phuongAn2Input.value = question.PhuongAn[1] || '';
                phuongAn3Input.value = question.PhuongAn[2] || '';
                phuongAn4Input.value = question.PhuongAn[3] || '';
                dapAnDungInput.value = question.DapAnDung || '';
                questionKeyInput.value = questionKey;
            } else {
                alert("Câu hỏi không tồn tại.");
            }
        } catch (error) {
            console.error("Lỗi khi tải câu hỏi: ", error);
        }
    } else {
        console.error("Một số phần tử DOM không tồn tại.");
    }
}
