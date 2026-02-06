export const HANHVI = {
    ROI_TAB: { CODE: "ROI_TAB", LABEL: "Rời khỏi tab", LEVEL: "HIGH" },
    ROI_CUA_SO: { CODE: "ROI_CUA_SO", LABEL: "Chuyển cửa sổ", LEVEL: "HIGH" },

    COPY: { CODE: "COPY", LABEL: "Sao chép", LEVEL: "HIGH" },
    PASTE: { CODE: "PASTE", LABEL: "Dán", LEVEL: "HIGH" },
    CHUOT_PHAI: { CODE: "CHUOT_PHAI", LABEL: "Chuột phải", LEVEL: "MEDIUM" },

    DEVTOOLS: { CODE: "DEVTOOLS", LABEL: "Mở DevTools", LEVEL: "HIGH" },
    DEVTOOLS_NGHI_VAN: { CODE: "DEVTOOLS_NGHI_VAN", LABEL: "Nghi ngờ DevTools", LEVEL: "HIGH" },

    VIEW_SOURCE: { CODE: "VIEW_SOURCE", LABEL: "Xem mã nguồn", LEVEL: "HIGH" },
    PHIM_TAT_NGHI_VAN: { CODE: "PHIM_TAT_NGHI_VAN", LABEL: "Phím tắt bất thường", LEVEL: "MEDIUM" },

    RELOAD_TRANG: { CODE: "RELOAD_TRANG", LABEL: "Tải lại trang", LEVEL: "HIGH" },
    DONG_TRANG: { CODE: "DONG_TRANG", LABEL: "Thoát khi làm bài", LEVEL: "HIGH" },

    RESIZE_MAN_HINH: { CODE: "RESIZE_MAN_HINH", LABEL: "Resize màn hình", LEVEL: "LOW" },

    MAT_MANG: { CODE: "MAT_MANG", LABEL: "Mất mạng", LEVEL: "LOW" },
    CO_MANG_LAI: { CODE: "CO_MANG_LAI", LABEL: "Có lại mạng", LEVEL: "LOW" },

    CHUYEN_UNG_DUNG: { CODE: "CHUYEN_UNG_DUNG", LABEL: "Chuyển ứng dụng", LEVEL: "HIGH" },
    KHOA_MAN_HINH: { CODE: "KHOA_MAN_HINH", LABEL: "Khóa màn hình", LEVEL: "HIGH" },
    DOI_HUONG_MAN_HINH: { CODE: "DOI_HUONG_MAN_HINH", LABEL: "Đổi hướng màn hình", LEVEL: "LOW" },
    AN_BAN_PHIM: { CODE: "AN_BAN_PHIM", LABEL: "Ẩn/hiện bàn phím", LEVEL: "MEDIUM" },
    CHAM_DA_NGON: { CODE: "CHAM_DA_NGON", LABEL: "Chạm đa ngón", LEVEL: "MEDIUM" }
};

let isHidden = false;
let danhSachHanhVi = [];

function ghiNhan(hanhVi) {
    danhSachHanhVi.push({
        Code: hanhVi.CODE,
        Level: hanhVi.LEVEL,
        ThoiGian: new Date().toISOString()
    });
}

export function khoiTaoGiamSatHanhVi() {

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            isHidden = true;
            ghiNhan(HANHVI.KHOA_MAN_HINH);
        } else if (isHidden) {
            ghiNhan(HANHVI.ROI_TAB);
            isHidden = false;
        }
    });

    window.addEventListener("blur", () => {
        ghiNhan(HANHVI.CHUYEN_UNG_DUNG);
    });

    document.addEventListener("copy", () => ghiNhan(HANHVI.COPY));
    document.addEventListener("paste", () => ghiNhan(HANHVI.PASTE));

    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        ghiNhan(HANHVI.CHUOT_PHAI);
    });

    document.addEventListener("keydown", (e) => {
        const k = e.key.toUpperCase();

        if (k === "F12" || (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(k))) {
            ghiNhan(HANHVI.DEVTOOLS);
        }

        if (e.ctrlKey && k === "U") ghiNhan(HANHVI.VIEW_SOURCE);
        if (e.ctrlKey && ["A", "F", "S", "P"].includes(k)) ghiNhan(HANHVI.PHIM_TAT_NGHI_VAN);
        if (k === "F5" || (e.ctrlKey && k === "R")) ghiNhan(HANHVI.RELOAD_TRANG);
    });

    window.addEventListener("beforeunload", () => {
        ghiNhan(HANHVI.DONG_TRANG);
    });

    window.addEventListener("resize", () => {
        ghiNhan(HANHVI.RESIZE_MAN_HINH);
    });

    window.addEventListener("orientationchange", () => {
        ghiNhan(HANHVI.DOI_HUONG_MAN_HINH);
    });

    window.addEventListener("offline", () => ghiNhan(HANHVI.MAT_MANG));
    window.addEventListener("online", () => ghiNhan(HANHVI.CO_MANG_LAI));

    document.addEventListener("touchstart", (e) => {
        if (e.touches.length > 1) {
            ghiNhan(HANHVI.CHAM_DA_NGON);
        }
    });

    let lastHeight = window.innerHeight;
    setInterval(() => {
        if (Math.abs(window.innerHeight - lastHeight) > 150) {
            ghiNhan(HANHVI.AN_BAN_PHIM);
            lastHeight = window.innerHeight;
        }
    }, 500);

    setInterval(() => {
        if (window.outerWidth - window.innerWidth > 160) {
            ghiNhan(HANHVI.DEVTOOLS_NGHI_VAN);
        }
    }, 1000);
}

export function layDanhSachHanhVi() {
    return danhSachHanhVi;
}