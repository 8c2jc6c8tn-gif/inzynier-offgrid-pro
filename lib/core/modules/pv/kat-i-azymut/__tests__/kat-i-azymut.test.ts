import { describe, expect, it } from "vitest"
import {
  pozycjaSlonca,
  promieniowanieBezposrednieCzysteNiebo,
} from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { napromieniowanie, przygotujGodziny } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/muneer"
import { calculateKatIAzymut, obliczProdukcjeKwh, obliczTabeleNapromieniowania } from "../calculator"
import type { TabelaNapromieniowania } from "../input"
import { validateInput, validateTabela } from "../validation"

const LAT = 52.23
const LON = 0

/**
 * Syntetyczny rok godzinowy (NIE dane klimatyczne) — ten sam generator co test Modułu 1/E4
 * (DNI z modelu Meinela, stałe DHI, GHI z bilansu). Tylko do sprawdzenia matematyki agregacji.
 */
function rokSyntetyczny(): RekordGodzinowy[] {
  const dane: RekordGodzinowy[] = []
  const start = Date.UTC(2026, 0, 1, 0, 30)
  for (let h = 0; h < 8760; h++) {
    const t = start + h * 3_600_000
    const p = pozycjaSlonca(LAT, LON, t)
    const nad = p.wysokoscDeg > 0
    const dni = nad ? 1000 * promieniowanieBezposrednieCzysteNiebo(p.wysokoscDeg) : 0
    const dhi = nad ? 80 : 0
    dane.push({ czasUtcMs: t, dni, dhi, ghi: dni * Math.sin((p.wysokoscDeg * Math.PI) / 180) * (nad ? 1 : 0) + dhi })
  }
  return dane
}

const dane = rokSyntetyczny()
const tabelaWynik = obliczTabeleNapromieniowania({
  szerokoscGeograficzna: LAT,
  dlugoscGeograficzna: LON,
  daneGodzinowe: dane,
  azymutDeg: 180,
})
const tabela = tabelaWynik.value as TabelaNapromieniowania

