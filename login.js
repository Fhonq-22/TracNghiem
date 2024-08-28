// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// Hàm xử lý đăng nhập
async function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Truy xuất dữ liệu người dùng từ Firebase Realtime Database
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `User`));

    if (snapshot.exists()) {
      const users = snapshot.val();
      
      // Kiểm tra xem UserID có khớp với tên đăng nhập không
      if (users.hasOwnProperty(username)) {
        const user = users[username]; // Lấy thông tin người dùng theo UserID

        if (user.MatKhau == password) {
          // Kiểm tra vai trò và chuyển hướng
          if (user.VaiTro === "Admin") {
            window.location.href = "admin-home.html"; // Chuyển đến trang admin
          } else {
            window.location.href = "user-home.html"; // Chuyển đến trang user
          }
        } else {
          alert("Mật khẩu không chính xác!");
        }
      } else {
        alert("Tên đăng nhập không tồn tại!");
      }

    } else {
      alert("Không có người dùng trong hệ thống!");
    }

  } catch (error) {
    console.error("Lỗi khi truy cập Firebase", error);
  }
}

// Gán sự kiện onsubmit cho form
document.getElementById('loginForm').onsubmit = function(event) {
  event.preventDefault();
  loginUser();
};
