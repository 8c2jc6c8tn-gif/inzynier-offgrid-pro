/**
 * Text added after 29.09.2026 to screens that are still on the ratchet list of
 * `scripts/i18n-ui-guard-baseline.json` (their older text is not migrated yet). New text on such a
 * screen goes through `t()` from day one; when the whole screen is migrated, move its keys to the
 * screen's own file. Also the shared generator-safety block (D48), used by M2/E17, M7/E8 and M14/D11.
 */
// English: ./dopiski-starych-ekranow.en.ts, Russian: ./dopiski-starych-ekranow.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-AGB-TYTUL": "Bezpieczeństwo agregatu",
  "UI-AGB-MIEJSCE": "Gdzie pracuje agregat",
  "UI-AGB-M-ZEWNATRZ": "Na zewnątrz (wiata, pod zadaszeniem)",
  "UI-AGB-M-WYDZIELONE": "Wydzielone pomieszczenie techniczne z wydechem na zewnątrz",
  "UI-AGB-M-BUDYNEK": "W budynku (piwnica, garaż przy domu, kotłownia)",
  "UI-AGB-PODLACZENIE": "Jak agregat zasila odbiorniki",
  "UI-AGB-P-PRZELACZNIK": "Do instalacji przez przełącznik I–0–II",
  "UI-AGB-P-BEZ": "Do instalacji bez przełącznika (gniazdko, wtyczka)",
  "UI-AGB-P-FALOWNIK": "Przez rozdzielnię do wejścia AC falownika / ładowarki",
  "UI-AGB-P-ODBIORNIKI": "Odbiorniki awaryjne z rozdzielni zasilanej tylko z agregatu",
  "UI-AGB-JAK-PRZELACZNIK": "Jak ma wyglądać przełącznik (pozycja 0, blokada, przewód N):",
  "UI-AGB-L-PRZELACZNIK": "Przełącznik sieć/wyspa i bezpieczeństwo",
  "UI-ZDE-F-AWARYJNE": "Zamek ma zasilanie awaryjne (UPS lub akumulator)",
  "UI-ZDE-F-RECZNE": "Drzwi da się otworzyć ręcznie bez prądu",
  "UI-ZDE-F-RECZNE-HINT":
    "Mechanicznie, od środka i bez klucza: klamka, pochwyt antypaniczny. Przycisk elektryczny się nie liczy.",
  "UI-ZDE-F-ALARM": "Alarm pożarowy zwalnia zamek",
  "UI-ZDE-F-PRZYCISK": "Jest przycisk ewakuacyjny",
  "UI-ZDE-F-KONTAKTRON": "Kontaktron potwierdza otwarcie drzwi",
  "UI-GZ-NAZWA": "Nazwa",
  "UI-GZ-MOC": "Moc [W]",
  "UI-OSW-MIEJSCE": "Miejsce",
  "UI-OSW-STAN": "Stan",
  "UI-CRL-K-1": "nn napowietrzna → nn kabel → SN napowietrzna → SN kabel",
  "UI-CRL-K-2": "nn napowietrzna → nn kabel → SN kabel → SN napowietrzna",
  "UI-CRL-K-3": "nn kabel → nn napowietrzna → SN napowietrzna → SN kabel",
  "UI-CRL-K-4": "nn kabel → nn napowietrzna → SN kabel → SN napowietrzna",
  "UI-CRL-KOLEJNOSC": "Kolejność odcinków od budynku",
  "UI-CRL-K-NIE-WIEM": "Nie wiem — licz ostrożnie",
  "UI-CRL-ZALECENIE-S": "Zalecenie, nie wymóg normy:",
  "UI-CRL-ZALECENIE": "SPD typu 2 kosztuje niewiele w porównaniu z chronionym sprzętem — warto go zamontować.",
} as const
