import type { Warning } from "@/lib/core/calc-result"
import { MAKS_PANELI_W_ZESTAWIE, NOCT_T_OTOCZENIA_C } from "./constants"
import type { PorownywarkaInput } from "./input"
import { porpPozaZakresem, wartoscUjemnaPorp, zaDuzoPanelowPorp } from "./warnings"

const nieujemna = (v: number) => Number.isFinite(v) && v >= 0

export function validateInput(input: PorownywarkaInput): { errors: Warning[] } {
  const errors: Warning[] = []
  if (input.panele.length > MAKS_PANELI_W_ZESTAWIE) errors.push(zaDuzoPanelowPorp(input.panele.length, MAKS_PANELI_W_ZESTAWIE))
  if (input.liczbaPaneli !== null && (!Number.isInteger(input.liczbaPaneli) || input.liczbaPaneli < 1)) {
    errors.push(porpPozaZakresem("PORP-LICZBA-PANELI-POZA-ZAKRESEM", "liczbaPaneli", input.liczbaPaneli, "całkowita >= 1"))
  }
  const m = input.miejsce
  if (m) {
    if (!Number.isFinite(m.nachylenieDeg) || m.nachylenieDeg < 0 || m.nachylenieDeg > 90) {
      errors.push(porpPozaZakresem("PORP-NACHYLENIE-POZA-ZAKRESEM", "nachylenieDeg", m.nachylenieDeg, "0–90°"))
    }
    if (!Number.isFinite(m.azymutDeg) || m.azymutDeg < 0 || m.azymutDeg > 360) {
      errors.push(porpPozaZakresem("PORP-AZYMUT-POZA-ZAKRESEM", "azymutDeg", m.azymutDeg, "0–360°"))
    }
    if (m.albedo !== undefined && (!Number.isFinite(m.albedo) || m.albedo < 0 || m.albedo > 1)) {
      errors.push(porpPozaZakresem("PORP-ALBEDO-POZA-ZAKRESEM", "albedo", m.albedo, "0–1"))
    }
  }
  for (const p of input.panele) {
    if (!Number.isFinite(p.pmaxW) || p.pmaxW <= 0) errors.push(porpPozaZakresem("PORP-MOC-PANELU-POZA-ZAKRESEM", "pmaxW", p.pmaxW, "> 0 W"))
    const nieujemne: [string, number | null][] = [
      ["cenaBruttoZl", p.cenaBruttoZl],
      ["degradacjaPierwszyRokPct", p.degradacjaPierwszyRokPct],
      ["degradacjaLiniowaPctNaRok", p.degradacjaLiniowaPctNaRok],
    ]
    for (const [pole, v] of nieujemne) if (v !== null && !nieujemna(v)) errors.push(wartoscUjemnaPorp(pole, v))
    if (p.sprawnoscWzglednaPrzy200WPct !== null && !(p.sprawnoscWzglednaPrzy200WPct > 0 && p.sprawnoscWzglednaPrzy200WPct <= 100)) {
      errors.push(porpPozaZakresem("PORP-SPRAWNOSC-200-POZA-ZAKRESEM", "sprawnoscWzglednaPrzy200WPct", p.sprawnoscWzglednaPrzy200WPct, "(0–100] %"))
    }
    if (p.gammaPctNaC !== null && !Number.isFinite(p.gammaPctNaC)) errors.push(porpPozaZakresem("PORP-GAMMA-POZA-ZAKRESEM", "gammaPctNaC", p.gammaPctNaC, "liczba skończona"))
    if (p.noctC !== null && !(Number.isFinite(p.noctC) && p.noctC > NOCT_T_OTOCZENIA_C)) {
      errors.push(porpPozaZakresem("PORP-NOCT-POZA-ZAKRESEM", "noctC", p.noctC, `> ${NOCT_T_OTOCZENIA_C} °C`))
    }
  }
  const w = input.wycena
  if (w) {
    const liczby: [string, number][] =
      w.rodzaj === "agregat"
        ? [["mocKw", w.mocKw], ["obciazeniePct", w.obciazeniePct], ["zuzycieLH", w.zuzycieLH], ["cenaPaliwaZlL", w.cenaPaliwaZlL]]
        : [["zlKwh", w.zlKwh]]
    for (const [pole, v] of liczby) if (!nieujemna(v)) errors.push(wartoscUjemnaPorp(pole, v))
  }
  return { errors }
}
