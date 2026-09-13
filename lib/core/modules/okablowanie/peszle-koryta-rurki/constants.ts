import type { MiejsceMontazu } from "./input"

/** Katalog osłon 1:1 ze źródła (Ekran 24, Wzorzec B). */
export type Oslona = {
  id: string
  nazwa: string
  zalecaneMiejsce: MiejsceMontazu
  opis: string
}

export const OSLONY: Oslona[] = [
  {
    id: "peszel-karbowany",
    nazwa: "Peszel karbowany",
    zalecaneMiejsce: "wewnatrz",
    opis: "Standardowa osłona do montażu wewnątrz budynku.",
  },
  {
    id: "peszel-uv",
    nazwa: "Peszel UV-odporny czarny",
    zalecaneMiejsce: "na-scianie-zewnatrz",
    opis: "Odporny na promieniowanie UV — do prowadzenia po ścianach na zewnątrz.",
  },
  {
    id: "rura-hdpe",
    nazwa: "Rura HDPE",
    zalecaneMiejsce: "w-ziemi",
    opis: "Sztywna, szczelna rura do układania w ziemi.",
  },
  {
    id: "korytko-metalowe",
    nazwa: "Korytko metalowe",
    zalecaneMiejsce: "przemyslowe",
    opis: "Do zastosowań przemysłowych — mechanicznie wytrzymałe, łatwe do rozbudowy.",
  },
]

export const ETYKIETY_MIEJSC: Record<MiejsceMontazu, string> = {
  wewnatrz: "Wewnątrz budynku",
  "na-scianie-zewnatrz": "Na ścianie na zewnątrz",
  "w-ziemi": "W ziemi",
  przemyslowe: "Instalacja przemysłowa",
}
