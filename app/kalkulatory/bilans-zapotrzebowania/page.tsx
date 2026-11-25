"use client"

import { useMemo } from "react"
import Link from "next/link"
import { calculateBilansZapotrzebowania } from "@/lib/core/modules/zapotrzebowanie/bilans-zapotrzebowania/calculator"
import { ZRODLA_BILANSU, type PozycjaBilansu, type ZrodloBilansu } from "@/lib/core/modules/zapotrzebowanie/bilans-zapotrzebowania/input"
import { KLUCZ_ZRODLA } from "@/lib/core/modules/zapotrzebowanie/bilans-zapotrzebowania/warnings"
import type { KategorieSpecjalneInput } from "@/lib/core/modules/zapotrzebowanie/kategorie-specjalne/input"
import { useOdczytDraftu, usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import type { DraftOdbiornikow } from "@/lib/obiekt/zuzycie-z-odbiornikow"
import { useWynikiDoProjektu } from "@/lib/projekt/use-wyniki-do-projektu"
import {
  buforZDraftu,
  KLUCZE_ZRODEL,
  wkladBojlera,
  wkladFalownika,
  wkladOdbiornikow,
  wkladSezonowy,
  wkladSpecjalnych,
  wkladWampirow,
  wkladZmiennych,
  type DraftBojlera,
  type DraftBufora,
  type DraftFalownika,
  type DraftSezonowosci,
  type DraftWampirow,
  type DraftZmiennych,
  type WkladZrodla,
} from "@/lib/zapotrzebowanie/zrodla-bilansu"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomOstrzezen } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KLUCZE_MIESIECY } from "@/components/siec/zuzycie-miesieczne"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"

type DoProjektu = "typowa" | "najgorszy"

type FormularzStan = {
  /** Sources the user unticked (e.g. already on the appliance list). */
  wylaczone: ZrodloBilansu[]
  doProjektu: DoProjektu
}

const STAN_POCZATKOWY: FormularzStan = { wylaczone: [], doProjektu: "typowa" }

/** Source screen of each item (link next to it). */
const EKRAN_ZRODLA: Record<ZrodloBilansu, string> = {
  odbiorniki: `/kalkulatory/${KLUCZE_ZRODEL.odbiorniki}`,
  bojler: `/kalkulatory/${KLUCZE_ZRODEL.bojler}`,
  wampiry: `/kalkulatory/${KLUCZE_ZRODEL.wampiry}`,
  falownik: `/kalkulatory/${KLUCZE_ZRODEL.falownik}`,
  zmienne: `/kalkulatory/${KLUCZE_ZRODEL.zmienne}`,
  specjalne: `/kalkulatory/${KLUCZE_ZRODEL.specjalne}`,
  sezonowe: `/kalkulatory/${KLUCZE_ZRODEL.sezonowe}`,
}

/**
 * Moduł 2 — „Bilans zapotrzebowania” (decision D-3, owner 24.11.2026). Reads the drafts of the other Module 2 screens (never
 * writes them), computes each with its own calculator (`lib/zapotrzebowanie/zrodla-bilansu.ts`) and sums them; the chosen figure
 * is offered to the project as the daily demand (without the buffer — the buffer screen adds it).
 */
