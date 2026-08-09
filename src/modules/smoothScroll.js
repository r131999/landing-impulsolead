export function initSmoothScroll() {
  document.querySelectorAll('[data-scroll-to]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetSelector = trigger.getAttribute('data-scroll-to');
      const target = document.querySelector(targetSelector);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
