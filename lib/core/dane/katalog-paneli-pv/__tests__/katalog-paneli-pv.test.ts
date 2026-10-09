import { existsSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV, znajdzPanelKatalogu } from "../index"

describe("katalog paneli PV", () => {
  it("identyfikatory są unikalne, a każdy wpis wskazuje istniejący plik źródłowy w repo", () => {
    expect(new Set(KATALOG_PANELI_PV.map((p) => p.id)).size).toBe(KATALOG_PANELI_PV.length)
    for (const p of KATALOG_PANELI_PV) expect(existsSync(p.zrodlo), p.zrodlo).toBe(true)
  })

  it("każdy wpis ma obrazy karty serwowane z public/ (potwierdzenie danych klikane w aplikacji)", () => {
    for (const p of KATALOG_PANELI_PV) {
      // A card without images in the repo (read from the manufacturer's page) must at least give the address to open it.
      if (p.kartaObrazy.length === 0) expect(p.zrodloUrl, p.id).toMatch(/^https:\/\//)
      else expect(p.kartaObrazy.length, p.id).toBeGreaterThan(0)
      for (const obraz of p.kartaObrazy) expect(existsSync(`public${obraz}`), obraz).toBe(true)
    }
  })

  it("JA Solar: moc, γ i NOCT zgodne z transkrypcją karty; brakujące parametry karty to null, nie wartości typowe", () => {
    const zrodlo = readFileSync(KATALOG_PANELI_PV[0]!.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax): **−0,290%/°C**")
    expect(zrodlo).toContain("NOCT | 45±2°C")
    const p500 = znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!
    expect(p500).toMatchObject({ pmaxW: 500, gammaPctNaC: -0.29, noctC: 45, bifacjalny: true })
    expect(p500.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(p500.degradacjaPierwszyRokPct).toBe(1)
    expect(p500.degradacjaLiniowaPctNaRok).toBe(0.4)
    expect(p500.kartaObrazy).toHaveLength(2)
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("ja-solar-jam60d41")).map((p) => p.pmaxW)).toEqual([485, 490, 495, 500, 505, 510])
  })

  it("Astronergy N5: γ, NMOT (jako noctC) i degradacja zgodne z transkrypcją karty; brak sprawności przy 200 W/m² to null", () => {
    const p595 = znajdzPanelKatalogu("astronergy-n5-chsm72n-595")!
    const zrodlo = readFileSync(p595.zrodlo, "utf8")
    expect(zrodlo).toContain("**−0,29%/°C**")
    expect(zrodlo).toContain("**41 ± 2 °C**")
    expect(zrodlo).toContain("≤ 1,0%")
    expect(zrodlo).toContain("≤ 0,4% rocznie")
    expect(p595).toMatchObject({ pmaxW: 595, gammaPctNaC: -0.29, noctC: 41, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(p595.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(p595.kartaObrazy).toHaveLength(2)
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("astronergy")).map((p) => p.pmaxW)).toEqual([570, 575, 580, 585, 590, 595])
  })

  it("JA Solar JAM54D41: γ, NOCT i degradacja zgodne z transkrypcją karty (440–465 W)", () => {
    const p465 = znajdzPanelKatalogu("ja-solar-jam54d41-lb-465")!
    const zrodlo = readFileSync(p465.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax): **−0,290%/°C**")
    expect(zrodlo).toContain("NOCT | 45±2 °C")
    expect(p465).toMatchObject({ pmaxW: 465, gammaPctNaC: -0.29, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(p465.kartaObrazy).toHaveLength(2)
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("ja-solar-jam54d41")).map((p) => p.pmaxW)).toEqual([440, 445, 450, 455, 460, 465])
  })

  it("Hyundai HiT-H5xxCF-BF(ZB): γ −0,24, NMOT 44 (jako noctC) i degradacja 1% + 0,3 p.p./rok zgodne z transkrypcją karty", () => {
    const p520 = znajdzPanelKatalogu("hyundai-hit-h5xxcf-bf-zb-520")!
    const zrodlo = readFileSync(p520.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax): **−0,24%/°C**")
    expect(zrodlo).toContain("**44 ± 2 °C**")
    expect(zrodlo).toContain("90,3%")
    expect(p520).toMatchObject({ pmaxW: 520, gammaPctNaC: -0.24, noctC: 44, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.3, bifacjalny: true })
    expect(p520.sprawnoscWzglednaPrzy200WPct).toBeNull()
    // 100% − 1% − 29 × 0,3% = 90,3% — the card's 30-year guarantee
    expect(100 - p520.degradacjaPierwszyRokPct! - 29 * p520.degradacjaLiniowaPctNaRok!).toBeCloseTo(90.3, 6)
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("hyundai")).map((p) => p.pmaxW)).toEqual([500, 505, 510, 515, 520])
  })

  it("JA Solar JAM54D40 LR: jednostronny, γ/NOCT/degradacja z karty, sprawność względna przy 200 W/m² wyliczona z mocy na karcie", () => {
    const p450 = znajdzPanelKatalogu("ja-solar-jam54d40-lr-450")!
    const zrodlo = readFileSync(p450.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax): **−0,290%/°C**")
    expect(zrodlo).toContain("**45±2 °C**")
    expect(zrodlo).toContain("87/90 = 96,7%")
    expect(p450).toMatchObject({ pmaxW: 450, gammaPctNaC: -0.29, noctC: 45, bifacjalny: false, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4 })
    expect(p450.sprawnoscWzglednaPrzy200WPct).toBe(96.7)
    expect(znajdzPanelKatalogu("ja-solar-jam54d40-lr-475")!.sprawnoscWzglednaPrzy200WPct).toBe(96.8)
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("ja-solar-jam54d40-lr")).map((p) => p.pmaxW)).toEqual([450, 455, 460, 465, 470, 475])
  })

  it("JA Solar JAM60D40 LB: dane zgodne z transkrypcją karty (te same liczby co JAM60D41 LB), rama srebrna to osobny wpis", () => {
    const p510 = znajdzPanelKatalogu("ja-solar-jam60d40-lb-510")!
    const zrodlo = readFileSync(p510.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax) **−0,290%/°C**")
    expect(zrodlo).toContain("**45±2 °C**")
    expect(p510).toMatchObject({ pmaxW: 510, gammaPctNaC: -0.29, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(p510.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("ja-solar-jam60d40")).map((p) => p.pmaxW)).toEqual([485, 490, 495, 500, 505, 510])
  })

  it("JA Solar JAM66D46 LB (duży format): dane zgodne z transkrypcją karty", () => {
    const p715 = znajdzPanelKatalogu("ja-solar-jam66d46-lb-715")!
    const zrodlo = readFileSync(p715.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax): **−0,290%/°C**")
    expect(zrodlo).toContain("**45±2 °C**")
    expect(p715).toMatchObject({ pmaxW: 715, gammaPctNaC: -0.29, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(p715.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("ja-solar-jam66d46")).map((p) => p.pmaxW)).toEqual([690, 695, 700, 705, 710, 715, 720])
  })

  it("JA Solar JAM66D46 LB: 720 W tylko z nowszej karty, 690 W tylko ze starszej, 695–715 W z obu", () => {
    const p720 = znajdzPanelKatalogu("ja-solar-jam66d46-lb-720")!
    expect(readFileSync(p720.zrodlo, "utf8")).toContain("| Pmax [W] | 695 | 700 | 705 | 710 | 715 | 720 |")
    expect(p720.kartaObrazy).toHaveLength(2)
    expect(znajdzPanelKatalogu("ja-solar-jam66d46-lb-690")!.kartaObrazy).toHaveLength(2)
    expect(znajdzPanelKatalogu("ja-solar-jam66d46-lb-700")!.kartaObrazy).toHaveLength(4)
  })

  it("JA Solar JAM72D40 MB (144 ogniwa): dane zgodne z transkrypcją karty", () => {
    const p605 = znajdzPanelKatalogu("ja-solar-jam72d40-mb-605")!
    const zrodlo = readFileSync(p605.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax): **−0,290%/°C**")
    expect(zrodlo).toContain("**45±2 °C**")
    expect(p605).toMatchObject({ pmaxW: 605, gammaPctNaC: -0.29, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(p605.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("ja-solar-jam72d40")).map((p) => p.pmaxW)).toEqual([580, 585, 590, 595, 600, 605])
  })

  it("Jinko Tiger Neo 48HL4M-BDV: γ i degradacja z karty; karta nie podaje NOCT ani sprawności przy 200 W/m² → null", () => {
    const p470 = znajdzPanelKatalogu("jinko-tiger-neo-48hl4m-bdv-470")!
    const zrodlo = readFileSync(p470.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax) **−0,29%/°C**")
    expect(zrodlo).toContain("0,40% przez 30 lat")
    expect(p470).toMatchObject({ pmaxW: 470, gammaPctNaC: -0.29, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(p470.noctC).toBeNull()
    expect(p470.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("jinko-tiger-neo-48")).map((p) => p.pmaxW)).toEqual([445, 450, 455, 460, 465, 470])
  })

  it("Jinko Tiger Neo 66HL4M-BDV: γ i degradacja z karty; NOCT 45 °C z odpowiednika 590–610 W (decyzja właściciela), oznaczony w danych", () => {
    const p630 = znajdzPanelKatalogu("jinko-tiger-neo-66hl4m-bdv-630")!
    expect(readFileSync(p630.zrodlo, "utf8")).toContain("γ (Pmax) **−0,29%/°C**")
    expect(p630).toMatchObject({ pmaxW: 630, gammaPctNaC: -0.29, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(p630.noctZOdpowiednika?.seria).toContain("590–610")
    // 590–600 W are the only new powers of the equivalent edition: 605 and 610 W stay single entries (no duplicates).
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("jinko-tiger-neo-66")).map((p) => p.pmaxW)).toEqual([590, 595, 600, 605, 610, 615, 620, 625, 630])
  })

  it("Jinko Tiger Neo 66HL4M-BDV 590–600 W (odpowiednik, EN/CEC): NOCT 45, degradacja null (karta nieczytelna), bez obrazów, ale z adresem karty", () => {
    const p = znajdzPanelKatalogu("jinko-tiger-neo-66hl4m-bdv-595")!
    expect(readFileSync(p.zrodlo, "utf8")).toContain("**45 ± 2 °C**")
    expect(p).toMatchObject({ gammaPctNaC: -0.29, noctC: 45, degradacjaPierwszyRokPct: null, degradacjaLiniowaPctNaRok: null, dlugoscMm: 2382, szerokoscMm: 1134, masaKg: 32.4 })
    expect(p.odpowiednik?.seria).toContain("605–630")
    expect(p.kartaObrazy).toEqual([])
    expect(p.zrodloUrl).toContain("JKM590-610N-66HL4M-BDV")
  })

  it("Jinko Tiger Neo 72HL4-BDV: γ i degradacja z karty; NOCT 45 °C z odpowiednika 550–570 W (karta CN), oznaczony w danych", () => {
    const p600 = znajdzPanelKatalogu("jinko-tiger-neo-72hl4-bdv-600")!
    expect(readFileSync(p600.zrodlo, "utf8")).toContain("γ (Pmax) **−0,29%/°C**")
    expect(p600).toMatchObject({ pmaxW: 600, gammaPctNaC: -0.29, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(p600.noctZOdpowiednika?.edycja).toContain("CN")
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("jinko-tiger-neo-72")).map((p) => p.pmaxW)).toEqual([550, 555, 560, 565, 570, 575, 580, 585, 590, 595, 600])
  })

  it("Jinko Tiger Neo 72HL4-BDV 550–570 W (karta CN): γ −0,30 (inna niż w serii 575–600 W), NOCT 45, nazwa z dopiskiem, odpowiednik wskazuje serię", () => {
    const p = znajdzPanelKatalogu("jinko-tiger-neo-72hl4-bdv-560")!
    expect(readFileSync(p.zrodlo, "utf8")).toContain("**−0,30 %/°C**")
    expect(p).toMatchObject({ nazwa: "Jinko Tiger Neo 72HL4-BDV 560 W (karta CN)", gammaPctNaC: -0.3, noctC: 45, masaKg: 32, degradacjaPierwszyRokPct: null, bifacjalny: true })
    expect(p.odpowiednik?.seria).toContain("575–600")
    expect(p.zrodloUrl).toContain("JKM550-570N-72HL4-BDV-F1-CN")
  })

  it("LONGi Hi-MO X10 LR7-54HVH: jednostronny BC, γ −0,26, NOCT 45 i degradacja 1% + 0,35%/rok zgodne z kartą (88,85% po 30 latach)", () => {
    const p490 = znajdzPanelKatalogu("longi-himo-x10-lr7-54hvh-490")!
    const zrodlo = readFileSync(p490.zrodlo, "utf8")
    expect(zrodlo).toContain("γ) | **−0,260%/°C**")
    expect(zrodlo).toContain("**45 ± 2 °C**")
    expect(p490).toMatchObject({ pmaxW: 490, gammaPctNaC: -0.26, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.35, bifacjalny: false })
    expect(p490.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(100 - p490.degradacjaPierwszyRokPct! - 29 * p490.degradacjaLiniowaPctNaRok!).toBeCloseTo(88.85, 6)
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("longi-himo-x10-lr7-54")).map((p) => p.pmaxW)).toEqual([475, 480, 485, 490])
  })

  it("LONGi Hi-MO X10 LR7-60HVH: jednostronny BC, γ −0,26, NOCT 45 i degradacja 1% + 0,35%/rok zgodne z kartą", () => {
    const p560 = znajdzPanelKatalogu("longi-himo-x10-lr7-60hvh-560")!
    const zrodlo = readFileSync(p560.zrodlo, "utf8")
    expect(zrodlo).toContain("γ) | **−0,260%/°C**")
    expect(zrodlo).toContain("**45 °C ± 2 °C**")
    expect(p560).toMatchObject({ pmaxW: 560, gammaPctNaC: -0.26, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.35, bifacjalny: false })
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("longi-himo-x10-lr7-60")).map((p) => p.pmaxW)).toEqual([535, 540, 545, 550, 555, 560])
  })

  it("Trina Vertex S+ TSM-NEG9R.28: γ −0,29, NOCT 43 i degradacja 1% + 0,4%/rok zgodne z kartą (87,4% po 30 latach); bifacjalność nie podana → false", () => {
    const p460 = znajdzPanelKatalogu("trina-vertex-s-plus-neg9r28-460")!
    const zrodlo = readFileSync(p460.zrodlo, "utf8")
    expect(zrodlo).toContain("γ) | **−0,29%/°C**")
    expect(zrodlo).toContain("**43 °C (±2 °C)**")
    expect(p460).toMatchObject({ pmaxW: 460, gammaPctNaC: -0.29, noctC: 43, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: false })
    expect(p460.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("trina")).map((p) => p.pmaxW)).toEqual([430, 435, 440, 445, 450, 455, 460, 465, 470, 475])
  })

  it("Trina Vertex S+: 465–475 W tylko z nowszej karty, 430–445 W tylko ze starszej, 450–460 W z obu", () => {
    const p475 = znajdzPanelKatalogu("trina-vertex-s-plus-neg9r28-475")!
    expect(readFileSync(p475.zrodlo, "utf8")).toContain("| Pmax [W] | 450 | 455 | 460 | 465 | 470 | 475 |")
    expect(p475.kartaObrazy).toHaveLength(2)
    expect(znajdzPanelKatalogu("trina-vertex-s-plus-neg9r28-430")!.kartaObrazy).toHaveLength(2)
    expect(znajdzPanelKatalogu("trina-vertex-s-plus-neg9r28-455")!.kartaObrazy).toHaveLength(4)
  })

  it("JA Solar JAM54D40 LB (dwustronny) jest osobnym wpisem od JAM54D40 LR (jednostronny)", () => {
    const lb = znajdzPanelKatalogu("ja-solar-jam54d40-lb-460")!
    const zrodlo = readFileSync(lb.zrodlo, "utf8")
    expect(zrodlo).toContain("γ (Pmax): **−0,290%/°C**")
    expect(lb).toMatchObject({ pmaxW: 460, gammaPctNaC: -0.29, noctC: 45, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4, bifacjalny: true })
    expect(lb.sprawnoscWzglednaPrzy200WPct).toBeNull()
    expect(KATALOG_PANELI_PV.filter((p) => p.id.startsWith("ja-solar-jam54d40-lb")).map((p) => p.pmaxW)).toEqual([435, 440, 445, 450, 455, 460])
    expect(znajdzPanelKatalogu("ja-solar-jam54d40-lr-460")!.bifacjalny).toBe(false)
  })
})
