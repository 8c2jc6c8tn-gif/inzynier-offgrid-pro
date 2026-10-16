/**
 * Mapowanie id kafla (lib/pulpit/registry.ts) → ścieżka do ilustracji maskotki "Bob" per moduł.
 * Kafle bez wpisu tutaj nie mają jeszcze maskotki — strony pokazują wtedy dotychczasową ikonę
 * (animowane SVG z components/kafle-ikony/ albo emoji z rejestru) bez zmian, ten sam wzorzec
 * fallbacku co KAFLE_ZE_ZBUDOWANA_IKONA w components/kafle-ikony/ikona.tsx.
 *
 * Pliki źródłowe (dostarczone przez właściciela projektu jako PNG, ~2-2,5 MB każdy) przeskalowane
 * do maks. 900px na dłuższym boku i przekonwertowane do WebP (~90-180 KB każdy) — bez tego
 * kroku obrazy ważyłyby łącznie ~14 MB i ładowałyby się przy każdym wejściu na pulpit.
 */
export const MASKOTKA_PO_ID_KAFLA: Record<number, string> = {
  3: "/maskotki-bob/modul-03.webp",
  5: "/maskotki-bob/modul-05.webp",
  6: "/maskotki-bob/modul-06.webp",
  7: "/maskotki-bob/modul-07.webp",
  9: "/maskotki-bob/modul-09.webp",
  11: "/maskotki-bob/modul-11.webp",
  13: "/maskotki-bob/modul-13.webp",
  14: "/maskotki-bob/modul-14.webp",
  16: "/maskotki-bob/modul-16.webp",
}
