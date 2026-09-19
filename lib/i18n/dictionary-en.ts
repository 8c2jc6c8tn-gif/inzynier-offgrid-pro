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
} satisfies Record<KluczTlumaczenia, string>
