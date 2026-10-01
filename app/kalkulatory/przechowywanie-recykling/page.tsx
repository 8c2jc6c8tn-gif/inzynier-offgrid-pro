"use client"

import {
  NARZEDZIA_DIAGNOSTYCZNE_FAKTY,
  PRZECHOWYWANIE_FAKTY,
  RECYKLING_FAKTY,
} from "@/lib/core/modules/montaz-baterii/przechowywanie-recykling/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { useTranslate } from "@/lib/i18n/language-context"

export default function PrzechowywanieRecyklingPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przechowywanie-recykling" />
      <NaglowekEkranu tytul={t("UI-PRZREC-PRZECHOWYWANIE-RECYKLING-NAR")} ekran="przechowywanie-recykling">
        {t("UI-PRZREC-MODUL-EKRAN-A10")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <SekcjaAkordeon tytul={t("UI-PRZREC-PRZECHOWYWANIE")} domyslnieOtwarta>
          <ul className="flex flex-col gap-2">
            {PRZECHOWYWANIE_FAKTY.map((fakt) => (
              <li key={fakt.id} className="text-small text-muted-foreground">
                {fakt.tekst}
              </li>
            ))}
          </ul>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul={t("UI-PRZREC-RECYKLING")}>
          <ul className="flex flex-col gap-2">
            {RECYKLING_FAKTY.map((fakt) => (
              <li key={fakt.id} className="text-small text-muted-foreground">
                {fakt.tekst}
              </li>
            ))}
          </ul>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul={t("UI-PRZREC-NARZEDZIA-DIAGNOSTYCZNE")}>
          <ul className="flex flex-col gap-2">
            {NARZEDZIA_DIAGNOSTYCZNE_FAKTY.map((fakt) => (
              <li key={fakt.id} className="text-small text-muted-foreground">
                {fakt.tekst}
              </li>
            ))}
          </ul>
        </SekcjaAkordeon>
      </div>

      
    </main>
  )
}
