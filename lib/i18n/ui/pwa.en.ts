// English texts of ./pwa.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./pwa"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-PWA-NOWA-TYTUL": "A new version of the app is available",
  "UI-PWA-NOWA-OPIS": "Refresh to start using it. Data entered in forms stays saved as a draft.",
  "UI-PWA-ODSWIEZ": "Refresh",
  "UI-PWA-INNA-KARTA-TYTUL": "The app was updated in another tab",
  "UI-PWA-INNA-KARTA-OPIS": "Refresh this tab to avoid errors.",
  "UI-PWA-404-TYTUL": "This screen does not exist",
  "UI-PWA-404-OPIS":
    "This address is not in the app or in the offline storage. If you are offline, connect and try again.",
  "UI-PWA-404-PULPIT": "Back to the dashboard",
  "UI-PWA-BAZA-ODSWIEZ-TYTUL": "Refresh this tab",
  "UI-PWA-BAZA-ODSWIEZ-OPIS":
    "A newer version of the app is running in another tab. This tab cannot save data until you refresh it.",
  "UI-PWA-BAZA-ZABLOKOWANY-TYTUL": "Waiting for other tabs",
  "UI-PWA-BAZA-ZABLOKOWANY-OPIS":
    "The app storage update is waiting until other open tabs of this app are refreshed or closed.",
  "UI-PWA-3D-BRAK-TYTUL": "The 3D view needs the internet",
  "UI-PWA-3D-BRAK-OPIS":
    "The 3D view is downloaded the first time it is opened. Connect to the internet and refresh the page. The rest of the screen does not depend on the 3D view.",
}
