const loader = document.getElementById("loader");
const progress = document.getElementById("scrollProgress");
const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const projectTrack = document.getElementById("projectTrack");
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
const constellationCanvas = document.getElementById("constellationCanvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

let loaderHidden = false;

function hideLoader() {
  if (loaderHidden) return;
  loaderHidden = true;
  document.body.classList.add("is-ready");
  window.setTimeout(() => loader?.classList.add("is-hidden"), 280);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
} else {
  hideLoader();
}

window.addEventListener("load", hideLoader, { once: true });
window.setTimeout(hideLoader, 1400);

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.classList.toggle("is-open");
  mobileMenu?.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu?.setAttribute("aria-hidden", String(!isOpen));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.classList.remove("is-open");
    mobileMenu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    mobileMenu?.setAttribute("aria-hidden", "true");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      if (entry.target.classList.contains("skill-row")) {
        entry.target.classList.add("is-visible");
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal, .skill-row").forEach((item) => revealObserver.observe(item));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -48% 0px" });

sections.forEach((section) => navObserver.observe(section));

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateScrollEffects() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  if (progress) progress.style.width = `${Math.min(100, ratio * 100)}%`;
  document.documentElement.style.setProperty("--scroll-ratio", ratio.toFixed(4));
  document.documentElement.style.setProperty("--scan-offset", `${(ratio * -22).toFixed(1)}px`);
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();

let projectVelocity = 0;
let projectWheelFrame = 0;

function animateProjectMomentum() {
  if (!projectTrack) return;
  const maxScroll = projectTrack.scrollWidth - projectTrack.clientWidth;
  const next = clamp(projectTrack.scrollLeft + projectVelocity, 0, maxScroll);
  const hitEdge = next === 0 || next === maxScroll;

  projectTrack.scrollLeft = next;
  projectVelocity *= hitEdge ? 0 : 0.84;

  if (Math.abs(projectVelocity) > 0.35) {
    projectWheelFrame = requestAnimationFrame(animateProjectMomentum);
  } else {
    projectVelocity = 0;
    projectWheelFrame = 0;
  }
}

projectTrack?.addEventListener("wheel", (event) => {
  const maxScroll = projectTrack.scrollWidth - projectTrack.clientWidth;
  if (maxScroll <= 0) return;

  const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  const canMoveLeft = delta < 0 && projectTrack.scrollLeft > 0;
  const canMoveRight = delta > 0 && projectTrack.scrollLeft < maxScroll - 1;

  if (canMoveLeft || canMoveRight) {
    event.preventDefault();
    if (reduceMotion) {
      projectTrack.scrollLeft = clamp(projectTrack.scrollLeft + delta, 0, maxScroll);
      return;
    }

    projectVelocity += delta * 0.36;
    projectVelocity = clamp(projectVelocity, -46, 46);
    if (!projectWheelFrame) projectWheelFrame = requestAnimationFrame(animateProjectMomentum);
  }
}, { passive: false });

if (!reduceMotion && finePointer) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (cursorDot && cursorRing) {
      cursorDot.style.opacity = "1";
      cursorRing.style.opacity = "1";
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }

    const parallax = document.querySelector("[data-parallax]");
    if (parallax) {
      const rect = parallax.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      parallax.style.setProperty("--ry", `${x * 7}deg`);
      parallax.style.setProperty("--rx", `${y * -7}deg`);
    }
  }, { passive: true });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    if (cursorRing) cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("mouseenter", () => cursorRing?.classList.add("is-active"));
    item.addEventListener("mouseleave", () => cursorRing?.classList.remove("is-active"));
  });

  document.querySelectorAll(".timeline-card, .project-slide, .mini-project, .method-step, .skill-row, .contact__main, .contact__aside, .bio__image, .radar, .matchhub__visual").forEach((item) => {
    item.classList.add("is-tiltable");

    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      item.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
      item.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`);
      item.style.setProperty("--shine-x", `${x * 100}%`);
      item.style.setProperty("--shine-y", `${y * 100}%`);
    }, { passive: true });

    item.addEventListener("mouseleave", () => {
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
      item.style.setProperty("--shine-x", "50%");
      item.style.setProperty("--shine-y", "50%");
    });
  });

  document.querySelectorAll(".button, .header-cta, .project-slide a").forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 9;
      item.style.setProperty("--magnet-x", `${x.toFixed(1)}px`);
      item.style.setProperty("--magnet-y", `${y.toFixed(1)}px`);
    }, { passive: true });

    item.addEventListener("mouseleave", () => {
      item.style.setProperty("--magnet-x", "0px");
      item.style.setProperty("--magnet-y", "0px");
    });
  });
}

function initConstellation() {
  if (!constellationCanvas || reduceMotion) return;

  const context = constellationCanvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let nodes = [];
  const pointer = { x: -9999, y: -9999 };

  function makeNode() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      size: Math.random() * 1.5 + 0.45,
    };
  }

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    constellationCanvas.width = Math.floor(width * ratio);
    constellationCanvas.height = Math.floor(height * ratio);
    constellationCanvas.style.width = `${width}px`;
    constellationCanvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const targetCount = clamp(Math.round((width * height) / 26000), 34, 78);
    if (nodes.length > targetCount) {
      nodes = nodes.slice(0, targetCount);
    }
    while (nodes.length < targetCount) nodes.push(makeNode());
  }

  function drawLine(a, b, distance, maxDistance) {
    const opacity = (1 - distance / maxDistance) * 0.22;
    context.strokeStyle = `rgba(185, 133, 255, ${opacity.toFixed(3)})`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.stroke();
  }

  function animateConstellation() {
    context.clearRect(0, 0, width, height);
    const maxDistance = Math.min(170, Math.max(112, width * 0.12));

    nodes.forEach((node) => {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const pointerDistance = Math.hypot(dx, dy);

      if (pointerDistance < 180) {
        node.vx -= dx * 0.00008;
        node.vy -= dy * 0.00008;
      }

      node.x += node.vx;
      node.y += node.vy;
      node.vx *= 0.996;
      node.vy *= 0.996;

      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (distance < maxDistance) drawLine(nodes[i], nodes[j], distance, maxDistance);
      }
    }

    nodes.forEach((node) => {
      context.fillStyle = "rgba(255, 255, 255, .64)";
      context.shadowColor = "rgba(185, 133, 255, .55)";
      context.shadowBlur = 12;
      context.beginPath();
      context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      context.fill();
    });

    context.shadowBlur = 0;
    requestAnimationFrame(animateConstellation);
  }

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });
  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  animateConstellation();
}

initConstellation();

let isDragging = false;
let startX = 0;
let scrollLeft = 0;

projectTrack?.addEventListener("pointerdown", (event) => {
  if (window.innerWidth > 820) return;
  isDragging = true;
  startX = event.clientX;
  scrollLeft = projectTrack.scrollLeft;
  projectTrack.setPointerCapture(event.pointerId);
});

projectTrack?.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  projectTrack.scrollLeft = scrollLeft - (event.clientX - startX);
});

projectTrack?.addEventListener("pointerup", () => {
  isDragging = false;
});

projectTrack?.addEventListener("pointercancel", () => {
  isDragging = false;
});
