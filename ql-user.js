import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

// Hàm tải danh sách người dùng
function loadUsers() {
    const db = getDatabase();
    const userRef = ref(db, 'User'); // Đường dẫn tới danh sách người dùng trong Firebase

    onValue(userRef, (snapshot) => {
        const userTable = document.getElementById("user-table-body");
        userTable.innerHTML = ''; // Xóa nội dung cũ trước khi hiển thị danh sách mới

        snapshot.forEach((userSnapshot) => {
            const userKey = userSnapshot.key;
            const userData = userSnapshot.val();
            const userRole = userData.VaiTro;

            const row = document.createElement("tr");

            // Tạo các ô trong bảng
            const cellUsername = document.createElement("td");
            cellUsername.textContent = userKey;

            const cellHoTen = document.createElement("td");
            cellHoTen.textContent = userData.HoTen || '';

            const cellNgayDangKy = document.createElement("td");
            cellNgayDangKy.textContent = userData.NgayDangKy || '';

            const cellVaiTro = document.createElement("td");
            cellVaiTro.textContent = userRole;

            const cellActions = document.createElement("td");

            // Nút sửa và xóa
            if (userRole === "Admin") {
                const editButton = document.createElement("button");
                editButton.textContent = "Sửa";
                editButton.classList.add("btn", "btn-warning");
                editButton.onclick = () => editUser(userKey);
                cellActions.appendChild(editButton);
            }

            if (userRole === "User") {
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Xóa";
                deleteButton.classList.add("btn", "btn-danger");
                deleteButton.onclick = () => deleteUser(userKey);
                cellActions.appendChild(deleteButton);
            }

            // Thêm các ô vào hàng
            row.appendChild(cellUsername);
            row.appendChild(cellHoTen);
            row.appendChild(cellNgayDangKy);
            row.appendChild(cellVaiTro);
            row.appendChild(cellActions);

            // Thêm hàng vào bảng
            userTable.appendChild(row);
        });
    });
}

// Hàm sửa người dùng
function editUser(userKey) {
    window.location.href = `edit-user.html?key=${userKey}`;
}

// Hàm xóa người dùng
function deleteUser(userKey) {
    const db = getDatabase();
    const userRef = ref(db, `User/${userKey}`);

    remove(userRef).then(() => {
        alert("Người dùng đã được xóa thành công!");
    }).catch((error) => {
        console.error("Lỗi khi xóa người dùng:", error);
    });
}

loadUsers();
