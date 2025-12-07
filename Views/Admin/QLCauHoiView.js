import { layDanhSachCauHoi, layCauHoi, themCauHoi, suaCauHoi, xoaCauHoi } from "../../Controllers/CauHoiController.js";

let editingQuestion = null;
let currentPage = 1;
const pageSize = 10;
let cachedQuestions = [];

$(document).ready(async function() {
    const maList = await layDanhSachCauHoi();
    cachedQuestions = await Promise.all(maList.map(ma => layCauHoi(ma)));

    await renderQuestions(currentPage);

    $("#btnAddQuestion").click(() => {
        editingQuestion = null;
        $("#modalTitle").text("Thêm câu hỏi");
        $("#modalNoiDung").val("");
        $(".modalPhuongAn").val("");
        $("#modalDapAnDung").val("0");
        $("#modalGiaiThich").val("");
        $("#autoCode").prop("checked", true).prop("disabled", false);
        $("#modalMaCauHoi").val("").prop("disabled", true);

        $("#autoCode").off("change").on("change", function() {
            if ($(this).is(":checked")) {
                $("#modalMaCauHoi").val("").prop("disabled", true);
            } else {
                $("#modalMaCauHoi").prop("disabled", false);
            }
        });

        $("#questionModal").show();
    });

    $("#modalCancel").click(() => $("#questionModal").hide());

    $("#modalSave").click(async function() {
        let maCauHoi = $("#modalMaCauHoi").val().trim();

        if ($("#autoCode").is(":checked") && !editingQuestion) {
            let numbers = cachedQuestions.map(q => parseInt(q.MaCauHoi.slice(1))).sort((a,b)=>a-b);
            let nextNum = 1;
            for (let n of numbers) {
                if (n === nextNum) nextNum++;
                else if (n > nextNum) break;
            }
            maCauHoi = "Q" + String(nextNum).padStart(4, "0");
        }

        const phuongAn = $(".modalPhuongAn").map((i, el) => $(el).val().trim()).get();

        const cauHoiData = {
            MaCauHoi: maCauHoi,
            NoiDung: $("#modalNoiDung").val().trim(),
            PhuongAn: phuongAn,
            DapAnDung: parseInt($("#modalDapAnDung").val()),
            GiaiThich: $("#modalGiaiThich").val().trim(),
            NguoiTao: "Admin",
            NgayTao: new Date().toLocaleDateString()
        };

        if (!cauHoiData.MaCauHoi || !cauHoiData.NoiDung) {
            alert("Mã câu hỏi và nội dung không được để trống");
            return;
        }

        if (editingQuestion) {
            await suaCauHoi(editingQuestion, cauHoiData);
            const index = cachedQuestions.findIndex(q => q.MaCauHoi === editingQuestion);
            cachedQuestions[index] = cauHoiData;
        } else {
            await themCauHoi(cauHoiData);
            cachedQuestions.push(cauHoiData);
        }

        $("#questionModal").hide();
        await renderQuestions(currentPage);
    });
});

async function renderQuestions(page = 1) {
    const tbody = $("#questionTable tbody");
    tbody.empty();

    const totalPages = Math.ceil(cachedQuestions.length / pageSize);
    currentPage = Math.min(Math.max(page,1), totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, cachedQuestions.length);
    const pageItems = cachedQuestions.slice(startIndex, endIndex);

    for (let cauHoi of pageItems) {
        const row = $(`
            <tr>
                <td>${cauHoi.MaCauHoi}</td>
                <td>${cauHoi.NoiDung}</td>
                <td>${cauHoi.PhuongAn[0]||""}</td>
                <td>${cauHoi.PhuongAn[1]||""}</td>
                <td>${cauHoi.PhuongAn[2]||""}</td>
                <td>${cauHoi.PhuongAn[3]||""}</td>
                <td>${cauHoi.DapAnDung}</td>
                <td>${cauHoi.GiaiThich||""}</td>
                <td>${cauHoi.NguoiTao||""}</td>
                <td>${cauHoi.NgayTao||""}</td>
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
            $(".modalPhuongAn").each((i, el) => $(el).val(cauHoi.PhuongAn[i]||""));
            $("#modalDapAnDung").val(cauHoi.DapAnDung);
            $("#modalGiaiThich").val(cauHoi.GiaiThich||"");
            $("#autoCode").prop("checked", true).prop("disabled", true);
            $("#questionModal").show();
        });

        row.find(".deleteBtn").click(async () => {
            if (confirm(`Xóa câu hỏi ${cauHoi.MaCauHoi}?`)) {
                await xoaCauHoi(cauHoi.MaCauHoi);
                cachedQuestions = cachedQuestions.filter(q => q.MaCauHoi !== cauHoi.MaCauHoi);
                await renderQuestions(currentPage);
            }
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
        container.append(`<button class="pageBtn" data-page="${currentPage-1}">Prev</button>`);
    }

    const visibleRange = 2;
    let start = Math.max(1,currentPage-visibleRange);
    let end = Math.min(totalPages,currentPage+visibleRange);

    if (start>1) container.append(`<span>...</span>`);
    for (let i=start;i<=end;i++){
        container.append(`<button class="pageBtn ${i===currentPage?"active":""}" data-page="${i}">${i}</button>`);
    }
    if (end<totalPages) container.append(`<span>...</span>`);
    if (currentPage<totalPages){
        container.append(`<button class="pageBtn" data-page="${currentPage+1}">Next</button>`);
        container.append(`<button class="pageBtn" data-page="${totalPages}">>></button>`);
    }

    container.find(".pageBtn").click(function(){
        const page = parseInt($(this).data("page"));
        renderQuestions(page);
    });
}