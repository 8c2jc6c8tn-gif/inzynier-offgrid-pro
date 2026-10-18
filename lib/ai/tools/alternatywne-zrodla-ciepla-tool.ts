/**
 * Narzędzie AI (9.3) dla Modułu 6 — Część 2A "Alternatywne i uzupełniające źródła ciepła" (dawne 5.32–5.36).
 * `operationType: 'read'`. Moce, udziały, gęstość i ciepło topnienia PCM MUSZĄ pochodzić od usera (Dyrektywa #1).
 */
import { z } from "zod"
import { STATUSY } from "@/lib/core/calc-result"
import { calculateAlternatywneZrodlaCiepla } from "@/lib/core/modules/ogrzewanie/alternatywne-zrodla-ciepla/calculator"
import type { AiToolDefinition } from "../types"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const AlternatywneZrodlaCieplaToolInput = z.object({
  zrodlo: z.enum(["kominek", "kociol-elektryczny", "ir", "maty", "pcm"]).nullable().describe("Karta źródła; kocioł elektryczny ma osobne narzędzie"),
  zapotrzebowanieKw: z.number().describe("Zapotrzebowanie w mroźny dzień [kW] do pokrycia %; 0 = bez"),
  kominekMocKw: z.number().describe("Kominek: moc nominalna [kW]; 0 dla innych kart"),
  kominekDoWodyPct: z.number().describe("Kominek: udział mocy do wody [%]"),
  kominekZabezpieczenieBezPradu: z.boolean().describe("Kominek: jest schładzanie grawitacyjne / zabezpieczenie przy braku prądu"),
  irMocW: z.number().describe("IR: moc paneli [W]"),
  irGodzinNaDobe: z.number().describe("IR: godziny pracy na dobę [h]"),
  irJakoPodstawowe: z.boolean().describe("IR planowane jako ogrzewanie podstawowe"),
  matyMocWm2: z.number().describe("Maty kapilarne: moc jednostkowa [W/m²] z karty"),
  matyPowierzchniaM2: z.number().describe("Maty kapilarne: powierzchnia aktywna [m²]"),
  matyStropNieizolowany: z.boolean().describe("Maty na suficie pod nieizolowanym stropem"),
  pcmObjetoscL: z.number().describe("PCM: objętość [l]"),
  pcmGestoscKgL: z.number().describe("PCM: gęstość z karty materiału [kg/l]"),
  pcmCieploTopnieniaKjKg: z.number().describe("PCM: ciepło topnienia z karty [kJ/kg]"),
  buforDeltaTK: z.number().describe("Bufor wodny do porównania: użyteczne ΔT [K]; 0 = bez porównania"),
})
export type AlternatywneZrodlaCieplaToolInputT = z.infer<typeof AlternatywneZrodlaCieplaToolInput>

export const AlternatywneZrodlaCieplaToolOutput = z.object({
  status: z.enum(STATUSY),
  kominekDoWodyKw: z.number().nullable(),
  kominekDoPowietrzaKw: z.number().nullable(),
  matyMocKw: z.number().nullable(),
  pokrycieZapotrzebowaniaPct: z.number().nullable(),
  kominekPokrycieRazemPct: z.number().nullable(),
  irEnergiaKwhDoba: z.number().nullable(),
  pcmEnergiaKwh: z.number().nullable(),
  rownowaznikWodyL: z.number().nullable(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type AlternatywneZrodlaCieplaToolOutputT = z.infer<typeof AlternatywneZrodlaCieplaToolOutput>

export const alternatywneZrodlaCieplaTool: AiToolDefinition<AlternatywneZrodlaCieplaToolInputT, AlternatywneZrodlaCieplaToolOutputT> = {
  name: "porownaj_alternatywne_zrodla_ciepla",
  description:
    "Karty alternatywnych i uzupełniających źródeł ciepła: kominek z płaszczem wodnym (moc do wody i do pomieszczenia, " +
    "pokrycie zapotrzebowania, ryzyko przegrzania bez prądu), promienniki IR (kWh na dobę), maty kapilarne (moc i " +
    "pokrycie) oraz magazyn PCM (kWh ciepła utajonego i równoważny bufor wodny). Użyj, gdy user pyta, czy kominek z " +
    "płaszczem albo panele IR uzupełnią pompę ciepła, ile prądu zjedzą promienniki, czy maty na suficie wystarczą, " +
    "ile wody zastąpi magazyn PCM albo czy kominek przegrzeje się przy braku prądu.",
  inputSchema: AlternatywneZrodlaCieplaToolInput,
  outputSchema: AlternatywneZrodlaCieplaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "ogrzewanie/alternatywne-zrodla-ciepla",
  handler: async (input) => {
    const wynik = calculateAlternatywneZrodlaCiepla(input)
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
