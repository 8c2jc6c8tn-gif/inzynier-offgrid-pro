import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { ArkuszOferty, type DaneOferty } from "@/components/porownywarka-paneli/oferta"
import { PROFIL_FIRMY_PUSTY } from "@/lib/firma/profil-firmy"
import { STAN_POCZATKOWY, type FormularzStan } from "../stan"

const DANE: DaneOferty = {
  panele: [],
  wniosek: "",
  podsumowanie: null,
  zalozenia: [],
  szerokosc: null,
  dlugosc: null,
  nachylenie: "35",
  azymut: "180",
  waluta: "zł",
  pogodaPobrano: null,
  zwroty: undefined,
}
const pokaz = (stan: Partial<FormularzStan>) => render(<ArkuszOferty dane={DANE} stan={{ ...STAN_POCZATKOWY, ...stan }} firma={PROFIL_FIRMY_PUSTY} wersje={[]} />)

afterEach(cleanup)

describe("ArkuszOferty: numer, montaż z VAT i warunki handlowe (spec 53)", () => {
  it("shows none of the new sections when nothing is typed", () => {
    pokaz({})
    expect(screen.queryByText(/Oferta nr/)).toBeNull()
    expect(screen.queryByText("Montaż i podłączenie")).toBeNull()
    expect(screen.queryByText("Warunki handlowe")).toBeNull()
  })

  it("prints the offer number, the terms and the installation with VAT: 1234.56 net at 23 % → 283,95 VAT, 1518,51 gross", () => {
    pokaz({ ofertaNumer: "2026/10/001", ofertaWarunki: "Zaliczka 30 proc.", ofertaMontazNetto: "1234.56", ofertaMontazVat: "23" })
    expect(screen.getByText("Oferta nr 2026/10/001")).toBeTruthy()
    expect(screen.getByText("Zaliczka 30 proc.")).toBeTruthy()
    expect(screen.getByText("Montaż i podłączenie")).toBeTruthy()
    const tekst = document.body.textContent ?? ""
    expect(tekst).toMatch(/Cena netto: 1\s?234,56\s?zł/)
    expect(tekst).toMatch(/VAT 23 %: 283,95\s?zł/)
    expect(tekst).toMatch(/Cena brutto: 1\s?518,51\s?zł/)
  })

  it("without a VAT rate prints the net amount and says the rate was not given", () => {
    pokaz({ ofertaMontazNetto: "1500" })
    expect(screen.getByText("Stawka VAT nie została podana — kwota bez VAT.")).toBeTruthy()
    expect(screen.queryByText(/Cena brutto/)).toBeNull()
  })

  it("leaves the installation section out when the amount is invalid", () => {
    pokaz({ ofertaMontazNetto: "-5", ofertaMontazVat: "8" })
    expect(screen.queryByText("Montaż i podłączenie")).toBeNull()
  })
})
