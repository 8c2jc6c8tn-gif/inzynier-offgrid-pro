import type { Warning } from "@/lib/core/calc-result"
import { MAKS_DNI_MIESIACA, MAKS_SCENARIUSZY, TEMPERATURA_SCENARIUSZA_MAX_C, TEMPERATURA_SCENARIUSZA_MIN_C } from "./constants"
import type { SymulacjaMrozuInput } from "./input"
import { liczbaDniPozaZakresem, wartoscNiedodatnia, wartoscPozaZakresem, wartoscUjemna, zaDuzoScenariuszy } from "./warnings"

const skonczona = (x: number) => Number.isFinite(x)

export function validateInput(input: SymulacjaMrozuInput): Warning[] {
  const e: Warning[] = []
  const n = input.produkcjaDobowaKwh.length
  if (n > MAKS_DNI_MIESIACA) e.push(liczbaDniPozaZakresem(n))
  input.produkcjaDobowaKwh.forEach((p, i) => {
    if (!skonczona(p) || p < 0) e.push(wartoscUjemna(`produkcjaDobowaKwh.${i}`, p))
  })
  if (!skonczona(input.korektaProdukcjiPct) || input.korektaProdukcjiPct < -100 || input.korektaProdukcjiPct > 100) {
    e.push(wartoscPozaZakresem("korektaProdukcjiPct", input.korektaProdukcjiPct, -100, 100))
  }
  if (input.zuzycieBazoweDobaKwh !== null && (!skonczona(input.zuzycieBazoweDobaKwh) || input.zuzycieBazoweDobaKwh < 0)) {
    e.push(wartoscUjemna("zuzycieBazoweDobaKwh", input.zuzycieBazoweDobaKwh))
  }
  if (!skonczona(input.dodatkoweZuzycieDobaKwh) || input.dodatkoweZuzycieDobaKwh < 0) e.push(wartoscUjemna("dodatkoweZuzycieDobaKwh", input.dodatkoweZuzycieDobaKwh))
  const b = input.budynek
  if (b) {
    if (!skonczona(b.wspolczynnikStratZewnetrznychWK) || b.wspolczynnikStratZewnetrznychWK < 0) e.push(wartoscUjemna("budynek.wspolczynnikStratZewnetrznychWK", b.wspolczynnikStratZewnetrznychWK))
    if (!skonczona(b.stalyStrumienStratW)) e.push(wartoscPozaZakresem("budynek.stalyStrumienStratW", b.stalyStrumienStratW, -1e9, 1e9))
    if (!skonczona(b.temperaturaWewnetrznaC) || b.temperaturaWewnetrznaC < -10 || b.temperaturaWewnetrznaC > 40) {
      e.push(wartoscPozaZakresem("budynek.temperaturaWewnetrznaC", b.temperaturaWewnetrznaC, -10, 40))
    }
  }
  if (input.cop !== null && (!skonczona(input.cop) || input.cop <= 0)) e.push(wartoscNiedodatnia("cop", input.cop))
  const m = input.magazyn
  if (m) {
    if (!skonczona(m.pojemnoscUzytecznaKwh) || m.pojemnoscUzytecznaKwh < 0) e.push(wartoscUjemna("magazyn.pojemnoscUzytecznaKwh", m.pojemnoscUzytecznaKwh))
    if (m.pojemnoscUzytecznaKwh > 0) {
      if (m.sprawnoscPct !== null && (!skonczona(m.sprawnoscPct) || m.sprawnoscPct <= 0 || m.sprawnoscPct > 100)) e.push(wartoscPozaZakresem("magazyn.sprawnoscPct", m.sprawnoscPct, 0, 100))
    }
    if (!skonczona(m.stanPoczatkowyPct) || m.stanPoczatkowyPct < 0 || m.stanPoczatkowyPct > 100) e.push(wartoscPozaZakresem("magazyn.stanPoczatkowyPct", m.stanPoczatkowyPct, 0, 100))
  }
  if (input.udzialNocyPct !== null && (!skonczona(input.udzialNocyPct) || input.udzialNocyPct < 0 || input.udzialNocyPct > 100)) {
    e.push(wartoscPozaZakresem("udzialNocyPct", input.udzialNocyPct, 0, 100))
  }
  if (input.scenariusze.length > MAKS_SCENARIUSZY) e.push(zaDuzoScenariuszy(input.scenariusze.length, MAKS_SCENARIUSZY))
  input.scenariusze.forEach((s, i) => {
    if (!skonczona(s.temperaturaC) || s.temperaturaC < TEMPERATURA_SCENARIUSZA_MIN_C || s.temperaturaC > TEMPERATURA_SCENARIUSZA_MAX_C) {
      e.push(wartoscPozaZakresem(`scenariusze.${i}.temperaturaC`, s.temperaturaC, TEMPERATURA_SCENARIUSZA_MIN_C, TEMPERATURA_SCENARIUSZA_MAX_C))
    }
    if (s.cop !== null && (!skonczona(s.cop) || s.cop <= 0)) e.push(wartoscNiedodatnia(`scenariusze.${i}.cop`, s.cop))
    if (s.spadekPojemnosciPct !== null && (!skonczona(s.spadekPojemnosciPct) || s.spadekPojemnosciPct < 0 || s.spadekPojemnosciPct >= 100)) {
      e.push(wartoscPozaZakresem(`scenariusze.${i}.spadekPojemnosciPct`, s.spadekPojemnosciPct, 0, 100))
    }
  })
  return e
}
