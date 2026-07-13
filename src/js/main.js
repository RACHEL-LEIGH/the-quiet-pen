/**
 * The Quiet Pen — shared front-end behavior.
 * No frameworks: progressive enhancement over semantic HTML.
 */
(function () {
  "use strict";

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll-triggered reveal animations ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Accordions are native <details>/<summary> — no JS required to open,
     close, or (in supporting browsers) enforce one-open-per-group via the
     shared `name` attribute. Nothing to wire up here. */

  /* ---- Animated stat counters ---- */
  var statEls = document.querySelectorAll(".stat-number[data-count-to]");
  if (statEls.length) {
    var animateCount = function (el) {
      var target = parseFloat(el.dataset.countTo);
      var suffix = el.dataset.suffix || "";
      var duration = 1400;
      var start = null;

      var step = function (timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        var display = target % 1 === 0 ? Math.round(current) : current.toFixed(1);
        el.textContent = display + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var statObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      statEls.forEach(function (el) {
        statObserver.observe(el);
      });
    } else {
      statEls.forEach(animateCount);
    }
  }

  /* ---- Sticky mobile CTA: appear after hero ---- */
  var mobileCta = document.querySelector(".sticky-mobile-cta");
  var hero = document.querySelector("[data-hero]");
  if (mobileCta && hero && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          mobileCta.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(hero);
  } else if (mobileCta) {
    mobileCta.classList.add("is-visible");
  }

  /* ---- Newsletter form (client-side only placeholder) ---- */
  document.querySelectorAll("[data-newsletter-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var success = form.querySelector(".form-success");
      var fields = form.querySelector(".newsletter-form");
      if (fields) fields.style.display = "none";
      if (success) success.classList.add("is-visible");
    });
  });

  /* ---- Inquiry / contact form: submit + tasteful confetti ---- */
  var inquiryForm = document.querySelector("[data-inquiry-form]");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var formEl = inquiryForm.querySelector(".inquiry-form-fields");
      var success = inquiryForm.querySelector(".inquiry-success");
      if (formEl) formEl.style.display = "none";
      if (success) success.style.display = "block";
      launchConfetti();
      if (success) success.setAttribute("tabindex", "-1"), success.focus();
    });
  }

  /* ---- Tasteful confetti burst (brand palette, restrained) ---- */
  function launchConfetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    var colors = ["#7D9272", "#A8B5A2", "#B9BCC3", "#EFE9E1", "#2F3136"];
    var pieceCount = 70;
    var pieces = [];

    for (var i = 0; i < pieceCount; i++) {
      pieces.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
        y: window.innerHeight * 0.25,
        vx: (Math.random() - 0.5) * 7,
        vy: Math.random() * -8 - 3,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.22 + Math.random() * 0.08,
      });
    }

    var frame = 0;
    var maxFrames = 130;

    function tick() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces.forEach(function (p) {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames) {
        window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    }

    window.requestAnimationFrame(tick);
  }

  /* ---- Set current year in footer ---- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
