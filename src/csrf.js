import { getLocalStorage } from "@openimis/fe-core";

const CSRF_COOKIE_PREFIX = "csrftoken=";

// The CSRF token the way fe-core's fetch action sends it: the live csrftoken cookie, else the
// token fe-core stored at login. Empty when neither exists.
export function csrfToken() {
  const cookie = typeof document === "undefined"
    ? undefined
    : document.cookie.split("; ").find((entry) => entry.startsWith(CSRF_COOKIE_PREFIX));
  if (cookie) return cookie.slice(CSRF_COOKIE_PREFIX.length);
  return getLocalStorage("csrfToken") || "";
}

// `headers` plus the token that the back end checks on the module's own REST requests.
export const withCsrf = (headers) => ({ ...headers, "X-CSRFToken": csrfToken() });
