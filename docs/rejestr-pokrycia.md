# Rejestr pokrycia — Inżynier Offgrid Pro

Status implementacji każdej funkcji Biblii (579 funkcji, `ZASADY_APLIKACJI.md` §12, D-01 zamknięty).
Zasada: `docs/standards/14-proces-i-pamiec.md` (14.1) — statusy `todo / in-progress / done`,
mapowane po ID z Biblii. Zaczynamy od Modułu 2 (Zapotrzebowanie/Bilans obciążeń), zgodnie z
decyzją wznowienia Etapu 1 (`docs/memory.md`, 2026-08-29).

Nie usuwać wierszy przy zmianie statusu — aktualizować kolumnę Status i (jeśli istotne) dopisywać
notatkę, zgodnie z `docs/standards/15-wspolpraca-z-ai.md` (15.3, "nie usuwaj — oznacz").

## Moduł 2 — Zapotrzebowanie energetyczne (Bilans obciążeń)

| Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|
| 1 | 1.1 | Systemy podtrzymania życia (Survival Core) | **done** | `lib/core/modules/zapotrzebowanie/systemy-podtrzymania-zycia/`, UI: `app/kalkulatory/systemy-podtrzymania-zycia/page.tsx`, 6 testów. "Ogrzewanie" bez domyślnej mocy — luka źródła, wymaga ręcznego wpisania (błąd 🔴, nie ciche zero). |
| 2 | 1.2 | Inteligentny bojler C.W.U. | todo | |
| 3 | 1.3, 1.4, 1.5 | Urządzenia zmienne + płyta indukcyjna + klasa energetyczna | todo | |
| 4 | 1.6 | Liczba domowników | todo | |
| 5 | 1.7, 1.16 | Profil dobowy + astronomiczny dzień/noc | todo | |
| 6 | 1.8 | Sezonowość i tryb wakacyjny | todo | |
| 7 | 1.9 | Dni autonomii | todo | |
| 8 | 1.10, 1.11, 1.21 | Zaawansowane parametry obciążenia | todo | |
| 9 | 1.12 | Pobór własny falownika | todo | |
| 10 | 1.13 | Sprawność inwertera przy niskim obciążeniu | todo | |
| 11 | 1.17 | Przetwornice DC/DC | todo | |
| 12 | 1.20 | Macierz priorytetów odłączania (Smart Load Shedding) | todo | |
| 13 | 1.25 | Bufor na rozbudowę | todo | |
| 14 | 1.26 | Architektura 1-fazowa/3-fazowa | todo | |
| 15 | 1.27 | Kategorie specjalne (warsztat/gospodarstwo/oświetlenie terenowe) | todo | |
| **16** | **1.22, 1.23** | **Kalkulatory pomocnicze (W→A, Ah↔Wh, czas pracy)** | **done** | pierwszy pełny przykład end-to-end: `lib/core/modules/zapotrzebowanie/kalkulatory-pomocnicze/` (input/calculator/validation/warnings/constants + 9 testów), UI: `app/kalkulatory/pomocnicze/page.tsx`. Zweryfikowane: testy, typecheck, lint, build, ręcznie w przeglądarce (3 stany werdyktu). |
| — | 1.24, 1.28–1.50 | Moduł zbiorczy: Wampiry energetyczne (24 funkcje) | todo | jeden ekran zbiorczy, treść w Biblii poza tym repo |

### Funkcje przeniesione (nie mają tu ekranu — implementować przy docelowym module)

| ID Biblii | Nazwa | Cel | Status |
|---|---|---|---|
| 1.14 | Cykle odszraniania pompy ciepła | → Moduł 6 (Ogrzewanie), scalone z 5.6+6.8 | todo (przy Module 6) |
| 1.15 | Grzałki BMS i samorozładowanie ogniw | → Moduł 4 (Baterie), scalone z 3.5+3.14 | todo (przy Module 4) |
| 1.18 | Degradacja i starzenie (aging factor) | zasila Moduł 3 Ekran 19 i Moduł 4 Ekran 6 jednocześnie, bez własnego ekranu | todo (przy Module 3/4) |

### Luka wykryta i udokumentowana

| ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|
| 1.19 | Agregat prądotwórczy — definicja i logika | **luka** | zaplanowana jako osobny ekran D w Module 2 (§20 Zasad UX), treść źródłowa gotowa w Biblii, nigdy nie przepisana do pliku treści modułu ani ujęta w sekcji "znane luki" pliku scalonego — patrz `docs/memory.md`. Do dopisania przy domykaniu Modułu 2. |

## Moduł 1 — Lokalizacja (Geostruktura)

**Brak pełnej treści źródłowej w tym repo** — mamy tylko skrót audytowy (`docs/memory.md`).
Rejestr poniżej wstępny, do uzupełnienia gdy treść dotrze.

| Ekran | ID Biblii | Nazwa | Status |
|---|---|---|---|
| 1 | 0.1 | GPS i pobranie lokalizacji/klimatu | todo |
| 2 | 0.2 | Skaner działki (online/offline) | todo |
| 3 | 0.3 | Analiza zacienienia (horyzont cieni) | todo |
| 4 | 0.4 | Bryła budynku i orientacja ścian | todo |

## Pozostałe moduły (3–13)

Nie rozpoczęte. Rejestr zostanie rozszerzony o kolejne moduły w miarę postępu prac, zgodnie z
kolejnością z `ZASADY_APLIKACJI.md` §14.
