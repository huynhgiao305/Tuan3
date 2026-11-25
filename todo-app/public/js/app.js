// =====================================================
// public/js/app.js - Logic giao diện, gọi API tới backend
// =====================================================

// ---------- Nhãn hiển thị tiếng Việt ----------
const STATUS_LABEL = { todo: 'Cần làm', doing: 'Đang thực hiện', done: 'Hoàn thành' };
const PRIORITY_LABEL = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

// ---------- Cấu hình từng màn hình (view) ở sidebar ----------
// url: API cần gọi, params: tham số cố định thêm vào
const VIEWS = {
  overview: { title: 'Tổng quan (công việc chưa hoàn thành)', url: '/api/tasks', params: { view: 'active' } },
  today:    { title: 'Công việc hôm nay', url: '/api/tasks/today', params: {}, hideDate: true },
  all:      { title: 'Tất cả công việc', url: '/api/tasks', params: {} },
  done:     { title: 'Công việc đã hoàn thành', url: '/api/tasks', params: { status: 'done' }, lockStatus: true },
  overdue:  { title: 'Công việc quá hạn', url: '/api/tasks', params: { view: 'overdue' } },
  stats:    { title: 'Thống kê' },
};

let currentView = 'overview';
let tasksCache = [];        // danh sách đang hiển thị (để mở form sửa)
let pendingDeleteId = null; // id công việc đang chờ xác nhận xóa
let statusChart = null;
let priorityChart = null;

// ---------- Hàm tiện ích ----------
const $ = (id) => document.getElementById(id);

// Ngày hôm nay theo giờ máy, dạng YYYY-MM-DD
function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Chống chèn mã HTML độc hại (XSS) khi hiển thị dữ liệu người dùng nhập
function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function formatDate(str) {
  if (!str) return 'Không có hạn';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

let toastTimer;
function showToast(message, isError = false) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Hàm gọi API chung: ném lỗi (kèm thông báo từ server) nếu thất bại
async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  let body = {};
  try { body = await res.json(); } catch (e) { /* không có JSON */ }
  if (!res.ok || body.success === false) {
    throw new Error(body.message || 'Có lỗi xảy ra, vui lòng thử lại.');
  }
  return body;
}

