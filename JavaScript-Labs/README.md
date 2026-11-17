# Tổng hợp Bài thực hành JavaScript & jQuery (Lab 08 – Lab 10)

Repository này lưu trữ toàn bộ mã nguồn các bài thực hành về lập trình JavaScript cơ bản, thao tác DOM, xử lý sự kiện và thư viện jQuery dựa theo giáo trình *Fundamentals of Web Development (2nd Ed)*.

---

## 1. Thông tin sinh viên

* **Họ và tên:** Nguyễn Thị Huỳnh Giao
* **Mã số sinh viên:** 31231021714
* **Lớp:** BV0001
* **Học phần:** 26C1INF50902701

---

## 2. Mục tiêu thực hiện 03 bài Lab

* Nắm vững cú pháp nền tảng của JavaScript, cách tổ chức mã nguồn tách biệt với HTML và kỹ năng kiểm thử, gỡ lỗi (Debug) trên trình duyệt.
* Hiểu rõ cấu trúc cây DOM để truy xuất, cập nhật nội dung, thay đổi giao diện động và xử lý các tương tác của người dùng thông qua sự kiện (Events).
* Làm chủ quy trình kiểm tra dữ liệu đầu vào trên biểu mẫu (Form Validation) nhằm nâng cao trải nghiệm và tính chính xác của dữ liệu.
* Ứng dụng thư viện jQuery để tối ưu thao tác DOM, xây dựng hiệu ứng chuyển động mượt mà và thực hiện các truy vấn bất đồng bộ (AJAX) với dữ liệu JSON.

---

## 3. Cấu trúc thư mục

Dự án được tổ chức theo cấu trúc chuẩn như sau:

```text
JavaScript-Labs/
├── css/                # Chứa các tệp CSS định dạng giao diện trang điều hướng chính
├── js/                 # Chứa các tệp JavaScript dùng chung (nếu có)
├── Lab08/              # Mã nguồn bài thực hành 08 (JavaScript Language Foundations)
├── Lab09/              # Mã nguồn bài thực hành 09 (DOM Manipulation & Events)
├── Lab10/              # Mã nguồn bài thực hành 10 (jQuery & AJAX Requests)
├── index.html          # Trang chủ tổng hợp, điều hướng nhanh đến từng bài Lab
└── README.md           # Tài liệu mô tả dự án và hướng dẫn kiểm tra
```

---

## 4. Mô tả ngắn gọn nội dung từng Lab

### 🔹 Lab 08 – JavaScript 1: Language Foundations
* **Nội dung chính:** Làm quen với cách nhúng JavaScript (Embedded & External), sử dụng thẻ `<noscript>` và công cụ Browser Console để theo dõi biến/bắt lỗi.
* **Kỹ thuật thực hành:** Làm việc với các đối tượng dựng sẵn (`String`, `Date`, `Math`), thao tác trên mảng (`push`, `unshift`, duyệt vòng lặp), xây dựng hàm có tham số, phạm vi biến (Scope), hàm ẩn danh (Anonymous Functions), khởi tạo đối tượng (Object Literal & Constructor) và mảng đối tượng.

### 🔹 Lab 09 – JavaScript 2: DOM and Events
* **Nội dung chính:** Chuyển từ xuất dữ liệu thô sang thao tác trực tiếp trên mô hình đối tượng tài liệu (DOM) và phản hồi hành động người dùng.
* **Kỹ thuật thực hành:** Truy xuất phần tử bằng `getElementById`, `querySelector`, `querySelectorAll`; duyệt quan hệ cha – con trong cây DOM; tạo/xóa nút phần tử động; đăng ký bộ lắng nghe sự kiện (`addEventListener`) cho các sự kiện `load`, `click`, `mouseover`, `focus`, `blur`; xây dựng chức năng kiểm tra dữ liệu trống trên Form đăng ký (`Form Validation`) và đặt điểm dừng (Breakpoints) để gỡ lỗi.

### 🔹 Lab 10 – JavaScript 3: jQuery
* **Nội dung chính:** Sử dụng thư viện jQuery để rút gọn mã nguồn xử lý giao diện và kết nối dữ liệu từ máy chủ.
* **Kỹ thuật thực hành:** Tích hợp jQuery qua CDN kèm tệp dự phòng cục bộ; sử dụng bộ chọn cơ bản và nâng cao; xâu chuỗi sự kiện (`.on()`, `.off()`); chèn phần tử động (`.append()`, `.prepend()`, `.after()`); tạo hiệu ứng hiển thị (`fadeIn`, `fadeOut`, `slideToggle`, `animate`, phóng to ảnh xem trước khi di chuột); gửi yêu cầu bất đồng bộ `$.get()` và xử lý trạng thái phản hồi qua đối tượng `jqXHR` (`.done()`, `.fail()`, `.always()`).

---

## 5. Đường dẫn GitHub Pages


👉 **Link:** `https://<username>.github.io/JavaScript-Labs/`


---
