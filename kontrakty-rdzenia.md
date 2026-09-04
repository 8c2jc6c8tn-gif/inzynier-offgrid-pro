# Kontrakty rdzenia — Inżynier Offgrid Pro

**Wersja:** 1.0 | **Filar:** A | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 04.09.2026 | **Status:** Stabilny
**Powiązane dokumenty:** `00_Biblia.md`, `zlote-zasady.md`, `docs/standards/01-architektura.md`, `docs/standards/03-jadro-obliczeniowe.md`, `docs/standards/04-walidacja-i-twarde-stopy.md`

TL;DR: Konkretne, przetestowane kontrakty tego projektu — realizacja abstrakcyjnego wymogu G.3 GOD BOOK. Startuje jako kopia rozdz. 01–07 Standardu wspólnego (Część Y.3 GOD BOOK), tu tylko to, co specyficzne dla off-grid PV albo warte podkreślenia w formie skróconej. Pełna treść: `docs/standards/`.

---

## §1 Warstwy (Zasada 1, `docs/standards/01-architektura.md`)

```
lib/core/        → czyste funkcje: calc, profile, walidacja, i18n, reguły — ZAKAZ importu z app/components
lib/adapters/     → StorageAdapter, WeatherAdapter... (obecnie: tylko interfejs, implementacja IndexedDB odłożona)
app/              → ekrany Next.js, komponenty, hooki
```

Egzekwowane lintem: `core` nie importuje z `app` ani `adapters`. Import między dwoma modułami wewnątrz `lib/core/modules/` jest dozwolony i pożądany (wzorzec echo, §4) — to nie jest import w górę warstw.

## §2 Kontrakt wyniku — `CalcResult<T>` (G.3 „kontrakt wyniku/widżetu")

```ts
export type Status = "VALID" | "VALID_WITH_WARNINGS" | "INCOMPLETE" | "OUT_OF_SCOPE" | "INVALID_INPUT"
export type WarningLevel = "info" | "warning" | "critical"

export type Warning = {
  code: string              // stabilny identyfikator, np. "PRZEKROCZONY-LIMIT-MPPT"
  level: WarningLevel
  message: string           // "po ludzku", konkretny, bez straszenia
  technicalMessage: string  // uzasadnienie techniczne/fizyczne
  field?: string
}

export type CalcResult<T> = {
  value: T
  unit: string
  status: Status
  formula: string                    // LaTeX
  inputs: Record<string, number>     // TYLKO pola numeryczne — string/boolean pomijane
  assumptions: string[]
  warnings: Warning[]
  calculatorVersion: string
  traceId?: string
}
```

Źródło kanoniczne w kodzie: `lib/core/calc-result.ts`. Reguła statusu (D13, `rejestr-decyzji.md`): tylko `warning`/`critical` podnoszą status na `VALID_WITH_WARNINGS`, same `info` zostawiają `VALID`.

## §3 Kontrakt zapisu — "Zapisuj Seed, nigdy Wynik" (rozdz. 05.1 Standardu)

Zapisujemy dane wejściowe (`input`), nie wynik obliczenia (`CalcResult.value`) — stare zapisane stany korzystają automatycznie z poprawionych wzorów przy kolejnym uruchomieniu. **Status implementacji:** `StorageAdapter` istnieje jako interfejs (Zasada 5, `zlote-zasady.md`), implementacja IndexedDB świadomie odłożona (`backlog-poza-v1.md`) — obecne ekrany trzymają stan tylko w React state, nie zapisują trwale. Ten kontrakt obowiązuje od momentu, gdy trwały zapis zostanie zbudowany.

## §4 Wzorzec "echo" — współdzielona logika bez duplikacji (D12, `rejestr-decyzji.md`)

Gdy drugi kalkulator potrzebuje tego samego wzoru co istniejący: wyekstrahuj wzór z pierwszego do osobnej, eksportowanej, czystej funkcji (`export function oblicz...(...)`) obok głównej funkcji `calculate...`, zaimportuj ją w drugim module. Przykłady w kodzie: `obliczCzasPreChargeS` (M4/M11), `obliczPradZwarciowyA` (M4/E9↔E24), `obliczPojemnoscUzytecznaKwh` (M2/E7↔M4/E1), `obliczKosztZaKwh` (M4/E19↔E23).

## §5 Konwencja `number | null` dla pól, gdzie `0` jest legalną wartością (D15)

Domyślnie `0` = "jeszcze nie wpisano" dla pól zawsze dodatnich (moc, długość, cena). Gdy `0` jest realną, legalną wartością (temperatura, SoC, nadwyżka produkcji) — typ pola to `number | null`, `null` = "nie wpisano".

## §6 Twardy stop — kontrakt UI (D14)

Kolor werdyktu w UI liczony z `result.warnings.some(w => w.level === "critical" | "warning")`, nigdy bezpośrednio z `result.status` (dwuwartościowy enum nie rozróżnia żółtego od czerwonego). Wzorcowa implementacja: `app/kalkulatory/dobor-bezpiecznika-dc/page.tsx`. Zbiorczy rejestr wszystkich twardych stopów aplikacji: `docs/rejestr-twardych-stopow.md`.

## §7 Profil regionalny (Zasada 4)

`lib/core/profiles/{types,pl}.ts` — Zod, profil `PL` (waluta, format liczb). Rozszerzany w miarę potrzeb kolejnych kalkulatorów, nie zaprojektowany z góry w całości.

## §8 Nazewnictwo plików modułu domenowego (wzorzec, powtórzony ~100 razy)

```
lib/core/modules/<obszar>/<nazwa-ekranu>/
  input.ts        — typ wejścia, komentarz z ID Biblii/moduł/ekran/sekcja źródła
  constants.ts     — nazwane stałe (zakaz magicznych liczb, Zasada 2)
  warnings.ts      — funkcje budujące Warning
  validation.ts    — walidacja wejścia → Warning[]
  calculator.ts    — calculate...(input): CalcResult<T>, z FORMULA jako string LaTeX
  __tests__/*.test.ts
app/kalkulatory/<nazwa-ekranu>/page.tsx
```

Rejestracja w `lib/pulpit/registry.ts` (jedyne źródło prawdy dla nawigacji), status w `docs/rejestr-pokrycia.md`.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — konkretne kontrakty tego projektu, wyciągnięte z kodu (`lib/core/calc-result.ts`) i wzorców powtórzonych w ~100 zbudowanych ekranach. Wersja 1.0. |
