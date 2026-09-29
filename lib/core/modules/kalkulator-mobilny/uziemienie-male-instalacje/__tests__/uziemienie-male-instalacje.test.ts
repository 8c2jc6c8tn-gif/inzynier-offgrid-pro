import { describe, expect, it } from "vitest"
import { obudowaNiepolaczonaZGsw } from "@/lib/core/modules/okablowanie/uziemienie-funkcjonalne-ochronne/warnings"
import { progPowyzejOchronyOsob } from "@/lib/core/modules/okablowanie/wylaczniki-rcd/warnings"
import { calculateUziemienieMaleInstalacje } from "../calculator"
import type { UziemienieMaleInstalacjeInput } from "../input"

const ac: UziemienieMaleInstalacjeInput = {
  rodzaj: "ac230",
  miejsce: "garaz",
  obudowaFalownikaUziemiona: "tak",
  gniazdaZeStykiemOchronnym: "tak",
  polaczenieNPE: "tak",
  rcd30mA: "tak",
  zasilanieZewnetrzne: null,
  npeRozlaczanePrzyZasilaniuZewnetrznym: null,
}
const dc: UziemienieMaleInstalacjeInput = {
  rodzaj: "dc",
  miejsce: "garaz",
  obudowaFalownikaUziemiona: null,
  gniazdaZeStykiemOchronnym: null,
  polaczenieNPE: null,
  rcd30mA: null,
  zasilanieZewnetrzne: null,
  npeRozlaczanePrzyZasilaniuZewnetrznym: null,
}
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
    expect(calculateUziemienieMaleInstalacje({ ...ac, polaczenieNPE: null }).status).toBe("INCOMPLETE")
    expect(calculateUziemienieMaleInstalacje({ ...ac, rcd30mA: null }).status).toBe("INCOMPLETE")
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

  it("230 V na jachcie, wszystko uziemione → VALID, bez ostrzeżenia o wilgoci (uziemienie już jest); ℹ️ zasady jachtu (D57)", () => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, miejsce: "jacht", zasilanieZewnetrzne: "nie" })
    expect(r.status).toBe("VALID")
    expect(r.value).toEqual({ wymaganeUziemienieOchronne: true, zalecaneZeWzgleduNaWilgoc: true })
    expect(kody(r)).toEqual(["UMI-JACHT-POLACZENIE-W-JEDNYM-PUNKCIE"])
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

  it.each(["nie", "nie-wiem"] as const)("230 V: brak połączenia N–PE „%s” → 🔴, pętla zwarcia otwarta (D56)", (odp) => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, polaczenieNPE: odp })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(kody(r)).toEqual(["UMI-BRAK-POLACZENIA-N-PE"])
    expect(r.warnings[0].level).toBe("critical")
    expect(r.warnings[0].field).toBe("polaczenieNPE")
  })

  it.each(["nie", "nie-wiem"] as const)("230 V: brak RCD 30 mA „%s” → 🔴, poziom z M5 PROG-POWYZEJ-OCHRONY-OSOB (echo, D56)", (odp) => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, rcd30mA: odp })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(kody(r)).toEqual(["UMI-BRAK-RCD-30MA"])
    expect(r.warnings[0].level).toBe("critical")
    expect(r.warnings[0].level).toBe(progPowyzejOchronyOsob(30).level)
    expect(r.warnings[0].field).toBe("rcd30mA")
  })

  it("DC: pytania o N–PE i RCD nie dotyczą — null nie daje INCOMPLETE ani ostrzeżeń pętli zwarcia", () => {
    const r = calculateUziemienieMaleInstalacje(dc)
    expect(r.status).toBe("VALID")
    expect(kody(r).some((k) => k === "UMI-BRAK-POLACZENIA-N-PE" || k === "UMI-BRAK-RCD-30MA")).toBe(false)
  })

  it("230 V na jachcie, oba braki → 🔴 obudowa + 🟡 gniazda; bez osobnego ostrzeżenia o wilgoci", () => {
    const r = calculateUziemienieMaleInstalacje({
      ...ac,
      miejsce: "jacht",
      zasilanieZewnetrzne: "nie",
      obudowaFalownikaUziemiona: "nie",
      gniazdaZeStykiemOchronnym: "nie",
    })
    expect(kody(r)).toEqual(["UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA", "UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO", "UMI-JACHT-POLACZENIE-W-JEDNYM-PUNKCIE"])
    expect(r.warnings.map((w) => w.level)).toEqual(["critical", "warning", "info"])
    expect(r.value).toEqual({ wymaganeUziemienieOchronne: true, zalecaneZeWzgleduNaWilgoc: true })
  })

  it("i18n (17.2): ostrzeżenia bez tekstu wprost, tylko i18nKey", () => {
    const r = calculateUziemienieMaleInstalacje({ ...ac, miejsce: "zewnatrz", obudowaFalownikaUziemiona: "nie", gniazdaZeStykiemOchronnym: "nie-wiem" })
    expect(r.warnings.every((w) => w.message === undefined && typeof w.i18nKey === "string")).toBe(true)
  })

  describe("D57 — słupek/keja, namiot, kamper, jacht", () => {
    const kamper: UziemienieMaleInstalacjeInput = { ...ac, miejsce: "kamper", zasilanieZewnetrzne: "nie" }

    it("kamper: pytanie o zasilanie z zewnątrz obowiązkowe (INCOMPLETE bez odpowiedzi); garaż go nie zadaje", () => {
      expect(calculateUziemienieMaleInstalacje({ ...kamper, zasilanieZewnetrzne: null }).status).toBe("INCOMPLETE")
      expect(calculateUziemienieMaleInstalacje(ac).status).toBe("VALID")
    })

    it("kamper bez usterek → VALID z ℹ️ „wiszący przewód nie jest uziemieniem”", () => {
      const r = calculateUziemienieMaleInstalacje(kamper)
      expect(r.status).toBe("VALID")
      expect(kody(r)).toEqual(["UMI-KAMPER-WISZACY-PRZEWOD"])
      expect(r.warnings[0].level).toBe("info")
    })

    it("kamper DC → też ℹ️ o wiszącym przewodzie, bez pytań o słupek", () => {
      expect(kody(calculateUziemienieMaleInstalacje({ ...dc, miejsce: "kamper" }))).toEqual([
        "UMI-DC-BEZ-UZIEMIENIA-OCHRONNEGO",
        "UMI-KAMPER-WISZACY-PRZEWOD",
      ])
    })

    it("słupek + N–PE w falowniku: bez odpowiedzi o rozłączaniu → INCOMPLETE", () => {
      expect(calculateUziemienieMaleInstalacje({ ...kamper, zasilanieZewnetrzne: "tak" }).status).toBe("INCOMPLETE")
    })

    it.each(["nie", "nie-wiem"] as const)("słupek, N–PE nierozłączane „%s” → 🔴 podwójne połączenie N–PE", (odp) => {
      const r = calculateUziemienieMaleInstalacje({ ...kamper, zasilanieZewnetrzne: "tak", npeRozlaczanePrzyZasilaniuZewnetrznym: odp })
      expect(kody(r)).toEqual(["UMI-PODWOJNE-POLACZENIE-N-PE", "UMI-KAMPER-WISZACY-PRZEWOD"])
      expect(r.warnings[0].level).toBe("critical")
      expect(r.warnings[0].field).toBe("npeRozlaczanePrzyZasilaniuZewnetrznym")
    })

    it("słupek, N–PE rozłączane przekaźnikiem → bez stopu", () => {
      const r = calculateUziemienieMaleInstalacje({ ...kamper, zasilanieZewnetrzne: "tak", npeRozlaczanePrzyZasilaniuZewnetrznym: "tak" })
      expect(r.status).toBe("VALID")
    })

    it("słupek, ale falownik bez N–PE → stop braku N–PE, pytanie o rozłączanie nie dotyczy", () => {
      const r = calculateUziemienieMaleInstalacje({ ...kamper, zasilanieZewnetrzne: "tak", polaczenieNPE: "nie" })
      expect(kody(r)).toEqual(["UMI-BRAK-POLACZENIA-N-PE", "UMI-KAMPER-WISZACY-PRZEWOD"])
    })

    it("jacht z kei → ℹ️ zasady jachtu i separator galwaniczny (Wzorzec C, bez stopu)", () => {
      const r = calculateUziemienieMaleInstalacje({
        ...ac,
        miejsce: "jacht",
        zasilanieZewnetrzne: "tak",
        npeRozlaczanePrzyZasilaniuZewnetrznym: "tak",
      })
      expect(r.status).toBe("VALID")
      expect(kody(r)).toEqual(["UMI-JACHT-POLACZENIE-W-JEDNYM-PUNKCIE", "UMI-JACHT-KEJA-SEPARATOR-GALWANICZNY"])
      expect(r.warnings.every((w) => w.level === "info")).toBe(true)
    })

    const namiot: UziemienieMaleInstalacjeInput = { ...dc, rodzaj: "ac230", miejsce: "namiot" }

    it("namiot 230 V: bez odpowiedzi o N–PE → INCOMPLETE", () => {
      expect(calculateUziemienieMaleInstalacje(namiot).status).toBe("INCOMPLETE")
    })

    it("namiot, wyjście pływające → 🟡 zasady, nie 🔴; pytania o obudowę/gniazda/RCD nie dotyczą", () => {
      const r = calculateUziemienieMaleInstalacje({ ...namiot, polaczenieNPE: "nie" })
      expect(r.status).toBe("VALID_WITH_WARNINGS")
      expect(kody(r)).toEqual(["UMI-NAMIOT-WYJSCIE-PLYWAJACE"])
      expect(r.warnings[0].level).toBe("warning")
      expect(r.warnings[0].i18nKey).toBe("UMI-NAMIOT-WYJSCIE-PLYWAJACE")
      expect(r.value.wymaganeUziemienieOchronne).toBe(false)
    })

    it("namiot, „nie wiem” → 🟡 z poleceniem sprawdzenia instrukcji (osobny tekst)", () => {
      const r = calculateUziemienieMaleInstalacje({ ...namiot, polaczenieNPE: "nie-wiem" })
      expect(r.warnings[0].level).toBe("warning")
      expect(r.warnings[0].i18nKey).toBe("UMI-NAMIOT-WYJSCIE-NIEZNANE")
    })

    it("namiot, falownik z N–PE → jak kamper: pełne pytania, brak RCD = 🔴", () => {
      const pelne = { ...ac, miejsce: "namiot" as const }
      expect(calculateUziemienieMaleInstalacje({ ...pelne, rcd30mA: null }).status).toBe("INCOMPLETE")
      expect(calculateUziemienieMaleInstalacje(pelne).status).toBe("VALID")
      expect(kody(calculateUziemienieMaleInstalacje({ ...pelne, rcd30mA: "nie" }))).toEqual(["UMI-BRAK-RCD-30MA"])
    })

    it("namiot DC → 🟡 wilgoć (namiot = na zewnątrz)", () => {
      expect(calculateUziemienieMaleInstalacje({ ...dc, miejsce: "namiot" }).value.zalecaneZeWzgleduNaWilgoc).toBe(true)
    })
  })
})
