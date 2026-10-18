"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { PrzypomnieniaPrzegladowWybor } from "@/components/przypomnienia-przegladow"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateTerminarzPrzegladow } from "@/lib/core/modules/bezpieczenstwo/terminarz-przegladow/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { dzisiajLokalnie, KLUCZ_DRAFTU_TERMINARZ, PUSTY_SEED_TERMINARZA, pozycjeDoSilnika, type PozycjaSeed, type SeedTerminarza } from "@/lib/obiekt/terminarz-przegladow-draft"

const nowaPozycja = (): PozycjaSeed => ({ id: crypto.randomUUID(), nazwa: "", ostatni: "", interwal: "" })

export default function TerminarzPrzegladowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<SeedTerminarza>(KLUCZ_DRAFTU_TERMINARZ, PUSTY_SEED_TERMINARZA)
  const ustaw = (id: string, z: Partial<PozycjaSeed>) => setStan((s) => ({ pozycje: s.pozycje.map((p) => (p.id === id ? { ...p, ...z } : p)) }))
  const dzisiaj = useMemo(() => dzisiajLokalnie(), [])
  const wynik = useMemo(() => calculateTerminarzPrzegladow({ pozycje: pozycjeDoSilnika(stan), dzisiaj }), [stan, dzisiaj])
  const v = wynik.value
  const poziom: WerdyktPoziom = wynik.warnings.some((w) => w.level === "critical") ? "blad" : v && v.poTerminie > 0 ? "uwaga" : "ok"
  const nazwaPozycji = (id: string) => stan.pozycje.find((p) => p.id === id)?.nazwa.trim() || t("UI-TPRZ-POZYCJA-NR", { n: stan.pozycje.findIndex((p) => p.id === id) + 1 })

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/terminarz-przegladow" />
      <NaglowekEkranu tytul={t("UI-TPRZ-TYTUL")} ekran="terminarz-przegladow" wynik={wynik}>
        {t("UI-TPRZ-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        {stan.pozycje.map((p, i) => (
          <div key={p.id} className="flex flex-col gap-3 rounded-lg border p-3">
            <Pole id={`tprz-${p.id}-nazwa`} label={`${t("UI-TPRZ-NAZWA")} (${t("UI-TPRZ-POZYCJA-NR", { n: i + 1 })})`} value={p.nazwa} onChange={(e) => ustaw(p.id, { nazwa: e.target.value })} pomoc={<PomocPola ekran="terminarz-przegladow" pole="nazwa" />} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Pole id={`tprz-${p.id}-ostatni`} label={t("UI-TPRZ-OSTATNI")} type="date" value={p.ostatni} onChange={(e) => ustaw(p.id, { ostatni: e.target.value })} pomoc={<PomocPola ekran="terminarz-przegladow" pole="ostatni" />} />
              <Pole id={`tprz-${p.id}-interwal`} label={t("UI-TPRZ-INTERWAL")} unit={t("UI-TPRZ-MIES")} type="number" inputMode="numeric" min={1} step={1} value={p.interwal} onChange={(e) => ustaw(p.id, { interwal: e.target.value })} pomoc={<PomocPola ekran="terminarz-przegladow" pole="interwal" />} />
            </div>
            <Button variant="ghost" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ pozycje: s.pozycje.filter((x) => x.id !== p.id) }))}>
              {t("UI-TPRZ-USUN")}
            </Button>
          </div>
        ))}
        <Button variant="outline" className="min-h-11 w-fit" onClick={() => setStan((s) => ({ pozycje: [...s.pozycje, nowaPozycja()] }))}>
          {t("UI-TPRZ-DODAJ")}
        </Button>
      </section>

      <PrzypomnieniaPrzegladowWybor />

      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-TPRZ-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={wynik.warnings} />
        </WerdyktPanel>
      )}
      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">{t("UI-TPRZ-UZUPELNIJ")}</p>}
      {v && (
        <WerdyktPanel poziom={poziom} etykieta={v.poTerminie > 0 ? t("UI-TPRZ-WERDYKT-PO", { n: v.poTerminie }) : t("UI-TPRZ-WERDYKT-OK")}>
          <ul className="flex flex-col gap-2 text-small">
            {v.terminy.map((x) => (
              <li key={x.id} className="rounded-md border p-2">
                <p className="font-medium">{nazwaPozycji(x.id)}</p>
                {x.nastepnyTermin === null || x.dniDoTerminu === null ? (
                  <p className="text-muted-foreground">{t("UI-TPRZ-BEZ-TERMINU")}</p>
                ) : (
                  <p>
                    {t("UI-TPRZ-TERMIN", { data: x.nastepnyTermin })} —{" "}
                    <strong>
                      {x.dniDoTerminu > 0 ? t("UI-TPRZ-DNI-PRZED", { dni: x.dniDoTerminu }) : x.dniDoTerminu === 0 ? t("UI-TPRZ-DNI-DZIS") : t("UI-TPRZ-DNI-PO", { dni: -x.dniDoTerminu })}
                    </strong>
                  </p>
                )}
              </li>
            ))}
          </ul>
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} formulaKey={wynik.formulaKey} formulaParams={wynik.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
