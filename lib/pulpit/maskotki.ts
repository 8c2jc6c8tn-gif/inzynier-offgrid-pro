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
/**
 * Baner na stronie modułu, gdy ma być inny niż obraz na kaflu pulpitu: kafel pokazuje prostą
 * ilustrację z wyciętym tłem, a baner pełną scenę, która opowiada cały rozdział (D84).
 * Brak wpisu = baner używa obrazu z kafla.
 */
export const BANER_MODULU_PO_ID_KAFLA: Record<number, string> = {
  7: "/maskotki-bob/modul-07-baner.webp",
}

export const MASKOTKA_PO_ID_KAFLA: Record<number, string> = {
  1: "/maskotki-bob/modul-01.webp",
  2: "/maskotki-bob/modul-02.webp",
  3: "/maskotki-bob/modul-03.webp",
  4: "/maskotki-bob/modul-04.webp",
  5: "/maskotki-bob/modul-05.webp",
  6: "/maskotki-bob/modul-06.webp",
  7: "/maskotki-bob/modul-07.webp",
  8: "/maskotki-bob/modul-08.webp",
  9: "/maskotki-bob/modul-09.webp",
  10: "/maskotki-bob/modul-10.webp",
  11: "/maskotki-bob/modul-11.webp",
  12: "/maskotki-bob/modul-12.webp",
  13: "/maskotki-bob/modul-13.webp",
  14: "/maskotki-bob/modul-14.webp",
  15: "/maskotki-bob/modul-15.webp",
  16: "/maskotki-bob/modul-16.webp",
}

/**
 * Zestaw ikon 3D „zamiast Boba” (D87): te same 16 kafli, ten sam klucz, osobny katalog. Pliki to WebP 384 px
 * z przezroczystym tłem (źródło: PNG właściciela 1254 px, zob. docs/maskotka-bob-prompty.md, sekcja D).
 * Wybór między Bobem a ikonami jest w Ustawieniach (`lib/wyglad/storage.ts`, pole `ikonyKafli`).
 */
export const IKONA_3D_PO_ID_KAFLA: Record<number, string> = Object.fromEntries(
  Array.from({ length: 16 }, (_, i) => [i + 1, `/ikony-3d/ikona-${String(i + 1).padStart(2, "0")}.webp`]),
)

export type IkonyKafli = "bob" | "3d"

/**
 * Bob w stanach interfejsu (D88): awatar asystenta AI, werdykt 🟢🟡🔴, pusty stan, błąd strony.
 * Pliki to małe WebP z przezroczystym tłem, przycięte do postaci — rozmiar dobrany do miejsca,
 * w którym się pokazują (zob. docs/maskotka-bob-prompty.md, pozycje C1–C6). Ikona aplikacji (C7)
 * to PNG w `public/` (`icon-192.png`, `icon-512.png`, `apple-icon.png`), nie wpis tutaj.
 */
export const BOB_STANY = {
  asystent: "/maskotki-bob/bob-asystent.webp",
  ok: "/maskotki-bob/bob-werdykt-ok.webp",
  uwaga: "/maskotki-bob/bob-werdykt-uwaga.webp",
  blad: "/maskotki-bob/bob-werdykt-blad.webp",
  pusty: "/maskotki-bob/bob-pusty-stan.webp",
  bladStrony: "/maskotki-bob/bob-blad-strony.webp",
} as const

export type BobStan = keyof typeof BOB_STANY
