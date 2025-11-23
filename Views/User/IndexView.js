import { layDanhSachBoDe, layBoDe } from "../../Controllers/BoDeController.js";

$(document).ready(async function() {
    const username = localStorage.getItem("currentUser") || "Khách";
    $("#userDisplay").text(username);

    $("#btnLogout").click(() => {
        localStorage.removeItem("currentUser");
        window.location.href = "dang-nhap.html";
    });

    await loadBoDe();
});

async function loadBoDe() {
    const danhSach = await layDanhSachBoDe();
    const tbody = $("#boDeTable tbody");
    tbody.empty();

    for (let ma of danhSach) {
        const bd = await layBoDe(ma);
        const row = $(`
            <tr>
                <td>${ma}</td>
                <td>${bd.TenBoDe}</td>
                <td>${bd.SoCauHoi}</td>
                <td>${bd.ThoiGian}</td>
                <td>${bd.NgayTao}</td>
                <td>${bd.NguoiTao}</td>
                <td>
                    <button class="startBtn">Bắt đầu</button>
                </td>
            </tr>
        `);

        row.find(".startBtn").click(() => {
            window.location.href = `u-lambai.html?maBoDe=${ma}`;
        });

        tbody.append(row);
    }
}