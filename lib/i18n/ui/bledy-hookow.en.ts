// English texts of ./bledy-hookow.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./bledy-hookow"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-BLAD-GPS-BRAK-ZGODY": "Location permission denied — allow this site to access your location in the browser settings.",
  "UI-BLAD-GPS-BRAK-POLOZENIA": "The device could not determine its position — move to an open area and try again.",
  "UI-BLAD-GPS-TIMEOUT": "Timed out waiting for a GPS signal — try again.",
  "UI-BLAD-GPS-NIEDOSTEPNY": "This browser does not provide GPS.",
  "UI-BLAD-GPS-INNY": "Could not read the GPS position.",
  "UI-BLAD-PVGIS-PARAMETRY-NIEPOPRAWNE": "Invalid location coordinates.",
  "UI-BLAD-PVGIS-ODRZUCIL-ZAPYTANIE": "PVGIS has no data for this place (e.g. a point at sea or outside the database coverage).",
  "UI-BLAD-PVGIS-TIMEOUT": "PVGIS did not respond in time — try again in a moment.",
  "UI-BLAD-PVGIS-NIEDOSTEPNY": "The PVGIS service is temporarily unavailable — try again later.",
  "UI-BLAD-PVGIS-NIEOCZEKIWANY-FORMAT": "PVGIS returned data in an unexpected format.",
  "UI-BLAD-PVGIS-SIEC": "No connection — irradiation data must be downloaded once online, then it works offline.",
  "UI-BLAD-OBLICZENIA-NIEPOWODZENIE": "The calculation failed — try again.",
  "UI-BLAD-KONTO-NIEZALOGOWANY": "You are not signed in.",
  "UI-BLAD-KONTO-USUWANIE-NIESKONFIGUROWANE": "Account deletion is not configured yet (missing service role key in .env.local).",
  "UI-ASYAI-BLAD-PUSTE-PYTANIE": "Write a question.",
  "UI-ASYAI-BLAD-NIESKONFIGUROWANY": "The AI assistant is not configured yet — add the ANTHROPIC_API_KEY to the server environment variables.",
  "UI-ASYAI-BLAD-ODMOWA": "The assistant declined to answer this question.",
  "UI-ASYAI-BLAD-ZA-DLUGO": "The assistant did not finish within a reasonable number of steps — try asking a simpler question.",
  "UI-ASYAI-BLAD-OGOLNY": "The AI assistant ran into an error — try again.",
  "UI-BLAD-PASSKEY-NIESKONFIGUROWANE": "Passkey sign-in is not configured yet.",
  "UI-BLAD-PASSKEY-WYLACZONE": "Passkeys are not enabled yet in the sign-in service settings.",
  "UI-BLAD-PASSKEY-NIEOBSLUGIWANE": "This browser does not support passkeys.",
  "UI-BLAD-PASSKEY-ANULOWANO": "The confirmation on the device was cancelled or did not complete. Try again.",
  "UI-BLAD-PASSKEY-CEREMONIA": "The device did not finish the confirmation. Try again or use the e-mail link.",
  "UI-BLAD-PASSKEY-LOGOWANIE": "Could not sign in with a passkey. Try again or use the e-mail link.",
  "UI-BLAD-PASSKEY-REJESTRACJA": "Could not add the passkey. Try again.",
  "UI-BLAD-PASSKEY-LIMIT": "The maximum number of passkeys for this account has been reached. Remove one you no longer need and try again.",
  "UI-BLAD-PASSKEY-LISTA": "Could not load your passkeys.",
  "UI-BLAD-PASSKEY-USUWANIE": "Could not remove the passkey.",
}
