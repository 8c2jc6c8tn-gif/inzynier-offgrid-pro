import Link from "next/link"
import { notFound } from "next/navigation"
import { MASKOTKA_PO_ID_KAFLA } from "@/lib/pulpit/maskotki"
import { KAFLE, znajdzKafel } from "@/lib/pulpit/registry"
import { TekstUi } from "@/components/ui/tekst-ui"
import { EtykietaEkranu, OpisKafla, TytulModulu } from "@/components/tekst-rejestru"

export function generateStaticParams() {
  return KAFLE.map((k) => ({ id: String(k.id) }))
}

export default async function ModulPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const kafel = znajdzKafel(Number(id))

  if (!kafel) notFound()

  const maskotka = MASKOTKA_PO_ID_KAFLA[kafel.id]

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <Link
          href="/"
          className="rounded-md text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <TekstUi kod="UI-MOD-PULPIT" />
        </Link>
        {maskotka ? (
          <img
            src={maskotka}
            alt=""
            aria-hidden="true"
            className="mt-3 h-48 w-full rounded-lg object-cover object-top"
          />
        ) : null}
        <h1 className="mt-2 text-h1 font-semibold">
          <span aria-hidden="true">{kafel.ikona}</span> <TytulModulu kafel={kafel} />
        </h1>
        <p className="mt-1 text-small text-muted-foreground"><OpisKafla kafel={kafel} /></p>
      </div>

      <ul className="flex flex-col gap-2">
        {kafel.ekrany.map((ekran) => (
          <li key={ekran.href}>
            <Link
              href={ekran.href}
              className="flex min-h-11 items-center justify-between rounded-md border p-3 text-small font-medium transition-colors hover:border-foreground/20 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <EtykietaEkranu kafel={kafel} ekran={ekran} />
              <span aria-hidden="true" className="text-muted-foreground">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
