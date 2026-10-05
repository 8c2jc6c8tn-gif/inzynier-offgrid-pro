import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, godzinyPozaDoba, ujemneWartosci } from "../wspolne/walidacja"
import { GODZIN_NA_DOBE } from "./constants"
import type { TaryfaNocnaPompyCieplaInput } from "./input"

/** Form-level checks: no negative numbers, the night zone within a day, COP not below 1, a well-formed hourly profile. */
export function validateInput(input: TaryfaNocnaPompyCieplaInput): Warning[] {
  return [
    ...ujemneWartosci({
      cieploDobaKwh: input.cieploDobaKwh,
      cenaDzienZlKwh: input.cenaDzienZlKwh,
      cenaNocZlKwh: input.cenaNocZlKwh,
      pojemnoscBuforaL: input.pojemnoscBuforaL,
      deltaTBuforaK: input.deltaTBuforaK,
      stratyBuforaKwhDoba: input.stratyBuforaKwhDoba,
    }),
    ...godzinyPozaDoba("godzinyNocH", input.godzinyNocH),
    ...copPonizejJednosci("copDzien", input.copDzien),
    ...copPonizejJednosci("copNoc", input.copNoc),
    ...profilGodzinowy(input),
  ]
}

/** The hourly profile and its cheap-zone hours: 24 non-negative weights with a non-zero sum, valid unique hours. */
function profilGodzinowy(input: TaryfaNocnaPompyCieplaInput): Warning[] {
  const profil = input.profilGodzinowy
  const godziny = input.godzinyStrefyNocnej
  const bledy: Warning[] = []
  if (profil.length > 0) {
    const suma = profil.reduce((a, b) => a + b, 0)
    if (profil.length !== GODZIN_NA_DOBE || profil.some((w) => !Number.isFinite(w) || w < 0) || suma <= 0) {
      bledy.push({
        code: "TAN-PROFIL-POZA-ZAKRESEM",
        level: "critical",
        params: { n: profil.length },
        technicalMessage: `profilGodzinowy: ${profil.length} wartości, suma ${suma}; oczekiwano 24 wartości >= 0 o sumie > 0`,
        field: "profilGodzinowy",
      })
    }
  }
  if (godziny.length > 0) {
    const poprawne = godziny.every((h) => Number.isInteger(h) && h >= 0 && h < GODZIN_NA_DOBE)
    if (!poprawne || new Set(godziny).size !== godziny.length) {
      bledy.push({
        code: "TAN-STREFA-POZA-ZAKRESEM",
        level: "critical",
        technicalMessage: `godzinyStrefyNocnej = [${godziny.join(", ")}]; oczekiwano różnych liczb całkowitych 0–23`,
        field: "godzinyStrefyNocnej",
      })
    } else if (input.godzinyNocH > 0 && godziny.length !== input.godzinyNocH) {
      bledy.push({
        code: "TAN-STREFA-NIEZGODNA-Z-DLUGOSCIA",
        level: "critical",
        params: { n: godziny.length, h: input.godzinyNocH },
        technicalMessage: `godzinyStrefyNocnej ma ${godziny.length} h, a godzinyNocH = ${input.godzinyNocH}`,
        field: "godzinyStrefyNocnej",
      })
    }
  }
  if (profil.length > 0 && godziny.length === 0) {
    bledy.push({
      code: "TAN-PROFIL-BEZ-STREFY",
      level: "critical",
      technicalMessage: "profilGodzinowy podany bez godzinyStrefyNocnej — przy nierównym profilu potrzebne są godziny strefy",
      field: "godzinyStrefyNocnej",
    })
  }
  return bledy
}
