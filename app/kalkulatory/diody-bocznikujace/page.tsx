"use client"

import Link from "next/link"
import { obliczStrataPaneluPct } from "@/lib/core/modules/pv/zacienienie-diody-bocznikujace/calculator"
import {
  LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH,
  MAKS_LICZBA_ZACIENIONYCH_SEKCJI,
} from "@/lib/core/modules/pv/zacienienie-diody-bocznikujace/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"

type FormularzStan = { zacienioneSekcje: number }

const STAN_POCZATKOWY: FormularzStan = { zacienioneSekcje: 1 }

const SZEROKOSC_SEKCJI = 100

/**
 * Schemat panelu: 3 sekcje ogniw, każda z własną diodą bocznikującą. Zacienione sekcje (od lewej)
 * są wyszarzone, a ich dioda "przewodzi" (objazd prądu) — ilustracja §3.22 Biblii
 * ("Schemat diod bocznikujących w panelu").
 */
function SchematPanelu({ zacienioneSekcje }: { zacienioneSekcje: number }) {
  const sekcje = Array.from({ length: LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH }, (_, i) => i)
  return (
    <svg
      viewBox="0 0 340 170"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label={`Schemat panelu z ${LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH} sekcjami ogniw i diodami bocznikującymi; zacienione sekcje: ${zacienioneSekcje}`}
    >
      {sekcje.map((i) => {
        const x = 20 + i * SZEROKOSC_SEKCJI
        const zacieniona = i < zacienioneSekcje
        return (
          <g key={i}>
            <rect
              x={x}
              y={16}
              width={SZEROKOSC_SEKCJI - 4}
              height={80}
              rx={3}
              className={zacieniona ? "fill-muted-foreground/40 stroke-current" : "fill-sky-500/50 stroke-current"}
            />
            <text x={x + 48} y={60} textAnchor="middle" className="fill-current text-[11px] font-medium">
              {zacieniona ? "cień" : `sekcja ${i + 1}`}
            </text>
            {/* Dioda bocznikująca pod sekcją: trójkąt + kreska (symbol diody) */}
            <line x1={x + 10} y1={126} x2={x + 86} y2={126} className="stroke-current" strokeWidth={1.5} />
            <polygon
              points={`${x + 40},116 ${x + 40},136 ${x + 56},126`}
              className={zacieniona ? "fill-amber-400 stroke-current" : "fill-background stroke-current"}
            />
            <line x1={x + 56} y1={116} x2={x + 56} y2={136} className="stroke-current" strokeWidth={1.5} />
            <text x={x + 48} y={156} textAnchor="middle" className="fill-current text-[10px]">
              {zacieniona ? "przewodzi" : "nieaktywna"}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function DiodyBocznikujacePage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("diody-bocznikujace", STAN_POCZATKOWY)
  const { zacienioneSekcje } = stan
  const strataPct = obliczStrataPaneluPct(zacienioneSekcje)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/diody-bocznikujace" />
      <NaglowekEkranu
        tytul="Wpływ diod bocznikujących"
        ekran="diody-bocznikujace"
        parametry={{ sekcje: LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH }}
      >
        Panel jest podzielony na {LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH} sekcje ogniw, każda z własną diodą
        bocznikującą. Gdy sekcja jest zacieniona, dioda pozwala prądowi ją ominąć — reszta panelu dalej
        pracuje, a zacienione ogniwa nie przegrzewają się (ochrona przed hot-spotem). Moduł 3, Ekran 12.
      </NaglowekEkranu>

      <SchematPanelu zacienioneSekcje={zacienioneSekcje} />

      <PoleSelect
        label="Liczba zacienionych sekcji"
        value={String(zacienioneSekcje)}
        onChange={(e) => setStan({ zacienioneSekcje: Number(e.target.value) })}
        pomoc={<PomocPola ekran="diody-bocznikujace" pole="sekcje" params={{ sekcje: LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH }} />}
      >
        {Array.from({ length: MAKS_LICZBA_ZACIENIONYCH_SEKCJI + 1 }, (_, n) => (
          <option key={n} value={n}>
            {n} z {LICZBA_SEKCJI_DIOD_BOCZNIKUJACYCH}
          </option>
        ))}
      </PoleSelect>

      <WynikGlowny>
        Strata mocy panelu: {strataPct.toLocaleString("pl-PL", { maximumFractionDigits: 1 })}%
      </WynikGlowny>
      <p className="text-small text-muted-foreground">
        Bez diod zacienienie choćby jednej sekcji zatrzymałoby prąd całego panelu (strata 100%). Strata
        całego stringu zależy od jego konfiguracji — policzysz ją w ekranie{" "}
        <Link href="/kalkulatory/zacienienie-diody-bocznikujace" className="underline">
          Zacienienie i diody bocznikujące
        </Link>
        .
      </p>

      
    </main>
  )
}
