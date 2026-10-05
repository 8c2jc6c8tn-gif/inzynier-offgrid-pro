import type { Warning } from "@/lib/core/calc-result"
import { HORYZONT_H, KROK_PLANU_H, godzinaTekst } from "./constants"
import type { PrzesuwanieZadanInput } from "./input"
import { godzinaPozaDoba, pozaSiatka, terminPrzedStartem, wartoscUjemna } from "./warnings"

const naSiatce = (x: number) => Math.abs(x / KROK_PLANU_H - Math.round(x / KROK_PLANU_H)) < 1e-9

/** Errors only (INVALID_INPUT). Missing values (0) are not errors — the calculator returns INCOMPLETE. */
export function validateInput(input: PrzesuwanieZadanInput): Warning[] {
  const errors: Warning[] = []
  for (const p of input.prognoza) {
    const godzina = godzinaTekst(p.godzina)
    if (p.produkcjaKw < 0) errors.push(wartoscUjemna(`produkcja ${godzina}`, { poleKey: "POLE-PRZES-PRODUKCJA", godzina }, p.produkcjaKw))
    if (p.zuzycieKw < 0) errors.push(wartoscUjemna(`zuzycie ${godzina}`, { poleKey: "POLE-PRZES-ZUZYCIE", godzina }, p.zuzycieKw))
  }
  for (const z of input.zadania) {
    const nazwa = z.nazwa
    const czas = { poleKey: "POLE-PRZES-CZAS", nazwa }
    if (z.mocKw < 0) errors.push(wartoscUjemna(`${nazwa}: moc`, { poleKey: "POLE-PRZES-MOC", nazwa }, z.mocKw))
    if (z.czasTrwaniaH < 0) errors.push(wartoscUjemna(`${nazwa}: czas`, czas, z.czasTrwaniaH))
    for (const [field, poleKey, v] of [
      [`${nazwa}: od`, "POLE-PRZES-OD", z.najwczesniejOdH],
      [`${nazwa}: do`, "POLE-PRZES-DO", z.gotoweDoH],
    ] as const) {
      if (v < 0 || v > HORYZONT_H) errors.push(godzinaPozaDoba(field, { poleKey, nazwa }, v, HORYZONT_H))
      else if (!naSiatce(v)) errors.push(pozaSiatka(field, { poleKey, nazwa }, v, KROK_PLANU_H))
    }
    if (z.czasTrwaniaH > 0 && !naSiatce(z.czasTrwaniaH)) errors.push(pozaSiatka(`${nazwa}: czas`, czas, z.czasTrwaniaH, KROK_PLANU_H))
    if (z.gotoweDoH <= z.najwczesniejOdH && z.gotoweDoH >= 0 && z.najwczesniejOdH <= HORYZONT_H)
      errors.push(terminPrzedStartem(z.nazwa, godzinaTekst(z.najwczesniejOdH), godzinaTekst(z.gotoweDoH)))
  }
  return errors
}
