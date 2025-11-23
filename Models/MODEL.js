export class User {
    constructor(TenNguoiDung, MatKhau, HoTen, Email, NgayDangKy, VaiTro = "User") {
        this.TenNguoiDung = TenNguoiDung;
        this.MatKhau = MatKhau;
        this.HoTen = HoTen;
        this.Email = Email;
        this.NgayDangKy = NgayDangKy;
        this.VaiTro = VaiTro;
    }

    toJSON() {
        return {
            MatKhau: this.MatKhau,
            HoTen: this.HoTen,
            Email: this.Email,
            NgayDangKy: this.NgayDangKy,
            VaiTro: this.VaiTro
        };
    }
}