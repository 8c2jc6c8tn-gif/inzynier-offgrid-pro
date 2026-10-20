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
import { PHI_MAX, PHI_MIN, PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "@/lib/core/modules/pv/zloty-srodek/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { BalastWarunki } from "@/components/wzorce/balast-warunki"
import { PrzelicznikTarcia } from "@/components/wzorce/przelicznik-tarcia"
import { WyborMetodyCf } from "@/components/wzorce/wybor-metody-cf"
import type { MetodaCf } from "@/lib/core/modules/pv/wiatr-powyzej-30/sila-i-balast"
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
  powierzchniaM2: string
  phi: string
  masaPaneliStelazaKg: string
  wspolczynnikTarcia: string
  wysokoscSrodkaParciaM: string
  szerokoscPodstawyM: string
  metodaCf: string
}

const STAN_POCZATKOWY: FormularzStan = {
  nachylenieDeg: "",
  strefa: "",
  wysokoscNpmM: "",
  kategoria: "",
  wysokoscKonstrukcjiM: "",
  powierzchniaM2: "",
  phi: "",
  masaPaneliStelazaKg: "",
  wspolczynnikTarcia: "",
  wysokoscSrodkaParciaM: "",
  szerokoscPodstawyM: "",
  metodaCf: "",
}

const liczbaLubNull = (s: string) => (s.trim() === "" || !Number.isFinite(Number(s)) ? null : Number(s))

