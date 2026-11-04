// English texts of ./m14-bess.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-bess"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-BESS-S-AUTOKONSUMPCJA": "Self-consumption of PV surplus",
  "UI-BESS-S-ARBITRAZ": "Price arbitrage",
  "UI-BESS-S-MOCOWA": "Capacity fee (outside 7:00–22:00)",
  "UI-BESS-S-MOC-UMOWNA": "Contracted capacity and overrun charges",
  "UI-BESS-TYTUL": "Energy storage (BESS) in a business — benefit streams",
  "UI-BESS-OPIS":
    "Storage earns in five ways, but not every one is available to your business. We compare each stream with the storage wear cost per 1 kWh from the “Storage profitability analysis” (Module 4). M14 “Business – grid”, screen F7.",
  "UI-BESS-KOSZT-KWH": "Cost of 1 kWh from storage:",
  "UI-BESS-KOSZT-WARTOSC": "{koszt} PLN/kWh",
  "UI-BESS-NIEPOLICZONY": "not calculated yet",
  "UI-BESS-L-ZMIEN": "change price, capacity, cycles →",
  "UI-BESS-L-POLICZ": "calculate it from offer prices →",
  "UI-BESS-H-1": "1. Self-consumption of PV surplus",
  "UI-BESS-ENERGIA": "Energy through storage",
  "UI-BESS-ZYSK": "Gain per 1 kWh",
  "UI-BESS-L-NADWYZKA": "How much surplus you have — PV in a business →",
  "UI-BESS-H-2": "2. Price arbitrage",
  "UI-BESS-ARBITRAZ-OPIS":
    "Charging from the grid in cheap hours and using in expensive ones — makes sense with dynamic or time-of-use prices.",
  "UI-BESS-ROZNICA": "Price difference",
  "UI-BESS-H-3": "3. Capacity fee",
  "UI-BESS-ODDANE": "Of which delivered on working days 7:00–22:00",
  "UI-BESS-L-MOCOWA": "Capacity fee — shifting consumption →",
  "UI-BESS-H-4": "4. Contracted capacity charges",
  "UI-BESS-GRUPA": "Tariff group",
  "UI-BESS-GRUPA-C1": "C11 / C12a / C12b (up to 40 kW)",
  "UI-BESS-GRUPA-C2": "C21 / C22a / C22b (above 40 kW)",
  "UI-BESS-OSZCZEDNOSC": "Savings on contracted capacity and overruns",
  "UI-BESS-L-MOC-UMOWNA": "Contracted capacity — overruns →",
  "UI-BESS-H-5": "5. System services",
  "UI-BESS-USLUGI-OPIS":
    "Balancing market and capacity market — practically unavailable to small storage without an aggregator. Information only, no amount.",
  "UI-BESS-UZUPELNIJ": "Complete the data",
  "UI-BESS-BILANS": "Annual storage balance",
  "UI-BESS-PLUS-ROCZNIE": "+{kwota} per year",
  "UI-BESS-MINUS-ROCZNIE": "{kwota} per year — the storage does not pay back",
  "UI-BESS-ZUZYCIE": "Storage wear",
  "UI-BESS-ZWROT":
    "Simple payback of the storage price from the benefits: {lat} years (no discounting or price changes).",
}
