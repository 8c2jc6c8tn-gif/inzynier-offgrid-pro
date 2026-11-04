// English texts of ./app-strony.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./app-strony"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-LOG-KONTO-WYMAGANE-PIERWSZEGO":
    "An account is required from the first launch (docs/standards/18-logowanie.md, 18.1) — after a one-time sign-in the app works fully offline.",
  "UI-LOG-ZALOGUJ-GOOGLE": "Sign in with Google",
  "UI-LOG-ZALOGUJ-APPLE": "Sign in with Apple",
  "UI-LOG-ALBO-MAILEM-BEZ": "or by e-mail, without a password",
  "UI-LOG-SPRAWDZ-SKRZYNKE": "Check your inbox",
  "UI-LOG-WYSLALISMY-LINK-ZALOGOWANIA": "— we have sent you a sign-in link.",
  "UI-LOG-ZALOGUJ": "Sign in",
  "UI-LOG-ADRES-MAIL": "E-mail address",
  "UI-LOG-WYSYLANIE": "Sending…",
  "UI-LOG-WYSLIJ-LINK-ZALOGOWANIA": "Send a sign-in link",
  "UI-PUL-INZYNIER-OFFGRID-PRO": "☰ Inżynier Offgrid Pro",
  "UI-PUL-LOKALIZACJA-TEREN": "Location and terrain",
  "UI-PUL-TRYB-LIVE": "Live mode",
  "UI-PUL-USTAWIENIA": "Settings",
  "UI-PUL-USTAWIENIA-KAFEL": "Settings",
  "UI-PUL-PLAKIETKA-PRO": "PRO",
  "UI-PUL-PLAKIETKA-PRO-OPIS": "PRO feature — available without limits for now",
  "UI-PUL-PULPIT": "Dashboard",
  "UI-PUL-MODULOW-WIDOCZNYCH": "{length} of {length2} modules visible.",
  "UI-PUL-SKONFIGURUJ-PULPIT": "Configure the dashboard",
  "UI-PUL-PRZYWROC-DOMYSLNE-USTAWIENIA": "Restore the defaults in the settings",
  "UI-PUL-BRAK-POWIADOMIEN": "No notifications",
  "UI-PUL-PRZEGLADY-PO-TERMINIE": "Inspections overdue: {n}. Open the schedule.",
  "UI-PUL-WSZYSTKIE-KAFLE-UKRYTE": "All tiles are hidden.",
  "UI-UST-PULPIT": "← Dashboard",
  "UI-UST-USTAWIENIA-SKONFIGURUJ-PULPI": "Settings — Configure the dashboard",
  "UI-UST-POKAZ-UKRYJ-MODUL":
    "Show/hide a module, change the order (↑/↓). Hiding does not delete a module — you can always restore it. Changes are saved automatically in this browser.",
  "UI-UST-PRZYWROC-DOMYSLNE": "Restore defaults",
  "UI-UST-PERSONALIZACJA-WYGLADU": "Appearance personalisation",
  "UI-UST-MOTYW-KOLORY-CZCIONKA": "Theme, colours and font. Preview of all elements at once:",
  "UI-UST-WZORNIK": "/wzornik",
  "UI-UST-KOLORY": "Colours",
  "UI-UST-CZCIONKA": "Font",
  "UI-UST-JEZYK": "Language",
  "UI-UST-DOTYCZY-KOMUNIKATOW-KTORE":
    "Applies to messages that already have a translation (chapter 17 of the standard — the migration continues module by module). The remaining texts are still shown in Polish.",
  "UI-UST-PRZENIES-WYZEJ": "Move up",
  "UI-UST-PRZENIES-NIZEJ": "Move down",
  "UI-UST-POKAZ": "Show",
  "UI-UST-UKRYJ": "Hide",
  "UI-MOD-PULPIT": "← Dashboard",
  "UI-MOD-TYTUL": "Module {id} — {nazwa}",
  "UI-LOG-ZALOGUJ-KLUCZEM": "Sign in with a passkey (face or fingerprint)",
  "UI-LOG-KLUCZ-OCZEKIWANIE": "Waiting for confirmation on your device…",
}
