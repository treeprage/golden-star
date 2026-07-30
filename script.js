// ========================================
// MOBILE MENU TOGGLE
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".mobile-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("active");
      const icon = this.querySelector("i");
      if (nav.classList.contains("active")) {
        icon.className = "fas fa-times";
      } else {
        icon.className = "fas fa-bars";
      }
    });
  }

  const navLinks = document.querySelectorAll(".nav-list a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove("active");
        const icon = toggle.querySelector("i");
        icon.className = "fas fa-bars";
      }
    });
  });
});

// ========================================
// HEADER SCROLL EFFECT
// ========================================
window.addEventListener("scroll", function () {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ========================================
// ANIMATED COUNTERS
// ========================================
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseFloat(counter.dataset.count);
    const isFloat = target % 1 !== 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    let current = 0;
    const increment = target / steps;

    const updateCounter = () => {
      current += increment;
      if (current >= target) {
        counter.textContent = isFloat ? target.toFixed(1) : target;
        return;
      }
      counter.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
      requestAnimationFrame(updateCounter);
    };

    updateCounter();
  });
}

setTimeout(animateCounters, 500);

// ========================================
// REVIEWS SLIDER
// ========================================
let currentReview = 0;
const reviewsGrid = document.getElementById("reviewsGrid");
const reviewCards = reviewsGrid
  ? reviewsGrid.querySelectorAll(".review-card")
  : [];
const totalReviews = reviewCards.length;
const counter = document.querySelector(".review-counter");

function showReview(index) {
  if (!reviewsGrid || totalReviews === 0) return;
  const offset = -index * 100;
  reviewsGrid.style.transform = `translateX(${offset}%)`;
  reviewsGrid.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";

  if (counter) {
    counter.textContent = `${index + 1} / ${totalReviews}`;
  }
}

function nextReview() {
  if (totalReviews === 0) return;
  currentReview = (currentReview + 1) % totalReviews;
  showReview(currentReview);
}

function prevReview() {
  if (totalReviews === 0) return;
  currentReview = (currentReview - 1 + totalReviews) % totalReviews;
  showReview(currentReview);
}

const nextBtn = document.querySelector(".review-btn.next");
const prevBtn = document.querySelector(".review-btn.prev");

if (nextBtn) nextBtn.addEventListener("click", nextReview);
if (prevBtn) prevBtn.addEventListener("click", prevReview);

let autoSlide = setInterval(nextReview, 5000);