// ---------- Tiêu đề chào + ngày hiện tại ----------
function renderHeader() {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'buổi sáng' : hour < 18 ? 'buổi chiều' : 'buổi tối';
  $('greeting').textContent = `Chào ${part}, bạn!`;
  $('currentDate').textContent = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

// ---------- Thẻ thống kê nhanh ----------
async function loadQuickCards() {
  const { data } = await api('/api/statistics');
  $('cardTotal').textContent = data.total;
  $('cardTodo').textContent = data.todo;
  $('cardDoing').textContent = data.doing;
  $('cardDone').textContent = data.done;
}

// ---------- Danh sách công việc ----------
function taskHtml(t) {
  const isOverdue = t.due_date && t.due_date < todayString() && t.status !== 'done';
  const classes = ['task', 's-' + t.status];
  if (isOverdue) classes.push('is-overdue');

  const options = Object.keys(STATUS_LABEL)
    .map((k) => `<option value="${k}" ${k === t.status ? 'selected' : ''}>${STATUS_LABEL[k]}</option>`)
    .join('');

  return `
    <article class="${classes.join(' ')}">
      <div class="task-info">
        <div class="task-title">${escapeHtml(t.title)}</div>
        ${t.description ? `<div class="task-desc">${escapeHtml(t.description)}</div>` : ''}
        <div class="badges">
          <span class="badge p-${t.priority}">Ưu tiên: ${PRIORITY_LABEL[t.priority] || ''}</span>
          <span class="badge">${STATUS_LABEL[t.status] || ''}</span>
          <span class="badge due ${isOverdue ? 'late' : ''}">Hạn: ${formatDate(t.due_date)}${isOverdue ? ' (quá hạn)' : ''}</span>
        </div>
      </div>
      <div class="task-actions">
        <select data-action="status" data-id="${t.id}" aria-label="Đổi trạng thái">${options}</select>
        <div class="row-btn">
          <button class="btn" data-action="edit" data-id="${t.id}">Sửa</button>
          <button class="btn" data-action="delete" data-id="${t.id}">Xóa</button>
        </div>
      </div>
    </article>`;
}

// Đọc bộ lọc trên giao diện và ghép với tham số cố định của màn hình hiện tại
function buildQuery() {
  const view = VIEWS[currentView];
  const params = new URLSearchParams(view.params);

  const search = $('searchInput').value.trim();
  if (search) params.set('search', search);
  if (!view.lockStatus && $('filterStatus').value) params.set('status', $('filterStatus').value);
  if ($('filterPriority').value) params.set('priority', $('filterPriority').value);
  if (!view.hideDate && $('filterDate').value) params.set('due_date', $('filterDate').value);
  return params.toString();
}

async function loadTasks() {
  const view = VIEWS[currentView];
  try {
    const { data } = await api(`${view.url}?${buildQuery()}`);
    tasksCache = data;
    $('taskList').innerHTML = data.length
      ? data.map(taskHtml).join('')
      : '<div class="empty">Không có công việc nào phù hợp.</div>';
  } catch (err) {
    $('taskList').innerHTML = '<div class="empty">Không tải được dữ liệu.</div>';
    showToast(err.message, true);
  }
}

// Tải lại mọi thứ đang hiển thị (sau khi thêm/sửa/xóa)
async function refresh() {
  try {
    await loadQuickCards();
    if (currentView === 'stats') await loadStatistics();
    else await loadTasks();
  } catch (err) {
    showToast(err.message, true);
  }
}

// ---------- Chuyển màn hình ----------
function switchView(name) {
  currentView = name;
  const view = VIEWS[name];
  document.querySelectorAll('.menu-item').forEach((b) => b.classList.toggle('active', b.dataset.view === name));

  const isStats = name === 'stats';
  $('listSection').hidden = isStats;
  $('statsSection').hidden = !isStats;
  $('quickCards').hidden = isStats; // trang thống kê có bộ thẻ riêng

  if (!isStats) {
    $('viewTitle').textContent = view.title;
    // Ở màn "đã hoàn thành" khóa bộ lọc trạng thái; ở "hôm nay" ẩn lọc ngày
    const wasLocked = $('filterStatus').disabled;
    $('filterStatus').disabled = !!view.lockStatus;
    if (view.lockStatus) $('filterStatus').value = 'done';
    else if (wasLocked) $('filterStatus').value = ''; // rời khỏi màn "đã hoàn thành" -> bỏ khóa
    $('filterDate').hidden = !!view.hideDate;
  }
  refresh();
}

// ---------- Trang thống kê ----------
async function loadStatistics() {
  const { data } = await api('/api/statistics');
  $('sTotal').textContent = data.total;
  $('sDone').textContent = data.done;
  $('sDoing').textContent = data.doing;
  $('sTodo').textContent = data.todo;
  $('sOverdue').textContent = data.overdue;
  $('sRate').textContent = data.completionRate + '%';
  $('progressBar').style.width = data.completionRate + '%';

  // Chart.js được tải từ CDN; nếu không có Internet thì báo cho người dùng
  if (typeof Chart === 'undefined') {
    $('chartError').hidden = false;
    return;
  }
  $('chartError').hidden = true;

  if (statusChart) statusChart.destroy();
  if (priorityChart) priorityChart.destroy();

  statusChart = new Chart($('chartStatus'), {
    type: 'doughnut',
    data: {
      labels: ['Cần làm', 'Đang thực hiện', 'Hoàn thành'],
      datasets: [{ data: [data.todo, data.doing, data.done], backgroundColor: ['#64748b', '#f59e0b', '#16a34a'] }],
    },
    options: { plugins: { legend: { position: 'bottom' } } },
  });

  priorityChart = new Chart($('chartPriority'), {
    type: 'bar',
    data: {
      labels: ['Thấp', 'Trung bình', 'Cao'],
      datasets: [{
        label: 'Số công việc',
        data: [data.byPriority.low, data.byPriority.medium, data.byPriority.high],
        backgroundColor: ['#16a34a', '#f59e0b', '#dc2626'],
      }],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

// ---------- Hộp thoại thêm / sửa ----------
function openForm(task) {
  $('formError').hidden = true;
  $('dialogTitle').textContent = task ? 'Sửa công việc' : 'Thêm công việc';
  $('taskId').value = task ? task.id : '';
  $('fTitle').value = task ? task.title : '';
  $('fDescription').value = task ? task.description || '' : '';
  $('fDue').value = task ? task.due_date || '' : '';
  $('fPriority').value = task ? task.priority : 'medium';
  $('fStatus').value = task ? task.status : 'todo';
  $('taskDialog').showModal();
  $('fTitle').focus();
}

async function submitForm(event) {
  event.preventDefault();
  const id = $('taskId').value;
  const payload = {
    title: $('fTitle').value,
    description: $('fDescription').value,
    due_date: $('fDue').value,
    priority: $('fPriority').value,
    status: $('fStatus').value,
  };

  if (!payload.title.trim()) {
    $('formError').textContent = 'Vui lòng nhập tên công việc.';
    $('formError').hidden = false;
    return;
  }

  try {
    const result = await api(id ? `/api/tasks/${id}` : '/api/tasks', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
    $('taskDialog').close();
    showToast(result.message);
    refresh();
  } catch (err) {
    $('formError').textContent = err.message;
    $('formError').hidden = false;
  }
}

// ---------- Đổi trạng thái / xóa ----------
async function changeStatus(id, status) {
  try {
    await api(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    showToast('Đã đổi trạng thái công việc.');
  } catch (err) {
    showToast(err.message, true);
  }
  refresh();
}

function askDelete(id) {
  const task = tasksCache.find((t) => t.id === id);
  pendingDeleteId = id;
  $('confirmText').textContent = `Bạn có chắc muốn xóa "${task ? task.title : 'công việc này'}"? Thao tác không thể hoàn tác.`;
  $('confirmDialog').showModal();
}

async function confirmDelete() {
  $('confirmDialog').close();
  try {
    const result = await api(`/api/tasks/${pendingDeleteId}`, { method: 'DELETE' });
    showToast(result.message);
  } catch (err) {
    showToast(err.message, true);
  }
  pendingDeleteId = null;
  refresh();
}

// ---------- Gắn sự kiện ----------
function init() {
  renderHeader();

  $('menu').addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-item');
    if (btn) switchView(btn.dataset.view);
  });

  $('btnAdd').addEventListener('click', () => openForm(null));
  $('btnCancel').addEventListener('click', () => $('taskDialog').close());
  $('taskForm').addEventListener('submit', submitForm);

  $('btnConfirmNo').addEventListener('click', () => $('confirmDialog').close());
  $('btnConfirmYes').addEventListener('click', confirmDelete);

  // Các nút trong danh sách (dùng event delegation)
  $('taskList').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === 'edit') openForm(tasksCache.find((t) => t.id === id));
    if (btn.dataset.action === 'delete') askDelete(id);
  });
  $('taskList').addEventListener('change', (e) => {
    const sel = e.target.closest('select[data-action="status"]');
    if (sel) changeStatus(Number(sel.dataset.id), sel.value);
  });

  // Tìm kiếm (chờ 300ms sau khi gõ xong) và lọc
  let searchTimer;
  $('searchInput').addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadTasks, 300);
  });
  ['filterStatus', 'filterPriority', 'filterDate'].forEach((id) => $(id).addEventListener('change', loadTasks));

  $('btnClear').addEventListener('click', () => {
    $('searchInput').value = '';
    $('filterPriority').value = '';
    $('filterDate').value = '';
    if (!VIEWS[currentView].lockStatus) $('filterStatus').value = '';
    loadTasks();
  });

  switchView('overview');
}

init();
