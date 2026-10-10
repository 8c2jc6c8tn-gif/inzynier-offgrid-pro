import type { Warning } from "@/lib/core/calc-result"
import { MAKS_PANELI_W_ZESTAWIE, NOCT_T_OTOCZENIA_C, TMIN_ZAKRES_C, WYSOKOSC_KONSTRUKCJI_ZAKRES_M, WYSOKOSC_NPM_ZAKRES_M } from "./constants"
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
  const wm = input.wymiaryMiejsca
  if (wm) {
    const dodatnie: [string, number][] = [["dlugoscM", wm.dlugoscM], ["szerokoscM", wm.szerokoscM]]
    for (const [pole, v] of dodatnie) if (!(Number.isFinite(v) && v > 0)) errors.push(porpPozaZakresem("PORP-WYMIARY-MIEJSCA-POZA-ZAKRESEM", pole, v, "> 0 m"))
    if (!nieujemna(wm.marginesM)) errors.push(wartoscUjemnaPorp("marginesM", wm.marginesM))
    const { oknoOdH: od, oknoDoH: doH } = wm
    if (od !== undefined || doH !== undefined) {
      if (od === undefined || doH === undefined || !(Number.isFinite(od) && Number.isFinite(doH) && od >= 0 && doH <= 24 && od < doH)) {
        errors.push(porpPozaZakresem("PORP-OKNO-ODSTEPU-POZA-ZAKRESEM", "oknoOdH", od ?? Number.NaN, "oba końce w 0–24 godz., początek przed końcem"))
      }
    }
  }
  if (input.tminC !== undefined && input.tminC !== null && !(Number.isFinite(input.tminC) && input.tminC >= TMIN_ZAKRES_C[0] && input.tminC <= TMIN_ZAKRES_C[1])) {
    errors.push(porpPozaZakresem("PORP-TMIN-POZA-ZAKRESEM", "tminC", input.tminC, `${TMIN_ZAKRES_C[0]}…${TMIN_ZAKRES_C[1]} °C`))
  }
  const obc = input.obciazenia
  if (obc) {
    const [npmMin, npmMax] = WYSOKOSC_NPM_ZAKRES_M
    if (obc.wysokoscNpmM !== null && !(Number.isFinite(obc.wysokoscNpmM) && obc.wysokoscNpmM >= npmMin && obc.wysokoscNpmM <= npmMax)) {
      errors.push(porpPozaZakresem("PORP-WYSOKOSC-NPM-POZA-ZAKRESEM", "wysokoscNpmM", obc.wysokoscNpmM, `${npmMin}…${npmMax} m`))
    }
    const [hMin, hMax] = WYSOKOSC_KONSTRUKCJI_ZAKRES_M
    if (obc.wysokoscKonstrukcjiM !== null && !(Number.isFinite(obc.wysokoscKonstrukcjiM) && obc.wysokoscKonstrukcjiM >= hMin && obc.wysokoscKonstrukcjiM <= hMax)) {
      errors.push(porpPozaZakresem("PORP-WYSOKOSC-KONSTRUKCJI-POZA-ZAKRESEM", "wysokoscKonstrukcjiM", obc.wysokoscKonstrukcjiM, `${hMin}…${hMax} m`))
    }
  }
  const bil = input.bilansGodzinowy
  if (bil) {
    if (!nieujemna(bil.pojemnoscKwh)) errors.push(wartoscUjemnaPorp("pojemnoscKwh", bil.pojemnoscKwh))
    if (bil.sprawnoscCyklu !== null && !(Number.isFinite(bil.sprawnoscCyklu) && bil.sprawnoscCyklu > 0 && bil.sprawnoscCyklu <= 1)) {
      errors.push(porpPozaZakresem("PORP-SPRAWNOSC-CYKLU-POZA-ZAKRESEM", "sprawnoscCyklu", bil.sprawnoscCyklu, "(0–1] czyli (0–100] %"))
    }
  }
  const zap = input.zapotrzebowanieMiesiaceKwh
  if (zap) {
    if (zap.length !== 12) errors.push(porpPozaZakresem("PORP-ZAPOTRZEBOWANIE-POZA-ZAKRESEM", "zapotrzebowanieMiesiaceKwh", zap.length, "12 liczb >= 0"))
    for (const v of zap) if (!nieujemna(v)) errors.push(wartoscUjemnaPorp("zapotrzebowanieMiesiaceKwh", v))
  }
  for (const p of input.panele) {
    for (const [pole, v] of [["dlugoscMm", p.dlugoscMm], ["szerokoscMm", p.szerokoscMm], ["masaKg", p.masaKg]] as [string, number | null][]) {
      if (v !== null && !(Number.isFinite(v) && v > 0)) errors.push(porpPozaZakresem("PORP-WYMIARY-PANELU-POZA-ZAKRESEM", pole, v, "> 0"))
    }
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
    const ob = p.obciazenie
    if (ob) {
      const liczby: [string, number | null | undefined][] = [["przodPa", ob.przodPa], ["tylPa", ob.tylPa], ["wiatrPrzodPa", ob.wiatrPrzodPa]]
      for (const [pole, v] of liczby) if (v !== null && v !== undefined && !(Number.isFinite(v) && v > 0)) errors.push(porpPozaZakresem("PORP-OBCIAZENIE-PANELU-POZA-ZAKRESEM", pole, v, "> 0 Pa"))
    }
    const el = p.elektryka
    if (el) {
      const dodatnie: [string, number][] = [["vocV", el.vocV], ["vmpV", el.vmpV], ["iscA", el.iscA], ["impA", el.impA], ["maxNapieciaSystemuV", el.maxNapieciaSystemuV]]
      for (const [pole, v] of dodatnie) if (!(Number.isFinite(v) && v > 0)) errors.push(porpPozaZakresem("PORP-ELEKTRYKA-POZA-ZAKRESEM", pole, v, "> 0"))
      if (!(Number.isFinite(el.betaVocPctNaC) && el.betaVocPctNaC < 0)) errors.push(porpPozaZakresem("PORP-ELEKTRYKA-POZA-ZAKRESEM", "betaVocPctNaC", el.betaVocPctNaC, "< 0 %/°C"))
      if (el.maxBezpiecznikSzeregowyA !== null && !(Number.isFinite(el.maxBezpiecznikSzeregowyA) && el.maxBezpiecznikSzeregowyA > 0)) {
        errors.push(porpPozaZakresem("PORP-ELEKTRYKA-POZA-ZAKRESEM", "maxBezpiecznikSzeregowyA", el.maxBezpiecznikSzeregowyA, "> 0 A"))
      }
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
        : w.rodzaj === "dzienNoc"
          ? [["zlKwhDzien", w.zlKwhDzien], ["zlKwhNoc", w.zlKwhNoc]]
          : [["zlKwh", w.zlKwh]]
    for (const [pole, v] of liczby) if (!nieujemna(v)) errors.push(wartoscUjemnaPorp(pole, v))
    if (w.rodzaj === "dzienNoc") {
      if (w.oknaTanie.length === 0) errors.push(porpPozaZakresem("PORP-OKNA-STREFY-POZA-ZAKRESEM", "oknaTanie", 0, "co najmniej jedno okno"))
      for (const o of w.oknaTanie) {
        const poprawna = (h: number) => Number.isInteger(h) && h >= 0 && h <= 24
        if (!poprawna(o.odH) || !poprawna(o.doH) || o.odH === o.doH) {
          errors.push(porpPozaZakresem("PORP-GODZINA-STREFY-POZA-ZAKRESEM", "oknaTanie", o.odH, "całkowite godziny 0–24, początek różny od końca"))
        }
      }
    }
  }
  return { errors }
}
