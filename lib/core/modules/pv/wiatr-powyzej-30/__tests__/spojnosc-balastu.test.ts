import { describe, expect, it } from "vitest"
import type { TabelaNapromieniowania } from "../../kat-i-azymut/input"
import { calculateDachPlaski } from "../../typ-montazu/dach-plaski"
import { calculateRegulowany } from "../../typ-montazu/regulowany"
import { calculateZlotySrodek } from "../../zloty-srodek/calculator"
import { calculateWiatrPowyzej30 } from "../calculator"

/**
 * Ta sama konstrukcja policzona czterema kalkulatorami (wiatr >30°, dach płaski, stelaż regulowany, „Złoty środek”) musi dać
 * identyczny balast, składniki i warunek rozstrzygający — wszystkie wołają `silaIBalastWiatru`, a ten test pilnuje, żeby żaden
 * nie dołożył własnej geometrii ani własnego zaokrąglenia.
 */
const L = 2
const B = 5
const H0 = 0.5
const MU = 0.5
const MASA = 80
const wiatrZPhi = (wspolczynnikPhi: number) => ({ strefaWiatrowa: 1 as const, wysokoscNpmM: 100, kategoriaTerenu: "III" as const, wspolczynnikPhi })
const tabela: TabelaNapromieniowania = {
  azymutDeg: 180,
  albedo: 0.2,
  katyDeg: Array.from({ length: 91 }, (_, k) => k),
  miesiace: Array.from({ length: 91 }, (_, k) => Array<number>(12).fill((1200 - 0.2 * (k - 38) ** 2) / 12)),
}

const rad = (deg: number) => (deg * Math.PI) / 180
const zeGorneJ = (kat: number) => H0 + L * Math.sin(rad(kat))

