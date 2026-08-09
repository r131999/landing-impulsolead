export function onlyDigits(value) {
  return (value || '').replace(/\D/g, '');
}

export function formatPhoneBR(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits.replace(/^(\d*)$/, '($1');
  }
  if (digits.length <= 6) {
    return digits.replace(/^(\d{2})(\d*)$/, '($1) $2');
  }
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
  }
  return digits.replace(/^(\d{2})(\d{5})(\d*)$/, '($1) $2-$3');
}

export function isValidPhoneBR(value) {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
}

export function attachPhoneMask(input) {
  input.addEventListener('input', () => {
    const cursorAtEnd = input.selectionEnd === input.value.length;
    input.value = formatPhoneBR(input.value);
    if (cursorAtEnd) {
      input.selectionStart = input.selectionEnd = input.value.length;
    }
  });
}
