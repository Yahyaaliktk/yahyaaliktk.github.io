/* ═══════════════════════════════════════════
   YAHYA ALI — MOTION, CRAFT & IMPACT
   GSAP + ScrollTrigger + Lenis smooth scroll
   ═══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const finePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;

/* ───────── LENIS SMOOTH SCROLL ───────── */
const lenis = reduceMotion
  ? {
      on() {},
      raf() {},
      scrollTo(target) {
        if (typeof target === "number") window.scrollTo(0, target);
        else if (target) target.scrollIntoView();
      },
      stop() {},
      start() {},
    }
  : new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* Anchor links → lenis scroll */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("hash") || a.hash);
    if (!target) return;
    e.preventDefault();
    document.body.classList.remove("menu-open");
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  });
});

/* ───────── CUSTOM CURSOR (desktop only) ───────── */
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
const motionOK = finePointer && !reduceMotion;
let mx = innerWidth / 2,
  my = innerHeight / 2;
let rx = mx,
  ry = my;

if (motionOK) {
  addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  (function cursorLoop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(cursorLoop);
  })();
}

function bindHoverables() {
  document.querySelectorAll(".hoverable, a, button").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });
}
bindHoverables();

/* ───────── LIQUID (GOO) CURSOR TRAIL ───────── */
const gooDots = document.querySelectorAll(".goo-dot");
const gooPos = Array.from(gooDots, () => ({
  x: innerWidth / 2,
  y: innerHeight / 2,
}));
let gooStretch = 0;
const gooBurst = { v: 1 }; /* scale multiplier animated on click */

if (motionOK) {
  (function gooLoop() {
    let tx = mx,
      ty = my;
    gooPos.forEach((p, i) => {
      /* each blob chases the one before it — creates the liquid tail */
      const ease = 0.42 - i * 0.032;
      p.x += (tx - p.x) * ease;
      p.y += (ty - p.y) * ease;
      tx = p.x;
      ty = p.y;
    });

    /* stretch the lead blob along its velocity for a fluid squash effect */
    const vx = gooPos[0].x - gooPos[2].x;
    const vy = gooPos[0].y - gooPos[2].y;
    const speed = Math.min(Math.hypot(vx, vy), 60);
    gooStretch += (speed - gooStretch) * 0.15;
    const angle = Math.atan2(vy, vx);
    const sx = 1 + gooStretch * 0.012;
    const sy = Math.max(1 - gooStretch * 0.006, 0.72);

    gooDots.forEach((d, i) => {
      const p = gooPos[i];
      const burst = 1 + (gooBurst.v - 1) * (1 - i * 0.09);
      if (i === 0) {
        d.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%,-50%) rotate(${angle}rad) scale(${sx * burst}, ${sy * burst})`;
      } else {
        d.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%,-50%) scale(${burst})`;
      }
    });
    requestAnimationFrame(gooLoop);
  })();

  /* liquid burst on click — the blob swells and snaps back like a droplet */
  addEventListener("mousedown", () => {
    gsap.killTweensOf(gooBurst);
    gsap.to(gooBurst, { v: 1.8, duration: 0.16, ease: "power2.out" });
    gsap.to(gooBurst, {
      v: 1,
      duration: 0.5,
      delay: 0.16,
      ease: "elastic.out(1, 0.4)",
    });
  });
}

/* ───────── PRELOADER ───────── */
const preloader = document.getElementById("preloader");
const plCounter = document.getElementById("plCounter");
const plBar = document.getElementById("plBar");
let plProgress = { v: 0 };
let plReady = false;
let plClosed = false;

function closePreloader() {
  if (!plReady || plClosed || !preloader) return;
  plClosed = true;
  preloader.classList.add("is-done");
  startHero();
  setTimeout(() => preloader.remove(), 900);
}

if (reduceMotion) {
  plCounter.textContent = "100";
  plBar.style.width = "100%";
  plReady = true;
  closePreloader();
} else {
  gsap.to(plProgress, {
    v: 100,
    duration: 2.2,
    ease: "power2.inOut",
    onUpdate: () => {
      const n = Math.round(plProgress.v);
      plCounter.textContent = String(n).padStart(3, "0");
      plBar.style.width = n + "%";
    },
    onComplete: () => {
      plReady = true;
    },
  });
  preloader.addEventListener("click", closePreloader);
  /* auto-dismiss fallback after 4s */
  setTimeout(closePreloader, 4000);
}

/* ───────── HERO ENTRANCE ───────── */
function startHero() {
  if (reduceMotion) {
    gsap.set(".hc-word span", { opacity: 1, y: 0 });
    gsap.set(".hero-portrait", { opacity: 1, yPercent: 0 });
    gsap.set(".hero-intro p", { opacity: 1, y: 0 });
    return;
  }
  gsap.to(".hc-word span", {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.045,
    delay: 0.2,
  });
  gsap.from(".hero-portrait", {
    yPercent: 24,
    opacity: 0,
    duration: 1.4,
    ease: "power3.out",
    delay: 0.15,
  });
  gsap.from(".hero-intro p", {
    y: 24,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    delay: 0.6,
  });
}

