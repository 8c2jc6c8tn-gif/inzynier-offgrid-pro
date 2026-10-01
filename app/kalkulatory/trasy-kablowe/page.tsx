import { TRASY_KABLOWE_RULES } from "@/lib/core/modules/okablowanie/trasy-kablowe/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

function TrasyIlustracja() {
  const t = useTranslate()
  return (
    <svg
      viewBox="0 0 400 220"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label={t("UI-TRAKAB-SCHEMAT-PROWADZENIA-TRAS")}
    >
      {/* Panele PV */}
      <rect x="16" y="20" width="70" height="40" rx="4" className="fill-amber-400/70 stroke-current" />
      <text x="51" y="44" textAnchor="middle" className="fill-current text-[10px] font-medium">
        {t("UI-TRAKAB-PANELE")}
      </text>

      {/* Falownik / rozdzielnia */}
      <rect x="314" y="160" width="70" height="40" rx="4" className="fill-sky-400/60 stroke-current" />
      <text x="349" y="184" textAnchor="middle" className="fill-current text-[10px] font-medium">
        {t("UI-TRAKAB-ROZDZIELNIA")}
      </text>

      {/* Router / sieć (sygnałowe) */}
      <rect x="16" y="160" width="70" height="40" rx="4" className="fill-emerald-400/60 stroke-current" />
      <text x="51" y="184" textAnchor="middle" className="fill-current text-[10px] font-medium">
        {t("UI-TRAKAB-ROUTER")}
      </text>

      {/* Trasa DC — najkrótsza, w cieniu */}
      <path
        d="M 86 40 L 200 40 L 260 160"
        className="fill-none stroke-red-500"
        strokeWidth="3"
        strokeDasharray="6 4"
      />
      <text x="150" y="32" textAnchor="middle" className="fill-red-500 text-[9px] font-medium">
        {t("UI-TRAKAB-NAJKROTSZA-DROGA-CIENIU")}
      </text>

      {/* Trasa AC — prosto do rozdzielni */}
      <path d="M 260 160 L 314 180" className="fill-none stroke-blue-500" strokeWidth="3" />
      <text x="300" y="150" textAnchor="middle" className="fill-blue-500 text-[9px] font-medium">
        {t("UI-TRAKAB-PROSTO")}
      </text>

      {/* Kabel sygnałowy — osobno, z odstępem */}
      <path d="M 86 180 L 314 180" className="fill-none stroke-emerald-500" strokeWidth="3" />
      <text x="200" y="200" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">
        {t("UI-TRAKAB-SYGNALOWY-OSOBNO-MIN")}
      </text>

      {/* Strzałka odstępu */}
      <line x1="260" y1="160" x2="260" y2="180" className="stroke-current" strokeWidth="1" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-current" />
        </marker>
      </defs>
    </svg>
  )
}

export default function TrasyKabloweePage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/trasy-kablowe" />
      <NaglowekEkranu tytul={t("UI-TRAKAB-TRASY-KABLOWE-PROWADZENIE")} ekran="trasy-kablowe">{t("UI-TRAKAB-MODUL-EKRAN")}</NaglowekEkranu>

      <TrasyIlustracja />

      <ul className="flex flex-col gap-3">
        {TRASY_KABLOWE_RULES.map((rule) => (
          <li key={rule.id} className="rounded-md border p-3 text-small">
            <span className="block font-medium">{rule.tytul}</span>
            <span className="block text-muted-foreground">{rule.opis}</span>
          </li>
        ))}
      </ul>

      
    </main>
  )
}
