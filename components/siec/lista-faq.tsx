import Link from "next/link"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import type { PytanieFaq } from "./tresci-faq"

/** M14 FAQ (D14/F13), Wzorzec C — one collapsible section per question. */
export function ListaFaq({ pytania }: { pytania: PytanieFaq[] }) {
  return (
    <div className="flex flex-col gap-3">
      {pytania.map((p) => (
        <SekcjaAkordeon key={p.id} tytul={p.pytanie}>
          <p className="text-small">{p.odpowiedz}</p>
          {p.link && (
            <Link className="mt-2 inline-block text-small underline" href={p.link.href}>
              {p.link.etykieta} →
            </Link>
          )}
        </SekcjaAkordeon>
      ))}
    </div>
  )
}