const sliderContainer = document.querySelector(".reviews-slider");
if (sliderContainer) {
  sliderContainer.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
  });
  sliderContainer.addEventListener("mouseleave", () => {
    autoSlide = setInterval(nextReview, 5000);
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ========================================
// MODAL WINDOW
// ========================================
const modal = document.getElementById("bookingModal");
const modalClose = document.getElementById("modalClose");
const openButtons = document.querySelectorAll(".open-modal");

// Открытие модального окна
openButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

// Закрытие модального окна
function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);

// Закрытие по клику на оверлей
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Закрытие по ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

// ========================================
// FLATPICKR - ДАТЫ
// ========================================
if (typeof flatpickr !== "undefined") {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateFrom = flatpickr("#dateFrom", {
    locale: "ru",
    dateFormat: "d.m.Y",
    minDate: today,
    defaultDate: today,
    onChange: function (selectedDates, dateStr, instance) {
      if (dateStr) {
        const minDate = new Date(selectedDates[0]);
        minDate.setDate(minDate.getDate() + 1);
        dateTo.set("minDate", minDate);
        if (
          dateTo.selectedDates.length > 0 &&
          dateTo.selectedDates[0] < minDate
        ) {
          dateTo.clear();
        }
      }
    },
  });

  const dateTo = flatpickr("#dateTo", {
    locale: "ru",
    dateFormat: "d.m.Y",
    minDate: tomorrow,
    defaultDate: tomorrow,
  });
}

// ========================================
// FORM VALIDATION
// ========================================
const form = document.getElementById("bookingForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;
  const requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    const errorElement = field.parentElement.querySelector(".error-message");
    field.classList.remove("error");
    if (errorElement) {
      errorElement.classList.remove("visible");
    }

    if (!field.value.trim()) {
      isValid = false;
      field.classList.add("error");
      if (errorElement) {
        errorElement.classList.add("visible");
      }
    }

    // Дополнительная валидация для email
    if (field.type === "email" && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        isValid = false;
        field.classList.add("error");
        if (errorElement) {
          errorElement.textContent = "Пожалуйста, введите корректный email";
          errorElement.classList.add("visible");
        }
      }
    }

    // Валидация телефона
    if (field.type === "tel" && field.value.trim()) {
      const phoneRegex = /^[\+\d\s\(\)-]{10,20}$/;
      if (!phoneRegex.test(field.value.trim())) {
        isValid = false;
        field.classList.add("error");
        if (errorElement) {
          errorElement.textContent =
            "Пожалуйста, введите корректный номер телефона";
          errorElement.classList.add("visible");
        }
      }
    }
  });

  if (!isValid) {
    showToast("Пожалуйста, заполните все обязательные поля", "error");
    return;
  }

  // Успешная отправка
  showToast(
    "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
    "success",
  );
  form.reset();
  setTimeout(closeModal, 3000);
});

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type} active`;
  const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("active");
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

// ========================================
// PHONE MASK (упрощенный)
// ========================================
document.getElementById("phone")?.addEventListener("input", function (e) {
  let value = this.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  let formatted = "";
  if (value.length > 0) {
    formatted = "+7 (";
    if (value.length > 1) {
      formatted += value.slice(1, 4);
      if (value.length > 4) {
        formatted += ") " + value.slice(4, 7);
        if (value.length > 7) {
          formatted += "-" + value.slice(7, 9);
          if (value.length > 9) {
            formatted += "-" + value.slice(9, 11);
          }
        }
      }
    }
  }
  this.value = formatted || "";
});

// ========================================
// VIDEO CONTROL (пауза/воспроизведение)
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".hero-video");
  const videoControl = document.getElementById("videoControl");

  if (video && videoControl) {
    // Ставим видео на паузу если пользователь кликнул
    videoControl.addEventListener("click", function () {
      const icon = this.querySelector("i");
      if (video.paused) {
        video.play();
        icon.className = "fas fa-pause";
      } else {
        video.pause();
        icon.className = "fas fa-play";
      }
    });

    // Автоматически скрываем кнопку через 3 секунды
    let hideTimeout;

    function showControl() {
      videoControl.style.opacity = "1";
      videoControl.style.transform = "translateY(0)";
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        videoControl.style.opacity = "0.5";
        videoControl.style.transform = "translateY(10px)";
      }, 3000);
    }

    // Показываем кнопку при движении мыши
    document.addEventListener("mousemove", showControl);
    document.addEventListener("touchstart", showControl);

    // Показываем при наведении на видео
    video.addEventListener("mouseenter", showControl);
    video.addEventListener("touchstart", showControl);

    // Скрываем если видео закончилось
    video.addEventListener("ended", function () {
      video.play();
    });

    // Иконка состояния
    video.addEventListener("play", function () {
      videoControl.querySelector("i").className = "fas fa-pause";
    });

    video.addEventListener("pause", function () {
      videoControl.querySelector("i").className = "fas fa-play";
    });
  }
});

// ========================================
// АНИМАЦИЯ ПРИ ЗАГРУЗКЕ
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  const title = document.querySelector(".hero-title");
  const subtitle = document.querySelector(".hero-subtitle");

  // Появление заголовка
  if (title) {
    setTimeout(() => {
      title.classList.add("visible");
    }, 300);
  }

  // Появление подзаголовка с задержкой
  if (subtitle) {
    setTimeout(() => {
      subtitle.classList.add("visible");
    }, 600);
  }
});
// ========================================
// АНИМАЦИЯ ПРИ СКРОЛЛЕ
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  // Выбираем все элементы с классом для анимации
  const elements = document.querySelectorAll(
    ".fade-on-scroll, .fade-left, .fade-right, .fade-scale",
  );

  // Настройки Observer
  const options = {
    root: null, // viewport
    rootMargin: "0px 0px -100px 0px", // Срабатывает когда элемент чуть выше нижнего края
    threshold: 0.1, // 10% элемента видно
  };

  // Создаём Observer
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Можно раскомментировать, чтобы после появления не отслеживать
        // observer.unobserve(entry.target);
      }
    });
  }, options);

  // Начинаем следить за каждым элементом
  elements.forEach((element) => {
    observer.observe(element);
  });
});
console.log("⭐ Золотая Звезда — сайт загружен!");
console.log("📞 +7 (901) 235-80-02");
console.log("🌐 info@bele-star.ru");
