/**
 * Moduł 6, Część 2C — „Pompa ciepła: chłodzenie latem” (dawne 5.29, Biblia §6.27.3), z dołożonymi: free cooling z
 * dolnego źródła (dawne 5.47, §6.27.21), porównanie z klimatyzatorem (dawne 5.51, §6.27.25) i energia na usunięcie
 * letnich zysków (część dawnego 5.53, §6.27.27). Źródło nie daje modelu zysków letnich ani wydajności free coolingu —
 * ciepło do usunięcia, EER, moce i temperatury wpisuje user (Dyrektywa #1).
 */

export type ChlodzeniePompaCieplaInput = {
  /** Ciepło do usunięcia z domu na dobę latem [kWh] (zyski słoneczne, bytowe, wentylacja). 0 = nie wpisano. */
  chlodDobaKwh: number
  /** EER pompy ciepła w trybie chłodzenia. 0 = nie wpisano. */
  eerPompy: number
  /** EER klimatyzatora do porównania; 0 = bez porównania. */
  eerKlimatyzatora: number
  /** Free cooling: moc pompy obiegowej dolnego źródła [W]; 0 = bez free coolingu. */
  mocObiegowejW: number
  /** Free cooling: godziny pracy pompy obiegowej na dobę [h]. */
  godzinyFreeCoolingH: number
  /** Temperatura zasilania chłodzenia podłogowego/klimakonwektorów [°C]; null = nie sprawdzaj rosy. */
  tZasilaniaC: number | null
  /** Temperatura w pomieszczeniu [°C]; null = nie wpisano. */
  tPomieszczeniaC: number | null
  /** Wilgotność względna w pomieszczeniu [%]; 0 = nie wpisano. */
  wilgotnoscPct: number
  /** Porównanie grzania (dawne 5.51): ciepło na sezon [kWh]; 0 = bez porównania. */
  cieploSezonKwh: number
  /** COP pompy ciepła w grzaniu; 0 = nie wpisano. */
  copPompy: number
  /** COP klimatyzatora w grzaniu; 0 = nie wpisano. */
  copKlimatyzatora: number
}
