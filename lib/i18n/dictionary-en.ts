/**
 * Słownik tłumaczeń — angielski. Klucze i placeholdery `{nazwa}` muszą dokładnie odpowiadać
 * `dictionary-pl.ts` — `satisfies Record<KluczTlumaczenia, string>` niżej wymusza to typem
 * (brakujący/dodatkowy klucz = błąd kompilacji, nie cichy fallback, docs/standards/17-i18n.md 17.1).
 */
import type { KluczTlumaczenia } from "./dictionary-pl"

export const dictionaryEn = {
  "WARTOSC-NIEDODATNIA": 'The value of "{label}" must be greater than zero.',
  "SPRAWNOSC-POZA-ZAKRESEM": "Efficiency must be a number in the range (0, 1].",
  "SPRAWNOSC-NISKA": "The entered efficiency is unusually low — check that you haven't mixed up units.",
  "MOC-NIETYPOWO-WYSOKA": "This is an unusually high power value — check that you haven't mixed up units.",
  "SPRAWNOSC-DOMYSLNA": "System efficiency assumed as {efficiency} (default value, not measured).",
  "WARTOSC-POZA-ZAKRESEM": 'Value of field "{label}" must be within the range {min}–{max}.',
  "POZYCJA-NIEDODATNIA": 'Selected item "{label}" must have power greater than zero.',
  "BRAK-ZAZNACZONYCH": "No critical load has been selected.",
  "POZYCJA-WARTOSC-DOMYSLNA": '"{label}" used with default power {value} W (not edited).',
  "COP-POZA-ZAKRESEM": "COP must be within the range {min}–{max} for a typical heat pump.",
  "MOC-CIEPLNA-NIETYPOWO-WYSOKA":
    "This is an unusually high thermal power value — check that you haven't mixed up the units (kW, not W).",
  "COP-ZALEZY-OD-TEMPERATURY":
    "COP depends on outdoor temperature — the given value applies only to current conditions and is not " +
    "constant throughout the season (see the manufacturer's COP curve).",
  "DANE-KLIMATYCZNE-TRYB-OFFLINE":
    "Solar irradiance/climate zone data will eventually require integration with PVGIS/PVWatts (online) — " +
    "at this stage, only offline mode with manual entry of the minimum temperature is available.",
  "LICZBA-DOMOWNIKOW-POZA-ZAKRESEM": "The number of household members must be within the range {min}–{max}.",
  "CWU-ZAKRES-ORIENTACYJNY":
    "A range of {min}–{max} l of domestic hot water per person per day — an indicative source value, not measured.",
  "ZAPOTRZEBOWANIE-UJEMNE": "Daily demand cannot be negative.",
  "SPRAWNOSC-PROCENT-POZA-ZAKRESEM": "Inverter efficiency must be within the range 0–100%.",
  "DOD-POZA-ZAKRESEM": "DoD (depth of discharge) must be within the range 0–100%.",
  "WPLYW-NA-MAGAZYN":
    "With {dni} days of autonomy and the entered parameters, the storage needs approx. {pojemnosc} kWh " +
    "of usable capacity (estimate — full calculation: Module 4, Screen 1).",
  "COS-FI-POZA-ZAKRESEM": "Power factor (cos φ) must be within the range 0–1.",
  "MOC-POZORNA-INFO":
    "Watts on the nameplate aren't the whole story — the inverter actually sees {va} VA, not {w} W, of real load.",
  "SZACUNEK-MAGAZYNU-WYMAGA-DANYCH":
    "Estimating the impact on storage size requires entering the daily demand, inverter efficiency, and DoD.",
  "TEMPERATURA-POWYZEJ-ZAKRESU":
    "Cell temperature ({temp}°C) exceeds the allowed {max}°C — risk of permanently accelerated " +
    "degradation. A battery isn't an oven — high temperature doesn't just temporarily reduce " +
    "performance, it permanently accelerates cell aging.",
  "TEMPERATURA-PONIZEJ-ZAKRESU":
    "Cell temperature ({temp}°C) is below the allowed operating range ({min}°C) — this isn't an " +
    "overheating risk (this screen's topic); check the cold-weather charge current limit on the " +
    "separate screens (Cold C-Rate, Cold Cranking Amps).",
  "TEMPERATURA-W-ZAKRESIE": "Cell temperature ({temp}°C) is within the allowed operating range of {min}–{max}°C.",
  "BLOKADA-LADOWANIA-MROZ":
    "Cell temperature {temp}°C — below -10°C charging is completely blocked. Charging under these " +
    "conditions permanently damages the cells (lithium metal plating).",
  "LIMIT-PRADU-ZIMNO": "Cell temperature {temp}°C — maximum charge current limited to 0.1C ({maxPrad} A).",
  "LIMIT-PRADU-CHLODNO": "Cell temperature {temp}°C — maximum charge current limited to 0.2C ({maxPrad} A).",
  "LUKA-TABELI-ZRODLA":
    "Cell temperature {temp}°C — the source doesn't provide a C-rate limit for the 5–10°C range (gap " +
    "in the original table). Check the cell manufacturer's specification for this range — we don't " +
    "guess an intermediate value.",
  "POJEMNOSC-NIEDODATNIA": "Pack capacity must be greater than zero.",
  "FALOWNIK-SIE-WYLACZY":
    "Voltage under starting load will sag to {vSag} V — below the inverter's minimum operating " +
    "voltage ({minNap} V). The inverter will shut down.",
  "FALOWNIK-UTRZYMA-NAPIECIE":
    "Voltage under starting load will sag to {vSag} V — above the inverter's minimum operating voltage ({minNap} V).",
  "WARTOSC-UJEMNA": "{label} cannot be negative.",
  "REZYSTANCJA-ZMIERZONA-W-TEMPERATURZE":
    "The internal resistance entered by the user is already measured at the current cell temperature.",
  "BRAK-ZABEZPIECZENIA-DOZIEMIENIA":
    "No insulation monitor (IMD) or DC residual current device — a fault in the panel will put a " +
    "dangerous potential on the frame without detection. DC current holds a shock victim more " +
    "strongly than AC — install an IMD or a DC RCD.",
  "ZABEZPIECZENIE-OBECNE": "Ground fault protection is present (IMD or DC RCD).",
  "WYMAGANY-E-FUSE":
    "The pack's short-circuit current ({pradA} A) exceeds the BMS transistors' switching capability " +
    "({zdolnoscA} A) — an ordinary fuse (~10ms) is too slow, the BMS needs an e-Fuse function " +
    "(instant shutdown, <100µs).",
  "E-FUSE-NIEPOTRZEBNY":
    "The pack's short-circuit current ({pradA} A) is within the BMS transistors' switching capability ({zdolnoscA} A).",
  "MODEL-ZWARCIA-PROSTEGO":
    "Simple full short-circuit model (wiring and connection resistance ignored) — the same model as " +
    "Screen 24 (DC Fuse Sizing).",
  "BRAK-LIMITU-PRADU-POWYZEJ-10C": "Above 10°C the source doesn't limit current from the cell temperature side.",
  "AIC-PONIZEJ-PRADU-ZWARCIOWEGO":
    "This fuse's interrupt rating (AIC) is lower than the pack's short-circuit current — the fuse " +
    "will rupture, forming a plasma arc, instead of safely interrupting the circuit.",
  "AIC-PONIZEJ-ZALECANEGO-MINIMUM":
    "For LiFePO4 systems a minimum AIC of {min} A is recommended — this fuse is below that value, " +
    "even though it will withstand this pack's calculated short-circuit current.",
  "MODEL-ZWARCIA-PROSTEGO-NIZSZY":
    "Simple full short-circuit model (wiring and connection resistance ignored) — the actual " +
    "short-circuit current in the installation may be somewhat lower.",
  "ZAPOTRZEBOWANIE-NIEDODATNIE": "Daily demand must be greater than zero.",
  "DNI-AUTONOMII-NIEDODATNIE": "Days of autonomy must be greater than zero.",
  "SPRAWNOSC-PROCENT-DODATNIA-POZA-ZAKRESEM": "Inverter efficiency must be within the range 0–100% (>0).",
  "DOD-DODATNI-POZA-ZAKRESEM": "DoD (depth of discharge) must be within the range 0–100% (>0).",
  "BUFOR-STARZENIOWY-NIE-DOLICZONY": "Without an aging buffer (Screen 5, Module 4) — this screen doesn't exist in the code yet.",
  "SOC-POZA-ZAKRESEM": "SoC must be within the range 0–100%.",
  "MOC-LADOWANIA-UJEMNA": "PV charging power cannot be negative.",
  "MOC-ROZLADOWANIA-NIEDODATNIA": "Nighttime discharge power must be greater than zero.",
  "DLUGOSC-DNIA-POZA-ZAKRESEM": "The charging window length must be within the range 0–24 hours.",
  "NIE-PRZETRWA-NOCY":
    "With these parameters the battery will reach the SoC warning threshold before the end of the night — " +
    "check whether the discharge power or capacity are realistic.",
  "SYMULACJA-SREDNIA-MOC-NIE-PROFIL-GODZINOWY":
    "The simulation uses the average charging/discharging power over the whole window, not a full hourly " +
    "profile — the actual course of the day/night may differ.",
  "NAPIECIE-ODCIECIA-NIEDODATNIE": "Cutoff voltage must be greater than zero.",
  "LICZBA-OGNIW-NIEPOPRAWNA": "The number of series-connected cells must be an integer of at least 1.",
  "EKSTRAPOLACJA-POZA-KALIBRACJA":
    "This per-cell voltage is outside the 2.625–2.750V range the model is calibrated on (two data points " +
    "from the source) — the result is an extrapolation, not a verified calibration.",
  "MODEL-LIFEPO4-DWA-PUNKTY-KALIBRACJI":
    "Linear model calibrated on two LiFePO4 data points from the source (42.0V/16S→100% DoD→2000 cycles; " +
    "44.0V/16S→80% DoD→5000 cycles) — not the full manufacturer curve.",
  "OCZEKIWANIE-NA-SLONCE":
    "SoC is below the critical threshold, but the forecast predicts sun tomorrow — the system " +
    "deliberately does NOT start the generator, it waits for free PV energy.",
  "BRAK-DOSTEPNEGO-ZRODLA-LADOWANIA":
    "SoC is below the critical threshold and no charging source is available (no PV, no generator or " +
    "sun forecast, no cheap grid tariff) — a real risk of SoC dropping further.",
  "PRODUKCJA-NOMINALNA-NIEDODATNIA": "Nominal daily PV production must be greater than zero.",
  "POZIOM-ZACHMURZENIA-POZA-ZAKRESEM": "The cloud-cover level must be within the range 0–100%.",
  "LICZBA-DNI-SCENARIUSZA-NIEDODATNIA": "The scenario length in days must be greater than zero.",
  "SYSTEM-NIE-PRZETRWA-SCENARIUSZA":
    "With these parameters the system will not survive the full cloud-cover scenario — a blackout will " +
    "occur before the given number of days runs out.",
  "BRAK-POTRZEBY-GRZANIA":
    "Temperature ({temp}°C) is high enough that the BMS doesn't turn on the heaters before charging (threshold: {prog}°C).",
  "GRZANIE-Z-PV": "There is PV production — the BMS heaters are powered directly from the panels, zero load on the battery.",
  "GRZANIE-Z-BATERII":
    "No PV production, but SoC ({soc}%) is above {prog}% — heating from the battery, only until the " +
    "minimum charging temperature is reached.",
  "GRZANIE-WSTRZYMANE":
    "No PV production and SoC ({soc}%) below {prog}% — heating suspended, sleep mode. The BMS will " +
    "block charging at this temperature until PV appears or SoC rises.",
  "REKOMENDOWANA-KALIBRACJA-SOC":
    "{dni} days without a full charge (threshold: {prog}) — do a full charge so the BMS can catch its " +
    "reference points. Current counting in the BMS is a continuous estimate, and error accumulates " +
    "without a periodic reset.",
  "KALIBRACJA-NIEPOTRZEBNA":
    "{dni} days since the last full charge — below the {prog}-day threshold, calibration isn't needed yet.",
  "DNI-UJEMNE": "The number of days since the last full charge cannot be negative.",
  "WARTOSC-POLA-UJEMNA": 'The value of "{label}" cannot be negative.',
  "FAZA-CC": "Voltage hasn't reached the absorption threshold yet ({prog} V) — CC (constant current) phase in progress.",
  "FAZA-CV-KONCOWKA":
    "Absorption voltage reached, but current ({aktualny} A) is still above the tail threshold " +
    "({prog} A) — don't disconnect charging, CV (constant voltage) phase in progress.",
  "LADOWANIE-ZAKONCZONE": "Current dropped below the tail threshold ({prog} A) — battery fully charged.",
  "TEMPERATURA-FIZYCZNIE-NIEMOZLIWA": "The given temperature is physically impossible.",
  "PROG-KONCOWY-POZA-ZAKRESEM": "The tail current threshold (as a fraction of C) must be within the range 0–1.",
  "SOC-POZA-ZALECANYM-ZAKRESEM":
    "Target SoC ({soc}%) is outside the recommended range of {min}–{max}%. A battery doesn't like " +
    "being either drained (0% SoC) or fully charged (100% SoC) for long periods of inactivity.",
  "TEMPERATURA-PONIZEJ-MINIMUM-BEZPIECZNEGO":
    "The expected temperature ({temp}°C) is below the safe minimum of {min}°C — protect against frost or change the storage location.",
  "SOC-DOCELOWY-POZA-ZAKRESEM": "Target SoC must be within the range 0–100%.",
  "ROZNICA-NAPIEC-ZA-DUZA":
    "The voltage difference between the batteries ({roznica} V) exceeds {prog} V — risk of sparking at the moment of connection.",
  "INNA-CHEMIA-BEZ-IZOLACJI":
    "The batteries have different cell chemistries — mixing different chemistries without galvanic isolation between them is dangerous.",
  "PRAD-WYROWNAWCZY-CHWILA-POLACZENIA":
    "Equalizing current calculated at the moment of connection (rest voltages) — doesn't account " +
    "for further charge/discharge dynamics under load.",
  "WARTOSC-NIE-MOZE-BYC-UJEMNA": "The value cannot be negative.",
  "POKRYTE-W-CALOSCI-LATO": "Summer: PV surplus fully covers EV charging.",
  "POKRYTE-W-CALOSCI-ZIMA": "Winter: PV surplus fully covers EV charging.",
  "BRAKUJE-ENERGII-LATO":
    "Summer: short by {brak} kWh/day — you'll need to draw on the home battery, a generator, the grid, or increase PV.",
  "BRAKUJE-ENERGII-ZIMA":
    "Winter: short by {brak} kWh/day — you'll need to draw on the home battery, a generator, the grid, or increase PV.",
  "POJEMNOSC-FALOWNIKA-NIEDODATNIA": "The inverter's DC input capacitance must be greater than zero.",
  "REZYSTANCJA-PRECHARGE-NIEDODATNIA": "The pre-charge resistor must be greater than zero.",
  "POBOR-UJEMNY": "{label} cannot be negative.",
  "WILGOTNOSC-POZA-ZAKRESEM": "Relative humidity must be within the range 0–100%.",
  "RYZYKO-KONDENSACJI":
    "The enclosure temperature ({temp}°C) is below the dew point ({rosa}°C) — high risk of water " +
    "condensing inside. A wet BMS and copper busbars are a recipe for a short circuit.",
  "BEZPIECZNY-MARGINES":
    "The enclosure temperature ({temp}°C) is above the dew point ({rosa}°C) — no condensation risk under these conditions.",
  "IP-PONIZEJ-WYMAGANEGO":
    "The IP{ip} enclosure is below the required minimum IP{min} for an environment exposed to moisture.",
  "PUNKT-ROSY-WZOR-MAGNUSA":
    "Dew point calculated with the standard Magnus-Tetens formula (constants for liquid water), not " +
    "given directly in the source — independently verified against the source's example (-5°C/85% → -7°C).",
  "SPRAWNOSC-OGOLNA-POZA-ZAKRESEM": "Efficiency must be within the range 0–100%.",
  "TANSZE-NIZ-ALTERNATYWA":
    "The cost of energy from storage ({koszt} {waluta}/kWh) is lower than the alternative's cost ({alt} {waluta}/kWh) — storage pays off.",
  "DROZSZE-NIZ-ALTERNATYWA":
    "The cost of energy from storage ({koszt} {waluta}/kWh) is higher than the alternative's cost ({alt} {waluta}/kWh) — " +
    "at these parameters, storage doesn't pay for itself.",
  "LICZBA-CYKLI-SPRAWNOSC-OD-UZYTKOWNIKA":
    "Number of cycles and efficiency entered by the user (e.g. from a datasheet or Screen 30) — not recalculated on this screen.",
  "DOCISK-ZA-MALY":
    "Clamping force ({docisk} kgf) is below the recommended range of {min}-{max} kgf — risk of losing " +
    "internal contact and accelerated degradation.",
  "DOCISK-ZA-DUZY":
    "Clamping force ({docisk} kgf) is above the recommended range of {min}-{max} kgf — risk of mechanical damage to the cells.",
  "BRAK-LUZU-NA-PECZNIENIE":
    "Cells grow by 1-2% while charging — without a slack margin, the fixed clamping force will exceed the recommended range.",
  "DOCISK-OK":
    "Clamping force ({docisk} kgf) is within the recommended range of {min}-{max} kgf, with slack left for expansion.",
  "DOCISK-UJEMNY": "Clamping force cannot be negative.",
  "TANSZA-NIZ-NOWA":
    "The cost of 1 usable kWh from this battery ({koszt} {waluta}/kWh) is lower than a new LiFePO4's " +
    "({nowa} {waluta}/kWh) — but the new one has 100% SoH and a longer lifespan.",
  "DROZSZA-NIZ-NOWA":
    "The cost of 1 usable kWh from this battery ({koszt} {waluta}/kWh) is higher than a new LiFePO4's " +
    "({nowa} {waluta}/kWh) — at this purchase price, a new battery pays off better.",
  "SOH-ZEROWY":
    "Estimated SoH dropped to 0% under this degradation model — the battery is practically useless, don't buy it.",
  "SOH-SZACUNEK-Z-WIEKU": "SoH estimated linearly from age, the lower bound of the source's range ({rate}%/year out of a 2-3%/year range).",
  "SOH-SZACUNEK-Z-PRZEBIEGU": "SoH estimated linearly from mileage ({rate}%/10,000 km per the source).",
  "TOLERANCJA-POZA-ZAKRESEM": "Factory tolerance must be within the range 0–100%.",
  "POJEMNOSC-OGRANICZONA-NAJSLABSZYM":
    "It's like pulling the brake on the whole train because one car broke down — the weakest cell " +
    "limits the entire pack by {utrata}%.",
  "NAJGORSZY-PRZYPADEK-TOLERANCJA":
    "Worst case: at least one cell in the factory tolerance band has a capacity right at the lower tolerance limit.",
  "OGNIWO-DO-WYMIANY":
    "Internal resistance rose by {wzrost}% relative to the factory value (critical threshold: {prog}%) " +
    "— this cell has lost a significant portion of its capacity, replace it.",
  "OGNIWO-OK":
    "Internal resistance rose by {wzrost}% relative to the factory value — below the critical threshold ({prog}%).",
  "POJEMNOSC-DZIS-NIEDODATNIA": "The usable capacity needed today must be greater than zero.",
  "DEGRADACJA-POZA-ZAKRESEM": "Annual capacity loss must be within the range 0–100% (>0).",
  "CALKOWITA-DEGRADACJA-W-HORYZONCIE":
    "At {rate}%/year over {lata} years, the simple linear degradation model reaches zero or below — " +
    "the result doesn't make physical sense. Check the entered values.",
  "MODEL-LINIOWY-DEGRADACJI": "Simple linear degradation model (not calendar-cyclic), per the source's Section B.",
  "WYNIK-DOKLADNY-BEZ-ZAOKRAGLENIA":
    "The result is the exact required initial capacity — in practice it's rounded up to the nearest " +
    "available commercial size (the source doesn't provide a size grid).",
  "ROZKLAD-PRADU":
    "The largest branch deviates from an even split by {odchylenie} percentage points. The source " +
    "doesn't give a \"safe\" deviation threshold — if the current distribution looks uneven, consider " +
    "a busbar (star topology) with equal-length cables instead of cascading connections.",
  "MODEL-TOPOLOGIA-GWIAZDA":
    "The model assumes a star topology (each branch as an independent run to a common node) — it does " +
    "NOT model cascading or feed-point asymmetry along a single busbar.",
  "REZYSTANCJA-WZOR-M5E1": "Branch resistance calculated as in M5/Screen 1: R=ρ×2L/A (round-trip path).",
  "COMMON-PORT-NIEWYSTARCZAJACY":
    "The BMS Common Port ({bms} A) is below the inverter's peak inrush current ({falownik} A) — choose a Separate Port version.",
  "COMMON-PORT-WYSTARCZAJACY": "The BMS Common Port ({bms} A) can handle the inverter's peak inrush current ({falownik} A).",
  "SPRAWNOSC-EFEKTYWNA-POZA-ZAKRESEM": "Effective efficiency must be within the range 0–100%.",
  "REZERWA-WIEKSZA-NIZ-POJEMNOSC": "The trip reserve cannot be greater than the entire battery capacity.",
  "TYLKO-V2L":
    "The car/inverter only support V2L (lower power, e.g. up to about 3.6 kW) — you can't power the " +
    "whole house with it, only individual devices.",
  "REZERWA-DEGRADACJA-MODEL-UPROSZCZONY":
    "The source's \"trip reserve, degradation, losses\" are modeled as a reserve (directly subtracted) " +
    "+ one combined effective efficiency factor — the source doesn't break this down into separate formulas.",
  "AIC-PONIZEJ-MAX-PRADU-ZWARCIOWEGO":
    "The breaking capacity of the protection device ({aic} A) is below the calculated maximum short-circuit " +
    "current ({pradZwarciowy} A) — the protection device would itself become a source of an electric arc.",
  "AIC-WYSTARCZAJACE-NA-PRAD-ZWARCIOWY": "Breaking capacity of {aic} A is sufficient for the calculated short-circuit current.",
  "AIC-NIE-SPRAWDZONA-PORUWNAJ": "Breaking capacity (AIC) not checked — enter it to compare against the short-circuit current.",
  "AIC-BEZPIECZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO":
    "The fuse's breaking capacity ({aic} A) is lower than the short-circuit current at this point " +
    "({pradZwarciowy} A) — insufficient breaking capacity, risk of an electric arc instead of a safe blow.",
  "PRAD-ZNAMIONOWY-NIEDODATNI": "The circuit's rated current must be greater than zero.",
  "PRAD-ZWARCIOWY-UJEMNY": "The short-circuit current cannot be negative.",
  "AIC-UJEMNE": "Breaking capacity (AIC) cannot be negative.",
  "SELEKTYWNOSC-NIE-SPRAWDZONA":
    "Selectivity coordination with Screen 13 (Protection selectivity) not checked — that screen " +
    "doesn't exist yet.",
  "AIC-NIE-SPRAWDZONA-WOBEC-ZWARCIA":
    "Breaking capacity (AIC) not checked against the short-circuit current — enter both fields; the " +
    "short-circuit current will eventually come from Screen 12 (Short-circuit analysis).",
  "IZOLACJA-PONIZEJ-TEMPERATURY":
    "{izolacja} insulation withstands up to {max}°C, but the expected temperature is {temp}°C — it will " +
    "crack and let moisture in. Use insulation with higher thermal resistance.",
  "IZOLACJA-WYSTARCZA-NA-TEMPERATURE": "{izolacja} insulation (up to {max}°C) will withstand the expected temperature at this location.",
  "FALOWNIK-MOCY-ZA-SLABY":
    "The selected inverter ({wybrana} W) is weaker than the recommended power ({zalecana} W) — risk of " +
    "frequent shutdowns during motor startups.",
  "FALOWNIK-MOCY-WYSTARCZAJACY":
    "The selected inverter ({wybrana} W) covers the recommended power ({zalecana} W) with margin for startups.",
  "REKOMENDACJA-MOCY-FALOWNIKA":
    "Recommended continuous inverter power: {zalecana} W (with margin for motor startups, 5 s, up to 200% " +
    "overload capacity).",
  "WSPOLCZYNNIK-JEDNOCZESNOSCI-MARGINES":
    "The simultaneity factor here acts as an inverse margin for startups (P_inverter = P_peak / w), not " +
    "as a reduction of the sum of loads.",
  "PRADY-ROZRUCHOWE-NIE-LICZONE-LICZBOWO":
    "Motor startup currents are NOT calculated numerically — the source doesn't give a formula/multiplier, " +
    "only an illustrative example.",
  "WARTOSC-MUSI-BYC-WIEKSZA-OD-ZERA": "The value must be greater than zero.",
  "PRZEKROJ-PONIZEJ-WYLICZONEGO-MINIMUM":
    "The selected cross-section {sprawdzany} mm² is smaller than the calculated minimum ({wymagany} mm²) — " +
    "real risk of insulation overheating and fire. Use at least {wymagany} mm².",
  "PRZEKROJ-MA-BEZPIECZNY-MARGINES":
    "The selected cross-section has a safe margin (≥15%) for both ampacity and voltage drop.",
  "PRZEKROJ-MARGINES-MALY":
    "The selected cross-section meets both criteria, but the margin is small (below 15%) — consider a larger cross-section.",
  "BRAK-PRZEKROJU-SPELNIAJACEGO-KRYTERIA":
    "No standard cross-section up to {maksymalny} mm² meets both criteria for this data — a larger " +
    "cross-section, a different system voltage, or a shorter route is needed. Consult a designer.",
  "TEMPERATURA-OTOCZENIA-POZA-TABELAMI":
    "Ambient temperature {temp}°C is outside the range of the standard's tables for PVC insulation " +
    "(10-60°C) — cannot be safely calculated.",
  "WSPOLCZYNNIK-WIAZKI-POZA-ZAKRESEM":
    "The standard doesn't provide a derating factor for a bundle of this size ({liczba} cables) for the " +
    "selected installation method.",
  "IZOLACJA-ZALOZONA-PVC-DOMYSLNIE":
    "Conductor insulation assumed to be PVC (70°C) — the inputs don't ask for insulation type; PVC has " +
    "lower ampacity than XLPE/EPR, so it's a conservative (safer) default choice.",
  "LICZBA-ZYL-DWIE-TABLICA-B52":
    "Number of loaded conductors in the circuit = 2 (DC circuit or single-phase AC) — Table B.52.2 of " +
    "standard PN-HD 60364-5-52 was used.",
  "REZYSTANCJA-PETLI-WZOR-2L-S":
    "Loop resistance calculated as ρ×2×L/S (current returns via the second conductor) — the same as in " +
    "the already-verified calculator M3/E8 (straty-okablowanie-dc); the simplified formula from this " +
    "screen's source (without ×2) would understate the voltage drop by half.",
  "KOREKTA-ULOZENIA-KOLUMNA-TABELI":
    "The installation-method correction is applied by selecting the correct standard table column " +
    "(reference method C/B2/D), not via a separate k3 multiplier described in the product source — the " +
    "standard doesn't define such a combined factor.",
  "GSW-UZYWANA-JAKO-PRZYLACZE":
    "The Main Equipotential Bonding Bar (GSW) is only for potential equalization, not a current bus — " +
    "don't connect loads to it.",
  "KOROZJA-GALWANICZNA-CU-AL":
    "A direct copper-aluminum connection without a barrier corrodes and heats up — use a bimetallic " +
    "connector and anti-corrosion paste.",
  "PARA-METALI-OK": "{etykieta} — connection safe under these conditions.",
  "WYMAGA-PODKLADKI-I-SMARU":
    "Galvanized steel + copper without a washer and grease — add both to limit corrosion.",
  "KONTROLUJ-OKRESOWO":
    "Stainless steel + aluminum in a salty environment — inspect the connection periodically for corrosion.",
  "PARA-POZA-ZAKRESEM":
    'The source doesn\'t evaluate the pair "{etykieta}" in this environment — check compatibility with ' +
    "the connector manufacturer, we don't guess.",
  "BRAK-OCHRONY":
    "No protection against reverse polarity on a circuit where plus and minus are easy to mix up.",
  "OCHRONA-ZASTOSOWANA": "Reverse-polarity protection applied.",
  "REKOMENDACJA-TYPU-OCHRONY-NIE-PODANA":
    "A recommendation for the protection type per location (battery/panels/inverter) is NOT given in " +
    "the source — the circuit location here is informational only; the user decides on the type.",
  "BRAK-TYPU-1-PRZY-ODGROMOWEJ":
    "The building has a lightning protection system — a Type 1 SPD (10/350 µs surge current) is " +
    "mandatory at the building entry, not just Type 2.",
  "ZA-BLISKO-ZWODU":
    "Panels {odleglosc} m from the lightning air terminal (below {min} m) — risk of spark gap flashover. " +
    "Increase the clearance to at least 1 m or apply insulating separation.",
  "UC-PONIZEJ-MINIMUM":
    "The SPD's continuous operating voltage ({uc} V) is below the required minimum ({ucMin} V = Voc × " +
    "1.25) — the SPD may be damaged during normal operation.",
  "SPD-UZIEMIONY-OSOBNO":
    "The SPD must be grounded through the shared Main Equipotential Bonding Bar (GSW), never separately.",
  "SPD-DOBRANY-POPRAWNIE": "SPD {typ}, Uc sufficient, grounded through GSW — all conditions met.",
  "VOC-STRINGU-WARTOSC-ZIMOWA":
    "The string's Voc should be the winter value (Screen 5, Module 3 — Winter MPPT Stress Test), not " +
    "STC conditions — otherwise a surge arrester sized for summer won't cope in winter.",
  "TRASA-NIE-SPELNIA-WYMAGAN-PRZEKROJU": "Route {oznaczenie} doesn't meet cross-section requirements — see details below.",
  "POROWNANIE-KOSZTOW-TRAS":
    "After {lata} years, route {tansza} is cheaper by {roznica} {waluta} (purchase cost + energy losses combined).",
  "WYNIK-ZALEZY-OD-ECHA-TRASY":
    "The result depends on the calculateDoborPrzekrojuKabla echo for both routes — one of the routes " +
    "returned a status that prevents further calculation (see warnings).",
  "STRATY-ROCZNE-LICZONE-PRZEZ-ECHO":
    "Annual losses are calculated via the calculateDoborPrzekrojuKabla echo (M5/Screen 1, 'check my " +
    "cross-section' mode) — normative (PN-HD 60364-5-52), not reinvented.",
  "KOSZT-ZAKUPU-JEDNA-SUMA-NA-TRASE":
    "Purchase cost (cable + protection + labor) is entered as a single sum per route, as in the " +
    "source's example.",
  "TCO-NIE-POKAZANE-NIESPELNIONE-WYMAGANIA":
    "Cost comparison (TCO) NOT shown — at least one route doesn't meet the cross-section requirements " +
    "(the echo returns a 0 loss for a non-compliant cross-section, which would falsely understate its " +
    "cost). Fix the cross-section of the route flagged as not meeting requirements.",
  "CIAGLOSC-NIEPOTWIERDZONA":
    "Continuity of protective conductors not confirmed — all must be connected to the GSW.",
  "REZYSTANCJA-IZOLACJI-ZA-NISKA":
    "Insulation resistance {wartosc} MΩ is below the required minimum {min} MΩ.",
  "REZYSTANCJA-UZIEMIENIA-NIEZMIERZONA": "Ground resistance not yet measured.",
  "REZYSTANCJA-UZIEMIENIA-ZA-WYSOKA": "Ground resistance {wartosc} Ω exceeds the required threshold {prog} Ω.",
  "CZAS-RCD-NIEZMIERZONY": "RCD trip time not yet measured.",
  "CZAS-RCD-ZA-DLUGI": "The RCD tripped after {czas} s — required below {max} s.",
  "TEST-ZWARCIOWY-NIEPOTWIERDZONY":
    "Loop short-circuit test not confirmed — the protection must trip under a simulated short circuit.",
  "TERMOWIZJA-NIEPOTWIERDZONA":
    "Thermal imaging of connections not confirmed — check for the absence of hot spots under load.",
  "WSZYSTKO-OK": "All post-installation measurements and tests are within norm — formal commissioning is possible.",
  "BRAK-SKRZYNKI-IP66": "Connecting strings directly outdoors without an IP66 box is prohibited.",
  "ZA-MALO-WEJSC-SKRZYNKI":
    "The box has {wejscia} inputs, and there are {stringi} strings — choose a box with a matching number of inputs.",
  "BEZPIECZNIK-STRINGOWY-POZA-ZAKRESEM":
    "The string fuse ({bezpiecznik} A) is outside the recommended range of {min}-{max} A/string.",
  "LICZBA-STRINGOW-UJEMNA": "The number of strings cannot be negative.",
  "LICZBA-WEJSC-UJEMNA": "The number of box inputs cannot be negative.",
  "BEZPIECZNIK-STRINGOWY-UJEMNY": "The string fuse current cannot be negative.",
  "SPD-ROZLACZNIK-NIE-SPRAWDZONE":
    "Type 2 SPD (cross-ref Screen 2) and the DC isolating switch aren't checked — no parameters given in the source.",
  "LICZBA-WEJSC-NIEPODANA-POMINIETO": "Number of box inputs not given — check skipped.",
  "BEZPIECZNIK-STRINGOWY-NIEWYBRANY-POMINIETO":
    "String fuse not selected — range check skipped.",
  "BIEGUN-UZIEMIONY-WBREW-IT":
    "The inverter requires an isolated (IT) system, and the DC pole is grounded — risk of MPPT damage.",
  "WYMAGANY-MONITOR-IZOLACJI":
    "The inverter operates in an IT system — use an insulation monitoring device (IMD), see Screen 18.",
  "OBUDOWA-NIEPOLACZONA-Z-GSW":
    "The inverter enclosure grounding is not connected to the Main Equipotential Bonding Bar (GSW).",
  "UZIEMIENIE-OK": "Functional and protective grounding comply with the inverter manufacturer's requirements.",
  "UKLAD-SIECI-INFORMACYJNY":
    "The network system (TN-S/TN-C-S/TT/IT) is informational here — the source doesn't tie it directly " +
    "to this screen's verdict, only to the installation's general context.",
  "WYLACZNIK-NIECERTYFIKOWANY-DO-DC":
    "An AC breaker used in a DC circuit won't extinguish the DC arc — fire risk.",
  "AIC-WYLACZNIKA-PONIZEJ-PRADU-ZWARCIOWEGO":
    "The breaker's interrupting capacity ({aic} A) is lower than the short-circuit current at this point ({pradZwarciowy} A).",
  "WYLACZNIK-DC-DOBRANY-POPRAWNIE": "The breaker is DC-certified, interrupting capacity is sufficient.",
  "AIC-WYLACZANIA-NIE-SPRAWDZONA-WOBEC-ZWARCIA":
    "Interrupting capacity (AIC) not checked against the short-circuit current — enter both fields, " +
    "ideally the short-circuit current from Screen 12 (Short-Circuit Analysis).",
  "WYMAGANY-TYP-B":
    "A hybrid inverter requires a Type B RCD — the installed type {typ} won't detect a DC fault current " +
    "(real risk of electric shock).",
  "WYMAGANY-TYP-A-MINIMUM":
    "Loads with motors require at least a Type A RCD — the installed AC type isn't sufficient.",
  "PROG-POWYZEJ-OCHRONY-OSOB": "The residual current threshold {prog} mA is too high for personal protection — 30 mA required.",
  "PROG-POWYZEJ-OCHRONY-POZAROWEJ":
    "The residual current threshold {prog} mA is too high for fire protection — 300 mA required.",
  "RCD-DOBRANY-POPRAWNIE": "The RCD type and residual current threshold meet all checked requirements.",
  "TYP-RCD-MINIMALNY-NIE-PODANY":
    "Without a hybrid inverter and without motors in the circuit, the source doesn't give a minimum " +
    "RCD type — not guessed.",
  "OKNO-MPPT-ODWROCONE": "The lower bound of the MPPT window cannot be greater than the upper bound.",
  "NAPIECIE-ZIMOWE-ZA-WYSOKIE":
    "The string voltage under the coldest conditions ({vStringCold} V) exceeds the inverter's " +
    "maximum allowed DC voltage ({vMax} V) — a real risk of permanent inverter damage on a frosty, " +
    "sunny morning. Reduce the number of panels in the string.",
  "NAPIECIE-ZIMOWE-OK":
    "The string voltage under the coldest conditions ({vStringCold} V) is within the inverter's " +
    "limit ({vMax} V).",
  "PONIZEJ-OKNA-MPPT":
    "The string's operating voltage ({vStringStc} V) is below the lower bound of the inverter's " +
    "MPPT window ({mpptMin} V) — the inverter may fail to find the maximum power point or not " +
    "start at all. Add panels to the string.",
  "POWYZEJ-OKNA-MPPT":
    "The string's operating voltage ({vStringStc} V) exceeds the upper bound of the inverter's " +
    "MPPT window ({mpptMax} V) — the inverter may clip the available power. Remove a panel from " +
    "the string or split it into two shorter strings.",
  "W-OKNIE-MPPT":
    "The string's operating voltage ({vStringStc} V) is within the inverter's MPPT window " +
    "({mpptMin}-{mpptMax} V).",
  "PRAD-PRZEKROCZONY":
    "The string's operating current ({iString} A) exceeds the inverter's maximum MPPT input " +
    "current ({iMax} A) — risk of MPPT input damage. Split the panels across separate MPPTs or " +
    "choose a panel with a lower Imp.",
  "PRAD-OK": "The string's operating current ({iString} A) is within the inverter's MPPT limit ({iMax} A).",
  "DC-AC-ZA-MALE":
    "The PV-to-AC power ratio ({ratio}) is below the recommended range ({min}-1.3 for off-grid) — " +
    "the inverter won't reach its potential, especially in weaker light.",
  "DC-AC-ZA-DUZE":
    "The PV-to-AC power ratio ({ratio}) exceeds the recommended range (1.1-{max} for off-grid) — " +
    "risk of power clipping on sunny days, overheating, and shortened inverter lifespan.",
  "DC-AC-OK": "The PV-to-AC power ratio ({ratio}) is within the recommended range of 1.1-1.3 for off-grid.",
  "ZAKLADA-JEDEN-STRING": "Assumes ONE string (no parallel strings) — per the source's Section A parameters.",
  "MOC-PV-WZOR-VMP-IMP":
    "PV power (for the DC/AC ratio) is calculated as Vmp × Imp × number of panels (P=V×I under " +
    "STC), not entered separately.",
  "KRYTERIUM-4-NIE-SPRAWDZANE":
    "Source criterion 4 (inverter start-up voltage in hot weather) is NOT checked here — it " +
    "requires a Vmp temperature coefficient the source doesn't give as a formula on this screen " +
    "(see the comment in the calculator's code).",
  "VMPV-NIEDODATNI": 'The value of "panel Vmp voltage" must be greater than zero.',
  "IMPA-NIEDODATNI": 'The value of "panel Imp current" must be greater than zero.',
  "PANELWGRUPIE-NIEDODATNI": 'The value of "number of panels per group" must be greater than zero.',
  "LICZBAGRUP-NIEDODATNI": 'The value of "number of parallel groups" must be greater than zero.',
  "LICZBAPANELI-NIEDODATNI": 'The value of "number of panels" must be greater than zero.',
  "PANELWGRUPIE-NIE-CALKOWITA":
    'The value of "number of panels per group" must be a whole number — you can\'t connect a fraction of a panel.',
  "LICZBAGRUP-NIE-CALKOWITA":
    'The value of "number of parallel groups" must be a whole number — you can\'t connect a fraction of a panel.',
  "LICZBAPANELI-NIE-CALKOWITA":
    'The value of "number of panels" must be a whole number — you can\'t connect a fraction of a panel.',
  "LICZBA-PANELI-NIETYPOWO-WYSOKA":
    "This is an unusually high number of panels in a single string — check that it's intentional.",
  "WYNIK-DLA-WARUNKOW-STC":
    "Result calculated under STC conditions (25°C) — no temperature correction for cold weather " +
    "(see Module 3, Screen 5: winter MPPT voltage stress test).",
  "RAZEM-PANELI-MIESZANY": "Total {razem} panels ({wGrupie} per group × {grup} groups).",
  "SILA-NAPORU":
    "A panel acts a bit like a sail — at this wind speed, a force of about {sila} N acts on one " +
    "panel. Plan the mounting/ballast to match this force.",
  "TYLKO-SILA-NAPORU-NIE-SSANIE": "Frontal wind-thrust force and ballast against uplift — suction from below as a separate value and the overturning moment are NOT calculated (they require mounting geometry the source doesn't give as numbers).",
  "DUZA-ROZNICA-MOCY":
    "The power difference between panels ({roznica}%) exceeds 15% — split them across separate " +
    "MPPTs or connect them in parallel if their Vmp is close.",
  "UMIARKOWANA-ROZNICA-MOCY":
    "The power difference between panels ({roznica}%) is noticeable (10-15%) — consider separate MPPTs.",
  "MALA-ROZNICA-MOCY":
    "The power difference between panels ({roznica}%) is small (below 10%) — safe in a single string.",
  "NAPIECIE-WSPOLNE-RECZNIE":
    "The shared operating voltage (Vmp) is entered manually for both panels — the source uses a " +
    "single, averaged value in its example rather than deriving it from each panel's power/current.",
  "OCHRONA-OBOWIAZKOWA-BRAK":
    "Standard HD 60364-7-712 requires overcurrent protection for each of the {ns} parallel strings " +
    "— its absence risks fire from reverse current from the other strings when one short-circuits.",
  "ZAKRES-BEZPIECZNIKA-NIEPOPRAWNY":
    "No fuse satisfies the standard's requirements for this configuration (the lower bound {inMin} " +
    "A exceeds the upper bound {inMax} A from the panel's datasheet) — reduce the number of " +
    "parallel strings per protection device or choose a panel with a higher I_MOD_MAX_OCPR.",
  "WYBRANY-BEZPIECZNIK-POZA-ZAKRESEM":
    "The selected fuse {wybrany} A is outside the required range [{inMin}, {inMax}] A.",
  "ALTERNATYWA-KABLOWA-NIESPRAWDZONA":
    "Overcurrent protection isn't required here by the standard's formula, but with {ns} parallel " +
    "strings the string cable must withstand a reverse current of {wymaganeIz} A — check this " +
    "separately in the cable cross-section module.",
  "BEZPIECZNIK-DOBRANY": "Choose a gPV fuse in the range {inMin}–{inMax} A per string.",
  "K1-MINIMUM-NORMOWE":
    "K1=1.25 (the standard's minimum, Annex B.2) — under increased reflection/irradiance the " +
    "standard allows a higher K1 but doesn't give a specific value; not guessed.",
  "TRAWA-NISKI-ZYSK":
    "Without a light-colored surface, the bifacial gain is small — don't overpay for this " +
    "technology if you're mounting on grass.",
  "DOBRA-POWIERZCHNIA": "Additional annual yield from the rear side: {dodatkowyUzysk} kWh.",
  "PROCENT-UZYSKU-RECZNIE":
    "The additional yield percentage is entered manually within the source's range for the " +
    "selected surface — not calculated from the panel's bifaciality coefficient (the source gives " +
    "no linking formula).",
  "STRATA-PONIZEJ-CELU": "The {strata}% loss is within the source's target (below {cel}%).",
  "STRATA-POWYZEJ-CELU":
    "The {strata}% loss exceeds the source's target (below {cel}%) — consider a thicker cable cross-section.",
  "REZYSTANCJA-PETLI-DWA-PRZEWODY":
    "Loop resistance is calculated for two conductors (plus and minus) — 2×cable length, standard DC practice.",
  "DOBRY-STYK":
    "The connector's resistance ({rezystancja} mΩ) is within the good-condition range (0.5-2 mΩ) " +
    "— total loss {strata} W.",
  "PODWYZSZONA-REZYSTANCJA":
    "The connector's resistance ({rezystancja} mΩ) exceeds the good-condition range (0.5-2 mΩ) — " +
    "total loss {strata} W. Check the connector for looseness/corrosion.",
  "ZLY-STYK":
    "The connector's resistance ({rezystancja} mΩ) corresponds to a loose/corroded connector (up " +
    "to 10× more than good condition) — total loss {strata} W and a real risk of overheating/fire. " +
    "Replace or clean the connector immediately.",
  "REZYSTANCJA-ZLACZKI-RECZNIE":
    "The connector's resistance is entered manually — the source gives a range (0.5-2 mΩ good " +
    "condition, up to 10× more when loose/corroded), not a single value.",
  "PRAD-SZEREGOWY-PRZEZ-WSZYSTKIE-ZLACZKI":
    "Assumes the same current flows in series through all connectors (the typical string case) — " +
    "the losses add up.",
  "PRZEKROCZONY-LIMIT-MPPT":
    "The string voltage in frost ({vString} V) exceeds the inverter's MPPT limit ({limit} V) — a " +
    "real risk of permanent DC input damage. Change the string configuration.",
  "BLISKO-LIMITU-MPPT":
    "The string voltage in frost ({vString} V) exceeds 95% of the MPPT limit ({prog} V of {limit} " +
    "V) — a small safety margin.",
  "BEZPIECZNY-MARGINES-MPPT":
    "The string voltage in frost ({vString} V) stays safely below the MPPT limit ({limit} V).",
  "UTRATA-MOCY":
    "At {temperatura}°C, the panel loses about {strata}% of its power relative to the datasheet " +
    "value (measured at 25°C).",
  "PRZYROST-TEMP-I-GAMMA-RECZNIE":
    "The panel's temperature rise above ambient and the γ coefficient are entered manually — the " +
    "source only gives typical ranges (25-30°C, -0.3 to -0.45%/°C), not single values.",
  "LICZBA-SEKCJI-POZA-ZAKRESEM": "The number of shaded sections must be a whole number from 0 to 3.",
  "BRAK-ZACIENIENIA": "The panel is not shaded — no power loss from this cause.",
  "ZACIENIENIE-1-SEKCJA":
    "Shading of 1 section reduces this panel's power by about {strata}%. In a series-connected " +
    "string, the loss for the whole string can be much greater than the panel's own loss " +
    "(depending on configuration) — for regular/partial shading, consider microinverters or power " +
    "optimizers (Screen 18).",
  "ZACIENIENIE-2-SEKCJE":
    "Shading of 2 sections reduces this panel's power by about {strata}%. This is a serious loss " +
    "— one shaded panel can bring down the output of the entire series string, not just itself. " +
    "Consider microinverters or power optimizers (Screen 18).",
  "ZACIENIENIE-PELNY-PANEL":
    "The panel is shaded in all 3 sections — the bypass diodes skip it almost entirely (loss " +
    "about {strata}%). It contributes almost no power to the string; consider microinverters or " +
    "power optimizers (Screen 18).",
  "STRATA-PANELU-3-SEKCJE-FAKT":
    "The panel loss is calculated from a construction fact: a standard PV panel has 3 cell " +
    "sections, each with its own bypass diode — shading a section reduces the panel's voltage by " +
    "1/3 at a similar current.",
  "STRATA-STRINGU-NIE-LICZONA":
    "The loss for the ENTIRE STRING ({liczbaPaneli} panels in series) is NOT calculated " +
    "numerically here — the source describes it as depending on the configuration (MPPT topology, " +
    "wiring), without a given formula. Source example: shading 1 panel in a 6-panel string → " +
    "string loss of about 55%, but this depends on the configuration and isn't a fixed value to " +
    "calculate here.",
  "DEFICYTKWH-NIEDODATNI": 'The value of "energy deficit" must be greater than zero.',
  "MOCAGREGATUKW-NIEDODATNI": 'The value of "generator power" must be greater than zero.',
  "SREDNIZUZYCIELH-NIEDODATNI": 'The value of "average fuel consumption" must be greater than zero.',
  "CENAZALITRZL-NIEDODATNI": 'The value of "fuel price" must be greater than zero.',
  "BRAK-WYJSCIA-STERUJACEGO":
    "The generator must be started manually or via autostart — make sure the BMS has a control output.",
  "MA-WYJSCIE-STERUJACE": "The BMS has a control output — the generator can start automatically.",
  "OPTYMALNE-OBCIAZENIE-AGREGATU":
    "Optimal generator load assumed at {procent}% of rated power — the upper bound of the " +
    "source's 70-80% range.",
  "WOLUMEN-UJEMNY": "Daily domestic hot water demand cannot be negative.",
  "DELTA-T-UJEMNA": "The water temperature rise cannot be negative.",
  "MOC-GRZALKI-UJEMNA": "The heater power cannot be negative.",
  "POJEMNOSC-BOJLERA-UJEMNA": "The boiler capacity cannot be negative.",
  "BOJLER-ZA-MALY":
    "The boiler capacity ({pojemnosc} l) is smaller than the daily demand ({wolumen} l) — one " +
    "charge per day may not be enough.",
  "DELTA-T-RECZNIE":
    "ΔT entered manually by the user — the source gives no default value for the water " +
    "temperature rise.",
  "ZAPOTRZEBOWANIE-CALKOWITE-NIEDODATNIE":
    'The value of "total daily demand" must be greater than zero.',
  "BUFOR-BRAK": "No buffer — the system is sized exactly for today's needs, with no margin for the future.",
  "BUFOR-DOLICZONY":
    "The {procent}% buffer adds {dodatek} kWh/day of margin for future expansion (new devices, a growing family).",
  "ODBIORNIK-ODLACZONY": "A priority {priorytet} load would now be disconnected by the load shedding system.",
  "ODBIORNIK-AKTYWNY-PRIORYTET-1": "Priority 1 (critical) — never disconnected by the load shedding system.",
  "ODBIORNIK-AKTYWNY": "A priority {priorytet} load stays active at this SoC.",
  "POBOR-JALOWY-UJEMNY": "The idle draw cannot be negative.",
  "STALY-KOSZT-BILANSU":
    "The inverter itself consumes something just to be ready to work — {strata} kWh/day is added " +
    "to the balance at priority 1, before you turn anything on.",
  "SZEROKOSC-POZA-ZAKRESEM": "Latitude must be within the range -90–90°.",
  "DZIEN-ROKU-POZA-ZAKRESEM": "The day of the year must be within the range 1–365.",
  "MOC-ODBIORNIKA-UJEMNA": "The load's power cannot be negative.",
  "NOC-POLARNA": "At this latitude on this day, the sun doesn't rise at all (polar night).",
  "DZIEN-POLARNY": "At this latitude on this day, the sun doesn't set (polar day).",
  "ENERGIA-NOCNA":
    "A {moc} W load running all night ({dlugoscNocy} h) uses {energia} kWh that day.",
  "DEKLINACJA-METODA-COOPERA":
    "Cooper's (1969) approximation of the sun's declination — a standard solar engineering " +
    "formula, accuracy ±1° of declination.",
  "ZAPOTRZEBOWANIEURZADZENIAW-NIEDODATNI": 'The value of "device demand" must be greater than zero.',
  "SPRAWNOSC-PRZETWORNICY-POZA-ZAKRESEM": "The converter's efficiency must be within the range 0–100%.",
  "STRATA-NA-KONWERSJI":
    "Every voltage change costs some energy — the converter loses {strata}% ({strataW} W) on the conversion alone.",
  "ZASILANIE-BEZPOSREDNIE": "The device is powered directly from the bus — no voltage-conversion losses.",
  "ZAPOTRZEBOWANIE-URZADZENIA-UJEMNE": "The device's demand cannot be negative.",
  "MIESIAC-POZA-ZAKRESEM": "The month must be within the range 1–12.",
  "URZADZENIE-AKTYWNE": "The device is active in this period — {zapotrzebowanie} kWh/day counts toward the balance.",
  "URZADZENIE-NIEAKTYWNE": "The device is outside its active period — it doesn't count toward the daily balance.",
  "POBORCIAGLEW-UJEMNY": "The continuous-operation draw cannot be negative.",
  "POBORUSPIENIEW-UJEMNY": "The sleep-mode draw cannot be negative.",
  "BUFOR-ZA-MALY":
    "The buffer you have ({pojemnosc} l) is smaller than the recommended capacity ({zalecana} l) — an " +
    "undersized buffer means frequent pump cycling and higher power consumption.",
  "BUFOR-WYSTARCZAJACY": "The buffer you have ({pojemnosc} l) meets the recommended capacity ({zalecana} l).",
  "WYMIANY-POZA-SANITY-CHECK":
    "That's an unusually high number of air changes per hour (>{max}) — check the airtightness test data.",
  "STRATA-INFILTRACJI": "Heat loss through infiltration: {strata} kW.",
  "OSZCZEDNOSC-KOCIOL-VS-POMPA":
    "The heat pump is cheaper by {oszczednosc} {waluta} — the electric boiler will use {mnoznik}× more power " +
    "for the same heat.",
  "OSZCZEDNOSC-POMPA-CYRKULACYJNA":
    "Switching to an electronic pump will save {oszczednoscKwh} kWh/day ({oszczednoscPct}%).",
  "NOWA-POMPA-NIE-OSZCZEDZA":
    "The new pump's power isn't lower than the current one — check the data, since this swap won't " +
    "save anything.",
  "GODZINY-POZA-ZAKRESEM": "A day has at most 24 hours.",
  "NAPIECIE-POZA-SANITY-CHECK":
    "That's an unusually high voltage value (>{max}V) — check whether you mixed up the units.",
  "POMPA-SIE-WYLACZY":
    "The system's current voltage ({aktualne} V) is below the pump's minimum operating voltage ({min} V) " +
    "— the pump will shut off. Low voltage is a silent pump killer: it won't fail outright, it'll just " +
    "stop working exactly when it's needed most.",
  "MARGINES-BEZPIECZNY": "Margin to the pump shutoff threshold: {margines} V.",
  "SPRAWNOSC-REKUPERATORA-POZA-ZAKRESEM": "The heat recovery unit's efficiency must be within the range 0–100%.",
  "ODZYSK-INFO":
    "Heat recovered: {odzysk} kW. The fans' constant draw of {pobor} W counts toward the electrical " +
    "balance.",
  "STALE-FIZYCZNE-POWIETRZA-INFILTRACJA":
    "Air density and specific heat as physical constants (1.2 kg/m³, 1005 J/(kg·K)) — not source-specific " +
    "data.",
  "KOCIOL-SPRAWNOSC-COP1": "Electric boiler: 99% efficiency, rounded to COP=1 (1:1 from the source).",
  "TA-SAMA-CENA-ENERGII-OBA-ZRODLA":
    "Assumes the same electricity price for both heat sources (off-grid, the same PV/storage " +
    "installation).",
  "GODZINY-PRACY-WPISANE-RECZNIE":
    "Daily operating hours entered manually — the source describes a continuous/controlled profile " +
    "without a formula for a specific number of hours in controlled mode.",
  "NAPIECIE-SYSTEMU-RECZNIE":
    "Current system voltage entered manually — eventually automatic from Module 4 (live), once Live " +
    "mode has live data to show.",
  "STALE-FIZYCZNE-POWIETRZA-WENTYLACJA": "Air density and specific heat as physical constants (1.2 kg/m³, 1005 J/(kg·K)).",
  "POBOR-WENTYLATOROW-OSOBNO-BILANS":
    "The fans' constant draw is reported separately (electrical balance) — not subtracted from the " +
    "recovered heat (a different domain: electrical vs. thermal).",
  "PROJEKT-STRUMIENI-BYPASS-NIE-LICZONE":
    "Per-room airflow design and the summer bypass logic (formerly 5.23, 5.24) are NOT calculated here " +
    "— they require data/rules absent from the source as a formula.",
  "BRAK-BALANSERA-ZEWNETRZNEGO":
    "{ilosc} lead-acid batteries in series without an external balancer — they will drift apart in " +
    "voltage over time (unlike LiFePO4 with an active BMS). A balancer wired in parallel to each " +
    "battery is required.",
  "ILOSC-AKUMULATOROW-NIEDODATNIA": "The number of batteries in series must be greater than zero.",
  "NAPIECIE-PAKIETU-NIEDODATNIE": 'The "pack voltage" field must be greater than zero.',
  "PAKIET-WCIAZ-NALADOWANY":
    "The cell voltage ({napiecie} V) exceeds the recommended {max} V before disassembly — don't " +
    "disconnect cells while fully charged, risk of arcing and terminal damage.",
  "KROK-POZA-KOLEJNOSCIA":
    "A step was checked out of order — confirm the earlier steps first, order matters.",
  "STAN-PELNY": "Electrolyte density {gestosc} g/cm³ — battery full (≥{pelny} g/cm³).",
  "STAN-CZESCIOWO-NALADOWANY":
    "Electrolyte density {gestosc} g/cm³ — battery partially charged (about half, reference {polowa} " +
    "g/cm³). Recharging recommended.",
  "STAN-ROZLADOWANY":
    "Electrolyte density {gestosc} g/cm³ — battery discharged. Recharging required before further use.",
  "GESTOSC-NIEDODATNIA": "Electrolyte density must be greater than zero.",
  "DOCISK-NIEDODATNI": "Clamping pressure must be greater than zero.",
  "OBJAWY-ZASIARCZENIA-JEDEN": "1 symptom of sulfation observed — see Screen B11 \"Rescuing a Sulfated Battery\".",
  "OBJAWY-ZASIARCZENIA-WIELE":
    "{liczba} symptoms of sulfation observed — see Screen B11 \"Rescuing a Sulfated Battery\".",
  "NAPIECIE-OGNIWA-UJEMNE": "The cell voltage cannot be negative.",
  "TOP-BALANCING-NIEOSIAGNIETY":
    "The highest cell's voltage ({napiecie} V) hasn't reached the Top Balancing threshold ({prog} V) " +
    "yet — keep charging at a low current.",
  "POJEMNOSCFALOWNIKAUF-NIEDODATNI": 'The "inverter DC capacitance" field must be greater than zero.',
  "REZYSTANCJAPRECHARGEOHM-NIEDODATNI": 'The "pre-charge resistance" field must be greater than zero.',
  "OGNIWO-ZERO-WOLTOWE":
    "The cell is at 0 V. The separator likely failed. Attempting to charge risks fire. Disposal is " +
    "recommended, not rescue.",
  "RATUNEK-OPCJONALNY-NIEZALECANY":
    "The cell voltage ({napiecie} V) is low but nonzero — rescue is optional and not recommended. If " +
    "you decide to: {zasilacz} V power supply, {prad} A current limit, watch the temperature the whole " +
    "time it's charging.",
  "PROCEDURA-STANDARDOWEGO-RATUNKU":
    "The cell voltage ({napiecie} V) allows slow charging at 0.05C under close observation.",
  "NAPIECIE-OGNIWA-POLE-UJEMNE": 'The "cell voltage" field cannot be negative.',
  "NIEPARZYSTA-LICZBA-OGNIW":
    "{liczba} cells can't be arranged into two equal rows — the layout described in the source needs an " +
    "even number of cells.",
  "ZA-MALO-OGNIW": "Minimum {min} cells — below that a two-row layout doesn't make sense.",
  "ZA-DUZO-OGNIW":
    "Above {max} cells the source no longer describes this layout — check your BMS/enclosure specifics " +
    "manually.",
  "SEKWENCJA-UKLAD-PRESET": "A 2-row layout of {n} cells each (serpentine) — 1:1 from the source for this cell count.",
  "SEKWENCJA-UKLAD-NIESTANDARDOWY":
    "A 2-row layout of {n} cells each (serpentine) — the source only describes 4S/8S/16S directly; for " +
    "{liczba}S the same geometric pattern is applied logically (not 1:1 from the source).",
  "NAPIECIE-OGNIWA-NIEDODATNIE": "Cell #{numer}'s voltage must be greater than zero.",
  "BRAK-BMS-Z-BALANSEREM": "You don't have a BMS with a balancer — without one, assembly is unsafe.",
  "ROZNICA-NAPIEC-OGNIW-ZA-DUZA":
    "The voltage difference between cells ({roznica} V) exceeds {prog} V — needs pre-balancing before " +
    "assembling into a pack.",
  "LICZBA-OGNIW-NIEZGODNA":
    "For a {system} V system the expected number of cells in series is {oczekiwana}S — {podana} entered.",
  "WIDOCZNE-WYBRZUSZENIE":
    "Visible case swelling — the cell should be retired from service, not reassembled.",
  "ZA-MALA-ODLEGLOSC":
    "The distance from combustible materials ({odleglosc} cm) is below the minimum {min} cm — a real " +
    "fire risk.",
  "ODLEGLOSC-OK": "The distance from combustible materials ({odleglosc} cm) meets the minimum {min} cm.",
  "BRAK-NAWIEWU":
    "No dedicated combustion air intake — risk of room oxygen depletion and flue gas backdraft.",
  "NAWIEW-OBECNY": "A dedicated combustion air intake is provided.",
  "BRAK-CZUJNIKA-CO":
    "No carbon monoxide (CO) detector in a room with an open combustion source — this is a life " +
    "hazard, not just a property one. CO is odorless and kills in your sleep.",
  "CZUJNIK-CO-OBECNY": "A carbon monoxide (CO) detector is installed in the room.",
  "BRAK-ZAZNACZONYCH-URZADZEN": "No critical backup device is selected.",
  "CZAS-PODTRZYMANIA": "Backup time: {czas} h.",
  "POJEMNOSCAH-NIEDODATNI": 'The "battery capacity" field must be greater than zero.',
  "NAPIECIEV-NIEDODATNI": 'The "voltage" field must be greater than zero.',
  "MOCODBIORNIKAW-NIEDODATNI": 'The "load power" field must be greater than zero.',
  "TRYB-UPROSZCZONY-CZAS-TEORETYCZNY":
    "Doesn't account for system efficiency or depth of discharge (DoD) — a theoretical runtime.",
  "MOC-UJEMNA": "Peak load cannot be negative.",
  "REKOMENDACJA-NAPIECIA":
    "Higher system voltage = lower current at the same power = thinner, cheaper cables. " +
    "Recommended: {napiecie}V.",
  "KONFLIKT-JEDNOCZESNOSCI":
    "The selected loads running together draw {suma} W — that exceeds the planned continuous " +
    "inverter power ({limit} W).",
  "KONFLIKT-JEDNOCZESNOSCI-Z-PROPOZYCJA":
    "The selected loads running together draw {suma} W — that exceeds the planned continuous " +
    "inverter power ({limit} W). Don't run these together: {urzadzenia}.",
  "OGRZEWANIE-WYMAGA-48V":
    "The selected electric heating ({moc} W) usually requires a 48V system — the current " +
    "recommendation is {napiecie}V, check whether that's really enough for sustained heating.",
  "PRAD-WYSOKI-PRZY-12V":
    "At 12V this system would draw {prad} A — that's welder-grade current. Any loose connection at " +
    "that current is a potential hotspot and fire risk. 12V systems above 100A aren't recommended.",
  "PULAPKA-KONWERSJI-24-DO-48":
    "Don't wire two ready-made 24V packs in series to get 48V — the BMSes don't talk to each other, " +
    "the cells will drift apart. Build a 48V pack from scratch (16 cells, one 16S BMS) — estimated " +
    "conversion cost below.",
  "NAPIECIE-SYSTEMOWE-PASMO-24V-DOPOWIEDZIANE":
    "The 1000-3000W band → 24V is inferred logically from the 12/24/48V structure (the source only " +
    "states the <1000W and >3000W thresholds directly).",
  "NAPIECIE-SYSTEMOWE-MOC-SZCZYTOWA-DEFINICJA":
    "Peak power = sum of selected loads (Stage B) + heating power (Stage A), unless the manual 'Peak " +
    "load' field is filled in — then it overrides the wizard's sum.",
  "NAPIECIE-SYSTEMOWE-KONFLIKT-JEDNOCZESNOSCI-WARUNEK":
    "Stage B.2 (simultaneity conflict) is only checked when a planned continuous inverter power was " +
    "given — without it there's nothing to compare the 'worst case' sum against.",
  "NAPIECIE-SYSTEMOWE-KABEL-ECHO":
    "Stage C: cross-section/voltage drop/annual losses are calculated via the M5/Screen1 echo " +
    "(PN-HD 60364-5-52 standard), not the source material's simplified P=I²R formula.",
  "NAPIECIE-SYSTEMOWE-KOSZTORYS-METODA":
    "Stage E: cost estimates for the SAME target energy capacity across all three voltages (a fair " +
    "comparison per the source, not a naive comparison with the same cell count). BMS cost counted " +
    "as one unit regardless of the number of parallel strings — per the source's literal tables.",
  "RYZYKO-PID": "DC system voltage ({napiecie} V) exceeds the {prog} V threshold under high humidity — PID risk.",
  "BRAK-RYZYKA-PID": "DC system voltage ({napiecie} V) — no PID risk under current conditions.",
  "NIEZGODNOSC-NAPIEC-PWM":
    "{panel} V panel to a {akumulator} V battery — PWM cannot step the panel voltage down, MPPT required.",
  "MPPT-OPLACALNY-PRZY-MOCY": "Panel power {moc} W ({prog} W or more) — MPPT pays off.",
  "PWM-WYSTARCZY": "Panel power {moc} W, voltages match — PWM is enough.",
  "PID-PROG-NAPIECIA-ZE-ZRODLA": "The 400V voltage threshold and the high-humidity condition for PID risk are taken directly from the source — no model of power-loss rate.",
  "PROG-MOC-MPPT-OPLACALNOSC-DOPOWIEDZIANY": "The 250W threshold (midpoint of the source's 200-300W range) is inferred, not stated as a single number.",
  "POZA-ZAKRESEM-WZORU-WIND-CHILL":
    "The wind chill formula is only defined for temperature ≤{maxTemp}°C and wind >{minWiatr} km/h — outside that range the result has no physical meaning.",
  "WIND-CHILL-WZOR-NWS": "Standard NWS/Environment Canada (2001) meteorological formula — not stated directly in this project's source material, but publicly known physics.",
  "SNIEG-NORMOWE-PRZEKRACZA-NOSNOSC": "The code snow load ({s} kN/m²) exceeds the roof capacity ({nosnosc} kN/m²). This roof may not carry the snow that falls in this zone statistically once in 50 years. Have a structural engineer check the structure before you add panels to the roof.",
  "SNIEG-AKTUALNE-PRZEKRACZA-NOSNOSC": "The measured snow layer weighs up to {q} kN/m² — more than the roof capacity ({nosnosc} kN/m²). Clear the roof now, safely: from the ground or with fall protection, never standing on the overloaded slope.",
  "SNIEG-NORMOWE-ZBLIZA-SIE-DO-NOSNOSCI": "The code snow load ({s} kN/m²) is {pct}% of the roof capacity ({nosnosc} kN/m²) — you are approaching the limit. A small margin does not forgive mistakes: check with a structural engineer whether the capacity you entered is a design value, and do not add weight to the roof until you know. The 80% threshold is this app's setting, not a code requirement.",
  "SNIEG-AKTUALNE-ZBLIZA-SIE-DO-NOSNOSCI": "The measured snow layer weighs up to {q} kN/m², i.e. {pct}% of the roof capacity ({nosnosc} kN/m²) — you are approaching the limit. Plan to clear the roof before the next snowfall or thaw (wet snow is heavier), safely: from the ground or with fall protection. The 80% threshold is this app's setting, not a code requirement.",
  "SNIEG-BRAK-NOSNOSCI": "Roof capacity not given — only the load is shown, with no check whether the roof can carry it. The capacity (snow load assumed in the design) is in the building design documents or available from a structural engineer.",
  "SNIEG-POMIAR-BEZ-RODZAJU": "Layer thickness given, but not the snow type — without it the weight per cubic metre is unknown (fresh snow is four times lighter than wet snow). Choose the snow type.",
  "SNIEG-NAWISY-NB1-12": "Above {prog} m a.s.l. and throughout zone {strefa} the code recommends allowing for snow overhangs at the roof edge (PN-EN 1991-1-3, 6.3 and NB1.12). This screen does not calculate them — it is a local load on the eaves and gutter.",
  "SNIEG-ZALOZENIE-WARTOSC-CHARAKTERYSTYCZNA": "Characteristic values (without the γ = 1.5 safety factor from PN-EN 1990). Enter the capacity as a characteristic value too — we compare like with like.",
  "SNIEG-ZALOZENIE-DACH-JEDNO-DWUPOLACIOWY": "Mono- or duopitch roof, uniform load (PN-EN 1991-1-3, 5.3.2–5.3.3, Table 5.2). Out of scope: multi-span roofs with valleys, cylindrical roofs, drifts at a taller wall and exceptional drifts (NB1.5).",
  "SNIEG-ZALOZENIE-CT": "Thermal coefficient Ct = {ct} (PN-EN 1991-1-3, 5.2(8)). A lower value for poorly insulated roofs (formula NB.1) is not calculated here — the code says it should be \"carefully considered\".",
  "SNIEG-ZALOZENIE-GRANICA-STREF": "Take the zone from map NB.1. Within 10 km on either side of a zone boundary the code allows the average of the two neighbouring zones (NB1.7) — here we calculate for the single chosen zone.",
  "SNIEG-ZALOZENIE-MU-MIN-BARIERKI": "Snow guards or a parapet hold the snow — shape coefficient raised to {mu} (PN-EN 1991-1-3, note under Table 5.2).",
  "SNIEG-ZALOZENIE-POMIAR-NA-DACHU": "Thickness measured on the roof, snow bulk weight from PN-EN 1991-1-3, Table E.1. Rain on snow and refreezing raise the weight beyond the table (5.2(6)) — count ice on the roof separately.",
  "SNIEG-ZALOZENIE-GAMMA-GORNA": "Old snow: the code gives a range of {min}–{max} kN/m³. The upper value is compared with the capacity (the safer side).",
  "MROZ-PVC-PONIZEJ-PROGU": "PVC at {temp}°C: below its {prog}°C limit it stiffens and cracks — the cable insulation or fitting loses its seal and moisture gets in. Replace it with XLPE or rubber at this location.",
  "MROZ-XLPE-PONIZEJ-PROGU": "XLPE at {temp}°C: below {prog}°C — outside the range given by the source. Check the lowest operating temperature in the cable manufacturer's datasheet.",
  "MROZ-GUMA-BEZ-PROGU": "Rubber stays flexible in frost — the source gives no numeric limit. Check the lowest operating temperature in the manufacturer's datasheet.",
  "MROZ-ALUMINIUM-KURCZENIE": "Aluminium contracts in frost and can loosen connections. After the first winter check the aluminium terminals are tightened to the manufacturer's torque.",
  "MROZ-ZALOZENIE-PROGI-OGOLNE": "General material limits from the source (PVC −10°C, XLPE −40°C). The datasheet of the specific cable or fitting takes precedence — it often gives separate temperatures for laying (bending) and for fixed operation.",
  "ELEKTRONIKA-BMS-PONIZEJ-MIN": "{nazwa}: minimum operating temperature {min}°C, but down to {temp}°C at the installation site — the BMS may fail to start, and without the BMS the battery will not run. Move the BMS (or the whole battery) somewhere warmer or provide heating.",
  "ELEKTRONIKA-PONIZEJ-MIN-WYSWIETLACZ": "{nazwa}: minimum {min}°C, down to {temp}°C at the site — the LCD slows down or goes blank. Readings may be unavailable on the coldest days.",
  "ELEKTRONIKA-PONIZEJ-MIN-CZUJNIK": "{nazwa}: minimum {min}°C, down to {temp}°C at the site — the sensor may give wrong readings, and automation will act on bad data.",
  "ELEKTRONIKA-PONIZEJ-MIN-PRZETWORNICA": "{nazwa}: minimum {min}°C, down to {temp}°C at the site — the converter loses efficiency and may fail to start, and an inverter that does not start means no 230 V power in the whole house. Move it somewhere warmer or choose a model rated for lower temperatures.",
  "ELEKTRONIKA-PONIZEJ-MIN-REGULATOR": "{nazwa}: minimum {min}°C, up to {temp}°C at the site — the charge controller may not charge the battery until it warms up. Power from the battery continues, but on short winter days you lose part of the production. Move it somewhere warmer or choose a model rated for lower temperatures.",
  "ELEKTRONIKA-PONIZEJ-MIN-INNE": "{nazwa}: minimum {min}°C, down to {temp}°C at the site — the device runs outside its datasheet range. Move it somewhere warmer or choose a version rated for lower temperature.",
  "ELEKTRONIKA-BRAK-MIN-TEMP": "{nazwa}: no minimum operating temperature — cannot be assessed. You will find it in the datasheet (\"operating temperature\").",
  "ELEKTRONIKA-ZALOZENIE-TEMP-MIEJSCA": "One temperature for all devices — the lowest at the installation site. If devices are in different places (garage, basement), check each place separately.",
  "POMPY-PONIZEJ-MIN-POMPA": "{nazwa}: minimum {min}°C, location down to {temp}°C — oil thickens, seals stiffen, the pump may seize. Use a pump with frost-resistant seals or move it to a heated zone.",
  "POMPY-PONIZEJ-MIN-ZAWOR": "{nazwa}: minimum {min}°C, location down to {temp}°C — the valve may freeze or start leaking. Drain it before winter or insulate and heat it.",
  "POMPY-PONIZEJ-MIN-SILOWNIK": "{nazwa}: minimum {min}°C, location down to {temp}°C — seals stiffen, the actuator may fail to close or open the valve.",
  "POMPY-PONIZEJ-MIN-INNE": "{nazwa}: minimum {min}°C, location down to {temp}°C — the component operates outside its datasheet range. Move it somewhere warmer or choose a low-temperature version.",
  "POMPY-ZAWOR-ZEWNETRZNY": "The outdoor garden-water valve must be drained before winter — water left inside will freeze and burst the valve or pipe.",
  "POMPY-BRAK-MIN-TEMP": "{nazwa}: no minimum operating temperature — cannot assess. Find it in the datasheet (\"operating temperature\").",
  "POMPY-ZALOZENIE-TEMP-MIEJSCA": "One temperature for all components — the lowest at the installation location. If pumps and valves are in different places (garage, well, basement), check each place separately.",
  "GRZALKI-GODZINY-PONAD-DOBE": "Operating time per day must be between 0 and 24 h.",
  "GRZALKI-WIEKSZE-NIZ-POMPA": "Roof heaters ({moc} W) will load the system more than the heat pump ({pompa} W) — check that you have enough power headroom.",
  "GRZALKI-BRAK-ZAPASU-MOCY": "Heaters need {moc} W but free power headroom is {zapas} W — together with other loads they will overload the inverter. Shorten the cable, split into zones switched alternately, or increase headroom.",
  "GRZALKI-SPRAWDZ-ZAPAS": "Roof heaters can load the system more than a heat pump — enter the inverter's free power headroom to check.",
  "GRZALKI-ZALOZENIE-MOC-STALA": "The cable runs at rated power for the whole stated time. A self-regulating or thermostat-controlled cable usually uses less — then enter the full-power equivalent time.",
  "GRZALKI-ZALOZENIE-DLUGOSC-USERA": "You enter the cable length yourself — this screen does not derive ice-dam zones from roof geometry. Most exposed: roof valleys and zones along the gutters.",
  "ZAMARZ-PLYCEJ-NIZ-PRZEMARZANIE": "{nazwa} is laid at {glebokosc} cm, but the frost depth is {hz} cm. Freezing, heaving ground can damage it — lay it deeper (below the frost line) or protect it with insulation and heating.",
  "ZAMARZ-RURA-BEZ-ZAPASU": "{nazwa}: {glebokosc} cm — below the frost line, but water pipes should be laid at least 20 cm below it (here: {wymagana} cm).",
  "ZAMARZ-BRAK-GLEBOKOSCI": "{nazwa}: no laying depth — cannot assess.",
  "ZAMARZ-ROZMRAZANIE-OGIEN": "Do not thaw a pipe with an open flame or torch — heating it too fast risks bursting the pipe and starting a fire. Use a heating cable.",
  "ZAMARZ-ZALOZENIE-HZ-USERA": "You enter the frost depth yourself — from a frost-zone map or the building design. The app does not yet have location data to derive it.",
  "ZAMARZ-ZALOZENIE-DO-WIERZCHU": "Laying depth is measured to the top of the cable, pipe or earth electrode — not to its axis or the trench bottom.",
  "AGREGAT-DIESEL-PARAFINIZACJA": "Regular diesel at {temp}°C — most likely already waxing, so the generator will not start or will stall. Below +5°C use winter diesel, below −10°C arctic diesel — regardless of what the pump label says. A winter additive (cold-flow improver) is recommended: easier starting and delayed waxing. Checking the glow plugs is mandatory. Use a low cold-viscosity oil (e.g. 5W-40). What matters is the temperature where the generator and fuel are kept. The +5°C and −10°C thresholds are this app's practical settings (real-world fuel in Poland), not a standard requirement.",
  "AGREGAT-DIESEL-RYZYKO-ROZRUCHU": "Regular diesel at {temp}°C may already cause starting problems. From +5°C use winter diesel, below −10°C arctic diesel. A winter additive is recommended (easier starting, delayed waxing); checking the glow plugs before winter is mandatory. What matters is the temperature where the generator and fuel are kept (outdoors or indoors). The +10°C threshold is this app's practical setting, not a standard requirement.",
  "AGREGAT-DIESEL-ROZRUCH-MROZ": "Diesel at {temp}°C: below −10°C use arctic diesel only (plus a winter additive), a fully charged starter battery and good glow plugs — checking the glow plugs is mandatory, otherwise starting may be very hard or impossible. The −10°C threshold is this app's practical setting, not a standard requirement.",
  "AGREGAT-BENZYNA-MROZ": "Petrol at {temp}°C: use winter engine oil as specified by the generator manufacturer and check the spark plug — a worn plug makes cold starts harder.",
  "AGREGAT-DLUGI-POSTOJ": "The generator has been idle {dni} days at {temp}°C — after 2+ weeks in frost it may not start (flat battery, thickened oil, waxed fuel). Run it periodically, use a block heater and an AGM battery.",
  "AGREGAT-PRZERWY": "The generator can run {max} h continuously, then needs a {przerwa} h break — {liczba} breaks in this scenario. During breaks power comes from the battery only.",
  "AGREGAT-W-BUDYNKU-CZAD": "Combustion generator inside the building (basement, boiler room, attached garage, living space) — deadly risk of carbon monoxide (CO) poisoning. CO is odourless and kills in sleep. Never run a generator indoors, even with windows or doors open. Place it outdoors or in a dedicated plant room with the exhaust ducted outside and separate ventilation.",
  "AGREGAT-POMIESZCZENIE-WYDZIELONE": "Generator in a dedicated plant room — only when: the exhaust is ducted tightly outside, there is separate extract and supply ventilation (fresh air for combustion and cooling), the room is separated from living areas, and CO detectors work in the room and in the house. Confirm detailed code requirements (HD 60364-5-551, fire regulations) with an installer — the app does not have these standards yet.",
  "AGREGAT-NA-ZEWNATRZ": "Generator outdoors: place it so exhaust cannot enter the building — away from windows, doors and ventilation intakes, exhaust pointing away from the house. Protect it from rain and snow without a sealed enclosure. Fit a CO detector in the house.",
  "AGREGAT-BEZ-PRZELACZNIKA": "Generator connected to the installation without a changeover switch (through a socket, with a \"double male plug\") — potentially fatal. With a grid connection it backfeeds the grid and can electrocute a line worker on a \"dead\" line; in an off-grid system it ends up in parallel with the inverter output — equipment destroyed and fire risk, and the plug pins are live. Install an I–0–II switch with mechanical interlock (grid/inverter – 0 – generator) switching the phases and N.",
  "AGREGAT-PRZEZ-PRZELACZNIK": "Generator through an I–0–II switch — good. The switch must have a 0 position and a mechanical interlock (both sources can never be on at once) and switch the phases and N. Switch over with high-power loads off. Installation by a licensed electrician.",
  "AGREGAT-WEJSCIE-FALOWNIKA": "Generator through a distribution board to the inverter/charger AC input — the inverter transfers the sources itself. A generator is always connected through a distribution board (overcurrent and residual-current protection of the generator circuit), never with a lead straight into the inverter. Check in the manual that this input is meant for a generator and what current it accepts. If the building also has a grid connection, a grid – 0 – generator switch with mechanical interlock is needed before that input.",
  "AGREGAT-TYLKO-ODBIORNIKI": "Emergency loads fed from a distribution board supplied only by the generator — according to the emergency plan (which circuits and in what order). That board must have no connection to the grid or to the building installation; if it has one, a I–0–II changeover switch is needed. Never connect a generator to a wall socket.",
  "AGREGAT-GORACE-CZESCI-OPARY": "High temperature and fuel vapour: the muffler and exhaust get very hot — keep flammable materials away and do not touch them. Refuel only with the generator stopped and cooled, with no open flame or sparks nearby. Wipe up spilled fuel before starting.",
  "AGREGAT-PALIWO-OSOBNO": "Keep the fuel store separate — away from the generator and outside the room it runs in (approved cans, ventilated place, away from heat sources). Separating the tank from the generator lowers the fire risk and its consequences.",
  "AGREGAT-SRODKI-GASNICZE": "Keep an extinguisher suitable for fuel and electrical fires at the generator (e.g. ABC powder or CO₂) and check its expiry. Never use water on fuel or live equipment. In a fire, first cut the power and fuel if it is safe to do so.",
  "AGREGAT-ZALOZENIE-DANE-PRODUCENTA": "Continuous run time, break, fuel consumption and oil interval — from your generator's manual. Consumption is taken as constant at typical load; in winter, with cold starts, it can be higher.",
  "BLACKOUT-PROCENT-POZA-ZAKRESEM": "Percentage values must be within 0–100% (efficiency above 0).",
  "BLACKOUT-SOC-MIN-NIE-MNIEJSZY": "The critical minimum SoC must be lower than the SoC at the start of the scenario.",
  "BLACKOUT-SYSTEM-PADNIE": "In a {dni}-day no-sun scenario the system reaches its critical minimum on day {dzien}. To survive you need about {pojemnosc} kWh more battery or must cut consumption by about {redukcja}%.",
  "BLACKOUT-SYSTEM-PRZETRWA": "The system survives {dni} days without sun at the entered consumption.",
  "BLACKOUT-ZALOZENIE-PV-ZERO": "Extreme scenario: PV production = 0 for the whole period (full overcast, snow on panels).",
  "BLACKOUT-ZALOZENIE-ZUZYCIE-STALE": "Constant daily consumption — enter it for the coldest days (heating in frost). Daily model: it does not show the hour of failure. Battery capacity is not derated for frost here — check M4 \"Cold C-Rate\".",
  "ZAMARZANIE-PROCENT-POZA-ZAKRESEM": "Percentage values must be within 0–100% (efficiency above 0).",
  "ZAMARZANIE-SOC-PONIZEJ-MINIMUM": "The battery is already at its minimum — critical loads (heating, pumps) have no power. Start the generator.",
  "ZAMARZANIE-KOMFORT-ODLACZONY": "Shed immediately (comfort, no PV surplus in winter): {nazwy}.",
  "ZAMARZANIE-WAZNE-PRZY-PROGU": "Shed below {prog}% SoC (important — last resort): {nazwy}.",
  "ZAMARZANIE-BRAK-KRYTYCZNYCH": "No critical loads (priority 1) — add heating, pumps and BMS heaters, which must never be shed.",
  "ZAMARZANIE-ZALOZENIE-BRAK-PV": "Winter without PV surplus: comfort shed immediately, important below 20% SoC, critical never — thresholds from Module 2 \"Load-shedding priority matrix\".",
  "ZAMARZANIE-ZALOZENIE-MOC-STALA": "Load power taken as constant. A heat pump in frost runs longer and harder — enter its average power over a frosty day.",
  "SPOF-BMS": "{nazwa}: no bypass — if the BMS fails, the whole system shuts down within seconds. Install a second BMS or at least an emergency contactor.",
  "SPOF-BEZPIECZNIK-GLOWNY": "{nazwa}: no spare fuse — once it blows, the system is down until replaced. Keep a spare at the distribution board.",
  "SPOF-POMPA-CIEPLA": "{nazwa}: no backup heater — a heat pump failure in winter means no heating. Consider a backup heater or another heat source.",
  "SPOF-KOMPONENT": "{nazwa}: single point of failure — no redundancy or bypass.",
  "REKU-SPRAWNOSC-POZA-ZAKRESEM": "Recovery efficiency must be within 0–100%.",
  "REKU-RYZYKO-ZAMARZNIECIA": "At {temp}°C the heat exchanger may freeze (the manufacturer's limit is {granica}°C) — the unit will switch to bypass or stop. Use a pre-heater or an exchanger with bypass.",
  "REKU-WILGOTNOSC": "Ventilation off means rising humidity, mould risk and poorer air — the app does not calculate these effects (the source gives no relation).",
  "REKU-ZALOZENIE-STALE-POWIETRZA": "Air density 1.2 kg/m³ and specific heat 1005 J/(kg·K) — the same constants as in Module 6. Air exchange without recovery loses all the heat the unit used to recover.",
  "PREHEAT-COP-NIEDODATNI": "COP must be above 0 (1 for an electric heater).",
  "PREHEAT-GRZANIE-NOCA-Z-BATERII": "Do not pre-heat at night from the battery — it will ruin the energy storage. Heat during the day from PV surplus.",
  "PREHEAT-ZA-MALA-NADWYZKA": "Pre-heating needs about {potrzebne} kWh of electricity, while the PV surplus is {nadwyzka} kWh — lower the temperature rise or skip the hot-water tank.",
  "PREHEAT-ZALOZENIE-STRATY-STALE": "Buffer calculated at constant heat loss for the forecast frost — in reality it drops as the house cools. Heat capacity from Module 6 \"Building heat capacity\".",
  "STRING-PROCENT-POZA-ZAKRESEM": "Percentage must be above 0 and not more than 100%.",
  "STRING-WIEKSZY-NIZ-CALOSC": "One string's production cannot exceed the whole array's production.",
  "STRING-DEFICYT": "With this string failed in the worst month, {deficyt} kWh per day is missing — the system will not survive without a generator.",
  "STRING-DNI-NA-BATERII": "At this deficit the battery lasts about {dni} days.",
  "STRING-KASKADA": "The risk of cascading failure (overloading the remaining strings) is not calculated. Monitor string voltages as an early warning (Module 13).",
  "STRING-ZALOZENIE-NAJGORSZY-MIESIAC": "Enter production for the worst month (usually December/January) — from Module 3. A failed string produces 0 kWh.",
  "ESP-SPRAWNOSC-POZA-ZAKRESEM": "Converter efficiency must be above 0% and not more than 100%.",
  "ESP-BEZ-PRZETWORNICY": "Do not connect the ESP32 directly to the bus voltage — you will burn the board regulator. A step-down converter to 5 V or 3.3 V is required.",
  "ESP-PRZETWORNICA-ZA-NISKIE-WEJSCIE": "The bus reaches {umax} V, while the converter accepts max. {uwe} V — it will be damaged during charging. Choose a converter with a higher input voltage.",
  "ESP-PRZETWORNICA-PRZECIAZONA": "The ESP32 with sensors draws {iout} A, while the converter supplies max. {imax} A — choose a stronger one.",
  "ESP-BEZPIECZNIK-FILTR": "Bus current about {iin} A — fit a fuse at the converter input. When powered from a PV system, check whether an EMI filter is needed.",
  "ESP-ZALOZENIE-NAPIECIE-MAX": "The converter's input range is compared with the highest bus voltage (while charging), not the nominal one. Bus current is calculated at nominal voltage.",
  "KOM-RS485-BEZ-TRANSCEIVERA": "{nazwa}: do not connect a 3.3 V GPIO directly to the RS485 bus — a transceiver (e.g. MAX485) is required, otherwise you will damage the port.",
  "KOM-CAN-BEZ-TRANSCEIVERA": "{nazwa}: the CAN bus needs a transceiver (e.g. SN65HVD230) — a GPIO cannot drive it directly.",
  "KOM-KONFLIKT-ADRESU": "Address {adres} is used by several RS485 devices ({nazwy}) — every Modbus device needs a unique address.",
  "KOM-ROZNE-PREDKOSCI": "The {protokol} bus has different baud rates ({predkosci}) — all devices on one bus must use the same.",
  "KOM-ADRES-NIEPOPRAWNY": "Device address must be a whole number, at least 1.",
  "KOM-ZALOZENIE-JEDNA-MAGISTRALA": "Assumption: all RS485 devices are on one bus, and all CAN devices on one bus. With several separate buses, check each one on its own.",
  "PIN-GPIO-NIEPOPRAWNY": "GPIO number must be a whole number, not less than 0.",
  "PIN-KONFLIKT": "GPIO{gpio} has several functions assigned: {opisy} — each pin can have one function (except shared bus lines I2C, 1-Wire, SPI).",
  "PIN-ADC-WIFI": "With Wi-Fi active, ADC2 is unavailable — connect analogue measurements to ADC1 pins (check the board datasheet).",
  "OTA-BEZ-PODPISU": "OTA update without digital signature verification — risk of flashing malicious or corrupted firmware.",
  "OTA-BEZ-SUMY-KONTROLNEJ": "OTA update without a checksum — a corrupted file may be installed.",
  "OTA-BEZ-ROLLBACKU": "OTA update without rollback to the previous version — a failed update may brick the controller.",
  "ESP-PLYTKA-BRAK-JEDNEJ": "No variant on the list has all selected features at once — the best cover {pokryte} of {liczba}. Compare the datasheets or add the missing function with an external module.",
  "ESP-PLYTKA-BEZ-WYMAGAN": "No need is selected and the supply is permanent — any variant in the table will do. Select what you need to narrow the choice.",
  "ESP-ODSTEP-OD-SZYN": "The {odstep} cm clearance from the busbars is below the recommended minimum of {min} cm — move the ESP32 enclosure away from the busbars, away from what heats up and what is live.",
  "ESP-OBUDOWA-BEZ-WENTYLACJI": "ESP32 enclosure without ventilation — electronics need an airy place and heat removal.",
  "ESP-OBUDOWA-BEZ-IZOLACJI": "The ESP32 is not isolated from live parts — separate it with a barrier or a separate enclosure.",
  "ESP-MONTAZ-ZALECANY-DIN": "Mounting on a DIN rail or a mounting plate is recommended — secure fixing and an orderly distribution board.",
  "ESP-ODSTEP-UJEMNY": "The busbar clearance must be a number not less than 0 cm.",
  "ZAMEK-BLOKUJE-BEZ-ZASILANIA-AWARYJNEGO": "The lock keeps the door locked on power loss and there is neither backup power nor a manual release that works without power — in a fire, when the power fails, the escape door may stay locked. The door must open then: switch to fail-safe logic (no power = door open) or provide separate backup power or a manual mechanical release (lever handle, panic bar).",
  "ZAMEK-FAIL-SECURE": "The lock keeps the door locked on power loss — opening depends on backup power or a manual mechanical release. This is acceptable, but the rule for escape doors is: no power = door open. Test the UPS regularly and check that the manual release works without power and without a key from the inside; consider a fail-safe lock.",
  "ZAMEK-ZACHOWANIE-NIEZNANE": "It is unknown what the lock does on power loss — treated as locking (safe side). Check the datasheet: \"fail-safe\" (opens) or \"fail-secure\" (locks).",
  "ZAMEK-BRAK-PRZYCISKU": "No emergency exit button — the door can only be released automatically. A button lets you open it by hand when automation fails.",
  "ZAMEK-BRAK-ZWALNIANIA-PO-ALARMIE": "The lock is not released by the fire alarm signal — in a fire the door stays locked until someone releases it.",
  "ZAMEK-BRAK-KONTAKTRONU": "No door contact (reed switch) — the system cannot confirm the door actually opened.",
  "GASZ-LICZBA-CZUJNIKOW-NIEPOPRAWNA": "The number of confirming detectors must be a whole number, at least 1.",
  "GASZ-SRODEK-NIESKUTECZNY-LIFEPO4": "Powder and CO2 do not stop the internal chemical reaction of a LiFePO4 cell — an energy-storage zone requires water mist or an agent designed for energy storage systems.",
  "GASZ-SRODEK-NIEPOTWIERDZONY-LIFEPO4": "A LiFePO4 storage zone requires water mist or an agent designed for energy storage. If your agent is certified for energy storage, choose \"energy storage agent\"; if not, change it.",
  "GASZ-PROPOZYCJA-LIFEPO4": "Proposal for a LiFePO4 storage: (1) water mist (water/mist unit) — first choice, because it cools the cells; (2) an agent designed for energy storage — certified by its maker for lithium batteries; (3) as a supplement for a larger storage: cell cooling (freezing) — a cell in thermal runaway stops only when its heat is taken away; inert gas and aerosol put out the flame but do not cool, so the cell can reignite. Choose the cooling system with the storage manufacturer.",
  "GASZ-INNA-CHEMIA": "The zone contains storage of a chemistry other than LiFePO4 — choose the extinguishing agent per the storage manufacturer's instructions.",
  "GASZ-ZA-MALO-CZUJNIKOW": "Extinguishing is triggered by {liczba} detector — alarm confirmation needs at least {min} independent detectors, otherwise the risk of false discharge grows.",
  "GASZ-BRAK-ODCIECIA-WENTYLACJI": "Extinguishing does not shut off ventilation or close dampers — the agent will escape the zone.",
  "GASZ-MODUL-ROZLADOWANY": "Extinguishing module discharged — replace it. It will not work in a fire.",
  "ZRODLO-GODZINY-POZA-DOBA": "Burning time must fit within a day (0–24 h).",
  "ZRODLO-SPRAWNOSC-POZA-ZAKRESEM": "Efficiency must be above 0% and not more than 100%.",
  "ZRODLO-MOC-WODY-WIEKSZA": "Power to water cannot exceed the appliance's total heat output.",
  "ZRODLO-BEZ-PLASZCZA": "Without a water jacket the appliance mainly heats the room it stands in — it will relieve the battery a lot, but will not heat the whole house. Whole-house coverage is not calculated.",
  "ZRODLO-NIE-POKRYWA": "The backup source covers about {pokrycie}% of the daily heat demand — the rest must come from the heat pump or another source.",
  "ZRODLO-CZUJNIK-CO": "Install a carbon monoxide (CO) detector in the room with the combustion appliance — also check clearances and air supply on the \"Fire safety — solid fuel heating\" screen.",
  "ZRODLO-ZALOZENIE-MOC-STALA": "Heat output taken as constant for the whole burning time (rated output from the datasheet). Lighting and burn-down reduce it in reality.",
  "ZRODLO-ZALOZENIE-WARTOSC-OPALOWA": "Fuel amount from the entered efficiency and calorific value. The calorific value of wood depends strongly on species and moisture — wet wood gives much less heat.",
  "SSP-AWARIA-CENTRALI": "Fire alarm panel fault — check its power supply. While the panel is down, the system will not learn about a fire.",
  "SSP-BRAK-SYGNALU-ALARMU": "The controller does not receive the alarm signal from the panel — the rest of the system (locks, dampers, extinguishing, lighting) will not learn about a fire.",
  "SSP-BRAK-SYGNALU-AWARII": "The controller does not receive the panel fault signal — a failed panel will go unnoticed. A panel fault must be shown with priority.",
  "SSP-BRAK-SYGNALU-ROZBROJENIA": "The controller does not receive the disarm signal — it cannot tell a switched-off panel from active monitoring.",
  "SSP-BRAK-LOGOWANIA": "Panel events are not logged — after an incident you will not be able to reconstruct what happened.",
  "OSW-LAMPA-NIESPRAWNA": "Emergency lamp {nazwa} is not working — check it. A fault on the escape route must be fixed before it is needed.",
  "OSW-LAMPA-NIETESTOWANA": "Emergency lamp {nazwa} has not been tested — its condition is unknown. Run the periodic test.",
  "OSW-BRAK-ZEWNETRZNEGO": "No outdoor lighting switched on after an alarm — it helps emergency services find the way.",
  "KLAPY-WENTYLACJA-NIE-WYLACZANA": "The heat-recovery/ventilation unit does not shut down in a fire — it will push smoke around the house.",
  "KLAPY-NIE-ZAMYKANE": "Duct dampers do not close when fire is detected — smoke will spread through the ducts to other rooms.",
  "KLAPY-BRAK-SYGNALIZACJI": "No damper position feedback — the system cannot confirm the dampers have closed.",
  "KLAPY-BRAK-ODDYMIANIA": "No smoke extraction — smoke will have to be cleared by hand (windows, doors) after the fire is out.",
  "KLAPY-BRAK-WENTYLACJI-MECHANICZNEJ": "No mechanical ventilation — fire dampers and heat-recovery shutdown do not apply to this building.",
  "ALARM-LICZBA-KONTAKTOW-NIEPOPRAWNA": "The number of contacts must be a whole number, not less than 0.",
  "ALARM-WEZWANIE-BEZ-ZGODY": "Automatic emergency call is enabled without your explicit consent — it stays inactive. It may only work with prior, explicit consent.",
  "ALARM-BRAK-SYRENY": "No siren/sounder — household members and neighbours will not hear the alarm.",
  "ALARM-BRAK-KONTAKTOW": "No alarm contacts — notifications will reach no one when you are away.",
  "ALARM-BRAK-KAMER": "No cameras — the course of the incident will not be recorded.",
  "SUGEROWANA-WYMIANA-STARYCH-URZADZEN": "\"Old\" class appliances (real consumption exceeds the nominal power): {urzadzenia}. Consider replacing them — it can pay off in battery savings.",
  "NISKIE-OBCIAZENIE-FALOWNIKA": "The inverter load is only {obciazenie}% of rated power — efficiency in this range usually drops.",
  "OBCIAZENIE-FALOWNIKA-OPTYMALNE": "The inverter load ({obciazenie}%) is in the typically highest-efficiency range.",
  "MIESZANI-PRODUCENCI-MC4":
    "The female and male connectors are from different manufacturers — contacts from different families don't always fit perfectly; a loose contact under load arcs, and that's a real fire risk.",
  "PRODUCENT-MC4-NIEZNANY": "One connector's manufacturer is marked as unknown — contact compatibility can't be confirmed without identification.",
  "ZLACZA-MC4-ZGODNE": "{producent} connectors on both sides — a matched set from one manufacturer, compatible.",
  "SZCZELINA-KRYTYCZNA":
    "The {szczelina} cm gap is below the critical threshold (5 cm) — panel temperature can reach up to 70°C, estimated power loss about {strata}%.",
  "SZCZELINA-POSREDNIA-BRAK-DANYCH":
    "The {szczelina} cm gap is in the intermediate range (5–15 cm), for which the source gives no exact power-loss figure — a gap of at least 15 cm is recommended for certainty.",
  "SZCZELINA-BEZPIECZNA": "Ventilation gap sufficient (≥15 cm) — no significant power loss from overheating.",
  "GEOMETRIA-PRETA-NIEFIZYCZNA": "This combination of rod length and diameter is outside the formula's range — check the units (m for length, mm for diameter).",
  "ZA-DUZO-PRETOW-DO-PROSTEGO-LICZENIA":
    "The estimated number of rods ({liczba}) exceeds {max} — such difficult soil needs a real grounding design, not just a simple calculation.",
  "UZIOM-ZAPROJEKTOWANY": "Estimated number of rods: {liczba} (single-rod resistance ≈ {rezystancja} Ω).",
  "UZIOM-MODEL-N-PRETOW-UPROSZCZONY":
    "The rod count uses a simplified parallel model (1/n), without correcting for mutual interaction between rods — the real value after installation may need one more rod. Measure the resistance once the grounding is built.",
  "UZIOM-MATERIAL-PATRZ-LACZENIE-CU-AL":
    "Choosing rod material (copper vs. galvanized steel) and avoiding galvanic corrosion when joining different metals — see the \"Cu-Al bonding and corrosion protection\" screen (Module 5, Screen 4).",
  "UKLAD-IT-BEZ-IMD": "The network is an IT system, but no IMD is installed — a first earth fault won't trip a breaker and will go undetected.",
  "IMD-ZAINSTALOWANY-POPRAWNIE": "IMD installed, alarm threshold {prog} kΩ.",
  "UKLAD-NIE-IT-IMD-NIEPOTRZEBNY": "The network is not an IT system — an earth fault trips the breaker automatically, IMD is not required.",
  "IMD-PROG-ALARMU-PRZYKLADOWA-WARTOSC-ZRODLA":
    "The entered alarm threshold is the value you set — the source gives 50 kΩ only as an example, not a universal requirement. The real threshold depends on system voltage and the IMD manufacturer's guidance.",
  "BRAK-CERTYFIKATU": "{komponent} — certificate not yet confirmed.",
  "WAMPIR-POZYCJA-NIEDODATNIA": 'The selected device "{label}" must have a power greater than zero.',
  "WAMPIR-BRAK-ZAZNACZONYCH": "No device from the standby catalog is selected.",
  "WAMPIR-POZYCJA-WARTOSC-DOMYSLNA": '"{label}" uses the default power of {value} W (not edited).',
  "WAMPIR-POMIAR-NIEDODATNI": 'The measured item "{label}" must have a power greater than zero.',
  "WAMPIR-BRAK-POMIAROW": "No standby power measurement was entered.",
  "WAMPIR-STANDBY-NIEDODATNI": "Standby draw must be a number greater than zero.",
  "WAMPIR-DOD-POZA-ZAKRESEM": "DoD (depth of discharge) must be in the range (0, 100].",
  "WAMPIR-POJEMNOSC-NIEDODATNIA": "Usable capacity must be a number greater than zero.",
  "WAMPIR-CENA-ENERGII-NIEDODATNIA": "Energy price must be a number greater than zero.",
  "WAMPIR-ELIMINACJA-POZA-ZAKRESEM": "The standby-elimination percentage must be in the range (0, 100].",
  "WAMPIR-KOSZT-UJEMNY": 'The purchase/installation cost for method "{label}" cannot be negative.',
  "WAMPIR-OSZCZEDNOSC-NIGDY-NIE-ZWROCI": 'Method "{label}" — at such a low annual saving, the purchase cost will never pay for itself.',
  "WAMPIR-STANDBY-REFERENCYJNY-NIEDODATNI": "Reference standby draw (normal mode) must be a number greater than zero.",
  "WAMPIR-STANDBY-SCENARIUSZ-NIEDODATNI": "Standby draw in the scenario cannot be a negative number.",
  "WAMPIR-REDUKCJA-NIEPOZYTYWNA": "This scenario gives no reduction in standby draw compared to the reference mode.",
  "ZACIENIENIE-PRZESZKODA-NIEPOPRAWNA": "Obstacle \"{nazwa}\" has invalid dimensions (height cannot be negative; crown radius and outline must be positive/complete).",
  "ZACIENIENIE-PUNKT-W-PRZESZKODZIE": "The analysis point lies inside obstacle \"{nazwa}\" — move the point or correct the obstacle position.",
  "ZACIENIENIE-PROGNOZA-NIZSZA": "The forecast height of tree \"{nazwa}\" is lower than its current height — check whether this is intended (e.g. planned pruning).",
  "ZACIENIENIE-POWIERZCHNIA-BEZ-SLONCA": "With this orientation the sun is behind the plane all year — no direct radiation reaches it.",
  "ZACIENIENIE-ZALOZENIE-BEZPOSREDNIE-CZYSTE-NIEBO": "The loss refers to direct (beam) radiation under clear sky (Meinel model, cos θ weighting). Diffuse radiation and cloud cover are not included — the actual loss of total energy is usually smaller. Fallback without PVGIS data — download it to calculate the total loss.",
  "ZACIENIENIE-ZALOZENIE-TMY-MUNEER": "Loss of total plane irradiation on hourly PVGIS TMY data (actual cloud cover), Muneer model — the same as on Screen 4. When the sun is behind an obstacle, beam and circumsolar radiation are lost; ground albedo {albedo}.",
  "ZACIENIENIE-ZALOZENIE-NIEBOSKLON": "Obstacles also hide part of the sky, which reduces diffuse radiation even when the sun is visible — this effect is not calculated, so the actual loss may be somewhat larger.",
  "ZACIENIENIE-ZALOZENIE-JEDEN-PUNKT": "Analysis for a single point of the plane. Partial shading of some modules affects the whole string via bypass diodes — see Module 3, Shading simulation and bypass diodes.",
  "ZACIENIENIE-ZALOZENIE-DRZEWA-NIEPRZEZROCZYSTE": "Trees not marked as deciduous (or without leafless months given) are treated as opaque all year round — a conservative assumption that overstates the loss for leafless trees in winter.",
  "ZACIENIENIE-ZALOZENIE-DRZEWA-LISCIASTE": "Deciduous trees ({nazwy}) in leafless months ({miesiace}) transmit {procent}% of direct radiation — the lower bound of measurements for leafless crowns (Konarska et al. 2014: 40–52%); opaque in the other months. Leafless months entered manually.",
  "ZACIENIENIE-BRAK-OKRESU-BEZLISCI": "Trees marked as deciduous ({nazwy}) are treated as opaque all year — no leafless months were given.",
  "ZACIENIENIE-ZALOZENIE-PROGNOZA": "Forecast in {lata} years based on manually entered tree heights — the app does not model growth rate.",
  "ORIENTACJA-DANE-NIEPELNY-ROK": "Hourly data must cover a full year (8760 or 8784 hours); received {liczba}.",
  "ORIENTACJA-DANE-UJEMNE": "Data record no. {indeks} contains negative or invalid irradiance.",
  "ORIENTACJA-POWIERZCHNIA-NIEPOPRAWNA": "Surface \"{nazwa}\": tilt must be within 0–90° and azimuth within 0–360°.",
  "ORIENTACJA-ZALOZENIE-MODEL-MUNEER": "Plane irradiation from Muneer's anisotropic sky model (1990) — the same model PVGIS uses — on hourly PVGIS TMY data; the optimum is determined from the same data.",
  "ORIENTACJA-ZALOZENIE-NAPROMIENIOWANIE-NIE-UZYSK": "The index compares surface irradiation, not energy yield — it ignores cell temperature and reflection losses (shading — separate assumption). Detailed yield is calculated in Module 3.",
  "ORIENTACJA-ZALOZENIE-ALBEDO": "Ground albedo = {albedo} (default 0.2 — typical snow-free ground; change it if the terrain differs).",
  "ORIENTACJA-HORYZONT-NIEPOPRAWNY": "Surface \"{nazwa}\": the horizon profile is empty or contains an angle outside 0–90°.",
  "ORIENTACJA-ZALOZENIE-ZACIENIENIE-HORYZONT": "Shading by obstacles from the plot model (Screen 2, current height): when the sun is behind an obstacle, beam irradiance = 0 and diffuse is calculated as for a shaded surface (Muneer). Obstruction of part of the sky dome by obstacles is not modelled. Result = average over the grid points on the roof plane (as in the Screen 3 heat map); the site optimum is without obstacles.",
  "ORIENTACJA-ZALOZENIE-ZACIENIENIE-BRAK": "No shading (no horizon profile — height of a point on the surface unknown): {nazwy}.",
  "SKANER-PUNKT-POZA-ZAKRESEM": "Point no. {indeks} in set {zbior} has coordinates out of range (latitude −90…90°, longitude −180…180°).",
  "SKANER-ZA-MALO-PUNKTOW": "Set {zbior} needs at least {min} points.",
  "SKANER-POLAC-BEZ-WYSOKOSCI": "Roof plane \"{nazwa}\": every point needs a GPS altitude — without it the tilt cannot be determined.",
  "SKANER-KALIBRACJA-NIEPOPRAWNA": "Calibration is invalid: choose two different points from the same set and enter a positive known length.",
  "SKANER-PRZESZKODA-NIEPOPRAWNA": "Obstacle \"{nazwa}\": height cannot be negative and radius must be greater than zero.",
  "SKANER-PRZESZKODA-OBRYS-NIEPOPRAWNA": "Obstacle \"{nazwa}\": height cannot be negative.",
  "SKANER-BRAK-WYSOKOSCI-GRUNTU": "Building corners have no GPS altitude — the ridge height cannot be determined.",
  "SKANER-ZALOZENIE-UKLAD-LOKALNY": "GPS coordinates converted to a local metric system (plane tangent to the WGS84 ellipsoid at the first point) — accurate for a plot-sized area.",
  "SKANER-ZALOZENIE-KALIBRACJA-POZIOMA": "Calibration with a known dimension corrects horizontal dimensions only — the GPS altitude error remains.",
  "SKANER-ZALOZENIE-WYSOKOSC-GPS": "Roof tilt and ridge height are derived from GPS altitude, which is usually less accurate than horizontal position — treat them as indicative or correct them manually.",
  "MIKROPEKNIECIA-ODSTEP-ZA-MALY": "The expansion gap of {odstep} mm is below the {min} mm minimum — a rigid mounting will lead to micro-cracks within about {lata} years.",
  "MIKROPEKNIECIA-BRAK-EPDM": "No EPDM washers — a rigid clamp leaves the panels no room for thermal expansion; risk of micro-cracks within about {lata} years.",
  "MIKROPEKNIECIA-MONTAZ-ELASTYCZNY": "Flexible mounting: EPDM washers and a {odstep} mm expansion gap — meets the source recommendation.",
  "MIKROPEKNIECIA-DANE-ZE-ZRODLA": "The 5 mm minimum, heating to 65–70°C, cooling by 30°C within minutes and the ~2-year time are taken directly from the source — no stress model (a threshold rule, not a calculation).",
  "POWLOKA-AR-CZYSZCZENIE": "Over time the coating can get dirty — clean the panels gently and avoid abrasive cleaners.",
  "POWLOKA-AR-ZAKRES-ZE-ZRODLA": "The {min}–{max}% yield gain is the typical range given by the source — the actual gain depends on the specific glass and coating, so the result is a range, not a single number.",
  "TECHNOLOGIE-POWIERZCHNIA-MODULOW": "Area of the modules alone, from the definition of rated power (1 kWp = 1000 W at 1000 W/m², STC) — without mounting gaps or service space.",
  "TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA": "Higher efficiency means fewer m² for the same power (kWp), not automatically more kWh from each kWp. Yield differences per kWp come from, among others, the temperature coefficient, low-light behaviour and degradation — so the source's yield percentages are shown as data to verify, not as a calculation.",
  "REKOMENDACJA-MIKROINWERTERY": "With partial/regular shading, choose microinverters — each panel works independently of its neighbours.",
  "REKOMENDACJA-INWERTER-CENTRALNY": "Without regular shading, the main advantage of microinverters does not apply — a central inverter is cheaper.",
  "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC": "Off-grid note: a typical microinverter is a grid-tie inverter — it will not start without a reference voltage. In an island system it needs AC coupling with an off-grid (grid-forming) inverter that creates the grid and curtails the microinverters when the battery is full. Check with the manufacturer whether the model supports this.",
  "MIKROINWERTER-OFFGRID-BEZ-FALOWNIKA-WYSPOWEGO": "The system will not start: a microinverter is a grid-tie inverter — without an off-grid inverter that forms the 230 V/50 Hz grid and supports AC coupling (curtailing power when the battery is full) it has nothing to synchronise to. Choose an off-grid inverter with AC coupling compatible with the microinverter model, or a central inverter with optimisers.",
  "NADMORSKA-BRAK-IEC-61701": "Coastal location: choose panels certified to IEC 61701 (salt-mist resistance) — salt corrodes frames and connections.",
  "NADMORSKA-BRAK-RAMY-ANODOWANEJ": "Coastal location: choose panels with an anodised frame.",
  "NADMORSKA-ZLACZKI-MC4": "Salt destroys standard MC4 connectors — use connectors designed for marine conditions.",
  "WARUNKI-BRAK-ANTY-PID": "Proximity to the sea or high humidity increases the PID risk — choose panels with an anti-PID certificate.",
  "PYLISTA-RYSOWANIE-SZKLA": "Dusty location: dust and sand can scratch the panel glass — plan more frequent cleaning.",
  "WARUNKI-SRODOWISKOWE-SPELNIONE": "The panel selection meets the source rules for this location.",
  "KAT-PR-POZA-ZAKRESEM": "The performance ratio PR must be greater than 0 and not greater than 1 (e.g. 0.8 = 80%).",
  "KAT-PRODUKCJA-WYMAGA-MOCY-I-PR": "Showing the irradiation on the panels (kWh/m²). To see production in kWh, enter the system power and the performance ratio PR.",
  "KAT-ZALOZENIE-TABELA-PVGIS": "Irradiation for azimuth {azymut}° and albedo {albedo}, computed for every tilt 0–90° in 1° steps from hourly PVGIS data (Muneer model, as in Module 1).",
  "KAT-ZALOZENIE-ZAOKRAGLENIE": "Tilt rounded to the nearest whole degree: {kat}°.",
  "KAT-ZALOZENIE-PR-UZYTKOWNIKA": "Production = power × irradiation / 1 kW/m² × PR, with PR = {pr} entered by you — the source does not give a PR value.",
  "WZ-POZA-TYPOWYM-ZAKRESEM": "For your location and tilts, east-west gives {stosunek}% of the south energy — outside the typical {min}–{max}% range given by the source. This is not an error: the result is computed from your site's data.",
  "WZ-ZALOZENIE-ODNIESIENIE": "Reference: panels facing south (180°) at the best fixed tilt for this location — {kat}°.",
  "WZ-ZALOZENIE-UDZIAL-MOCY": "Panel power: {wschod}% east, {zachod}% west — the same panel technology on both roof planes (irradiation weighted by power).",
  "ZS-WYSOKOSC-POZA-WZOREM-STREFY-3": "The zone 3 formula (PN-EN 1991-1-4, Table NA.1) applies only below 20,000 m above sea level — check the altitude you entered.",
  "ZS-KAT-BEZ-DANYCH-WIATRU": "For a tilt of {kat}° PN-EN 1991-1-4 gives no force coefficient for a canopy (Table 7.6 stops at 30°; for vertical only 90° is given). The app does not guess this value — wind force and ballast are not calculated.",
  "ZS-PION-SILA-POZIOMA": "At 90° the wind pushes the panel horizontally (coefficient 1.80, PN-EN 1991-1-4, 7.4.3). Ballast mass then depends on friction with the ground and on overturning — the standard does not give these, so the app does not compute ballast kg for vertical. For vertical mounting, ground anchor posts are more practical.",
  "ZS-REKOMENDACJA-WYMAGA-WYCENY": "To point to the best tilt, enter the panel power, PR, the price of 1 kWh and the number of years. The app then compares the energy value with the ballast cost for every tilt. Without them you see the charts and can check any tilt.",
  "ZS-OPTIMUM-ENERGII-POZA-ZAKRESEM-WIATRU": "The most energy comes at {kat}°, but for tilts above 30° the standard gives no wind force for a canopy. The recommendation is therefore chosen only from 0–30°.",
  "ZS-ZALOZENIE-STELAZ-WIATA": "The rack is treated as a monopitch canopy (PN-EN 1991-1-4, Table 7.6) — adopted in decision D26; engineering practice, not a clause of the standard.",
  "ZS-ZALOZENIE-CSCD": "Structural factor cscd = {cscd} — the standard allows it for low, stiff structures (6.2); for a rack it is an assumption.",
  "ZS-ZALOZENIE-CDIR-CSEASON": "Directional and season factors = 1.0 (most unfavourable; Table NA.2, NA.4) — the wind direction relative to the rack is unknown.",
  "ZS-ZALOZENIE-KAT-POSREDNI": "For a tilt between rows of Table 7.6 (5° steps) the more unfavourable of the two neighbouring values is used; blockage under the rack φ — linear interpolation (7.3 (3)).",
  "ZS-ZALOZENIE-BALAST-PIONOWO": "The whole wind force is treated as lifting vertically (conservative), g = {g} m/s².",
  "NW-PREDKOSC-SZCZYTOWA": "The ballast on this screen is meaningful only if the speed you entered is the strongest wind gust for your location. A more accurate value per the wind standard PN-EN 1991-1-4 (zone, terrain, height, angle) is on the “Mounting type” and “Golden mean” screens.",
  "NW-BALAST-NIEWYSTARCZAJACY": "Ballast too small: you plan {planowany} kg, but the design requires at least {wymagany} kg. In strong wind the frame may be lifted off — add ballast or anchor the frame in the ground.",
  "ZS-ZALOZENIE-BALAST-EQU": "Design ballast: PN-EN 1990, expression (6.7), Table A1.2(A) — γQ = {gammaQ} for wind (unfavourable action), γG,inf = {gammaG} for ballast (favourable action); Polish National Annex NB makes no national changes.",
  "ZS-ZALOZENIE-MASA-WLASNA-POMINIETA": "Weight of panels and frame ignored (on the safe side) — enter the mass from the datasheet or a scale to subtract it from the ballast.",
  "ZS-ZALOZENIE-MASA-WLASNA": "Weight of panels and frame {masa} kg (entered from datasheet/scale) counted as a favourable action with γG,inf = {gammaG}; ballast = required mass minus this weight (not less than 0).",
  "ZS-BALAST-EQU-TYLKO-ODRYWANIE": "The ballast is a design value per PN-EN 1990 (static equilibrium, EQU): wind force ×1.5, ballast weight counted at only 90%. This protects the frame against being lifted off. Sliding (needs the ground friction coefficient) and overturning (needs the point where the force acts) are not checked — confirm ballast layout and fixing with a structural engineer.",
  "OC-TEMP-WEWN-NIE-WYZSZA": "The indoor temperature ({ti} °C) is not higher than the design outdoor temperature ({te} °C) — check your input.",
  "OC-BEZ-PN-EN-12831": "These are heat losses through the building envelope and through air exchange — exactly as the source describes. They do not include thermal bridges, the detailed ground-loss method, solar and internal gains or the reheat capacity of the full PN-EN 12831-1 standard (not available in the app). Thermal bridges increase losses — keep a margin when sizing the heat source or ask a designer for the full calculation.",
  "OC-MIESIACE-ZE-SREDNICH": "Monthly heat is computed from the monthly mean temperature. In transition months (warm and cold days mixed) the result is slightly too low, while ignoring solar and internal gains makes it too high.",
  "OC-ZALOZENIE-TEMP-STREFY": "Design outdoor temperature for climate zone {strefa}: {te} °C (PN-82/B-02403, Table 1 — the national annex of PN-EN 12831 gives the same values).",
  "OC-ZALOZENIE-DOBA-PRZY-TE": "Heat per day = heat loss × 24 h at the design temperature all day long (coldest design day).",
  "OC-ZALOZENIE-STALA-TEMP-PRZYLEGLYCH": "The temperature on the other side of ground-contact partitions and unheated spaces is constant, as you entered it, all year.",
  "OC-ZALOZENIE-COP": "Electric energy = heat ÷ COP, COP = {cop} (resistive heater, electric boiler: 1).",
  "COCWU-CWU-NIE-CIEPLEJSZA": "Hot water temperature ({tCwu} °C) is not higher than cold water temperature ({tZimna} °C) — check the entered data.",
  "COCWU-BRAK-MIESIECY-CO": "No monthly space-heating heat — on Screen 1 “Building heat loss” enter or insert from PVGIS the monthly mean temperatures. For now only domestic hot water is shown.",
  "COCWU-CWU-BEZ-STRAT": "Domestic hot water here is only heating the water. Tank standing losses and circulation losses come on top — the separate “Hot water system” screen covers them.",
  "COCWU-ZALOZENIE-LITRY": "Hot water: {litry} l per person per day (source: about {zrodlo} l/person/day; Module 2 gives the range 50–70 l).",
  "COCWU-ZALOZENIE-STALA-TEMP-WODY": "Cold water {tZimna} °C and hot water {tCwu} °C — constant all year (in reality mains or well water is colder in winter).",
  "COCWU-ZALOZENIE-CO-Z-EKRANU-1": "Space heating per day = the month's heat from Screen 1 “Building heat loss” ÷ days in the month (the month's average day, not the coldest).",
  "COCWU-ZALOZENIE-COP-CO": "Electricity for space heating = heat ÷ COP, COP = {cop}.",
  "COCWU-ZALOZENIE-COP-CWU": "Electricity for hot water = heat ÷ COP, COP = {cop} (resistive heater: 1).",
  "MT-NADPROZE-BEZ-IZOLACJI": "“{nazwa}”: an uninsulated window lintel is a constant heat leak — insulate it together with the wall.",
  "MT-PSI-OD-UZYTKOWNIKA": "Some Ψ values were typed by you — from a thermal bridge catalogue, the designer or the system sheet. The app does not check them (PN-EN ISO 10211 calculations are outside it).",
  "MT-PSI-Z-TABLICY-A2": "Ψ from PN-EN ISO 14683, Table A.2 — default values chosen for the worst case (typical accuracy 0–50 %, they usually overstate the loss). For heat loss only, not for assessing surface condensation. A detail from the design or a manufacturer's catalogue gives a more accurate result.",
  "MT-NIEZNANY-KOD": "Code “{kod}” is not in Table A.2 of PN-EN ISO 14683 — pick a detail from the list.",
  "MT-ZALOZENIE-TEMPERATURY": "Temperatures from Screen 1: inside {ti} °C, outside {te} °C (zone design value) — all bridges between the interior and outdoor air.",
  "MT-ZALOZENIE-WYMIARY": "Ψ must match how the partition areas on Screen 1 were measured: with external dimensions (as in EN 12831) corner Ψ can be negative. Ψ derived for internal dimensions overstates the loss when used with external dimensions.",
  "MT-ZALOZENIE-SYSTEM-E": "Ψ from Table A.2 for external dimensions (Ψe) — element areas on Screen 1 must be measured along the building's external outline.",
  "MT-ZALOZENIE-SYSTEM-OI": "Ψ from Table A.2 for overall internal dimensions (Ψoi) — element areas on Screen 1 measured on the inner faces of external walls, including the thickness of partitions.",
  "MT-ZALOZENIE-SYSTEM-I": "Ψ from Table A.2 for internal dimensions (Ψi) — element areas on Screen 1 measured inside each room, without the thickness of partitions.",
  "CRL-SKUTKI-KRYTYCZNE": "An overvoltage would endanger human life (e.g. life-support systems, medical equipment), public services, business activity (including a farm) or many people — then protection against transient overvoltages is mandatory without a risk calculation (HD 60364-4-443, 443.4).",
  "CRL-SPD-WYMAGANY": "CRL = {crl} — below 1000, so protection against overvoltages of atmospheric origin is required (HD 60364-4-443, 443.5).",
  "CRL-SPD-ZALECANY": "Recommendation, not a requirement of the standard: HD 60364-4-443 does not require an SPD on the network side here, but a type 2 SPD costs little compared with the equipment it protects — worth fitting.",
  "CRL-BRAK-LINII": "No supply lines (typical off-grid) — the CRL method gives no SPD requirement from the network side. This does not mean the installation is protected: the PV DC side and switching overvoltages remain.",
  "CRL-PRZEPIECIA-LACZENIOWE": "An installation with its own source (inverter, generator), energy storage or motors — the standard requires protection against switching overvoltages to be considered regardless of CRL (443.4).",
  "CRL-STRONA-DC-POZA": "CRL concerns the lines that supply the installation. Protection of the PV generator DC side is covered by separate requirements of HD 60364-7-712 — not included in this result.",
  "CRL-ZALOZENIE-F": "Factor F = {f} (Table 443.1: “for all installations”; the national choice of 1–3 for dwellings is not known to the app).",
  "CRL-ZALOZENIE-NIEZNANE-DLUGOSCI": "Part of the network lengths unknown — the missing {reszta} km taken as an LV overhead line, as 443.5 requires (most unfavourable).",
  "CRL-ZALOZENIE-OBCIECIE": "Only the first {limit} km of the network counted (1 km or up to the first SPD in the network). The order of sections from the building is unknown — the app keeps the highest-weight ones first (typical layout: LV at the house, MV beyond the transformer; conservative result). Give the order to count from the building.",
  "CRL-ZALOZENIE-OBCIECIE-OD-BUDYNKU": "Only the first {limit} km of the network counted (1 km or up to the first SPD in the network), from the building outward — in the section order you gave (D54).",
  "CRL-ZALOZENIE-NG-Z-TD": "Flash density from thunderstorm days: Ng = 0.1 · Td (HD 60364-4-443, 443.5 Note 2).",
  "ZS-ZALOZENIE-CENA-BALASTU": "Ballast price {cena} {waluta}/kg — the 1 {waluta}/kg hint is the project owner's value for self-cast blocks (not from a source or standard); you can enter your own.",
  "ZS-ZALOZENIE-SNIEG-MU1": "Snow: shape coefficient μ1 from PN-EN 1991-1-3, Table 5.2 — valid when nothing stops snow sliding off the lower panel edge.",
  "LP-SEZON-BEZ-MIESIECY": "You entered extra winter demand — also tick the months when you heat, so the app knows when to add it.",
  "LP-LIMIT-ZA-MALY-NAWET-LATO": "Even summer alone (June–August) needs {n} panels, and you can mount {limit}. Reduce consumption, find more space for panels or plan a permanent second energy source.",
  "LP-DEFICYT-POZA-OKRESEM": "With {n} panels the colder months will be short by about {kwh} kWh per year in total. This energy must come from another source: a generator, a boiler or fuel-fired heating (a diesel air heater draws little electricity) — or reduce winter consumption.",
  "LP-OKRES-BEZ-PRODUKCJI": "In one of the months of the period (months {od}–{do}) the panels produce nothing at this setting — no number of panels can cover this period.",
  "LP-ZALOZENIE-DNI-KALENDARZ": "Monthly demand = daily × number of days in the month of a non-leap year (the PVGIS typical year has 365 days).",
  "LP-ZALOZENIE-KAT-STALY": "Panels at a fixed tilt of {kat}° all year.",
  "LP-ZALOZENIE-STELAZ-REGULOWANY": "Adjustable rack: every month the panels are set to that month's best tilt (decision D26) — requires manual adjustment.",
  "LP-ZALOZENIE-LIMIT": "Mounting limit {limit} pcs — the 30 pcs hint is a practical ceiling given by the project owner, not a standard value; enter how many panels you can really fit.",
  "TVS-LICZBA-NIECALKOWITA": "{label} must be a whole number — you cannot mount part of a panel.",
  "TVS-NAPOR-WIATRU-TRACKERA": "A tracker catches a much larger wind load than a fixed rack and needs a stronger foundation. The source gives no formula for tracker wind load, so the app does not calculate it — have a structural engineer check the tracker foundation. Wind load and ballast of a fixed rack are on the “Golden mean” screen.",
  "TVS-ZERO-DODATKOWYCH-PANELI": "The tracker price does not buy even one extra panel — at these prices the tracker wins only because it costs less than one panel. Check that the tracker cost includes the mechanism and the foundation.",
  "TVS-ZYSK-TRACKERA-ZAKRES": "A tracker increases yield by {min}–{max}% (range from the source). The real gain depends on the tracker type and location, so tracker yield is shown for both ends of the range.",
  "TVS-DOKUPIENIE-W-DOL": "The number of extra panels is rounded down — the remaining money does not buy a whole panel.",
  "TVS-UZYSK-PANELU-STALY": "Every panel on the fixed rack gives the same annual yield — extra panels are at the same angle and unshaded.",
  "TM-ZASPA-ZACIENIA-DOLNE-OGNIWA": "Grass or snow drifts ({przeszkodaCm} cm) reach above the lower edge of the panels ({krawedzCm} cm) — the bottom cells will be shaded. Through the bypass diodes, shade on one row of cells can switch off a whole panel section. Raise the panels or mow/clear snow beneath them.",
  "TM-SNIEG-ZALEGA": "At {kat}° (below {prog}°) the risk of snow lying on the panels grows — in winter they may produce nothing until the snow slides off or you clear it.",
  "TM-SSANIE-OD-SPODU": "Angle {kat}° ({prog}° and above): suction from below can tear the panels off — consult a structural engineer about the fixings and foundation.",
  "TM-DACH-POZA-MODELEM-WIATY": "Rack on a flat roof: the app calculates wind as for a free-standing canopy. Above a building roof, especially near edges and corners, wind acts differently — this screen does not calculate that. It also does not check whether the roof can carry the ballast. Confirm both with a structural engineer.",
  "TM-WIATA-KAT-PONIZEJ-SAMOOCZYSZCZANIA": "The angle {kat}° is below the {min}–{max}° minimum needed for self-cleaning — rain will not wash off dust and leaves, and water may pool at the lower frame. Increase the canopy slope or plan regular cleaning.",
  "TM-WIATA-KAT-W-ZAKRESIE": "The angle {kat}° is within the {min}–{max}° range given as the minimum for self-cleaning. The source does not say which end of the range is enough — closer to {max}° is safer.",
  "TM-WIATA-ZERO-PANELI": "The panel does not fit on the roof surface in any orientation — check the canopy and panel dimensions.",
  "TM-POWIERZCHNIA-NIEZNANA": "The surface “{nazwa}” is not in the latest assessment from Module 1 — assess the surfaces again.",
  "TM-ZAKRES-REGULACJI-ODWROCONY": "The smallest adjustment angle ({min}°) is larger than the largest ({max}°) — swap the values.",
  "TM-MIESIACE-BEZ-DANYCH-WIATRU": "In {liczba} month(s) the rack stands at more than 30°, and for such angles PN-EN 1991-1-4 gives no wind force for a canopy. Ballast for these settings is unknown — the required ballast shown covers settings up to 30° only. Limit adjustment to 30° or consult a structural engineer.",
  "TM-ZALOZENIE-PION-VS-OPTIMUM": "Vertical compared with the best fixed angle at the same azimuth ({kat}°), found from PVGIS data — not with an assumed roof angle.",
  "TM-ZALOZENIE-NAPROMIENIOWANIE": "Comparison of plane irradiation (kWh/m²). Cell temperature and reflection losses at high angles of incidence are not included.",
  "TM-ZALOZENIE-ZE": "Wind reference height ze = {ze} m — lower panel edge above ground plus the rise h (PN-EN 1991-1-4, 7.3 (8)).",
  "TM-ZALOZENIE-PROG-SSANIA": "The source warns about suction from below “at an angle of ~45°” — a threshold of {prog}° is used.",
  "TM-ZALOZENIE-OCENA-M1": "Irradiation and the % score of each surface come from the assessment in Module 1, Screen 4 (PVGIS data, Scanner shading for roof planes).",
  "TM-ZALOZENIE-WYMIARY-POLACI": "Canopy dimensions are those of the roof surface in its own plane (along the slope), not the plan view.",
  "TM-ZALOZENIE-UKLAD-DWUBLOKOWY": "Layouts checked: all panels in one orientation, or the surface split once into two parts with different orientations. With unusual dimensions a layout with one more panel may exist.",
  "TM-ZALOZENIE-BEZ-SZCZELIN": "Panels laid without gaps. If clamps or rails need gaps or an edge margin, subtract them from the canopy dimensions.",
  "TM-ZALOZENIE-REGULACJA-CO-MIESIAC": "Angle changed once a month to the best one for that month, within the rack’s adjustment range {min}–{max}°.",
  "TM-ZALOZENIE-OS-NA-DOLNEJ-KRAWEDZI": "The rack pivots on its lower edge — its height above ground stays the same, and the upper edge rises by h = L × sin(angle). With a different pivot the heights will differ.",
  "KO-INWESTYCJA-I-PALIWO": "The investment cost is one thing, the fuel cost another. Check both — the ranking adds them up over the whole analysis period.",
  "KO-ZRODLO-NIEKOMPLETNE": "“{nazwa}” — data is missing, so this source is not in the ranking. Fill in the empty fields on its card.",
  "KO-PALIWO-STALE-BEZPIECZENSTWO": "“{nazwa}” — solid fuel: check the CO detector, distance from combustible materials and combustion air supply on the “Fire safety — solid-fuel heating” screen.",
  "KO-DREWNO-PRACA": "“{nazwa}” — the cost of wood does not include your work: splitting, drying, carrying and stoking.",
  "KO-NAGRZEWNICA-SPALINY": "“{nazwa}” — a fuel-fired heater produces exhaust containing carbon monoxide. The exhaust must lead outside with a tight seal, and the room needs a CO detector. Heaters of this type are designed mainly for vehicles — consult a chimney sweep before installing one in a dwelling.",
  "KO-OLEJ-GESTNIEJE": "“{nazwa}” — diesel thickens in frost (source: at {temperatura}°C it can prevent start-up). In winter use arctic-grade fuel and keep the tank warm.",
  "KO-PRAD-OFFGRID": "“{nazwa}” — you heat with electricity. Off-grid, the panels produce least in winter, so this power comes mainly from the battery or a generator. The “How many panels you need” screen shows the winter shortfall.",
  "KO-SPRAWNOSC-POWYZEJ-100": "“{nazwa}” — an efficiency of {sprawnosc}% is possible only relative to the net calorific value, in a condensing boiler. Check which calorific value the datasheet efficiency refers to.",
  "KO-ZALOZENIE-WPIS-UZYTKOWNIKA": "Calorific values, efficiencies, prices, COP and datasheet data — entered by you. The app’s source does not provide them.",
  "KO-ZALOZENIE-OKRES": "Analysis period: {lata} years (the source suggests a {zrodlo}-year ranking).",
  "KO-ZALOZENIE-CENY-STALE": "Fuel and electricity prices constant over the whole period — no inflation or tariff changes.",
  "KO-ZALOZENIE-ZWROT": "Payback calculated against the source cheapest to buy: “{nazwa}”.",
  "KO-ZALOZENIE-COP-OPOROWE": "Heater element, electric boiler and infrared panels: COP = 1 — all electricity turns into heat (source: electric boiler “COP=1”).",
  "KO-ZALOZENIE-GODZINY-NOMINALNE": "Operating hours and electricity of fuel-fired devices calculated at rated output (heat ÷ output). At lower output there will be more hours and more auxiliary electricity.",
  "NP-WARTOSC-UJEMNA": "The value entered cannot be negative.",
  "NP-SPALINY-CO": "A fuel-fired heater produces exhaust containing carbon monoxide. The exhaust must lead outside with a tight seal (also through the wall), and the room needs a CO detector. Heaters of this type are designed mainly for vehicles — consult a chimney sweep before installing one in a dwelling.",
  "NP-OLEJ-GESTNIEJE": "Diesel thickens in frost (source: at {temperatura}°C it can prevent start-up). In winter use arctic-grade fuel and keep the tank warm.",
  "NP-POBOR-PONAD-BATERIE": "The heater's own electricity ({wh} Wh per day) is more than the usable battery capacity ({pojemnosc} kWh). The battery will not last a day of running — you need supply from PV or a generator.",
  "NP-GODZINY-PONAD-DOBE": "At the entered heat output the heater would have to run {godziny} h per day — more hours than a day has. It cannot cover this demand on its own.",
  "NP-PRAD-TANSZY": "At the entered electricity price (and COP of electric heating) electricity is cheaper than the heater. The heater wins only above the break-even electricity price.",
  "NP-BRAK-CENY-PRADU": "No electricity price entered — the heater's own electricity is not priced and there is no comparison with electric heating.",
  "NP-ZALOZENIE-WPIS-Z-KARTY": "Heat output, fuel use, electric draw and start energy are entries from your heater's datasheet (for the chosen output setting) — the app assumes none of these numbers.",
  "NP-ZALOZENIE-PRACA-CIAGLA": "Running hours = heat ÷ heat output at the entered setting (continuous running at that output). With a lower output or thermostat cycling, hours, fuel and auxiliary electricity will differ — enter the data of the setting it really runs at.",
  "NP-ZALOZENIE-COP-OPOROWE": "Electric heating is calculated as resistive heating (element, boiler, panel): COP = {cop}, as in the heating cost comparison. For a heat pump enter its COP.",
  "PROGNOZY-ZALOZENIE-DANE-DEMO": "Demonstration data — eventually the screen will draw on the annual simulation engine and a live weather forecast.",
  "PROGNOZY-ZALOZENIE-PROBKOWANIE-3H": "Each point is the average power over its 3-hour window — energy = power × 3 h, summed over the points. This is 3-hour sampling, not the full hourly curve — indicative, not a detailed design.",
  "PROTOKOL-NIEZNANY": "At least one of the devices has an unknown/unclassified protocol — check the documentation of both devices; compatibility cannot be assessed automatically.",
  "PORTECH-POJEMNOSC-NIEDODATNIA": "The \"planned capacity\" field must be greater than zero.",
  "PORTECH-ZALOZENIE-BASELINE": "Capacity not given — comparison computed for {pojemnosc} kWh (\"per 1 kWh\" baseline).",
  "PORTECH-ZALOZENIE-SRODEK-CYKLI": "For technologies where the source gives a range of cycles, the midpoint of the range was used as the representative value.",
  "AUDYT-ZALOZENIE-DANE-DEMO": "Demonstration data (SAMPLE_AUDIT_ITEMS) — eventually the screen will draw live from Modules 8/9/13.",
  "KROK-POZA-KOLEJNOSCIA-ROZRUCH": "A step was checked out of order — confirm the earlier steps first, a wrong start-up order can damage equipment.",
  "KABLE-OLOW-ZALOZENIE-ECHO-M5": "Cable and fuse sizing computed by echoing the same calculators as Module 5 (Screen 1 and Screen 6) — the battery chemistry (lead-acid) does not enter the formula, only the input values.",
  "OPD-ZALOZENIE-BRAK-TABELI-IP": "The list of required IP ratings by installation location (from the source content) is NOT built — the source gives no location→IP table for this screen.",
  "OZNAKOWANIE-ZALOZENIE-KOLORY-ZYL": "Conductor colours (e.g. green-yellow PE, blue N) are NOT given here — they are standardised by IEC 60446, not PN-EN 60445 (that standard gives only the alphanumeric/graphical codes of Table 1).",
  "PUSZKI-ZALOZENIE-BRAK-LISTY-Z-TRAS": "The automatic list of connection points from the routes (Screen 19) is NOT built — Screen 19 has no route data model, so the list cannot be generated without inventing a structure.",
  "SZYNY-ZALOZENIE-BRAK-DOBORU-PRZEKROJU": "Busbar cross-section sizing by short-circuit withstand (upper section D of the source) is NOT built — the source gives no formula/table.",
  "KAT-ZAKRES-PRZEJSCIOWY": "The source gives no unambiguous classification for this angle range.",
  "CZYSNIEG-KAT-ZALEGANIE": "Angle <{max}° — water and dirt will linger on the panel.",
  "CZYSNIEG-KAT-PRZEJSCIOWY": "Range {min}–{max}° — the source gives no unambiguous classification for it (data gap, we do not guess).",
  "CZYSNIEG-KAT-SPLUKIWANIE": "Angle {min}–{max}° — rain naturally washes the dust off.",
  "CZYSNIEG-KAT-ZSUWANIE": "Angle >{min}° — snow and leaves slide off more easily on their own.",
  "CZYSNIEG-POWOD-PONIZEJ-PROGU": "Production drop ({spadek}%) is below the {prog}% threshold — cleaning is not needed.",
  "CZYSNIEG-POWOD-DESZCZ-ODROCZONE": "Threshold exceeded, but the coming rain will naturally wash the panels — recommendation postponed.",
  "CZYSNIEG-POWOD-MYCIE": "Production drop ({spadek}%) exceeds the {prog}% threshold and no rain is expected in the coming days.",
  "CZYSNIEG-ZALOZENIE-PROG-MYCIA": "Cleaning threshold taken as the midpoint of the source range “loss >5–10%” = {prog}%.",
  "KATSTOPNI-POZA-ZAKRESEM": "Panel tilt angle must be within {min}–{max}°.",
  "SPADEKPRODUKCJIPCT-POZA-ZAKRESEM": "Production drop must be within {min}–{max}%.",
  "IZOL-GRUBOSC-NIE-ZWRACA-SIE": "{nazwa} {grubosc} cm: the extra centimetres over the thinner variant cost {krancowy} {waluta} per saved kWh — more than the heat price of {cena} {waluta}/kWh. With too thick insulation the cost of each additional centimetre stops paying back.",
  "IZOL-BRAK-SEZONU-GRZEWCZEGO": "No month is colder than the indoor temperature — this model has no heating season, so insulation saves nothing. Check the monthly temperatures on Screen 1.",
  "IZOL-ZALOZENIE-WARSTWA-SZEREGOWA": "U after insulating = 1/(1/U + d/λ): the new layer adds its resistance to the existing element (surface resistances are already contained in the current U). Without mechanical fixings, gaps and bridges at layer joints — the real U will be somewhat higher.",
  "IZOL-ZALOZENIE-10-LAT": "Cost-effectiveness over {lata} years (horizon from the source): insulation cost ÷ heat saved in that time, with no price changes and no discounting.",
  "IZOL-ZALOZENIE-CIEPLO-NIE-PRAD": "The saving is heat (kWh of heat), calculated from the same monthly means as Screen 1. Electricity saved by a heat pump = heat ÷ COP.",
  "DBS-ZALOZENIE-BEZ-DOLADOWANIA": "The battery starts fully charged and gets no charging at all during this time (panel, alternator, grid) — every sunny day extends the result.",
  "DBS-ZALOZENIE-BEZ-KOREKTY-TEMPERATURY": "No temperature correction — in frost a battery delivers less energy than its rating, so in winter the result will be lower (see Module 4: batteries in frost).",
  // M12 — screens built 30.09.2026 (E4, E16, E35 and later)
  "M12-WARTOSC-UJEMNA": "The value entered cannot be negative.",
  "M12-PROCENT-POZA-ZAKRESEM": "A percentage must be between 0 and 100%.",
  "AS-ROZRUCHOWY-NIE-DO-GLEBOKIEGO": "A starter battery is built for a short, strong pulse when cranking the engine, not for a long, slow discharge. Deep discharge shortens its life — an AGM or gel battery is better for powering devices.",
  "AS-ROZRUCHOWY-PONAD-UZYTECZNA": "You plan {planowany} h, but the starter battery reaches its safe discharge limit after about {czas} h. Beyond that you risk not being able to start the engine and permanently damaging the battery. Shorten the runtime, reduce the load or use a separate battery for the devices.",
  "AS-PONAD-UZYTECZNA": "You plan {planowany} h, but the usable share you entered runs out after about {czas} h. Running longer means a deeper discharge than you assumed — a shorter battery life.",
  "AS-ZALOZENIE-MOC-Z-AKUMULATORA": "Power is the draw from the battery. For 230 V devices on an inverter, add its losses (enter a power higher by the inverter losses).",
  "AS-ZALOZENIE-BEZ-TEMPERATURY": "No temperature correction — in frost the battery delivers less, so the real runtime will be shorter.",
  "MA-PRAD-URZADZENIA-PONAD-MAKS": "{nazwa} draws about {prad} A, while the battery (BMS) delivers at most {maks} A continuously — it may cut the power or overheat the connections. Check the battery datasheet before connecting.",
  "MA-PRAD-RAZEM-PONAD-MAKS": "All devices together draw about {prad} A — more than the {maks} A the battery delivers continuously. Do not switch them on at the same time.",
  "MA-ZALOZENIE-PELNY-AKUMULATOR": "Starting from a fully charged battery, with no charging along the way (e.g. from a panel).",
  "AP-DROGIE-PALIWO": "Energy from a generator means expensive fuel. Use it only to top up the battery or to run large loads briefly — not as a permanent source.",
  "M12-GODZINY-PONAD-DOBE": "A day has 24 hours — enter hours per day between 0 and 24.",
  "AP-ZALOZENIE-STALE-OBCIAZENIE": "Constant load and constant fuel consumption throughout the running time — as you entered them from the generator datasheet.",
  "SP-NIGDY-SIE-NIE-ZWROCI": "The set costs more up front and saves nothing per year (its upkeep costs as much as the grid power or more) — the extra outlay never pays back.",
  "SP-SPADEK-NAPIECIA-KABLA": "A long extension cord means voltage drop and cable heating — size the cross-section for the length and load (Module 5), and lay a buried cable as a direct-burial type, in a conduit.",
  "SP-ZALOZENIE-BEZ-INFLACJI": "No inflation or energy price changes — today's prices over the whole horizon.",
  "SP-ZALOZENIE-ZESTAW-POKRYWA-ZUZYCIE": "The solar set covers the whole entered consumption — check its power and capacity on other Module 12 screens.",
  "SD-DIY-WYMAGA-WIEDZY": "A DIY set needs knowledge and work: a fuse at the battery, cable sizes matched to the current, solid connections. A badly built set is a fire risk — in a power station the manufacturer does this for you.",
  "SD-ZALOZENIE-TYLKO-MAGAZYN": "Compares energy storage only (price and mass per usable Wh) — convenience, warranty, service and expandability are described in the overview, not in the numbers.",
  "WK-BRAK-NA-POCHMURNY-POBYT": "Without sun the battery lasts about {dniAkum} days, while the stay is {dni} — on a cloudy weekend you will run out. Cut consumption, take a bigger battery or plan a recharge.",
  "WK-BRAK-NAWET-Z-PANELEM": "Even with the panel's average production you will be about {wh} Wh short by the end of the stay. A bigger panel, a bigger battery or lower consumption.",
  "WK-ZALOZENIE-PELNY-NA-START": "The battery is fully charged at the start of the stay.",
  "WK-ZALOZENIE-PANEL-SREDNIA": "The panel produces the average implied by the entered sun hours every day — on cloudy days it will be less.",
  "PU-PANEL-ZA-MALY": "Your {posiadany} W panel is too small — with the entered sun and yield at least {minimalna} W is needed. The device will drain the battery day after day.",
  "PU-POCHMURNE-DNI": "On cloudy days the panel produces much less than average — consider a bigger panel or a battery reserve for a few days.",
  "PU-ZALOZENIE-BILANS-DOBOWY": "Daily balance: the panel delivers during the day what the device uses over the whole day. Night operation needs a battery to store that energy.",
  "LPP-POWERBANK-NIE-LACZYC": "Do not connect solar power banks to each other or to other panels — they have a built-in controller. Charge each one separately.",
  "LPP-USB-NIE-LACZYC": "Panel USB outputs cannot be connected in series or parallel — there is a converter behind them. Connect each panel to a separate device or use panels with a DC output (MC4, XT60, Anderson).",
  "LPP-ZLACZA-NIEZGODNE": "The panel connector does not match the station input and you have no adapter. Do not force or rewire the plugs — buy a factory adapter with the correct polarity and current rating.",
  "LPP-ADAPTER-SPRAWDZ": "You connect through an adapter — before connecting, check polarity with a meter and make sure the adapter can carry the panels' current.",
  "LPP-ROZNE-PANELE": "The panels differ: in series the weakest panel limits the current, in parallel the lowest voltage limits it. You lose part of the power; it is best to combine the same model.",
  "LPP-SPRAWDZ-NAPIECIE": "Connectors are not everything: check voltage (adds up in series, rises in frost) and current (adds up in parallel) against the station input limits — the “Panel for a power station” screen.",
  "PBA-ZA-MALA-MOC-POWERBANKU": "The device draws {urzadzenie} W and the power bank delivers at most {powerbank} W — it will not run it. For such a load you need a battery with a converter.",
  "PBA-MOC-ZESTAWU-I-KOSZT": "The continuous power of a battery set is set by its converter (“Converters” screen); compare price and weight per 1 Wh on the “Station vs DIY set” screen.",
  "PBA-ZALOZENIE-PELNE-NALADOWANIE": "Both options start fully charged; solar charging during use is not added.",
  "BM-AKUMULATOR-ZA-MALY": "Your {posiadany} Ah battery is not enough — at least {minimalny} Ah is needed. It will last about {godzin} h; cut the loads or add capacity.",
  "BM-ROZRUCH-PRZETWORNICY": "The minimum converter is the sum of running powers. A fridge and pumps draw several times more at start — size the start-up margin on the “Converters” screen.",
  "BM-ZALOZENIE-BEZ-LADOWANIA": "The battery starts full; no charging during the whole blackout (no grid, sun or generator). Loads run on average as many hours per day as entered.",
  "AKK-AGM-ZA-GLEBOKO": "You plan to discharge the AGM to {dod}% — deeper than the {ref}% at which the typical cycle count is given. An AGM in a camper dies quickly when deeply discharged; check the cycle count for this depth in the datasheet.",
  "AKK-PRZEKROCZONA-MASA-AGM": "The AGM batteries weigh {masa} kg in total — more than the {zapas} kg payload reserve.",
  "AKK-PRZEKROCZONA-MASA-LFP": "The LiFePO4 batteries weigh {masa} kg in total — more than the {zapas} kg payload reserve.",
  "AKK-ZALOZENIE-PELNE-CYKLE": "The kWh cost assumes the battery completes all datasheet cycles at the entered depth of discharge (no calendar ageing or misuse).",
  "DK-PANEL-SIE-NIE-MIESCI": "The panel does not fit on any free section of the roof. Choose a smaller panel, reduce the margin or move a skylight.",
  "DK-SPRAWDZ-MOCOWANIE": "The result says what fits. Separately check roof load capacity, mounting (adhesive/spoilers), the cable gland and whether panels shade each other or are shaded by the A/C unit.",
  "DK-ZALOZENIE-JEDEN-MODEL": "All panels are the same model; one orientation per section (the better one). A mixed layout within a section can sometimes fit more.",
  "PK-ELASTYCZNY-BEZ-WENTYLACJI": "A flexible panel glued flat to the roof without a ventilation gap overheats, loses output and ages faster. If you can, leave a gap or choose a rigid framed panel.",
  "PK-SPRAWDZ-TEMPERATURE": "How much power you lose to heat depends on the temperature coefficient in the panel datasheet — calculate it on the “Effect of temperature on output” screen (Module 3).",
  "PK-ZALOZENIE-GWARANCJA-TRWALOSC": "Durability is measured by the maker's power warranty — real service life may differ, especially with poor mounting.",
  "AL-NAPIECIE-ZA-WYSOKIE": "The charging voltage of {napiecie} V exceeds the {max} V allowed for this battery type. Too high a voltage will destroy the cells — do not charge; change the setting or use a charger made for this chemistry.",
  "AL-NAPIECIE-ZA-NISKIE": "The charging voltage of {napiecie} V is below the {min} V this battery type needs — it will never be fully charged.",
  "AL-LIFEPO4-BEZ-DCDC": "An alternator will not fully charge LiFePO4 without a DC/DC charger, and the high current LiFePO4 draws can overload the alternator and the vehicle wiring. Use a DC/DC charger.",
  "AL-BRAK-POKRYCIA": "Driving and panels together do not cover the demand — about {wh} Wh per day is missing. Drive longer, add a panel or cut consumption.",
  "AL-ZALOZENIE-STALY-PRAD": "The alternator charges at a constant current for the whole drive; the final charging phase (current tapering near full) is not counted, so the real time to full is longer.",
  "PRZ-BEZ-PRZETWORNICY": "A {napiecie} V device can run directly from a {napiecie} V battery — no converter is needed. Just check the fuse and the cable size.",
  "PRZ-PRZETWORNICA-ZA-SLABA": "The converter/charger gives {posiadany} A, but the device needs about {wymagany} A — it will be overloaded. Choose a model with a higher output current.",
  "PRZ-ROZWAZ-SYSTEM-24V": "You are stepping the voltage up with a converter. If you often use higher-voltage devices, consider building the system at that voltage (e.g. two 12 V batteries in series = 24 V) — without converter losses.",
  "PRZ-FALOWNIK-ZA-SLABY": "The {posiadany} W inverter is weaker than the required minimum of {minimalna} W (total power × margin) — at full load it will shut down or overheat.",
  "PRZ-SZCZYT-ZA-MALY": "The inverter surge power of {posiadana} W is below the {wymagana} W starting peak — the motor device will not start and the inverter will trip.",
  "PRZ-SPRAWDZ-SZCZYT": "Check the inverter datasheet for its surge (peak) power — it must be at least {wymagana} W, otherwise motor devices will not start.",
  "PRZ-SPRAWDZ-KABLE": "Up to about {prad} A flows on the battery side — size the cables and fuse for this current (the “Protection for small systems” calculator).",
  "PRZ-ZALOZENIE-USB-5V": "Calculated for 5 V (USB without fast charging). With fast charging (USB PD/QC) the voltage is higher and the current lower — the power stays the same.",
  "PRZ-ZALOZENIE-ROZRUCH-POJEDYNCZO": "Devices do not start at the same time — the peak is calculated for the start of the single most demanding device while the others run.",
  "PRZ-ZALOZENIE-BRAK-KROTNOSCI": "No starting multiple was entered for some devices — calculated without a start surge (1×). Check the device datasheet; motors and compressors draw several times more at start.",
  "KZ-AKUMULATOR-ZA-MALY": "Your {posiadany} Ah battery will keep the load running for only about {h} h — the required time needs at least {minimalny} Ah.",
  "KZ-PANEL-NIE-POKRYWA": "The panel gives about {panel} Wh per day, while the load uses {doba} Wh — the battery will run down day by day. Winter will be worse.",
  "KZ-SWIATLO-PRZEZ-FALOWNIK": "Do not connect emergency lighting through a 230 V inverter — you lose energy and an inverter failure turns off the light. Use 12 V LED lamps powered straight from the battery.",
  "KZ-ROZRUCH-FALOWNIKA": "When the motor starts the inverter must briefly deliver about {szczyt} W — check its surge power on the datasheet (the “Converters and inverters” calculator).",
  "KZ-UWAGA-OSWIETLENIE": "Emergency lighting must work above all at night — it has to be simple and reliable.",
  "KZ-UWAGA-TELEFONY": "Charging phones through a 230 V inverter and a mains charger loses more energy than a USB charger powered straight from 12 V.",
  "KZ-UWAGA-ALARM": "An alarm must have backup power — otherwise it stops protecting during a power cut. The panel's built-in battery also needs recharging.",
  "KZ-UWAGA-ROZRUCH-SILNIKA": "A motor (gate drive, pump) draws several times more at start than while running — enter the start multiple from the device datasheet and choose a converter with margin.",
  "KZ-UWAGA-OGROD": "In winter there is less sun and the panel may not charge the battery — consider fewer lamps, shorter lighting or a bigger panel. Separate solar lamps can be simpler than one central system.",
  "KZ-UWAGA-FONTANNA": "Run the fountain during the day when there is solar surplus — running it at night from the battery wastes energy.",
  "KZ-UWAGA-WENTYLATOR": "In hot weather a fan runs longer than you think — enter the hours for the hottest days.",
  "KZ-UWAGA-OGRZEWANIE": "Without the circulation pump the boiler can overheat — it is a safety matter. When powered from an inverter, use a pure sine wave inverter, otherwise the pump will hum and may be damaged.",
  "KZ-UWAGA-ELEKTRONARZEDZIA": "230 V power tools need a large inverter and drain the battery quickly. Never connect 230 V tools directly to a 12 V battery — it is a different voltage.",
  "KZ-UWAGA-PRACA-CIAGLA": "24/7 operation needs continuous power — the panel must be oversized to recharge the battery on cloudy days too.",
  "KZ-UWAGA-BOJLER": "Heating water from a battery is a huge load — the heater will quickly drain a small battery.",
  "KZ-UWAGA-PRACA-ZDALNA": "Powering a laptop through a 230 V inverter loses energy — a USB-C PD charger powered straight from 12 V is better.",
  "KZ-UWAGA-LODOWKA": "A fridge runs in cycles — enter the real compressor running hours, not 24 h. The compressor draws several times more at start — the inverter needs surge headroom. In summer a fridge without power loses its cold quickly.",
  "KZ-UWAGA-BRAMA-GARAZOWA": "Test the emergency gate opening before a power cut, not during one. Also check the manual release of the drive.",
  "KZ-ZALOZENIE-ROWNOMIERNY-POBOR": "Daily consumption spread evenly over the backup time (E × T ÷ 24); battery full at the start, no charging during backup.",
  "LKK-GASNICA-MIERNIK": "Do not forget a fire extinguisher and a voltage meter — they are the basis of safety for any system on a trip.",
  "LKK-ZALOZENIE-WIELKOSCI-Z-KALKULATOROW": "The list does not give battery capacity or panel power — size them in the calculators linked next to the items (e.g. “weekend” for the number of days). Quantities: one charger per phone, one torch per person.",
  "DG-ODLACZ-ZASILANIE": "A burning smell, melted insulation or discolouration mean overheating with a fire risk. Disconnect the battery immediately (isolator switch or remove the negative clamp) and do not switch the system on until the cause is removed.",
  "DG-BEZPIECZNE-POMIARY": "While measuring, never short wires or terminals — a battery short circuit risks fire and burns. Remove jewellery, use insulated tools; touch-test only disconnected parts.",
  "DG-NIE-ZNALEZIONO": "All simple steps came out fine — the cause lies outside this guide (e.g. a faulty controller, BMS, inverter). Contact an electrician or the manufacturer's service.",
  "DG-ZALOZENIE-KROKI-EKSPERCKIE": "Step order: from the most common and simplest cause to rarer ones. Steps based on installer practice ✅🤖 (the source gives the symptoms and a sample order), without numeric thresholds — numbers are in the linked calculators.",
  "MED-PONIZEJ-MINIMUM-DOB": "Your battery will keep the device running for about {doby} days — less than the recommended {minimum}-day minimum for medical equipment. You need at least {ah} Ah or a second battery.",
  "MED-BRAK-ZAPASOWEGO-ZRODLA": "A medical device must never be left without power — always have a second, independent source (a second charged battery, a power bank approved by the manufacturer, a generator) and check it regularly.",
  "MED-SPRAWDZ-Z-PRODUCENTEM": "Confirm the power method (12 V DC input, pure sine wave inverter, approved adapters) in the device manual or with the manufacturer or doctor — this calculator computes energy and does not replace medical advice.",
  "MED-ROZWAZ-ZASILANIE-DC": "Powering through a 230 V inverter loses energy and adds one more part that can fail. If the manufacturer provides for 12 V DC supply (car cable), it is more reliable.",
  "MED-ZALOZENIE-BEZ-LADOWANIA": "Battery full at the start, no charging for {doby} days — it must last that long in case of a longer outage.",
  "UZF-URZADZENIE-ZABRONIONE": "“{nazwa}” ({moc} W, start about {rozruch} W) exceeds the {falownik} W inverter (peak {szczyt} W) — do not connect it. Drop this device or use a larger inverter.",
  "UZF-START-NA-PRZECIAZENIU": "“{nazwa}” starts only thanks to the inverter's overload capacity — every start stresses it, and with other devices on it may trip. Consider a larger inverter.",
  "UZF-ROZRUCH-NIEZNANY": "No start multiple was entered for “{nazwa}” — the start cannot be checked. Check the device datasheet or measure with an inrush meter; until then treat it as risky.",
  "UZF-ZALOZENIE-KAZDE-OSOBNO": "Each device is rated separately, as the only load on the inverter. Several devices at once — the “Converters and inverters” calculator.",
  "BB-ZA-MALO-NA-BLACKOUT": "About {wh} Wh will be missing for the whole blackout — the station alone lasts about {h} h. Reduce the loads, add a second station or a panel.",
  "BB-PANEL-SIE-NIE-MIESCI": "The panel is wider than the available railing length — it will not fit. Choose a narrower panel or another spot.",
  "BB-BEZ-KLIMATYZACJI": "Do not count on air conditioning, a kettle or a heater during a blackout — a balcony kit only keeps the fridge, router, light and phones going.",
  "BB-MONTAZ-NA-BALKONIE": "A railing panel must be firmly bolted (wind!) and must not stick out beyond the balcony. Check the building rules — the facade often needs the manager's consent.",
  "BB-ZALOZENIE-SREDNIE-SLONCE": "Panel energy during the blackout is averaged: daily × blackout time ÷ 24. A short blackout at night gets no sun at all.",
  "SZ-ZALOZENIE-PUNKT-STARTOWY": "A template is only a starting point — a list of typical loads. You enter the powers and times; remove what you do not have, add what is missing.",
  "SZ-ZALOZENIE-PANEL-NA-DOBE": "The panel is sized to deliver the daily use in average sun — then a one-day battery is enough. On cloudy days you need a battery for the whole stay.",
  "TA-OBCIAZENIE-NIE-NIZSZE": "The voltage under load must be lower than at rest — check the measurement (was the load on, was the battery not being charged).",
  "TA-PONIZEJ-PROGU-WYRZUCENIA": "The rest voltage {napiecie} V is at or below {prog} V — such a lead-acid battery usually needs replacing. Recovery attempt: the “Rescuing a discharged battery” screen.",
  "TA-REZYSTANCJA-WZROSLA": "Internal resistance {r} mΩ is +{wzrost}% over the datasheet ({karta} mΩ) — above the {prog}% threshold. The battery has degraded; first check the terminals and cables (they add resistance too), then plan a replacement.",
  "TA-BRAK-ODNIESIENIA": "Result unclear — no load test or no datasheet resistance to compare with. Enter them or have a capacity test done in a workshop.",
  "TA-LIFEPO4-PLASKA-KRZYWA": "LiFePO4 has a flat voltage curve — the rest voltage says almost nothing about its state. Rely on the load test, BMS data or a capacity test.",
  "TA-ZALOZENIE-SPOCZYNEK": "Rest voltage measured after at least {h} h without load and without charging — earlier it reads too high or too low.",
  "TA-ZALOZENIE-POMIAR-NA-ZACISKACH": "Resistance computed from a measurement at the battery terminals — measuring further away adds the cables and contacts.",
  "RB-BRAK-BEZPIECZNIKA-AKUMULATORA": "No fuse at the battery! This is dangerous — a cable short can start a fire. Fit a fuse on the positive, as close to the terminal as possible, sized to the cable cross-section.",
  "RB-BEZPIECZNIK-WIEKSZY-NIZ-PRZEWOD": "Fuse rated above the cable ampacity! On overload the cable overheats and can catch fire before the fuse opens. Use a smaller fuse or a thicker cable — size them with the cables and fuses calculator.",
  "RB-NAPRAWA-DOBOR-BEZPIECZNIKOW": "Fuses to fix: the fuse rating must exceed the load current but not the ampacity of the cable it protects. Size them with the cables and fuses calculator.",
  "RB-NAPRAWA-PRZEKROJE-PRZEWODOW": "Cables to fix: check the cross-section for current and voltage drop (in a 12 V system every metre counts). A cable that is too thin heats up and lowers the voltage at the load.",
  "RB-NAPRAWA-OCHRONA-ROZLADOWANIA": "Add deep-discharge protection: a BMS (LiFePO4), a low-voltage disconnect (LVD) or loads on the controller's load output.",
  "RB-NAPRAWA-WENTYLACJA-AKUMULATORA": "Improve battery ventilation: lead-acid (especially flooded) gives off hydrogen when charging — it needs airflow and no sparks nearby; LiFePO4 must not overheat.",
  "RB-NAPRAWA-POLACZENIA": "Fix the connections: crimped lugs (not twisted wires), tightened to the right torque, secured against vibration and corrosion. A loose contact heats up and can cause a fire.",
  "RB-NIESPRAWDZONE": "{n} point(s) not checked yet — the report counts them as unsafe until you check them.",
  "RB-ZALOZENIE-SAMOOCENA": "The report is built from your answers — a self-assessment, not a substitute for an inspection by an electrician.",
  // end of M12 30.09.2026 block
  "LVD-BRAK-OCHRONY-OLOWIOWY": "A lead-acid/AGM battery without a low voltage disconnect, and the load has no protection of its own — the load will drain the battery to zero. Deep discharge permanently damages a lead-acid battery (sulphation). Fit a low voltage disconnect (LVD) with the threshold given above.",
  "LVD-PROG-KWASOWY-BRAK-W-ZRODLE": "No threshold is given for a flooded lead-acid battery — the source gives it only for AGM and LiFePO4. Check the cut-off voltage in the battery manufacturer's datasheet.",
  "WMI-WILGOC-CICHY-ZABOJCA": "Moisture is a silent killer of electrical installations — it causes corrosion, short circuits and damage to electronics.",
  "WMI-WILGOC-ZALECANE-IP65": "The IP55 minimum is met, but in a place exposed to moisture IP{zalecane} enclosures and junction boxes with a seal are recommended (your enclosure: IP{ip}). Run the cables in conduit. The source gives this example for a damp garage; the app applies it wherever there is moisture.",
  "WMI-ZALOZENIE-PROG-Z-M4-E10": "Minimum enclosure protection rating in a place exposed to moisture: IP{min} — the same threshold as in Module 4, Screen 10 (protection against moisture and condensation).",
  "WMI-NAMIOT-JACHT-PONIZEJ-IP65": "A tent or yacht needs an enclosure of at least IP{min} (yours: IP{ip}) — the risk is higher than in a garage or basement (rain, dew, spray, salty air). This is a practice adopted in the app, not a requirement of a standard.",
  "WMI-NAMIOT-JACHT-ZALECANE-IP67": "The IP65 minimum is met, but in a tent or on a yacht IP{zalecane} or IP68 enclosures are recommended (yours: IP{ip}) — resistant to flooding and temporary immersion. This is a practice adopted in the app, not a requirement of a standard.",
  "WMI-ZALOZENIE-PROG-NAMIOT-JACHT": "A tent or yacht is always treated as exposed to moisture. Minimum enclosure protection rating: IP{min} (higher than the general IP55 from Module 4, Screen 10, because the risk is higher), recommended IP{zalecane}–IP68 — a practice adopted in the app, not a standard.",
  "UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA": "The 230 V inverter enclosure is not earthed, or you don't know whether it is. A 230 V inverter must have an earthed enclosure — in a short circuit to the enclosure the current flows through the person who touches it (risk of electric shock). Connect the inverter's protective earth (PE) terminal to the vehicle earth or an earth electrode. The same PE conductor must connect all metal enclosures, the protective contacts of the sockets and the chassis (equipotential bonding) — this is the path the fault current takes back to the N–PE bond in the inverter.",
  "UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO": "The 230 V sockets have no protective contact connected, or you don't know whether they do. What the earth pin is for: it connects the metal casing of the plugged-in appliance (e.g. a kettle, a drill, a fridge — appliances with a plug that has a hole for the earth pin) to the protective conductor (green-yellow). What happens without it: when the insulation in such an appliance fails, its metal casing becomes live at 230 V and nothing signals it — current flows only through the person who touches it (electric shock). With the protective conductor connected, the fault current flows through that conductor and the protective device can disconnect the circuit. Connect the sockets' protective contacts to the vehicle earth or an earth electrode. Double-insulated appliances (double-square symbol, flat plug without an earth hole) do not need the protective contact.",
  "UMI-BRAK-POLACZENIA-N-PE": "The inverter has no N–PE bond, or you don't know whether it has one. Protection on an inverter does not need earth — it needs a closed fault loop back to the source: enclosure → protective conductor (PE) → N–PE bond point in the inverter → back to the inverter. Without this point a fault to the enclosure gives no large current, so neither the fuse nor the residual current device (RCD) will disconnect the circuit, and the enclosure may stay live. Check the manual: many inverters with a transfer switch make this bond themselves, with a relay, when there is no external supply. Make the N–PE bond only if the manufacturer allows it — never against the manual. A rod driven into the ground or a wire or chain hanging under the vehicle does not replace this bond.",
  "UMI-BRAK-RCD-30MA": "There is no 30 mA residual current device (RCD) after the N–PE bond, or you don't know whether there is one. A 30 mA RCD disconnects the circuit when part of the current escapes outside the live conductors — e.g. through the enclosure to PE or through a person. Protection of persons needs a 30 mA threshold. The RCD works only after the N–PE bond (see the N–PE bond question) — install it between the inverter and the sockets.",
  "UMI-PODWOJNE-POLACZENIE-N-PE": "With an external supply (campsite hook-up post, shore power) the inverter's N–PE bond is not opened, or you don't know whether it is. With a hook-up supply the protective conductor (PE) comes from the grid and the N–PE bond is already on the grid side — in the camper it must then be opened. Otherwise there is a double N–PE bond — PN-HD 60364-5-54 (543.4.3) calls such a reconnection of N to an earthed part “not permitted”. Part of the working current then flows through the protective conductor and the chassis, and the enclosures carry a voltage to earth. Typical symptom: the residual current device (RCD) on the hook-up post trips right after plugging in — don't look for a workaround, open the N–PE bond. Worse on an old post without an RCD: nothing trips, and if the PEN conductor in the grid breaks, all the return current goes through PE and the chassis, so the bodywork may carry a dangerous voltage. On a yacht, current in the protective conductor through the water also corrodes underwater parts and puts swimmers in the marina at risk of shock. Check in the manual whether the inverter's transfer switch opens the N–PE bond with a relay when an external supply is connected. Do not leave a fixed N–PE link while on hook-up power.",
  "UMI-NAMIOT-WYJSCIE-PLYWAJACE": "Tent, 230 V output without an N–PE bond (“floating”, not connected to earth) — most portable power stations are like this. A single fault (e.g. touching one conductor) then does not cause a shock, because the current has no return path; a second fault at the same time is dangerous. Rules: (1) do not earth such an output on your own if the manufacturer does not provide for it; (2) safest is one device per output — the standard knows this protective measure as “electrical separation”; (3) choose double-insulated devices (double-square symbol, flat plug); (4) use a portable 30 mA RCD (PRCD) between the station and the extension cord — note: with a floating output the RCD may not trip, depending on the station's design; check the manual, it is not a given; (5) keep equipment off the floor, not on a wet groundsheet, and connectors in IP enclosures (see the “Moisture protection — small installation” screen); (6) a tent peg works as an earth electrode only if the station's manual provides an earth terminal — otherwise it mostly gives a false sense of safety, like a hanging wire.",
  "UMI-NAMIOT-WYJSCIE-NIEZNANE": "Tent — you don't know what 230 V output the station or inverter has. Check the manual: most portable stations have a “floating” output (no N–PE bond), while an inverter with an N–PE bond needs a 30 mA RCD and a protective conductor to the enclosures. Until you check, follow the rules for a floating output: do not earth it on your own, one device per output (electrical separation), double-insulated devices, a portable 30 mA RCD (PRCD) between the station and the extension cord (with a floating output it may not trip — check the manual), equipment off the floor, connectors in IP enclosures. A tent peg works as an earth electrode only if the manual provides an earth terminal.",
  "UMI-KAMPER-WISZACY-PRZEWOD": "A wire or chain hanging under the camper is not earthing — it gives no protection against electric shock. Protection depends on the situation: (1) on an inverter you need a closed fault loop (PE equipotential bonding, an N–PE bond in the inverter, a 30 mA RCD), not earth; (2) on a campsite hook-up the protective conductor comes from the grid and the N–PE bond in the camper must be opened; (3) an earth spike driven into the ground makes sense on a longer stay as an addition — it does not replace equipotential bonding or an RCD.",
  "UMI-JACHT-POLACZENIE-W-JEDNYM-PUNKCIE": "Yacht — for information (rules per ABYC E-11 and ISO 13297, to be confirmed from the standard's text): on a yacht, “earth” is the water. It is reached through a metal hull or, with a laminate (GRP) hull, the engine block, keel bolts or a grounding plate, plus a common bonding bus. The AC protective conductor, the enclosures and DC negative are joined at one point. With an inverter: an automatic N–PE bond when the yacht is not connected to shore power, and an RCD (in marine terms, ELCI).",
  "UMI-JACHT-KEJA-SEPARATOR-GALWANICZNY": "Yacht on shore power — for information (ABYC E-11, ISO 13297 — to be confirmed from the standard's text): use a galvanic isolator or an isolation transformer. Without them, connecting the protective conductor to the shore causes galvanic corrosion of underwater parts: propeller, anodes, shaft.",
  "UMI-DC-BEZ-UZIEMIENIA-OCHRONNEGO": "A 12/24 V DC-only installation usually does not require protective earthing. If you add a 230 V inverter, choose “230 V from an inverter” — then earthing is required.",
  "UMI-WILGOC-ZALECANE-UZIEMIENIE": "Damp location (yacht, outdoors, tent) — earthing the installation is recommended, even for 12/24 V DC alone. Moisture promotes leakage currents and corrosion of connections. This is a warning, not a hard stop.",
  "UMI-ZALOZENIE-BEZ-UZIOMU-BUDYNKOWEGO": "Temporary or mobile installation — full building earthing (rod electrode, earth resistance) is not calculated here. For a permanent earth electrode see Module 5, Screen 9 (earthing design).",
  "UMI-ZALOZENIE-NIE-WIEM-JAK-NIE": "The answer “I don't know” is treated as “no” — the safe side. Check it (inverter nameplate and manual — including the N–PE bond, socket with an earth pin, 30 mA RCD in the distribution board) and correct the answer.",
  "LVD-ZALOZENIE-SKALOWANIE-SZEREGOWE": "The 12 V threshold from the source converted per cell and multiplied ×{krotnosc} — a higher-voltage battery is cells connected in series.",
  "LVD-ZALOZENIE-SPOJNE-Z-M4-E31": "LiFePO4: 2.75 V per cell — the same point as in Module 4 (cut-off voltage vs lifetime): about 80% DoD and about 5000 cycles.",
  "U12-TOLERANCJA-POZA-ZAKRESEM": "The device voltage tolerance must be within 0–99%.",
  "U12-MAKS-LADOWANIA-PONIZEJ-ZNAMIONOWEGO": "Max charging voltage {maks} V is lower than the nominal system voltage {system} V — that is impossible. Check that you entered the value for the whole system (e.g. 24 V → about 28–29 V), not for a single 12 V battery.",
  "U12-PRZEPIECIE-PRZY-LADOWANIU": "While charging the battery reaches up to {aku} V, but the device tolerates at most {urzadzenie} V — connected directly to the battery it may be damaged. Supply it through a regulator or a DC-DC converter.",
  "U12-ZA-NISKIE-PRZY-ROZLADOWANIU": "A discharged battery has about {aku} V, but the device needs at least {urzadzenie} V — towards the end of discharge it may switch off or work unreliably.",
  "U12-PRZEZ-STABILIZATOR": "Supplied through a regulator: check in its datasheet that the input range covers {min}–{max} V (the full working range of the battery).",
  "U12-ZALOZENIE-ZAKRES-AKU": "The real battery voltage is not a constant 12 V from the label: lower limit 11 V per 12 V (discharged), upper limit — the max charging voltage from your charge controller or charger settings.",
  "U12-ZALOZENIE-24V-SZEREGOWO": "A 24 V system is two 12 V batteries in series — lower limit ×2 (22 V).",
  "PST-PRZEKROCZONE-NAPIECIE-WEJSCIA": "In frost the panels will give up to {voc} V, but the station's solar input accepts at most {limit} V — the station will be damaged. Reduce the number of panels in series or connect them in parallel.",
  "PST-BLISKO-LIMITU-NAPIECIA": "In frost the panels will give {voc} V — above 95% of the station's input limit ({limit} V). It fits, but with no margin; a colder day than assumed will exceed the limit.",
  "PST-PRAD-POWYZEJ-LIMITU": "The panels' short-circuit current {isc} A exceeds the station's max input current {limit} A. Some stations limit the current themselves, some do not — check in the manual whether this connection is allowed.",
  "PST-SPRAWDZ-POLARYZACJE": "Before connecting, check the polarity of the adapter (e.g. MC4 → XT60/Anderson) — reverse connection can damage the station's input.",
  "PST-ZALOZENIE-VOC-W-MROZIE": "Open-circuit voltage rises in the cold — calculated for the lowest entered temperature with the same formula as the winter MPPT stress test (Module 3).",
  "PST-ZALOZENIE-PRAD-NIESPRAWDZONY": "Current not checked — enter the panel's Isc and the station's max input current to compare them.",
  "ZPU-GODZIN-PONAD-DOBE": "Operating time must be within 0–24 h per day.",
  "ZPU-WSPOLCZYNNIK-POZA-ZAKRESEM": "The duty cycle must be within 0–100%.",
  "ZPU-CYKLICZNE-REALNIE-MNIEJ": "{nazwa}: in reality about {realne} Wh per day, not {znamionowe} Wh as the rated power alone would suggest — the compressor does not run continuously.",
  "ZPU-ZALOZENIE-WSPOLCZYNNIK-ZALEZY-OD-TEMPERATURY": "The compressor duty cycle rises with ambient temperature and frequent opening — in hot weather consumption will be higher than for the entered value.",
  "GZ-PRZECIAZENIE-GNIAZDA": "The devices draw {prad} A together, but the socket fuse is {bezpiecznik} A (at most {mocMax} W) — the fuse will blow or, with an oversized fuse, the vehicle wiring will overheat. Disconnect some devices or supply large loads directly from the battery through a separate, fused cable.",
  "GZ-ZALOZENIE-NAPIECIE-ZNAMIONOWE": "Current calculated from the nominal voltage (12/24 V). With the engine running the voltage is higher and the current slightly lower — the result is on the safe side.",
  "GZ-ZALOZENIE-ROZRUCH": "Rated power, without inrush current — a compressor (fridge, tyre inflator) briefly draws more, so devices close to the limit may blow the fuse at start-up.",
  "RAM-KRYTYCZNIE-ROZLADOWANY": "{napiecie} V is below {prog} V — the battery is critically discharged. Do not charge it with an ordinary charger at full current: first assess sulphation, then use a charger with a recovery mode.",
  "RAM-LIFEPO4-ZMIERZ-OGNIWA": "LiFePO4: the recovery procedure is based on the voltage of each cell separately (the BMS may have cut off the pack) — measure the cells, not just the battery terminals.",
  "RAM-ZALOZENIE-ODSYLACZ": "This screen only points to the full procedures in the Battery assembly section — it does not repeat them, so that there are not three different versions of the same instruction.",
  "BK-OLOW-BEZ-WENTYLACJI": "A lead-acid (flooded/AGM) battery in a camper must be in a box vented to the outside — it releases hydrogen, and in a closed interior this is an explosion risk.",
  "BK-LIFEPO4-WEWNATRZ": "LiFePO4 can be mounted inside the living area, but it must be firmly fixed.",
  "LG-OLOW-BEZ-WENTYLACJI": "Charging a flooded/AGM battery in a closed garage risks a hydrogen explosion! Open the door or use mechanical ventilation.",
  "LG-LIFEPO4-BEZ-GAZOW": "LiFePO4 releases no gases — charging in a garage is safe as long as the charger is intended for this chemistry.",
  "MK-BEZPIECZNIK-NIE-CHRONI-KABLA": "The {przekroj} mm² section is below the minimum: the fuse must be at least {bezpiecznik} A, but this cable carries only {iz} A — under overload the cable will overheat before the fuse blows. Minimum: {wymagany} mm².",
  "MK-BRAK-PRZEKROJU-DLA-BEZPIECZNIKA": "No section in the table (up to 35 mm²) has a current rating of at least {bezpiecznik} A required by the fuse — split the circuit or move to a higher system voltage.",
  "MK-KOORDYNACJA-PODNIOSLA-PRZEKROJ": "Voltage drop and current rating alone would allow {zSpadku} mm², but a 1.25 × I fuse would not protect such a cable against overload — {przekroj} mm² selected.",
  "MK-POJAZD-WIBRACJE": "In a vehicle use a fuse certified for mobile applications (vibration), run the cables in protective conduit and do not use speaker wire for power.",
  "MK-ZALOZENIE-ECHO-M5": "The same calculators as Module 5: section (current rating per PN-HD 60364-5-52 + voltage drop including the return path, 2L) and a 1.25 × I fuse, checked against PN-IEC 60364-4-43 (433.2): I ≤ In ≤ Iz. Copper conductors.",
  "MK-ZALOZENIE-I2-NIELICZONE": "The second condition of the standard (fuse operating current I₂ ≤ 1.45 × Iz) needs data from the fuse datasheet — it is not checked here. Choose the nearest available fuse above the given minimum.",
  "MK-ZALOZENIE-PRZEWODY-INSTALACYJNE": "Current rating from the tables for PVC-insulated installation cables (e.g. H07V-K). Automotive cables (e.g. FLRY) have separate tables not included here — for those follow the cable manufacturer's data.",
  "POJC-ZALACZNIK-A-PRZYBLIZENIE": "Capacity calculated with the simplified method of EN ISO 13786, Annex A (effective thickness for daily variations). This is an approximation: the real active layer is 40–120 % of the assumed one, and for timber and aerated concrete the method may overstate the capacity. Do not plan frost protection with no margin on this time.",
  "POJC-ELEMENT-CIENSZY-NIZ-WARSTWA": "“{nazwa}”: the thickness of the whole element ({element} cm) cannot be smaller than the thickness of the massive layer ({warstwa} cm).",
  "POJC-GRANICA-NIEOSIAGALNA": "Without heating the house settles at about {rownowaga} °C — in this model it does not drop to {granica} °C.",
  "POJC-BRAK-WYCHLADZANIA": "The starting temperature {start} °C is not higher than the temperature the house tends to without heating (about {rownowaga} °C) — under these conditions the house does not cool down.",
  "POJC-GRANICA-NIE-NIZSZA": "The limit temperature {granica} °C must be lower than the starting temperature {start} °C.",
  "POJC-ZALOZENIE-JEDEN-WEZEL": "The whole house as one node at one temperature: exponential cooling θ(t) = θ∞ + (θ0 − θ∞)·e^(−t/τ), τ = C/H. Rooms by external walls will cool faster than the centre of the house.",
  "POJC-ZALOZENIE-BEZ-ZYSKOW": "No gains from the sun, people or appliances — in daytime the real drop will be slower, at night close to the result.",
  "POJC-ZALOZENIE-STALA-TEMP-ZEWN": "Outdoor and unheated-zone temperatures constant for the whole outage; losses H from Screen 1 (transmission + ventilation).",
  "POJC-ZALOZENIE-ZALACZNIK-A": "During cooling only the layer near the surface releases heat: active thickness = the smallest of: half the element thickness, the material thickness up to the first insulating layer, {dMax} mm (EN ISO 13786, Table A.1, 1-day period). Walls inside the house work from both sides. Surface resistance {rsi} m²·K/W included (formula A.4). The full mass of the elements is shown separately — it only works in cooling lasting many days.",
  // M14 „Dom – sieć” / „Firma – sieć” (lib/core/modules/siec, 28.09.2026).
  "SIEC-WARTOSC-UJEMNA": "The entered value cannot be negative (field: {pole}).",
  "SIEC-GRUPA-NIEZGODNA-Z-SEGMENTEM": "Group {grupa} does not fit this tile: a household is billed in G groups, a business in C groups.",
  "SIEC-GRUPA-NIEZGODNA-Z-MOCA": "Group {grupa} is not available at a contracted power of {moc} kW: C11/C12a/C12b up to 40 kW, C21/C22a/C22b above 40 kW.",
  "SIEC-STREFA-SPOZA-GRUPY": "Zone “{strefa}” does not exist in group {grupa} — enter consumption in this group's zones.",
  "SIEC-ENERGIA-MOCOWA-PONAD-ZUZYCIE": "Energy drawn on working days 7:00–22:00 cannot exceed the total annual consumption.",
  "SIEC-MIESIACE-NIEPOPRAWNE": "Monthly data must have 12 non-negative values (January–December).",
  "SIEC-BRAK-ZUZYCIE": "No consumption — enter annual consumption per zone from your invoices.",
  "SIEC-BRAK-MOCUMOWNA": "No contracted power — enter it from the contract or invoice.",
  "SIEC-BRAK-CENAENERGII": "No energy price — enter the net price from the seller's invoice (for every zone with consumption). The app has no default for it.",
  "SIEC-BRAK-OPLATAHANDLOWA": "No trading fee — enter it from the invoice (0 if there is none).",
  "SIEC-BRAK-SIECIOWAZMIENNA": "No variable network rate for this DSO and group in the 2026 tariff data — enter it from your invoice (“my invoice data”).",
  "SIEC-BRAK-SIECIOWASTALA": "No fixed network rate for this DSO and group in the 2026 tariff data — enter it from your invoice.",
  "SIEC-BRAK-ABONAMENT": "No subscription fee for this DSO, group and billing period in the data — enter it from your invoice.",
  "SIEC-BRAK-JAKOSCIOWA": "No quality rate for this date — enter it from your invoice.",
  "SIEC-BRAK-OZE": "No RES fee for this date — enter it from your invoice.",
  "SIEC-BRAK-KOGENERACYJNA": "No cogeneration fee for this date — enter it from your invoice.",
  "SIEC-BRAK-MOCOWA": "No capacity fee rate for this date — enter it from your invoice.",
  "SIEC-BRAK-ENERGIAMOCOWA": "No energy drawn on working days 7:00–22:00 — needed for the business capacity fee (invoice or DSO portal).",
  "SIEC-BRAK-VAT": "No VAT rate for this date in the data — enter your invoice data.",
  "SIEC-STAWKI-PO-WAZNOSCI": "The app's rates are valid until {waznoscDo} — they may be out of date, check your invoice.",
  "SIEC-STAWKA-NAJDLUZEJ": "The rate changes during the year (e.g. the quality rate from 1.02.2026) and no monthly consumption was given — the rate valid for the longest time was used.",
  "SIEC-BRAK-WARIANTOW": "Add at least one tariff group to compare.",
  "SIEC-GRUPA-POWTORZONA": "Group {grupa} is on the list more than once.",
  "SIEC-ROZNE-ZUZYCIE-WARIANTOW": "Annual consumption of the compared groups differs ({min}–{max} kWh) — the comparison is only fair for the same consumption split into zones.",
  "SIEC-HORYZONT-POZA-ZAKRESEM": "The horizon must be a whole number of years between {min} and {max}.",
  "SIEC-KOSZT-UJEMNY": "The annual cost cannot be negative.",
  "SIEC-SUWAK-POZA-LISTA": "The slider has only −3, 0, +5 and +10 %/year — sensitivity values, not a forecast.",
  "SIEC-INFLACJA-NIEPOPRAWNA": "Enter your own inflation in % per year (a number greater than −100).",
  "SIEC-POZA-PROJEKCJA-UE": "The EU projection ends in {rokOstatni} and the horizon reaches {rokKoncowy} — shorten the horizon or choose “Slider %”. The app does not extend the projection on its own.",
  "SIEC-UE-ZALOZENIA-2019": "The projection assumes policy as of end-2019. It does not include the 2021–2023 price crisis, Fit for 55 or ETS2. It is the official EU reference scenario, not a prediction of your bill.",
  "SIEC-ZRODLO-SCIEZKI-UE": "Price dynamics: European Commission, EU Reference Scenario 2020, Poland, average electricity price for final demand (constant prices, above inflation), read on {stanNa}. Geometric interpolation between the 5-year points; the €/MWh level is not used.",
  "SIEC-SUWAK-PONAD-INFLACJE": "Energy price change of {g} %/year above inflation — result in today's zloty (r = 0).",
  "SIEC-INFLACJA-FISHER": "Inflation {pi} %/year applied multiplicatively (Fisher): index = EU index × (1 + π)^t. The nominal sum is the amount to pay; ranking uses today's zloty.",
  "SIEC-ZALOZENIE-NETTO-VAT": "Net rates from 2026 tariffs, VAT {vat}% added at the end (excise is already in the energy price).",
  "SIEC-ZALOZENIE-NETTO": "Net amounts (without VAT).",
  "SIEC-ZALOZENIE-PRZEJSCIOWA-ZNIESIONA": "The transition fee was abolished on 1.01.2026 — it is not in the bill.",
  "SIEC-ZALOZENIE-ZRODLO-DANYCH": "Rates from the “rozliczenia-pl-2026” data file (primary reading of DSO tariffs and URE President notices, as of {stanNa}, valid until {waznoscDo}). Values entered from your invoice take precedence.",
  "SIEC-ZALOZENIE-MOCOWA-G-STALA": "The capacity fee in group G is a monthly flat rate by annual consumption threshold — counted as a fixed part of the “price of keeping the grid” (it changes only in steps at a threshold).",
  "SIEC-ZALOZENIE-POROWNANIE-TYLKO-TARYFA": "Comparison only with rates from the 2026 tariff data — groups without such data are excluded, not estimated. You give the zone split yourself for each group.",
  "SIEC-DEPOZYT-POZA-OKRESEM": "There is no 1.23 deposit coefficient in the data for this month (in force from 1.02.2025) — the calculator does not compute it.",
  "SIEC-DEPOZYT-WYKORZYSTANO-PONAD": "The amount used cannot exceed this month's deposit.",
  "SIEC-DEPOZYT-UTRATA-PRZY-ODEJSCIU": "Terminating the contract ends prosumer settlements — use the deposit balance before leaving the grid, otherwise it is lost except for the partial refund.",
  "SIEC-DECYZJA-JEDNOKIERUNKOWA": "Switching from RCEm to RCE and from net-metering to net-billing cannot be undone (RES Act, art. 4b(2b), art. 4d(1)).",
  "SIEC-DEPOZYT-ZALOZENIE-PODSTAWA": "RES Act (consolidated, Journal of Laws 2026 item 68): deposit = energy value × {wsp} (art. 4c(4)); unused part refunded at most {zwrot}% of the energy value (art. 4(11a)); the rest written off after 12 months (art. 4c(6)).",
  "SIEC-DEPOZYT-ZALOZENIE-UJEMNA-RCE": "Hours with a negative RCE count as 0 (art. 4b(2)(2)) — enter the average price with this rule already applied.",
  "SIEC-LICZNIK-ROZNICA-BEZ-WERDYKTU": "The difference is for information — the app does not know your meter's accuracy class, so it does not judge whether the meter is faulty. If in doubt, file a complaint and request a test.",
  "SIEC-LICZNIK-ZALOZENIE-JEDEN-ODBIORNIK": "The test makes sense when only a known load runs during the measurement (other circuits off) and you time whole pulses.",
  "SIEC-TGFI0-PONIZEJ-MINIMUM": "tgφ₀ cannot be lower than {min} (2026 DSO tariffs).",
  "SIEC-TGFI-CEL-NIE-PONIZEJ-TGFI0": "The target tgφ is not below tgφ₀ — the fee may remain after compensation. Choose a target with a margin below tgφ₀.",
  "SIEC-TGFI-CEL-NIE-MNIEJSZY": "The target tgφ is not lower than the current one — compensation is unnecessary.",
  "SIEC-PRZEKOMPENSOWANIE": "Beware of overcompensation: a capacitor bank without automatic regulation produces capacitive energy at night and at weekends, billed in full (not only the surplus).",
  "SIEC-MOC-BIERNA-CZY-DOTYCZY": "On low voltage the reactive energy fee applies only when the contract or connection conditions provide for it — check whether it is on your invoice.",
  "SIEC-MOC-BIERNA-ZALOZENIE-K": "Multiple k = {k} for low voltage (2026 DSO tariffs: Tauron, Energa, Stoen); formula with the square root as in the tariffs.",
  "SIEC-MOC-BIERNA-ZALOZENIE-CRK": "C_rk is the energy price announced by the URE President (art. 23(2)(18)(b) Energy Law), valid on the tariff approval day — not the price on your energy invoice. Enter it from the reactive energy invoice.",
  "SIEC-MOC-UMOWNA-TYLKO-C": "Contracted power surpluses are calculated for C groups (business), not for {grupa}.",
  "SIEC-PRZEKROCZENIA-GORNE-OSZACOWANIE": "Variant “sum of the 10 largest surpluses” without the 10 values in months {miesiace} — 10 × the largest surplus was used, i.e. an upper estimate of the fee.",
  "SIEC-NIEPELNY-ROK": "{n} of 12 months entered — the annual cost and optimal contracted power do not cover the missing months.",
  "SIEC-OPTIMUM-W-GRUPIE": "The optimal power is searched within your group's range (C1x up to 40 kW, C2x above) in 1 kW steps — moving between C1x and C2x changes the rates, compare them in the tariff comparison.",
  "SIEC-MOC-UMOWNA-STALA-TARYFA": "Fixed network rate {stala} zł/kW/month from the 2026 DSO tariff.",
  "SIEC-MOC-UMOWNA-STALA-FAKTURA": "Fixed network rate {stala} zł/kW/month from your invoice.",
  "SIEC-MOC-UMOWNA-WARIANT-SUMA10": "Fee = fixed rate × sum of the 10 largest power surpluses (15-minute measurement), for each month with a surplus.",
  "SIEC-MOC-UMOWNA-WARIANT-10XMAX": "Fee = fixed rate × 10 × the largest power surplus — when the metering cannot measure 10 surpluses.",
  "SIEC-PRZESUNIECIE-POZA-ZAKRESEM": "The load shift must be between 0 and 100%.",
  "SIEC-MOCOWA-STAWKA-URE": "Rate {stawka} zł/kWh net for energy drawn on working days 7:00–22:00 (URE President Notice No. 58/2025).",
  "SIEC-MOCOWA-STAWKA-FAKTURA": "Rate {stawka} zł/kWh from your invoice.",
  "SIEC-UDZIAL-POZA-ZAKRESEM": "The share in field “{pole}” must be greater than 0 and not more than 100%.",
  "SIEC-BILANS-MODEL-MIESIECZNY": "Monthly balance: storage shifts at most one full cycle per day — an upper estimate, not a day-by-day simulation. Runs of cloudy days are checked by the winter stress test (M7).",
  "SIEC-BILANS-NIEDOBOR-ZIMA": "Without the grid, about {kwh} kWh in total is missing in months {miesiace} — a generator must supply it, or PV/storage must grow, or consumption must drop.",
  "SIEC-BILANS-NIEDOBOR-POZA-ZIMA": "The off-grid shortfall also occurs outside winter: {miesiace}.",
  "SIEC-BILANS-ZALOZENIE-PVGIS": "PV production month by month from PVGIS data for your location and tilt (Module 3) — no fixed “winter = x% of summer”.",
  "SIEC-BILANS-ZALOZENIE-AUTOKONSUMPCJA": "Direct self-consumption {procent}% of PV production — your value (e.g. from the inverter app). Standard OSD load profiles are not in the app yet.",
  "SIEC-BILANS-ZALOZENIE-CYKL": "Storage: round-trip efficiency {sprawnosc}%, at most one full cycle of usable capacity per day.",
  "SIEC-TCO-D-BEZ-AGREGATU": "STOP: in scenario D, without the grid about {kwh} kWh per year is missing and there is no generator. The house will be left without power — add a generator or enlarge PV and storage.",
  "SIEC-TCO-D-ZALEZNI-MEDYCZNIE": "STOP: someone depends on powered medical equipment and scenario D has no redundant reserve (a second, independent source). A failure of the only source endangers life.",
  "SIEC-TCO-D-RYZYKOWNE": "D is risky: the generator runs up to {godziny} h a month, more than your threshold of {prog} h.",
  "SIEC-TCO-D-NIEODWRACALNE": "Full disconnection is practically irreversible: contract ended, meter removed, coming back means a new connection (DSO cost and time).",
  "SIEC-TCO-UTRATA-ROZLICZEN": "In scenarios C and D no energy is exported: you lose the prosumer deposit or discounts, and disconnecting within the project durability period may mean returning a subsidy — check the rules.",
  "SIEC-TCO-PRACA-ROWNOLEGLA": "Scenarios A and B run in parallel with the grid: the installation must be notified to the DSO and the inverter needs an NC RfG certificate (also with “zero export”).",
  "SIEC-TCO-C-PRZELACZNIK": "Scenario C needs a grid – 0 – island changeover switch with interlock (phases and N) — details on the “Grid/island switch and safety” screen.",
  "SIEC-TCO-WARUNEK-M7": "For C and D this is a monthly balance, not the winter stress test. Necessary condition for disconnecting: check a run of cloudy days, DoD and storage temperature on the “Winter without the grid” screen.",
  "SIEC-TCO-SALDO-OBCIETE": "Scenario {scenariusz}: the value of exported energy exceeds the variable cost of drawn energy — assumed you pay only the fixed charges (the deposit surplus is not paid out in full).",
  "SIEC-TCO-RF1": "Business continuity: the company tolerates at most {h} h without power. In that time a reserve must deliver at least about {kwh} kWh (average load × time — a lower bound), and D has no redundant reserve.",
  "SIEC-TCO-RF1-INFO": "Business continuity: {h} h without power acceptable — the redundant reserve must deliver at least about {kwh} kWh (average load × time — a lower bound; peaks are higher).",
  "SIEC-TCO-BRAK-SCENARIUSZY": "Enter the investment cost in at least one scenario (A, B, C or D).",
  "SIEC-TCO-ZALOZENIE-DYSKONTO": "Discount rate r = {r} %/year (0 = simple mode, no discounting).",
  "SIEC-TCO-ZALOZENIE-NADWYZKA": "The value of exported energy reduces only the variable cost of drawn energy, not the fixed charges; the price path applies to both alike. Exact deposit rules — the “Net-metering, net-billing, deposit” screen.",
  "SIEC-TCO-ZALOZENIE-REZYDUALNA": "Residual value counted only for storage, linearly by remaining life; storage replaced after each life period at the price of that year. PV and generator without residual value (conservative).",
  "SIEC-BRAK-KOSZTSTALY": "The “price of keeping the grid” (fixed charges gross per year) is missing — calculate it on the “My bill today” screen or enter it from the invoice.",
  "SIEC-BRAK-CENAZMIENNA": "The variable cost of 1 kWh drawn (gross) is missing — from the “My bill today” screen or the invoice.",
  "SIEC-BRAK-WARTOSCNADWYZKI": "The value of 1 kWh exported is missing — calculate it on the deposit screen (0 if you export nothing).",
  "SIEC-BRAK-ZYWOTNOSCMAGAZYNU": "Storage life in years is missing — from the datasheet (cycle count) or the storage screen (M4).",
  "SIEC-BRAK-OSOBYZALEZNE": "Answer whether anyone depends on powered medical equipment — scenario D is not assessed without it.",
  "SIEC-BRAK-DOPUSZCZALNYCZAS": "Company: enter the acceptable time without power (hours) — scenario D is not assessed without it (RF1).",
  "SIEC-BRAK-BILANS": "Balance data missing: with PV enter direct self-consumption, with storage — its efficiency.",
  "SIEC-BRAK-AGREGAT": "Generator fuel consumption (l/h) or fuel price is missing — needed for the cost of scenario D.",
  "SIEC-BACKFEED": "STOP: the island installation or generator can energise the DSO line — there is no switch with a 0 position and interlock. Line workers on a „dead” line risk electric shock. Required: a grid – 0 – island switch with mechanical interlock or an ATS with electrical and mechanical interlock.",
  "SIEC-PRZELACZNIK-N": "Phase conductors and neutral (N) must be switched according to the network system. Agree this with a licensed electrician; the normative detail (HD 60364-5-551) is still to be confirmed.",
  "SIEC-PRZELACZNIK-OK": "A switch with a 0 position and interlock (or an ATS with electrical and mechanical interlock) rules out connecting island and grid at the same time.",
  "SIEC-ROWNOLEGLE-BEZ-ZGLOSZENIA": "An inverter running in parallel with the grid without notifying the microinstallation to the DSO — also with „zero export”. Notify it (with an NC RfG certificate) before start-up.",
  "SIEC-PRZELACZNIK-NORMA-BRAK": "Detailed requirements for the switch and a generator feeding the installation are in HD 60364-5-551 — this standard is not in the app yet. Have the work and measurements done by a licensed person.",
  "SIEC-POWROT-NIEODWRACALNE": "Disconnection is practically irreversible: coming back means a new connection application, new conditions, a connection fee, months of waiting and a risk of refusal without technical conditions.",
  "SIEC-POWROT-WYCENA-INDYWIDUALNA": "Above the standard distance in the DSO tariff the fee is based on actual costs — an individual DSO quote. The app shows only the formula.",
  "SIEC-POWROT-ZALOZENIE-GRUPY": "Formula for connection groups IV–VI at the standard distance; net amount, rate from your DSO tariff.",
  "SIEC-POWROT-ZALOZENIE-CZAS": "Time to return is issuing connection conditions plus construction — usually months; the app gives no number.",
  "SIEC-BRAK-TRYBPRACY": "Choose how the installation meets the grid: switched, parallel or without the grid.",
  "SIEC-BRAK-PRZELACZNIK": "Choose the type of grid/island switch.",
  "SIEC-BRAK-MOCPRZYLACZENIOWA": "Enter the connection capacity (from the contract or connection conditions).",
  "SIEC-BRAK-STAWKAPRZYLACZENIOWA": "Enter the connection fee rate from your DSO tariff [zł/kW] — the app does not have it yet.",
  "SIEC-BRAK-ODLEGLOSC": "Indicate whether the distance to the grid is within the standard distance of the DSO tariff.",
  "SIEC-BESS-MOC-C1X": "In C1x groups the fixed charge depends on contracted power, but contracted power is changed by an application to the DSO — usually without storage. Power-charge reduction by storage is real mainly in C2x and with exceedances.",
  "SIEC-BESS-USLUGI-SYSTEMOWE": "System services (balancing market, capacity market) are practically unavailable to small storage without an aggregator — they are not counted as a benefit.",
  "SIEC-BESS-STRATNA-AUTOKONSUMPCJA": "Self-consumption earns {zysk} zł per kWh while storage wear costs {koszt} zł per kWh — the storage loses on this stream.",
  "SIEC-BESS-STRATNY-ARBITRAZ": "Arbitrage earns {zysk} zł per kWh while storage wear costs {koszt} zł per kWh — the storage loses on this stream.",
  "SIEC-BESS-MOCOWA-PONAD-PRZEPLYW": "Energy discharged during 7:00–22:00 cannot exceed all energy passed through the storage (self-consumption + arbitrage).",
  "SIEC-BESS-ZALOZENIE-MOCOWA-OSOBNO": "The capacity charge ({stawka} zł/kWh, working days 7:00–22:00) is counted separately — do not include it in the self-consumption and arbitrage gain.",
  "SIEC-BRAK-KOSZTCYKLU": "Missing cost of 1 kWh from storage — calculate it in „Storage cost analysis” (price, capacity, cycles, efficiency).",
  "SIEC-BRAK-ZYSKAUTOKONSUMPCJI": "Enter the gain per kWh from self-consumption (purchase price − value of exported kWh).",
  "SIEC-BRAK-ZYSKARBITRAZU": "Enter the price spread for arbitrage (expensive hours − cheap hours) [zł/kWh].",
  "SIEC-BRAK-PRZEPLYW": "Enter how much energy per year will pass through the storage (self-consumption or arbitrage).",
  "POMOC-UI-ARIA-POLE": "More information: {nazwa}",
  "POMOC-UI-DO-CZEGO": "What it is for",
  "POMOC-UI-GDZIE": "Where to find it",
  "POMOC-UI-ZAKRES": "Typical range",
  "MIGAWKA-UI-ARIA": "How this calculator works — explanation",
  "MIGAWKA-UI-PO-LUDZKU": "In plain words",
  "MIGAWKA-UI-FIZYKA": "Physics",
  "MIGAWKA-UI-JAK-DZIALA": "How it calculates",
  "MIGAWKA-UI-PO-CO": "Why it matters",
  "MIGAWKA-UI-WZOR": "Formula",
  "MIGAWKA-UI-ZALOZENIA": "Assumptions of the current result",
  "POMOC-UI-ZAMKNIJ": "Close",
  "WYNIK-UI-ZALOZENIE": "Assumption",
  "M6-WARTOSC-UJEMNA": "The entered value cannot be negative.",
  "M6-GODZINY-POZA-ZAKRESEM": "A day has 24 hours — enter hours per day from 0 to 24.",
  "M6-PROCENT-POZA-ZAKRESEM": "A percentage must be within 0–100%.",
  "M6-COP-POZA-ZAKRESEM": "COP cannot be below 1 — even a resistive heater turns 1 kWh of electricity into 1 kWh of heat. Enter the value from the datasheet.",
  "DYS-GRZEJNIKI-WYSOKOTEMP-POMPA": "Do not fit ordinary (high-temperature, {standard}) radiators on a heat pump — they need a high supply temperature and drastically lower the COP. Choose underfloor heating or larger low-temperature radiators ({nisko}).",
  "DYS-PODLOGOWE-BEZWLADNOSC": "Underfloor heating has a large thermal inertia — it does not react quickly to changes. In a low-inertia house it may overheat the rooms (see Screen 8 — thermal capacity).",
  "DYS-COP-TYLKO-POMPA": "The COP comparison applies to a heat pump. With another source (boiler, stove) the supply temperature does not change energy use in the same way — the screen only shows the system match.",
  "DYS-COP-NIE-WYZSZY": "The COP at the lower supply temperature ({cop}) is not higher than with standard radiators ({copOdn}) — check that both values come from the same datasheet at the same outdoor temperature.",
  "DYS-ZALOZENIE-COP-Z-KARTY": "Both COPs come from the same pump's datasheet at the same outdoor temperature — they differ only in the supply temperature.",
  "STREF-SILOWNIKI-ZJADAJA-ZYSK": "The actuators and controllers use {sterowanie} kWh/day, while zoning saves only {zysk} kWh/day of heating electricity — too many actuators raise electricity use. Balance the heating gain against the cost of powering the actuators (fewer zones, lower-power actuators, shorter powered time).",
  "STREF-STAN-USTALONY": "The saving is computed in steady state (Q = H·ΔT·t) — it is an upper estimate. The building mass, reheating the zone and heat flowing in from warmer zones reduce the real gain.",
  "STREF-BEZ-COP": "Non-electric heating (no COP entered) — the heat gain is shown; the balance against the actuators' electricity is not computed, since the heat does not come from electricity.",
  "STREF-OBNIZONA-POZA-ZAKRESEM": "Zone {n}: the setback temperature cannot be higher than the comfort one.",
  "STREF-ZALOZENIE-H-STREFY": "A zone's H is the part of the building heat loss (Screen 1) belonging to that zone; the zones' H add up to the building's H.",
  "ZAS-CWU-POZA-ZAKRESEM": "The hot water temperature must be higher than the cold water temperature.",
  "ZAS-NIEOGRZEWANE": "A tank in an unheated room (garage, basement) loses much more heat — now {strata} kWh/day. Move it into the heated part of the house or add insulation.",
  "ZAS-CYRKULACJA-UPROSZCZENIE": "Circulation pipe losses are counted only while the pump runs, with the pipe at hot-water temperature; the heat released by pipes cooling after the pump stops is left out. Uninsulated circulation pipes are a radiator you do not want.",
  "ZAS-ZALOZENIE-UA-Z-KARTY": "Standing loss UA [W/K] from the tank datasheet — it already covers insulation, connections, bottom and lid. Loss = UA × (water temperature − ambient temperature) × 24 h.",
  "GRZ-TEMPERATURA-POZA-ZAKRESEM": "The target temperature must be higher than the starting one.",
  "GRZ-PONAD-FALOWNIK": "A {grzalka} kW heater is a large load — larger than the inverter's continuous power ({falownik} kW). Check whether the inverter can carry it (together with other loads on at the same time) or choose a smaller heater.",
  "GRZ-Z-BATERII": "A fixed-power heater draws its power regardless of the sun — it will take {kwh} kWh from the battery. In winter it is better to top up with a heat pump or use a PV surplus controller.",
  "GRZ-PV-STALA": "The PV surplus is taken as constant for the whole heating time — in reality it changes with clouds and time of day.",
  "GRZ-ZALOZENIE-OPOROWA": "A resistive heater turns 1 kWh of electricity into 1 kWh of heat; tank losses during heating are left out (Screen 17).",
  "OSL-OKAP-ZIMA": "A fixed overhang protects in summer, but in winter it takes away valuable free heat gains — at winter noon it covers {pct}% of the window. Consider a shorter overhang or a movable shade (external blinds, awning) instead of a fixed one.",
  "OSL-TYLKO-GEOMETRIA": "Only the solar-noon geometry is computed, for a south-facing window and an overhang wider than the window. The app does not compute solar gains in kWh — that needs facade irradiance, the glazing g-value and a shading factor from a standard the app does not have (the same model as the windows screen, deferred). A horizontal overhang does not protect east and west windows — the sun is low there; a vertical or movable shade is needed.",
  "OSL-SZEROKOSC-POZA-MODELEM": "The model works for latitudes from {min}° to {max}°N — there the noon sun is always to the south and above the horizon in winter.",
  "OSL-ZALOZENIE-POLUDNIE": "Sun height at solstice noon: h = 90° − φ ± {delta}° (solar declination). The overhang's shadow reaches projection × tan h below the overhang.",
  "WPOR-DNI-POZA-ZAKRESEM": "A heating season cannot be longer than 366 days.",
  "WPOR-NATURALNA-SZCZELNY-DOM": "Natural ventilation in a new, airtight house is a straight road to mould — without leaks the stack effect will not exchange the air (check the airtightness test, Screen 12).",
  "WPOR-MECHANICZNA-NIE-OSZCZEDZA": "The fans will use more electricity than recovery saves on heating — balance {netto} kWh/day. Check the fan power and recovery efficiency, or compute for a colder day.",
  "WPOR-BEZ-COP": "Non-electric heating (no COP entered) — the heat saving and fan electricity are shown separately; no electricity balance.",
  "WPOR-ZALOZENIE-DOBA": "Computed for one day at the entered mean outdoor temperature; the season result = day × season days (colder and warmer days average out only if you enter the season mean).",
  "KOL-PLYCEJ-NIZ-PRZEMARZANIE": "A horizontal collector at {glebokosc} m is no deeper than the frost depth ({przemarzanie} m) — it will freeze and lose output. Lay the pipes below the frost depth.",
  "KOL-BRAK-PRZEMARZANIA": "Enter the laying depth and the frost depth — without them we cannot check whether the collector will freeze.",
  "KOL-GLEBOKOSC-NIETYPOWA": "A laying depth of {glebokosc} m is outside the typical {min}–{max} m. Shallower — freezing risk and weaker heat extraction; deeper — excavation cost grows.",
  "KOL-ODWIERT-NIETYPOWY": "A {glebokosc} m borehole is outside the typical {min}–{max} m — too deep a borehole raises cost faster than the gain. Check the borehole design.",
  "KOL-WSKAZNIK-SPOZA-ZRODLA": "The entered index {wartosc} is outside the source's {min}–{max} — the result uses your index; make sure it comes from a design for your soil.",
  "KOL-SPIRALNY-BEZ-WSKAZNIKA": "A spiral (basket) collector is a compact option when space is short — the source gives no sizing index, so no dimensions are computed. Size it from the manufacturer's data sheet.",
  "KOL-ZALOZENIE-MOC-POMPY": "The indices are applied to the heat pump power (as in the source), not to the ground extraction power P·(1 − 1/COP). Soil type and moisture are contained in the index you enter.",
  "ALT-KOMINEK-PRZEGRZANIE": "During a power cut the circulation pump stops — without gravity cooling (or a cooling coil) the fireplace system will overheat.",
  "ALT-IR-PUNKTOWE": "IR is spot heating. It will not replace full heating on a frosty night.",
  "ALT-MATY-STROP": "A ceiling with mats must be properly insulated, otherwise you heat the floor slab above.",
  "ALT-PCM-KOSZT": "PCM costs more than water — use it where space is short.",
  "ALT-KOCIOL-OSOBNY-EKRAN": "The electric boiler has its own screen comparing its cost with a heat pump — follow the link below.",
  "ALT-ZALOZENIE-KOMINEK": "Nominal fireplace power at continuous firing; water/room split by the share from the data sheet. Coverage is computed from the water output (goes to the system) and separately from the total power.",
  "ALT-ZALOZENIE-PCM": "Only latent heat at full melting is counted (V × ρ × L); PCM sensible heat is ignored. Water buffer: 1 l ≈ 1 kg, water specific heat, the entered temperature difference.",
  "DEFM-WARTOSC-UJEMNA": "The value entered cannot be negative.",
  "DEFM-MIESIACE-NIE-12": "Shortfalls must be given for 12 months (January–December).",
  "DEFM-PALIWO-PONAD-ZAPAS": "In month no. {miesiac} the generator runs about {godziny} h and uses about {litry} l of fuel — more than the entered stock of {zapas} l. Check the fuel stock and delivery plan.",
  "DEFM-SPRAWDZ-ZAPAS": "The generator runs longest in month no. {miesiac}: about {godziny} h, about {litry} l of fuel — check the fuel stock (enter it and the app compares month by month).",
  "DEFM-ZALOZENIE-WPISANE-DEFICYTY": "You enter the monthly shortfalls (e.g. Module 3 production minus Module 2 demand) — the day-by-day simulation (Screen 1) does not provide them yet. The generator supplies exactly the missing energy, without battery charging losses.",
  "DEFM-ZALOZENIE-DEFICYTY-Z-HISTORII": "Monthly shortfalls taken from a multi-year history: for each month the value at the chosen percentile (the median when no percentile is set) among the years in which that month has complete data. Months without complete data count as 0.",
  "DEFM-ZALOZENIE-HORYZONT": "Fixed horizon: the worst month prorated to the number of days (monthly shortfall ÷ days of the month in a non-leap calendar × number of days); the generator covers all the missing energy, with no PV beyond the month's average in that time.",
  "DEFM-ZALOZENIE-HISTORIA": "History analysis (data source: {zrodlo}): daily balance without an energy store — each day's shortfall = demand − PV production (not below 0), so this is an upper, safe-side bound. The worst window of every year (annual maximum), percentile by the nearest-rank method without interpolation. A missing day breaks the window and the streak and is never filled. Past seasons do not guarantee the future.",
  "DEFM-HISTORIA-POZA-ZAKRESEM": "Value outside the allowed range: {zakres}.",
  "DEFM-DANE-HISTORII-POZA-ZAKRESEM": "The history data is invalid: {powod}.",
  "DEFM-HORYZONT-PONAD-ZAPAS": "Over {dni} days in the worst month (no. {miesiac}) the generator uses about {litry} l of fuel — more than the entered stock of {zapas} l. The stock does not cover the chosen horizon.",
  "DEFM-HISTORIA-ZAPAS-ZA-MALY": "{okno}-day window: in the history the {percentyl}th percentile of the yearly worst windows needed about {litry} l of fuel — more than the stock of {zapas} l. The stock would have been enough in {lataPokryte} of {lata} years.",
  "DEFM-HISTORIA-MALO-DANYCH": "The estimate rests on {lata} year ({dni} days with data) — that is one observation, not a distribution. Add more years or measurements from the building and the range will narrow.",
  "DEFM-HISTORIA-PERCENTYL-TO-MAKSIMUM": "With {lata} years of data ({dni} days) the {percentyl}th percentile is simply the worst year — too little data to tell them apart. More years or measurements from the building will narrow the range.",
  "DEFM-HISTORIA-BRAK-PARAMETROW": "A history is entered but the average daily demand or the resupply window is missing — the history analysis was skipped.",
  "DEFM-HISTORIA-POMINIETE-LATA": "Years without a complete resupply window were left out: {lata}.",
  "DEFM-HISTORIA-BRAK-MIESIECY": "Months without complete data in any year (shortfall counted as 0): {miesiace}.",
  "CYK-DEFROST-DLUZSZY-NIZ-ODSTEP": "A defrost cannot last as long as the interval between defrosts or longer — check that the interval is the time from the start of one defrost to the start of the next.",
  "CYK-PONIZEJ-MIN-PRACY": "At {tZewn} °C the heat pump does not run (datasheet minimum: {tMin} °C) — backup heaters or another source heat the house then. Compute their power and electricity separately.",
  "CYK-POWYZEJ-ZAKRESU-SZRONIENIA": "At {tZewn} °C, above the source's typical frosting range of 5–{prog} °C, defrost is unlikely — the result uses the entered cycle, but check whether the pump defrosts at this temperature at all.",
  "CYK-ZALOZENIE-DOLICZONY": "Defrost energy is added on top of normal heating (the pump makes up the heat it did not deliver during defrost); heat taken from the building to melt the frost is ignored. You enter the cycle (interval, duration, power) from the datasheet or observation — the source gives no frosting model as a function of temperature and humidity.",
  "WGR-ZALOZENIE-WYMIANY": "You enter the number of air changes (airtightness test — Screen 12 — or a measurement) for the conditions of the day: stronger wind and a larger temperature difference increase the exchange. The source gives no formula for the stack effect from the number of chimneys and leaks. The heat recovery comparison assumes the same air flow.",
  "GWC-ZALOZENIE-PRZYROST": "You enter the air temperature rise in the GWC from the manufacturer's data or a measurement (thermometer before and after the exchanger) — the source gives no ground heat-exchange formula from length, depth and soil type. Only winter pre-heating is computed; the app does not compute summer cooling.",
  "GWC-ZALOZENIE-REKUPERATOR": "Behind a heat recovery unit the GWC is worth only (1 − efficiency) of the raw gain — the recuperator would recover the rest of that heat from the exhaust air anyway.",
  "OKNO-WARTOSC-UJEMNA": "The value entered cannot be negative.",
  "OKNO-SOC-POZA-ZAKRESEM": "The state of charge must be within 0–100%.",
  "OKNO-NIE-POKRYWA-ZUZYCIA": "The solar window does not even cover the house's current consumption — {brak} kWh short, nothing goes to the battery or the tank. Shift loads or count on the generator.",
  "OKNO-BRAK-NADWYZKI": "Nothing is left for surplus loads — run the washing machine and dishwasher on a sunnier day.",
  "OKNO-BOJLER-NIEDOGRZANY": "The tank only reaches {tKoniec} °C (target {tCel} °C). Do not top it up at night from the battery — use the next sun.",
  "OKNO-ZALOZENIE-KOLEJNOSC": "Order from the source: battery → hot water tank once the battery is above {prog}% → surplus loads. BMS heaters are counted before charging (a battery that needs heating will not accept charge); after the tank the battery charges to 100%. The house's consumption during the window is covered first.",
  "OKNO-ZALOZENIE-BEZ-STRAT": "No battery charging losses and no tank standing losses — all allocated energy is stored; in reality slightly less.",
  "OSAD-WARTOSC-UJEMNA": "The value entered cannot be negative.",
  "OSAD-POZA-ZAKRESEM": "The value must be within 0–{max}.",
  "OSAD-SNIEG-NIE-ZSUNIE": "At {kat}° (no more than {prog}°) snow will not slide off by itself. Consider manual clearing or a panel heating system.",
  "OSAD-SNIEG-MOZE-ZSUNAC": "At {kat}° (above {prog}°) dry snow may slide off by itself — faster on warmer panels. Leave room below the panels for the sliding snow.",
  "OSAD-MOKRY-PRZYKLEJA": "Wet snow sticks to the panels regardless of tilt — it is heavy and hard to remove.",
  "OSAD-LOD-BLOKUJE": "Glaze and frost block the light completely — production drops practically to zero, and ice will not slide off by itself.",
  "OSAD-SZADZ-NIE-ZSUWA": "Rime is worse than snow — it does not slide off and the fog keeps it from melting. The system will have to rely on the battery and the generator.",
  "OSAD-NIEROWNO-STRINGI": "Uneven snow cover on strings can cause voltage differences between them — check the mismatch (Module 3, Screen 17).",
  "OSAD-ZALOZENIE-DNI-I-PROCENT": "The source gives no melting or transmission model, so instead of asking for the days and the percentage the app shows a “what if” table for 1, 3, 5 and 7 days of cover. The production left under the deposit is a source example: snow and ice 0% (after 24 h of snowfall production drops to 0%; wet snow counted as snow), rime about 5% (after 48 h of fog). Source examples: at −5 °C snow stays for 3 days, 48 h of fog is 2 days. If you know your own numbers, enter them — they replace the examples.",
  "WPC-ULAMEK-POZA-ZAKRESEM": "This value must be a fraction from 0 to 1 (e.g. a window g-value of 0.5).",
  "WPC-POMPA-ZA-MALA": "After the change the house needs {zapotrzebowanie} kW and the pump gives {moc} kW — not enough on the design cold day.",
  "WPC-OGRANICZENIE-DEFICYT": "After the limit the pump gives {moc} kW while the house needs {zapotrzebowanie} kW — {brak} kW short. Too tight a limit means a cold house.",
  "WPC-FALOWNIK-PRZECIAZONY": "At {moc} kW of heat the pump draws {pobor} kW of electricity — more than the {falownik} kW inverter.",
  "WPC-ODWIERTY-ZA-MALO": "Variant {wariant}: the boreholes cover about {moc} kW, the pump is {pompa} kW.",
  "WPC-BUFOR-PRACA-CIAGLA": "The load equals or exceeds the pump power — the compressor runs non-stop, there are no starts to count.",
  "WPC-G-MOC": "Power to cover these losses: {przed} → {po} kW (change {zmiana} kW)",
  "WPC-G-RURY": "Pipe losses: {przed} → {po} kWh per day (change {zmiana} kWh)",
  "WPC-G-ZYSK-SEZON": "Solar gains over the season: {kwh} kWh of heat",
  "WPC-G-ZYSK-BYTOWY": "Internal gains on average: {kw} kW",
  "WPC-G-PRAD-SEZON": "Electricity for the same heat over the season: {przed} → {po} kWh (saving {oszczednosc} kWh)",
  "WPC-G-COP": "COP: {przed} → {po} (change {pct}%)",
  "WPC-G-COP-WIDELKI": "COP after the change by the source's rule: {min}–{max} (now {przed})",
  "WPC-G-DEFROST": "Defrost over the season: {kwh} kWh of electricity",
  "WPC-G-OGRANICZENIE": "Power after the limit: {kw} kW — running time {razy}× longer (+{pct}%)",
  "WPC-G-PRZEPLYW": "Circuit flow: {m3h} m³/h ({lmin} l/min)",
  "WPC-G-ODWIERTY": "Cost difference of variant B versus A: {roznica} {waluta}",
  "WPC-G-STARTY": "Compressor starts per day: without buffer {bez}, with buffer {z}",
  "WPC-W-ZAPOTRZEBOWANIE-PO": "House demand after the change: {kw} kW ({pct}%)",
  "WPC-W-ZAPAS-POMPY": "Margin of the {moc} kW pump: {zapas} kW",
  "WPC-W-U-PO": "U after insulating: {u} W/(m²·K)",
  "WPC-W-WENTYLATORY": "The fans add {kwh} kWh of electricity per day",
  "WPC-W-KUBATURA": "Volume: {przed} → {po} m³ ({pct}%)",
  "WPC-W-ZYSK-ZMIANA": "With the current shading {przed} kWh — change {zmiana} kWh over the season",
  "WPC-W-SREDNIA-MOC": "Season average: {kw} kW",
  "WPC-W-ZYSK-SEZON-BYTOWY": "Over the season ({dni} days): {kwh} kWh",
  "WPC-W-COP-ZMIANA": "COP change: {pct}% ({naStopien}% per °C)",
  "WPC-W-OSZCZEDNOSC-WIDELKI": "Electricity saved over the season: {min}–{max} kWh",
  "WPC-W-DEFROST-UDZIAL": "That is {pct}% of the pump's seasonal use",
  "WPC-W-POBOR-PRZED": "Electrical draw at full power: {kw} kW",
  "WPC-W-POBOR-PO": "Electrical draw after the limit: {kw} kW",
  "WPC-W-ENERGIA-ZMIANA": "Electricity for the same heat: {pct}%",
  "WPC-W-WARIANT-A": "Variant A: {liczba} × {glebokosc} m = {dlugosc} m, {koszt} {waluta}, about {moc} kW of pump ({zlNaKw} {waluta}/kW)",
  "WPC-W-WARIANT-B": "Variant B: {liczba} × {glebokosc} m = {dlugosc} m, {koszt} {waluta}, about {moc} kW of pump ({zlNaKw} {waluta}/kW)",
  "WPC-W-CYKL": "One cycle without buffer: {pracBez} min running + {postojBez} min off; with buffer: {pracZ} + {postojZ} min",
  "WPC-ZAL-STAN-USTALONY": "Power in steady state at the entered temperature difference, as on Screen 1; the entered house demand already contains the \"before\" state.",
  "WPC-ZAL-WYSOKOSC": "The volume (air change) and the wall area change; ceiling, floor and windows stay the same.",
  "WPC-ZAL-ZYSKI-SLONECZNE": "Q = A·g·H·(1 − shading): A is the glass area alone (no frame), H — the seasonal irradiation on the window plane.",
  "WPC-ZAL-ZYSKI-A-MOC": "Gains cut the seasonal use. The average power is energy divided by hours — it does not lower the pump's design power, because on the coldest night there are no gains.",
  "WPC-ZAL-COP-REGULA": "No COP after the change entered — range from the source's rule: each °C lower flow temperature gives +{min}–{max}% COP, linearly.",
  "WPC-ZAL-START-STOP": "The pump runs start/stop, without power modulation and without a minimum running time.",
  "WPC-ZAL-ODWIERTY-LINIOWO": "Borehole power = length × W/m (as on the ground collector screen); warmer ground deeper down is not counted — the source gives no model.",
  "ROZ-START-PONAD-SZCZYT": "The pump start with the other loads is {start} kVA while the source gives {szczyt} kW peak — it cannot carry the start. Use a soft starter or a stronger source.",
  "ROZ-SOFTSTART-PONAD-SZCZYT": "Even with the soft starter the start is {start} kVA while the source gives {szczyt} kW peak — a stronger source is needed, or switch other loads off during the start.",
  "ROZ-SOFTSTART-WYSTARCZY": "Without a soft starter the source could not carry the start; with it the start is {start} kVA and fits within {szczyt} kW.",
  "ROZ-PRACA-PONAD-MOC": "While running, the pump with the other loads draws {praca} kW and the source's continuous power is {moc} kW.",
  "ROZ-ZAL-KVA-JAK-KW": "The start apparent power (kVA) is compared with the kW rating as if cos φ = 1 — the datasheet has no power factor at start, and a lower one would only reduce the load, so the result errs on the safe side.",
  "ROZ-ZAL-AGREGAT-KOSZT": "Source: running the pump from a generator is expensive heating — the fuel cost is on the generator screen (Module 2).",
  "BAS-ZAL-BEZ-STRAT": "No losses while heating (evaporation, surface, walls) — the source names them but gives no model, so the real time and electricity will be higher, especially without a cover.",
  "DWHR-SPRAWNOSC-SPOZA-ZRODLA": "An efficiency of {pct}% is outside the typical {min}–{max}% given in the source — check the exchanger datasheet.",
  "DWHR-ZAL-ROWNOCZESNIE": "Only water draining while cold water flows to the heater (a shower) is counted — a bath filled earlier or a dishwasher gives almost nothing.",
  "CHL-PONIZEJ-ROSY": "The cooling flow {zasilanie} °C is at or below the dew point ({rosa} °C) — the floor or fan coil will sweat. Raise the flow temperature or fit a dew point sensor.",
  "CHL-ZAL-FREE-COOLING": "Free cooling is assumed to remove all the entered heat — the source gives no ground cooling capacity; only the circulation pump and compressor electricity are compared. It needs low-temperature distribution (underfloor, mats).",
  "DMP-DEFICYT": "At the design temperature the pump gives {moc} kW and the house needs {zapotrzebowanie} kW — {brak} kW is missing. You need backup heating (heater, stove) of at least {brak} kW or a bigger pump.",
  "DMP-DOGREW-NIEZNANY": "The warning level depends on whether the house has a backup heat source (heater, stove, boiler) — please fill in that field. With no backup heating, a pump power deficit is a 🔴 stop.",
  "DMP-ZAPAS": "The pump has a {pct}% power margin at the design temperature. The source gives no oversizing threshold — remember that the bigger the margin, the more frequent the starts in milder frost (count the starts on the buffer screen).",
  "DMP-BIWALENTNY-EKSTRAPOLACJA": "The balance point lies outside the two datasheet points — the line is extended, the result is approximate. Enter a datasheet point closer to that temperature.",
  "DMP-TEMPERATURY-POZA-ZAKRESEM": "Check the temperatures: the indoor temperature must be above the outdoor design temperature, and the second datasheet point must have a different temperature than the design one.",
  "DMP-ZAL-MOC-Z-KARTY": "Pump capacity at the design temperature from the datasheet table (at your flow temperature) — not the nominal A7 capacity, which is clearly higher than the real one in frost.",
  "DMP-ZAL-BEZ-STARTOW": "The screen does not compute starts per day from oversizing alone — the source gives no such model. Starts for a given water volume and hysteresis are computed in the buffer section (Screen 14).",
  "DMP-ZAL-LINIOWO": "Balance point: the load falls linearly to zero at the indoor temperature (losses as on Screen 1, no gains), the pump capacity linearly between the two datasheet points.",
  "TAN-NOC-Z-BATERII": "Running the pump at night from an off-grid battery is not the same as from the grid — expect discharge: at night the pump will draw {kwh} kWh, {kw} kW on average. Check that the battery and inverter can take it (low-voltage risk screen).",
  "TAN-BRAK-OSZCZEDNOSCI": "At these prices and COP, shifting the pump to the night does not lower the cost (difference {zl} {waluta} per day). The night zone is not cheap enough or the night COP is too low.",
  "TAN-BEZ-BUFORA": "Without a buffer (or without a buffer temperature swing) heat cannot be stored for the night — nothing is shifted. Enter the buffer volume and its usable temperature swing.",
  "TAN-BUFOR-NIE-POKRYWA-DNIA": "The buffer holds {bufor} kWh of heat and the house needs {dzien} kWh in the day zone — at night you shift only {pct}% of the daytime demand. A bigger buffer shifts more.",
  "TAN-NOC-Z-AGREGATU": "For night running from a generator, enter your real cost of 1 kWh from it (fuel, service) as the night price — the app does not know it.",
  "TAN-ZAL-CENY-OD-USERA": "You enter the electricity prices in both zones, the night zone length and the COP (from the contract, the operator's tariff and the pump datasheet). The app gives no prices or hours — they depend on the operator and the tariff group.",
  "TAN-ZAL-ROWNOMIERNE": "Daily heat spread evenly over 24 hours (the source gives no hourly demand profile). In reality demand is often higher in the morning and evening.",
  "TAN-ZAL-BEZ-STRAT-BUFORA": "Buffer heat losses over the day and COP changes in time are not computed — the source gives no such model, so the real saving will be somewhat smaller.",
  "TAN-ZAL-COP-NOC-ROWNY": "Night COP taken as the day COP because it was not entered. Night air is usually colder, so an air-source pump's COP is often lower — enter the night COP from the pump datasheet.",
  "KRZ-ROSNIE": "The curve gives a higher flow temperature in warmer weather — check that the points are not swapped. A heating curve lowers the flow temperature as it gets warmer outside.",
  "KRZ-OCENA-POZA-PUNKTAMI": "The comparison temperature lies outside the two curve points — the line is extended, the result is approximate.",
  "KRZ-TEMPERATURY-POZA-ZAKRESEM": "The two curve points need different outdoor temperatures.",
  "KRZ-ZAL-LINIOWO": "The curve as a straight line through two points (as in the source example) — controllers set slope and shift, a real curve may bend slightly.",
  "KRZ-ZAL-BEZ-GRZEJNIKOW": "The screen does not check whether the radiators or floor heating still deliver the required power at the lower curve — that needs the emitter characteristic (PN-EN 442, PN-EN 1264, not in the app). Lower the curve step by step and watch the indoor temperature — source: never below comfort.",
  "KRZ-ZAL-COP-REGULA": "COP after the change from the source's rule: every °C of lower flow temperature is +{min}–{max}% COP, linearly — use the datasheet COP if you know it.",
  "MSP-ZIMA-ZAPAS": "In winter the pump is the biggest load — {kwh} kWh of electricity in the worst month, {doba} kWh per day on average. Plan an energy reserve for it (battery, PV, generator).",
  "MSP-SCOP-NIZSZY": "The real SCOP {realny} is {pct}% below the catalogue {kat} — the catalogue assumes other conditions (climate, flow temperature) than your house.",
  "MSP-SCOP-WYZSZY": "The real SCOP {realny} is not below the catalogue {kat} — check that the monthly COPs come from the datasheet for your flow temperature and that winter months use the COP with defrost.",
  "MSP-ZAL-COP-MIESIACA": "Monthly COP from the datasheet at the month's mean temperature. Part-load COP drop, starts and off-grid voltage swings are not counted — the source lists them without a model. A month with frosting: enter the COP with defrost from Screen 6.",
  "MSP-ZAL-TYLKO-CO": "Space heating only — hot water has another COP (higher temperature), its electricity is on Screen 18.",
  "BPP-ZAL-BEZ-OSZCZEDNOSCI": "The screen does not compute the energy saving from fewer starts or the longer compressor life — the source gives only example percentages (15% and 10% for the same case), without a model. It computes starts, stored heat and standing losses.",
  "PRZ-PRZEPLYW-ZA-MALY": "The circulation pump gives {pompa} m³/h and the heat pump needs {wymagany} m³/h — the temperature difference rises to {dt} K. Too low a flow means a heat pump alarm and a freezing risk (source). A higher pump speed or a bigger circulation pump.",
  "PRZ-PONIZEJ-MINIMUM": "The flow {przeplyw} m³/h is below the heat pump datasheet minimum ({min} m³/h) — the pump will raise a flow alarm. Too low a flow is a heat exchanger freezing risk (source).",
  "PRZ-DT-SPOZA-ZRODLA": "The temperature difference {dt} K is outside the source example ({min}–{max} K) — check which ΔT your heat pump datasheet gives.",
  "PRZ-ZAL-BEZ-OPOROW": "The screen does not compute the pump head from pipe resistance or the upper flow limit (noise) — the source gives neither resistances nor a velocity limit. Read the circulation pump flow from its curve for your installation's resistance.",
  "CWP-PRZEGRZEW-GRZALKA": "Above {tmax} °C the heat pump does not heat — the heater adds {kwh} kWh. Source: heating water with the pump above about 60 °C is inefficient; leave the heater for the anti-legionella boost.",
  "CWP-Z-BATERII": "The PV surplus does not cover the pump's draw — {kwh} kWh will come from the battery. Source: without a PV surplus heating hot water with the pump (e.g. at night) loads the battery; heat the water in the hours of the largest surplus.",
  "CWP-ZAL-COP-SREDNI": "The hot-water COP is taken as constant over the whole heat-up — in reality it falls as the tank water gets warmer. Enter the average datasheet COP for this water temperature (source: lower than in space heating).",
  "CWP-ZAL-BEZ-PRIORYTETU": "The hot water / space heating priority is not computed: while heating water the pump does not heat the house. Tank losses during heating are ignored (Screen 17).",
  "GWP-TYLKO-WSPARCIE": "The GHE covers about {pct}% of the power the pump takes from the air — it is not a full heat source, only a support (source).",
  "GWP-ZAL-MIESZANIE": "The GHE air mixes with outdoor air at the evaporator intake: temperature rise = GHE rise × GHE flow / evaporator flow (mixing balance). When the GHE supplies the whole evaporator flow — the full rise. The brine-to-water variant is not computed.",
  "GWP-ZAL-COP-Z-KARTY": "The COP gain only from the pump datasheet (COP at the higher air temperature). The source gives no rule — its examples are +3 °C → +6% and 0 → 5 °C → +15%, i.e. 2 and 3 %/K.",
  "DSZ-UDZIAL-USTAWIENIA": "Defrost is {pct}% of the pump's seasonal consumption. Source: bad defrost settings can eat about 10% of the pump's energy — if your result is high, check the controller settings (interval, start condition) with the installer.",
  "DSZ-ZAL-BEZ-HARMONOGRAMU": "Scheduling defrost breaks for comfort is not computed — the source gives no model. You enter the weather scenarios and their days yourself (e.g. from regional weather data).",
  "RAP-ZAL-BEZ-KLASY": "The energy class (A, B, C…) and primary energy are not computed — the source gives no class thresholds or primary energy factors. What better insulation or windows bring is computed by the “factor impact” screen (Module 6). The yearly heat from Screen 1 does not subtract solar and internal gains.",
  "PLAN-NIE-SUMUJ": "The savings of the measures do not add up directly — after one measure the next saves less (e.g. after replacing the heat source every kWh of heat is cheaper). The sum is an upper bound; more precisely: compute each next measure on the “factor impact” screen with the state after the previous one.",
  "PLAN-ZAL-PROSTY-ZWROT": "Simple payback = cost ÷ yearly saving, at today's electricity price — without price changes, inflation, subsidies or cost of capital. Source: start with the cheapest and quickest improvements.",
  "PRZES-WARTOSC-UJEMNA": "Field “{pole}” cannot be negative.",
  "PRZES-GODZINA-POZA-DOBA": "Field “{pole}” must be an hour from 0 to {max}.",
  "PRZES-POZA-SIATKA": "Enter field “{pole}” in steps of {krokMin} minutes (e.g. 11.5 = 11:30).",
  "PRZES-TERMIN-PRZED-STARTEM": "“{nazwa}”: the “ready by” time ({do}) must be later than “earliest from” ({od}). The plan covers one day, without crossing midnight.",
  "PRZES-ZADANIE-POZA-OKNEM": "“{nazwa}” takes {czas} h and does not fit between {od} and {do} — widen the window or shorten the task. The plan never moves a task outside your window.",
  "PRZES-ZADANIE-BEZ-NADWYZKI": "“{nazwa}”: the forecast gives no PV surplus in your window — start at {start}, the whole task from the battery.",
  "PRZES-ZAL-PROGNOZA": "Forecast as on the Forecasts screen: a point every {krok} h is the average power over its window, so the surplus (production − base consumption) is constant within that window. Today these are entered or sample data — not a live weather forecast.",
  "PRZES-ZAL-KOLEJNOSC": "Tasks are placed one by one in list order — a task higher on the list takes the surplus first. On equal PV coverage the earliest start is chosen. 30-minute grid. Tasks may overlap — their combined power is not checked against the inverter here.",
  "PRZES-ZAL-BATERIA": "A task's energy above the PV surplus comes from the battery (or another source); charge and discharge losses are not counted.",
  "UPS-BRAK-PRIORYTETU": "The shedding plan needs a priority for: {nazwy}. The source ranks only the fire panel and ESP32 (kept to the end), the router and the actuators (cut first) — you set the rest.",
  "UPS-PROG-OD-RAZU": "The {prog} min threshold is longer than the whole run time at full load — shedding starts right after the power cut.",
  "UPS-AKUMULATOR-SLABY": "The UPS signals a weak battery — do not ignore it. In a real failure the backup may not work at all: check or replace the battery before the computed time means anything.",
  "UPS-ZAL-KOLEJNOSC": "Shedding order from the source: actuators first, then the router; the fire panel and ESP32 run longest. The plan assumes the controller can cut each level separately (separate outputs/relays).",
  "UPS-ZAL-PROG": "The next level is cut when {prog} min of run time are left at the current load — your threshold; the source gives only the example “the UPS will be empty in 10 minutes”.",
  "UPS-ZAL-FAIL-SAFE": "Cutting the actuators is safe only with fail-safe locks: no power = door open, never the other way round (Screen 3, evacuation door locks).",
  "AIZR-PRAD-OGRANICZONY": "Charging current limited from {mozliwy} A to {max} A — the cells are at {t} °C (limit from Module 4, Screen 12). Set this limit in the charger/BMS.",
  "AIZR-BEZ-TEMPERATURY": "Without the cell temperature and pack capacity the cold charging current limit is not checked — enter them from the BMS.",
  "AZIM-TEST-GENERATORA": "Generator test not done — do a trial start now, on a quiet day, not in the middle of a snowstorm when it is the only power source (cold start: Module 7, generator in frost).",
  "AZIM-TEST-WEBASTO": "Webasto test not done — run the heater before the season; a test planned but not done is still a gap.",
  "AZIM-PRZEGLAD-GRZEWCZEJ": "Heating system inspection not done — check the heat source and its power supply before the first frost.",
  "AZIM-ZAPAS-PALIWA": "Fuel stock not checked or too small — work out how much fuel the winter needs (Module 2, generator) and top up before the season.",
  "AZIM-GRZALKI-BMS": "BMS heaters not verified — check that they switch on in frost and where they take power from (Module 4, BMS heaters).",
  "AZIM-PALIWA-BRAKUJE": "Fuel stock below need: you have {zapas} l, you need {wymagany} l — {brak} l short.",
  "AZIM-ZAL-LISTA": "Five-item list 1:1 from the source (generator test, webasto test, heating inspection, fuel stock, BMS heaters). The “recommended minimum” of fuel has no number in the source — you enter the amount needed. This is not the Winter Safety Factor (Module 7) — that one is a risk index, this one is a task list.",
  "ANOM-ODCHYLENIE": "Deviation from expected: {pct}% ({kwh} kWh). Without an alarm threshold the screen does not judge whether this is an anomaly — enter a threshold if you want a verdict.",
  "ANOM-PV-SPADEK": "Production {pct}% below expected (threshold {prog}%) — check in turn: weather, dirt, snow, shade, and damage last.",
  "ANOM-ZUZYCIE-WZROST": "Consumption {pct}% above usual (threshold {prog}%) — check whether some device was left on or runs at odd hours.",
  "ANOM-ZUZYCIE-SPADEK": "Consumption {pct}% below usual (threshold {prog}%) — check whether a device (e.g. a pump, the fridge) has stopped working.",
  "ANOM-PRZYCZYNA-POGODA": "The weather explains the drop — the installation is fine, the expected production was computed for other conditions.",
  "ANOM-PRZYCZYNA-BRUD": "Likely cause: dirt on the panels — cleaning and whether it pays: Module 3, cleanliness and snow.",
  "ANOM-PRZYCZYNA-SNIEG": "Likely cause: snow on the panels — whether to clear it: Module 3, cleanliness and snow.",
  "ANOM-PRZYCZYNA-CIEN": "Likely cause: shade — check for new obstacles (Module 1, shading analysis).",
  "ANOM-PRZYCZYNA-USZKODZENIE": "The drop is not due to weather, dirt, snow or shade — likely damage (e.g. a string), an inspection of the installation is recommended.",
  "ANOM-ZAL-PV": "The expected production must be computed for the actual sunshine of this period (forecast, simulation or a reference measurement) — otherwise the deviation shows the weather, not a fault. The source's example figures (“20% lower”) are illustrations; the alarm threshold is yours.",
  "ANOM-ZAL-ZUZYCIE": "Expected consumption is your usual for the same period (e.g. the same weekday). The source's example “+40% at night” is an illustration; the alarm threshold is yours.",
  "WSP-WARTOSC-UJEMNA": "The value entered cannot be negative.",
  "WSP-SPOF-PONAD-LICZBE": "The number of components without redundancy ({spof}) cannot exceed the number of components checked ({n}).",
  "WSP-WAGI-SUMA": "The weights must add up to 100% — now they add up to {suma}%. Fix the weights or go back to the defaults.",
  "WSP-WAGI-WSTEPNE": "You are using the default weights: they are a PROVISIONAL proposal (the source gives no weights), accepted “for now” by the app owner and still to be reworked. The result is indicative — you can enter your own weights.",
  "WSP-WAGI-WLASNE": "You are using your own weights — the result depends on them, and the app does not judge whether they are right.",
  "WSP-SLABY-POKRYCIE": "Energy coverage: {wynik}% (weak-point threshold {prog}%). PV production in the worst month does not cover the demand — raise production (Module 3), cut consumption (Module 2) or count on the generator (Screen 2).",
  "WSP-SLABY-AUTONOMIA": "Autonomy time: {wynik}% (threshold {prog}%). The battery does not last the required days without sun — add capacity or cut consumption (Screen 4 “Blackout” computes how much is missing).",
  "WSP-SLABY-ODPORNOSC": "Resistance to failures: {wynik}% (threshold {prog}%). Some components are single points of failure — add redundancy or a bypass (Screen 10).",
  "WSP-SLABY-AGREGAT": "Generator power margin: {wynik}% (threshold {prog}%). The generator is too weak or missing — choose a bigger one (Module 2) and check its cold start (Screen 8).",
  "WSP-SLABY-REAKCJA": "Freeze reaction time: {wynik}% (threshold {prog}%). The installation protects against freezing for less time than you need to react — extend it (load shedding — Screen 6, stored heat — Screen 18) or shorten your reaction time.",
  "WSP-ZALOZENIE-MAPOWANIE": "The source does not say how to convert the values to percent — the ratio “what the system has ÷ what the scenario needs” is used, capped at 100% (excess is not rewarded): coverage = production ÷ demand in the worst month, autonomy = days of operation ÷ required days, resistance = share of components with redundancy, generator = power ÷ required power (no generator = 0%), reaction = freeze-protection time ÷ time needed to react. To be confirmed by the owner.",
  "WSP-ZALOZENIE-PROG": "A component below {prog}% is shown as a weak point. The source gives no threshold (its example: 74% = “good, but there are weak points”) — {prog}% is an assumed value.",
  "WSP-ZALOZENIE-WAGI": "The component weights (30/25/20/15/10%) are the assistant's proposal, accepted “for now” by the owner; the source only says that every component has a weight. To be reworked and recalculated by the owner.",
  "OSAD-ZALOZENIE-ODZYSK": "Gain from clearing = daily loss × (days of cover − hours of operation ÷ 24): after the given hours of operation the panels are clear and give their normal daily production. Simplifications: hours turned into a fraction of the day, heating only makes sense in daylight, no re-deposit. You enter the power (W/m² or W) from the datasheet — the app does not know it.",
  "OSAD-GRZANIE-NIE-ZWRACA-KABEL": "A heating cable on the panel surface will use {energia} kWh while the cleared panels recover only {odzysk} kWh at {dni} d of cover — the heating does not pay back. If you heat anyway, do it only on demand, from PV surplus or the generator, never from a low battery; first try clearing from the ground and a steeper tilt.",
  "OSAD-GRZANIE-NIE-ZWRACA-FOLIA": "A heating film on the back of the panel will use {energia} kWh while the cleared panels recover only {odzysk} kWh at {dni} d of cover — the heating does not pay back. If you heat anyway, do it only on demand, from PV surplus or the generator, never from a low battery; first try clearing from the ground and a steeper tilt.",
  "OSAD-GRZANIE-NIE-ZWRACA-AUTOMAT": "An automatic cleaning system will use {energia} kWh while the cleared panels recover only {odzysk} kWh at {dni} d of cover — the system does not pay back. If you use it anyway, do it only on demand, from PV surplus or the generator, never from a low battery; first try clearing from the ground and a steeper tilt.",
  "OSAD-OPCJA-NIEPELNA": "Only part of an option's data is entered (power, hours, and for the cable and film also the panel area) — the option is not evaluated.",
  "OSAD-GWARANCJA": "Modifications on a panel (cable, film, mounting a cleaning system) usually affect the manufacturer's warranty — check its terms first. Take the heating power from the datasheet, not from a guess.",
  // Etykiety pól w ostrzeżeniach zakresu (konwencja *Key: params.labelKey → {label})
  "POLE-SZEROKOSC-GEOGRAFICZNA": "latitude",
  "POLE-DLUGOSC-GEOGRAFICZNA": "longitude",
  "POLE-TEMPERATURA-MINIMALNA": "minimum temperature",
  "POLE-ALBEDO": "albedo",
  "POLE-KAT-POCHYLENIA": "tilt angle",
  "POLE-AZYMUT": "azimuth",
  "POLE-NACHYLENIE-POWIERZCHNI": "surface tilt",
  "POLE-AZYMUT-POWIERZCHNI": "surface azimuth",
  "POLE-MIESIAC-BEZ-LISCI": "leafless month",
  "POLE-WSCHOD-NACHYLENIE": "east slope — tilt",
  "POLE-WSCHOD-AZYMUT": "east slope — azimuth",
  "POLE-ZACHOD-NACHYLENIE": "west slope — tilt",
  "POLE-ZACHOD-AZYMUT": "west slope — azimuth",
  "POLE-UDZIAL-MOCY-WSCHOD": "share of power facing east",
  "POLE-WYSOKOSC-STELAZA": "rack height",
  "POLE-POWIERZCHNIA-PANELI": "panel area",
  "POLE-ZABUDOWA-PHI": "blockage under the rack φ",
  "POLE-MASA-PANELI-STELAZA": "Mass of panels and rack",
  "POLE-CENA-BALASTU": "Ballast price",
  "POLE-CENA-ENERGII": "Energy price",
  "POLE-MOC-INSTALACJI": "Installation power",
  "POLE-KAT-SPADKU-DACHU": "Roof pitch angle",
  "POLE-NOSNOSC-DACHU": "Roof load capacity",
  "POLE-GRUBOSC-WARSTWY-SNIEGU": "Snow layer thickness",
  "POLE-POWIERZCHNIA-PRZEGRODY": "Area ({przegroda})",
  "POLE-U-PRZEGRODY": "U-value ({przegroda})",
  "POLE-KUBATURA": "Building volume",
  "POLE-WYMIANY-POWIETRZA": "Air changes",
  "POLE-COP": "COP",
  "POLE-NAPIECIE-PAKIETU-BEZ-OBCIAZENIA": "Pack no-load voltage",
  "POLE-PRAD-ROZRUCHOWY": "Starting current",
  "POLE-REZYSTANCJA-WEWNETRZNA": "Internal resistance",
  "POLE-MINIMALNE-NAPIECIE-PRACY-FALOWNIKA": "Inverter min. operating voltage",
  "POLE-NAPIECIE-BATERII-L": "battery voltage",
  "POLE-REZYSTANCJA-WEWNETRZNA-L": "internal resistance",
  "POLE-ZDOLNOSC-LACZENIOWA-TRANZYSTOROW-L": "transistor breaking capacity",
  "POLE-AIC-BEZPIECZNIKA": "Fuse AIC",
  "POLE-POJEMNOSC-BATERII-L": "battery capacity",
  "POLE-NAPIECIE-ABSORPCJI-L": "absorption voltage",
  "POLE-AKTUALNY-PRAD-L": "current current draw",
  "POLE-AKTUALNE-NAPIECIE-L": "current voltage",
  "POLE-NAPIECIE-NOMINALNE-BATERIA-1": "Nominal voltage — battery 1",
  "POLE-NAPIECIE-NOMINALNE-BATERIA-2": "Nominal voltage — battery 2",
  "POLE-REZYSTANCJA-WEWNETRZNA-BATERIA-1": "Internal resistance — battery 1",
  "POLE-REZYSTANCJA-WEWNETRZNA-BATERIA-2": "Internal resistance — battery 2",
  "POLE-CENA-BATERII-L": "battery price",
  "POLE-POJEMNOSC-UZYTECZNA-L": "usable capacity",
  "POLE-LICZBA-CYKLI-L": "cycle count",
  "POLE-DEKLAROWANA-POJEMNOSC-L": "declared capacity",
  "POLE-CENA-ZAKUPU-L": "purchase price",
  "POLE-WIEK-BATERII-L": "battery age",
  "POLE-PRZEBIEG-L": "mileage",
  "POLE-POJEMNOSC-ZNAMIONOWA-L": "rated capacity",
  "POLE-REZYSTANCJA-FABRYCZNA-L": "factory resistance",
  "POLE-REZYSTANCJA-AKTUALNA-L": "current resistance",
  "POLE-PRAD-ZNAMIONOWY-COMMON-PORT-L": "Common Port rated current",
  "POLE-SZCZYTOWY-PRAD-ROZRUCHU-FALOWNIKA-L": "inverter peak start-up current",
  "POLE-POJEMNOSC-AKUMULATORA": "Battery capacity",
  "POLE-NAPIECIE-AKUMULATORA": "Battery voltage",
  "POLE-ZUZYCIE-NA-DOBE": "Consumption per day",
  "POLE-MOC-PANELI": "Panel power",
  "POLE-NAPIECIE-PANELI": "Panel voltage",
  "POLE-PRAD-BEZPIECZNIKA": "Fuse current",
  "POLE-MOC-URZADZENIA": "Device power",
  "POLE-VOC-PANELU": "Panel Voc",
  "POLE-LICZBA-PANELI-SZEREGOWO": "Panels in series",
  "POLE-MAX-NAPIECIE-WEJSCIA-STACJI": "Station max. input voltage",
  "POLE-PRAD-ZWARCIOWY-ISC": "Short-circuit current Isc",
  "POLE-LICZBA-GALEZI-ROWNOLEGLYCH": "Number of parallel branches",
  "POLE-MAX-PRAD-WEJSCIA-STACJI": "Station max. input current",
  "POLE-NAPIECIE-SPOCZYNKOWE": "Resting voltage",
  "POLE-NAPIECIE-URZADZENIA": "Device voltage",
  "POLE-MAKS-NAPIECIE-LADOWANIA": "Max. charging voltage",
  "POLE-MOC-CIEPLNA-L": "thermal power",
  "POLE-ODSTEP-DYLATACYJNY-MIEDZY-PANELAMI": "Expansion gap between panels",
  "POLE-ROCZNY-UZYSK-INSTALACJI": "Annual installation yield",
  "POLE-NAPIECIE-SYSTEMU-DC": "DC system voltage",
  "POLE-WYDAJNOSC-CENTRALI": "Air handling unit capacity",
  "POLE-GLEBOKOSC-PRZEMARZANIA": "Frost depth",
  "POLE-GLEBOKOSC-ULOZENIA": "Burial depth",
  "POLE-POJEMNOSC-BATERII": "Battery capacity",
  "POLE-MOC-ODBIORNIKA": "Load power",
  "POLE-PREDKOSC-WIATRU": "Wind speed",
  "POLE-OBCIAZENIE-L1": "Load L1",
  "POLE-OBCIAZENIE-L2": "Load L2",
  "POLE-OBCIAZENIE-L3": "Load L3",
  "POLE-NAPIECIE-SYSTEMU-L": "system voltage",
  "POLE-MOC-URZADZENIA-L": "device power",
  "POLE-POJEMNOSC-L": "capacity",
  "POLE-ENERGIA-L": "energy",
  "POLE-MOC-CZYNNA-L": "active power",
  "POLE-ZAPOTRZEBOWANIE": "Demand",
  "POLE-MOC-FALOWNIKA": "Inverter power",
  "POLE-NAPIECIE-MAGISTRALI": "Bus voltage",
  "POLE-MAKS-NAPIECIE-MAGISTRALI": "Max. bus voltage",
  "POLE-POBOR-MOCY": "Power draw",
  "POLE-NAPIECIE-WYJSCIOWE": "Output voltage",
  "POLE-MAKS-NAPIECIE-WEJSCIOWE-PRZETWORNICY": "Max. converter input voltage",
  "POLE-MAKS-PRAD-PRZETWORNICY": "Max. converter current",
  "POLE-WYMAGANY-CZAS-PRACY": "Required run time",
  "POLE-MAKSYMALNY-CZAS-PRACY-CIAGLEJ": "Max. continuous run time",
  "POLE-PRZERWA": "Gap",
  "POLE-ZUZYCIE-PALIWA": "Fuel consumption",
  "POLE-INTERWAL-WYMIANY-OLEJU": "Oil change interval",
  "POLE-DNI-POSTOJU": "Idle days",
  "POLE-PRODUKCJA-INSTALACJI": "Installation output",
  "POLE-PRODUKCJA-STRINGU": "String output",
  "POLE-ZUZYCIE-DOBOWE": "Daily consumption",
  "POLE-LICZBA-DNI": "Number of days",
  "POLE-ENERGIA-Z-AGREGATU": "Generator energy",
  "POLE-POJEMNOSC-CIEPLNA-BUDYNKU": "Building heat capacity",
  "POLE-PODNIESIENIE-TEMPERATURY-W-DOMU": "Indoor temperature rise",
  "POLE-STRATY-CIEPLA": "Heat loss",
  "POLE-POJEMNOSC-BOJLERA": "Boiler capacity",
  "POLE-PODNIESIENIE-TEMPERATURY-BOJLERA": "Boiler temperature rise",
  "POLE-NADWYZKA-PV": "PV surplus",
  "POLE-MOC-CIEPLNA": "Thermal power",
  "POLE-MOC-DO-WODY": "Power to water",
  "POLE-ZAPOTRZEBOWANIE-NA-CIEPLO": "Heat demand",
  "POLE-WARTOSC-OPALOWA": "Calorific value",
  "POLE-DLUGOSC-KABLA": "Cable length",
  "POLE-MOC-KABLA-NA-METR": "Cable power per metre",
  "POLE-MOC-POMPY-CIEPLA": "Heat pump power",
  "POLE-ZAPAS-MOCY": "Power margin",
  "POLE-LICZBA-LAT": "number of years",
  "POLE-MOC-PANELU": "panel power",
  "POLE-POWIERZCHNIA-PANELU": "panel area (single)",
  "POLE-ZAPOTRZEBOWANIE-DOBOWE": "daily demand",
  "POLE-DODATKOWE-ZAPOTRZEBOWANIE-ZIMA": "Additional winter demand",
  "POLE-LIMIT-MONTAZOWY": "installation limit (whole number)",
  "POLE-MIESIAC-SEZONU-GRZEWCZEGO": "month of the heating season",
  "POLE-LICZBA-PANELI-TRACKER": "Number of panels on the tracker",
  "POLE-KOSZT-TRACKERA": "Tracker cost",
  "POLE-KOSZT-PANELU": "Cost of an additional panel",
  "POLE-UZYSK-PANELU": "Annual yield of one panel",
} satisfies Record<KluczTlumaczenia, string>
