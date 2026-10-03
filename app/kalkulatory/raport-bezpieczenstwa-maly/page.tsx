"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateRaportBezpieczenstwa } from "@/lib/core/modules/kalkulator-mobilny/raport-bezpieczenstwa-maly/calculator"
import type { IdPunktuRaportu } from "@/lib/core/modules/kalkulator-mobilny/raport-bezpieczenstwa-maly/constants"
import type { OdpowiedzRaportu } from "@/lib/core/modules/kalkulator-mobilny/raport-bezpieczenstwa-maly/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import type { PolePomocy } from "@/lib/i18n/pomoc"
import { Button } from "@/components/ui/button"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = { odpowiedzi: Partial<Record<IdPunktuRaportu, OdpowiedzRaportu>> }

const STAN_POCZATKOWY: FormularzStan = { odpowiedzi: {} }

const POLE_POMOCY: Record<IdPunktuRaportu, PolePomocy<"raport-bezpieczenstwa-maly">> = {
  "bezpiecznik-akumulatora": "bezpiecznikAkumulatora",
  "dobor-bezpiecznikow": "doborBezpiecznikow",
  "bezpiecznik-a-przewod": "bezpiecznikAPrzewod",
  "przekroje-przewodow": "przekrojePrzewodow",
  "ochrona-rozladowania": "ochronaRozladowania",
  "wentylacja-akumulatora": "wentylacjaAkumulatora",
  polaczenia: "polaczenia",
}
const klucz = (id: IdPunktuRaportu) => id.toUpperCase()

export default function RaportBezpieczenstwaMalyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("raport-bezpieczenstwa-maly", STAN_POCZATKOWY)
  const ustaw = (id: IdPunktuRaportu, odp: OdpowiedzRaportu) =>
    setStan((prev) => ({ odpowiedzi: { ...prev.odpowiedzi, [id]: prev.odpowiedzi[id] === odp ? null : odp } }))

  const result = useMemo(() => calculateRaportBezpieczenstwa({ odpowiedzi: stan.odpowiedzi }), [stan])
  const v = result.value
  const krytyczny = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/raport-bezpieczenstwa-maly" />
      <NaglowekEkranu tytul={t("UI-M12-RB-TYTUL")} ekran="raport-bezpieczenstwa-maly" wynik={result}>
        {t("UI-M12-RB-OPIS")}
      </NaglowekEkranu>

      <ul className="flex flex-col gap-4">
        {v.punkty.map((p) => (
          <li key={p.id} className="flex flex-col gap-2 rounded-md border p-3">
            <div className="flex items-start gap-2">
              <h2 className="flex-1 text-small font-medium">{t(`UI-M12-RB-P-${klucz(p.id)}`)}</h2>
              <PomocPola ekran="raport-bezpieczenstwa-maly" pole={POLE_POMOCY[p.id]} />
            </div>
            <p className="text-caption text-muted-foreground">{t(`UI-M12-RB-JAK-${klucz(p.id)}`)}</p>
            <div role="group" aria-label={t(`UI-M12-RB-P-${klucz(p.id)}`)} className="flex gap-2">
              <Button aria-pressed={p.odpowiedz === "ok"} variant={p.odpowiedz === "ok" ? "default" : "outline"} onClick={() => ustaw(p.id, "ok")}>
                {t("UI-M12-RB-OK")}
              </Button>
              <Button aria-pressed={p.odpowiedz === "blad"} variant={p.odpowiedz === "blad" ? "destructive" : "outline"} onClick={() => ustaw(p.id, "blad")}>
                {t("UI-M12-RB-BLAD")}
              </Button>
            </div>
            {p.odpowiedz === "blad" && p.href && (
              <Link href={p.href} className="text-caption underline">
                {t("UI-M12-RB-DOBIERZ")}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-RB-ZACZNIJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={krytyczny ? "blad" : v.liczbaBledow > 0 || v.liczbaNiesprawdzonych > 0 ? "uwaga" : "ok"}
          etykieta={t(krytyczny ? "UI-M12-RB-W-KRYTYCZNY" : v.liczbaBledow > 0 ? "UI-M12-RB-W-UWAGA" : "UI-M12-RB-W-OK")}
        >
          <WynikGlowny>{t("UI-M12-RB-WYNIK", { pct: Math.round(v.procentBezpieczenstwa) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M12-RB-LICZNIKI", { ok: v.liczbaOk, bledy: v.liczbaBledow, brak: v.liczbaNiesprawdzonych })}</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
