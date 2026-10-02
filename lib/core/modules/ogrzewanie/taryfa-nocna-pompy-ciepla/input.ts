/**
 * Moduł 6, Część 2C — „Pompa ciepła: praca w taryfie nocnej” (dawne 5.59, Biblia §6.27.33). Hybrid houses with a grid
 * connection (owner decision D71, 02.10.2026) and houses with a night-time generator. Every price, hour and COP comes
 * from the user (Dyrektywa #1) — the source gives no tariff prices, no zone hours and no buffer model.
 */

/** Where the night energy comes from — decides the warning (source: „z baterii off-grid to nie to samo, co z sieci”). */
export type ZasilanieNocy = "siec" | "agregat" | "bateria"

export type TaryfaNocnaPompyCieplaInput = {
  /** Heat the house needs per day [kWh thermal] (e.g. Screen 2 C.O. + C.W.U.). 0 = not entered. */
  cieploDobaKwh: number
  /** Length of the cheap (night) tariff zone per day [h] — from the tariff the user has. 0 = not entered. */
  godzinyNocH: number
  /** Price of 1 kWh of electricity in the day zone [zł/kWh] (the user's own price). 0 = not entered. */
  cenaDzienZlKwh: number
  /** Price of 1 kWh in the night zone [zł/kWh]; for a generator: the user's cost of 1 kWh. 0 = not entered. */
  cenaNocZlKwh: number
  /** Heat pump COP in the day zone. 0 = not entered. */
  copDzien: number
  /** Heat pump COP at night (colder air — usually lower); 0 = the same as `copDzien`. */
  copNoc: number
  /** Buffer volume [l] that can be charged at night; 0 = no buffer (nothing can be shifted). */
  pojemnoscBuforaL: number
  /** Usable temperature swing of the buffer [K] (charged − minimum useful). 0 = not entered. */
  deltaTBuforaK: number
  /** Source of the night energy. */
  zasilanieNocy: ZasilanieNocy
}
