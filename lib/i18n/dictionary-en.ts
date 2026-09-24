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
    "The cost of energy from storage ({koszt} PLN/kWh) is lower than the alternative's cost ({alt} PLN/kWh) — storage pays off.",
  "DROZSZE-NIZ-ALTERNATYWA":
    "The cost of energy from storage ({koszt} PLN/kWh) is higher than the alternative's cost ({alt} PLN/kWh) — " +
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
    "The cost of 1 usable kWh from this battery ({koszt} PLN/kWh) is lower than a new LiFePO4's " +
    "({nowa} PLN/kWh) — but the new one has 100% SoH and a longer lifespan.",
  "DROZSZA-NIZ-NOWA":
    "The cost of 1 usable kWh from this battery ({koszt} PLN/kWh) is higher than a new LiFePO4's " +
    "({nowa} PLN/kWh) — at this purchase price, a new battery pays off better.",
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
    "After {lata} years, route {tansza} is cheaper by {roznica} PLN (purchase cost + energy losses combined).",
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
  "TYLKO-SILA-NAPORU-NIE-SSANIE":
    "Only the frontal wind-thrust force — suction from below, the overturning moment, and the " +
    "required ballast are NOT calculated (they require mounting geometry the source doesn't give as numbers).",
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
    "The heat pump is cheaper by {oszczednosc} zł — the electric boiler will use {mnoznik}× more power " +
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
  "SKANER-BRAK-WYSOKOSCI-GRUNTU": "Building corners have no GPS altitude — the ridge height cannot be determined.",
  "SKANER-ZALOZENIE-UKLAD-LOKALNY": "GPS coordinates converted to a local metric system (plane tangent to the WGS84 ellipsoid at the first point) — accurate for a plot-sized area.",
  "SKANER-ZALOZENIE-KALIBRACJA-POZIOMA": "Calibration with a known dimension corrects horizontal dimensions only — the GPS altitude error remains.",
  "SKANER-ZALOZENIE-WYSOKOSC-GPS": "Roof tilt and ridge height are derived from GPS altitude, which is usually less accurate than horizontal position — treat them as indicative or correct them manually.",
} satisfies Record<KluczTlumaczenia, string>
