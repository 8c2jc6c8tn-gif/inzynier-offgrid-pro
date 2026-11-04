/**
 * Photo time → UTC. EXIF stores local wall-clock time; modern phones add the UTC offset
 * (OffsetTimeOriginal). Without it the Polish official time is assumed (UTC+1 in winter, UTC+2
 * from the last Sunday of March to the last Sunday of October) and the caller reports the assumption.
 */
import { godzinaLokalnaPl } from "@/lib/core/modules/pv/porownywarka-paneli/uzysk"
import { MINUT_NA_GODZINE, MS_NA_MINUTE } from "./constants"

export type CzasLokalnyZdjecia = { rok: number; miesiac: number; dzien: number; godzina: number; minuta: number; sekunda: number }

export type CzasUtcZdjecia = { utcMs: number; zalozonoCzasPolski: boolean }

/** Offset of Polish official time against UTC [min] for the given local wall-clock time. */
function przesuniecieMinPolska(c: CzasLokalnyZdjecia): number {
  const lokalnyJakUtc = Date.UTC(c.rok, c.miesiac - 1, c.dzien, c.godzina, c.minuta, c.sekunda)
  // First guess: winter offset; the transition is at 01:00 UTC, so one iteration settles it except for the transition hour itself.
  const przypuszczenie = lokalnyJakUtc - MINUT_NA_GODZINE * MS_NA_MINUTE
  const godzinaUtc = new Date(przypuszczenie).getUTCHours()
  const przesuniecieH = (godzinaLokalnaPl(przypuszczenie) - godzinaUtc + 24) % 24
  return przesuniecieH * MINUT_NA_GODZINE
}

export function czasUtcZLokalnego(c: CzasLokalnyZdjecia, przesuniecieMin: number | null): CzasUtcZdjecia {
  const lokalnyJakUtc = Date.UTC(c.rok, c.miesiac - 1, c.dzien, c.godzina, c.minuta, c.sekunda)
  const offset = przesuniecieMin ?? przesuniecieMinPolska(c)
  return { utcMs: lokalnyJakUtc - offset * MS_NA_MINUTE, zalozonoCzasPolski: przesuniecieMin === null }
}
