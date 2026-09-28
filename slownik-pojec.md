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

## Sieć i rozliczenia energii (M14, od 28.09.2026)

- **OSD (operator systemu dystrybucyjnego)** — firma, która dostarcza energię siecią i świadczy
  usługę dystrybucji (PGE Dystrybucja, Tauron Dystrybucja, Enea Operator, Energa-Operator, Stoen
  Operator i mniejsi operatorzy lokalni). Taryfę OSD zatwierdza co roku Prezes URE.
- **Sprzedawca z urzędu** — sprzedawca energii, którego taryfę dla gospodarstw domowych (G)
  zatwierdza Prezes URE. Alternatywą jest oferta rynkowa albo umowa z ceną dynamiczną.
- **„Ścieżka UE” (TCO w M14, D40)** — opcjonalna dynamika cen energii w porównaniu kosztów,
  wzięta z oficjalnej projekcji Komisji Europejskiej dla Polski (EU Reference Scenario). Liczy
  się tylko tempo zmian ponad inflację, nie poziom ceny. Zawsze podpisana źródłem i datą; to
  scenariusz odniesienia, nie przewidywanie rachunku.
- **„Ścieżka UE + inflacja” (D41)** — „Ścieżka UE” pomnożona przez średnioroczną inflację
  (domyślnie średnia GUS z 15 lat, D43; albo cel NBP 2,5%). Pokazuje kwoty, które faktycznie trafią na rachunki
  w kolejnych latach (ceny nominalne). Ceny „realne” to w ekonomii ceny ponad inflację, czyli
  sama „Ścieżka UE”.
- **Grupa taryfowa G / C / B** — G to gospodarstwa domowe. C to odbiorcy na niskim napięciu
  (nN): C1x przy mocy umownej ≤ 40 kW, C2x przy mocy > 40 kW. B to średnie napięcie (SN).
- **Moc umowna / przyłączeniowa** — moc umowna to moc zamówiona w umowie; od niej w grupie C
  liczy się opłata sieciowa stała, a przy jej przekroczeniu nalicza się opłatę. Moc
  przyłączeniowa to moc z warunków przyłączenia; od niej liczy się m.in. koszt powrotu do sieci.
- **Opłata sieciowa stała / zmienna** — część dystrybucyjna rachunku. Stała naliczana jest
  miesięcznie (G: zł/mies., C: zł/kW), zmienna — od każdej pobranej kWh, osobno dla każdej strefy.
- **Opłata abonamentowa** — opłata OSD za odczyt i rozliczenie; zależy od okresu rozliczeniowego.
- **Opłata mocowa** — finansuje rynek mocy. W G jest to ryczałt zależny od progu rocznego zużycia,
  u pozostałych odbiorców — stawka za kWh pobraną w dni robocze 7:00–22:00.
- **Stawka jakościowa / opłata OZE / opłata kogeneracyjna** — składniki zmienne rachunku, zł/kWh
  albo zł/MWh. Stawka jakościowa jest jedna dla wszystkich OSD, bo pochodzi z taryfy PSE; może
  się zmienić w trakcie roku.
- **Net-metering (opusty)** — system rozliczeń prosumentów przyłączonych na wnioskach sprzed
  1.04.2022. Za 1 kWh oddaną można odebrać 0,8 kWh (instalacje ≤ 10 kW) albo 0,7 kWh (> 10 kW).
- **Net-billing / depozyt prosumencki** — system od 1.04.2022. Wartość oddanej nadwyżki (wg RCEm
  albo RCE) × 1,23 trafia na depozyt, z którego przez 12 miesięcy opłaca się pobraną energię.
- **RCE / RCEm** — rynkowa cena energii: godzinowa (RCE) albo miesięczna (RCEm). Przejście z RCEm
  na RCE jest nieodwracalne.
- **tgφ / tgφ₀** — stosunek energii biernej do czynnej: rzeczywisty (tgφ) i umowny próg (tgφ₀,
  zwykle 0,4, nie mniej niż 0,2). Nadwyżka ponad tgφ₀ jest płatna.
- **Energia bierna indukcyjna / pojemnościowa** — indukcyjną pobierają silniki i transformatory,
  pojemnościową oddaje przekompensowana bateria kondensatorów. Energia pojemnościowa jest płatna
  w całości.
- **„Cena trzymania sieci”** — nazwa robocza w M14 dla `K_stałe,rok`: rocznej sumy składników
  stałych rachunku (opłata sieciowa stała, abonamentowa, handlowa, mocowa G, z VAT). Płaci się ją
  tak długo, jak istnieją umowa i licznik, nawet przy zużyciu bliskim zera.
- **Backfeed** — podanie napięcia z instalacji wyspowej albo agregatu z powrotem do sieci OSD.
  Zagraża życiu osób pracujących na linii (twardy stop M14).
- **Przełącznik sieć – 0 – wyspa / SZR** — przełącznik z pozycją zerową i blokadą, który nie
  pozwala połączyć sieci z instalacją wyspową. SZR to samoczynne załączanie rezerwy: układ
  stycznikowy z blokadą elektryczną i mechaniczną.
- **Scenariusze A–D** — warianty przejścia w M14:
  - A — sieć + PV;
  - B — sieć + PV + magazyn;
  - C — off-grid z przyłączem jako zapasem;
  - D — pełne odłączenie.
- **TCO (Total Cost of Ownership)** — całkowity koszt posiadania w horyzoncie N lat: inwestycja
  minus dotacja, plus koszty roczne i wymiany, minus wartość rezydualna.

---

## Log zmian

| Data | Zmiana |
|---|---|
| 04.09.2026 | Utworzono — pierwszy zestaw terminów zebrany z kodu i materiałów źródłowych zaimplementowanych ekranów. Wersja 1.0. |
| 07.09.2026 | **Wynik audytu GOD BOOK Część N**: dopisano OCPR i I_SC_MAX/K1 — terminy wprowadzone 06.09.2026 przy przepisaniu `ochrona-stringow` wg normy HD 60364-7-712, dotąd nieobecne mimo zasady "rośnie od pierwszego użycia" (C.9). |
| 28.09.2026 | Dodano sekcję „Sieć i rozliczenia energii (M14)” — terminy z integracji rozdziału `03_M14_Dom_i_Firma_Siec.md` (opracowanie §11). |
| 28.09.2026 | Dodano termin „Ścieżka UE” (M14, D40). |
| 28.09.2026 | Dodano termin „Ścieżka UE + inflacja” (M14, D41). |
