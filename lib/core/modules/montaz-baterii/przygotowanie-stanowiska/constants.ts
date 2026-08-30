/**
 * Ekran A7, Moduł 11 "Montaż baterii" — "Przygotowanie stanowiska i narzędzi" (dawne 9.9,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md). Wzorzec E — checklist weryfikacyjna
 * (docs/standards/08-ui-ux.md, 8.2). Dotyczy ścieżki LiFePO4 — wspólny szkielet UI z Modułem 11,
 * treść specyficzna dla tej chemii.
 */

export type ChecklistItem = {
  id: string
  element: string
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "mata-izolacyjna", element: "Mata izolacyjna na stole" },
  { id: "klucz-dynamometryczny", element: "Klucz dynamometryczny z nasadkami izolowanymi" },
  { id: "rekawice", element: "Rękawice ochronne" },
  { id: "okulary", element: "Okulary ochronne" },
  { id: "gasnica", element: "Gaśnica proszkowa/pianowa w zasięgu ręki" },
  { id: "brak-metalu-luzem", element: "Brak metalowych przedmiotów luzem na stanowisku" },
]
