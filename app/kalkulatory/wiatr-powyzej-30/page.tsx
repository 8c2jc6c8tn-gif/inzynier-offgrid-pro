"use client"

import { useMemo } from "react"
import { calculateWiatrPowyzej30 } from "@/lib/core/modules/pv/wiatr-powyzej-30/calculator"
import {
  KAT_MAX_DEG,
  KAT_NORMOWY_MAX_DEG,
  WYSOKOSC_KONSTRUKCJI_ZAKRES_M,
  WYSOKOSC_NPM_ZAKRES_M,
} from "@/lib/core/modules/pv/wiatr-powyzej-30/constants"
import { KATEGORIE_TERENU, type KategoriaTerenu, type StrefaWiatrowa } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"
import { OPIS_TERENU } from "@/app/kalkulatory/typ-montazu/_components/wspolne"

type FormularzStan = {
  nachylenieDeg: string
  strefa: string
  wysokoscNpmM: string
  kategoria: string
  wysokoscKonstrukcjiM: string
}

const STAN_POCZATKOWY: FormularzStan = { nachylenieDeg: "", strefa: "", wysokoscNpmM: "", kategoria: "", wysokoscKonstrukcjiM: "" }

const liczbaLubNull = (s: string) => (s.trim() === "" || !Number.isFinite(Number(s)) ? null : Number(s))

export default function WiatrPowyzej30Page() {
  const t = useTranslate()
  const { f0, f2 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wiatr-powyzej-30", STAN_POCZATKOWY)
  const { nachylenieDeg, wysokoscNpmM, wysokoscKonstrukcjiM } = stan
  // Drafts saved before a field existed carry no value for it — treat as empty.
  const strefa = stan.strefa ?? ""
  const kategoria = stan.kategoria ?? ""
  const ustaw = (pole: keyof FormularzStan, wartosc: string) => setStan((prev) => ({ ...prev, [pole]: wartosc }))

  const result = useMemo(
    () =>
      calculateWiatrPowyzej30({
        nachylenieDeg: liczbaLubNull(nachylenieDeg) ?? 0,
        strefaWiatrowa: strefa === "1" || strefa === "2" || strefa === "3" ? (Number(strefa) as StrefaWiatrowa) : null,
        wysokoscNpmM: liczbaLubNull(wysokoscNpmM),
        kategoriaTerenu: (KATEGORIE_TERENU as readonly string[]).includes(kategoria) ? (kategoria as KategoriaTerenu) : null,
        wysokoscKonstrukcjiM: liczbaLubNull(wysokoscKonstrukcjiM),
      }),
    [nachylenieDeg, strefa, wysokoscNpmM, kategoria, wysokoscKonstrukcjiM],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wiatr-powyzej-30" />
      <NaglowekEkranu
        tytul={t("UI-WIAPOW30-TYTUL")}
        ekran="wiatr-powyzej-30"
        wynik={result}
        parametry={{ maxKat: KAT_NORMOWY_MAX_DEG }}
      >
        {t("UI-WIAPOW30-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-WIAPOW30-NACHYLENIE")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={KAT_NORMOWY_MAX_DEG}
          max={KAT_MAX_DEG}
          value={nachylenieDeg}
          onChange={(e) => ustaw("nachylenieDeg", e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="nachylenie" params={{ maxKat: KAT_NORMOWY_MAX_DEG }} />}
        />
        <PoleSelect
          label={t("UI-TYPMON-COMWSP-STREFA-WIATROWA")}
          value={strefa}
          onChange={(e) => ustaw("strefa", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="strefa" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="1">{t("UI-TYPMON-COMWSP-STREFA")}</option>
          <option value="2">{t("UI-TYPMON-COMWSP-STREFA-2")}</option>
          <option value="3">{t("UI-TYPMON-COMWSP-STREFA-3")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-TYPMON-COMWSP-WYSOKOSC-TERENU")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={WYSOKOSC_NPM_ZAKRES_M[0]}
          max={WYSOKOSC_NPM_ZAKRES_M[1]}
          value={wysokoscNpmM}
          onChange={(e) => ustaw("wysokoscNpmM", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="wysokoscNpm" />}
        />
        <PoleSelect
          label={t("UI-TYPMON-COMWSP-TEREN-WOKOL-KATEGORIA")}
          value={kategoria}
          onChange={(e) => ustaw("kategoria", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="teren" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {KATEGORIE_TERENU.map((k) => (
            <option key={k} value={k}>
              {t(OPIS_TERENU[k])}
            </option>
          ))}
        </PoleSelect>
        <Pole
          label={t("UI-WIAPOW30-WYSOKOSC-KONSTRUKCJI")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={WYSOKOSC_KONSTRUKCJI_ZAKRES_M[0]}
          max={WYSOKOSC_KONSTRUKCJI_ZAKRES_M[1]}
          value={wysokoscKonstrukcjiM}
          onChange={(e) => ustaw("wysokoscKonstrukcjiM", e.target.value)}
          pomoc={
            <PomocPola
              ekran="wiatr-powyzej-30"
              pole="wysokoscKonstrukcji"
              params={{ min: WYSOKOSC_KONSTRUKCJI_ZAKRES_M[0], max: WYSOKOSC_KONSTRUKCJI_ZAKRES_M[1] }}
            />
          }
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-WIAPOW30-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-WIAPOW30-WYPELNIJ")}</p>
      ) : result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-WIAPOW30-POZA-ZAKRESEM")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-WIAPOW30-SZACUNEK")}>
          <WynikGlowny>{f0(v.qpPa)} Pa</WynikGlowny>
          <p className="text-small">{t("UI-WIAPOW30-QP", { qp: f0(v.qpPa), qb: f0(v.qbPa), ce: f2(v.ce) })}</p>
          <p className="text-small">{t("UI-WIAPOW30-DOCISK", { srodek: f0(v.dociskSrodekPa), krawedz: f0(v.dociskKrawedzPa) })}</p>
          <p className="text-small">{t("UI-WIAPOW30-ODRYWANIE", { srodek: f0(v.odrywanieSrodekPa), krawedz: f0(v.odrywanieKrawedzPa) })}</p>
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
