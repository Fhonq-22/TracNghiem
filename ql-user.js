// ql-user.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getDatabase, ref, get, remove, set } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js';

// Firebase configuration
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

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getDatabase();

const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];

async function loadUsers() {
    try {
        const userRef = ref(db, 'User/');
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const [key, user] of Object.entries(users)) {
                const row = userTable.insertRow();
                row.insertCell(0).innerText = key;
                row.insertCell(1).innerText = user.Email || 'Chưa có';
                row.insertCell(2).innerText = user.HoTen || 'Chưa có';
                row.insertCell(3).innerText = user.VaiTro || 'Chưa có';

                const actionsCell = row.insertCell(4);
                if (user.VaiTro === 'Admin') {
                    // Admin can edit
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Sửa';
                    editButton.onclick = () => {
                        window.location.href = `edit-user.html?key=${key}`;
                    };
                    actionsCell.appendChild(editButton);
                }

                // Both Admin and User can delete
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Xóa';
                deleteButton.onclick = () => {
                    if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${key}?`)) {
                        deleteUser(key);
                    }
                };
                actionsCell.appendChild(deleteButton);
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải người dùng:', error);
    }
}

async function deleteUser(key) {
    try {
        await remove(ref(db, `User/${key}`));
        location.reload(); // Refresh the page to reflect changes
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadUsers);
