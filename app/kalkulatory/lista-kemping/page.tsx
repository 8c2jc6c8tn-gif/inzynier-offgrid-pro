"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateListaKemping, type PozycjaListy } from "@/lib/core/modules/kalkulator-mobilny/lista-kemping/calculator"
import type { SezonKempingu } from "@/lib/core/modules/kalkulator-mobilny/lista-kemping/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Profil = "maPanel" | "maUrzadzenia230" | "maLodowke" | "maOswietlenie" | "maRadio"

type FormularzStan = Record<Profil, boolean> & {
  osoby: string
  telefony: string
  sezon: SezonKempingu | ""
  zaznaczoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  osoby: "",
  telefony: "",
  sezon: "",
  maPanel: false,
  maUrzadzenia230: false,
  maLodowke: false,
  maOswietlenie: false,
  maRadio: false,
  zaznaczoneIds: [],
}

const PROFIL: { id: Profil; label: string }[] = [
  { id: "maPanel", label: "UI-M12-LKK-PROFIL-PANEL" },
  { id: "maUrzadzenia230", label: "UI-M12-LKK-PROFIL-230" },
  { id: "maLodowke", label: "UI-M12-LKK-PROFIL-LODOWKA" },
  { id: "maOswietlenie", label: "UI-M12-LKK-PROFIL-OSWIETLENIE" },
  { id: "maRadio", label: "UI-M12-LKK-PROFIL-RADIO" },
]

const SEZONY: { id: SezonKempingu; label: string }[] = [
  { id: "lato", label: "UI-M12-LKK-SEZON-LATO" },
  { id: "przejsciowy", label: "UI-M12-LKK-SEZON-PRZEJSCIOWY" },
  { id: "zima", label: "UI-M12-LKK-SEZON-ZIMA" },
]

const liczba = (s: string) => (s === "" ? 0 : Number(s))

export default function ListaKempingPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("lista-kemping", STAN_POCZATKOWY)
  const result = useMemo(
    () =>
      calculateListaKemping({
        osoby: liczba(stan.osoby),
        telefony: liczba(stan.telefony),
        sezon: stan.sezon === "" ? null : stan.sezon,
        maPanel: stan.maPanel,
        maUrzadzenia230: stan.maUrzadzenia230,
        maLodowke: stan.maLodowke,
        maOswietlenie: stan.maOswietlenie,
        maRadio: stan.maRadio,
        zaznaczoneIds: stan.zaznaczoneIds,
      }),
    [stan],
  )
  const v = result.value
  const toggle = (id: string) =>
    setStan((prev) => ({
      ...prev,
      zaznaczoneIds: prev.zaznaczoneIds.includes(id) ? prev.zaznaczoneIds.filter((x) => x !== id) : [...prev.zaznaczoneIds, id],
    }))
  const etykieta = (p: PozycjaListy) => (
    <>
      <span className="block font-medium">
        {t(`UI-M12-LKK-P-${p.id.toUpperCase()}`)}
        {p.ilosc !== null && ` × ${p.ilosc}`}
      </span>
      {p.link && (
        <Link href={p.link} className="block text-caption underline">
          {t("UI-M12-LKK-DOBIERZ")}
        </Link>
      )}
    </>
  )
  const lista = (kategoria: PozycjaListy["kategoria"]) => {
    const pozycje = v.pozycje.filter((p) => p.kategoria === kategoria)
    return (
      <ListaChecklist
        items={pozycje}
        potwierdzoneIds={stan.zaznaczoneIds.filter((id) => pozycje.some((p) => p.id === id))}
        onToggle={toggle}
        renderLabel={etykieta}
      />
    )
  }
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/lista-kemping" />
      <NaglowekEkranu tytul={t("UI-M12-LKK-TYTUL")} ekran="lista-kemping" wynik={result}>
        {t("UI-M12-LKK-OPIS")}
      </NaglowekEkranu>

      <Pole label={t("UI-M12-LKK-OSOBY")} type="number" inputMode="numeric" min={0} value={stan.osoby} onChange={(e) => setStan((prev) => ({ ...prev, osoby: e.target.value }))} pomoc={<PomocPola ekran="lista-kemping" pole="osoby" />} />
      <PoleSelect label={t("UI-M12-LKK-SEZON")} value={stan.sezon} onChange={(e) => setStan((prev) => ({ ...prev, sezon: e.target.value as FormularzStan["sezon"] }))} pomoc={<PomocPola ekran="lista-kemping" pole="sezon" />}>
        <option value="">{t("UI-WYBIERZ")}</option>
        {SEZONY.map((s) => (
          <option key={s.id} value={s.id}>
            {t(s.label)}
          </option>
        ))}
      </PoleSelect>
      <Pole label={t("UI-M12-LKK-TELEFONY")} type="number" inputMode="numeric" min={0} value={stan.telefony} onChange={(e) => setStan((prev) => ({ ...prev, telefony: e.target.value }))} pomoc={<PomocPola ekran="lista-kemping" pole="telefony" />} />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 flex items-center gap-2 text-small font-medium">
          {t("UI-M12-LKK-PROFIL")} <PomocPola ekran="lista-kemping" pole="profil" />
        </legend>
        {PROFIL.map((p) => (
          <PoleCheckbox key={p.id} id={`profil-${p.id}`} checked={stan[p.id]} onChange={() => setStan((prev) => ({ ...prev, [p.id]: !prev[p.id] }))} label={t(p.label)} />
        ))}
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="text-small font-medium">{t("UI-M12-LKK-KONIECZNE")}</h2>
            {lista("konieczne")}
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-small font-medium">{t("UI-M12-LKK-OPCJONALNE")}</h2>
            {lista("opcjonalne")}
          </section>
          <WerdyktPanel
            poziom={hasWarning ? "uwaga" : result.status === "VALID" ? "ok" : "uwaga"}
            etykieta={result.status === "VALID" ? t("UI-M12-LKK-W-OK") : t("UI-M12-LKK-W-POSTEP", { n: v.konieczneZaznaczone, razem: v.konieczneRazem })}
          >
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
          </WerdyktPanel>
        </>
      )}
    </main>
  )
}
