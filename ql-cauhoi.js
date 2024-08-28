import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

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

async function loadQuestions() {
  const questionList = document.getElementById('questionList');
  const questionRef = ref(db, 'CauHoi/');
  const snapshot = await get(questionRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    questionList.innerHTML = '';

    Object.keys(data).forEach(key => {
      const question = data[key];
      const questionElement = document.createElement('div');
      questionElement.innerHTML = `
        <h3>${question.NoiDung}</h3>
        <p>Đáp án đúng: ${question.DapAnDung}</p>
        <p>Phương án:</p>
        <ul>
          ${question.PhuongAn.map((option, index) => `<li>Phương án ${index}: ${option}</li>`).join('')}
        </ul>
        <button onclick="editQuestion('${key}')">Sửa</button>
        <button onclick="deleteQuestion('${key}')">Xóa</button>
      `;
      questionList.appendChild(questionElement);
    });
  } else {
    questionList.innerHTML = '<p>Không có câu hỏi nào.</p>';
  }
}

function editQuestion(id) {
  window.location.href = `edit-question.html?id=${id}`;
}

async function deleteQuestion(id) {
  if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
    try {
      await remove(ref(db, `CauHoi/${id}`));
      alert('Câu hỏi đã được xóa thành công!');
      loadQuestions(); // Reload questions
    } catch (error) {
      console.error('Lỗi khi xóa câu hỏi', error);
      alert('Đã xảy ra lỗi khi xóa câu hỏi. Vui lòng thử lại!');
    }
  }
}

window.onload = loadQuestions;
