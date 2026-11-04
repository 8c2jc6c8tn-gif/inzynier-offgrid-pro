import Link from "next/link"
import { Ikona, IKONA } from "@/components/ui/ikona"
import { TekstUi } from "@/components/ui/tekst-ui"
import { WPISY_PERSPEKTYW } from "@/lib/perspektywy/wpisy"

export default function PerspektywyPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <div>
        <Link
          href="/"
          className="rounded-md text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <TekstUi kod="UI-MOD-PULPIT" />
        </Link>
        <h1 className="mt-2 text-h1 font-semibold">
          <Ikona nazwa={IKONA.flask} className="mr-1 inline size-6 align-text-bottom" /> <TekstUi kod="UI-PERSP-TYTUL" />
        </h1>
        <p className="mt-1 text-small text-muted-foreground">
          <TekstUi kod="UI-PERSP-OPIS" />
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {WPISY_PERSPEKTYW.map((wpis) => (
          <li key={wpis.id}>
            <Link
              href={`/perspektywy/${wpis.id}`}
              data-karta
              className="flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-foreground/20 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="text-body font-medium">
                <TekstUi kod={wpis.tytul} />
              </span>
              <span className="text-small text-muted-foreground">
                <TekstUi kod={wpis.karta} />
              </span>
              <span className="text-small">
                <TekstUi kod="UI-PERSP-OCENA" />: <strong className="font-semibold"><TekstUi kod={wpis.ocena} /></strong>
                {" · "}
                <TekstUi kod="UI-PERSP-DATA" params={{ data: wpis.data }} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
