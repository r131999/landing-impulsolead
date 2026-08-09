import { CONTACT_API_URL, CONTACT_REQUEST_TIMEOUT_MS } from '../config.js';
import { attachPhoneMask, isValidPhoneBR } from './phoneMask.js';

const VALIDATORS = {
  nome: (value) => {
    if (!value.trim()) return 'Informe seu nome.';
    if (value.trim().length < 2) return 'Nome muito curto.';
    return '';
  },
  whatsapp: (value) => {
    if (!value.trim()) return 'Informe seu WhatsApp.';
    if (!isValidPhoneBR(value)) return 'Número de WhatsApp inválido.';
    return '';
  },
  cargo: (value) => {
    if (!value) return 'Selecione seu cargo.';
    return '';
  }
};

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const feedback = document.getElementById('contact-form-feedback');
  const submitButton = form.querySelector('.contact-form__submit');
  const fields = {
    nome: form.elements.nome,
    whatsapp: form.elements.whatsapp,
    cargo: form.elements.cargo
  };

  attachPhoneMask(fields.whatsapp);

  Object.entries(fields).forEach(([name, field]) => {
    field.addEventListener('blur', () => validateField(name, field));
  });

  function validateField(name, field) {
    const error = VALIDATORS[name](field.value);
    const errorEl = document.getElementById(`error-${name}`);
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    if (errorEl) errorEl.textContent = error;
    return !error;
  }

  function validateAll() {
    let isValid = true;
    let firstInvalidField = null;

    Object.entries(fields).forEach(([name, field]) => {
      const fieldIsValid = validateField(name, field);
      if (!fieldIsValid && !firstInvalidField) {
        firstInvalidField = field;
      }
      isValid = isValid && fieldIsValid;
    });

    if (firstInvalidField) firstInvalidField.focus();
    return isValid;
  }

  function setState(state, message = '') {
    form.dataset.state = state;
    feedback.textContent = message;
    submitButton.disabled = state === 'loading';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateAll()) {
      setState('idle', '');
      return;
    }

    setState('loading', '');

    const payload = {
      nome: fields.nome.value.trim(),
      whatsapp: fields.whatsapp.value.trim(),
      cargo: fields.cargo.value
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONTACT_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      setState('success', 'Recebido! A gente entra em contato pelo WhatsApp em breve.');
    } catch (error) {
      setState(
        'error',
        'Não foi possível enviar agora. Tente novamente em instantes.'
      );
    } finally {
      clearTimeout(timeoutId);
    }
  });
}
