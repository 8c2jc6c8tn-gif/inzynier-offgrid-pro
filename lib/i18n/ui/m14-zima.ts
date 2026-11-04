/**
 * M14 — D5 „Zima bez sieci” (`app/kalkulatory/zima-bez-sieci/page.tsx`).
 */
// English: ./m14-zima.en.ts, Russian: ./m14-zima.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-ZIMA-TYTUL": "Zima bez sieci",
  "UI-ZIMA-OPIS":
    "Ta sama instalacja co na ekranie „Ile PV i magazynu”, ale bez sieci: czego zabraknie w grudniu i styczniu i kto to pokryje. M14 „Dom – sieć”, ekran D5.",
  "UI-ZIMA-NAJPIERW": "Najpierw wpisz zużycie i instalację",
  "UI-ZIMA-NIE-DA-SIE": "Nie da się policzyć — uzupełnij dane na ekranie „Ile PV i magazynu”",
  "UI-ZIMA-BILANS": "Bilans bez sieci",
  "UI-ZIMA-BRAKUJE": "Grudzień + styczeń: brakuje {kwh} kWh",
  "UI-ZIMA-BEZ-NIEDOBORU": "Grudzień i styczeń bez niedoboru",
  "UI-ZIMA-ROK":
    "Cały rok bez sieci brakuje {brak} kWh, a {nadwyzka} kWh produkcji się marnuje (nie ma gdzie jej oddać).",
  "UI-ZIMA-WARUNEK": "Warunek konieczny przed odłączeniem — stress-test zimowy (Moduł 7)",
  "UI-ZIMA-WARUNEK-OPIS":
    "Bilans miesięczny zakłada, że magazyn codziennie się napełnia. Zimą bywa inaczej — kilka pochmurnych dni pod rząd, niska temperatura magazynu, pompa ciepła pracująca dłużej. Sprawdź to przed decyzją:",
  "UI-ZIMA-L-ZACHMURZENIE": "Symulacja miesiąca zachmurzenia",
  "UI-ZIMA-I": " i ",
  "UI-ZIMA-L-DNI-BEZ-SLONCA": "dni bez słońca",
  "UI-ZIMA-L-DNI-AUTONOMII": "Dni autonomii",
  "UI-ZIMA-MODUL-2-I": " (Moduł 2) i ",
  "UI-ZIMA-L-TEMPERATURA": "wpływ temperatury na magazyn",
  "UI-ZIMA-MODUL-4": " (Moduł 4)",
  "UI-ZIMA-L-POMPA": "Zimowe zużycie pompy ciepła",
  "UI-ZIMA-MODUL-6": " (Moduł 6)",
  "UI-ZIMA-NIEDOBOR-AGREGAT": "Niedobór pokryje agregat:",
  "UI-ZIMA-L-AGREGAT": "Agregat jako zapas",
} as const
