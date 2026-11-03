import Link from "next/link"
import { TekstUi } from "@/components/ui/tekst-ui"
import { PorownanieAircela } from "@/components/perspektywy/porownanie-aircela"
import type { WpisPerspektywy } from "@/lib/perspektywy/wpisy"

/** One article of the "Project outlook" section: lead, sections with paragraphs or lists, sources. Text comes from `UI-PERSP-*` keys. */
export function WpisPerspektywyArtykul({ wpis }: { wpis: WpisPerspektywy }) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <div>
        <Link
          href="/perspektywy"
          className="rounded-md text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <TekstUi kod="UI-PERSP-WROC" />
        </Link>
        <h1 className="mt-2 text-h1 font-semibold">
          <TekstUi kod={wpis.tytul} />
        </h1>
        <p className="mt-1 text-small text-muted-foreground">
          <TekstUi kod="UI-PERSP-OCENA" />: <strong className="font-semibold text-foreground"><TekstUi kod={wpis.ocena} /></strong>
          {" · "}
          <TekstUi kod="UI-PERSP-DATA" params={{ data: wpis.data }} />
        </p>
      </div>

      <p className="text-body">
        <TekstUi kod={wpis.lead} />
      </p>

      {wpis.sekcje.map((sekcja) => (
        <section key={sekcja.naglowek} className="flex flex-col gap-2">
          <h2 className="text-h2 font-semibold">
            <TekstUi kod={sekcja.naglowek} />
          </h2>
          {sekcja.lista ? (
            <ul className="list-disc space-y-1.5 pl-5 text-body">
              {sekcja.punkty.map((klucz) => (
                <li key={klucz}>
                  <TekstUi kod={klucz} />
                </li>
              ))}
            </ul>
          ) : (
            sekcja.punkty.map((klucz) => (
              <p key={klucz} className="text-body">
                <TekstUi kod={klucz} />
              </p>
            ))
          )}
          {sekcja.tabela === "porownanie-aircela" && <PorownanieAircela />}
          {sekcja.poTabeli?.map((klucz) => (
            <p key={klucz} className="text-body">
              <TekstUi kod={klucz} />
            </p>
          ))}
        </section>
      ))}

      <section className="flex flex-col gap-2">
        <h2 className="text-h2 font-semibold">
          <TekstUi kod="UI-PERSP-H-ZRODLA" />
        </h2>
        <p className="text-small text-muted-foreground">
          <TekstUi kod={wpis.zrodlaOpis} />
        </p>
        <ul className="list-disc space-y-1 pl-5 text-small">
          {wpis.zrodla.map((zrodlo) => (
            <li key={zrodlo.href}>
              <a href={zrodlo.href} target="_blank" rel="noopener noreferrer" className="underline decoration-muted-foreground/50 hover:decoration-foreground">
                {zrodlo.nazwa}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
