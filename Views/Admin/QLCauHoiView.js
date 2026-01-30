import { layDanhSachCauHoi, layCauHoi, themCauHoi, suaCauHoi, xoaCauHoi } from "../../Controllers/CauHoiController.js";
import { yeuCauAdmin, getUserHienTai } from "../../Utils/AUTH.utils.js";

let editingQuestion = null;
let currentPage = 1;
const pageSize = 10;
let cachedQuestions = [];

$(document).ready(async function () {
    if (!yeuCauAdmin()) return;

    cachedQuestions = await Promise.all((await layDanhSachCauHoi()).map(ma => layCauHoi(ma)));
    renderQuestions(currentPage);

    $("#btnAddQuestion").click(() => {
        editingQuestion = null;
        $("#modalTitle").text("Thêm câu hỏi");
        $("#modalNoiDung").val("");
        $(".modalPhuongAn").val("");
        $("#modalDapAnDung").val("0");
        $("#modalGiaiThich").val("");
        $("#autoCode").prop("checked", true).prop("disabled", false);
        $("#modalMaCauHoi").val("").prop("disabled", true);

        $("#autoCode").off("change").on("change", function () {
            $("#modalMaCauHoi").prop("disabled", $(this).is(":checked"));
            if ($(this).is(":checked")) $("#modalMaCauHoi").val("");
        });

        $("#questionModal").show();
    });

    $("#modalCancel").click(() => $("#questionModal").hide());

    $("#modalSave").click(async () => {
        let maCauHoi = $("#modalMaCauHoi").val().trim();

        if ($("#autoCode").is(":checked") && !editingQuestion) {
            let n = 1;
            const used = cachedQuestions.map(q => parseInt(q.MaCauHoi.slice(1))).sort((a, b) => a - b);
            for (let x of used) if (x === n) n++; else if (x > n) break;
            maCauHoi = "Q" + String(n).padStart(5, "0");
        }

        const phuongAn = $(".modalPhuongAn").map((_, el) => el.value.trim()).get();

        const cauHoiData = {
            MaCauHoi: maCauHoi,
            NoiDung: $("#modalNoiDung").val().trim(),
            PhuongAn: phuongAn,
            DapAnDung: parseInt($("#modalDapAnDung").val()),
            GiaiThich: $("#modalGiaiThich").val().trim(),
            NguoiTao: getUserHienTai()?.TenNguoiDung || "",
            NgayTao: new Date().toLocaleDateString()
        };

        if (!cauHoiData.MaCauHoi || !cauHoiData.NoiDung) {
            alert("Mã câu hỏi và nội dung không được để trống");
            return;
        }

        if (editingQuestion) {
            const old = cachedQuestions.find(q => q.MaCauHoi === editingQuestion);
            const newData = {
                ...old,
                NoiDung: cauHoiData.NoiDung,
                PhuongAn: cauHoiData.PhuongAn,
                DapAnDung: cauHoiData.DapAnDung,
                GiaiThich: cauHoiData.GiaiThich
            };

            await suaCauHoi(editingQuestion, newData);
            cachedQuestions[cachedQuestions.findIndex(q => q.MaCauHoi === editingQuestion)] = newData;
            alert("Cập nhật câu hỏi thành công");
        } else {
            await themCauHoi(cauHoiData);
            cachedQuestions.push(cauHoiData);
            alert("Thêm câu hỏi thành công");
        }

        $("#questionModal").hide();
        renderQuestions(currentPage);
    });
});

function renderQuestions(page = 1) {
    const tbody = $("#questionTable tbody").empty();
    const totalPages = Math.ceil(cachedQuestions.length / pageSize);
    currentPage = Math.min(Math.max(page, 1), totalPages);

    cachedQuestions.slice((currentPage - 1) * pageSize, currentPage * pageSize).forEach(cauHoi => {
        const row = $(`
            <tr>
                <td>${cauHoi.MaCauHoi}</td>
                <td>${cauHoi.NoiDung}</td>
                <td>${cauHoi.PhuongAn[0] || ""}</td>
                <td>${cauHoi.PhuongAn[1] || ""}</td>
                <td>${cauHoi.PhuongAn[2] || ""}</td>
                <td>${cauHoi.PhuongAn[3] || ""}</td>
                <td>${cauHoi.DapAnDung}</td>
                <td>${cauHoi.GiaiThich || ""}</td>
                <td>${cauHoi.NguoiTao || ""}</td>
                <td>${cauHoi.NgayTao || ""}</td>
                <td>
                    <button class="editBtn">Sửa</button>
                    <button class="deleteBtn">Xóa</button>
                </td>
            </tr>
        `);

        row.find(".editBtn").click(() => {
            editingQuestion = cauHoi.MaCauHoi;
            $("#modalTitle").text("Sửa câu hỏi");
            $("#modalMaCauHoi").val(cauHoi.MaCauHoi).prop("disabled", true);
            $("#modalNoiDung").val(cauHoi.NoiDung);
            $(".modalPhuongAn").each((i, el) => $(el).val(cauHoi.PhuongAn[i] || ""));
            $("#modalDapAnDung").val(cauHoi.DapAnDung);
            $("#modalGiaiThich").val(cauHoi.GiaiThich || "");
            $("#autoCode").prop("checked", true).prop("disabled", true);
            $("#questionModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (!confirm(`Xóa câu hỏi ${cauHoi.MaCauHoi}?`)) return;

            const res = await xoaCauHoi(cauHoi.MaCauHoi);
            if (!res.success) {
                let msg = res.message || "Không thể xóa câu hỏi";
                if (res.refs?.length) {
                    msg += "\n\nĐang được sử dụng tại:";
                    res.refs.forEach(r => msg += `\n- ${r.collection} (${r.ma})`);
                }
                alert(msg);
                return;
            }

            cachedQuestions = cachedQuestions.filter(q => q.MaCauHoi !== cauHoi.MaCauHoi);
            renderQuestions(currentPage);
        });

        tbody.append(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const c = $("#pagination").empty();
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        c.append(`<button class="pageBtn" data-page="1"><<</button>`);
        c.append(`<button class="pageBtn" data-page="${currentPage - 1}">Prev</button>`);
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        c.append(`<button class="pageBtn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`);
    }

    if (currentPage < totalPages) {
        c.append(`<button class="pageBtn" data-page="${currentPage + 1}">Next</button>`);
        c.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }

    c.find(".pageBtn").click(e => renderQuestions(+e.target.dataset.page));
}