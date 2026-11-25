// =====================================================
// server.js - Điểm khởi động của ứng dụng
// =====================================================
require('dotenv').config(); // đọc biến môi trường từ file .env (nếu có)

const path = require('path');
const express = require('express');
const taskRoutes = require('./routes/taskRoutes'); // import cũng sẽ khởi tạo database

const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép server đọc dữ liệu JSON gửi lên từ frontend
app.use(express.json());

// Phục vụ giao diện (HTML/CSS/JS) trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Các API bắt đầu bằng /api
app.use('/api', taskRoutes);

// API không tồn tại -> trả JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API không tồn tại.' });
});

// Xử lý lỗi chung (vd: JSON gửi lên bị sai cú pháp, lỗi database)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Dữ liệu JSON không hợp lệ.' });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Lỗi máy chủ, vui lòng thử lại.' });
});

app.listen(PORT, () => {
  console.log(`TODO App đang chạy tại http://localhost:${PORT}`);
});
