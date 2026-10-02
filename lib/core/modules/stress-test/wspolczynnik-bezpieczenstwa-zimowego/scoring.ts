import type { SkladowaId } from "./constants"
import type { WspolczynnikInput } from "./input"

/**
 * ✅🤖 Mapping of the raw values to a 0–100% component score. The source gives no mapping, so every component is
 * a ratio „what the system has ÷ what the scenario needs”, capped at 100% (more than needed is not rewarded),
 * and the SPOF component is the share of components with redundancy. `null` = the inputs are not complete yet.
 */
const proc = (ma: number, potrzeba: number) => Math.min(100, Math.max(0, (ma / potrzeba) * 100))

export function punktacjaSkladowych(input: WspolczynnikInput): Record<SkladowaId, number | null> {
  const { produkcjaNajgorszyMiesiacKwh: prod, zapotrzebowanieNajgorszyMiesiacKwh: zap } = input
  const { autonomiaDni: dni, wymaganaAutonomiaDni: dniWym } = input
  const { liczbaKomponentow: n, liczbaSpof: spof } = input
  const { oknoReakcjiH: okno, wymaganyCzasReakcjiH: wymH } = input

  let agregat: number | null = null
  if (input.brakAgregatu) agregat = 0
  else if (input.mocAgregatuKw !== null && input.mocWymaganaAgregatuKw !== null && input.mocWymaganaAgregatuKw > 0) {
    agregat = proc(input.mocAgregatuKw, input.mocWymaganaAgregatuKw)
  }

  return {
    pokrycie: prod !== null && zap !== null && zap > 0 ? proc(prod, zap) : null,
    autonomia: dni !== null && dniWym !== null && dniWym > 0 ? proc(dni, dniWym) : null,
    odpornosc: n !== null && spof !== null && n > 0 ? proc(n - spof, n) : null,
    agregat,
    reakcja: okno !== null && wymH !== null && wymH > 0 ? proc(okno, wymH) : null,
  }
}
