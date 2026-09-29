"use client"

import { useMemo } from "react"
import { calculateKociolElektryczny } from "@/lib/core/modules/ogrzewanie/kociol-elektryczny/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  zapotrzebowanieCieplneKwh: string
  copPompy: string
  cenaZaKwhZl: string
}

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieCieplneKwh: "",
  copPompy: "",
  cenaZaKwhZl: "",
}

export default function KociolElektrycznyPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("kociol-elektryczny", STAN_POCZATKOWY)
  const { zapotrzebowanieCieplneKwh, copPompy, cenaZaKwhZl } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setZapotrzebowanieCieplneKwh = (a: string | ((p: string) => string)) => setPole("zapotrzebowanieCieplneKwh", a)
  const setCopPompy = (a: string | ((p: string) => string)) => setPole("copPompy", a)
  const setCenaZaKwhZl = (a: string | ((p: string) => string)) => setPole("cenaZaKwhZl", a)

  const result = useMemo(
    () =>
      calculateKociolElektryczny({
        zapotrzebowanieCieplneKwh: zapotrzebowanieCieplneKwh === "" ? 0 : Number(zapotrzebowanieCieplneKwh),
        copPompy: copPompy === "" ? 0 : Number(copPompy),
        cenaZaKwhZl: cenaZaKwhZl === "" ? 0 : Number(cenaZaKwhZl),
      }),
    [zapotrzebowanieCieplneKwh, copPompy, cenaZaKwhZl],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/kociol-elektryczny" />
      <NaglowekEkranu tytul="Kocioł elektryczny vs pompa ciepła" ekran="kociol-elektryczny" wzor={result.formula}>
        Kocioł elektryczny ma sprawność blisko 100%, ale to nie to samo co tanie ogrzewanie —
        pompa ciepła nie produkuje ciepła z prądu, tylko przenosi je z zewnątrz, więc zużywa
        kilka razy mniej. Moduł 6, ekran dodatkowy (dawne 5.33).
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Zapotrzebowanie na ciepło do pokrycia"
          unit="kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={zapotrzebowanieCieplneKwh}
          onChange={(e) => setZapotrzebowanieCieplneKwh(e.target.value)}
          pomoc={<PomocPola ekran="kociol-elektryczny" pole="zapotrzebowanie" />}
        />
        <Pole
          label="COP pompy ciepła"
          unit="-"
          type="number"
          inputMode="decimal"
          min={0}
          value={copPompy}
          onChange={(e) => setCopPompy(e.target.value)}
          pomoc={<PomocPola ekran="kociol-elektryczny" pole="cop" />}
        />
        <Pole
          label="Cena energii elektrycznej"
          unit="zł/kWh"
          type="number"
          inputMode="decimal"
          min={0}
          value={cenaZaKwhZl}
          onChange={(e) => setCenaZaKwhZl(e.target.value)}
          pomoc={<PomocPola ekran="kociol-elektryczny" pole="cena" />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Oszczędność z pompy ciepła">
          <WynikGlowny>{result.value.oszczednoscZl.toFixed(2)} zł</WynikGlowny>
          <p className="mt-2 text-small">
            Pompa: {result.value.energiaPompyKwh.toFixed(1)} kWh ({result.value.kosztPompyZl.toFixed(2)} zł) ·
            kocioł: {result.value.energiaKotlaKwh.toFixed(1)} kWh ({result.value.kosztKotlaZl.toFixed(2)} zł) ·
            kocioł zużywa {result.value.mnoznikZuzycia.toFixed(1)}× więcej prądu.
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
