// ========================================
// ОПТИМИЗИРОВАННЫЙ JS
// ========================================

(function () {
  "use strict";

  // Кэширование DOM-элементов
  const dom = {};

  function cacheElements() {
    dom.toggle = document.querySelector(".mobile-toggle");
    dom.nav = document.querySelector(".nav");
    dom.header = document.querySelector(".header");
    dom.modal = document.getElementById("bookingModal");
    dom.modalClose = document.getElementById("modalClose");
    dom.openButtons = document.querySelectorAll(".open-modal");
    dom.form = document.getElementById("bookingForm");
    dom.phone = document.getElementById("phone");
    dom.video = document.querySelector(".hero-video");
    dom.videoControl = document.getElementById("videoControl");
    dom.reviewsGrid = document.getElementById("reviewsGrid");
    dom.reviewCounter = document.querySelector(".review-counter");
    dom.reviewCards = dom.reviewsGrid
      ? dom.reviewsGrid.querySelectorAll(".review-card")
      : [];
    dom.heroTitle = document.querySelector(".hero-title");
    dom.heroSubtitle = document.querySelector(".hero-subtitle");
  }

  // ========================================
  // 1. MOBILE MENU
  // ========================================
  function initMobileMenu() {
    if (!dom.toggle || !dom.nav) return;

    dom.toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isActive = dom.nav.classList.toggle("active");
      const icon = this.querySelector("i");
      icon.className = isActive ? "fas fa-times" : "fas fa-bars";
    });

    document.querySelectorAll(".nav-list a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768 && dom.nav.classList.contains("active")) {
          dom.nav.classList.remove("active");
          dom.toggle.querySelector("i").className = "fas fa-bars";
        }
      });
    });
  }

  // ========================================
  // 2. HEADER SCROLL (оптимизированный)
  // ========================================
  let scrollTimeout;

  function initHeaderScroll() {
    if (!dom.header) return;

    window.addEventListener(
      "scroll",
      () => {
        if (scrollTimeout) return;
        scrollTimeout = requestAnimationFrame(() => {
          dom.header.classList.toggle("scrolled", window.scrollY > 50);
          scrollTimeout = null;
        });
      },
      { passive: true },
    );
  }

  // ========================================
  // 3. ANIMATED COUNTERS (ускоренные)
  // ========================================
  function initCounters() {
    const counters = document.querySelectorAll(".stat-number");
    if (!counters.length) return;

    let animated = false;

    const startAnimation = () => {
      if (animated) return;
      animated = true;

      counters.forEach((counter) => {
        const target = parseFloat(counter.dataset.count);
        const isFloat = target % 1 !== 0;
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;

          counter.textContent = isFloat
            ? current.toFixed(1)
            : Math.floor(current);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = isFloat ? target.toFixed(1) : target;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    };

    // Запуск при загрузке
    setTimeout(startAnimation, 300);

    // Перезапуск при прокрутке к секции
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            startAnimation();
          }
        });
      },
      { threshold: 0.3 },
    );

    const statsSection = document.querySelector(".hero-stats");
    if (statsSection) observer.observe(statsSection);
  }

  // ========================================
  // 4. REVIEWS SLIDER
  // ========================================
  function initReviewsSlider() {
    if (!dom.reviewsGrid || !dom.reviewCards.length) return;

    let currentIndex = 0;
    const total = dom.reviewCards.length;

    const showSlide = (index) => {
      dom.reviewsGrid.style.transform = `translateX(-${index * 100}%)`;
      if (dom.reviewCounter) {
        dom.reviewCounter.textContent = `${index + 1} / ${total}`;
      }
    };

    const next = () => {
      currentIndex = (currentIndex + 1) % total;
      showSlide(currentIndex);
    };

    const prev = () => {
      currentIndex = (currentIndex - 1 + total) % total;
      showSlide(currentIndex);
    };

    // Кнопки
    document.querySelector(".review-btn.next")?.addEventListener("click", next);
    document.querySelector(".review-btn.prev")?.addEventListener("click", prev);

    // Автослайд
    let autoSlide = setInterval(next, 5000);

    const container = dom.reviewsGrid.closest(".reviews-slider");
    if (container) {
      container.addEventListener("mouseenter", () => clearInterval(autoSlide));
      container.addEventListener("mouseleave", () => {
        clearInterval(autoSlide);
        autoSlide = setInterval(next, 5000);
      });
    }

    showSlide(0);
  }

  // ========================================
  // 5. SMOOTH SCROLL
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = dom.header?.offsetHeight || 80;
          const targetPos =
            target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({ top: targetPos, behavior: "smooth" });
        }
      });
    });
  }

  // ========================================
  // 6. MODAL WINDOW
  // ========================================
  function initModal() {
    if (!dom.modal || !dom.modalClose) return;

    const openModal = () => {
      dom.modal.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      dom.modal.classList.remove("active");
      document.body.style.overflow = "";
    };

    dom.openButtons.forEach((btn) => btn.addEventListener("click", openModal));
    dom.modalClose.addEventListener("click", closeModal);

    dom.modal.addEventListener("click", (e) => {
      if (e.target === dom.modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dom.modal.classList.contains("active")) {
        closeModal();
      }
    });
  }

  // ========================================
  // 7. FLATPICKR DATES
  // ========================================
  function initFlatpickr() {
    if (typeof flatpickr === "undefined") return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateFrom = flatpickr("#dateFrom", {
      locale: "ru",
      dateFormat: "d.m.Y",
      minDate: today,
      defaultDate: today,
      onChange: (dates) => {
        if (dates.length) {
          const minDate = new Date(dates[0]);
          minDate.setDate(minDate.getDate() + 1);
          dateTo.set("minDate", minDate);
          if (
            dateTo.selectedDates.length &&
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
  // 8. FORM VALIDATION
  // ========================================
  function initForm() {
    if (!dom.form) return;

    dom.form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      const required = this.querySelectorAll("[required]");

      required.forEach((field) => {
        const error = field.parentElement.querySelector(".error-message");
        field.classList.remove("error");
        if (error) error.classList.remove("visible");

        const value = field.value.trim();

        if (!value) {
          isValid = false;
          field.classList.add("error");
          if (error) error.classList.add("visible");
          return;
        }

        // Email
        if (
          field.type === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          isValid = false;
          field.classList.add("error");
          if (error) {
            error.textContent = "Введите корректный email";
            error.classList.add("visible");
          }
        }

        // Phone
        if (field.type === "tel" && !/^[\+\d\s\(\)-]{10,20}$/.test(value)) {
          isValid = false;
          field.classList.add("error");
          if (error) {
            error.textContent = "Введите корректный номер телефона";
            error.classList.add("visible");
          }
        }
      });

      if (!isValid) {
        showToast("Заполните все обязательные поля", "error");
        return;
      }

      showToast("Заявка отправлена! Мы свяжемся с вами.", "success");
      this.reset();
      setTimeout(() => {
        dom.modal?.classList.remove("active");
        document.body.style.overflow = "";
      }, 3000);
    });
  }

  // ========================================
  // 9. PHONE MASK
  // ========================================
  function initPhoneMask() {
    if (!dom.phone) return;

    dom.phone.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);

      let formatted = "";
      if (value.length) {
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
  }

  // ========================================
  // 10. VIDEO CONTROL
  // ========================================
  function initVideoControl() {
    if (!dom.video || !dom.videoControl) return;

    dom.videoControl.addEventListener("click", () => {
      const icon = dom.videoControl.querySelector("i");
      if (dom.video.paused) {
        dom.video.play();
        icon.className = "fas fa-pause";
      } else {
        dom.video.pause();
        icon.className = "fas fa-play";
      }
    });

    // Автоскрытие
    let hideTimer;

    const show = () => {
      dom.videoControl.style.opacity = "1";
      dom.videoControl.style.transform = "translateY(0)";
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        dom.videoControl.style.opacity = "0.5";
        dom.videoControl.style.transform = "translateY(10px)";
      }, 3000);
    };

    document.addEventListener("mousemove", show, { passive: true });
    dom.video.addEventListener("mouseenter", show);
    dom.video.addEventListener("play", () => {
      dom.videoControl.querySelector("i").className = "fas fa-pause";
    });
    dom.video.addEventListener("pause", () => {
      dom.videoControl.querySelector("i").className = "fas fa-play";
    });
    dom.video.addEventListener("ended", () => dom.video.play());
  }

  // ========================================
  // 11. HERO ANIMATION (ускоренная)
  // ========================================
  function initHeroAnimation() {
    if (dom.heroTitle) {
      setTimeout(() => dom.heroTitle.classList.add("visible"), 200);
    }
    if (dom.heroSubtitle) {
      setTimeout(() => dom.heroSubtitle.classList.add("visible"), 400);
    }
  }

  // ========================================
  // 12. SCROLL ANIMATION (оптимизированная, ускоренная)
  // ========================================
  function initScrollAnimation() {
    const elements = document.querySelectorAll(
      ".fade-on-scroll, .fade-left, .fade-right, .fade-scale",
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.05, // Ускоренное появление
      },
    );

    elements.forEach((el) => observer.observe(el));
  }

  // ========================================
  // 13. TOAST
  // ========================================
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon =
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("active"));

    setTimeout(() => {
      toast.classList.remove("active");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ========================================
  // 14. ИНИЦИАЛИЗАЦИЯ
  // ========================================
  document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    initMobileMenu();
    initHeaderScroll();
    initCounters();
    initReviewsSlider();
    initSmoothScroll();
    initModal();
    initFlatpickr();
    initForm();
    initPhoneMask();
    initVideoControl();
    initHeroAnimation();
    initScrollAnimation();

    console.log("⭐ Золотая Звезда — сайт загружен!");
    console.log("📞 +7 (901) 235-80-02");
    console.log("🌐 info@bele-star.ru");
  });
})();
