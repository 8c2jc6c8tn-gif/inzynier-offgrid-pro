"use client"

import { useMemo } from "react"
import { calculateOgrodzeniePv } from "@/lib/core/modules/pv/ogrodzenie-pv/calculator"
import type { ProfilRurki, GatunekStali } from "@/lib/core/modules/pv/ogrodzenie-pv/constants"
import type { MetodaOporuGruntu } from "@/lib/core/modules/pv/ogrodzenie-pv/input"
import { KATEGORIE_TERENU, type KategoriaTerenu, type StrefaWiatrowa } from "@/lib/core/modules/pv/eurokod-1/wiatr"
import type { GrupaGruntuNiespoistego, WilgotnoscGruntu } from "@/lib/core/modules/pv/eurokod-7/grunty-pn-b-03020"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useFormaty, useTranslate } from "@/lib/i18n/language-context"
import { OPIS_TERENU } from "@/app/kalkulatory/typ-montazu/_components/wspolne"

type FormularzStan = {
  dlugoscPanelaMm: string
  wysokoscPanelaMm: string
  grubosc: string
  szczelinaPozioma: string
  szczelinaPionowa: string
  przeswitMm: string
  liczbaRzedow: string
  maxWysokoscMm: string
  dlugoscOgrodzeniaM: string
  strefa: string
  wysokoscNpmM: string
  kategoria: string
  grupa: string
  stopienId: string
  wilgotnosc: string
  gruntPodWoda: boolean
  przemarzanieM: string
  stal: string
  metoda: string
  ugiecieMm: string
}

const STAN_POCZATKOWY: FormularzStan = {
  dlugoscPanelaMm: "",
  wysokoscPanelaMm: "",
  grubosc: "",
  szczelinaPozioma: "",
  szczelinaPionowa: "",
  przeswitMm: "",
  liczbaRzedow: "",
  maxWysokoscMm: "",
  dlugoscOgrodzeniaM: "",
  strefa: "",
  wysokoscNpmM: "",
  kategoria: "",
  grupa: "",
  stopienId: "",
  wilgotnosc: "",
  gruntPodWoda: false,
  przemarzanieM: "",
  stal: "",
  metoda: "",
  ugiecieMm: "",
}

const GRUPY: readonly GrupaGruntuNiespoistego[] = ["zwir-pospolka", "pr-ps", "pd-ppi"]
const WILGOTNOSCI: readonly WilgotnoscGruntu[] = ["malo-wilgotne", "wilgotne", "mokre"]
const STALE: readonly GatunekStali[] = ["S235", "S355"]
const METODY: readonly MetodaOporuGruntu[] = ["zachowawcza", "broms"]

const OPIS_GRUPY: Record<GrupaGruntuNiespoistego, string> = {
  "zwir-pospolka": "UI-TARCIE-PHIU-GRUPA-ZWIR",
  "pr-ps": "UI-TARCIE-PHIU-GRUPA-PR",
  "pd-ppi": "UI-TARCIE-PHIU-GRUPA-PD",
}
const OPIS_WILGOTNOSCI: Record<WilgotnoscGruntu, string> = {
  "malo-wilgotne": "UI-OGRPV-WILGOTNOSC-MALO",
  wilgotne: "UI-OGRPV-WILGOTNOSC-WILGOTNY",
  mokre: "UI-OGRPV-WILGOTNOSC-MOKRY",
}
const OPIS_METODY: Record<MetodaOporuGruntu, string> = {
  zachowawcza: "UI-OGRPV-METODA-ZACHOWAWCZA",
  broms: "UI-OGRPV-METODA-BROMS",
}
const OPIS_PODEJSCIA = {
  "PO1-K1": "UI-BALAST-PODEJSCIE-PO1-K1",
  "PO1-K2": "UI-BALAST-PODEJSCIE-PO1-K2",
  PO2: "UI-BALAST-PODEJSCIE-PO2",
  PO3: "UI-BALAST-PODEJSCIE-PO3",
} as const

const liczbaLubNull = (s: string) => (s.trim() === "" || !Number.isFinite(Number(s.replace(",", "."))) ? null : Number(s.replace(",", ".")))
const liczbaLubZero = (s: string) => liczbaLubNull(s) ?? 0
const jedenZ = <T extends string>(lista: readonly T[], s: string): T | null => (lista as readonly string[]).includes(s) ? (s as T) : null

