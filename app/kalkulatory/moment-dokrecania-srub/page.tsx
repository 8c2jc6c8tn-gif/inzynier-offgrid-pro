"use client"

import { useMemo } from "react"
import { calculateMomentDokrecania } from "@/lib/core/modules/baterie/moment-dokrecania-srub/calculator"
import {
  CHECKLIST_ITEMS,
  formatujMoment,
  OSTRZEZENIA_STALE,
  OSTRZEZENIE_INNE_OGNIWO,
  TYPY_OGNIW,
  znajdzTypOgniwa,
} from "@/lib/core/modules/baterie/moment-dokrecania-srub/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  potwierdzoneIds: string[]
  typOgniwaId: string
}

const STAN_POCZATKOWY: FormularzStan = {
  potwierdzoneIds: [],
  typOgniwaId: TYPY_OGNIW[0].id,
}

export default function MomentDokrecaniaSrubPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("moment-dokrecania-srub", STAN_POCZATKOWY)
  const { potwierdzoneIds, typOgniwaId } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)
  const setTypOgniwaId = (a: string | ((p: string) => string)) => setPole("typOgniwaId", a)

  const result = useMemo(
    () => calculateMomentDokrecania({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  const typOgniwa = znajdzTypOgniwa(typOgniwaId)
  const czyInne = typOgniwaId === "inne-m6" || typOgniwaId === "inne-m8"

  // Podmienia tylko tekst momentu dla gwintu pasującego do wybranego typu ogniwa — sam checklist
  // (id kroków, ich liczba, logika VALID/INCOMPLETE) zostaje bez zmian.
  const items = useMemo(
    () =>
      CHECKLIST_ITEMS.map((item) => {
        if (!typOgniwa) return item
        const idGwintu = typOgniwa.gwint === "M6" ? "terminal-m6" : "terminal-m8"
        if (item.id !== idGwintu) return item
        return { ...item, moment: formatujMoment(typOgniwa.moment) }
      }),
    [typOgniwa],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/moment-dokrecania-srub" />
      <NaglowekEkranu tytul={t("UI-MOMDOKSRU-MOMENT-DOKRECANIA-SRUB")} ekran="moment-dokrecania-srub">
        {t("UI-MOMDOKSRU-SRUBA-SPREZYNA-MUSISZ")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-MOMDOKSRU-TYP-POJEMNOSC-OGNIWA")}
        value={typOgniwaId}
        onChange={(e) => setTypOgniwaId(e.target.value)}
        pomoc={<PomocPola ekran="moment-dokrecania-srub" pole="typ" />}
      >
        {TYPY_OGNIW.map((typ) => (
          <option key={typ.id} value={typ.id}>
            {typ.etykieta}
          </option>
        ))}
      </PoleSelect>

      {czyInne && (
        <p className="text-small text-muted-foreground">⚠️ {OSTRZEZENIE_INNE_OGNIWO}</p>
      )}

      <ListaChecklist
        items={items}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.element}</span>
            <span className="block text-muted-foreground">{t("UI-MOMDOKSRU-MOMENT", { moment: item.moment })}</span>
            {item.uwaga !== "—" && (
              <span className="block text-caption text-muted-foreground">{item.uwaga}</span>
            )}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}>⚠️ {w}</li>
        ))}
      </ul>

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta={t("UI-MOMDOKSRU-WSZYSTKIE-KROKI-POTWIERDZONE")} />
      ) : (
        <StanPusty tytul={t("UI-MOMDOKSRU-POTWIERDZONO-KROKOW", { potwierdzone: result.value.potwierdzone, razem: result.value.razem })} />
      )}
    </main>
  )
}
