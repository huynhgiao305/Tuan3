// =====================================================
// database/db.js - Kết nối SQLite, tạo bảng và dữ liệu mẫu
// =====================================================
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'todo.db');

// Kiểm tra TRƯỚC khi mở: file todo.db đã tồn tại chưa?
// Chỉ nạp dữ liệu mẫu ở lần chạy đầu tiên (để khi người dùng xóa hết công việc,
// khởi động lại server sẽ không tự thêm dữ liệu mẫu nữa).
const isFirstRun = !fs.existsSync(DB_PATH);

const db = new Database(DB_PATH);

// Tự động tạo bảng tasks nếu chưa có
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    due_date    TEXT,                                   -- định dạng YYYY-MM-DD
    priority    TEXT,                                   -- low | medium | high
    status      TEXT,                                   -- todo | doing | done
    created_at  DATETIME DEFAULT (datetime('now','localtime'))
  )
`);

// Trả về chuỗi ngày YYYY-MM-DD theo giờ máy, cộng thêm "offset" ngày
function dateString(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Dữ liệu mẫu: ngày đến hạn tính theo hôm nay để luôn có công việc "hôm nay" và "quá hạn"
function seedSampleData() {
  const samples = [
    ['Nộp báo cáo môn Lập trình Web', 'Hoàn thiện báo cáo và nộp trên hệ thống LMS', 0, 'high', 'doing'],
    ['Học bài Express.js', 'Xem lại phần routing và middleware', 0, 'medium', 'todo'],
    ['Tập thể dục buổi sáng', 'Chạy bộ 30 phút quanh công viên', 0, 'low', 'done'],
    ['Làm bài tập SQL', 'Hoàn thành 10 câu truy vấn JOIN', -2, 'high', 'todo'],
    ['Đăng ký học phần học kỳ mới', 'Đăng ký trước hạn của phòng đào tạo', -1, 'high', 'todo'],
    ['Họp nhóm đồ án', 'Phân chia công việc cho các thành viên', 1, 'medium', 'todo'],
    ['Thiết kế giao diện trang chủ', 'Dùng HTML/CSS, có responsive', 2, 'medium', 'doing'],
    ['Đọc tài liệu Node.js', 'Đọc phần module và npm', 3, 'low', 'todo'],
    ['Chuẩn bị slide thuyết trình', 'Khoảng 10 slide, có demo', 5, 'high', 'todo'],
    ['Mua sách tham khảo', 'Sách về JavaScript nâng cao', 7, 'low', 'todo'],
    ['Cài đặt Node.js và VS Code', 'Chuẩn bị môi trường lập trình', -5, 'medium', 'done'],
    ['Tạo repository GitHub', 'Đưa mã nguồn dự án lên GitHub', -3, 'medium', 'done'],
  ];

  const insert = db.prepare(
    'INSERT INTO tasks (title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?)'
  );
  samples.forEach(([title, description, offset, priority, status]) => {
    insert.run(title, description, dateString(offset), priority, status);
  });
}

if (isFirstRun) {
  seedSampleData();
  console.log('Đã tạo database mới và nạp dữ liệu mẫu.');
}

module.exports = { db, dateString };
