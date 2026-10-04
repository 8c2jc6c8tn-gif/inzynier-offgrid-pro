"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateUrzadzeniaZabronione } from "@/lib/core/modules/kalkulator-mobilny/urzadzenia-zabronione-falownik/calculator"
import { TYPOWE_RYZYKOWNE, type OcenaUrzadzenia } from "@/lib/core/modules/kalkulator-mobilny/urzadzenia-zabronione-falownik/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Wiersz = { id: string; nazwa: string; mocW: string; krotnoscRozruchu: string }
type FormularzStan = { mocFalownikaW: string; mocSzczytowaW: string; urzadzenia: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = { mocFalownikaW: "", mocSzczytowaW: "", urzadzenia: [] }

const ETYKIETA_OCENY: Record<OcenaUrzadzenia, string> = {
  ok: "UI-M12-UZF-OCENA-OK",
  ryzykowne: "UI-M12-UZF-OCENA-RYZYKOWNE",
  zabronione: "UI-M12-UZF-OCENA-ZABRONIONE",
}

const nowyWiersz = (nazwa: string): Wiersz => ({ id: crypto.randomUUID(), nazwa, mocW: "", krotnoscRozruchu: "" })
const liczba = (s: string) => (s === "" ? 0 : Number(s))

export default function UrzadzeniaZabronioneFalownikPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("urzadzenia-zabronione-falownik", STAN_POCZATKOWY)
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((o) => (o.id === id ? { ...o, ...zmiana } : o)) }))

  const result = useMemo(
    () =>
      calculateUrzadzeniaZabronione({
        mocFalownikaW: liczba(stan.mocFalownikaW),
        mocSzczytowaW: liczba(stan.mocSzczytowaW),
        urzadzenia: stan.urzadzenia.map((o) => ({ nazwa: o.nazwa, mocW: liczba(o.mocW), krotnoscRozruchu: liczba(o.krotnoscRozruchu) })),
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value
  // Engine rates rows with power > 0 in input order — map them back to row ids.
  const idsOcenianych = stan.urzadzenia.filter((o) => liczba(o.mocW) > 0).map((o) => o.id)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/urzadzenia-zabronione-falownik" />
      <NaglowekEkranu tytul={t("UI-M12-UZF-TYTUL")} ekran="urzadzenia-zabronione-falownik" wynik={result}>
        {t("UI-M12-UZF-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-UZF-FALOWNIK")}</legend>
        <Pole label={t("UI-M12-UZF-MOC-CIAGLA")} unit="W" type="number" inputMode="decimal" min={0} value={stan.mocFalownikaW} onChange={(e) => setStan((prev) => ({ ...prev, mocFalownikaW: e.target.value }))} pomoc={<PomocPola ekran="urzadzenia-zabronione-falownik" pole="mocCiagla" />} />
        <Pole label={t("UI-M12-UZF-MOC-SZCZYTOWA")} unit="W" type="number" inputMode="decimal" min={0} value={stan.mocSzczytowaW} onChange={(e) => setStan((prev) => ({ ...prev, mocSzczytowaW: e.target.value }))} pomoc={<PomocPola ekran="urzadzenia-zabronione-falownik" pole="mocSzczytowa" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-UZF-URZADZENIA")}</legend>
        <div className="flex flex-wrap gap-2">
          {TYPOWE_RYZYKOWNE.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setStan((prev) => ({ ...prev, urzadzenia: [...prev.urzadzenia, nowyWiersz(t(k))] }))}
              className="min-h-11 rounded-md border px-3 text-caption hover:bg-muted"
            >
              + {t(k)}
            </button>
          ))}
        </div>
        <ul className="flex flex-col gap-4">
          {stan.urzadzenia.map((o, i) => {
            const ocena = v.oceny[idsOcenianych.indexOf(o.id)]
            return (
              <li key={o.id} className="flex flex-col gap-3 rounded-md border p-3">
                <Pole label={t("UI-M12-MA-URZADZENIE", { n: i + 1 })} value={o.nazwa} onChange={(e) => aktualizuj(o.id, { nazwa: e.target.value })} pomoc={<PomocPola ekran="urzadzenia-zabronione-falownik" pole="nazwa" />} />
                <div className="grid grid-cols-2 gap-3">
                  <Pole label={t("UI-M12-MA-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={o.mocW} onChange={(e) => aktualizuj(o.id, { mocW: e.target.value })} pomoc={<PomocPola ekran="urzadzenia-zabronione-falownik" pole="moc" />} />
                  <Pole label={t("UI-M12-PRZ-KROTNOSC")} unit="×" type="number" inputMode="decimal" min={0} value={o.krotnoscRozruchu} onChange={(e) => aktualizuj(o.id, { krotnoscRozruchu: e.target.value })} pomoc={<PomocPola ekran="urzadzenia-zabronione-falownik" pole="krotnosc" />} />
                </div>
                {ocena && <span className="text-small font-medium">{t(ETYKIETA_OCENY[ocena.ocena])}</span>}
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.filter((x) => x.id !== o.id) }))}
                  className="self-start text-caption text-muted-foreground underline"
                  aria-label={t("UI-M12-MA-USUN-ETYKIETA", { n: i + 1 })}
                >
                  {t("UI-M12-MA-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() => setStan((prev) => ({ ...prev, urzadzenia: [...prev.urzadzenia, nowyWiersz("")] }))}
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-M12-MA-DODAJ")}
        </button>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={t(hasCritical ? "UI-M12-UZF-W-STOP" : hasWarning ? "UI-M12-UZF-W-UWAGA" : "UI-M12-UZF-W-OK")}
        >
          <WynikGlowny>{t("UI-M12-UZF-WYNIK", { ciagla: Math.ceil(v.potrzebnaMocCiaglaW), szczyt: Math.ceil(v.potrzebnaMocSzczytowaW) })}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/przetwornice" className="text-small underline">
        {t("UI-M12-UZF-LINK-E8")}
      </Link>
    </main>
  )
}
