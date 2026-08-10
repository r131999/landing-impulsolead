const COUNT_UP_DURATION_MS = 1200;
const COUNT_SELECTOR = '[data-count-to]';

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

function animateCount(el) {
  const target = Number(el.getAttribute('data-count-to'));
  if (!Number.isFinite(target)) return;

  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / COUNT_UP_DURATION_MS, 1);
    const value = Math.round(target * easeOutQuad(progress));
    el.textContent = value.toLocaleString('pt-BR');

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

export function initCountUp() {
  const elements = document.querySelectorAll(COUNT_SELECTOR);
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((el) => {
      const target = Number(el.getAttribute('data-count-to'));
      if (Number.isFinite(target)) el.textContent = target.toLocaleString('pt-BR');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  elements.forEach((el) => observer.observe(el));
}
