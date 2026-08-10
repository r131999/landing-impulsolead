function hasFinePointer() {
  return window.matchMedia('(pointer: fine)').matches;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Spotlight que segue o cursor nos cards `.spotlight-card` (via --mx/--my). */
export function initSpotlightCards() {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  const cards = document.querySelectorAll('.spotlight-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x.toFixed(1)}%`);
      card.style.setProperty('--my', `${y.toFixed(1)}%`);
    });
  });
}

/** Inclinação 3D do hero que segue a posição do mouse (--tilt-x/--tilt-y do .media-frame). */
export function initHeroParallax() {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  const hero = document.querySelector('.hero');
  const frame = document.querySelector('.hero-visual-frame .media-frame');
  if (!hero || !frame) return;

  let lastEvent = null;
  let ticking = false;

  function apply() {
    ticking = false;
    if (!lastEvent) return;
    const rect = hero.getBoundingClientRect();
    const px = Math.min(Math.max((lastEvent.clientX - rect.left) / rect.width, 0), 1);
    const py = Math.min(Math.max((lastEvent.clientY - rect.top) / rect.height, 0), 1);
    const tiltY = -14 + px * 12;
    const tiltX = 1 + (1 - py) * 7;
    frame.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    frame.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
  }

  hero.addEventListener('mousemove', (event) => {
    lastEvent = event;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  });

  hero.addEventListener('mouseleave', () => {
    frame.style.removeProperty('--tilt-y');
    frame.style.removeProperty('--tilt-x');
  });
}
