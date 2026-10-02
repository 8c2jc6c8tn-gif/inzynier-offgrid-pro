import { parsujCsv, type BladCsv, type ProfilCsv } from "@/lib/core/telemetria/csv"
import { ocenJakosc, usunDuplikaty, type RaportJakosci } from "@/lib/core/telemetria/jakosc"
import type { MagazynProbek } from "./magazyn-probek"

export interface WynikImportu {
  zapisane: number
  bledy: BladCsv[]
  jakosc: RaportJakosci
}

/**
 * CSV text → parsed → de-duplicated → stored (raw samples only, results are recomputed later) with a quality report.
 * `krokMs` is the declared sampling step of the file; it is never inferred.
 */
export async function importujCsv(
  tekst: string,
  profil: ProfilCsv,
  zrodloId: string,
  krokMs: number,
  magazyn: MagazynProbek,
): Promise<WynikImportu> {
  const { probki, bledy } = parsujCsv(tekst, profil, zrodloId)
  const unikalne = usunDuplikaty(probki)
  await magazyn.dodaj(unikalne)
  return { zapisane: unikalne.length, bledy, jakosc: ocenJakosc(probki, krokMs) }
}
