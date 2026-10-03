"use client"

import { useMemo } from "react"
import { calculateProfilAstronomiczny } from "@/lib/core/modules/zapotrzebowanie/profil-astronomiczny/calculator"
import {
  DEKLINACJA_AMPLITUDA_DEG,
  DEKLINACJA_PRZESUNIECIE_DNI,
  DNI_W_ROKU,
} from "@/lib/core/modules/zapotrzebowanie/profil-astronomiczny/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  szerokoscGeograficzna: string
  dzienRoku: string
  mocOdbiornikaNocnegoW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  szerokoscGeograficzna: "",
  dzienRoku: "",
  mocOdbiornikaNocnegoW: "",
}

export default function ProfilAstronomicznyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("profil-astronomiczny", STAN_POCZATKOWY)
  const { szerokoscGeograficzna, dzienRoku, mocOdbiornikaNocnegoW } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setSzerokoscGeograficzna = (a: string | ((p: string) => string)) => setPole("szerokoscGeograficzna", a)
  const setDzienRoku = (a: string | ((p: string) => string)) => setPole("dzienRoku", a)
  const setMocOdbiornikaNocnegoW = (a: string | ((p: string) => string)) => setPole("mocOdbiornikaNocnegoW", a)

  const result = useMemo(
    () =>
      calculateProfilAstronomiczny({
        szerokoscGeograficzna: szerokoscGeograficzna === "" ? null : Number(szerokoscGeograficzna),
        dzienRoku: dzienRoku === "" ? 0 : Number(dzienRoku),
        mocOdbiornikaNocnegoW: mocOdbiornikaNocnegoW === "" ? 0 : Number(mocOdbiornikaNocnegoW),
      }),
    [szerokoscGeograficzna, dzienRoku, mocOdbiornikaNocnegoW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/profil-astronomiczny" />
      <NaglowekEkranu
        tytul={t("UI-PROAST-PROFIL-DOBOWY-ASTRONOMICZNY")}
        ekran="profil-astronomiczny"
        wynik={result}
        parametry={{
          amplituda: DEKLINACJA_AMPLITUDA_DEG,
          przesuniecie: DEKLINACJA_PRZESUNIECIE_DNI,
          dniRoku: DNI_W_ROKU,
        }}
      >
        {t("UI-PROAST-PROFIL-DOBOWY-TYLKO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-PROAST-SZEROKOSC-GEOGRAFICZNA")}
          unit="°"
          type="number"
          inputMode="decimal"
          min={-90}
          max={90}
          value={szerokoscGeograficzna}
          onChange={(e) => setSzerokoscGeograficzna(e.target.value)}
          pomoc={<PomocPola ekran="profil-astronomiczny" pole="szerokosc" />}
        />
        <Pole
          label={t("UI-PROAST-DZIEN-ROKU")}
          unit="1-365"
          type="number"
          inputMode="numeric"
          min={1}
          max={365}
          value={dzienRoku}
          onChange={(e) => setDzienRoku(e.target.value)}
          pomoc={<PomocPola ekran="profil-astronomiczny" pole="dzienRoku" />}
        />
        <Pole
          label={t("UI-PROAST-MOC-ODBIORNIKA-DZIALAJACEGO")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={mocOdbiornikaNocnegoW}
          onChange={(e) => setMocOdbiornikaNocnegoW(e.target.value)}
          pomoc={<PomocPola ekran="profil-astronomiczny" pole="moc" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PROAST-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-PROAST-WYPELNIJ-SZEROKOSC-GEOGRAFIC")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-PROAST-DLUGOSC-DNIA-NOCY")}>
          <WynikGlowny>
            {t("UI-PROAST-DNIA-NOCY", { dlugoscDniaH: result.value.dlugoscDniaH.toFixed(1), dlugoscNocyH: result.value.dlugoscNocyH.toFixed(1) })}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
