import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/animations.css';
import './styles/sections/hero.css';
import './styles/sections/problema.css';
import './styles/sections/buracos.css';
import './styles/sections/solucao.css';
import './styles/sections/objecao.css';
import './styles/sections/prova-social.css';
import './styles/sections/cta-form.css';

import { initScrollReveal } from './modules/scrollReveal.js';
import { initFunnelAnimation } from './modules/funnelAnimation.js';
import { initDistributionAnimation } from './modules/distributionAnimation.js';
import { initSmoothScroll } from './modules/smoothScroll.js';
import { initContactForm } from './modules/form.js';

function init() {
  initScrollReveal();
  initFunnelAnimation();
  initDistributionAnimation();
  initSmoothScroll();
  initContactForm();

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
