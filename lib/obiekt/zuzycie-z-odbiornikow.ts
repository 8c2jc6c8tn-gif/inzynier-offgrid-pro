/**
 * Zużycie mikroinstalacji w 12 miesiącach z listy odbiorników Modułu 12 („Zużycie energii per urządzenie”, draft
 * `zuzycie-per-urzadzenie`) i miesięcy użytkowania z profilu obiektu. Czyste funkcje; ekrany czytają dwa drafty i wołają tę funkcję.
 */
import { calculateZuzyciePerUrzadzenie } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/calculator"
import type { PozycjaZuzycia } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/input"
import { czyMikroinstalacja, zuzycieMiesieczneZDobowychKwh, type ProfilObiektu, type RodzajObiektu } from "./profil-obiektu"

export const KLUCZ_DRAFTU_ODBIORNIKOW = "zuzycie-per-urzadzenie"

export type DraftOdbiornikow = { urzadzenia: PozycjaZuzycia[] }

/** Dobowe zużycie listy odbiorników [Wh]; `null`, gdy lista niekompletna (np. odbiornik cykliczny bez współczynnika pracy) albo pusta. */
export function dobowaWhZOdbiornikow(draft: DraftOdbiornikow | null): number | null {
  if (!draft) return null
  const wynik = calculateZuzyciePerUrzadzenie({ urzadzenia: draft.urzadzenia })
  return wynik.status === "VALID" && wynik.value.sumaWh > 0 ? wynik.value.sumaWh : null
}

/** Does the device run in the month (0 = January)? No month list, or a malformed one, means every month. */
export function pracujeWMiesiacu(u: PozycjaZuzycia, miesiac: number): boolean {
  return !u.miesiace || u.miesiace.length !== 12 || u.miesiace[miesiac] !== false
}

/** Does the device belong to this site kind? No list (or a non-micro kind) means yes — nothing is hidden by default. */
export function dotyczyObiektu(u: PozycjaZuzycia, rodzaj: RodzajObiektu | ""): boolean {
  if (!u.obiekty || u.obiekty.length === 0 || !czyMikroinstalacja(rodzaj)) return true
  return (u.obiekty as readonly string[]).includes(rodzaj)
}

/** The list reduced to the devices of the chosen site kind. */
export function odbiornikiObiektu(draft: DraftOdbiornikow | null, rodzaj: RodzajObiektu | ""): DraftOdbiornikow | null {
  return draft ? { urzadzenia: draft.urzadzenia.filter((u) => dotyczyObiektu(u, rodzaj)) } : null
}

/** Some device has its own months of operation (seasonal load). */
export function maOdbiornikiSezonowe(draft: DraftOdbiornikow | null): boolean {
  return !!draft && draft.urzadzenia.some((u) => !!u.miesiace && u.miesiace.length === 12 && u.miesiace.some((m) => !m))
}

/**
 * Dobowe zużycie listy odbiorników w każdym z 12 miesięcy [Wh/dobę]: tylko urządzenia, które w tym miesiącu pracują. `null`, gdy
 * lista jest niekompletna (jak w `dobowaWhZOdbiornikow`) — niekompletność dowolnego urządzenia unieważnia całość, nie tylko jego miesiące.
 */
export function dobowaWhNaMiesiac(draft: DraftOdbiornikow | null): number[] | null {
  if (!draft || dobowaWhZOdbiornikow(draft) === null) return null
  return Array.from({ length: 12 }, (_, m) => {
    const wynik = calculateZuzyciePerUrzadzenie({ urzadzenia: draft.urzadzenia.filter((u) => pracujeWMiesiacu(u, m)) })
    return wynik.status === "VALID" ? wynik.value.sumaWh : 0
  })
}

export function zuzycieMikroinstalacjiKwh(odbiorniki: DraftOdbiornikow | null, profil: ProfilObiektu | null): number[] | null {
  const dobowe = dobowaWhNaMiesiac(profil ? odbiornikiObiektu(odbiorniki, profil.rodzaj) : odbiorniki)
  return dobowe === null || !profil ? null : zuzycieMiesieczneZDobowychKwh(dobowe, profil.miesiaceUzytkowania)
}
