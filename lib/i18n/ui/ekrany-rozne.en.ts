// English texts of ./ekrany-rozne.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./ekrany-rozne"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-OCHWIL-MOKRY-BMS-MIEDZIANE":
    "A wet BMS and copper busbars are a ready recipe for a short circuit — condensation is the silent killer of electronics. Module 4, Screen 10.",
  "UI-OCHWIL-WYPELNIJ-DANE-ZEBY": "Fill in the data to see the condensation risk assessment.",
  "UI-OCHWIL-PUNKT-ROSY": "Dew point: {punktRosyC}°C",
  "UI-OCHWIL-OCHRONA-PRZED-WILGOCIA": "Protection against moisture and condensation",
  "UI-OCHWIL-TEMPERATURA-OTOCZENIA": "Ambient temperature",
  "UI-OCHWIL-WILGOTNOSC-WZGLEDNA": "Relative humidity",
  "UI-OCHWIL-TEMPERATURA-OBUDOWY-OGNIW": "Enclosure / cell temperature",
  "UI-OCHWIL-KOD-OBUDOWY": "Enclosure IP code",
  "UI-OCHWIL-MIEJSCE-NARAZONE-WILGOC": "Location exposed to moisture (garage, outdoor compartment)",
  "UI-OCHWIL-OCENIC-SPRAWDZ-WPISANE": "Can't assess — check the entered data",
  "UI-OCHWIL-OBUDOWA-PONIZEJ-WYMAGANEGO": "Enclosure below the required IP",
  "UI-OCHWIL-RYZYKO-KONDENSACJI": "Condensation risk",
  "UI-OCHWIL-BEZ-RYZYKA-KONDENSACJI": "No condensation risk",
  "UI-PRO-POGODA-SYSTEMU-ENERGETYCZNEG":
    "This is the \"weather\" of your energy system — not just the atmospheric kind, but all of it: how much power you will have, how much you will use, and when it will be tight. Module 10, Screen 1.",
  "UI-PRO-BILANS-DOBOWY-KWH": "Daily balance: {bilansKwh} kWh",
  "UI-PRO-PRODUKCJA-KWH-ZUZYCIE":
    "Production {produkcjaLacznaKwh} kWh, consumption {zuzycieLaczneKwh} kWh. Consumption peak at {godzinaSzczytuZuzycia}:00.",
  "UI-PRO-PRODUKCJA": "Production [kW]",
  "UI-PRO-ZUZYCIE": "Consumption [kW]",
  "UI-PRO-PROGNOZY": "Forecasts",
  "UI-PRO-WPISZ": "Enter the mean PV production and consumption power in each 3-hour window (e.g. from the inverter forecast, a weather service or your own measurements). I calculate the daily balance and the consumption peak hour.",
  "UI-PRO-WSTAW-PRZYKLAD": "Insert an example (demo data)",
  "UI-PRO-WYCZYSC": "Clear the fields",
  "UI-PRO-UZUPELNIJ": "Fill in production and consumption in all eight windows to see the daily balance.",
  "UI-PRO-SPRAWDZ": "Check the data",
  "UI-OCHPRZROZ-DOZOWNIK-NAPIECIA-LVD":
    "A low-voltage disconnect (LVD) cuts off the load before it discharges the battery too deeply. Module 12.",
  "UI-OCHPRZROZ-KWASOWY-ZALEWOWY": "Lead-acid (flooded)",
  "UI-OCHPRZROZ-LIFEPO4": "LiFePO4",
  "UI-OCHPRZROZ-WYBIERZ-TYP-NAPIECIE": "Choose the battery type and voltage to see the cut-off threshold.",
  "UI-OCHPRZROZ-OGNIWO-OGNIW-SZEREGU": "{progNaOgniwoV} V per cell · {liczbaOgniw} cells in series",
  "UI-OCHPRZROZ-OCHRONA-PRZED-ROZLADOWANIEM": "Battery over-discharge protection",
  "UI-OCHPRZROZ-TYP-AKUMULATORA": "Battery type",
  "UI-OCHPRZROZ-NAPIECIE-ZNAMIONOWE": "Nominal voltage",
  "UI-OCHPRZROZ-MAM-DOZOWNIK-NAPIECIA": "I have a low-voltage disconnect (LVD)",
  "UI-OCHPRZROZ-ODBIORNIK-SAM-ODCINA": "The load cuts itself off at low voltage",
  "UI-OCHPRZROZ-LODOWKA-TURYSTYCZNA-WBUDOWAN": "E.g. a camping fridge with built-in battery protection.",
  "UI-OCHPRZROZ-AKUMULATOR-BEZ-OCHRONY": "Battery without protection",
  "UI-OCHPRZROZ-PROG-ODCIECIA-DOZOWNIKA": "LVD cut-off threshold",
  "UI-OCHPRZROZ-KARTY-PRODUCENTA": "per the manufacturer's datasheet",
  "UI-PANDOSTAZAS-STACJE-ZASILANIA-MAJA":
    "Power stations have lower input limits than professional MPPT controllers — a panel chosen for a \"grown-up\" installation can easily damage them, especially in frost. Module 12.",
  "UI-PANDOSTAZAS-OPCJONALNIE-SPRAWDZENIE-PRAD": "Optional — current check:",
  "UI-PANDOSTAZAS-WYPELNIJ-PIEC-PIERWSZYCH": "Fill in the first five fields to see the result.",
  "UI-PANDOSTAZAS-LIMITU-WEJSCIA": "{udzialLimituPct}% of the input limit",
  "UI-PANDOSTAZAS-PRZEKROCZONY-LIMIT-WEJSCIA": "Station input limit exceeded",
  "UI-PANDOSTAZAS-GRANICY-SPRAWDZ": "Borderline — check",
  "UI-PANDOSTAZAS-MOZNA-PODLACZYC": "Can be connected",
  "UI-PANDOSTAZAS-LACZENIE-PANELI-STACJA": "Connecting panels to a power station / power bank",
  "UI-PANDOSTAZAS-VOC-PANELU-STC": "Panel Voc (STC)",
  "UI-PANDOSTAZAS-WSPOLCZYNNIK-TEMPERATUROWY-V": "Voc temperature coefficient (β)",
  "UI-PANDOSTAZAS-NAJNIZSZA-TEMPERATURA-PRACY": "Lowest operating temperature",
  "UI-PANDOSTAZAS-PANELI-POLACZONYCH-SZEREGOWO": "Panels connected in series",
  "UI-PANDOSTAZAS-MAX-NAPIECIE-WEJSCIA": "Station max solar input voltage",
  "UI-PANDOSTAZAS-PRAD-ZWARCIOWY-PANELU": "Panel short-circuit current (Isc)",
  "UI-PANDOSTAZAS-GALEZI-ROWNOLEGLYCH": "Parallel branches",
  "UI-PANDOSTAZAS-MAX-PRAD-WEJSCIA": "Station max solar input current",
  "UI-PANDOSTAZAS-POLICZYC-SPRAWDZ-WPISANE": "Can't calculate — check the entered data",
  "UI-PANDOSTAZAS-PRAD-ZWARCIOWY": "· short-circuit current {pradZwarciowyA} A",
  "UI-TRYLIV-PRZELACZNIK-MIEDZY-TRYBEM":
    "Switch between \"Design\" mode (Tiles 1–12) and \"Live\" mode (real-time monitoring). Module 13, Screen 1.",
  "UI-TRYLIV-TRYB-LIVE-CZERPIE":
    "Live mode takes data from the inverter/BMS in real time via Modbus or MQTT — this connection is not configured yet. Once connected, this screen will become the gateway to the widget library (Screen 2: dashboard with selectable widgets — PV power, battery SoC, alarms and more, docs/zrodla/Tresc_Modul_13_Live_Ekrany.md).",
  "UI-TRYLIV-CZASU-PODLACZENIA-TELEMETRII":
    "Until telemetry is connected, use the other modules in design mode — they calculate from the data you enter manually, not live.",
  "UI-TRYLIV-TRYB-LIVE": "Live mode",
  "UI-TRYLIV-BRAK-POLACZENIA-TELEMETRIA": "⚪ No telemetry connection",
}
