/**
 * M14 — F7 „Magazyn (BESS) w firmie — strumienie korzyści” (`app/kalkulatory/magazyn-firmy/page.tsx`).
 */
// English: ./m14-bess.en.ts, Russian: ./m14-bess.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-BESS-S-AUTOKONSUMPCJA": "Autokonsumpcja nadwyżek PV",
  "UI-BESS-S-ARBITRAZ": "Arbitraż cenowy",
  "UI-BESS-S-MOCOWA": "Opłata mocowa (poza 7:00–22:00)",
  "UI-BESS-S-MOC-UMOWNA": "Opłaty za moc umowną i przekroczenia",
  "UI-BESS-TYTUL": "Magazyn energii (BESS) w firmie — strumienie korzyści",
  "UI-BESS-OPIS":
    "Magazyn zarabia na pięć sposobów, ale nie każdy jest dostępny dla Twojej firmy. Każdy strumień porównujemy z kosztem zużycia magazynu na 1 kWh z „Analizy opłacalności magazynu” (Moduł 4). M14 „Firma – sieć”, ekran F7.",
  "UI-BESS-KOSZT-KWH": "Koszt 1 kWh z magazynu:",
  "UI-BESS-KOSZT-WARTOSC": "{koszt} zł/kWh",
  "UI-BESS-NIEPOLICZONY": "jeszcze nie policzony",
  "UI-BESS-L-ZMIEN": "zmień cenę, pojemność, cykle →",
  "UI-BESS-L-POLICZ": "policz go z cen ofert →",
  "UI-BESS-H-1": "1. Autokonsumpcja nadwyżek PV",
  "UI-BESS-ENERGIA": "Energia przez magazyn",
  "UI-BESS-ZYSK": "Zysk na 1 kWh",
  "UI-BESS-L-NADWYZKA": "Ile nadwyżki masz — PV w firmie →",
  "UI-BESS-H-2": "2. Arbitraż cenowy",
  "UI-BESS-ARBITRAZ-OPIS":
    "Ładowanie z sieci w tanich godzinach i zużycie w drogich — ma sens przy cenie dynamicznej albo strefowej.",
  "UI-BESS-ROZNICA": "Różnica cen",
  "UI-BESS-H-3": "3. Opłata mocowa",
  "UI-BESS-ODDANE": "Z tego oddane w dni robocze 7:00–22:00",
  "UI-BESS-L-MOCOWA": "Opłata mocowa — przesunięcie poboru →",
  "UI-BESS-H-4": "4. Opłaty za moc umowną",
  "UI-BESS-GRUPA": "Grupa taryfowa",
  "UI-BESS-GRUPA-C1": "C11 / C12a / C12b (do 40 kW)",
  "UI-BESS-GRUPA-C2": "C21 / C22a / C22b (powyżej 40 kW)",
  "UI-BESS-OSZCZEDNOSC": "Oszczędność na mocy umownej i przekroczeniach",
  "UI-BESS-L-MOC-UMOWNA": "Moc umowna — przekroczenia →",
  "UI-BESS-H-5": "5. Usługi systemowe",
  "UI-BESS-USLUGI-OPIS":
    "Rynek bilansujący i rynek mocy — dla małych magazynów praktycznie niedostępne bez agregatora. Tylko informacja, bez kwoty.",
  "UI-BESS-UZUPELNIJ": "Uzupełnij dane",
  "UI-BESS-BILANS": "Bilans roczny magazynu",
  "UI-BESS-PLUS-ROCZNIE": "+{kwota} rocznie",
  "UI-BESS-MINUS-ROCZNIE": "{kwota} rocznie — magazyn się nie zwraca",
  "UI-BESS-ZUZYCIE": "Zużycie magazynu",
  "UI-BESS-ZWROT": "Prosty zwrot ceny magazynu z korzyści: {lat} roku (bez dyskonta i zmian cen).",
} as const
