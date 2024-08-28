import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// Gán sự kiện click cho nút thêm câu hỏi
document.getElementById("addQuestionBtn").addEventListener("click", async function() {
    // Lấy dữ liệu từ form
    const noiDung = document.getElementById("noiDung").value;
    const phuongAn1 = document.getElementById("phuongAn1").value;
    const phuongAn2 = document.getElementById("phuongAn2").value;
    const phuongAn3 = document.getElementById("phuongAn3").value;
    const phuongAn4 = document.getElementById("phuongAn4").value;
    const dapAnDung = document.getElementById("dapAnDung").value;

    if (!noiDung || !phuongAn1 || !phuongAn2 || !phuongAn3 || !phuongAn4 || !dapAnDung) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    // Tạo khóa câu hỏi mới
    const cauHoiRef = ref(db, 'CauHoi');
    const snapshot = await get(cauHoiRef);
    const data = snapshot.val();
    
    // Xác định khóa mới bằng cách tìm khóa trống
    let newKey = '';
    let foundEmptyKey = false;
    let i = 1;
    while (!foundEmptyKey) {
        let potentialKey = `Q${i.toString().padStart(3, '0')}`;
        if (!data || !data[potentialKey]) {
            newKey = potentialKey;
            foundEmptyKey = true;
        }
        i++;
    }

    // Tạo dữ liệu câu hỏi mới
    const newQuestion = {
        NoiDung: noiDung,
        PhuongAn: [phuongAn1, phuongAn2, phuongAn3, phuongAn4],
        DapAnDung: parseInt(dapAnDung)
    };

    // Ghi câu hỏi mới vào cơ sở dữ liệu
    set(ref(db, `CauHoi/${newKey}`), newQuestion)
        .then(() => {
            alert("Thêm câu hỏi thành công!");
            // Chuyển hướng về trang quản lý câu hỏi
            window.location.href = "ql-question.html";
        })
        .catch((error) => {
            console.error("Lỗi khi thêm câu hỏi: ", error);
            alert("Lỗi khi thêm câu hỏi.");
        });
});
