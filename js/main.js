document.addEventListener("DOMContentLoaded", () => {
  // 1. Lời chào tự động theo khung giờ thực tế
  const greetingEl = document.getElementById("dynamicGreeting");
  if (greetingEl) {
    const hour = new Date().getHours();
    let greetingText = "Chào buổi tối! Chúc thầy/cô xem bài vui vẻ.";
    if (hour >= 5 && hour < 12) {
      greetingText = "Chào buổi sáng! Chúc thầy/cô một ngày làm việc hiệu quả.";
    } else if (hour >= 12 && hour < 18) {
      greetingText = "Chào buổi chiều! Chào mừng đến với Portfolio JavaScript Labs.";
    }
    greetingEl.textContent = greetingText;
  }

  // 2. Chuyển đổi giao diện Sáng / Tối (lưu vào localStorage)
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      themeIcon.textContent = "🌙";
      localStorage.setItem("portfolio-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      themeIcon.textContent = "☀️";
      localStorage.setItem("portfolio-theme", "dark");
    }
  });

  // 3. Mở/đóng Menu trên màn hình điện thoại
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("navMenu");

  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => navMenu.classList.remove("open"));
  });

  // 4. Sao chép nhanh Mã số sinh viên + hiển thị Toast
  const copyIdBtn = document.getElementById("copyIdBtn");
  const studentIdEl = document.getElementById("studentId");
  const toastEl = document.getElementById("toast");

  copyIdBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(studentIdEl.textContent.trim());
      toastEl.classList.add("show");
      setTimeout(() => toastEl.classList.remove("show"), 2200);
    } catch (err) {
      console.error("Không thể sao chép:", err);
    }
  });

  // 5. Bộ lọc danh sách bài Lab (Tất cả / Lab 08 / Lab 09 / Lab 10)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const labCards = document.querySelectorAll(".lab-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");
      labCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || filterValue === category) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // 6. Đóng/mở danh sách Exercise chi tiết trong từng thẻ Lab
  const toggleExButtons = document.querySelectorAll(".toggle-ex-btn");
  toggleExButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const drawer = document.getElementById(targetId);
      const isHidden = drawer.classList.toggle("hidden");
      btn.textContent = isHidden
        ? "Xem danh sách Exercise ▾"
        : "Thu gọn danh sách ▴";
    });
  });
});