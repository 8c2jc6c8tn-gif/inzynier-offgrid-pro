// English texts of ./m14-faq.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-faq"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-FAQ-DOM-CENA-TRZYMANIA-P": "How much do I pay just for having a grid connection?",
  "UI-FAQ-DOM-CENA-TRZYMANIA-O":
    "This is the “cost of keeping the grid”: the fixed network charge, the subscription charge, the supplier's trading fee and the capacity charge (in G tariffs a flat rate by consumption band), all with VAT — you pay them as long as the contract and the meter exist, even at zero consumption. PV and storage only reduce the variable components. A bill split into fixed and variable parts shows how much that is in your case.",
  "UI-FAQ-DOM-CENA-TRZYMANIA-L": "My bill today",
  "UI-FAQ-DOM-NET-METERING-P": "What is the difference between net-metering and net-billing?",
  "UI-FAQ-DOM-NET-METERING-O":
    "Net-metering (installations with applications filed before 1.04.2022): for 1 kWh exported you take back 0.8 kWh (up to 10 kW) or 0.7 kWh (above), for 15 years. Net-billing: the surplus is valued at the market price (RCEm or the hourly RCE), and the value goes to a prosumer deposit valid for 12 months.",
  "UI-FAQ-DOM-NET-METERING-L": "Prosumer deposit",
  "UI-FAQ-DOM-1-23-P": "Where does the 1.23 factor in the deposit come from?",
  "UI-FAQ-DOM-1-23-O":
    "From the Renewable Energy Sources Act (art. 4c sec. 4): the deposit value for a given month is increased by 1.23 — for every prosumer, from 1.02.2025.",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-P": "What happens to an unused deposit?",
  "UI-FAQ-DOM-ZWROT-DEPOZYTU-O":
    "After 12 months you can get a refund, but at most 20% of the value of the energy from a given month with RCEm settlement or 30% with RCE. The rest is written off. A negative RCE price counts as zero.",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-P": "Can I go back from RCE to RCEm, or from net-billing to net-metering?",
  "UI-FAQ-DOM-JEDNOKIERUNKOWE-O":
    "No. Both transitions are one-way (art. 4b sec. 2b and art. 4d sec. 1 of the Renewable Energy Sources Act).",
  "UI-FAQ-DOM-ODLACZENIE-P": "Does it pay to disconnect from the grid completely?",
  "UI-FAQ-DOM-ODLACZENIE-O":
    "It depends on your winter consumption, location and equipment prices. The A–D comparison shows the cheapest and the most independent scenario side by side. An old prosumer on net-metering usually wins with scenario A — the app will say so honestly, even if the result sounds like “stay”.",
  "UI-FAQ-DOM-ODLACZENIE-L": "Comparison of scenarios A–D",
  "UI-FAQ-DOM-NAJPIERW-P": "Where do I start if I am thinking about disconnecting?",
  "UI-FAQ-DOM-NAJPIERW-O":
    "With reversible steps: calculate the scenarios, build an island system and test it for a full winter while the grid is still connected. Terminating the contract is only step 5 of 7.",
  "UI-FAQ-DOM-NAJPIERW-L": "How to give up the grid connection",
  "UI-FAQ-DOM-AGREGAT-P": "Can I plug a generator into a socket?",
  "UI-FAQ-DOM-AGREGAT-O":
    "No. A generator supplies the building installation only through a changeover switch with a 0 position and an interlock — otherwise it can feed voltage into the grid or onto the pins of a plug. A combustion generator never in a living space (carbon monoxide).",
  "UI-FAQ-DOM-AGREGAT-L": "Grid/island changeover switch",
  "UI-FAQ-DOM-LICZNIK-P": "I suspect the meter over-reads. What should I do?",
  "UI-FAQ-DOM-LICZNIK-O":
    "Do the LED test, then file a complaint. 14 days is the company's deadline to reply, not the deadline for filing the complaint. The DSO carries out a laboratory test of the meter within 14 days of the request.",
  "UI-FAQ-DOM-LICZNIK-L": "Meter test and complaint",
  "UI-FAQ-FIRMA-REGULOWANE-P": "Are prices in C tariffs unregulated?",
  "UI-FAQ-FIRMA-REGULOWANE-O":
    "Energy sales are unregulated. Distribution rates for C groups are approved every year by the President of URE (the Energy Regulatory Office) — those are in the DSO tariff file.",
  "UI-FAQ-FIRMA-BIERNA-KTO-P": "Does a business on a C tariff pay for reactive power?",
  "UI-FAQ-FIRMA-BIERNA-KTO-O":
    "Only if it follows from the connection conditions or the contract — in practice mainly customers above 40 kW. Check whether your invoice has an item for reactive energy. The charge applies to the excess above tgφ₀ (0.4 by default, never below 0.2).",
  "UI-FAQ-FIRMA-BIERNA-KTO-L": "Reactive power",
  "UI-FAQ-FIRMA-BIERNA-JAK-P": "How do I avoid reactive power charges?",
  "UI-FAQ-FIRMA-BIERNA-JAK-O":
    "Compensation (a capacitor bank) and regular checks of tgφ. The calculator computes the compensation power you need for the target tgφ; the charge amount only once you enter the price C_rk.",
  "UI-FAQ-FIRMA-MOCOWA-P": "How much is the capacity charge for businesses in 2026?",
  "UI-FAQ-FIRMA-MOCOWA-O":
    "0.2194 PLN/kWh net for energy drawn on working days between 7:00 and 22:00 (Information of the President of URE no. 58/2025). That is +55.3% compared with 0.1413 PLN/kWh in 2025.",
  "UI-FAQ-FIRMA-MOCOWA-L": "Capacity charge",
  "UI-FAQ-FIRMA-NET-BILLING-P": "Does net-billing pay off for businesses?",
  "UI-FAQ-FIRMA-NET-BILLING-O":
    "Self-consumption is the key: a kWh used immediately is worth the full purchase price, one exported — only the market price. The balancing factor is not a constant 0.3–0.4; the app calculates it from your data (surplus value ÷ full cost of a kWh drawn).",
  "UI-FAQ-FIRMA-NET-BILLING-L": "PV in a business and self-consumption",
  "UI-FAQ-FIRMA-DEPOZYT-P": "What is a business prosumer deposit?",
  "UI-FAQ-FIRMA-DEPOZYT-O":
    "A virtual account holding the value of exported energy, increased by 1.23 (every prosumer, from 1.02.2025) and valid for 12 months. The tax consequences for the business depend on its form of taxation — consult your accountant.",
  "UI-FAQ-FIRMA-DEPOZYT-L": "Prosumer deposit",
  "UI-FAQ-FIRMA-BESS-CENA-P": "How much does energy storage for a business cost and when does it pay back?",
  "UI-FAQ-FIRMA-BESS-CENA-O":
    "The app does not quote prices from memory — prices change quickly. Enter prices from offers, and the calculator will compute the payback from your benefit streams.",
  "UI-FAQ-FIRMA-BESS-CENA-L": "Storage (BESS) in a business",
  "UI-FAQ-FIRMA-DOTACJE-P": "Are there subsidies for energy storage for businesses?",
  "UI-FAQ-FIRMA-DOTACJE-O":
    "“Przydomowe Magazyny Energii” (home energy storage programme) and the thermal-modernisation tax relief apply to individuals, not businesses. The regional call FEPK.02.03-IZ.00-002/26 ended on 31.03.2026. Check current calls in regional programmes.",
  "UI-FAQ-FIRMA-DOTACJE-L": "Subsidies and taxes",
  "UI-FAQ-FIRMA-LICZNIK-TEST-P": "How do I check that the meter works correctly?",
  "UI-FAQ-FIRMA-LICZNIK-TEST-O":
    "LED test: switch off whatever you can and time n pulses. P [kW] = 3600 · n ÷ (time [s] · meter constant [imp/kWh]). Example: 15 pulses in 60 s at 1000 imp/kWh is 0.9 kW.",
  "UI-FAQ-FIRMA-LICZNIK-TEST-L": "Meter test",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-P": "What should I do if the meter over-reads?",
  "UI-FAQ-FIRMA-LICZNIK-REKLAMACJA-O":
    "File a complaint — 14 days is the company's deadline to reply. Then you can request a laboratory test (the DSO has 14 days from the request). An additional expert examination is paid by the customer, unless it shows irregularities — then the company bears the cost. Test fees differ between DSOs — check your operator's price list.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-P": "Can I change tariff, e.g. from C11 to C12a?",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-O":
    "Yes. First compare the cost in every available tariff for your consumption profile — C1x groups are for contracted capacity up to 40 kW, C2x above.",
  "UI-FAQ-FIRMA-ZMIANA-TARYFY-L": "C tariff comparison",
}
