/**
 * Zapis wyboru języka do cookie — funkcja modułowa, nie zamknięcie wewnątrz komponentu (ten sam
 * wzorzec co `zapiszTryb` w lib/theme/storage.ts: React Compiler nie pozwala mutować obiektów
 * spoza zasięgu komponentu — `document` — bezpośrednio w ciele komponentu/hooka).
 */
import { LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE_SECONDS, type Language } from "./language"

export function ustawCookieJezyka(jezyk: Language): void {
  if (typeof document === "undefined") return
  document.cookie = `${LANGUAGE_COOKIE}=${jezyk}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE_SECONDS}`
}
