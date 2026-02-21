/**
 * Rutas de la API. Definición manual (sin introspección).
 * Actualizar al agregar nuevos módulos/controllers.
 */
const API = '';

export const ENDPOINTS = {
  HEALTH: { BASE: '/' },
  USERS: { BASE: '/users' },
  // TRANSACTIONS: { BASE: '/transactions' },
  // LEDGER: { BASE: '/ledger' },
};

export const paths = {
  health: `${API}${ENDPOINTS.HEALTH.BASE}`,
  users: `${API}${ENDPOINTS.USERS.BASE}`,
} ;
