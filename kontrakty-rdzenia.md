# Kontrakty rdzenia — Inżynier Offgrid Pro

**Wersja:** 1.2 | **Filar:** A | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 28.09.2026 | **Status:** Stabilny
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

**[07.09.2026] ✅ DOPISANO — pułapka znaleziona przy audycie GOD BOOK Część N:** echo zakłada, że dwa miejsca liczą **ten sam wzór/regułę**, nie tylko tę samą liczbę przez przypadek. `ochrona-stringow` (M3/E22) i `dobor-bezpiecznika-rozlacznika` (M5/E6) współdzieliły funkcję przez ~2 dni, bo obie mnożyły przez 1,25 — ale to były dwa różne prawa (margines Isc_STC→Isc_max wg Załącznika B.2 normy PV vs. ogólny margines doboru bezpiecznika obwodu), które tylko przypadkiem miały ten sam współczynnik. Gdy norma HD 60364-7-712 poprawiła pierwszy wzór, echo trzeba było rozdzielić (szczegóły: `docs/memory.md`, `dlug-techniczny.md`). **Zanim wyekstrahujesz echo: sprawdź, czy współdzielona liczba wynika z tego samego uzasadnienia fizycznego/normatywnego, nie tylko z tej samej wartości.**

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

## §9 Pliki danych z okresami ważności (D36, M14)

```
lib/core/dane/<nazwa>/
  <nazwa>.json     — dane (tylko wartości ✅), każda stawka: okresy { odDnia, doDnia | null, wartosc } + zrodlo, stanNa, pewnosc
  schema.ts        — schemat Zod; `pewnosc: z.literal("potwierdzone")` — bramka DANE-1 wymuszona typem, nie konwencją
  index.ts         — jedyne wejście: parsuje JSON przy załadowaniu modułu, eksportuje akcesory (wartoscWDniu, stawkaRoczna…)
  __tests__/
```

Pierwsza instancja: `lib/core/dane/rozliczenia-pl-2026/` (stawki M14). Jądro (`lib/core/modules/siec/…`) czyta dane przez
`index.ts`; UI nie importuje JSON bezpośrednio (może importować typy i akcesory z `index.ts`, jak każdą część `lib/core`).
Stawka to nigdy para (rok, wartość) — stawka jakościowa zmieniła się 1.02.2026. Wartość wpisana przez użytkownika z faktury
ma pierwszeństwo przed danymi („moje dane z faktury”, D36); brak obu = `INCOMPLETE` z listą braków, nigdy zgadywanie.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — konkretne kontrakty tego projektu, wyciągnięte z kodu (`lib/core/calc-result.ts`) i wzorców powtórzonych w ~100 zbudowanych ekranach. Wersja 1.0. |
| 07.09.2026 | **Wynik audytu GOD BOOK Część N**: dopisano do §4 pułapkę "echo z przypadku" znalezioną tego dnia (M3/E22↔M5/E6 rozdzielone, patrz `dlug-techniczny.md`, `docs/memory.md`) — dwie funkcje dzieliły współczynnik 1,25 przez zbieg okoliczności, nie wspólną regułę. Wersja 1.0→1.1. |
| 28.09.2026 | Dodano §9 — pliki danych z okresami ważności (`lib/core/dane/`, pierwsza instancja `rozliczenia-pl-2026`, M14/D36); zapis wyboru ścieżki wymagany przez `docs/przekazanie-nastepnej-sesji.md`, Krok 2a. Wersja 1.1→1.2. |
