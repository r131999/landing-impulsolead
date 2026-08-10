export function initHeroCardAnimation() {
  const visual = document.querySelector('[data-hero-visual]');
  if (!visual) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const setPlaying = (playing) => {
    visual.classList.toggle('is-playing', playing && document.visibilityState === 'visible');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setPlaying(entry.isIntersecting));
      },
      { threshold: 0.3 }
    );
    observer.observe(visual);
  } else {
    setPlaying(true);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      visual.classList.remove('is-playing');
    } else if (visual.getBoundingClientRect().top < window.innerHeight) {
      setPlaying(true);
    }
  });
}
