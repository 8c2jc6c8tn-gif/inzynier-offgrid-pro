"use client"

import { useMemo } from "react"
import { calculateDogrzewaniePaliwemStalym } from "@/lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/calculator"
import { MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM } from "@/lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/constants"
import type { PaliwoStale } from "@/lib/core/modules/bezpieczenstwo/dogrzewanie-paliwem-stalym/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  typPaliwa: PaliwoStale | ""
  odlegloscOdMaterialowPalnychCm: string
  maNawiewPowietrzaDoSpalania: boolean
  maCzujnikCo: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  typPaliwa: "",
  odlegloscOdMaterialowPalnychCm: "",
  maNawiewPowietrzaDoSpalania: false,
  maCzujnikCo: false,
}

export default function DogrzewaniePaliwemStalymPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dogrzewanie-paliwem-stalym", STAN_POCZATKOWY)
  const { typPaliwa, odlegloscOdMaterialowPalnychCm, maNawiewPowietrzaDoSpalania, maCzujnikCo } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setTypPaliwa = (a: (PaliwoStale | "") | ((p: PaliwoStale | "") => PaliwoStale | "")) => setPole("typPaliwa", a)
  const setOdlegloscOdMaterialowPalnychCm = (a: string | ((p: string) => string)) => setPole("odlegloscOdMaterialowPalnychCm", a)
  const setMaNawiewPowietrzaDoSpalania = (a: boolean | ((p: boolean) => boolean)) => setPole("maNawiewPowietrzaDoSpalania", a)
  const setMaCzujnikCo = (a: boolean | ((p: boolean) => boolean)) => setPole("maCzujnikCo", a)

  const result = useMemo(
    () =>
      calculateDogrzewaniePaliwemStalym({
        typPaliwa: typPaliwa === "" ? null : typPaliwa,
        odlegloscOdMaterialowPalnychCm:
          odlegloscOdMaterialowPalnychCm === "" ? 0 : Number(odlegloscOdMaterialowPalnychCm),
        maNawiewPowietrzaDoSpalania,
        maCzujnikCo,
      }),
    [typPaliwa, odlegloscOdMaterialowPalnychCm, maNawiewPowietrzaDoSpalania, maCzujnikCo],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical") && result.status !== "INVALID_INPUT"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dogrzewanie-paliwem-stalym" />
      <NaglowekEkranu
        tytul="Bezpieczeństwo pożarowe — dogrzewanie paliwem stałym"
        ekran="dogrzewanie-paliwem-stalym"
        parametry={{ minOdleglosc: MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM }}
        wynik={result}
      >
        Otwarty ogień w domu to realna odpowiedzialność — spalanie zużywa tlen z pomieszczenia i
        produkuje czad, który nie ma zapachu i zabija we śnie. Moduł 8, Ekran 2.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Typ paliwa"
          value={typPaliwa}
          onChange={(e) => setTypPaliwa(e.target.value as PaliwoStale)}
          pomoc={<PomocPola ekran="dogrzewanie-paliwem-stalym" pole="paliwo" />}
        >
          <option value="">— wybierz —</option>
          <option value="drewno">Drewno</option>
          <option value="pellet">Pellet</option>
          <option value="wegiel">Węgiel</option>
        </PoleSelect>
        <Pole
          label="Odległość od materiałów palnych"
          unit="cm"
          type="number"
          inputMode="decimal"
          min={0}
          value={odlegloscOdMaterialowPalnychCm}
          onChange={(e) => setOdlegloscOdMaterialowPalnychCm(e.target.value)}
          pomoc={<PomocPola ekran="dogrzewanie-paliwem-stalym" pole="odleglosc" params={{ minOdleglosc: MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM }} />}
        />
        <PoleCheckbox
          id="ma-nawiew"
          label="Jest osobny nawiew powietrza do spalania"
          checked={maNawiewPowietrzaDoSpalania}
          onChange={(e) => setMaNawiewPowietrzaDoSpalania(e.target.checked)}
        />
        <PoleCheckbox
          id="ma-czujnik-co"
          label="Jest czujnik czadu (CO) w pomieszczeniu"
          checked={maCzujnikCo}
          onChange={(e) => setMaCzujnikCo(e.target.checked)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom={hasCritical ? "blad" : "ok"} etykieta={hasCritical ? "Wykryto braki bezpieczeństwa" : "Instalacja zgodna z minimalnymi wymaganiami"}>
          <WynikGlowny>{result.value.marginesOdlegloscCm >= 0 ? "+" : ""}{result.value.marginesOdlegloscCm.toFixed(0)} cm</WynikGlowny>
          <p className="mt-2 text-small">Margines względem minimalnej odległości (40 cm).</p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
