import { describe, expect, it } from "vitest"
import { calculateSymulacjaMrozu } from "@/lib/core/modules/stress-test/symulacja-mrozu/calculator"
import { STAN_POCZATKOWY_SYMULACJI, wejscieSymulacjiMrozu, type StanSymulacjiMrozu } from "../symulacja-mrozu"

const EKRAN1 = { budynek: { wspolczynnikStratZewnetrznychWK: 120.25, stalyStrumienStratW: 360, temperaturaWewnetrznaC: 20 }, zrodlo: "prad" as const, cop: 3 }

const STAN: StanSymulacjiMrozu = { ...STAN_POCZATKOWY_SYMULACJI, zuzycieBazoweDobaKwh: "10", miesiac: "1" }

describe("wejscieSymulacjiMrozu", () => {
  it("pusty formularz: dwa scenariusze z nazwy ekranu (−20 i −30), reszta bez danych, dodatki 0", () => {
    const w = wejscieSymulacjiMrozu(STAN_POCZATKOWY_SYMULACJI, [], null)
    expect(w.scenariusze.map((s) => s.temperaturaC)).toEqual([-20, -30])
    expect(w.zuzycieBazoweDobaKwh).toBeNull()
    expect(w.magazyn).toBeNull()
    expect(w.udzialNocyPct).toBeNull()
    expect(w.korektaProdukcjiPct).toBe(0)
    expect(w.dodatkoweZuzycieDobaKwh).toBe(0)
    expect(calculateSymulacjaMrozu(w).status).toBe("INCOMPLETE")
  })

  it("COP z Ekranu 1 jest używany, a COP wpisany tutaj ma pierwszeństwo; przecinek dziesiętny jest czytany", () => {
    expect(wejscieSymulacjiMrozu(STAN, [5], EKRAN1).cop).toBe(3)
    expect(wejscieSymulacjiMrozu({ ...STAN, cop: "2,5" }, [5], EKRAN1).cop).toBe(2.5)
    expect(wejscieSymulacjiMrozu(STAN, [5], null).budynek).toBeNull()
  })

  it("wiersz scenariusza bez czytelnej temperatury (pusty, samo „-”) jest pomijany", () => {
    const w = wejscieSymulacjiMrozu({ ...STAN, scenariusze: [{ temperaturaC: "-", cop: "", spadekPojemnosciPct: "" }, { temperaturaC: "", cop: "", spadekPojemnosciPct: "" }, { temperaturaC: "-15", cop: "2", spadekPojemnosciPct: "10" }] }, [5], null)
    expect(w.scenariusze).toEqual([{ temperaturaC: -15, cop: 2, spadekPojemnosciPct: 10 }])
  })

  it("magazyn: pojemność bez sprawności daje INCOMPLETE, stan początkowy pusty = 0 (pusty magazyn, strona bezpieczna)", () => {
    const wej = wejscieSymulacjiMrozu({ ...STAN, magazynKwh: "10" }, [5], null)
    expect(wej.magazyn).toEqual({ pojemnoscUzytecznaKwh: 10, sprawnoscPct: null, stanPoczatkowyPct: 0 })
    expect(calculateSymulacjaMrozu(wej).status).toBe("INCOMPLETE")
    expect(calculateSymulacjaMrozu(wejscieSymulacjiMrozu({ ...STAN, magazynKwh: "10", magazynSprawnoscPct: "90" }, [5], null)).status).not.toBe("INCOMPLETE")
  })
})
