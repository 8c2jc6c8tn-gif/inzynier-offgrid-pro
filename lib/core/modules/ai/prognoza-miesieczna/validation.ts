import type { Warning } from "@/lib/core/calc-result"
import type { PrognozaMiesiecznaInput } from "./input"
import { wartoscPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(i: PrognozaMiesiecznaInput): Warning[] {
  const e: Warning[] = []
  i.produkcjaHistoriaKwh.forEach((v, m) => {
    if (v !== null && (!Number.isFinite(v) || v < 0)) e.push(wartoscUjemna(`produkcjaHistoriaKwh[${m}]`, v))
  })
  const d = i.degradacjaRocznaPct
  if (d !== null && (!Number.isFinite(d) || d < 0 || d > 100)) e.push(wartoscPozaZakresem("degradacjaRocznaPct", d, 0, 100))
  const o = i.odchylenieMeteoPct
  if (o !== null && (!Number.isFinite(o) || o < 0 || o > 100)) e.push(wartoscPozaZakresem("odchylenieMeteoPct", o, 0, 100))
  const s = i.miesiacStartu
  if (s !== null && (!Number.isInteger(s) || s < 1 || s > 12)) e.push(wartoscPozaZakresem("miesiacStartu", s, 1, 12))
  const n = i.miesiecyNaprzod
  if (n !== null && (!Number.isInteger(n) || n < 1 || n > 12)) e.push(wartoscPozaZakresem("miesiecyNaprzod", n, 1, 12))
  return e
}
