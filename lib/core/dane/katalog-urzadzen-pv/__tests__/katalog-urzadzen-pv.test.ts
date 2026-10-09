import { describe, expect, it } from "vitest"
import { KATALOG_URZADZEN_PV, znajdzUrzadzeniePv } from "../index"
import { modeleUrzadzen, parametryWejsciaPv, producenciUrzadzen, RODZAJE_URZADZEN_PV } from "../wybor"

describe("katalog urządzeń PV: spójność danych", () => {
  it("id są unikalne, źródło to adres https, data odczytu w formacie RRRR-MM-DD", () => {
    const ids = KATALOG_URZADZEN_PV.map((u) => u.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const u of KATALOG_URZADZEN_PV) {
      expect(u.zrodloUrl, u.id).toMatch(/^https:\/\//)
      expect(u.dataOdczytu, u.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it("nominalna moc PV regulatora Victron ≈ prąd ładowania × napięcie absorpcji (14,4 V na 12 V), tolerancja 3,5% — łapie literówkę w danych", () => {
    const regulatory = KATALOG_URZADZEN_PV.filter((u) => u.producent === "Victron Energy" && u.rodzaj === "regulator-mppt")
    expect(regulatory).toHaveLength(16)
    for (const u of regulatory) {
      for (const { napiecieAkumulatoraV, mocW } of u.mocPvNominalna ?? []) {
        const oczekiwana = (u.pradLadowaniaMaxA ?? 0) * 14.4 * (napiecieAkumulatoraV / 12)
        expect(Math.abs(mocW / oczekiwana - 1), `${u.id} ${napiecieAkumulatoraV} V`).toBeLessThan(0.035)
      }
    }
  })

  it("napięcie robocze PV nie przekracza bezwzględnego maksimum, a okno MPPT ma dolną granicę pod górną", () => {
    for (const u of KATALOG_URZADZEN_PV) {
      if (u.vocRoboczeMaxV !== null && u.vocMaxV !== null) expect(u.vocRoboczeMaxV, u.id).toBeLessThan(u.vocMaxV)
      if (u.mpptMinV !== null && u.mpptMaxV !== null) expect(u.mpptMinV, u.id).toBeLessThan(u.mpptMaxV)
    }
  })

  it("falowniki Phoenix: moc szczytowa ≥ ciągłej, zakres DC rośnie z napięciem systemu", () => {
    const phoenix = KATALOG_URZADZEN_PV.filter((u) => u.seria.startsWith("Phoenix"))
    expect(phoenix).toHaveLength(16)
    for (const u of phoenix) {
      expect(u.mocSzczytowa ?? 0, u.id).toBeGreaterThanOrEqual(u.mocAcZnamionowaW ?? Infinity)
      expect(u.napiecieWejsciaDcMinV!, u.id).toBeLessThan(u.napieciaAkumulatoraV![0]!)
      expect(u.napiecieWejsciaDcMaxV!, u.id).toBeGreaterThan(u.napieciaAkumulatoraV![0]!)
    }
  })

  it("sprzeczne lub nieczytelne w źródle Isc zostaje null, a nie zgadnięte", () => {
    for (const id of ["victron-smartsolar-75-10", "victron-smartsolar-150-100", "victron-smartsolar-250-100"]) {
      expect(znajdzUrzadzeniePv(id)?.iscMaxA, id).toBeNull()
    }
    expect(znajdzUrzadzeniePv("victron-smartsolar-150-70")?.iscMaxA).toBe(50)
    expect(znajdzUrzadzeniePv("vevor-hybryda-em3500-24l")?.iscMaxA).toBeNull()
  })

  it("para VEVOR GD3024JMH / GD5548JMH różni się Wi-Fi i mocą, a EM3500 i EM6200 mają Wi-Fi", () => {
    expect(znajdzUrzadzeniePv("vevor-hybryda-gd3024jmh")).toMatchObject({ wifi: false, mocAcZnamionowaW: 3000, pradLadowaniaMaxA: 80 })
    expect(znajdzUrzadzeniePv("vevor-hybryda-gd5548jmh")).toMatchObject({ wifi: true, mocAcZnamionowaW: 4000, pradLadowaniaMaxA: 120 })
    expect(znajdzUrzadzeniePv("vevor-hybryda-em3500-24l")?.wifi).toBe(true)
    expect(znajdzUrzadzeniePv("vevor-hybryda-em5500-48l")?.wifi).toBe(false)
  })
})

describe("katalog urządzeń PV: wybór rodzaj → producent → model", () => {
  it("rodzaje w kolejności katalogu, producenci bez powtórzeń", () => {
    expect(RODZAJE_URZADZEN_PV).toEqual(["regulator-mppt", "falownik-wyspowy", "falownik-hybrydowy", "mikroinwerter-sieciowy"])
    expect(producenciUrzadzen("regulator-mppt")).toEqual(["Victron Energy", "VEVOR"])
    expect(producenciUrzadzen("mikroinwerter-sieciowy")).toEqual(["VEVOR"])
  })

  it("każdy wpis jest osiągalny wyborem i żadna para (rodzaj, producent, model) się nie powtarza", () => {
    const klucze = new Set<string>()
    for (const rodzaj of RODZAJE_URZADZEN_PV) {
      for (const prod of producenciUrzadzen(rodzaj)) {
        for (const u of modeleUrzadzen(rodzaj, prod)) {
          const klucz = `${rodzaj}|${prod}|${u.model}`
          expect(klucze.has(klucz), klucz).toBe(false)
          klucze.add(klucz)
        }
      }
    }
    expect(klucze.size).toBe(KATALOG_URZADZEN_PV.length)
  })

  it("parametry wejścia PV przekazują tylko to, co źródło podaje", () => {
    expect(parametryWejsciaPv(znajdzUrzadzeniePv("vevor-hybryda-em3500-24l")!)).toEqual({
      vMaxFalownikaV: null,
      mpptMinV: 60,
      mpptMaxV: 500,
      iMaxMpptA: null,
      mocFalownikaAcW: 3500,
    })
    expect(parametryWejsciaPv(znajdzUrzadzeniePv("victron-smartsolar-150-35")!)).toEqual({
      vMaxFalownikaV: 150,
      mpptMinV: null,
      mpptMaxV: null,
      iMaxMpptA: null,
      mocFalownikaAcW: null,
    })
  })
})