describe("obliczTabeleNapromieniowania (M3/E1, krok ciężki)", () => {
  it("siatka 0–90° co 1°, 12 miesięcy; założenia z Modułu 1 (Muneer, albedo domyślne)", () => {
    expect(tabelaWynik.status).toBe("VALID")
    expect(tabela.katyDeg).toHaveLength(91)
    expect(tabela.miesiace.every((w) => w.length === 12)).toBe(true)
    expect(tabelaWynik.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toEqual([
      "ORIENTACJA-ZALOZENIE-MODEL-MUNEER",
      "ORIENTACJA-ZALOZENIE-ALBEDO",
    ])
  })

  it("K5 echo: suma miesięcy = roczne napromieniowanie z silnika Modułu 1 (ten sam kąt, azymut, albedo)", () => {
    const godziny = przygotujGodziny(LAT, LON, dane)
    for (const k of [0, 35, 90]) {
      const roczneM1 = napromieniowanie(godziny, k, 180, 0.2)
      const sumaMiesiecy = tabela.miesiace[k]!.reduce((a, b) => a + b, 0)
      expect(sumaMiesiecy).toBeCloseTo(roczneM1, 6)
    }
  })

  it("brak danych → INCOMPLETE; azymut poza zakresem → INVALID_INPUT", () => {
    expect(obliczTabeleNapromieniowania({ azymutDeg: 180 }).status).toBe("INCOMPLETE")
    const zly = obliczTabeleNapromieniowania({ szerokoscGeograficzna: LAT, dlugoscGeograficzna: LON, daneGodzinowe: dane, azymutDeg: 400 })
    expect(zly.status).toBe("INVALID_INPUT")
    expect(zly.warnings[0]!.code).toBe("AZYMUTDEG-POZA-ZAKRESEM")
  })
})

describe("calculateKatIAzymut (M3/E1, krok lekki)", () => {
  const baza = { tabela, nachylenieDeg: 35, mocInstalacjiKwp: 0, wspolczynnikPr: null }

  it("fizyka: optimum kąta zimą (grudzień) wyraźnie większe niż latem (czerwiec), roczne pomiędzy", () => {
    const r = calculateKatIAzymut(baza).value!
    const grudzien = r.optimumMiesieczne[11]!.nachylenieDeg
    const czerwiec = r.optimumMiesieczne[5]!.nachylenieDeg
    expect(grudzien).toBeGreaterThan(czerwiec + 30)
    expect(r.optimumRoczne.nachylenieDeg).toBeGreaterThan(czerwiec)
    expect(r.optimumRoczne.nachylenieDeg).toBeLessThan(grudzien)
  })

  it("regulacja co miesiąc daje co najmniej tyle, co najlepszy kąt stały (zysk ≥ 0), a ten — co wybrany", () => {
    const r = calculateKatIAzymut({ ...baza, nachylenieDeg: 10 }).value!
    expect(r.napromieniowanieZRegulacjaKwhM2).toBeGreaterThanOrEqual(r.optimumRoczne.napromieniowanieRoczneKwhM2)
    expect(r.optimumRoczne.napromieniowanieRoczneKwhM2).toBeGreaterThanOrEqual(r.napromieniowanieRoczneKwhM2)
    expect(r.zyskRegulacjiWzgledemOptimumPct).toBeGreaterThanOrEqual(0)
    expect(r.zyskRegulacjiWzgledemWybranegoPct).toBeGreaterThan(r.zyskRegulacjiWzgledemOptimumPct)
  })

  it("wybrany kąt = wiersz tabeli; suma roczna = suma miesięcy; wykres roczny ma 91 punktów", () => {
    const r = calculateKatIAzymut(baza).value!
    expect(r.napromieniowanieMiesieczneKwhM2).toEqual(tabela.miesiace[35])
    expect(r.napromieniowanieRoczneKwhM2).toBeCloseTo(tabela.miesiace[35]!.reduce((a, b) => a + b, 0), 9)
    expect(r.napromieniowanieRoczneWgKataKwhM2).toHaveLength(91)
  })

  it("produkcja: E = P × H/1 kW/m² × PR (4 kWp, PR 0,8) — i tylko gdy podano moc i PR", () => {
    const bez = calculateKatIAzymut(baza)
    expect(bez.value!.produkcjaRocznaKwh).toBeNull()
    expect(bez.warnings.map((w) => [w.code, w.level])).toEqual([["KAT-PRODUKCJA-WYMAGA-MOCY-I-PR", "info"]])
    expect(bez.status).toBe("VALID")

    const z = calculateKatIAzymut({ ...baza, mocInstalacjiKwp: 4, wspolczynnikPr: 0.8 }).value!
    expect(z.produkcjaMiesiecznaKwh![0]).toBeCloseTo(4 * tabela.miesiace[35]![0]! * 0.8, 9)
    expect(z.produkcjaRocznaKwh).toBeCloseTo(4 * z.napromieniowanieRoczneKwhM2 * 0.8, 6)
    expect(obliczProdukcjeKwh(1000, 1, 1)).toBe(1000)
  })

  it("kąt ułamkowy → najbliższy węzeł siatki + jawne założenie o zaokrągleniu", () => {
    const r = calculateKatIAzymut({ ...baza, nachylenieDeg: 34.6 })
    expect(r.value!.nachylenieDeg).toBe(35)
    expect(r.assumptions).toContainEqual({ kod: "KAT-ZALOZENIE-ZAOKRAGLENIE", params: { kat: 35 } })
  })

  it("wartości graniczne 0° i 90° liczone bez NaN", () => {
    for (const k of [0, 90]) {
      const r = calculateKatIAzymut({ ...baza, nachylenieDeg: k }).value!
      expect(Number.isFinite(r.napromieniowanieRoczneKwhM2)).toBe(true)
      expect(r.napromieniowanieRoczneKwhM2).toBeGreaterThan(0)
    }
  })

  it("brak tabeli albo kąta → INCOMPLETE", () => {
    expect(calculateKatIAzymut({ ...baza, tabela: null }).status).toBe("INCOMPLETE")
    expect(calculateKatIAzymut({ ...baza, nachylenieDeg: null }).status).toBe("INCOMPLETE")
  })

  it("K3: walidacja — kąt > 90, moc ujemna, PR poza (0, 1]; poprawne dane bez błędów", () => {
    expect(validateInput({ ...baza, nachylenieDeg: 91 }).map((e) => e.code)).toEqual(["NACHYLENIEDEG-POZA-ZAKRESEM"])
    expect(validateInput({ ...baza, mocInstalacjiKwp: -1 }).map((e) => e.code)).toEqual(["WARTOSC-UJEMNA"])
    expect(validateInput({ ...baza, wspolczynnikPr: 0 }).map((e) => e.code)).toEqual(["KAT-PR-POZA-ZAKRESEM"])
    expect(validateInput({ ...baza, wspolczynnikPr: 1.2 }).map((e) => e.code)).toEqual(["KAT-PR-POZA-ZAKRESEM"])
    expect(validateInput({ ...baza, wspolczynnikPr: 1 })).toEqual([])
    expect(calculateKatIAzymut({ ...baza, wspolczynnikPr: 0 }).status).toBe("INVALID_INPUT")
    expect(validateTabela({ azymutDeg: 180, albedo: 2 }).map((e) => e.code)).toEqual(["ALBEDO-POZA-ZAKRESEM"])
  })
})
