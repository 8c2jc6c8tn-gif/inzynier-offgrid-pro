import Link from "next/link"
import { notFound } from "next/navigation"
import { KAFLE, znajdzKafel } from "@/lib/pulpit/registry"

export function generateStaticParams() {
  return KAFLE.map((k) => ({ id: String(k.id) }))
}

export default async function ModulPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const kafel = znajdzKafel(Number(id))

  if (!kafel) notFound()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Pulpit
        </Link>
        <h1 className="mt-2 text-xl font-semibold">
          {kafel.ikona} Moduł {kafel.id} — {kafel.nazwa}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{kafel.opis}</p>
      </div>

      <ul className="flex flex-col gap-3">
        {kafel.ekrany.map((ekran) => (
          <li key={ekran.href}>
            <Link
              href={ekran.href}
              className="flex min-h-11 items-center rounded-md border p-3 text-sm font-medium hover:bg-muted"
            >
              {ekran.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
