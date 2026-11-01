# Demo cửa hàng hoa Hoa Xinh

Demo cửa hàng hoa viết bằng HTML, CSS và JavaScript thuần. Khách chưa đăng nhập có thể xem trang chủ và sản phẩm; các chức năng mua hàng và trang quản trị yêu cầu đăng nhập demo theo vai trò.

## Cấu trúc dự án

```text
flowershop/
├── assets/
│   └── images/             # Ảnh giao diện header và footer
├── css/
│   └── styles.css          # Kiểu dáng dùng chung
├── data/
│   └── accounts.json       # Tài khoản demo theo vai trò
├── js/
│   └── app.js              # Đăng nhập, điều hướng và khung chức năng
├── pages/
│   ├── customer/           # Các trang khách hàng
│   ├── owner/              # Các trang chủ cửa hàng
│   ├── sales/              # Các trang nhân viên bán
│   ├── support/            # Các trang nhân viên CSKH
│   └── warehouse/          # Các trang nhân viên kho
├── home.html               # Trang chủ công khai
└── index.html              # Trang đăng nhập
```

Hai ảnh giao diện được lưu tại `assets/images/header-web-ban-hoa.png` và `assets/images/footer-web-ban-hoa.png`.

## Chạy demo

Chạy máy chủ tĩnh tại thư mục dự án để trình duyệt tải được tệp JSON:

```sh
python -m http.server 8000
```

Mở [http://localhost:8000](http://localhost:8000) để đăng nhập hoặc [http://localhost:8000/home.html](http://localhost:8000/home.html) để xem trang chủ.

## Khách chưa đăng nhập

Khách có thể xem trang chủ (`home.html`) và danh mục sản phẩm (`pages/customer/customer-products.html`). Danh mục chỉ hiển thị thông tin và giá tham khảo, không có thao tác thêm giỏ hàng hay đặt mua. Các trang giỏ hàng, theo dõi đơn và đặt hàng yêu cầu phiên khách hàng; nếu chưa đăng nhập, demo sẽ chuyển về trang đăng nhập.

## Tài khoản dùng thử

Tất cả tài khoản dùng chung mật khẩu `hoaxinh123`.

| Vai trò | Số điện thoại |
| --- | --- |
| Chủ cửa hàng | `0901234561` |
| Khách hàng | `0901234562` |
| Nhân viên bán | `0901234563` |
| Nhân viên CSKH | `0901234564` |
| Nhân viên kho | `0901234565` |

Vai trò được lưu trong `sessionStorage` của tab trình duyệt và đối chiếu với `data/accounts.json`; đăng xuất sẽ xóa phiên. Đây là demo phía trình duyệt, không có backend hoặc phân quyền an toàn.

## Các trang chức năng

- **Khách hàng:** các trang `customer-*.html` nằm trong `pages/customer/`.
- **Chủ cửa hàng:** các trang `owner-*.html` nằm trong `pages/owner/`.
- **Nhân viên bán:** các trang `sales-*.html` nằm trong `pages/sales/`.
- **Nhân viên CSKH:** các trang `support-*.html` nằm trong `pages/support/`.
- **Nhân viên kho:** các trang `warehouse-*.html` nằm trong `pages/warehouse/`.

Các trang chức năng là khung giao diện demo; đăng ký khách hàng mẫu lưu tên và số điện thoại trong `localStorage`.
