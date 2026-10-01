"use client"

import { SEPARACJA_EMC_RULES } from "@/lib/core/modules/okablowanie/separacja-emc/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

function SeparacjaIlustracja() {
  const t = useTranslate()
  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label={t("UI-SEPEMC-SCHEMAT-SEPARACJI-KABLI")}
    >
      {/* Kabel silnoprądowy — linia prosta u góry */}
      <path d="M 20 50 L 380 50" className="fill-none stroke-red-500" strokeWidth="4" />
      <text x="200" y="38" textAnchor="middle" className="fill-red-500 text-[9px] font-medium">
        {t("UI-SEPEMC-KABEL-SILNOPRADOWY")}
      </text>

      {/* Odstęp */}
      <line x1="60" y1="50" x2="60" y2="110" className="stroke-current" strokeWidth="1" strokeDasharray="3 3" />
      <text x="70" y="83" className="fill-current text-[9px] font-medium">
        {t("UI-SEPEMC-MIN-10-20-CM")}
      </text>

      {/* Kabel sygnałowy — równolegle, niżej */}
      <path d="M 20 110 L 260 110" className="fill-none stroke-emerald-500" strokeWidth="4" />

      {/* Krzyżowanie pod kątem prostym */}
      <path d="M 260 110 L 260 170" className="fill-none stroke-emerald-500" strokeWidth="4" />
      <text x="200" y="130" textAnchor="middle" className="fill-emerald-500 text-[9px] font-medium">
        {t("UI-SEPEMC-KABEL-SYGNALOWY-ROWNOLEGLE")}
      </text>
      <text x="300" y="145" textAnchor="middle" className="fill-current text-[9px] font-medium">
        {t("UI-SEPEMC-KRZYZOWANIE-POD")}
      </text>
    </svg>
  )
}

export default function SeparacjaEmcPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/separacja-emc" />
      <NaglowekEkranu tytul={t("UI-SEPEMC-SEPARACJA-EMC")} ekran="separacja-emc">{t("UI-SEPEMC-MODUL-EKRAN")}</NaglowekEkranu>

      <SeparacjaIlustracja />

      <ul className="flex flex-col gap-3">
        {SEPARACJA_EMC_RULES.map((rule) => (
          <li key={rule.id} className="rounded-md border p-3 text-small">
            <span className="block font-medium">{rule.tytul}</span>
            <span className="block text-muted-foreground">{rule.opis}</span>
          </li>
        ))}
      </ul>

      
    </main>
  )
}
