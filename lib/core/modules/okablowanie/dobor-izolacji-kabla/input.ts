/**
 * Ekran 28, Moduł 5 "Okablowanie i zabezpieczenia" — "Dobór izolacji kabla do warunków montażu"
 * (dawne 4.38, docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md). Wzorzec D.
 */

export type MiejsceTrasy = "ziemia" | "zewnetrznie-blisko-paneli" | "wewnatrz" | "napowietrznie"
export type Izolacja = "PVC" | "XLPE"

export type DoborIzolacjiKablaInput = {
  miejsceTrasy: MiejsceTrasy | null
  /** Izolacja rozważanego kabla. null = jeszcze nie wybrano. */
  izolacjaWybrana: Izolacja | null
  /** Maksymalna spodziewana temperatura w miejscu trasy [°C]. 0 = jeszcze nie wpisano. */
  temperaturaMaksymalnaC: number
}
