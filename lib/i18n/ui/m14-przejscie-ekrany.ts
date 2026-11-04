/**
 * M14 — screens of the „Przejście” group: D9/F9 „Ryzyka odłączenia”, D10/F10 „Jak zrezygnować z
 * przyłącza” (the risk and procedure texts themselves: `m14-przejscie.ts`).
 */
// English: ./m14-przejscie-ekrany.en.ts, Russian: ./m14-przejscie-ekrany.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-RYZ-TYTUL": "Ryzyka odłączenia od sieci",
  "UI-RYZ-OPIS":
    "Dziesięć ryzyk pełnego odłączenia (scenariusz D), a dla firmy trzy kolejne. Odhacz każde, gdy je sprawdzisz. Znak przy pozycji mówi, na ile jest pewna: ✅ prawo, fizyka lub praktyka bez wątpliwości; 🔎A kilka zgodnych źródeł; 🔎B jedno źródło albo wiedza ekspercka. M14, ekran D9 / F9.",
  "UI-RYZ-SKUTEK": "Skutek: {tekst}",
  "UI-RYZ-CO-ZROBIC": "Co zrobić: {tekst}",
  "UI-RYZ-WSZYSTKIE": "Wszystkie ryzyka sprawdzone",
  "UI-RYZ-NASTEPNY": "Następny krok:",
  "UI-RYZ-LINK-PROCEDURA": "procedura rezygnacji z przyłącza",
  "UI-RYZ-KROKI-ODWRACALNE": "— kroki 1–4 są odwracalne, zacznij od testu wyspy przez pełną zimę.",
  "UI-RYZ-SPRAWDZONO": "Sprawdzono {n} z {wszystkie} ryzyk",
  "UI-REZ-TYTUL": "Jak zrezygnować z przyłącza",
  "UI-REZ-OPIS":
    "Siedem kroków w kolejności, która ma znaczenie. Kroki 1–4 możesz cofnąć, 5–7 już nie. Na dole — ile kosztowałby powrót do sieci. M14, ekran D10 / F10.",
  "UI-REZ-ODWRACALNE": "(odwracalne)",
  "UI-REZ-NIEODWRACALNE": "(nieodwracalne)",
  "UI-REZ-FIRMA": "Firma: {tekst}",
  "UI-REZ-KOSZT-POWROTU": "Koszt powrotu do sieci",
  "UI-REZ-KOSZT-OPIS":
    "K ≈ stawka opłaty przyłączeniowej OSD [zł/kW] × moc przyłączeniowa — grupy IV–VI, odległość standardowa. Stawkę znajdziesz w taryfie swojego OSD (rozdział o opłatach za przyłączenie); aplikacja jeszcze jej nie ma.",
  "UI-REZ-STAWKA": "Stawka opłaty przyłączeniowej",
  "UI-REZ-J-ZL-KW": "zł/kW",
  "UI-REZ-MOC": "Moc przyłączeniowa",
  "UI-REZ-ODLEGLOSC": "Odległość od sieci",
  "UI-REZ-ODL-TAK": "W standardowej odległości z taryfy OSD",
  "UI-REZ-ODL-NIE": "Dalej niż standardowa odległość",
  "UI-REZ-UZUPELNIJ": "Uzupełnij dane",
  "UI-REZ-POWROT": "Powrót do sieci",
  "UI-REZ-WYCENA-INDYW": "Wycena indywidualna OSD",
  "UI-REZ-OK-NETTO": "ok. {kwota} netto",
  "UI-REZ-PRZED-KROKIEM-5": "Przed krokiem 5:",
  "UI-REZ-LINK-RYZYKA": "ryzyka odłączenia",
  "UI-REZ-LINK-PRZELACZNIK": "przełącznik sieć/wyspa",
} as const
