export function initDistributionAnimation() {
  const distribution = document.querySelector('[data-distribution]');
  if (!distribution) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (!('IntersectionObserver' in window)) {
    distribution.classList.add('is-playing');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        distribution.classList.toggle('is-playing', entry.isIntersecting);
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(distribution);
}
