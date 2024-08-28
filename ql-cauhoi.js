// Import các phương thức cần thiết từ Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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
initializeApp(firebaseConfig);

// Hàm để tải và hiển thị danh sách câu hỏi
function loadQuestions() {
    const db = getDatabase();
    const questionsRef = ref(db, 'CauHoi');
    
    // Lấy dữ liệu từ Firebase
    onValue(questionsRef, (snapshot) => {
        const data = snapshot.val();
        const questionsList = document.getElementById('questions-list');

        // Xóa nội dung cũ trước khi cập nhật
        questionsList.innerHTML = '';

        if (data) {
            // Duyệt qua từng câu hỏi và tạo các dòng hiển thị
            Object.keys(data).forEach((key) => {
                const question = data[key];
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${key}</td>
                    <td>${question.NoiDung}</td>
                    <td>${question.PhuongAn[question.DapAnDung]}</td>
                    <td>
                        <button class="editButton" data-key="${key}">Sửa</button>
                        <button class="deleteButton" data-key="${key}">Xoá</button>
                    </td>
                `;

                // Thêm hàng vào bảng
                questionsList.appendChild(row);
            });

            // Gán sự kiện click cho các nút sửa và xóa
            assignButtonEvents();
        } else {
            questionsList.innerHTML = '<tr><td colspan="4">Không có câu hỏi nào được tìm thấy</td></tr>';
        }
    });
}

// Gán sự kiện cho các nút sửa và xóa
function assignButtonEvents() {
    const deleteButtons = document.querySelectorAll('.deleteButton');
    const editButtons = document.querySelectorAll('.editButton');

    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            const questionKey = deleteButton.getAttribute('data-key');
            if (confirm("Bạn có chắc muốn xoá câu hỏi này?")) {
                deleteQuestion(questionKey);
            }
        });
    });

    editButtons.forEach((editButton) => {
        editButton.addEventListener('click', () => {
            const questionKey = editButton.getAttribute('data-key');
            // Chuyển hướng đến trang sửa câu hỏi với key tương ứng
            window.location.href = `edit-question.html?key=${questionKey}`;
        });
    });
}

// Khi DOM đã tải xong, tải câu hỏi
document.addEventListener('DOMContentLoaded', loadQuestions);
