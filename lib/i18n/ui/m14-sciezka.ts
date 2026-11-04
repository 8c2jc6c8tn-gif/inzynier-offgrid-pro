/**
 * M14 — the „Ścieżka przejścia” wizard (`app/kalkulatory/sciezka-przejscia/page.tsx`): step
 * titles, descriptions and the names of the screens each step links to.
 */
// English: ./m14-sciezka.en.ts, Russian: ./m14-sciezka.ru.ts (one language per file, so each is its own lazy chunk — lib/i18n/rejestr-slownikow.ts).
export const pl = {
  "UI-SCZ-RACHUNEK-T": "Mój rachunek",
  "UI-SCZ-RACHUNEK-O":
    "Ile płacisz dziś i ile z tego to „cena trzymania sieci” — koszty stałe, które znikną po odejściu.",
  "UI-SCZ-L-RACHUNEK-DOM": "Mój rachunek dziś",
  "UI-SCZ-L-TARYFA-G": "Która taryfa G",
  "UI-SCZ-L-DEPOZYT": "Co tracę jako prosument",
  "UI-SCZ-L-RACHUNEK-FIRMA": "Mój rachunek dziś (C)",
  "UI-SCZ-L-TARYFY-C": "Porównywarka taryf C",
  "UI-SCZ-L-MOC-UMOWNA": "Moc umowna",
  "UI-SCZ-ZUZYCIE-T": "Moje zużycie",
  "UI-SCZ-ZUZYCIE-O": "Zużycie miesiąc po miesiącu — zima decyduje o wszystkim, średnia roczna nie wystarczy.",
  "UI-SCZ-L-ZUZYCIE-DOM": "Moje zużycie miesięcznie",
  "UI-SCZ-L-ZUZYCIE-FIRMA": "Zużycie firmy miesięcznie (ekran PV w firmie)",
  "UI-SCZ-PV-T": "Ile PV i magazynu",
  "UI-SCZ-PV-O": "Instalacja, która pokryje zużycie bez sieci, i jej koszt.",
  "UI-SCZ-L-PV-FIRMA": "PV w firmie i autokonsumpcja",
  "UI-SCZ-L-BESS": "Magazyn (BESS) — strumienie korzyści",
  "UI-SCZ-ZIMA-T": "Zima i agregat",
  "UI-SCZ-ZIMA-O": "Czy najgorszy miesiąc się domyka i ile godzin musi pracować agregat.",
  "UI-SCZ-L-ZIMA": "Zima bez sieci",
  "UI-SCZ-L-AGREGAT-ZAPAS": "Agregat jako zapas",
  "UI-SCZ-L-BILANS-D": "Bilans bez sieci — scenariusz D",
  "UI-SCZ-L-AGREGAT": "Agregat prądotwórczy",
  "UI-SCZ-SCEN-T": "Scenariusze A–D",
  "UI-SCZ-SCEN-O":
    "Zostaję jak jest, dokładam PV, dokładam magazyn, odchodzę od sieci — koszt w latach i niezależność.",
  "UI-SCZ-L-SCEN-DOM": "Porównanie scenariuszy A–D",
  "UI-SCZ-L-SCEN-FIRMA": "Scenariusze A–D dla firmy",
  "UI-SCZ-RYZYKA-T": "Ryzyka i procedura",
  "UI-SCZ-RYZYKA-O": "Co może pójść źle, czego nie da się odwrócić i jak bezpiecznie połączyć sieć, wyspę i agregat.",
  "UI-SCZ-L-RYZYKA": "Ryzyka odłączenia",
  "UI-SCZ-L-REZYGNACJA": "Jak zrezygnować z przyłącza",
  "UI-SCZ-L-PRZELACZNIK": "Przełącznik sieć/wyspa",
  "UI-SCZ-L-RYZYKA-FIRMA": "Ryzyka odłączenia firmy",
  "UI-SCZ-L-PROCEDURA-B2B": "Procedura i umowy B2B",
  "UI-SCZ-TYTUL": "Ścieżka przejścia",
  "UI-SCZ-OPIS":
    "Sześć kroków od rachunku za prąd do decyzji o odejściu od sieci. Każdy krok otwiera ekrany, które go liczą — Twoje dane z nich przechodzą dalej automatycznie. Postęp zapisuje się na tym urządzeniu.",
  "UI-SCZ-ZROBIONE": "Zrobione",
  "UI-SCZ-PODSUMOWANIE": "Podsumowanie — {zrobione} z {wszystkie} kroków",
  "UI-SCZ-NASTEPNY": "Następny krok:",
  "UI-SCZ-NASTEPNY-UWAGA":
    "Decyzję o odejściu od sieci podejmuj dopiero po przejściu wszystkich kroków — zwłaszcza zimy i ryzyk.",
  "UI-SCZ-WSZYSTKIE":
    "Wszystkie kroki przejrzane. Wynik porównania i warunki bezpieczeństwa są na ekranie scenariuszy — tam jest werdykt.",
  "UI-SCZ-DRUKUJ": "Drukuj / zapisz jako PDF",
} as const
