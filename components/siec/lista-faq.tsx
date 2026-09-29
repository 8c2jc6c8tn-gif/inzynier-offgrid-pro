"use client"

import Link from "next/link"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { useTranslate } from "@/lib/i18n/language-context"
import type { PytanieFaq } from "./tresci-faq"

/** M14 FAQ (D14/F13), Wzorzec C — one collapsible section per question. */
export function ListaFaq({ pytania }: { pytania: PytanieFaq[] }) {
  const t = useTranslate()
  return (
    <div className="flex flex-col gap-3">
      {pytania.map((p) => (
        <SekcjaAkordeon key={p.id} tytul={t(p.pytanie)}>
          <p className="text-small">{t(p.odpowiedz)}</p>
          {p.link && (
            <Link className="mt-2 inline-block text-small underline" href={p.link.href}>
              {t(p.link.etykieta)} →
            </Link>
          )}
        </SekcjaAkordeon>
      ))}
    </div>
  )
}
