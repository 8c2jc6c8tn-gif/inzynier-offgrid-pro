/**
 * Zod schemas for the generator safety answers (D45) shared by the M2/E17 and M7/E8 AI tools.
 * Optional: when the user has not said where the generator stands or how it is connected, the
 * model passes nothing — it must not guess.
 */
import { z } from "zod"

export const MiejsceAgregatuSchema = z
  .enum(["na-zewnatrz", "pomieszczenie-wydzielone", "wewnatrz-budynku"])
  .nullable()
  .optional()
  .describe("Gdzie pracuje agregat — tylko gdy user to podał; nie zgaduj")

export const PodlaczenieAgregatuSchema = z
  .enum(["przez-przelacznik", "bez-przelacznika", "wejscie-ac-falownika", "tylko-odbiorniki"])
  .nullable()
  .optional()
  .describe("Jak agregat zasila odbiorniki — tylko gdy user to podał; nie zgaduj")
