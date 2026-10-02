/**
 * Moduł 6, Część 2B — dokładka do Ekranu 14 (bufor ciepła): „Pompa ciepła – współpraca z buforem” (dawne 5.28, Biblia
 * §6.27.2) i „praca z buforem i bez bufora” (dawne 5.70, §6.27.44). Every number from the user (Dyrektywa #1): the
 * controller hysteresis and installation water volume from the installer, the standing loss from the buffer datasheet.
 */
export type BuforPracaPompyInput = {
  /** Heating power of the pump [kW] (Screen 14). 0 = not entered. */
  mocPompyKw: number
  /** Average heat load of the house in the analysed period [kW]. 0 = not entered. */
  obciazenieKw: number
  /** Water in the heating installation without the buffer [l]. 0 = not entered. */
  wodaInstalacjiL: number
  /** Controller hysteresis (switch-on/switch-off difference) [K]. 0 = not entered. */
  histerezaK: number
  /** Buffer volume [l] (Screen 14). 0 = not entered. */
  buforL: number
  /** How many K the buffer can be charged above the lowest useful temperature (e.g. with PV) [K] — optional, 0 = not entered. */
  dTMagazynK: number
  /** Standing heat loss of the buffer [W] — datasheet (ErP label "S"); optional, 0 = not entered. */
  stratyPostojoweW: number
  /** Days of operation in the season — optional, 0 = no seasonal loss. */
  dniPracy: number
}
