// Endpoint que recebe os dados do formulário de contato.
// O backend real é construído separadamente, no repositório do CRM — não existe aqui.
export const CONTACT_API_URL =
  import.meta.env.VITE_CONTACT_API_URL || 'https://api-crm.impulsoslz.com.br/api/landing/contato';

export const CONTACT_REQUEST_TIMEOUT_MS = 10000;
