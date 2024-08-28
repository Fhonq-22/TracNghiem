import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// Hàm tìm khóa trống
async function findEmptyKey() {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, 'CauHoi'));
  const cauHoiData = snapshot.exists() ? snapshot.val() : {};

  let i = 1;
  while (true) {
    const key = 'Q' + String(i).padStart(3, '0'); // Tạo khóa như Q001, Q002, Q003, ...
    if (!cauHoiData[key]) {
      return key; // Nếu khóa không tồn tại, trả về khóa này
    }
    i++;
  }
}

// Hàm thêm câu hỏi mới
async function addQuestion() {
  const noiDung = document.getElementById("noiDung").value;
  const phuongAn1 = document.getElementById("phuongAn1").value;
  const phuongAn2 = document.getElementById("phuongAn2").value;
  const phuongAn3 = document.getElementById("phuongAn3").value;
  const phuongAn4 = document.getElementById("phuongAn4").value;
  const dapAnDung = document.getElementById("dapAnDung").value;

  if (!noiDung || !phuongAn1 || !phuongAn2 || !phuongAn3 || !phuongAn4 || dapAnDung === "") {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    const newKey = await findEmptyKey(); // Tìm khóa trống
    if (!newKey) {
      alert("Không thể tìm thấy khóa trống!");
      return;
    }

    const newQuestion = {
      NoiDung: noiDung,
      PhuongAn: [phuongAn1, phuongAn2, phuongAn3, phuongAn4],
      DapAnDung: parseInt(dapAnDung)
    };

    await set(ref(db, 'CauHoi/' + newKey), newQuestion);
    alert("Thêm câu hỏi thành công với khóa " + newKey);
    window.location.reload(); // Tải lại trang sau khi thêm thành công
  } catch (error) {
    console.error("Lỗi khi thêm câu hỏi:", error);
    alert("Đã có lỗi xảy ra khi thêm câu hỏi.");
  }
}

// Gán sự kiện cho nút thêm
document.getElementById("addQuestionBtn").addEventListener("click", addQuestion);

