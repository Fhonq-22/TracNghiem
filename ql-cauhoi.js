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

// Tải và hiển thị câu hỏi
document.addEventListener('DOMContentLoaded', () => {
    const questionsTableBody = document.querySelector("#questionsTable tbody");
    const cauHoiRef = ref(db, 'CauHoi');

    get(cauHoiRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (const [key, question] of Object.entries(data)) {
                const row = document.createElement("tr");

                const noiDungCell = document.createElement("td");
                noiDungCell.textContent = question.NoiDung;
                row.appendChild(noiDungCell);

                const phuongAnCell = document.createElement("td");
                phuongAnCell.textContent = question.PhuongAn.join(", ");
                row.appendChild(phuongAnCell);

                const dapAnDungCell = document.createElement("td");
                dapAnDungCell.textContent = question.DapAnDung;
                row.appendChild(dapAnDungCell);

                const actionCell = document.createElement("td");
                const editButton = document.createElement("button");
                editButton.textContent = "Sửa";
                editButton.onclick = () => editQuestion(key);
                actionCell.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Xóa";
                deleteButton.onclick = () => deleteQuestion(key);
                actionCell.appendChild(deleteButton);

                row.appendChild(actionCell);
                questionsTableBody.appendChild(row);
            }
        } else {
            questionsTableBody.innerHTML = "<tr><td colspan='4'>Không có câu hỏi nào</td></tr>";
        }
    }).catch((error) => {
        console.error("Lỗi khi tải câu hỏi: ", error);
    });
});

// Xóa câu hỏi
function deleteQuestion(key) {
    // Implement delete logic here
    if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
        // Xóa câu hỏi từ cơ sở dữ liệu
        // Sau đó, bạn có thể làm mới bảng để phản ánh sự thay đổi
    }
}
