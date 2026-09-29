import type { Warning } from "@/lib/core/calc-result"
import type { ScenariuszePrzejsciaInput } from "./input"
import { wartoscUjemna } from "../rachunek-za-prad/warnings"
import { validateInput as validateSciezka } from "../sciezka-cen-energii/validation"
import { validateInput as validateBilans } from "../bilans-miesieczny/validation"
import { SCENARIUSZE } from "./constants"

export function validateInput(input: ScenariuszePrzejsciaInput): Warning[] {
  const errors: Warning[] = [
    ...validateSciezka({ rokBazowy: input.rokBazowy, horyzontLat: input.horyzontLat, kosztRocznyZl: 0, tryb: input.tryb }),
    ...validateBilans({
      tryb: "siec",
      zuzycieMiesieczneKwh: input.zuzycieMiesieczneKwh,
      uzyskMiesiecznyKwhNaKwp: input.uzyskMiesiecznyKwhNaKwp,
      mocPvKwp: 0,
      autokonsumpcjaBezposrednia: input.autokonsumpcjaBezposrednia,
      pojemnoscMagazynuKwh: 0,
      sprawnoscMagazynu: input.sprawnoscMagazynu,
    }),
  ]
  const nieujemne: [string, number | null][] = [
    ["stopaDyskontowaProcent", input.stopaDyskontowaProcent],
    ["zywotnoscMagazynuLat", input.zywotnoscMagazynuLat],
    ["siec.kosztStalyRokBruttoZl", input.siec.kosztStalyRokBruttoZl],
    ["siec.cenaZmiennaKwhBruttoZl", input.siec.cenaZmiennaKwhBruttoZl],
    ["siec.wartoscNadwyzkiKwhZl", input.siec.wartoscNadwyzkiKwhZl],
    ["agregat.mocKw", input.agregat.mocKw],
    ["agregat.zuzycieLH", input.agregat.zuzycieLH],
    ["agregat.cenaPaliwaZlL", input.agregat.cenaPaliwaZlL],
    ["kontrola.progGodzinAgregatuMies", input.kontrola.progGodzinAgregatuMies],
    ["kontrola.dopuszczalnyCzasBezZasilaniaH", input.kontrola.dopuszczalnyCzasBezZasilaniaH],
  ]
  for (const id of SCENARIUSZE) {
    const s = input.scenariusze[id]
    nieujemne.push(
      [`${id}.inwestycjaZl`, s.inwestycjaZl],
      [`${id}.dotacjaZl`, s.dotacjaZl],
      [`${id}.mocPvKwp`, s.mocPvKwp],
      [`${id}.pojemnoscMagazynuKwh`, s.pojemnoscMagazynuKwh],
      [`${id}.kosztMagazynuZl`, s.kosztMagazynuZl],
      [`${id}.serwisRokZl`, s.serwisRokZl],
    )
  }
  for (const [pole, v] of nieujemne) {
    if (v !== null && !(v >= 0)) errors.push(wartoscUjemna(pole, v))
  }
  return errors
}
