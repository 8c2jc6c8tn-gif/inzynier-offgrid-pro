// English texts of ./perspektywy.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./perspektywy"

export const en: Record<keyof typeof pl, string> = {
  "UI-PERSP-LINK": "Outlook",
  "UI-PERSP-TYTUL": "Project outlook",
  "UI-PERSP-OPIS":
    "Curiosities: technologies and patents someone presents as the future of energy. Each comes with an energy and cost calculation, a reality check and a clear split between what is verified and what is only the manufacturer's claim.",
  "UI-PERSP-WROC": "← Project outlook",
  "UI-PERSP-OCENA": "Verdict",
  "UI-PERSP-DATA": "As of {data}",
  "UI-PERSP-H-JAK": "How it works",
  "UI-PERSP-H-DEKLARACJE": "What the manufacturer claims (no independent measurements)",
  "UI-PERSP-H-BILANS": "Energy balance (our calculation)",
  "UI-PERSP-H-RYNKI": "Does it pay: Poland, Norway, the Netherlands",
  "UI-PERSP-H-OFFGRID": "Relevance for off-grid",
  "UI-PERSP-H-ZRODLA": "Sources and what is verified",
  "UI-PERSP-AIRCELA-TYTUL": "Aircela: petrol from air",
  "UI-PERSP-AIRCELA-KARTA": "A fridge-sized machine makes petrol from CO₂ in the air, water and electricity. How much energy it takes and where it pays.",
  "UI-PERSP-AIRCELA-OCENA": "watch, do not build",
  "UI-PERSP-AIRCELA-LEAD":
    "Technically feasible, because every step is a known technology. Whether it pays depends on the electricity price, the fuel price and how often the machine runs: by this calculation it does not pay in Poland, nor on own panels in Norway and the Netherlands; in Norway it is borderline only with a fixed hydro-power electricity price around the clock.",
  "UI-PERSP-AIRCELA-JAK-1": "CO₂ is captured from the air by a liquid sorbent that is regenerated inside the machine.",
  "UI-PERSP-AIRCELA-JAK-2": "Water electrolysis: the hydrogen stays in the machine, the oxygen is released.",
  "UI-PERSP-AIRCELA-JAK-3": "Methanol synthesis from CO₂ and hydrogen.",
  "UI-PERSP-AIRCELA-JAK-4": "Methanol is turned into petrol (the MTG process, two catalytic steps).",
  "UI-PERSP-AIRCELA-DEKL-1": "About 1 US gallon of petrol a day (3.785 l), about 10 kg of CO₂ a day, a tank of up to 17 gallons.",
  "UI-PERSP-AIRCELA-DEKL-2": "About 75 kWh of electricity per gallon and an efficiency “above 50%” (counted against a gallon's energy of about 37 kWh).",
  "UI-PERSP-AIRCELA-DEKL-3": "Machine price of USD 15,000–20,000 at the start; sales in selected US states around the end of 2026 (second-hand report).",
  "UI-PERSP-AIRCELA-BILANS-1": "From the chemistry: a gallon needs about 1.21 kg of hydrogen and about 8.8 kg of CO₂.",
  "UI-PERSP-AIRCELA-BILANS-2":
    "Electrolysis 60–66 kWh plus CO₂ capture 12–28 kWh gives about 73 to 94 kWh per gallon, before compression, pump and heating losses. Realistically 85–100 kWh, that is 22–26 kWh per litre.",
  "UI-PERSP-AIRCELA-BILANS-3": "The claimed 75 kWh sits at the very bottom of this range. At 100 kWh the efficiency against the fuel's energy is about 33%.",
  "UI-PERSP-AIRCELA-BILANS-4":
    "One machine draws 3–4 kW continuously; to run all year it needs 26–38 kWp of panels and delivers about 1,400 litres a year.",
  "UI-PERSP-AIRCELA-RYNKI-WSTEP":
    "We compute a threshold: the electricity price at which a litre from the machine costs the same as at the pump. Assumptions (not data): the machine costs USD 15,000–20,000, lasts 10 years and runs 90% of the time; rates 0.92 €/USD and 4.0 PLN/€; no servicing, sorbent, grid fees or tax on home-made fuel.",
  "UI-PERSP-AIRCELA-RYNKI-PL":
    "Poland: pump 6.85–7.55 PLN/l (about 1.7–1.9 €/l). Threshold: about 0.01–0.04 €/kWh (about 0.03–0.16 PLN/kWh), below the real price of PV electricity with storage. It does not pay.",
  "UI-PERSP-AIRCELA-RYNKI-NO":
    "Norway: pump 2.42 €/l (EU weekly average, September 2026). Threshold: about 0.036–0.066 €/kWh. The fixed Norgespris is 0.40 NOK/kWh excluding VAT (about 0.037 €/kWh, without grid fees). Borderline: cost close to the pump price, no profit.",
  "UI-PERSP-AIRCELA-RYNKI-NL":
    "Netherlands: pump 2.31 €/l (end of October 2026). Threshold: about 0.031–0.061 €/kWh. Household electricity is about 0.24–0.28 €/kWh, 4–8 times too dear. It works only in hours when the wholesale price is below the threshold, but then the machine runs part of the day.",
  "UI-PERSP-AIRCELA-RYNKI-PV-1":
    "Own PV instead of the grid: panel electricity costs about 0.04–0.09 €/kWh (a range for ground-mounted plants in Germany, used as an approximation), but the machine runs only in the sun. With panels 2–4 times the machine's power it runs about 18–33% of the year (yield about 900 kWh/kWp, almost nothing in winter in Norway).",
  "UI-PERSP-AIRCELA-RYNKI-PV-2":
    "Then the machine cost dominates, not the energy: the machine alone (USD 15,000–20,000, 10 years) is 3.0–7.2 €/l, energy 0.9–3.0 €/l, together 4.0–9.8 €/l, against 2.31 €/l (Netherlands) and 2.42 €/l (Norway) at the pump. Even with free energy the machine alone costs more than a litre at the pump.",
  "UI-PERSP-AIRCELA-RYNKI-PV-3":
    "It would pay only if the machine cost about USD 1,000–6,000 (several to over ten times cheaper) or ran around the clock all year on cheap electricity, as in Norway with the fixed hydro-power price.",
  "UI-PERSP-AIRCELA-RYNKI-WNIOSEK":
    "If the machine runs only part of the day, the machine cost per litre multiplies. So it pays only with cheap electricity around the clock, not just a low energy price.",
  "UI-PERSP-AIRCELA-OFFGRID-1":
    "An electric car uses 7–10 times less energy per kilometre than a car running on such petrol, and the chain electricity → petrol → generator → electricity recovers only 7–13% of the energy.",
  "UI-PERSP-AIRCELA-OFFGRID-2":
    "For an ordinary off-grid system it is cheaper to add panels and buy fuel for the generator. E-fuel makes sense where fuel cannot be replaced by electricity, and where electricity is very cheap.",
  "UI-PERSP-H-POROWNANIE": "Both scenarios side by side",
  "UI-PERSP-AIRCELA-POR-WSTEP":
    "The same machine (1 gallon a day, USD 15–20 thousand, 10-year life) powered two ways. A. Continuous operation on grid power or at a fixed price (90% of the year). B. Own PV only: the machine runs only in the sun, with panels 2–4 times its own power. Everything in euro, with zloty in brackets at 4.0 PLN/EUR.",
  "UI-PERSP-AIRCELA-POR-ZALOZENIA":
    "Energy price in scenario A: Poland 0.20 PLN/kWh (a parameter, not a tariff), Norway EUR 0.037/kWh (fixed Norgespris price, no grid fees), the Netherlands EUR 0.24–0.28/kWh (household price). Scenario B: PV energy EUR 0.04–0.09/kWh, yield 900 kWh/kWp a year. The range is the best and the worst combination of assumptions. Exchange rates were not checked.",
  "UI-PERSP-AIRCELA-POR-WNIOSEK":
    "With continuous operation the energy price decides: Norway is borderline, the Netherlands and Poland are out. On own PV the machine decides, because it runs several times fewer hours and its cost is spread over several times fewer litres, so it does not pay in any of the three countries. The remark that it pays in the Netherlands and Norway, and on own PV obviously too, is only partly confirmed.",
  "UI-PERSP-POR-OPIS-TABELI": "Cost of a litre of petrol from the machine in the two scenarios, in euro (zloty in brackets), next to the pump price.",
  "UI-PERSP-POR-KOL-RYNEK": "Scenario and market",
  "UI-PERSP-POR-KOL-LITRY": "Litres a year",
  "UI-PERSP-POR-KOL-URZADZENIE": "Machine per litre",
  "UI-PERSP-POR-KOL-ENERGIA": "Energy per litre",
  "UI-PERSP-POR-KOL-RAZEM": "Total per litre",
  "UI-PERSP-POR-KOL-STACJA": "Pump, per litre",
  "UI-PERSP-POR-KOL-WNIOSEK": "Verdict",
  "UI-PERSP-POR-SC-CIAGLY": "A. Continuous operation",
  "UI-PERSP-POR-SC-PV": "B. Own PV",
  "UI-PERSP-POR-KRAJ-PL": "Poland",
  "UI-PERSP-POR-KRAJ-NO": "Norway",
  "UI-PERSP-POR-KRAJ-NL": "Netherlands",
  "UI-PERSP-POR-OCENA-TAK": "pays off",
  "UI-PERSP-POR-OCENA-GRANICA": "borderline",
  "UI-PERSP-POR-OCENA-NIE": "does not pay",
  "UI-PERSP-POR-LITRY-JEDEN": "about {l}",
  "UI-PERSP-POR-LITRY-ZAKRES": "{min}–{max}",
  "UI-PERSP-POR-CENA-JEDNA": "€{eur} ({zl} PLN)",
  "UI-PERSP-POR-CENA-ZAKRES": "€{eurMin}–{eurMax} ({zlMin}–{zlMax} PLN)",
  "UI-PERSP-AIRCELA-ZRODLA-OPIS":
    "The manufacturer's claims come from the media, not from measurements. Fuel prices: the EU weekly bulletin; electricity prices and the figures on CO₂ capture and electrolyser energy come from search summaries and must be checked in the originals. Full calculation and gaps: docs/perspektywy-projektow.md.",
}
