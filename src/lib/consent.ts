export const COOKIE_STORAGE_KEY = "flybidesh-cookie-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "flybidesh:open-cookie-settings";

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
