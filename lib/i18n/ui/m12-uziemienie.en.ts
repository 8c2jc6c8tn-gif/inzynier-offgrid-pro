// English texts of ./m12-uziemienie.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m12-uziemienie"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-UMI-SCHEMAT-ARIA":
    "Fault loop diagram: inverter with an N–PE bond, 30 mA RCD, socket with an appliance, protective conductor PE connecting the appliance enclosure, the chassis and the N–PE point in the inverter",
  "UI-UMI-SCH-FALOWNIK": "Inverter 230 V",
  "UI-UMI-SCH-ODBIORNIK": "Load",
  "UI-UMI-SCH-GNIAZDO": "(socket + appliance)",
  "UI-UMI-SCH-ZWARCIE": "fault to enclosure",
  "UI-UMI-SCH-PE": "protective conductor PE",
  "UI-UMI-SCH-PODWOZIE": "chassis / vehicle ground",
  "UI-UMI-SCH-PRAD": "Fault current: enclosure → PE → N–PE → inverter.",
  "UI-UMI-SCH-DUZY": "High current — the fuse or RCD disconnects the circuit.",
  "UI-UMI-M-GARAZ": "Garage",
  "UI-UMI-M-KAMPER": "Camper / caravan",
  "UI-UMI-M-JACHT": "Yacht / boat",
  "UI-UMI-M-ZEWNATRZ": "Outdoors",
  "UI-UMI-M-NAMIOT": "Tent",
  "UI-UMI-TYTUL": "Earthing of a small installation",
  "UI-UMI-OPIS":
    "Camper, yacht, garage or an outdoor kit: checks whether the installation needs protective earthing and whether the inverter and the 230 V sockets are connected correctly. Module 12, Screen 38 (simplified version of Module 5, Screens 9 and 11).",
  "UI-UMI-RODZAJ": "Installation type",
  "UI-UMI-RODZAJ-DC": "12/24 V DC only",
  "UI-UMI-RODZAJ-AC": "230 V from an inverter",
  "UI-UMI-GDZIE": "Where the installation is",
  "UI-UMI-Q-ZASILANIE-J": "Is the yacht sometimes supplied from shore power?",
  "UI-UMI-Q-ZASILANIE-K": "Is the camper sometimes supplied from a hook-up post (campsite)?",
  "UI-UMI-Q-NPE-NAMIOT": "Does the 230 V output of the station or inverter have an N–PE bond (per the manual)?",
  "UI-UMI-Q-OBUDOWA": "Is the inverter enclosure earthed?",
  "UI-UMI-Q-GNIAZDA": "Do the 230 V sockets have the protective contact connected?",
  "UI-UMI-Q-NPE": "Does the inverter have an N–PE bond (factory, relay or per the manual)?",
  "UI-UMI-Q-NPE-ROZLACZANE": "Is this N–PE bond opened when supplied externally?",
  "UI-UMI-Q-RCD": "Is there a 30 mA residual current device (RCD) after the inverter?",
  "UI-UMI-WYBIERZ-DC": "Choose the installation type and location.",
  "UI-UMI-WYBIERZ-AC": "Choose the installation type and location, then answer all the questions that appear.",
  "UI-UMI-W-PODWOJNE": "Double N–PE bond with an external supply",
  "UI-UMI-W-OBUDOWA": "Inverter enclosure not earthed — risk of electric shock",
  "UI-UMI-W-BRAK-NPE": "No N–PE bond — the protection will not clear a fault",
  "UI-UMI-W-BRAK-RCD": "No 30 mA RCD — risk of electric shock",
  "UI-UMI-W-NAMIOT": "Tent, floating output — follow the rules below",
  "UI-UMI-W-GNIAZDA": "Sockets without a protective contact — read what this risks",
  "UI-UMI-W-PETLA": "Fault loop closed — protection complete",
  "UI-UMI-W-WILGOC": "Earthing not required — recommended in damp conditions",
  "UI-UMI-W-ZWYKLE": "Protective earthing usually not required",
  "UI-UMI-G-WYMAGANE": "protective earthing required",
  "UI-UMI-G-PLYWAJACE": "floating output — do not earth it on your own",
  "UI-UMI-G-ZWYKLE": "protective earthing usually not required",
  "UI-UMI-NAMIOT-H": "Tent — power station or a small inverter",
  "UI-UMI-NAMIOT-OPIS":
    "A tent has no chassis, so the strategy is different. Check in the manual what output the station has. Most portable stations have a “floating” 230 V output, i.e. not connected to earth. A single fault (e.g. touching one conductor) then does not cause a shock, because the current has no return path. A second fault at the same time is dangerous.",
  "UI-UMI-NAMIOT-1": "Do not earth such an output on your own if the manufacturer does not provide for it.",
  "UI-UMI-NAMIOT-2":
    "Safest: one device per output. The standard knows this protective measure as “electrical separation”.",
  "UI-UMI-NAMIOT-3": "Choose double-insulated devices (double-square symbol, flat plug).",
  "UI-UMI-NAMIOT-4":
    "Use a portable 30 mA RCD (PRCD) between the station and the extension cord. Note: with a floating output the RCD may not trip, depending on the station's design — check the manual, it is not a given.",
  "UI-UMI-NAMIOT-5": "Keep equipment off the floor, not on a wet groundsheet, and connectors in IP enclosures —",
  "UI-UMI-NAMIOT-5-L": "moisture protection (IP65/IP67)",
  "UI-UMI-NAMIOT-6":
    "A tent peg works as an earth electrode only if the station's manual provides an earth terminal. Otherwise it mostly gives a false sense of safety, like a hanging wire.",
  "UI-UMI-OCHRONA-H": "How protection works on an inverter",
  "UI-UMI-OCHRONA-OPIS":
    "Protection does not need earth — it needs a closed fault loop back to the source. With a fault to the enclosure the current flows: enclosure → protective conductor (PE) → N–PE bond point in the inverter → back to the inverter. A large current then flows, so the fuse or the residual current device (RCD) disconnects the circuit. There are three conditions:",
  "UI-UMI-OCHRONA-1":
    "all enclosures, the sockets' protective contacts and the chassis connected by one PE conductor (equipotential bonding);",
  "UI-UMI-OCHRONA-2":
    "the inverter has an N–PE bond, but only if the manufacturer allows it — many inverters with a transfer switch do this automatically with a relay when there is no external supply;",
  "UI-UMI-OCHRONA-3": "after this bond there is a 30 mA RCD.",
  "UI-UMI-PRET":
    "Neither a rod driven into the ground nor a wire or chain hanging under the camper will replace this loop.",
  "UI-UMI-Z-P1-S-J": "On shore power",
  "UI-UMI-Z-P1-S-K": "On a hook-up post supply",
  "UI-UMI-Z-P1-J":
    "the protective conductor comes from the grid. The N–PE bond on the yacht must then be opened, otherwise a double N–PE bond is created.",
  "UI-UMI-Z-P1-K":
    "the protective conductor comes from the grid. The N–PE bond in the camper must then be opened, otherwise a double N–PE bond is created.",
  "UI-UMI-Z-P2-J":
    "At the shore-power pedestal N and PE already arrive separated, because the separation is on the grid side. An N–PE bond on the yacht is a reconnection of N to an earthed part. PN-HD 60364-5-54 (clause 543.4.3) calls this “not permitted”, not “recommended”. What happens then:",
  "UI-UMI-Z-P2-K":
    "At the hook-up post N and PE already arrive separated, because the separation is on the grid side. An N–PE bond in the camper is a reconnection of N to an earthed part. PN-HD 60364-5-54 (clause 543.4.3) calls this “not permitted”, not “recommended”. What happens then:",
  "UI-UMI-Z-L1-S": "Working current flows through the protective conductor.",
  "UI-UMI-Z-L1-J":
    "The return from the loads splits between N and PE together with the hull. The enclosures carry a voltage to earth equal to the voltage drop on PE and the supply lead. The protective conductor is no longer “clean”.",
  "UI-UMI-Z-L1-K":
    "The return from the loads splits between N and PE together with the chassis. The enclosures carry a voltage to earth equal to the voltage drop on PE and the supply lead. The protective conductor is no longer “clean”.",
  "UI-UMI-Z-L2-S-J": "Most common symptom: the RCD at the shore-power pedestal trips.",
  "UI-UMI-Z-L2-S-K": "Most common symptom: the RCD on the hook-up post trips.",
  "UI-UMI-Z-L2-J":
    "Part of the current returns through PE, bypassing the RCD, so the RCD sees a difference and trips. This trip is safe but misleading: it is easy to blame the pedestal and look for a workaround. Don't — open the N–PE bond.",
  "UI-UMI-Z-L2-K":
    "Part of the current returns through PE, bypassing the RCD, so the RCD sees a difference and trips. This trip is safe but misleading: it is easy to blame the post and look for a workaround. Don't — open the N–PE bond.",
  "UI-UMI-Z-L3-S": "Dangerous case: an old supply point without an RCD.",
  "UI-UMI-Z-L3-J":
    "Nothing trips, and PE carries current all the time. If the PEN conductor in the grid breaks, all the return current seeks a path through PE and the hull. The yacht's metal parts may carry a dangerous voltage. Whoever touches them while standing on the jetty gets a shock.",
  "UI-UMI-Z-L3-K":
    "Nothing trips, and PE carries current all the time. If the PEN conductor in the grid breaks, all the return current seeks a path through PE and the chassis. The bodywork may carry a dangerous voltage. Whoever touches it while standing on the grass gets a shock.",
  "UI-UMI-Z-L4-S": "On a yacht it is worse.",
  "UI-UMI-Z-L4":
    "Current flowing through the protective conductor via the water corrodes underwater parts. In a marina, current in the water also puts nearby swimmers at risk of shock. That is why yacht rules are especially strict here.",
  "UI-UMI-Z-P3":
    "This fault does not kill straight away, like a missing N–PE on the inverter itself. But it breaks a basic rule of the system and becomes dangerous with a second fault — a broken PEN. That is why the app shows it in red, like an unearthed enclosure.",
  "UI-UMI-POSTOJ-S": "On a longer stay",
  "UI-UMI-POSTOJ":
    "an earth spike driven into the ground makes sense as an addition. It does not replace equipotential bonding or an RCD.",
  "UI-UMI-STOPKA": "Earthing at home, with an earth electrode and resistance measurement — full calculators:",
  "UI-UMI-STOPKA-L1": "Module 5 — Earthing design",
  "UI-UMI-STOPKA-ORAZ": " and ",
  "UI-UMI-STOPKA-L2": "Module 5 — Functional vs protective earthing",
}
