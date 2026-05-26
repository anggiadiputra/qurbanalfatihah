export const ADMIN_EMAIL = 'admin@alfatihah.com';
export const ADMIN_PASSWORD = '#Admin2026';
export const ADMIN_TOKEN = 'admin:qc_adm_alfatihah_2026';
export const EDITOR_EMAIL = 'DB@alfatihah.com';
export const EDITOR_PASSWORD = '#Santri99';
export const EDITOR_TOKEN = 'editor:qc_ed_alfatihah_2026';
export const VIEWER_TOKEN = 'viewer';
export const COOKIE_NAME = 'qurban_auth';

export function getRole(cookieValue: string | undefined): 'admin' | 'editor' | 'viewer' | null {
  if (cookieValue === ADMIN_TOKEN) return 'admin';
  if (cookieValue === EDITOR_TOKEN) return 'editor';
  if (cookieValue === VIEWER_TOKEN) return 'viewer';
  return null;
}
