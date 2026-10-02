"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateMikroinwerteryVsCentralny } from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/calculator"
import {
  KRYTERIA_POROWNANIA,
  type KryteriumPorownania,
} from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/constants"
import type { FalownikWyspowyAc } from "@/lib/core/modules/pv/mikroinwertery-vs-centralny/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { useTranslate } from "@/lib/i18n/language-context"

type Odpowiedz = "" | "tak" | "nie"
type OdpowiedzFalownik = "" | FalownikWyspowyAc
type FormularzStan = { regularneZacienienie: Odpowiedz; falownikWyspowyAcCoupling?: OdpowiedzFalownik }

const STAN_POCZATKOWY: FormularzStan = { regularneZacienienie: "", falownikWyspowyAcCoupling: "" }

const KOLUMNY: Kolumna<KryteriumPorownania>[] = [
  { naglowek: "UI-MIKVSCEN-KRYTERIUM", render: (r) => <span className="font-medium">{r.kryterium}</span> },
  { naglowek: "UI-MIKVSCEN-MIKROINWERTER", render: (r) => r.mikroinwerter },
  { naglowek: "UI-MIKVSCEN-INWERTER-CENTRALNY", render: (r) => r.centralny },
]

export default function MikroinwerteryVsCentralnyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("mikroinwertery-vs-centralny", STAN_POCZATKOWY)
  const { regularneZacienienie } = stan
  // Stary szkic sprzed 1.1.0 nie ma tego pola (usePersistedDraft nie scala z wartościami początkowymi).
  const falownikWyspowyAcCoupling = stan.falownikWyspowyAcCoupling ?? ""

  const result = useMemo(
    () =>
      calculateMikroinwerteryVsCentralny({
        regularneZacienienie: regularneZacienienie === "" ? null : regularneZacienienie === "tak",
        falownikWyspowyAcCoupling: falownikWyspowyAcCoupling === "" ? null : falownikWyspowyAcCoupling,
      }),
    [regularneZacienienie, falownikWyspowyAcCoupling],
  )

  const poziom: WerdyktPoziom = result.warnings.some((w) => w.level === "critical")
    ? "blad"
    : result.warnings.some((w) => w.level === "warning")
      ? "uwaga"
      : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/mikroinwertery-vs-centralny" />
      <NaglowekEkranu tytul={t("UI-MIKVSCEN-MIKROINWERTERY-INWERTER-CENT")} ekran="mikroinwertery-vs-centralny">
        {t("UI-MIKVSCEN-MIKROINWERTER-OSOBNY-FALOWNI")}
      </NaglowekEkranu>

      <KartaPorownawcza kolumny={KOLUMNY.map((k) => ({ ...k, naglowek: t(k.naglowek) }))} wiersze={KRYTERIA_POROWNANIA} minWidth={320} />

      <PoleSelect
        label={t("UI-MIKVSCEN-PANELE-BEDA-CZESCIOWO")}
        value={regularneZacienienie}
        onChange={(e) => setStan({ ...stan, regularneZacienienie: e.target.value as Odpowiedz })}
        pomoc={<PomocPola ekran="mikroinwertery-vs-centralny" pole="cien" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        <option value="tak">{t("UI-TAK-DUZE")}</option>
        <option value="nie">{t("UI-NIE-DUZE")}</option>
      </PoleSelect>

      {regularneZacienienie === "tak" && (
        <PoleSelect
          label={t("UI-MIKVSCEN-MASZ-FALOWNIK-WYSPOWY")}
          value={falownikWyspowyAcCoupling}
          onChange={(e) => setStan({ ...stan, falownikWyspowyAcCoupling: e.target.value as OdpowiedzFalownik })}
          pomoc={<PomocPola ekran="mikroinwertery-vs-centralny" pole="acCoupling" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="tak">{t("UI-TAK-DUZE")}</option>
          <option value="nie">{t("UI-NIE-DUZE")}</option>
          <option value="nie-wiem">{t("UI-NIE-WIEM")}</option>
        </PoleSelect>
      )}

      {result.value.rekomendacja === null ? (
        <p className="text-small text-muted-foreground">
          {t("UI-MIKVSCEN-ODPOWIEDZ-PYTANIE-ZACIENIENI")}{" "}
          <Link href="/kalkulatory/analiza-zacienienia" className="underline">
            {t("UI-MIKVSCEN-ANALIZIE-ZACIENIENIA")}
          </Link>
          .
        </p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={result.value.rekomendacja === "mikroinwertery" ? t("UI-MIKVSCEN-REKOMENDACJA-MIKROINWERTERY") : t("UI-MIKVSCEN-REKOMENDACJA-INWERTER-CENTRA")}
        >
          {result.status === "INCOMPLETE" && (
            <p className="mt-1 text-small text-muted-foreground">
              {t("UI-MIKVSCEN-ODPOWIEDZ-PYTANIE-FALOWNIK")}
            </p>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          {result.value.rekomendacja === "mikroinwertery" && (
            <p className="mt-2 text-small text-muted-foreground">
              {t("UI-MIKVSCEN-ILE-TRACI-STRING")}{" "}
              <Link href="/kalkulatory/zacienienie-diody-bocznikujace" className="underline">
                {t("UI-MIKVSCEN-ZACIENIENIE-DIODY-BOCZNIKUJA")}
              </Link>
              .
            </p>
          )}
        </WerdyktPanel>
      )}

      
    </main>
  )
}
