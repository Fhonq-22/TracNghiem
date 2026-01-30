function show(message) {
    alert(message);
}

export const THONGBAO = {
    CanDangNhap() {
        show("Bạn cần đăng nhập để tiếp tục.");
    },

    HetHanPhien() {
        show("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
    },

    KhongDuQuyen() {
        show("Bạn không có quyền truy cập trang này.");
    },

    CanDongYDieuKhoan() {
        show("Bạn cần đồng ý với điều khoản sử dụng trước khi tiếp tục.");
    }
};