/* =====================================================================
   Insurance Outfitters — interactions
   ===================================================================== */

const SITE_PASSWORD = "mydemo";

(function () {
  "use strict";

  const body = document.body;

  /* ---------- Password gate ---------- */
  const gate = document.getElementById("gate");
  const gateForm = document.getElementById("gate-form");
  const gateInput = document.getElementById("gate-input");

  function unlock() {
    gate.hidden = true;
    body.classList.remove("gated");
  }

  if (sessionStorage.getItem("fn-unlocked") === "1") {
    unlock();
  } else {
    body.classList.add("gated");
    // focus the input once painted
    window.requestAnimationFrame(() => gateInput && gateInput.focus());

    gateForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (gateInput.value === SITE_PASSWORD) {
        sessionStorage.setItem("fn-unlocked", "1");
        unlock();
      } else {
        gateInput.classList.remove("shake");
        // reflow to restart animation
        void gateInput.offsetWidth;
        gateInput.classList.add("shake");
        gateInput.value = "";
        gateInput.focus();
      }
    });
  }

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById("header");
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  function closeMenu() {
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
  }
  function toggleMenu() {
    const open = mobileNav.classList.toggle("open");
    mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  menuToggle.addEventListener("click", toggleMenu);
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  /* ---------- Scroll reveal + stagger ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  // apply stagger delays to items inside grids
  document.querySelectorAll(".cards, .team-grid").forEach((grid) => {
    grid.classList.add("stagger");
    grid.querySelectorAll(":scope > .reveal").forEach((el, i) => {
      el.style.setProperty("--stagger", i * 80 + "ms");
    });
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) =>
              l.classList.toggle("active", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".accordion__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion__item");
      const panel = item.querySelector(".accordion__panel");
      const isOpen = item.classList.contains("open");

      if (isOpen) {
        item.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      } else {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- Contact form (Formspree/Web3Forms-ready) ---------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async function (e) {
    // If the action still points at the placeholder, don't actually POST —
    // just show a friendly confirmation so the demo never errors.
    const action = form.getAttribute("action") || "";
    const isPlaceholder = action.includes("your-form-id") || action.trim() === "";

    if (isPlaceholder) {
      e.preventDefault();
      status.textContent = "Thanks! This is a demo form — connect Formspree or Web3Forms to receive messages.";
      status.className = "form-status success";
      form.reset();
      return;
    }

    // Real endpoint: submit via fetch for a smooth inline confirmation.
    e.preventDefault();
    status.textContent = "Sending…";
    status.className = "form-status";
    try {
      const res = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        status.textContent = "Thanks — we'll be in touch shortly.";
        status.className = "form-status success";
        form.reset();
      } else {
        throw new Error("Request failed");
      }
    } catch (err) {
      status.textContent = "Something went wrong. Please call us at 262-377-3200.";
      status.className = "form-status error";
    }
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