/* ───────── HERO ROLE ROTATOR ───────── */
const roles = document.querySelectorAll(".hero-role");
let roleIdx = 0;
if (!reduceMotion) {
  setInterval(() => {
    roles[roleIdx].classList.remove("is-active");
    roleIdx = (roleIdx + 1) % roles.length;
    roles[roleIdx].classList.add("is-active");
  }, 2600);
}

/* ───────── WORD-BY-WORD REVEAL ───────── */
document.querySelectorAll(".reveal-words, .reveal-words-big").forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
  const spans = el.querySelectorAll(".w");
  ScrollTrigger.create({
    trigger: el,
    start: "top 82%",
    end: "bottom 45%",
    scrub: 0.4,
    onUpdate: (self) => {
      const cut = Math.floor(self.progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle("on", i <= cut));
    },
  });
});

/* ───────── LETTER REVEAL (ENDING) ───────── */
document.querySelectorAll(".reveal-letters").forEach((el) => {
  const text = el.textContent.trim();
  el.innerHTML = text
    .split("")
    .map((c) => (c === " " ? " " : `<span class="lt">${c}</span>`))
    .join("");
  const letters = el.querySelectorAll(".lt");
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    end: "bottom 40%",
    scrub: 0.4,
    onUpdate: (self) => {
      const cut = Math.floor(self.progress * letters.length);
      letters.forEach((s, i) => s.classList.toggle("on", i <= cut));
    },
  });
});

/* ───────── ABOUT TITLE ───────── */
gsap.from(".at-line", {
  yPercent: 110,
  duration: 1.1,
  ease: "power4.out",
  stagger: 0.12,
  scrollTrigger: { trigger: ".about-title", start: "top 80%" },
});

/* ───────── STAT COUNTERS ───────── */
document.querySelectorAll(".stat-num").forEach((el) => {
  const target = +el.dataset.count;
  const obj = { v: 0 };
  const suffix = el.querySelector("i") ? "+" : "";
  ScrollTrigger.create({
    trigger: el,
    start: "top 78%",
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          el.innerHTML =
            String(Math.round(obj.v)).split("").join("&thinsp;&thinsp;") +
            `<i>${suffix}</i>`;
        },
      });
    },
  });
  ScrollTrigger.create({
    trigger: el,
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    onUpdate: (self) => gsap.set(el, { yPercent: (self.progress - 0.5) * -14 }),
  });
});

/* ───────── SERVICE TABS ───────── */
document.querySelectorAll(".service-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".service-tab")
      .forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    const active = tab.dataset.tab;
    document.querySelectorAll(".service-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === active);
    });
  });
});

/* ───────── MARQUEE SPEED ON SCROLL ───────── */
let scrollVel = 0;
lenis.on("scroll", (e) => {
  scrollVel = Math.min(Math.abs(e.velocity), 30);
});
gsap.ticker.add(() => {
  const boost = 1 + scrollVel * 0.06;
  document.querySelectorAll(".marquee-track, .skill-track").forEach((t) => {
    t.style.animationDuration = "";
    t.style.animationPlayState = "running";
  });
  scrollVel *= 0.92;
});

/* ───────── FALLING FIGURE PARALLAX ───────── */
gsap.to("#fallFigure", {
  y: 160,
  rotate: 30,
  ease: "none",
  scrollTrigger: {
    trigger: ".fall",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
  },
});

/* ───────── WORK — HORIZONTAL SCROLL ───────── */
const workTrack = document.getElementById("workTrack");
function workScrollDistance() {
  return workTrack.scrollWidth - innerWidth + innerWidth * 0.12;
}
gsap.to(workTrack, {
  x: () => -workScrollDistance(),
  ease: "none",
  scrollTrigger: {
    trigger: ".work",
    start: "top top",
    end: () => "+=" + workScrollDistance(),
    pin: ".work-pin",
    scrub: 1,
    invalidateOnRefresh: true,
  },
});

