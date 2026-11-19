import Lenis from "./vendor/lenis.js";

const header = document.querySelector(".site-header");
const progress = header.querySelector(".reading-progress");
const sections = [...header.querySelectorAll(".nav-links a")].map((link) => ({
  link,
  section: document.getElementById(link.hash.slice(1)),
}));

// Use the same scroll position for the reading indicator and the active chapter.
let currentLink;
let frame = 0;

function updateNavigation() {
  frame = 0;
  const root = document.scrollingElement;
  const maxScroll = root.scrollHeight - root.clientHeight;
  const fraction = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const chapterLine = Math.max(header.offsetHeight + 32, window.innerHeight * .28);
  const atEnd = maxScroll > 0 && window.scrollY >= maxScroll - 1;
  let activeLink;

  for (const { link, section } of sections) {
    if (!section.hidden && (atEnd || section.getBoundingClientRect().top <= chapterLine)) {
      activeLink = link;
    }
  }
  progress.style.setProperty("--read", Math.min(1, Math.max(0, fraction)));
  if (activeLink !== currentLink) {
    currentLink?.removeAttribute("aria-current");
    activeLink?.setAttribute("aria-current", "location");
    currentLink = activeLink;
  }
}

function scheduleUpdate() {
  if (!frame) frame = requestAnimationFrame(updateNavigation);
}

window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", scheduleUpdate);
window.addEventListener("pageshow", scheduleUpdate);
if ("ResizeObserver" in window) {
  new ResizeObserver(scheduleUpdate).observe(document.body);
}
scheduleUpdate();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let lenis;
let sectionsObserver;

function setMotionPreference() {
  lenis?.destroy();
  lenis = null;
  sectionsObserver?.disconnect();
  if (reduceMotion.matches) return;

  lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    lerp: .125,
    syncTouch: false,
    stopInertiaOnNavigate: true,
  });

  if ("IntersectionObserver" in window) {
    sectionsObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-entering");
        sectionsObserver.unobserve(entry.target);
      }
    }, { threshold: .2 });

    document.querySelectorAll("[data-reveal]:not(.is-entering)").forEach((heading) => {
      sectionsObserver.observe(heading);
    });
  }
}

reduceMotion.addEventListener("change", setMotionPreference);
setMotionPreference();