export default function BilansZapotrzebowaniaPage() {
  const t = useTranslate()
  const { f2 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("bilans-zapotrzebowania", STAN_POCZATKOWY)

  const odbiorniki = useOdczytDraftu<DraftOdbiornikow>(KLUCZE_ZRODEL.odbiorniki).dane
  const bojler = useOdczytDraftu<DraftBojlera>(KLUCZE_ZRODEL.bojler).dane
  const wampiry = useOdczytDraftu<DraftWampirow>(KLUCZE_ZRODEL.wampiry).dane
  const falownik = useOdczytDraftu<DraftFalownika>(KLUCZE_ZRODEL.falownik).dane
  const zmienne = useOdczytDraftu<DraftZmiennych>(KLUCZE_ZRODEL.zmienne).dane
  const specjalne = useOdczytDraftu<KategorieSpecjalneInput>(KLUCZE_ZRODEL.specjalne).dane
  const sezonowe = useOdczytDraftu<DraftSezonowosci>(KLUCZE_ZRODEL.sezonowe).dane
  const bufor = useOdczytDraftu<DraftBufora>(KLUCZE_ZRODEL.bufor).dane

  const wklady = useMemo<Record<ZrodloBilansu, WkladZrodla>>(
    () => ({
      odbiorniki: wkladOdbiornikow(odbiorniki),
      bojler: wkladBojlera(bojler),
      wampiry: wkladWampirow(wampiry),
      falownik: wkladFalownika(falownik),
      zmienne: wkladZmiennych(zmienne),
      specjalne: wkladSpecjalnych(specjalne),
      sezonowe: wkladSezonowy(sezonowe),
    }),
    [odbiorniki, bojler, wampiry, falownik, zmienne, specjalne, sezonowe],
  )
  const buforPct = buforZDraftu(bufor)

  const result = useMemo(() => {
    const pozycje: PozycjaBilansu[] = ZRODLA_BILANSU.map((zrodlo) => ({
      zrodlo,
      wlaczona: !stan.wylaczone.includes(zrodlo),
      kwhDobaTypowa: wklady[zrodlo]?.kwhDobaTypowa ?? null,
      kwhDobaMiesiace: wklady[zrodlo]?.kwhDobaMiesiace ?? null,
    }))
    return calculateBilansZapotrzebowania({ pozycje, buforPct })
  }, [wklady, stan.wylaczone, buforPct])

  const policzony = result.status === "VALID" || result.status === "VALID_WITH_WARNINGS"
  const v = result.value
  const doProjektu = !policzony ? null : stan.doProjektu === "najgorszy" ? v.najgorszyKwh : v.typowaKwh
  useWynikiDoProjektu("bilans-zapotrzebowania", { zapotrzebowanieDoboweKwh: doProjektu === null ? null : Number(doProjektu.toFixed(2)) })

  const przelacz = (zrodlo: ZrodloBilansu, wlaczona: boolean) =>
    setStan((p) => ({ ...p, wylaczone: wlaczona ? p.wylaczone.filter((z) => z !== zrodlo) : [...p.wylaczone, zrodlo] }))

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bilans-zapotrzebowania" />
      <NaglowekEkranu tytul={t("UI-BIL-TYTUL")} ekran="bilans-zapotrzebowania" wynik={result}>
        {t("UI-BIL-OPIS")}
      </NaglowekEkranu>

      <section className="flex flex-col gap-3">
        <h2 className="flex items-center gap-1.5 text-small font-semibold">
          {t("UI-BIL-POZYCJE")} <PomocPola ekran="bilans-zapotrzebowania" pole="zrodla" />
        </h2>
        <ul className="flex flex-col gap-2">
          {ZRODLA_BILANSU.map((zrodlo) => {
            const w = wklady[zrodlo]
            return (
              <li key={zrodlo} className="flex flex-col gap-1 rounded-md border p-3">
                <PoleCheckbox
                  id={`bilans-${zrodlo}`}
                  checked={!stan.wylaczone.includes(zrodlo)}
                  onChange={(e) => przelacz(zrodlo, e.target.checked)}
                  label={t(KLUCZ_ZRODLA[zrodlo])}
                  hint={w ? t("UI-BIL-KWH-DOBA", { v: f2(w.kwhDobaTypowa) }) : t("UI-BIL-BRAK-DANYCH")}
                />
                <Link href={EKRAN_ZRODLA[zrodlo]} className="w-fit text-caption text-muted-foreground underline hover:text-foreground">
                  {t("UI-BIL-OTWORZ")}
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="text-small text-muted-foreground">
          {buforPct === null ? t("UI-BIL-BUFOR-BRAK") : t("UI-BIL-BUFOR", { procent: buforPct })}
        </p>
      </section>

      <PoleSelect
        label={t("UI-BIL-DO-PROJEKTU")}
        value={stan.doProjektu}
        onChange={(e) => setStan((p) => ({ ...p, doProjektu: e.target.value as DoProjektu }))}
        pomoc={<PomocPola ekran="bilans-zapotrzebowania" pole="doProjektu" />}
      >
        <option value="typowa">{t("UI-BIL-OPCJA-TYPOWA")}</option>
        <option value="najgorszy">{t("UI-BIL-OPCJA-NAJGORSZY")}</option>
      </PoleSelect>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-BIL-POLICZYC")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-BIL-WYPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziomOstrzezen(result.status)} etykieta={t("UI-BIL-DOBA-TYPOWA")}>
          <WynikGlowny>{t("UI-BIL-KWH-DOBA", { v: f2(v.typowaKwh) })}</WynikGlowny>
          <p className="text-small">{t("UI-BIL-Z-BUFOREM", { v: f2(v.typowaZBuforemKwh) })}</p>
          {v.najgorszyMiesiac !== null && (
            <p className="mt-2 text-small font-medium">
              {t("UI-BIL-NAJGORSZY", { miesiac: t(KLUCZE_MIESIECY[v.najgorszyMiesiac]!) })}: {t("UI-BIL-KWH-DOBA", { v: f2(v.najgorszyKwh) })} ·{" "}
              {t("UI-BIL-Z-BUFOREM", { v: f2(v.najgorszyZBuforemKwh) })}
            </p>
          )}
          <h3 className="mt-3 text-caption font-semibold text-muted-foreground">{t("UI-BIL-MIESIACE")}</h3>
          <ul className="grid grid-cols-4 gap-x-3 gap-y-1 text-caption tabular-nums">
            {v.miesiaceKwh.map((kwh, i) => (
              <li key={KLUCZE_MIESIECY[i]} className={i === v.najgorszyMiesiac ? "font-semibold" : ""}>
                {t(KLUCZE_MIESIECY[i]!)}: {f2(kwh)}
              </li>
            ))}
          </ul>
          <WynikSzczegoly
            assumptions={result.assumptions}
            warnings={result.warnings}
            formula={result.formula}
            formulaKey={result.formulaKey}
            formulaParams={result.formulaParams}
          />
        </WerdyktPanel>
      )}
    </main>
  )
}
