# TODO App - Quản lý công việc cá nhân

Website quản lý công việc cá nhân xây dựng bằng **Node.js + Express + SQLite**, giúp theo dõi trạng thái và tiến độ hoàn thành công việc.

## 1. Mục tiêu xây dựng

- Thực hành xây dựng một ứng dụng web đầy đủ: giao diện (frontend) – máy chủ (backend) – cơ sở dữ liệu.
- Hiểu cách frontend giao tiếp với backend qua RESTful API.
- Lưu dữ liệu lâu dài bằng SQLite (không mất khi tải lại trang hoặc khởi động lại server).

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | HTML5, CSS3, JavaScript thuần (không framework), Chart.js (biểu đồ, tải từ CDN) |
| Backend | Node.js, Express.js, RESTful API, dotenv |
| Database | SQLite (thư viện `better-sqlite3`) |

## 3. Danh sách chức năng

- Thêm, xem, sửa, xóa công việc (có thông báo thành công/thất bại, hộp thoại xác nhận trước khi xóa).
- Đổi nhanh trạng thái công việc ngay trên thẻ: Cần làm / Đang thực hiện / Hoàn thành.
- Xem công việc **hôm nay** (tự lấy ngày của hệ thống).
- Tìm kiếm theo tên; lọc theo trạng thái, mức ưu tiên, ngày đến hạn; kết hợp nhiều bộ lọc; nút **Xóa bộ lọc**.
- Phân loại: Tổng quan (chưa hoàn thành), Hôm nay, Tất cả, Đã hoàn thành, Quá hạn.
- Trang **Thống kê**: tổng số, đã hoàn thành, đang thực hiện, chưa bắt đầu, quá hạn, tỷ lệ hoàn thành (%), biểu đồ theo trạng thái và theo mức ưu tiên.
- Dữ liệu mẫu tự động nạp ở lần chạy đầu tiên.
- Giao diện responsive (máy tính và điện thoại).

> **Công việc quá hạn** = có ngày đến hạn trước hôm nay và chưa hoàn thành.

## 4. Cấu trúc thư mục

```
todo-app/
├── public/
│   ├── index.html          # Giao diện
│   ├── css/style.css       # Kiểu dáng
│   └── js/app.js           # Logic giao diện, gọi API
├── database/
│   ├── db.js               # Kết nối SQLite, tạo bảng, dữ liệu mẫu
│   └── todo.db             # (tự động tạo, không đưa lên GitHub)
├── routes/
│   └── taskRoutes.js       # Các API /api/tasks, /api/statistics
├── docs/                   # Ảnh minh họa giao diện
├── server.js               # Khởi động server Express
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 5. Cài đặt

1. Cài **Node.js** (phiên bản 18 trở lên, khuyến nghị bản LTS) tại https://nodejs.org. Kiểm tra:
   ```bash
   node -v
   npm -v
   ```
2. Mở terminal trong thư mục dự án và cài thư viện:
   ```bash
   npm install
   ```
3. (Tùy chọn) Đổi cổng chạy: sao chép `.env.example` thành `.env` và sửa `PORT`.

## 6. Chạy chương trình

```bash
npm start
```

Mở trình duyệt tại **http://localhost:3000**.

Lần chạy đầu tiên, file `database/todo.db` được tạo tự động cùng 12 công việc mẫu. Muốn đưa dữ liệu về ban đầu, tắt server, xóa file `database/todo.db` rồi chạy lại.

> Biểu đồ ở trang Thống kê dùng Chart.js tải từ CDN nên cần có Internet; các chức năng khác chạy bình thường khi offline.

## 7. Hướng dẫn sử dụng

- **Thêm công việc**: bấm *+ Thêm công việc*, nhập tên (bắt buộc), mô tả, ngày đến hạn, mức ưu tiên, trạng thái rồi *Lưu*.
- **Sửa / Xóa**: bấm *Sửa* hoặc *Xóa* trên thẻ công việc (xóa sẽ hỏi xác nhận).
- **Đổi trạng thái**: chọn trạng thái ở danh sách thả xuống trên thẻ.
- **Tìm kiếm & lọc**: gõ vào ô tìm kiếm hoặc chọn bộ lọc; bấm *Xóa bộ lọc* để hiển thị lại toàn bộ.
- **Chuyển màn hình**: dùng menu bên trái (Tổng quan, Hôm nay, Tất cả, Đã hoàn thành, Quá hạn, Thống kê).

### API

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| GET | `/api/tasks` | Danh sách (query: `search`, `status`, `priority`, `due_date`, `view=overdue\|active`) |
| GET | `/api/tasks/today` | Công việc hôm nay |
| GET | `/api/tasks/:id` | Chi tiết |
| POST | `/api/tasks` | Thêm |
| PUT | `/api/tasks/:id` | Cập nhật (có thể gửi một phần trường) |
| DELETE | `/api/tasks/:id` | Xóa |
| GET | `/api/statistics` | Thống kê |

Giá trị hợp lệ: `priority` = `low` / `medium` / `high`; `status` = `todo` / `doing` / `done`; `due_date` dạng `YYYY-MM-DD`.