export default function OgrodzeniePvPage() {
  const t = useTranslate()
  const { f0, f1, f2 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ogrodzenie-pv", STAN_POCZATKOWY)
  const ustaw = <K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) => setStan((prev) => ({ ...prev, [pole]: wartosc }))
  // Drafts saved before a field existed carry no value for it — treat as empty.
  const s = { ...STAN_POCZATKOWY, ...stan }

  const result = useMemo(
    () =>
      calculateOgrodzeniePv({
        dlugoscPanelaMm: liczbaLubZero(s.dlugoscPanelaMm),
        wysokoscPanelaMm: liczbaLubZero(s.wysokoscPanelaMm),
        grubDoscPanelaMm: liczbaLubNull(s.grubosc),
        szczelinaPionowaMm: liczbaLubNull(s.szczelinaPionowa),
        szczelinaPoziomaMm: liczbaLubNull(s.szczelinaPozioma),
        przeswitMm: liczbaLubZero(s.przeswitMm),
        liczbaRzedow: liczbaLubNull(s.liczbaRzedow),
        maxWysokoscMm: liczbaLubNull(s.maxWysokoscMm),
        dlugoscOgrodzeniaM: liczbaLubNull(s.dlugoscOgrodzeniaM),
        strefaWiatrowa: s.strefa === "1" || s.strefa === "2" || s.strefa === "3" ? (Number(s.strefa) as StrefaWiatrowa) : null,
        wysokoscNpmM: liczbaLubNull(s.wysokoscNpmM),
        kategoriaTerenu: jedenZ<KategoriaTerenu>(KATEGORIE_TERENU, s.kategoria),
        grupaGruntu: jedenZ(GRUPY, s.grupa),
        stopienZageszczeniaId: liczbaLubZero(s.stopienId),
        wilgotnoscGruntu: jedenZ(WILGOTNOSCI, s.wilgotnosc),
        gruntPodWoda: s.gruntPodWoda,
        glebokoscPrzemarzaniaM: liczbaLubZero(s.przemarzanieM),
        gatunekStali: jedenZ(STALE, s.stal),
        metodaOporuGruntu: jedenZ(METODY, s.metoda),
        ugiecieDopuszczalneMm: liczbaLubNull(s.ugiecieMm),
      }),
    [s.dlugoscPanelaMm, s.wysokoscPanelaMm, s.grubosc, s.szczelinaPionowa, s.szczelinaPozioma, s.przeswitMm, s.liczbaRzedow, s.maxWysokoscMm, s.dlugoscOgrodzeniaM, s.strefa, s.wysokoscNpmM, s.kategoria, s.grupa, s.stopienId, s.wilgotnosc, s.gruntPodWoda, s.przemarzanieM, s.stal, s.metoda, s.ugiecieMm],
  )
  const v = result.value
  const profil = (p: ProfilRurki) => t("UI-OGRPV-PROFIL", { glebokosc: f0(p.glebokoscMm), szerokosc: f0(p.szerokoscMm), grubosc: f1(p.grubosciMm) })
  const krytyczne = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ogrodzenie-pv" />
      <NaglowekEkranu tytul={t("UI-OGRPV-TYTUL")} ekran="ogrodzenie-pv" wynik={result}>
        {t("UI-OGRPV-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label={t("UI-OGRPV-DLUGOSC-PANELA")} unit="mm" type="number" inputMode="decimal" min={0} value={s.dlugoscPanelaMm} onChange={(e) => ustaw("dlugoscPanelaMm", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="dlugoscPanela" />} />
        <Pole label={t("UI-OGRPV-WYSOKOSC-PANELA")} unit="mm" type="number" inputMode="decimal" min={0} value={s.wysokoscPanelaMm} onChange={(e) => ustaw("wysokoscPanelaMm", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="wysokoscPanela" />} />
        <Pole label={t("UI-OGRPV-GRUBOSC-PANELA")} unit="mm" type="number" inputMode="decimal" min={0} value={s.grubosc} onChange={(e) => ustaw("grubosc", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="grubosc" />} />
        <Pole label={t("UI-OGRPV-SZCZELINA-POZIOMA")} unit="mm" type="number" inputMode="decimal" min={0} value={s.szczelinaPozioma} onChange={(e) => ustaw("szczelinaPozioma", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="szczelinaPozioma" />} />
        <Pole label={t("UI-OGRPV-SZCZELINA-PIONOWA")} unit="mm" type="number" inputMode="decimal" min={0} value={s.szczelinaPionowa} onChange={(e) => ustaw("szczelinaPionowa", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="szczelinaPionowa" />} />
        <Pole label={t("UI-OGRPV-PRZESWIT")} unit="mm" type="number" inputMode="decimal" min={0} value={s.przeswitMm} onChange={(e) => ustaw("przeswitMm", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="przeswit" />} />
        <Pole label={t("UI-OGRPV-MAX-WYSOKOSC")} unit="mm" type="number" inputMode="decimal" min={0} value={s.maxWysokoscMm} onChange={(e) => ustaw("maxWysokoscMm", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="maxWysokosc" />} />
        <Pole label={t("UI-OGRPV-LICZBA-RZEDOW")} type="number" inputMode="numeric" min={1} step={1} value={s.liczbaRzedow} onChange={(e) => ustaw("liczbaRzedow", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="liczbaRzedow" />} />
        <Pole label={t("UI-OGRPV-DLUGOSC-OGRODZENIA")} unit="m" type="number" inputMode="decimal" min={0} value={s.dlugoscOgrodzeniaM} onChange={(e) => ustaw("dlugoscOgrodzeniaM", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="dlugoscOgrodzenia" />} />

        <PoleSelect label={t("UI-TYPMON-COMWSP-STREFA-WIATROWA")} value={s.strefa} onChange={(e) => ustaw("strefa", e.target.value)} pomoc={<PomocPola ekran="typ-montazu-pola" pole="strefa" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="1">{t("UI-TYPMON-COMWSP-STREFA")}</option>
          <option value="2">{t("UI-TYPMON-COMWSP-STREFA-2")}</option>
          <option value="3">{t("UI-TYPMON-COMWSP-STREFA-3")}</option>
        </PoleSelect>
        <Pole label={t("UI-TYPMON-COMWSP-WYSOKOSC-TERENU")} unit="m" type="number" inputMode="decimal" value={s.wysokoscNpmM} onChange={(e) => ustaw("wysokoscNpmM", e.target.value)} pomoc={<PomocPola ekran="typ-montazu-pola" pole="wysokoscNpm" />} />
        <PoleSelect label={t("UI-TYPMON-COMWSP-TEREN-WOKOL-KATEGORIA")} value={s.kategoria} onChange={(e) => ustaw("kategoria", e.target.value)} pomoc={<PomocPola ekran="typ-montazu-pola" pole="teren" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {KATEGORIE_TERENU.map((k) => (
            <option key={k} value={k}>
              {t(OPIS_TERENU[k])}
            </option>
          ))}
        </PoleSelect>

        <PoleSelect label={t("UI-TARCIE-PHIU-GRUPA")} value={s.grupa} onChange={(e) => ustaw("grupa", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="grupaGruntu" />}>
          <option value="">{t("UI-TARCIE-PHIU-GRUPA-BRAK")}</option>
          {GRUPY.map((g) => (
            <option key={g} value={g}>
              {t(OPIS_GRUPY[g])}
            </option>
          ))}
        </PoleSelect>
        <Pole label={t("UI-TARCIE-PHIU-ID")} type="number" inputMode="decimal" min={0.2} max={1} step={0.05} value={s.stopienId} onChange={(e) => ustaw("stopienId", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="stopienZageszczeniaId" />} />
        <PoleSelect label={t("UI-OGRPV-WILGOTNOSC")} value={s.wilgotnosc} onChange={(e) => ustaw("wilgotnosc", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="wilgotnosc" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {WILGOTNOSCI.map((w) => (
            <option key={w} value={w}>
              {t(OPIS_WILGOTNOSCI[w])}
            </option>
          ))}
        </PoleSelect>
        <div className="flex items-start gap-2">
          <PoleCheckbox id="ogrodzenie-pod-woda" className="flex-1" label={t("UI-OGRPV-GRUNT-POD-WODA")} checked={s.gruntPodWoda} onChange={(e) => ustaw("gruntPodWoda", e.target.checked)} />
          <PomocPola ekran="ogrodzenie-pv" pole="gruntPodWoda" />
        </div>
        <Pole label={t("UI-OGRPV-PRZEMARZANIE")} unit="m" type="number" inputMode="decimal" min={0} step={0.05} value={s.przemarzanieM} onChange={(e) => ustaw("przemarzanieM", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="przemarzanie" />} />
        <PoleSelect label={t("UI-OGRPV-METODA")} value={s.metoda} onChange={(e) => ustaw("metoda", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="metodaOporu" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {METODY.map((m) => (
            <option key={m} value={m}>
              {t(OPIS_METODY[m])}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect label={t("UI-OGRPV-STAL")} value={s.stal} onChange={(e) => ustaw("stal", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="stal" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {STALE.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </PoleSelect>
        <Pole label={t("UI-OGRPV-UGIECIE")} unit="mm" type="number" inputMode="decimal" min={0} value={s.ugiecieMm} onChange={(e) => ustaw("ugiecieMm", e.target.value)} pomoc={<PomocPola ekran="ogrodzenie-pv" pole="ugiecie" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-OGRPV-SPRAWDZ")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-OGRPV-WYPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={krytyczne ? "blad" : "uwaga"} etykieta={krytyczne ? t("UI-OGRPV-PROBLEM") : t("UI-OGRPV-SZACUNEK")}>
          <WynikGlowny>{f0(v.wysokoscCalkowitaMm)} mm</WynikGlowny>
          <p className="text-small">{t("UI-OGRPV-UKLAD", { rzedy: v.rzedy, wysokosc: f0(v.wysokoscCalkowitaMm), rozstaw: f0(v.rozstawSlupkowMm) })}</p>
          <p className="text-small">{t("UI-OGRPV-WIATR", { qp: f0(v.qpPa), cf: f2(v.cf), sila: f0(v.silaNaSlupekN), moment: f0(v.momentProjektowyNm) })}</p>
          {v.slupek !== null && (
            <p className="text-small font-medium">
              {t("UI-OGRPV-SLUPEK", { profil: profil(v.slupek.profil), wykorzystanie: f0(v.slupek.wykorzystanie * 100), ugiecie: f1(v.slupek.ugiecieMm) })}
            </p>
          )}
          {v.rygiel !== null && (
            <p className="text-small font-medium">
              {t("UI-OGRPV-RYGIEL", { profil: profil(v.rygiel.profil), wykorzystanie: f0(v.rygiel.wykorzystanie * 100), ugiecie: f1(v.rygiel.ugiecieMm) })}
            </p>
          )}
          <p className="text-small">{t("UI-OGRPV-GRUNT-WYNIK", { phi: f1(v.katTarciaDeg), gestosc: f0(v.gestoscGruntuKgM3) })}</p>
          {v.fundament !== null && (
            <>
              <p className="text-small font-medium">{t("UI-OGRPV-FUNDAMENT", { srednica: f0(v.fundament.srednicaMm), zaglebienie: f0(v.fundament.zaglebienieKoncoweMm) })}</p>
              <p className="text-small">
                {t("UI-OGRPV-FUNDAMENT-METODY", {
                  zachowawcza: f2(v.fundament.zaglebienieZachowawczaM),
                  broms: f2(v.fundament.zaglebienieBromsM),
                  podejscie: t(OPIS_PODEJSCIA[v.fundament.podejscieEc7]),
                  wybrana: f2(v.fundament.zaglebienieWybraneM),
                })}
              </p>
              <details className="text-small">
                <summary className="cursor-pointer">{t("UI-OGRPV-TABELA-TYTUL")}</summary>
                <ul className="mt-1 list-disc pl-5">
                  {Object.entries(v.zaglebienieWgSrednicy).map(([d, mm]) => (
                    <li key={d}>{t("UI-OGRPV-TABELA-WIERSZ", { srednica: d, zaglebienie: f0(mm) })}</li>
                  ))}
                </ul>
              </details>
            </>
          )}
          {v.liczbaSlupkow !== null && v.liczbaPaneliWRzedzie !== null && (
            <p className="text-small">{t("UI-OGRPV-ILOSCI", { dlugosc: s.dlugoscOgrodzeniaM, slupki: v.liczbaSlupkow, panele: v.liczbaPaneliWRzedzie })}</p>
          )}
          <p className="text-small text-muted-foreground">{t("UI-OGRPV-PODSYPKA")}</p>
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