export default function WiatrPowyzej30Page() {
  const t = useTranslate()
  const { f0, f2 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wiatr-powyzej-30", STAN_POCZATKOWY)
  const { nachylenieDeg, wysokoscNpmM, wysokoscKonstrukcjiM } = stan
  // Drafts saved before a field existed carry no value for it — treat as empty.
  const strefa = stan.strefa ?? ""
  const kategoria = stan.kategoria ?? ""
  const powierzchniaM2 = stan.powierzchniaM2 ?? ""
  const phi = stan.phi ?? ""
  const masaPaneliStelazaKg = stan.masaPaneliStelazaKg ?? ""
  const wspolczynnikTarcia = stan.wspolczynnikTarcia ?? ""
  const wysokoscSrodkaParciaM = stan.wysokoscSrodkaParciaM ?? ""
  const szerokoscPodstawyM = stan.szerokoscPodstawyM ?? ""
  const metodaCf: MetodaCf = stan.metodaCf === "trend" ? "trend" : "liniowa"
  const ustaw = (pole: keyof FormularzStan, wartosc: string) => setStan((prev) => ({ ...prev, [pole]: wartosc }))

  const result = useMemo(
    () =>
      calculateWiatrPowyzej30({
        nachylenieDeg: liczbaLubNull(nachylenieDeg) ?? 0,
        strefaWiatrowa: strefa === "1" || strefa === "2" || strefa === "3" ? (Number(strefa) as StrefaWiatrowa) : null,
        wysokoscNpmM: liczbaLubNull(wysokoscNpmM),
        kategoriaTerenu: (KATEGORIE_TERENU as readonly string[]).includes(kategoria) ? (kategoria as KategoriaTerenu) : null,
        wysokoscKonstrukcjiM: liczbaLubNull(wysokoscKonstrukcjiM),
        powierzchniaM2: liczbaLubNull(powierzchniaM2),
        wspolczynnikPhi: liczbaLubNull(phi),
        masaPaneliStelazaKg: liczbaLubNull(masaPaneliStelazaKg),
        wspolczynnikTarcia: liczbaLubNull(wspolczynnikTarcia),
        wysokoscSrodkaParciaM: liczbaLubNull(wysokoscSrodkaParciaM),
        szerokoscPodstawyM: liczbaLubNull(szerokoscPodstawyM),
        metodaCf,
      }),
    [nachylenieDeg, strefa, wysokoscNpmM, kategoria, wysokoscKonstrukcjiM, powierzchniaM2, phi, masaPaneliStelazaKg, wspolczynnikTarcia, wysokoscSrodkaParciaM, szerokoscPodstawyM, metodaCf],
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
        <Pole
          label={t("UI-WIAPOW30-POWIERZCHNIA")}
          unit="m²"
          type="number"
          inputMode="decimal"
          min={0}
          value={powierzchniaM2}
          onChange={(e) => ustaw("powierzchniaM2", e.target.value)}
          pomoc={<PomocPola ekran="napor-wiatru" pole="powierzchnia" />}
        />
        <Pole
          label={t("UI-TYPMON-COMWSP-ZABUDOWA-POD-STELAZEM")}
          type="number"
          inputMode="decimal"
          min={PHI_MIN}
          max={PHI_MAX}
          step={0.1}
          value={phi}
          onChange={(e) => ustaw("phi", e.target.value)}
          pomoc={<PomocPola ekran="typ-montazu-pola" pole="zabudowa" />}
        />
        <WyborMetodyCf metoda={metodaCf} onChange={(m) => ustaw("metodaCf", m)} t={t} f={f2} />
        <Pole
          label={t("UI-NAPWIA-MASA-PANELU-STELAZA")}
          unit="kg"
          type="number"
          inputMode="decimal"
          min={0}
          value={masaPaneliStelazaKg}
          onChange={(e) => ustaw("masaPaneliStelazaKg", e.target.value)}
          pomoc={<PomocPola ekran="napor-wiatru" pole="masa" />}
        />
        <Pole
          label={t("UI-WIAPOW30-TARCIE")}
          type="number"
          inputMode="decimal"
          min={0}
          step={0.05}
          value={wspolczynnikTarcia}
          onChange={(e) => ustaw("wspolczynnikTarcia", e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="tarcie" />}
        />
        <PrzelicznikTarcia onUzyj={(mu) => ustaw("wspolczynnikTarcia", String(mu))} />
        <Pole
          label={t("UI-WIAPOW30-WYSOKOSC-PARCIA")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={wysokoscSrodkaParciaM}
          onChange={(e) => ustaw("wysokoscSrodkaParciaM", e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="wysokoscParcia" />}
        />
        <Pole
          label={t("UI-WIAPOW30-SZEROKOSC-PODSTAWY")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={szerokoscPodstawyM}
          onChange={(e) => ustaw("szerokoscPodstawyM", e.target.value)}
          pomoc={<PomocPola ekran="wiatr-powyzej-30" pole="szerokoscPodstawy" />}
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
          {v.silaWiatruN === null ? (
            <p className="text-small text-muted-foreground">{t("UI-WIAPOW30-PODAJ-POWIERZCHNIE")}</p>
          ) : (
            <>
              <p className="text-small">
                {v.balastProjektowyKg === null
                  ? t("UI-WIAPOW30-PION-POZIOMA", { sila: f0(v.silaWiatruN) })
                  : t("UI-WIAPOW30-SILA", { sila: f0(v.silaWiatruN), kg: f0(v.silaWiatruN / PRZYSPIESZENIE_ZIEMSKIE_M_S2), cf: f2(v.cf!) })}
              </p>
              {v.balastProjektowyKg !== null && (
                <p className="text-small font-medium">
                  {t("UI-WIAPOW30-BALAST", {
                    balast: f0(Math.ceil(v.balastProjektowyKg)),
                    stelaz: masaPaneliStelazaKg !== "" ? ` ${t("UI-WIAPOW30-PONAD-CIEZAR")}` : "",
                  })}
                </p>
              )}
              {(v.balastOderwanieKg !== null || v.balastPrzesuwKg !== null) && (
                <BalastWarunki
                  warunki={{ oderwanie: v.balastOderwanieKg, przesuw: v.balastPrzesuwKg, przewracanie: v.balastPrzewracanieKg }}
                  rozstrzyga={v.warunekRozstrzygajacy}
                  t={t}
                  f={f0}
                  oderwanieNieDotyczy={v.balastOderwanieKg === null}
                  podejscieEc7={v.podejscieEc7Przesuw}
                />
              )}
              {v.balastPrzesuwKg === null && v.balastProjektowyKg !== null && <p className="text-small text-muted-foreground">{t("UI-WIAPOW30-BALAST-NIESPRAWDZONE")}</p>}
            </>
          )}
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
