"use client"

import { useMemo } from "react"
import { calculatePolaczeniaCzyszczenieOlow } from "@/lib/core/modules/montaz-baterii/polaczenia-czyszczenie-olow/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/montaz-baterii/polaczenia-czyszczenie-olow/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

/** Schemat: szeregowo = wyższe napięcie, równolegle = większa pojemność (dane 1:1 ze źródła). */
function SchematPolaczenIlustracja() {
  return (
    <svg
      viewBox="0 0 440 230"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label="Schemat: połączenie szeregowe zwiększa napięcie, połączenie równoległe zwiększa pojemność"
    >
      {/* Panel 1: szeregowo */}
      <text x="16" y="18" className="fill-current text-[10px] font-semibold">
        Szeregowo — wyższe napięcie
      </text>
      <rect x="50" y="28" width="90" height="46" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="95" y="55" textAnchor="middle" className="fill-current text-[9px]">
        Akum. 1
      </text>
      <rect x="210" y="28" width="90" height="46" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="255" y="55" textAnchor="middle" className="fill-current text-[9px]">
        Akum. 2
      </text>
      <text x="58" y="24" className="fill-current text-[9px] font-semibold">+</text>
      <text x="132" y="24" className="fill-current text-[9px] font-semibold">−</text>
      <text x="218" y="24" className="fill-current text-[9px] font-semibold">+</text>
      <text x="292" y="24" className="fill-current text-[9px] font-semibold">−</text>
      <line x1="140" y1="51" x2="210" y2="51" className="stroke-red-500" strokeWidth="3" />
      <text x="220" y="92" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Minus (Akum. 1) → plus (Akum. 2)
      </text>
      <text x="220" y="106" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        12 V + 12 V = 24 V
      </text>

      {/* Panel 2: równolegle */}
      <text x="16" y="134" className="fill-current text-[10px] font-semibold">
        Równolegle — większa pojemność
      </text>
      <rect x="50" y="144" width="90" height="46" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="95" y="171" textAnchor="middle" className="fill-current text-[9px]">
        Akum. 1
      </text>
      <rect x="210" y="144" width="90" height="46" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="255" y="171" textAnchor="middle" className="fill-current text-[9px]">
        Akum. 2
      </text>
      <text x="58" y="140" className="fill-current text-[9px] font-semibold">+</text>
      <text x="132" y="140" className="fill-current text-[9px] font-semibold">−</text>
      <text x="218" y="140" className="fill-current text-[9px] font-semibold">+</text>
      <text x="292" y="140" className="fill-current text-[9px] font-semibold">−</text>
      {/* szyna plus (góra, łączy oba lewe "+") i minus (dół, łączy oba prawe "−") */}
      <line x1="58" y1="132" x2="218" y2="132" className="stroke-red-500" strokeWidth="3" />
      <line x1="58" y1="132" x2="58" y2="144" className="stroke-red-500" strokeWidth="3" />
      <line x1="218" y1="132" x2="218" y2="144" className="stroke-red-500" strokeWidth="3" />
      <line x1="132" y1="202" x2="292" y2="202" className="stroke-current" strokeWidth="3" />
      <line x1="132" y1="190" x2="132" y2="202" className="stroke-current" strokeWidth="3" />
      <line x1="292" y1="190" x2="292" y2="202" className="stroke-current" strokeWidth="3" />
      <text x="220" y="220" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Plusy razem, minusy razem — wciąż 12 V, ale 2× pojemność
      </text>
    </svg>
  )
}

type FormularzStan = { potwierdzoneIds: string[] }
const STAN_POCZATKOWY: FormularzStan = { potwierdzoneIds: [] }

export default function PolaczeniaCzyszczenieOlowPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("polaczenia-czyszczenie-olow", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) =>
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: typeof a === "function" ? (a as (p: string[]) => string[])(prev.potwierdzoneIds) : a,
    }))

  const result = useMemo(
    () => calculatePolaczeniaCzyszczenieOlow({ potwierdzoneIds }),
    [potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/polaczenia-czyszczenie-olow" />
      <NaglowekEkranu tytul="Połączenia + czyszczenie biegunów" ekran="polaczenia-czyszczenie-olow">
        Moduł 11, Ekran B3 (Ścieżka B — kwasowo-ołowiowa).
      </NaglowekEkranu>

      <SchematPolaczenIlustracja />

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.element}</span>
            {item.uwaga !== "—" && (
              <span className="block text-muted-foreground">{item.uwaga}</span>
            )}
          </>
        )}
      />

      {result.status === "VALID" ? (
        <WerdyktPanel poziom="ok" etykieta="Połączenia i czyszczenie zakończone" />
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} elementów`} />
      )}
    </main>
  )
}
