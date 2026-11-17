export const AUTH_ENDPOINTS = {
  ME: '/auth/me',
  LOGOUT: '/auth/logout',
  GOOGLE_SIGN_IN: '/auth/google',
};

export const AUTH_QUERY_KEYS = {
  CURRENT_USER: ['auth', 'me'],
} as const;