describe("spójność balastu między kalkulatorami", () => {
  // φ = 1 sprawdza też interpolację współczynnika siły (D97): przy φ = 0 cf(30°) = cf(90°) = 1,8, więc jest płaski.
  for (const [phi, kat] of [[0, 20], [0, 35], [1, 35], [1, 60], [0.5, 80]] as const) {
    const wiatr = wiatrZPhi(phi)
    it(`φ = ${phi}, ${kat}°: wiatr >30° / dach płaski / regulowany / Złoty środek dają to samo`, () => {
      const dach = calculateDachPlaski({
        ...wiatr,
        miejsce: "grunt",
        nachylenieDeg: kat,
        dlugoscWzdluzSpaduM: L,
        szerokoscStelazaM: B,
        wysokoscDolnejKrawedziM: H0,
        masaPaneliStelazaKg: MASA,
        wspolczynnikTarcia: MU,
      }).value!
      const zloty = calculateZlotySrodek({
        tabela,
        strefaWiatrowa: 1,
        wysokoscNpmM: 100,
        kategoriaTerenu: "III",
        wysokoscKonstrukcjiM: zeGorneJ(kat),
        powierzchniaPaneliM2: L * B,
        wspolczynnikPhi: phi,
        masaPaneliStelazaKg: MASA,
        dlugoscWzdluzSpaduM: L,
        wspolczynnikTarcia: MU,
        glebokoscPodstawyM: null,
        cenaBalastuZlKg: 1,
        mocInstalacjiKwp: null,
        wspolczynnikPr: null,
        cenaEnergiiZlKwh: null,
        liczbaLat: null,
        nachylenieDeg: null,
      }).value!.punkty[kat]!
      const reg = calculateRegulowany({ ...wiatr, tabela, katMinDeg: kat, katMaxDeg: kat, dlugoscWzdluzSpaduM: L, szerokoscStelazaM: B, wysokoscDolnejKrawedziM: H0, masaPaneliStelazaKg: MASA, wspolczynnikTarcia: MU }).value!.miesiace[0]!
      const porownaj = (x: { balastKg: number | null; balastOderwanieKg: number | null; balastPrzesuwKg: number | null; balastPrzewracanieKg: number | null; warunekRozstrzygajacy: string | null; silaWiatruN: number | null }) => {
        expect(x.silaWiatruN).toBeCloseTo(dach.silaWiatruN!, 9)
        expect(x.balastKg).toBeCloseTo(dach.balastKg!, 9)
        expect(x.balastOderwanieKg).toBeCloseTo(dach.balastOderwanieKg!, 9)
        expect(x.balastPrzesuwKg).toBeCloseTo(dach.balastPrzesuwKg!, 9)
        expect(x.balastPrzewracanieKg).toBeCloseTo(dach.balastPrzewracanieKg!, 9)
        expect(x.warunekRozstrzygajacy).toBe(dach.warunekRozstrzygajacy)
      }
      porownaj(zloty)
      porownaj(reg)
      // Balast = największy ze składników, a warunek rozstrzygający wskazuje właśnie ten.
      const skladniki = { oderwanie: dach.balastOderwanieKg!, przesuw: dach.balastPrzesuwKg!, przewracanie: dach.balastPrzewracanieKg! }
      expect(dach.balastKg).toBeCloseTo(Math.max(...Object.values(skladniki)), 9)
      expect(skladniki[dach.warunekRozstrzygajacy!]).toBeCloseTo(dach.balastKg!, 9)

      if (kat > 30) {
        const w30 = calculateWiatrPowyzej30({
          nachylenieDeg: kat,
          ...{ strefaWiatrowa: 1, wysokoscNpmM: 100, kategoriaTerenu: "III" },
          wysokoscKonstrukcjiM: zeGorneJ(kat),
          powierzchniaM2: L * B,
          wspolczynnikPhi: phi,
          masaPaneliStelazaKg: MASA,
          wspolczynnikTarcia: MU,
          wysokoscSrodkaParciaM: H0 + (L / 2) * Math.sin(rad(kat)),
          szerokoscPodstawyM: L * Math.cos(rad(kat)),
        }).value
        expect(w30.silaWiatruN).toBeCloseTo(dach.silaWiatruN!, 9)
        expect(w30.balastProjektowyKg).toBeCloseTo(dach.balastKg!, 9)
        expect(w30.balastOderwanieKg).toBeCloseTo(dach.balastOderwanieKg!, 9)
        expect(w30.balastPrzesuwKg).toBeCloseTo(dach.balastPrzesuwKg!, 9)
        expect(w30.balastPrzewracanieKg).toBeCloseTo(dach.balastPrzewracanieKg!, 9)
        expect(w30.warunekRozstrzygajacy).toBe(dach.warunekRozstrzygajacy)
      }
    })
  }

  it("90° z głębokością podstawy: wszystkie cztery zgodne, oderwanie nie dotyczy, rozstrzyga przesuw albo przewracanie", () => {
    const wiatr = wiatrZPhi(0)
    const GL = 0.8
    const dach = calculateDachPlaski({ ...wiatr, miejsce: "grunt", nachylenieDeg: 90, dlugoscWzdluzSpaduM: L, szerokoscStelazaM: B, wysokoscDolnejKrawedziM: H0, masaPaneliStelazaKg: null, wspolczynnikTarcia: MU, glebokoscPodstawyM: GL }).value!
    const w30 = calculateWiatrPowyzej30({
      nachylenieDeg: 90,
      strefaWiatrowa: 1,
      wysokoscNpmM: 100,
      kategoriaTerenu: "III",
      wysokoscKonstrukcjiM: H0 + L,
      powierzchniaM2: L * B,
      wspolczynnikPhi: 0,
      wspolczynnikTarcia: MU,
      wysokoscSrodkaParciaM: H0 + L / 2,
      szerokoscPodstawyM: GL,
    }).value
    expect(dach.balastOderwanieKg).toBeNull()
    expect(w30.balastOderwanieKg).toBeNull()
    expect(w30.balastProjektowyKg).toBeCloseTo(dach.balastKg!, 9)
    expect(["przesuw", "przewracanie"]).toContain(dach.warunekRozstrzygajacy)
    expect(w30.warunekRozstrzygajacy).toBe(dach.warunekRozstrzygajacy)
  })
})
