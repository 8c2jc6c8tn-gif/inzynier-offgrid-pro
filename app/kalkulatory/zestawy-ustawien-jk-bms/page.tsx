"use client"

import { useMemo } from "react"
import { calculateZestawyUstawienJkBms, type WierszParametru, type Zgodnosc } from "@/lib/core/modules/baterie/zestawy-ustawien-jk-bms/calculator"
import { ZESTAWY, type TypParametru } from "@/lib/core/modules/baterie/zestawy-ustawien-jk-bms/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { zestawId: string }

const STAN_POCZATKOWY: FormularzStan = { zestawId: "" }

const JEDNOSTKA: Record<TypParametru, string> = {
  liczbaOgniw: "",
  pojemnoscAh: "Ah",
  napiecieOgniwaV: "V",
  pradBalanseraA: "A",
  pradCiagly: "A",
  temperaturaC: "°C",
}

const ZGODNOSC_KLUCZ: Record<Zgodnosc, string> = {
  zgodne: "UI-ZUJK-ZGODNOSC-ZGODNE",
  "poza-zakresem": "UI-ZUJK-ZGODNOSC-POZA",
  "brak-odniesienia": "UI-ZUJK-ZGODNOSC-BRAK",
  "do-potwierdzenia": "UI-ZUJK-ZGODNOSC-DO-POTWIERDZENIA",
}

const ZGODNOSC_KLASA: Record<Zgodnosc, string> = {
  zgodne: "text-werdykt-ok",
  "poza-zakresem": "text-werdykt-uwaga",
  "brak-odniesienia": "text-muted-foreground",
  "do-potwierdzenia": "text-muted-foreground",
}

