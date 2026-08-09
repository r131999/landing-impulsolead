export function initFunnelAnimation() {
  const funnel = document.querySelector('[data-funnel]');
  if (!funnel) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const setPlaying = (playing) => {
    funnel.classList.toggle('is-playing', playing && document.visibilityState === 'visible');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setPlaying(entry.isIntersecting));
      },
      { threshold: 0.3 }
    );
    observer.observe(funnel);
  } else {
    setPlaying(true);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      funnel.classList.remove('is-playing');
    } else if (funnel.getBoundingClientRect().top < window.innerHeight) {
      setPlaying(true);
    }
  });
}
