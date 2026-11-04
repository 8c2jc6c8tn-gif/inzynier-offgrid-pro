/**
 * M14 — D6 „Agregat jako zapas” (`app/kalkulatory/agregat-jako-zapas/page.tsx`).
 */
// English: ./m14-agregat.en.ts, Russian: ./m14-agregat.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-AGZ-TYTUL": "Agregat jako zapas",
  "UI-AGZ-OPIS":
    "Ile godzin i paliwa potrzeba, żeby agregat pokrył niedobór najgorszego miesiąca bez sieci — i jak go bezpiecznie podłączyć. Ten sam silnik co ekran „Agregat prądotwórczy” (Moduł 2). M14 „Dom – sieć”, ekran D6.",
  "UI-AGZ-NAJPIERW": "Najpierw policz zimę bez sieci",
  "UI-AGZ-L-ZIMA": "Zima bez sieci →",
  "UI-AGZ-BEZ-NIEDOBORU": "Bez niedoboru",
  "UI-AGZ-BEZ-NIEDOBORU-OPIS":
    "W bilansie miesięcznym nie brakuje energii w żadnym miesiącu. Seria pochmurnych dni i tak może wymagać zapasu — sprawdź stress-test zimowy (Moduł 7).",
  "UI-AGZ-NAJGORSZY": "Najgorszy miesiąc bez sieci:",
  "UI-AGZ-BRAKUJE": ", brakuje {kwh} kWh.",
  "UI-AGZ-MOC": "Moc agregatu",
  "UI-AGZ-ZUZYCIE": "Zużycie paliwa przy obciążeniu 80%",
  "UI-AGZ-CENA": "Cena paliwa",
  "UI-AGZ-BMS": "BMS / falownik ma wyjście do automatycznego startu agregatu",
  "UI-AGZ-SPRAWDZ": "Sprawdź wpisane dane",
  "UI-AGZ-BEZPIECZENSTWO": "Bezpieczeństwo agregatu",
  "UI-AGZ-W-MIESIACU": "Agregat w miesiącu {miesiac}",
  "UI-AGZ-GODZINY": "{h} h pracy",
  "UI-AGZ-PALIWO": "Paliwo {litry} l, koszt {koszt}. Przełącznik sieć/wyspa i agregat:",
  "UI-AGZ-L-STYK": "bezpieczeństwo styku →",
} as const
