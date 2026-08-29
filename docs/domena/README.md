# docs/domena/ — materiały źródłowe Offgrid (Biblia + treść modułów)

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
