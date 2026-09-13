# Słownik pojęć — Inżynier Offgrid Pro

**Wersja:** 1.0 | **Filar:** C | **Data utworzenia:** 04.09.2026 | **Ostatnia aktualizacja:** 04.09.2026 | **Status:** Stabilny (rosnący)
**Powiązane dokumenty:** `00_Biblia.md`, `kontrakty-rdzenia.md`

TL;DR: Terminy branżowe (off-grid PV/baterie/elektryka) i skróty specyficzne dla kodu tego projektu, rosnący od pierwszego użycia (C.9 GOD BOOK). Nowe terminy dopisywane na końcu, nie w środku.

---

## Elektryka / PV

- **SoC (State of Charge)** — stan naładowania baterii, w %.
- **DoD (Depth of Discharge)** — głębokość rozładowania, w %; `DoD = 100% - SoC`.
- **Voc (Open Circuit Voltage)** — napięcie obwodu otwartego panelu/stringu PV, rośnie przy spadku temperatury (kluczowe dla `stress-test-mppt`, M3/E5).
- **Vmp / Imp** — napięcie/prąd w punkcie mocy maksymalnej (MPP) panelu PV.
- **MPPT (Maximum Power Point Tracking)** — układ falownika śledzący punkt mocy maksymalnej; ma limit napięcia wejściowego, którego przekroczenie trwale uszkadza wejście DC.
- **STC (Standard Test Conditions)** — warunki referencyjne pomiaru mocy panelu: 25°C, 1000 W/m², AM1.5.
- **γ (gamma)** — współczynnik temperaturowy mocy panelu [%/°C], zwykle ujemny.
- **β (beta)** — współczynnik temperaturowy Voc [%/°C], zwykle ujemny (Voc rośnie przy spadku temperatury).
- **C-rate** — jednostka prądu ładowania/rozładowania baterii względem jej pojemności (1C = prąd równy pojemności w Ah, np. 100Ah×1C=100A).
- **BMS (Battery Management System)** — system zarządzania baterią: balansowanie, ochrona, komunikacja.
- **e-Fuse** — elektroniczny bezpiecznik reagujący w <100µs, szybszy niż zwykły topikowy (~10ms); wymagany, gdy prąd zwarciowy przekracza zdolność łączeniową tranzystorów BMS.
- **IMD (Insulation Monitoring Device)** — monitor izolacji, wykrywa doziemienie w obwodzie DC pływającym.
- **AIC (Ampere Interrupting Capacity)** — zdolność wyłączania bezpiecznika; musi przekraczać prąd zwarciowy obwodu.
- **OCPR (Overcurrent Protection Rating)** — `I_MOD_MAX_OCPR`, maksymalny prąd zabezpieczenia nadprądowego dopuszczalny dla modułu PV wg jego karty katalogowej (EN 61730-1); górna granica przedziału doboru bezpiecznika stringu, norma HD 60364-7-712 §712.431.102.
- **I_SC_MAX / K1** — prąd maksymalny zwarciowy stringu PV, `I_SC_MAX = K1 × I_SC_STC` (K1≥1,25, minimum normowe), Załącznik B.2 normy HD 60364-7-712 — margines na katalogowym Isc, odrębny od doboru bezpiecznika (nie mylić, patrz `dlug-techniczny.md`/`docs/memory.md`, korekta 06-07.09.2026).
- **IP-kod** — stopień ochrony obudowy (np. IP55) wg normy IEC 60529.
- **V2H / V2L (Vehicle-to-Home / Vehicle-to-Load)** — oddawanie energii z baterii trakcyjnej EV do domu (V2H, wysoka moc) albo do pojedynczych urządzeń (V2L, niższa moc, np. do 3,6 kW).
- **cos φ** — współczynnik mocy, stosunek mocy czynnej do pozornej; `VA = P / cos φ`.
- **Common Port / Separate Port** — dwie topologie BMS: wspólne złącze ładowania/rozładowania (Common Port) vs osobne (Separate Port).
- **Pre-Charge** — obwód wstępnego ładowania kondensatorów falownika przed załączeniem głównego stycznika, zapobiega zaiskrzeniu.
- **Cold C-Rate** — ograniczenie maksymalnego prądu ładowania LiFePO4 w niskich temperaturach (osadzanie litu metalicznego poniżej ~0°C).
- **Cold Cranking Amps (CCA)** — prąd, jaki bateria dostarcza chwilowo przy zimnym starcie dużego odbiornika, ograniczony spadkiem napięcia (`V_sag = Voc - I×R_wewn`).

## Bateria / chemia

- **LiFePO4** — chemia litowo-żelazowo-fosforanowa, dominująca w tym projekcie dla magazynów off-grid (bezpieczna termicznie, ale wrażliwa na ładowanie w mrozie).
- **SoH (State of Health)** — stan zdrowia baterii/ogniwa względem stanu fabrycznego (pojemność albo rezystancja wewnętrzna).
- **LID / LETID / PID** — trzy mechanizmy degradacji paneli PV: Light-Induced Degradation (szybka, 1. rok), Light and Elevated Temperature-Induced Degradation (powolna, kolejne lata), Potential-Induced Degradation (zależna od napięcia systemu i wilgotności).

## Architektura kodu tego projektu

- **`CalcResult<T>`** — kontrakt wyniku każdego kalkulatora domenowego. Pełna definicja: `kontrakty-rdzenia.md` §2.
- **Wzorzec "echo"** — ekstrakcja współdzielonego wzoru do jednej, eksportowanej funkcji zamiast duplikowania go w dwóch kalkulatorach. `rejestr-decyzji.md` D12.
- **Twardy stop** — warunek, który zawsze skutkuje werdyktem 🔴 (poziom `critical`); zbiorczy rejestr: `docs/rejestr-twardych-stopow.md`.
- **Wzorzec A–H** — 8 wzorców UI ekranu (przełącznik trybu / karty porównawcze / akordeon / Doradca / checklist / przewodnik z ilustracją / raport / katalog komponentów). Pełna taksonomia: `docs/standards/08-ui-ux.md`.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — pierwszy zestaw terminów zebrany z kodu i materiałów źródłowych zaimplementowanych ekranów. Wersja 1.0. |
| 07.09.2026 | **Wynik audytu GOD BOOK Część N**: dopisano OCPR i I_SC_MAX/K1 — terminy wprowadzone 06.09.2026 przy przepisaniu `ochrona-stringow` wg normy HD 60364-7-712, dotąd nieobecne mimo zasady "rośnie od pierwszego użycia" (C.9). |