/* ───────── PROCESS TITLES ───────── */
document.querySelectorAll(".ps-title").forEach((el) => {
  gsap.from(el, {
    x: -60,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 82%" },
  });
});
document.querySelectorAll(".ps-num").forEach((el) => {
  gsap.to(el, {
    yPercent: -30,
    ease: "none",
    scrollTrigger: {
      trigger: el.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
});

/* ───────── PROCESS OUTRO IMAGE ───────── */
gsap.fromTo(
  ".process-standing img",
  { scale: 1.2, opacity: 0 },
  {
    scale: 1,
    opacity: 1,
    duration: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".process-outro",
      start: "top 85%",
      end: "top 30%",
      scrub: 1,
    },
  },
);

/* ───────── BLOG CARDS ───────── */
gsap.from(".blog-card", {
  y: 80,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
  stagger: 0.14,
  scrollTrigger: { trigger: ".blog-grid", start: "top 80%" },
});
gsap.from(".blog-title span", {
  yPercent: 60,
  opacity: 0,
  duration: 1,
  stagger: 0.12,
  ease: "power4.out",
  scrollTrigger: { trigger: ".blog-head", start: "top 80%" },
});

/* ───────── CONTACT TITLE ───────── */
gsap.from(".ct-line", {
  yPercent: 40,
  opacity: 0,
  duration: 1.2,
  stagger: 0.15,
  ease: "power4.out",
  scrollTrigger: { trigger: ".contact-title", start: "top 85%" },
});

/* ───────── MENU TOGGLE ───────── */
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuOverlay.setAttribute("aria-hidden", String(!open));
  menuOverlay.inert = !open;
  if (open) lenis.stop();
  else lenis.start();
}
menuToggle.addEventListener("click", () =>
  setMenu(!document.body.classList.contains("menu-open")),
);
document.querySelectorAll(".menu-link").forEach((l) =>
  l.addEventListener("click", () => setMenu(false)),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("menu-open"))
    setMenu(false);
});

/* ───────── BACK TO TOP ───────── */
document
  .getElementById("backToTop")
  .addEventListener("click", () => lenis.scrollTo(0, { duration: 1.8 }));

/* ───────── LOCAL TIME ───────── */
function tickClock() {
  const el = document.getElementById("localTime");
  if (el)
    el.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
}
tickClock();
setInterval(tickClock, 30000);

/* ───────── HERO PARALLAX ───────── */
gsap.to(".hero-portrait", {
  yPercent: 18,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
});
gsap.to(".hero-roles", {
  yPercent: -40,
  opacity: 0.2,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
});

/* ───────── CONTACT FORM (WhatsApp) ───────── */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !message) return;
    const text = `Hi Yahya, I'm ${name}. ${message}`;
    window.open(
      `https://wa.me/923439787366?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener",
    );
    const note = document.getElementById("cfNote");
    if (note)
      note.textContent = "WhatsApp opened — press send there to deliver it.";
    contactForm.reset();
  });
}

/* ───────── WORK / JOURNAL DETAIL MODAL ───────── */
const workBodies = [
  "A cinematic e-commerce build for a modern watch house — editorial layout, product storytelling and a checkout flow that stays out of the way.",
  "A 3D landing page for an electric motorcycle label, built around one long scroll and a single hero machine.",
  "A minimal portfolio system for a design studio: strong type, quiet motion and case studies that load fast.",
  "A warm brand site for a small-batch coffee roaster, with a menu, story and wholesale enquiry flow.",
  "A lightweight web app shell for a music collective, with a release timeline and embed-friendly pages.",
];
const blogBodies = [
  "Why motion should carry weight: pacing, restraint and the moment a transition earns its place. A short breakdown of timing, easing and when to do less.",
  "Designing dark interfaces without losing legibility: contrast, depth and the colour of black. Practical rules for text, borders and focus states.",
  "Interfaces that breathe: spacing, rhythm and small delays that make a page feel alive. How to add life without slowing the user down.",
];
const detailModal = document.getElementById("detailModal");
if (detailModal) {
  const dmImg = document.getElementById("dmImg");
  const dmTitle = document.getElementById("dmTitle");
  const dmMeta = document.getElementById("dmMeta");
  const dmBody = document.getElementById("dmBody");
  let lastFocus = null;

  const closeModal = () => {
    detailModal.classList.remove("is-open");
    detailModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lenis.start();
    if (lastFocus) lastFocus.focus();
  };

  const openModal = (card, index, isWork) => {
    const img = card.querySelector("img");
    const title = card.querySelector("h3");
    const meta = card.querySelector(".work-info span, .bc-date");
    dmImg.src = img ? img.currentSrc || img.src : "";
    dmImg.alt = img ? img.alt : "";
    dmTitle.textContent = title ? title.textContent : "";
    dmMeta.textContent = meta ? meta.textContent : "";
    dmBody.textContent = (isWork ? workBodies : blogBodies)[index] || "";
    lastFocus = document.activeElement;
    detailModal.classList.add("is-open");
    detailModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    lenis.stop();
    detailModal.querySelector(".dm-close").focus();
  };

  document.querySelectorAll(".work-card").forEach((card, i) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `Open ${card.querySelector("h3").textContent}`,
    );
    card.addEventListener("click", () => openModal(card, i, true));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card, i, true);
      }
    });
  });

  document.querySelectorAll(".blog-card").forEach((card, i) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `Open ${card.querySelector("h3").textContent}`,
    );
    card.addEventListener("click", () => openModal(card, i, false));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card, i, false);
      }
    });
  });

  detailModal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && detailModal.classList.contains("is-open"))
      closeModal();
  });
}

addEventListener("resize", () => ScrollTrigger.refresh());
