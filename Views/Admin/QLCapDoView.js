import { layDanhSachCapDo, layCapDo, themCapDo, suaCapDo, xoaCapDo } from "../../Controllers/CapDoController.js";

let cachedCapDo = [];
let editingCapDo = null;

let currentPage = 1;
const pageSize = 10;

$(document).ready(async function () {
    const maList = await layDanhSachCapDo();
    cachedCapDo = await Promise.all(maList.map(ma => layCapDo(ma)));

    renderCapDo(currentPage);

    $("#btnAddCapDo").click(() => {
        editingCapDo = null;
        $("#modalTitle").text("Thêm cấp độ");
        $("#modalTenCapDo").val("");
        $("#modalDiemMoiCau").val("");
        $("#modalHeSoTraLoiPhu").val(0.5);
        $("#capDoModal").show();
    });

    $("#modalCancel").click(() => $("#capDoModal").hide());

    $("#modalSave").click(async () => {
        const tenCapDo = $("#modalTenCapDo").val().trim();
        const diemMoiCau = parseFloat($("#modalDiemMoiCau").val());
        const heSoTraLoiPhu = parseFloat($("#modalHeSoTraLoiPhu").val());

        if (!tenCapDo || isNaN(diemMoiCau)) {
            alert("Dữ liệu không hợp lệ");
            return;
        }

        const maCapDo = editingCapDo || await generateNextCapDoCode();
        const data = {
            MaCapDo: maCapDo,
            TenCapDo: tenCapDo,
            DiemMoiCau: diemMoiCau,
            HeSoTraLoiPhu: heSoTraLoiPhu,
            NgayCapNhat: new Date().toLocaleDateString("vi-VN")
        };

        if (editingCapDo) {
            await suaCapDo(editingCapDo, data);
            const idx = cachedCapDo.findIndex(c => c.MaCapDo === editingCapDo);
            if (idx >= 0) cachedCapDo[idx] = data;
        } else {
            await themCapDo(data);
            cachedCapDo.push(data);
        }

        $("#capDoModal").hide();
        renderCapDo(currentPage);
    });
});

function renderCapDo(page = 1) {
    const tbody = $("#capDoTable tbody");
    tbody.empty();

    const totalPages = Math.ceil(cachedCapDo.length / pageSize);
    currentPage = Math.min(Math.max(page, 1), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, cachedCapDo.length);
    const pageItems = cachedCapDo.slice(startIndex, endIndex);

    for (let cd of pageItems) {
        const row = $(`
            <tr>
                <td>${cd.MaCapDo}</td>
                <td>${cd.TenCapDo}</td>
                <td>${cd.DiemMoiCau}</td>
                <td>${cd.HeSoTraLoiPhu}</td>
                <td>${cd.NgayCapNhat}</td>
                <td>
                    <button class="editBtn">Sửa</button>
                    <button class="deleteBtn">Xóa</button>
                </td>
            </tr>
        `);

        row.find(".editBtn").click(() => {
            editingCapDo = cd.MaCapDo;
            $("#modalTitle").text("Sửa cấp độ");
            $("#modalTenCapDo").val(cd.TenCapDo);
            $("#modalDiemMoiCau").val(cd.DiemMoiCau);
            $("#modalHeSoTraLoiPhu").val(cd.HeSoTraLoiPhu);
            $("#capDoModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (!confirm(`Xóa cấp độ ${cd.MaCapDo}?`)) return;

            const res = await xoaCapDo(cd.MaCapDo);

            if (!res.success) {
                let msg = res.message || "Không thể xóa cấp độ";
                if (res.refs?.length) {
                    msg += "\n\nĐang được sử dụng tại:";
                    res.refs.forEach(r => {
                        msg += `\n- ${r.collection} (${r.ma})`;
                    });
                }
                alert(msg);
                return;
            }

            cachedCapDo = cachedCapDo.filter(c => c.MaCapDo !== cd.MaCapDo);
            renderCapDo(currentPage);
        });

        tbody.append(row);
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = $("#pagination");
    container.empty();
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        container.append(`<button class="pageBtn" data-page="1"><<</button>`);
        container.append(`<button class="pageBtn" data-page="${currentPage - 1}">Prev</button>`);
    }

    const visibleRange = 2;
    let start = Math.max(1, currentPage - visibleRange);
    let end = Math.min(totalPages, currentPage + visibleRange);

    if (start > 1) container.append(`<span>...</span>`);
    for (let i = start; i <= end; i++) {
        container.append(`<button class="pageBtn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
    }
    if (end < totalPages) container.append(`<span>...</span>`);

    if (currentPage < totalPages) {
        container.append(`<button class="pageBtn" data-page="${currentPage + 1}">Next</button>`);
        container.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }

    container.find(".pageBtn").click(function () {
        const page = parseInt($(this).data("page"));
        renderCapDo(page);
    });
}

async function generateNextCapDoCode() {
    const nums = cachedCapDo
        .map(c => parseInt(c.MaCapDo.slice(2)))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

    let next = 1;
    for (let n of nums) {
        if (n === next) next++;
        else break;
    }
    return "CD" + String(next).padStart(2, "0");
}