/**
 * Ekran 35, Moduł 12 "Szybki kalkulator / tryb mobilny" — "Agregat przenośny — ile paliwa na dobę"
 * (dawne 8.62, docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md; Biblia §12.50). Wzorzec D.
 * Uproszczona wersja M7/E2 dla jednego przenośnego agregatu, z blokiem bezpieczeństwa D48.
 */
import type { BezpieczenstwoAgregatuInput } from "@/lib/core/modules/zapotrzebowanie/agregat-pradotworczy/bezpieczenstwo"

export type AgregatPaliwoInput = BezpieczenstwoAgregatuInput & {
  /** Moc znamionowa agregatu [kW]. 0 = nie wpisano. */
  mocAgregatuKw: number
  /** Średnie obciążenie agregatu w czasie pracy [%] — od usera. */
  obciazeniePct: number
  /** Zużycie paliwa przy tym obciążeniu [l/h] — z karty agregatu (Dyrektywa #1). */
  zuzycieLH: number
  /** Ile godzin na dobę agregat pracuje (tylko gdy bateria niska) [h]. */
  godzinNaDobe: number
  /** Cena paliwa [zł/l]. */
  cenaZlL: number
  /** Opcjonalny koszt energii z innego źródła do porównania [zł/kWh]; 0 = bez porównania. */
  kosztPorownawczyZlKwh: number
}
