import { describe, expect, it } from "vitest"
import { dictionaries } from "@/lib/i18n/dictionaries"
import { KLUCZ_BLEDU_PVGIS, KOMUNIKAT_PVGIS } from "../dane-tmy"

describe("klucze błędów PVGIS dla ekranów", () => {
  it("każdy kod ma klucz tłumaczenia w PL/EN/RU, a polski tekst zgadza się z komunikatem narzędzi AI", () => {
    for (const kod of Object.keys(KOMUNIKAT_PVGIS) as (keyof typeof KOMUNIKAT_PVGIS)[]) {
      const klucz = KLUCZ_BLEDU_PVGIS[kod]
      for (const jezyk of ["pl", "en", "ru"] as const) expect(dictionaries[jezyk][klucz], `${klucz}/${jezyk}`).toBeTruthy()
      expect(dictionaries.pl[klucz]).toBe(KOMUNIKAT_PVGIS[kod])
    }
  })
})
