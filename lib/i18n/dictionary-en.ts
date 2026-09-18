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
} satisfies Record<KluczTlumaczenia, string>
