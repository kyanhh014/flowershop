# Demo cửa hàng hoa Hoa Xinh

Demo giao diện cửa hàng hoa viết bằng HTML, CSS và JavaScript thuần. Khách chưa đăng nhập có thể xem `home.html` và `customer-products.html`; các trang giỏ hàng, đặt hàng và chức năng theo vai trò yêu cầu đăng nhập. Sau khi đăng nhập, người dùng được điều hướng tới các tệp HTML riêng theo vai trò và chức năng. Mỗi trang chức năng có thể chỉnh riêng; `styles.css` và `app.js` dùng chung để giữ giao diện và hành vi nhất quán.

## Chạy demo

Do trình duyệt cần tải `accounts.json`, hãy chạy demo qua máy chủ tĩnh tại thư mục dự án:

```sh
python -m http.server 8000
```

Sau đó mở [http://localhost:8000](http://localhost:8000) để đăng nhập, hoặc [http://localhost:8000/home.html](http://localhost:8000/home.html) để vào trang chủ công khai.

## Khách chưa đăng nhập

Khách có thể xem trang chủ (`home.html`) và danh mục sản phẩm (`customer-products.html`) mà không cần tài khoản. Danh mục chỉ hiển thị thông tin và giá tham khảo, không có thao tác thêm giỏ hàng hay đặt mua. Các trang giỏ hàng, theo dõi đơn và đặt hàng yêu cầu phiên khách hàng; nếu chưa đăng nhập, demo sẽ chuyển về trang đăng nhập.

## Tài khoản dùng thử

Tất cả tài khoản dùng chung mật khẩu `hoaxinh123`.

| Vai trò | Số điện thoại |
| --- | --- |
| Chủ cửa hàng | `0901234561` |
| Khách hàng | `0901234562` |
| Nhân viên bán | `0901234563` |
| Nhân viên CSKH | `0901234564` |
| Nhân viên kho | `0901234565` |

Sau khi đăng nhập, vai trò được lưu trong `sessionStorage` của tab trình duyệt hiện tại và được khôi phục từ `accounts.json`; đăng xuất sẽ xóa phiên. Tệp JSON chỉ là dữ liệu demo công khai, không có backend, xác thực thật hay phân quyền an toàn.

## Tệp trang theo vai trò

Mỗi trang có tên theo mẫu `<vai-tro>-<chuc-nang>.html`, ví dụ `customer-cart.html`, `owner-daily-flowers.html`, `sales-new-orders.html`, `support-reply-contact.html` và `warehouse-stock-in.html`. Sửa phần nội dung/metadata của từng trang riêng; dùng chung `styles.css` cho kiểu dáng và `app.js` cho điều hướng/khung giao diện.

## Chức năng theo vai trò

- **Khách hàng:** `customer-register.html`, `customer-products.html`, `customer-cart.html`, `customer-orders.html`, `customer-place-order.html`, `customer-reviews.html`, `customer-contact.html`.
- **Chủ cửa hàng:** `owner-product-catalog.html`, `owner-daily-flowers.html`, `owner-users.html`, `owner-stats.html`, `owner-promotions.html`.
- **Nhân viên bán:** `sales-new-orders.html`, `sales-confirm-orders.html`, `sales-order-status.html`, `sales-invoices.html`, `sales-delivery.html`.
- **Nhân viên CSKH:** `support-reply-contact.html`, `support-find-users.html`, `support-find-orders.html`, `support-reply-reviews.html`.
- **Nhân viên kho:** `warehouse-stock-in.html`, `warehouse-stock-loss.html`, `warehouse-stock-in-report.html`, `warehouse-stock-report.html`, `warehouse-loss-report.html`.

Các tệp chức năng hiện là khung demo để thể hiện điều hướng và bố cục; chưa kết nối backend hoặc xử lý nghiệp vụ thật. Đăng ký khách hàng mẫu lưu số điện thoại và tên trong `localStorage` của trình duyệt.
