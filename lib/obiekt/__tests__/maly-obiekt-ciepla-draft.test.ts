import { describe, expect, it } from "vitest"
import { ogrzewanieMalegoObiektuZSzkicu, PUSTY_SEED_MALY_OBIEKT, wejscieMalegoObiektu, type SeedMalyObiekt } from "../maly-obiekt-ciepla-draft"
import type { ProfilObiektu } from "../profil-obiektu"

const kamper: SeedMalyObiekt = {
  ...PUSTY_SEED_MALY_OBIEKT,
  dlugoscM: "4",
  szerokoscM: "2",
  wysokoscM: "2",
  uScianWM2K: "0,5",
  uDachuWM2K: "0.4",
  uPodlogiWM2K: "0.6",
  podloga: "powietrze",
  otworyM2: "2",
  uOtworowWM2K: "2",
  temperaturaWewnetrznaC: "20",
  strefa: "3",
  wymianyPowietrzaNaH: "1",
  zrodlo: "prad",
  cop: "1",
  miesiace: ["-3", "-2", "2", "8", "13", "16", "18", "18", "13", "8", "3", "-1"],
}
const profil = (...m: number[]): ProfilObiektu => ({ rodzaj: "kamper", miesiaceUzytkowania: Array.from({ length: 12 }, (_, i) => m.includes(i + 1)), napiecieUkladuV: "" })

describe("wejscieMalegoObiektu", () => {
  it("parsuje liczby z przecinkiem, strefę i wybór podłogi", () => {
    const w = wejscieMalegoObiektu(kamper, [])
    expect(w.uScianWM2K).toBe(0.5)
    expect(w.strefaKlimatyczna).toBe(3)
    expect(w.podlogaNadPowietrzem).toBe(true)
    expect(wejscieMalegoObiektu({ ...kamper, podloga: "inna" }, []).podlogaNadPowietrzem).toBe(false)
    expect(wejscieMalegoObiektu({ ...kamper, podloga: "" }, []).podlogaNadPowietrzem).toBeNull()
  })

  it("źródło paliwo: COP ignorowany, pola paliwa przekazane", () => {
    const w = wejscieMalegoObiektu({ ...kamper, zrodlo: "paliwo", paliwoJednostka: " l ", paliwoWartoscOpalowaKwh: "10", paliwoSprawnoscPct: "80", paliwoZapas: "20" }, [])
    expect(w.cop).toBeNull()
    expect(w.paliwo).toEqual({ jednostka: "l", wartoscOpalowaKwh: 10, sprawnoscPct: 80, zapas: 20 })
  })
})

describe("ogrzewanieMalegoObiektuZSzkicu — powody braku i wynik", () => {
  it("brak szkicu / niepełny szkic → brak-danych; paliwo → paliwo; bez COP → brak-cop", () => {
    expect(ogrzewanieMalegoObiektuZSzkicu(null, profil(1)).stan).toBe("brak-danych")
    expect(ogrzewanieMalegoObiektuZSzkicu(PUSTY_SEED_MALY_OBIEKT, profil(1)).stan).toBe("brak-danych")
    expect(ogrzewanieMalegoObiektuZSzkicu({ ...kamper, zrodlo: "paliwo" }, profil(1)).stan).toBe("paliwo")
    expect(ogrzewanieMalegoObiektuZSzkicu({ ...kamper, cop: "" }, profil(1)).stan).toBe("brak-cop")
  })

  it("brak 12 temperatur → brak-miesiecy; brak miesięcy użytkowania → brak-miesiecy-uzytkowania", () => {
    expect(ogrzewanieMalegoObiektuZSzkicu({ ...kamper, miesiace: Array(12).fill("") }, profil(1)).stan).toBe("brak-miesiecy")
    expect(ogrzewanieMalegoObiektuZSzkicu({ ...kamper, miesiace: kamper.miesiace.map((x, i) => (i === 5 ? "" : x)) }, profil(1)).stan).toBe("brak-miesiecy")
    expect(ogrzewanieMalegoObiektuZSzkicu(kamper, profil()).stan).toBe("brak-miesiecy-uzytkowania")
    expect(ogrzewanieMalegoObiektuZSzkicu(kamper, null).stan).toBe("brak-miesiecy-uzytkowania")
  })

  it("ok: styczeń i luty użytkowania → tylko te miesiące niezerowe, suma = rok", () => {
    const o = ogrzewanieMalegoObiektuZSzkicu(kamper, profil(1, 2))
    expect(o.stan).toBe("ok")
    if (o.stan !== "ok") return
    expect(o.miesiaceKwh.filter((x) => x > 0)).toHaveLength(2)
    expect(o.rokKwh).toBeCloseTo(o.miesiaceKwh[0]! + o.miesiaceKwh[1]!, 6)
  })
})
