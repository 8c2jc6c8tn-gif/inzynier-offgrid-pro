"use client"

import {
  NARZEDZIA_FAKTY,
  PRZECHOWYWANIE_FAKTY,
  RECYKLING_FAKTY,
  type FaktStopka,
} from "@/lib/core/modules/montaz-baterii/przechowywanie-recykling-olow/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { useTranslate } from "@/lib/i18n/language-context"

function ListaFaktow({ fakty }: { fakty: FaktStopka[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {fakty.map((fakt) => (
        <li
          key={fakt.id}
          className={fakt.hardStop ? "text-small text-werdykt-blad" : "text-small text-muted-foreground"}
        >
          {fakt.hardStop && "🔴 "}
          {fakt.tekst}
        </li>
      ))}
    </ul>
  )
}

export default function PrzechowywanieRecyklingOlowPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przechowywanie-recykling-olow" />
      <NaglowekEkranu tytul={t("UI-PRZRECOLO-PRZECHOWYWANIE-RECYKLING-NAR")} ekran="przechowywanie-recykling-olow">
        {t("UI-PRZRECOLO-MODUL-EKRAN-B12")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <SekcjaAkordeon tytul={t("UI-PRZRECOLO-PRZECHOWYWANIE")} domyslnieOtwarta>
          <ListaFaktow fakty={PRZECHOWYWANIE_FAKTY} />
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul={t("UI-PRZRECOLO-RECYKLING")}>
          <ListaFaktow fakty={RECYKLING_FAKTY} />
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul={t("UI-PRZRECOLO-NARZEDZIA")}>
          <ListaFaktow fakty={NARZEDZIA_FAKTY} />
        </SekcjaAkordeon>
      </div>

      
    </main>
  )
}
