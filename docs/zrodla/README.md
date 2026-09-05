# docs/zrodla/ — materiały źródłowe Offgrid (Biblia + treść modułów)

**2026-09-04 — zmiana nazwy z `docs/domena/`** na kanoniczną nazwę z GOD BOOK Część B.5
(`docs/zrodla/` — katalog materiałów źródłowych, nietykalny, tylko do odczytu). Ten folder pełnił
tę rolę od początku, tylko pod inną nazwą — na wyraźną decyzję właściciela projektu ujednolicono
nazewnictwo ze standardem. Treść plików bez zmian, patrz `docs/memory.md`.

To są surowe materiały produktowe/domenowe (specyfikacja Off-Grid PV v1.5/v2.0), **nie** część
`docs/standards/` (te są generyczne dla całej rodziny aplikacji). Trzymane w repo, żeby nie trzeba
było ich dosyłać ponownie w kolejnych sesjach AI — patrz `docs/memory.md`, wpis 2026-08-29
"Materiały źródłowe przeniesione do repo".

Zasada: pliki tu trafiają **bez zmian treści** (kopia 1:1 tego, co dostarczył autor projektu).
Jeśli treść okaże się przestarzała/sprzeczna z inną — nie nadpisywać cicho, zgłosić (Zasada 15.4).

## Stan na 2026-08-29 — komplet 13 modułów + pliki zbiorcze

| Plik | Moduł | Ekranów | Status |
|---|---|---|---|
| `Tresc_Modul_1_Lokalizacja_Ekrany.md` | 1 — Lokalizacja i teren | 4 | pełna treść |
| `Tresc_Modul_2_Zapotrzebowanie_Ekrany.md` | 2 — Zapotrzebowanie energetyczne | 16 + moduł zbiorczy wampirów | pełna treść, v1.1 (koryguje lokalizację 1.22/1.23, potwierdza duplikat 1.18) |
| `Tresc_Modul_3_PV_Ekrany.md` | 3 — Instalacja PV | 28 (2 infra + 26 treść) | pełna treść |
| `Tresc_Modul_4_Baterie_Ekrany.md` | 4 — Magazyn energii / baterie | 34 | pełna treść |
| `Tresc_Modul_5_Okablowanie_Ekrany.md` | 5 — Okablowanie | — | pełna treść |
| `Tresc_Modul_6_Ogrzewanie_Ekrany.md` | 6 — Ogrzewanie | — | pełna treść |
| `Tresc_Modul_7_StressTest_Ekrany.md` | 7 — Stress-test zimowy | — | pełna treść |
| `Tresc_Modul_8_Bezpieczenstwo_Ekrany.md` | 8 — Bezpieczeństwo | — | pełna treść |
| `Tresc_Modul_9_ESP32_Ekrany.md` | 9 — ESP32 / sterowanie | — | pełna treść |
| `Tresc_Modul_10_AI_Ekrany.md` | 10 — AI | — | pełna treść |
| `Tresc_Modul_11_MontazBaterii_Ekrany.md` | 11 — Montaż baterii | — | pełna treść |
| `Tresc_Modul_12_Kalkulator_Ekrany.md` | 12 — Kalkulator | — | pełna treść |
| `Tresc_Modul_13_Live_Ekrany.md` | 13 — Tryb Live | — | pełna treść |
| `Tresc_WSZYSTKIE_MODULY_scalone.md` | wszystkie, scalone | — | plik scalający treść 13 modułów + zbiorczy rejestr twardych stopów 🔴 + rejestr rozstrzygniętych duplikatów + sekcja "znane luki" (3911 linii) |
| `Zasady_UX_Doradca_v2_1.md` | — (metodologia, nie moduł) | — | pełna metodologia autorska: szablon Sekcja A/B/C/D, taksonomia wzorców A–H (§4), kryteria kwalifikacji do wzorca D, audyt wzorców per moduł (867 linii) |
| `Biblia_Offgrid_v2_0_Architektura_Modulowa.md` | wszystkie (źródło ~579 funkcji) | — | pełne źródło, bardzo duże (15317 linii) — przeszukiwać punktowo (grep), nie wczytywać w całości bez potrzeby |

Komplet wszystkich 13 modułów treściowych + oba pliki zbiorcze (scalony + Zasady UX) + Biblia
— nic już nie musi być dosyłane ponownie w kolejnych sesjach AI. Jeśli autor projektu zaktualizuje
którykolwiek plik źródłowy, nadpisać tutaj i odnotować w `docs/memory.md` (nie cicho — Zasada 15.4).

**Ważne:** pliki modułów oznaczają swoją własną, zamkniętą numerację ekranów (np. "Ekran 15"
Modułu 2) — nie mylić z ID Biblii (`1.27` itd.) ani z numerami z `docs/rejestr-pokrycia.md`,
które mapują 1:1 na ID Biblii, nie na numer ekranu w pliku treści.

