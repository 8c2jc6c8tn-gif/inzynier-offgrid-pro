// English texts of ./m14-przejscie.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-przejscie"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-RYZ-R1-T":
    "Irreversibility — terminating the contract and removing the meter",
  "UI-RYZ-R1-S":
    "Going back means a new connection application: new conditions, a connection fee, months of waiting, a risk of refusal.",
  "UI-RYZ-R1-P":
    "Price the cost of going back (rate from the DSO tariff × capacity) before you terminate anything.",
  "UI-RYZ-R1-L":
    "Cost of reconnecting to the grid",
  "UI-RYZ-R2-T":
    "Winter — production deficit",
  "UI-RYZ-R2-S":
    "No energy in December and January, or long generator running.",
  "UI-RYZ-R2-P":
    "Off-grid balance and the winter stress test (Module 7) before choosing scenario D.",
  "UI-RYZ-R2-L":
    "Winter without the grid",
  "UI-RYZ-R3-T":
    "Failure of the only source (inverter, BMS)",
  "UI-RYZ-R3-S":
    "The house without power until the repair.",
  "UI-RYZ-R3-P":
    "A backup supply path (generator → charger or bypass) and a list of critical spare parts.",
  "UI-RYZ-R3-L":
    "Single points of failure",
  "UI-RYZ-R4-T":
    "People dependent on power (oxygen concentrator, medical equipment, fridge with medicines)",
  "UI-RYZ-R4-S":
    "A threat to health and life.",
  "UI-RYZ-R4-P":
    "A check question in the scenario comparison — with “yes”, scenario D without a redundant backup is blocked.",
  "UI-RYZ-R5-T":
    "Heat pump or electric heating",
  "UI-RYZ-R5-S":
    "Winter demand many times higher than in summer.",
  "UI-RYZ-R5-P":
    "Heat pump COP in frost (Module 6) and the winter balance.",
  "UI-RYZ-R5-L":
    "Heat pump COP",
  "UI-RYZ-R6-T":
    "Building formalities — acceptance, mortgage, insurance, selling the house",
  "UI-RYZ-R6-S":
    "The authority, the bank or the insurer may expect a grid connection or a documented source.",
  "UI-RYZ-R6-P":
    "Check before disconnecting: the loan agreement, the policy, the bank's conditions. Practice varies — there is no uniform regulation.",
  "UI-RYZ-R7-T":
    "Fire safety of storage and PV",
  "UI-RYZ-R7-S":
    "Higher risk with large storage inside the building.",
  "UI-RYZ-R7-P":
    "Fire audit (Module 8). PV above 6.5 kW: agreement with a fire-safety expert and notification of the State Fire Service (PSP).",
  "UI-RYZ-R7-L":
    "Fire audit",
  "UI-RYZ-R8-T":
    "Generator — exhaust (CO), noise, fuel, servicing",
  "UI-RYZ-R8-S":
    "Carbon monoxide poisoning when running indoors; disputes with neighbours.",
  "UI-RYZ-R8-P":
    "A combustion generator only outdoors or in a ventilated, separate place, always through a changeover switch.",
  "UI-RYZ-R8-L":
    "Generator as a backup",
  "UI-RYZ-R9-T":
    "Loss of prosumer settlements and subsidies",
  "UI-RYZ-R9-S":
    "The deposit or discounts are forfeited; a subsidy may have to be returned if the rules require durability.",
  "UI-RYZ-R9-P":
    "Calculate what you lose in the deposit and check the subsidy rules.",
  "UI-RYZ-R9-L":
    "Prosumer deposit",
  "UI-RYZ-R10-T":
    "Property value and a future buyer",
  "UI-RYZ-R10-S":
    "Some buyers expect a grid connection.",
  "UI-RYZ-R10-P":
    "Take this into account if you plan to sell.",
  "UI-RYZ-RF1-T":
    "Business continuity (cold stores, production, servers)",
  "UI-RYZ-RF1-S":
    "Downtime costs more than the savings bring.",
  "UI-RYZ-RF1-P":
    "In the business scenarios enter the acceptable time without power — the app will check the storage reserve.",
  "UI-RYZ-RF1-L":
    "Scenarios A–D for a business",
  "UI-RYZ-RF2-T":
    "Comprehensive B2B contracts",
  "UI-RYZ-RF2-S":
    "Notice period, contractual penalties, no consumer protection.",
  "UI-RYZ-RF2-P":
    "A check step in the procedure — read the contract before giving notice.",
  "UI-RYZ-RF2-L":
    "Procedure",
  "UI-RYZ-RF3-T":
    "Insurer and health-and-safety requirements for storage and the generator",
  "UI-RYZ-RF3-S":
    "Policy conditions may exclude or limit the installation.",
  "UI-RYZ-RF3-P":
    "Ask the insurer and the health-and-safety service before buying.",
  "UI-PROC-P1-T":
    "Calculate",
  "UI-PROC-P1-O":
    "Scenarios A–D and the winter stress test (Module 7). Accept the result consciously — with the generator hours and the cost of going back.",
  "UI-PROC-P2-T":
    "Build and test the island system with the grid still connected — for a full winter",
  "UI-PROC-P2-O":
    "The most important advice of this chapter: the grid stays as a backup (scenario C) until the system has been through a real December–February. Grid – 0 – island changeover switch, no parallel operation. Have the installation and measurements done by a qualified person (SEP certificate — the scope of the requirement for your own installation is to be confirmed).",
  "UI-PROC-P3-T":
    "Check the formalities",
  "UI-PROC-P3-O":
    "Bank, insurer, energy sales contract (notice period, penalties), subsidy rules (durability).",
  "UI-PROC-P3-F":
    "Comprehensive B2B contract: notice period and contractual penalties — a business has no consumer protection. Policy and health and safety for storage and the generator.",
  "UI-PROC-P4-T":
    "Use up the prosumer balance",
  "UI-PROC-P4-O":
    "Discounts or the deposit before the contract ends — after that they are forfeited.",
  "UI-PROC-P5-T":
    "Terminate in writing the sales contract and the distribution contract (or the comprehensive one)",
  "UI-PROC-P5-O":
    "First check the notice period and any penalty (offers with a price guarantee, fixed-term contracts). A consumer has a statutory right to terminate; costs for fixed-term contracts — check your contract.",
  "UI-PROC-P6-T":
    "Meter removal by the DSO",
  "UI-PROC-P6-O":
    "Fixed charges accrue until the day of removal (DSO practice). The connection usually remains the DSO's property; physically dismantling it is a separate matter with the DSO.",
  "UI-PROC-P7-T":
    "Keep the documentation",
  "UI-PROC-P7-O":
    "The contract, the removal report, the old connection conditions — they will be useful if you ever go back.",
}
