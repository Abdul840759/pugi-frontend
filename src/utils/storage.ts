const TOKEN_KEY = 'pugi_access_token';
const REFRESH_KEY = 'pugi_refresh_token';
const USER_KEY = 'pugi_user';
const ADMIN_TOKEN_KEY = 'pugi_admin_token';

export const storage = {
  getAccessToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setAccessToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_KEY, token),
  getUser: <T>(): T | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  setUser: <T>(user: T) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getAdminToken: (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY),
  setAdminToken: (token: string) => localStorage.setItem(ADMIN_TOKEN_KEY, token),
  clearAdminToken: () => localStorage.removeItem(ADMIN_TOKEN_KEY),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },
};
