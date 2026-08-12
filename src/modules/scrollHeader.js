const SCROLL_THRESHOLD = 12;

export function initScrollHeader() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  let ticking = false;

  function update() {
    ticking = false;
    topbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  update();

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
}
