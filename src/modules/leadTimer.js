const START_SECONDS = 37;
const FROZEN_LABEL = '00:47';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function initLeadTimer() {
  const el = document.querySelector('[data-lead-timer]');
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = FROZEN_LABEL;
    return;
  }

  let seconds = START_SECONDS;
  let intervalId = null;

  function tick() {
    seconds += 1;
    el.textContent = formatTime(seconds);
  }

  function start() {
    if (intervalId) return;
    intervalId = setInterval(tick, 1000);
  }

  function stop() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  }

  const target = el.closest('.hole-card') || el;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && document.visibilityState === 'visible') {
            start();
          } else {
            stop();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(target);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') stop();
  });
}