## Norma PN-HD 60364-5-52:2011 (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, zakupiona oficjalnie. Brakująca norma
blokująca M5/Ekran 1, M11/B5, M4/Ekran 25 (`docs/rejestr-pokrycia.md`) — tabele obciążalności
prądowej kabli. Plik: `PN-HD-60364-5-52-2011-Instalacje-elektryczne-niskiego-napiecia-Oprzewodowanie.pdf`
(96 stron, **skan**, nie tekst). Przeanalizowany i podzielony na rozdziały:
**`docs/zrodla/norma-PN-HD-60364-5-52/00-INDEKS.md`** — zacznij tutaj, ma mapę rozdziałów i
**obowiązkowe zastrzeżenie o jakości OCR**. [05.09.2026, aktualizacja] Załącznik B (tabele
B.52.1-B.52.21, str. 33-58) w pełni zweryfikowany wizualnie strona po stronie (nie tylko
spot-check) i skorygowany — znaleziono i naprawiono ~35 błędów OCR, w tym całe brakujące
kolumny/wiersze danych, nie tylko pojedyncze błędnie odczytane cyfry. Reszta dokumentu
(Załączniki A, C, E, F, G, H, I, ZA-ZC) ma nadal tylko wstępny spot-check, nie pełną weryfikację —
przed użyciem którejkolwiek liczby stamtąd, zweryfikuj wizualnie względem PDF. Status
wykorzystania: dane źródłowe gotowe i wiarygodne (Załącznik B), ale żaden kalkulator jeszcze ich
nie używa — patrz `docs/rejestr-pokrycia.md` i `docs/memory.md`.

## Normy PN-IEC 60364-4-41 i 4-43 (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, pliki `.doc` (Word 95/97, prywatne
wyciągi/tłumaczenia z 2002, nie oficjalny skan PKN). Ekstrakcja: `antiword`/`wvHtml` (natywny
tekst z binarnego .doc, nie OCR).
- **PN-IEC 60364-4-41:2000** (Ochrona przeciwporażeniowa) — `docs/zrodla/norma-PN-IEC-60364-4-41/`.
  **🔴 Tablice 41A i 41B (czasy wyłączenia w układach TN/IT) nie istnieją w tym pliku** — dokument
  to świadomy "Wyciąg", nie pełny tekst; sprawdzone dwiema niezależnymi metodami. Reszta treści
  (definicje SELV/PELV/FELV, wzory Zs×Ia≤U0, RA×Ia≤50V i warianty IT) kompletna.
- **PN-IEC 60364-4-43:1999** (Ochrona przed prądem przetężeniowym) — `docs/zrodla/norma-PN-IEC-60364-4-43/`.
  Kompletny, zweryfikowany krzyżowo. Zawiera Tablicę 43A (współczynnik k dla przewodów roboczych) —
  uzupełnia Załącznik A normy 5-54 (który podaje k dla przewodu ochronnego).

Status wykorzystania: przeanalizowane, niewykorzystane jeszcze w kodzie.

## Materiały branżowe: "Bezpieczeństwo instalacji fotowoltaicznych" 2019 (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, dodatek do magazynu "Rynek Elektryczny" 3/2019.
**Nie jest formalną normą** (literatura branżowa/szkoleniowa) — `docs/zrodla/materialy-branzowe-PV-2019/`.
Zawiera obszerny indeks norm specyficznych dla PV (w tym PN-HD 60364-7-712, PN-EN 62305, PN-EN 62852,
PN-EN 61215, PN-EN 62109, PN-EN 61427-1 dla off-grid), zasady prowadzenia przewodów DC/łuku
elektrycznego (tabele promieni gięcia i odległości montażowych), ochronę odgromową/przeciwprzepięciową,
zalecenia dla służb ratowniczych, harmonogram konserwacji. Status: przeanalizowany, niewykorzystany
w kodzie.

## Norma PN-HD 60364-5-54:2010 (05.09.2026)

[05.09.2026] ✅ DODANO — źródło: właściciel projektu, zakupiona oficjalnie. Dotyczy uziemień,
przewodów ochronnych (PE) i przewodów połączeń ochronnych — temat oddzielny od 5-52 (tam:
obciążalność prądowa/dobór przekroju fazowego). Plik:
`PN-HD-60364-5-54-2010-Instalacje-elektryczne-niskiego-napiecia-Uziemienia-przewody-ochronne-i-polaczen-ochronnych.pdf`
(38 stron, **natywny tekst PDF, nie skan** — bez ryzyka błędów OCR, w odróżnieniu od 5-52).
Przeanalizowany i podzielony na rozdziały: **`docs/zrodla/norma-PN-HD-60364-5-54/00-INDEKS.md`** —
zacznij tutaj. Wszystkie tabele/wzory dodatkowo zweryfikowane wizualnie względem renderu strony
(żeby uniknąć błędnego przypisania wartości do kolumn przy spłaszczeniu tekstu). Zawiera m.in.
wzór doboru przekroju przewodu ochronnego (S=√(I²t)/k, Tablica 54.3) i tablice współczynnika k
(Załącznik A) — bezpośrednio przydatne do kalkulatorów doboru PE. **Uwaga: Załącznik ZC (krajowy,
Polska) zmienia wartość 543.1.3 dla aluminium chronionego mechanicznie na 10 mm², inaczej niż
16 mm² w głównym tekście — rozbieżność odnotowana jawnie w pliku ZC, nie rozstrzygnięta cicho.**
Status wykorzystania: dopiero przeanalizowany, żaden kalkulator jeszcze go nie używa — patrz
`docs/memory.md`.
