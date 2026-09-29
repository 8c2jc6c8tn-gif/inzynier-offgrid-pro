import { describe, expect, it } from "vitest"
import { obudowaNiepolaczonaZGsw } from "@/lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne/warnings"
import { calculateUziemienieMaleInstalacje } from "../calculator"
import type { UziemienieMaleInstalacjeInput } from "../input"

const ac: UziemienieMaleInstalacjeInput = {
  rodzaj: "ac230",
  miejsce: "kamper",
  obudowaFalownikaUziemiona: "tak",
  gniazdaZeStykiemOchronnym: "tak",
}
const dc: UziemienieMaleInstalacjeInput = { rodzaj: "dc", miejsce: "garaz", obudowaFalownikaUziemiona: null, gniazdaZeStykiemOchronnym: null }
const kody = (r: ReturnType<typeof calculateUziemienieMaleInstalacje>) => r.warnings.map((w) => w.code)

describe("calculateUziemienieMaleInstalacje (M12/E38, echo M5/E11)", () => {
  it("brak rodzaju albo miejsca → INCOMPLETE, bez wartości domyślnych", () => {
    expect(calculateUziemienieMaleInstalacje({ ...ac, rodzaj: null }).status).toBe("INCOMPLETE")
    expect(calculateUziemienieMaleInstalacje({ ...ac, miejsce: null }).status).toBe("INCOMPLETE")
    expect(calculateUziemienieMaleInstalacje({ ...ac, miejsce: null }).value.wymaganeUziemienieOchronne).toBeNull()
  })

  it("230 V bez odpowiedzi na pytania kontrolne → INCOMPLETE (brak danych nigdy nie znaczy „OK”, 3.3)", () => {
    expect(calculateUziemienieMaleInstalacje({ ...ac, obudowaFalownikaUziemiona: null }).status).toBe("INCOMPLETE")
    expect(calculateUziemienieMaleInstalacje({ ...ac, gniazdaZeStykiemOchronnym: null }).status).toBe("INCOMPLETE")
    expect(calculateUziemienieMaleInstalacje({ ...ac, gniazdaZeStykiemOchronnym: null }).warnings).toEqual([])
  })

  it("12/24 V DC w garażu → VALID, uziemienie ochronne niewymagane, pytania o falownik nie dotyczą", () => {
    const r = calculateUziemienieMaleInstalacje(dc)
    expect(r.status).toBe("VALID")
    expect(r.value).toEqual({ wymaganeUziemienieOchronne: false, zalecaneZeWzgleduNaWilgoc: false })
    expect(kody(r)).toEqual(["UMI-DC-BEZ-UZIEMIENIA-OCHRONNEGO"])
    expect(r.assumptions).toEqual([{ kod: "UMI-ZALOZENIE-BEZ-UZIOMU-BUDYNKOWEGO" }])
  })

  it.each(["jacht", "zewnatrz"] as const)("DC — %s (wilgoć wg źródła) → 🟡 zalecane uziemienie (D52), bez stopu", (miejsce) => {
    const r = calculateUziemienieMaleInstalacje({ ...dc, miejsce })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value.zalecaneZeWzgleduNaWilgoc).toBe(true)
    expect(kody(r)).toEqual(["UMI-DC-BEZ-UZIEMIENIA-OCHRONNEGO", "UMI-WILGOC-ZALECANE-UZIEMIENIE"])
    expect(r.warnings.find((w) => w.code === "UMI-WILGOC-ZALECANE-UZIEMIENIE")?.level).toBe("warning")
    expect(r.warnings.some((w) => w.level === "critical")).toBe(false)
  })

  it("230 V na jachcie, wszystko uziemione → VALID, bez ostrzeżenia o wilgoci (uziemienie już jest)", () => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, miejsce: "jacht" })
    expect(r.status).toBe("VALID")
    expect(r.value).toEqual({ wymaganeUziemienieOchronne: true, zalecaneZeWzgleduNaWilgoc: true })
    expect(r.warnings).toEqual([])
  })

  it.each(["garaz", "kamper"] as const)("%s — brak zalecenia „wilgoć” (źródło wymienia tylko jacht i na zewnątrz)", (miejsce) => {
    expect(calculateUziemienieMaleInstalacje({ ...dc, miejsce }).value.zalecaneZeWzgleduNaWilgoc).toBe(false)
  })

  it("230 V: obudowa uziemiona i gniazda ze stykiem → VALID, uziemienie wymagane i spełnione", () => {
    const r = calculateUziemienieMaleInstalacje(ac)
    expect(r.status).toBe("VALID")
    expect(r.value).toEqual({ wymaganeUziemienieOchronne: true, zalecaneZeWzgleduNaWilgoc: false })
    expect(r.warnings).toEqual([])
    expect(r.assumptions).toEqual([{ kod: "UMI-ZALOZENIE-BEZ-UZIOMU-BUDYNKOWEGO" }, { kod: "UMI-ZALOZENIE-NIE-WIEM-JAK-NIE" }])
  })

  it.each(["nie", "nie-wiem"] as const)("230 V: obudowa falownika „%s” → 🔴, poziom z M5/E11 (echo)", (odp) => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, obudowaFalownikaUziemiona: odp })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(kody(r)).toEqual(["UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA"])
    expect(r.warnings[0].level).toBe("critical")
    expect(r.warnings[0].level).toBe(obudowaNiepolaczonaZGsw().level)
    expect(r.warnings[0].field).toBe("obudowaFalownikaUziemiona")
  })

  it.each(["nie", "nie-wiem"] as const)("230 V: gniazda bez styku ochronnego „%s” → 🟡 (D52), bez twardego stopu", (odp) => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, gniazdaZeStykiemOchronnym: odp })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(kody(r)).toEqual(["UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO"])
    expect(r.warnings[0].level).toBe("warning")
    expect(r.warnings[0].field).toBe("gniazdaZeStykiemOchronnym")
  })

  it("230 V na jachcie, oba braki → 🔴 obudowa + 🟡 gniazda; bez osobnego ostrzeżenia o wilgoci", () => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, miejsce: "jacht", obudowaFalownikaUziemiona: "nie", gniazdaZeStykiemOchronnym: "nie" })
    expect(kody(r)).toEqual(["UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA", "UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO"])
    expect(r.warnings.map((w) => w.level)).toEqual(["critical", "warning"])
    expect(r.value).toEqual({ wymaganeUziemienieOchronne: true, zalecaneZeWzgleduNaWilgoc: true })
  })

  it("i18n (17.2): ostrzeżenia bez tekstu wprost, tylko i18nKey", () => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, miejsce: "zewnatrz", obudowaFalownikaUziemiona: "nie", gniazdaZeStykiemOchronnym: "nie-wiem" })
    expect(r.warnings.every((w) => w.message === undefined && typeof w.i18nKey === "string")).toBe(true)
  })
})
