// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// Hàm xử lý đăng ký
async function registerUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (username === "" || password === "" || confirmPassword === "") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu không khớp!");
    return;
  }

  // Lưu thông tin người dùng vào Firebase Realtime Database
  const userRef = ref(db, 'User/' + username);

  try {
    await set(userRef, {
      Email: "",
      HoTen: "",
      MatKhau: password,
      NgayDangKy: new Date().toLocaleDateString(),
      VaiTro: "User" // Hoặc "Admin" nếu bạn muốn phân quyền khác
    });

    alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
    window.location.href = "login.html"; // Chuyển đến trang đăng nhập

  } catch (error) {
    console.error("Lỗi khi đăng ký", error);
    alert("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!");
  }
}

// Gán sự kiện onsubmit cho form
document.getElementById('registerForm').onsubmit = function(event) {
  event.preventDefault();
  registerUser();
};
