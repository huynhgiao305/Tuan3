// =====================================================
// routes/taskRoutes.js - Các API RESTful cho công việc
// =====================================================
const express = require('express');
const { db, dateString } = require('../database/db');

const router = express.Router();

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['todo', 'doing', 'done'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// ---------- Hàm hỗ trợ ----------

// Kiểm tra chuỗi ngày YYYY-MM-DD có hợp lệ không (vd: 2026-02-31 là không hợp lệ)
function isValidDate(value) {
  if (!DATE_REGEX.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

// Kiểm tra dữ liệu đầu vào. Trả về { error } hoặc { data } đã được làm sạch.
function validateTask(body, { partial = false } = {}) {
  const data = {};

  if (!partial || body.title !== undefined) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) return { error: 'Tên công việc là bắt buộc.' };
    if (title.length > 200) return { error: 'Tên công việc tối đa 200 ký tự.' };
    data.title = title;
  }
  if (!partial || body.description !== undefined) {
    const description = body.description == null ? '' : String(body.description).trim();
    if (description.length > 1000) return { error: 'Mô tả tối đa 1000 ký tự.' };
    data.description = description;
  }
  if (!partial || body.due_date !== undefined) {
    const due = body.due_date ? String(body.due_date).trim() : '';
    if (due && !isValidDate(due)) {
      return { error: 'Ngày đến hạn không hợp lệ (định dạng YYYY-MM-DD).' };
    }
    data.due_date = due || null;
  }
  if (!partial || body.priority !== undefined) {
    const priority = body.priority || 'medium';
    if (!PRIORITIES.includes(priority)) return { error: 'Mức độ ưu tiên không hợp lệ.' };
    data.priority = priority;
  }
  if (!partial || body.status !== undefined) {
    const status = body.status || 'todo';
    if (!STATUSES.includes(status)) return { error: 'Trạng thái không hợp lệ.' };
    data.status = status;
  }
  return { data };
}

// Tạo câu truy vấn lọc từ query string (search, status, priority, due_date, view)
// Luôn dùng tham số "?" để tránh SQL Injection
function buildFilter(query, forcedDueDate) {
  const where = [];
  const params = [];

  if (query.search && String(query.search).trim()) {
    where.push('title LIKE ?');
    params.push('%' + String(query.search).trim() + '%');
  }
  if (query.status) {
    if (!STATUSES.includes(query.status)) return { error: 'Trạng thái lọc không hợp lệ.' };
    where.push('status = ?');
    params.push(query.status);
  }
  if (query.priority) {
    if (!PRIORITIES.includes(query.priority)) return { error: 'Mức độ ưu tiên lọc không hợp lệ.' };
    where.push('priority = ?');
    params.push(query.priority);
  }
  const dueDate = forcedDueDate || query.due_date;
  if (dueDate) {
    if (!DATE_REGEX.test(dueDate)) return { error: 'Ngày lọc không hợp lệ.' };
    where.push('due_date = ?');
    params.push(dueDate);
  }
  if (query.view === 'overdue') {
    // Quá hạn: ngày đến hạn trước hôm nay và chưa hoàn thành
    where.push("due_date IS NOT NULL AND due_date < ? AND status != 'done'");
    params.push(dateString(0));
  } else if (query.view === 'active') {
    where.push("status != 'done'");
  }

  const sql = where.length ? 'WHERE ' + where.join(' AND ') : '';
  return { sql, params };
}

const ORDER_BY = 'ORDER BY (due_date IS NULL), due_date ASC, id DESC';

function sendList(res, filter) {
  if (filter.error) return res.status(400).json({ success: false, message: filter.error });
  const tasks = db.prepare(`SELECT * FROM tasks ${filter.sql} ${ORDER_BY}`).all(...filter.params);
  res.json({ success: true, data: tasks });
}

// ---------- API ----------

// GET /api/tasks - Danh sách công việc (có tìm kiếm + lọc)
router.get('/tasks', (req, res) => {
  sendList(res, buildFilter(req.query));
});

// GET /api/tasks/today - Công việc có ngày đến hạn là hôm nay
// (phải khai báo TRƯỚC /tasks/:id để không bị nhầm "today" là id)
router.get('/tasks/today', (req, res) => {
  sendList(res, buildFilter(req.query, dateString(0)));
});

// GET /api/tasks/:id - Chi tiết một công việc
router.get('/tasks/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Không tìm thấy công việc.' });
  res.json({ success: true, data: task });
});

// POST /api/tasks - Thêm công việc
router.post('/tasks', (req, res) => {
  const { error, data } = validateTask(req.body || {});
  if (error) return res.status(400).json({ success: false, message: error });

  const result = db
    .prepare('INSERT INTO tasks (title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?)')
    .run(data.title, data.description, data.due_date, data.priority, data.status);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, message: 'Đã thêm công việc.', data: task });
});

// PUT /api/tasks/:id - Cập nhật công việc (có thể gửi một phần trường, vd chỉ đổi status)
router.put('/tasks/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!current) return res.status(404).json({ success: false, message: 'Không tìm thấy công việc.' });

  const { error, data } = validateTask(req.body || {}, { partial: true });
  if (error) return res.status(400).json({ success: false, message: error });

  const merged = { ...current, ...data };
  db.prepare(
    'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ?'
  ).run(merged.title, merged.description, merged.due_date, merged.priority, merged.status, current.id);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(current.id);
  res.json({ success: true, message: 'Đã cập nhật công việc.', data: task });
});

// DELETE /api/tasks/:id - Xóa công việc
router.delete('/tasks/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy công việc.' });
  }
  res.json({ success: true, message: 'Đã xóa công việc.' });
});

// GET /api/statistics - Số liệu thống kê (tính trực tiếp từ database)
router.get('/statistics', (req, res) => {
  const count = (sql, ...params) => db.prepare(sql).get(...params).n;

  const total = count('SELECT COUNT(*) AS n FROM tasks');
  const done = count("SELECT COUNT(*) AS n FROM tasks WHERE status = 'done'");
  const doing = count("SELECT COUNT(*) AS n FROM tasks WHERE status = 'doing'");
  const todo = count("SELECT COUNT(*) AS n FROM tasks WHERE status = 'todo'");
  const overdue = count(
    "SELECT COUNT(*) AS n FROM tasks WHERE due_date IS NOT NULL AND due_date < ? AND status != 'done'",
    dateString(0)
  );

  res.json({
    success: true,
    data: {
      total,
      done,
      doing,
      todo,
      overdue,
      completionRate: total ? Math.round((done / total) * 100) : 0,
      byPriority: {
        low: count("SELECT COUNT(*) AS n FROM tasks WHERE priority = 'low'"),
        medium: count("SELECT COUNT(*) AS n FROM tasks WHERE priority = 'medium'"),
        high: count("SELECT COUNT(*) AS n FROM tasks WHERE priority = 'high'"),
      },
    },
  });
});

module.exports = router;
