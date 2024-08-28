import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Xử lý sự kiện form khi người dùng nhấn nút thêm câu hỏi
document.getElementById('addQuestionForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Lấy dữ liệu từ form
  const noiDung = document.getElementById('questionContent').value;
  const dapAnDung = document.getElementById('correctAnswer').value;
  const phuongAn = [
    document.getElementById('option0').value,
    document.getElementById('option1').value,
    document.getElementById('option2').value,
    document.getElementById('option3').value,
  ];

  // Thêm câu hỏi vào Firebase
  try {
    await push(ref(db, 'CauHoi'), {
      NoiDung: noiDung,
      DapAnDung: parseInt(dapAnDung),
      PhuongAn: phuongAn
    });

    // Thông báo thành công
    alert('Câu hỏi đã được thêm thành công!');
    window.location.href = 'ql-cauhoi.html'; // Chuyển về trang quản lý câu hỏi sau khi thêm thành công
  } catch (error) {
    console.error('Lỗi khi thêm câu hỏi', error);
    alert('Đã xảy ra lỗi khi thêm câu hỏi. Vui lòng thử lại!');
  }
});
