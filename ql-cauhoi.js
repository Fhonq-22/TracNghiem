// Import các phương thức cần thiết từ Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, remove } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

// Hàm xoá câu hỏi
function deleteQuestion(questionKey) {
    const db = getDatabase();
    const questionRef = ref(db, `CauHoi/${questionKey}`);
    
    // Xoá câu hỏi bằng hàm remove
    remove(questionRef)
        .then(() => {
            console.log("Câu hỏi đã được xoá thành công");
            // Cập nhật lại danh sách câu hỏi sau khi xoá
            location.reload();
        })
        .catch((error) => {
            console.error("Lỗi khi xoá câu hỏi: ", error);
        });
}

// Khi DOM đã tải xong, gán sự kiện cho các nút xoá
document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.deleteButton');

    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', () => {
            const questionKey = deleteButton.getAttribute('data-key');
            if (confirm("Bạn có chắc muốn xoá câu hỏi này?")) {
                deleteQuestion(questionKey);
            }
        });
    });
});
