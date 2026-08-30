import type { AuditCheckItem } from "./input"

/**
 * PRZYKŁADOWE dane demonstracyjne — w docelowej implementacji ten ekran czerpie na żywo
 * z Modułu 8 (czujniki/klapy/UPS), Modułu 9 (ESP32/czujniki) i Modułu 13 (Tryb Live),
 * które nie są jeszcze zbudowane (docs/rejestr-pokrycia.md). Lista kategorii sprawdzanych
 * elementów jest 1:1 ze źródła (docs/domena/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md, Ekran 11):
 * czujniki dymu, obecność i sprawność gaśnic, drożność dróg ewakuacyjnych, poprawna reakcja
 * klap pożarowych, historia testów i przeglądów — konkretne wpisy poniżej są ilustracyjne,
 * nie realnym audytem żadnej instalacji.
 */
export const SAMPLE_AUDIT_ITEMS: AuditCheckItem[] = [
  { id: "dym-salon", kategoria: "Czujniki dymu", element: "Salon", status: "ok", opis: "" },
  {
    id: "dym-sypialnia",
    kategoria: "Czujniki dymu",
    element: "Sypialnia",
    status: "warning",
    opis: "Czujnik nie odpowiada — sprawdź baterię.",
  },
  { id: "dym-kuchnia", kategoria: "Czujniki dymu", element: "Kuchnia", status: "ok", opis: "" },
  { id: "co-kotlownia", kategoria: "Czujniki CO", element: "Kotłownia", status: "ok", opis: "" },
  {
    id: "gasnica-kuchnia",
    kategoria: "Gaśnice",
    element: "Kuchnia",
    status: "warning",
    opis: "Termin ważności minął — wymagana wymiana.",
  },
  { id: "gasnica-garaz", kategoria: "Gaśnice", element: "Garaż", status: "ok", opis: "" },
  { id: "droga-glowna", kategoria: "Drogi ewakuacyjne", element: "Wyjście główne", status: "ok", opis: "" },
  { id: "droga-boczna", kategoria: "Drogi ewakuacyjne", element: "Wyjście boczne", status: "ok", opis: "" },
  { id: "klapa-strefa1", kategoria: "Klapy pożarowe", element: "Strefa 1 (bateria)", status: "ok", opis: "" },
  { id: "klapa-strefa2", kategoria: "Klapy pożarowe", element: "Strefa 2 (rozdzielnia)", status: "ok", opis: "" },
  {
    id: "przeglad-instalacji",
    kategoria: "Historia testów i przeglądów",
    element: "Instalacja p.poż.",
    status: "ok",
    opis: "",
  },
  {
    id: "przeglad-gasnice",
    kategoria: "Historia testów i przeglądów",
    element: "Coroczny przegląd gaśnic",
    status: "critical",
    opis: "Przegląd przeterminowany o ponad 6 miesięcy.",
  },
]
