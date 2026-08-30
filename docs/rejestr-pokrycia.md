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

~~Brak pełnej treści źródłowej w tym repo~~ — **korekta 2026-08-29:** pełna treść (4 ekrany)
dotarła i jest w `docs/domena/Tresc_Modul_1_Lokalizacja_Ekrany.md`. Implementacja wciąż nie
rozpoczęta (poniżej `todo`), tylko materiał źródłowy jest już kompletny.

| Ekran | ID Biblii | Nazwa | Status |
|---|---|---|---|
| 1 | 0.1 | GPS i pobranie lokalizacji/klimatu | todo |
| 2 | 0.2 | Skaner działki (online/offline) | todo |
| 3 | 0.3 | Analiza zacienienia (horyzont cieni) | todo |
| 4 | 0.4 | Bryła budynku i orientacja ścian | todo |

## Moduły 3–13 — wzorce UI reprezentatywne (przygotowanie pod v0)

**2026-08-29 — decyzja:** zamiast budować moduły 3–13 po kolei ekran-po-ekranie, wybrano po
jednym reprezentatywnym ekranie na każdy z 8 wzorców UI A–H (`docs/standards/08-ui-ux.md`, 8.2),
żeby zebrać je w jedną, spójną paczkę do przekazania v0/Vercel (ustalenie systemu projektowego
naraz, zamiast osobno per moduł). Treść źródłowa dla wszystkich 13 modułów jest już kompletna w
`docs/domena/`. Poniższe 8 ekranów jest w pełni zaimplementowane (domena + testy + UI,
zweryfikowane ręcznie w przeglądarce); **pozostałe ekrany tych modułów są nadal `todo`** — pełne
wyliczenie per-funkcja dla modułów 3, 4, 5, 8, 9 (i wciąż nietkniętych 6, 7, 10, 11, 12, 13) do
dopisania w kolejnym przejściu, nie zgadywane teraz.

| Wzorzec | Moduł / Ekran | ID Biblii | Nazwa | Status | Notatka |
|---|---|---|---|---|---|
| A — przełącznik trybu | Moduł 3 / Ekran 11 | 2.19–2.21 | Konfigurator stringów PV (szereg/równolegle/mieszany) | **done** | `lib/core/modules/pv/konfigurator-stringow/`, UI: `app/kalkulatory/konfigurator-stringow/page.tsx`, 8 testów. |
| B — karty porównawcze | Moduł 4 / Ekran 30 | 3.34 | Porównanie technologii magazynów (LiFePO4/AGM/GEL/Trakcyjna) | **done** | `lib/core/modules/baterie/porownanie-technologii/`, UI: `app/kalkulatory/porownanie-technologii-magazynow/page.tsx`, 5 testów. |
| C — akordeon/informacja | Moduł 3 / Ekran 24 | 2.16, 2.40, 2.44 | Czystość i śnieg na panelach | **done** | `lib/core/modules/pv/czystosc-i-snieg/`, UI: `app/kalkulatory/czystosc-i-snieg/page.tsx`, 12 testów. Zakres kąta 10–15° — luka źródła zgłoszona w kodzie (komunikat, nie cichy default). |
| D — Doradca (werdykt bezpieczeństwa) | Moduł 4 / Ekran 24 | 3.27 | Dobór bezpiecznika DC (AIC/Class T/NH) | **done** | `lib/core/modules/baterie/dobor-bezpiecznika-dc/`, UI: `app/kalkulatory/dobor-bezpiecznika-dc/page.tsx`, 6 testów. Jeden z najpoważniejszych twardych stopów źródła (AIC < prąd zwarciowy → 🔴). |
| E — checklist weryfikacyjna | Moduł 4 / Ekran 11 | 3.12 | Moment dokręcania śrub (Torque Control) | **done** | `lib/core/modules/baterie/moment-dokrecania-srub/`, UI: `app/kalkulatory/moment-dokrecania-srub/page.tsx`, 5 testów. Bez validation.ts/warnings.ts — checklist nie ma stanu nieprawidłowego do walidacji. |
| F — przewodnik z ilustracją | Moduł 5 / Ekran 19 | 4.22 | Trasy kablowe — prowadzenie i separacja | **done** | `lib/core/modules/okablowanie/trasy-kablowe/` (tylko `constants.ts`, brak kalkulatora — ekran bez pól wejściowych), UI: `app/kalkulatory/trasy-kablowe/page.tsx` z ilustracją SVG. Bez testów jednostkowych (brak logiki domenowej do testowania). |
| G — raport/podsumowanie | Moduł 8 / Ekran 11 | 12.57 | Autonomiczny audyt bezpieczeństwa pożarowego | **done** | `lib/core/modules/bezpieczenstwo/audyt-pozarowy/`, UI: `app/kalkulatory/audyt-pozarowy/page.tsx`, 5 testów. **Dane demonstracyjne** (`SAMPLE_AUDIT_ITEMS`) — docelowa wersja czerpie na żywo z Modułów 8/9/13, jawnie oznaczone w kodzie i UI. |
| H — katalog komponentów | Moduł 9 / Katalog 1 | — | Katalog czujników (dodawanie wielu instancji) | **done** | `lib/core/modules/esp32/katalog-czujnikow/`, UI: `app/kalkulatory/katalog-czujnikow/page.tsx`, 3 testy. Katalog 21 typów czujników 1:1 ze źródła. |

## Pozostałe moduły (6, 7, 10, 11, 12, 13)

Nie rozpoczęte poza wzorcami wyżej. Treść źródłowa kompletna w `docs/domena/`. Rejestr zostanie
rozszerzony o kolejne moduły w miarę postępu prac, zgodnie z kolejnością z `ZASADY_APLIKACJI.md` §14.
