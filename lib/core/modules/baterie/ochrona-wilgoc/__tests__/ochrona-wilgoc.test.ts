import { describe, expect, it } from "vitest"
import { calculateOchronaWilgoc } from "../calculator"

describe("calculateOchronaWilgoc", () => {
  it("punkt rosy zgodny z przykładem źródła (-5°C/85% → ok. -7°C), niezależnie zweryfikowany w Pythonie", () => {
    const result = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: -5,
      wilgotnoscPct: 85,
      temperaturaObudowyC: -20,
      srodowiskoWilgotne: false,
      ipKod: 20,
    })
    expect(result.value.punktRosyC).toBeCloseTo(-7.124186122619172, 6)
  })

  it("VALID_WITH_WARNINGS — obudowa poniżej punktu rosy: ryzyko kondensacji", () => {
    const result = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: -10,
      wilgotnoscPct: 90,
      temperaturaObudowyC: -15,
      srodowiskoWilgotne: false,
      ipKod: 20,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.ryzykoKondensacji).toBe(true)
    expect(result.warnings.some((w) => w.code === "RYZYKO-KONDENSACJI")).toBe(true)
  })

  it("VALID — obudowa powyżej punktu rosy: brak ryzyka", () => {
    const result = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: 20,
      wilgotnoscPct: 40,
      temperaturaObudowyC: 15,
      srodowiskoWilgotne: false,
      ipKod: 20,
    })
    expect(result.status).toBe("VALID")
    expect(result.value.ryzykoKondensacji).toBe(false)
    expect(result.warnings[0].code).toBe("BEZPIECZNY-MARGINES")
  })

  it("VALID_WITH_WARNINGS (twardy stop) — IP54 w środowisku wilgotnym, poniżej wymaganego IP55", () => {
    const result = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: 20,
      wilgotnoscPct: 40,
      temperaturaObudowyC: 15,
      srodowiskoWilgotne: true,
      ipKod: 54,
    })
    expect(result.status).toBe("VALID_WITH_WARNINGS")
    expect(result.value.ipWystarczajace).toBe(false)
    const w = result.warnings.find((w) => w.code === "IP-PONIZEJ-WYMAGANEGO")
    expect(w?.level).toBe("critical")
  })

  it("VALID — IP55 w środowisku wilgotnym wystarcza (granica włącznie)", () => {
    const result = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: 20,
      wilgotnoscPct: 40,
      temperaturaObudowyC: 15,
      srodowiskoWilgotne: true,
      ipKod: 55,
    })
    expect(result.value.ipWystarczajace).toBe(true)
    expect(result.status).toBe("VALID")
  })

  it("INCOMPLETE — pola jeszcze nie wpisane", () => {
    const result = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: null,
      wilgotnoscPct: 40,
      temperaturaObudowyC: 15,
      srodowiskoWilgotne: false,
      ipKod: 20,
    })
    expect(result.status).toBe("INCOMPLETE")
  })

  it("INVALID_INPUT — wilgotność poza zakresem [0,100]", () => {
    const result = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: 20,
      wilgotnoscPct: 150,
      temperaturaObudowyC: 15,
      srodowiskoWilgotne: false,
      ipKod: 20,
    })
    expect(result.status).toBe("INVALID_INPUT")
  })

  it("i18n (17.2): ostrzeżenia i assumption zwracają i18nKey/params, nie gotowy tekst", () => {
    const kondensacja = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: -10,
      wilgotnoscPct: 90,
      temperaturaObudowyC: -15,
      srodowiskoWilgotne: false,
      ipKod: 20,
    })
    const kw = kondensacja.warnings.find((w) => w.code === "RYZYKO-KONDENSACJI")
    expect(kw?.i18nKey).toBe("RYZYKO-KONDENSACJI")
    expect(kw?.message).toBeUndefined()
    expect(kondensacja.assumptions).toEqual([{ kod: "PUNKT-ROSY-WZOR-MAGNUSA" }])

    const bezpieczne = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: 20,
      wilgotnoscPct: 40,
      temperaturaObudowyC: 15,
      srodowiskoWilgotne: false,
      ipKod: 20,
    })
    expect(bezpieczne.warnings[0].i18nKey).toBe("BEZPIECZNY-MARGINES")

    const ipZly = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: 20,
      wilgotnoscPct: 40,
      temperaturaObudowyC: 15,
      srodowiskoWilgotne: true,
      ipKod: 54,
    })
    const ipWarning = ipZly.warnings.find((w) => w.code === "IP-PONIZEJ-WYMAGANEGO")
    expect(ipWarning?.i18nKey).toBe("IP-PONIZEJ-WYMAGANEGO")
    expect(ipWarning?.params).toEqual({ ip: 54, min: 55 })

    const zlaWilgotnosc = calculateOchronaWilgoc({
      temperaturaOtoczeniaC: 20,
      wilgotnoscPct: 150,
      temperaturaObudowyC: 15,
      srodowiskoWilgotne: false,
      ipKod: 20,
    })
    expect(zlaWilgotnosc.warnings[0].i18nKey).toBe("WILGOTNOSC-POZA-ZAKRESEM")
  })
})