export default function ZestawyUstawienJkBmsPage() {
  const t = useTranslate()
  const { f1, f3 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zestawy-ustawien-jk-bms", STAN_POCZATKOWY)
  const { zestawId } = stan

  const result = useMemo(() => calculateZestawyUstawienJkBms({ zestawId }), [zestawId])

  const poziom: WerdyktPoziom | null =
    result.status === "VALID"
      ? "ok"
      : result.status === "VALID_WITH_WARNINGS"
        ? "uwaga"
        : result.status === "INVALID_INPUT"
          ? "blad"
          : null

  const zestawKlucz = (id: string) => id.toUpperCase()
  const v = result.value

  function wartoscTekst(w: WierszParametru, wartosc: number): string {
    const j = JEDNOSTKA[w.typ]
    const liczba = w.typ === "liczbaOgniw" ? `${f1(wartosc)} ${t("UI-ZUJK-SZT")}` : f3(wartosc)
    return j === "" || w.typ === "liczbaOgniw" ? liczba : `${liczba} ${j}`
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zestawy-ustawien-jk-bms" />
      <NaglowekEkranu tytul={t("UI-ZUJK-TYTUL")} ekran="zestawy-ustawien-jk-bms">
        {t("UI-ZUJK-OPIS")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-ZUJK-WYBOR-ZESTAWU")}
        value={zestawId}
        onChange={(e) => setStan({ zestawId: e.target.value })}
        pomoc={<PomocPola ekran="zestawy-ustawien-jk-bms" pole="zestawId" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        {ZESTAWY.map((z) => (
          <option key={z.id} value={z.id}>
            {t(`UI-ZUJK-ZESTAW-${zestawKlucz(z.id)}`)}
          </option>
        ))}
      </PoleSelect>

      {result.status === "INCOMPLETE" && (
        <p className="text-small text-muted-foreground">{t("UI-ZUJK-WYBIERZ-ZESTAW")}</p>
      )}

      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-ZUJK-WERDYKT-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}

      {poziom !== null && poziom !== "blad" && (
        <>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small">
            <dt className="text-muted-foreground">{t("UI-ZUJK-AUTOR")}</dt>
            <dd>{v.autor}</dd>
            <dt className="text-muted-foreground">{t("UI-ZUJK-BMS")}</dt>
            <dd>{v.bms}</dd>
            <dt className="text-muted-foreground">{t("UI-ZUJK-LICZBA-OGNIW")}</dt>
            <dd>{v.liczbaOgniw !== null ? f1(v.liczbaOgniw) : "—"}</dd>
            <dt className="text-muted-foreground">{t("UI-ZUJK-POJEMNOSC")}</dt>
            <dd>{v.pojemnoscAh !== null ? `${f1(v.pojemnoscAh)} Ah` : "—"}</dd>
            <dt className="text-muted-foreground">{t("UI-ZUJK-ZRODLO")}</dt>
            <dd>{t(`UI-ZUJK-ZRODLO-${zestawKlucz(v.zestawId)}`)}</dd>
          </dl>

          <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? t("UI-ZUJK-WERDYKT-OK") : t("UI-ZUJK-WERDYKT-UWAGA")}>
            <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
          </WerdyktPanel>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">{t("UI-ZUJK-TABELA-TYTUL")}</h2>
            <ul className="flex flex-col gap-3">
              {v.wiersze.map((w) => (
                <li key={w.id} className="rounded-md border border-border p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium">{w.nazwaJk}</span>
                    <span className={`text-small ${ZGODNOSC_KLASA[w.zgodnosc]}`}>{t(ZGODNOSC_KLUCZ[w.zgodnosc])}</span>
                  </div>
                  <p className="mt-1 text-small text-muted-foreground">{t(`UI-ZUJK-PARAM-${w.id.toUpperCase()}`)}</p>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-small">
                    <dt className="text-muted-foreground">{t("UI-ZUJK-WARTOSC")}</dt>
                    <dd>
                      {wartoscTekst(w, w.wartosc)}
                      {w.alternatywa !== null && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({t("UI-ZUJK-ALTERNATYWA")}: {wartoscTekst(w, w.alternatywa)})
                        </span>
                      )}
                    </dd>
                    {w.pakietV !== null && (
                      <>
                        <dt className="text-muted-foreground">{t("UI-ZUJK-PAKIET")}</dt>
                        <dd>
                          {f3(w.pakietV)} V
                          {w.pakietAlternatywaV !== null && (
                            <span className="text-muted-foreground"> ({f3(w.pakietAlternatywaV)} V)</span>
                          )}
                        </dd>
                      </>
                    )}
                    {w.cRate !== null && (
                      <>
                        <dt className="text-muted-foreground">{t("UI-ZUJK-C-RATE")}</dt>
                        <dd>{f3(w.cRate)} C</dd>
                      </>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
            <p className="text-small text-muted-foreground">{t("UI-ZUJK-NOTA")}</p>
          </section>

          {v.pochodne !== null && (
            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold">{t("UI-ZUJK-POCHODNE-TYTUL")}</h2>
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-small">
                {v.pochodne.ovpPakietV !== null && (
                  <>
                    <dt>{t("UI-ZUJK-OVP-PAKIET")}</dt>
                    <dd>{f3(v.pochodne.ovpPakietV)} V</dd>
                  </>
                )}
                {v.pochodne.uvpPakietV !== null && (
                  <>
                    <dt>{t("UI-ZUJK-UVP-PAKIET")}</dt>
                    <dd>{f3(v.pochodne.uvpPakietV)} V</dd>
                  </>
                )}
                {v.pochodne.histerezaOvpV !== null && (
                  <>
                    <dt>{t("UI-ZUJK-HIST-OVP")}</dt>
                    <dd>{f3(v.pochodne.histerezaOvpV)} V</dd>
                  </>
                )}
                {v.pochodne.histerezaUvpV !== null && (
                  <>
                    <dt>{t("UI-ZUJK-HIST-UVP")}</dt>
                    <dd>{f3(v.pochodne.histerezaUvpV)} V</dd>
                  </>
                )}
              </dl>
            </section>
          )}
        </>
      )}
    </main>
  )
}
