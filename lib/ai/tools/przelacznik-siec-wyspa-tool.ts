/**
 * Narzędzie AI (9.3) dla M14 — D11 „Przełącznik sieć/wyspa i bezpieczeństwo” (wspólny Dom/Firma).
 * `operationType: 'read'`. Echo silnika `siec/przelacznik-siec-wyspa`: twarde stopy 1–3 rozdziału —
 * zasilanie zwrotne sieci (backfeed), agregat bez przełącznika, agregat spalinowy w budynku (CO).
 * Odpowiedzi o przełączniku i agregacie tylko od usera — model ich nie zgaduje (null = brak odpowiedzi).
 */
import { z } from "zod"
import { calculatePrzelacznik } from "@/lib/core/modules/siec/przelacznik-siec-wyspa/calculator"
import type { AiToolDefinition } from "../types"
import { MiejsceAgregatuSchema, PodlaczenieAgregatuSchema } from "./agregat-bezpieczenstwo-schema"
import { tekstyOstrzezen, tekstyZalozen } from "./teksty-wyniku"

export const PrzelacznikSiecWyspaToolInput = z.object({
  trybPracy: z
    .enum(["przelaczany", "rownolegle", "bez-sieci"])
    .nullable()
    .describe("Jak instalacja spotyka się z siecią: przełączana (sieć albo wyspa), równoległa (mikroinstalacja), bez sieci; null gdy user nie odpowiedział"),
  przelacznik: z
    .enum(["reczny-z-zerem-blokada", "szr-blokada-el-mech", "brak-lub-bez-blokady"])
    .nullable()
    .describe("Urządzenie przełączające (tylko tryb przełączany): ręczny 1-0-2 z blokadą, SZR z blokadą elektryczną i mechaniczną, brak/bez blokady; null gdy nie wiadomo"),
  przelaczaN: z.boolean().nullable().describe("Czy przełącznik przełącza też przewód N razem z fazami; null gdy user nie wie"),
  zgloszenieOsd: z
    .boolean()
    .nullable()
    .describe("Tryb równoległy: czy mikroinstalacja jest zgłoszona do OSD (z certyfikatem NC RfG); null gdy brak odpowiedzi"),
  maAgregat: z.boolean().describe("Czy agregat zasila instalację budynku"),
  miejsceAgregatu: MiejsceAgregatuSchema,
  podlaczenieAgregatu: PodlaczenieAgregatuSchema,
})
export type PrzelacznikSiecWyspaToolInputT = z.infer<typeof PrzelacznikSiecWyspaToolInput>

export const PrzelacznikSiecWyspaToolOutput = z.object({
  status: z.enum(["VALID", "VALID_WITH_WARNINGS", "INCOMPLETE", "OUT_OF_SCOPE", "INVALID_INPUT"]),
  backfeed: z.boolean(),
  twardeStopy: z.number(),
  ostrzezenia: z.array(z.string()),
  zalozenia: z.array(z.string()),
  wersjaKalkulatora: z.string(),
})
export type PrzelacznikSiecWyspaToolOutputT = z.infer<typeof PrzelacznikSiecWyspaToolOutput>

export const przelacznikSiecWyspaTool: AiToolDefinition<PrzelacznikSiecWyspaToolInputT, PrzelacznikSiecWyspaToolOutputT> = {
  name: "sprawdz_przelacznik_siec_wyspa",
  description:
    "Sprawdza bezpieczeństwo połączenia instalacji wyspowej/hybrydowej z siecią i agregatem (M14, D11): czy nie ma " +
    "zasilania zwrotnego sieci (backfeed — twardy stop, zagrożenie życia monterów OSD), czy agregat nie pracuje bez " +
    "przełącznika albo w budynku (czad — twardy stop), czy przełącznik ma blokadę i przełącza N, czy praca równoległa " +
    "jest zgłoszona do OSD. Twardych stopów nigdy nie łagodź. Odpowiedzi podaje user — nie zgaduj. Użyj, gdy user " +
    "pyta, jak bezpiecznie przełączać między siecią, wyspą i agregatem albo czy jego przełącznik jest poprawny.",
  inputSchema: PrzelacznikSiecWyspaToolInput,
  outputSchema: PrzelacznikSiecWyspaToolOutput,
  operationType: "read",
  requiresConfirmation: false,
  scope: "siec/przelacznik-siec-wyspa",
  handler: async (input) => {
    const wynik = calculatePrzelacznik({
      ...input,
      miejsceAgregatu: input.miejsceAgregatu ?? null,
      podlaczenieAgregatu: input.podlaczenieAgregatu ?? null,
    })
    return {
      status: wynik.status,
      ...wynik.value,
      ostrzezenia: tekstyOstrzezen(wynik.warnings),
      zalozenia: tekstyZalozen(wynik.assumptions),
      wersjaKalkulatora: wynik.calculatorVersion,
    }
  },
}
