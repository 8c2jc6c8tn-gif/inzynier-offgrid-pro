"use client"

import { useMemo } from "react"
import { calculateMixingRownolegle } from "@/lib/core/modules/baterie/mixing-rownolegle/calculator"
import { PROG_ROZNICY_NAPIEC_V } from "@/lib/core/modules/baterie/mixing-rownolegle/constants"
import { BATTERY_TECHNOLOGIES } from "@/lib/core/modules/baterie/porownanie-technologii/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  chemia1: string
  chemia2: string
  napiecieNominalneV1: string
  napiecieNominalneV2: string
  rezystancjaWewnetrznaMOhm1: string
  rezystancjaWewnetrznaMOhm2: string
}

const STAN_POCZATKOWY: FormularzStan = {
  chemia1: "",
  chemia2: "",
  napiecieNominalneV1: "",
  napiecieNominalneV2: "",
  rezystancjaWewnetrznaMOhm1: "",
  rezystancjaWewnetrznaMOhm2: "",
}

export default function MixingRownoleglePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("mixing-rownolegle", STAN_POCZATKOWY)
  const {
    chemia1,
    chemia2,
    napiecieNominalneV1,
    napiecieNominalneV2,
    rezystancjaWewnetrznaMOhm1,
    rezystancjaWewnetrznaMOhm2,
  } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setChemia1 = (a: string | ((p: string) => string)) => setPole("chemia1", a)
  const setChemia2 = (a: string | ((p: string) => string)) => setPole("chemia2", a)
  const setNapiecieNominalneV1 = (a: string | ((p: string) => string)) => setPole("napiecieNominalneV1", a)
  const setNapiecieNominalneV2 = (a: string | ((p: string) => string)) => setPole("napiecieNominalneV2", a)
  const setRezystancjaWewnetrznaMOhm1 = (a: string | ((p: string) => string)) => setPole("rezystancjaWewnetrznaMOhm1", a)
  const setRezystancjaWewnetrznaMOhm2 = (a: string | ((p: string) => string)) => setPole("rezystancjaWewnetrznaMOhm2", a)

  const result = useMemo(
    () =>
      calculateMixingRownolegle({
        chemia1,
        chemia2,
        napiecieNominalneV1: napiecieNominalneV1 === "" ? 0 : Number(napiecieNominalneV1),
        napiecieNominalneV2: napiecieNominalneV2 === "" ? 0 : Number(napiecieNominalneV2),
        rezystancjaWewnetrznaMOhm1: rezystancjaWewnetrznaMOhm1 === "" ? 0 : Number(rezystancjaWewnetrznaMOhm1),
        rezystancjaWewnetrznaMOhm2: rezystancjaWewnetrznaMOhm2 === "" ? 0 : Number(rezystancjaWewnetrznaMOhm2),
      }),
    [chemia1, chemia2, napiecieNominalneV1, napiecieNominalneV2, rezystancjaWewnetrznaMOhm1, rezystancjaWewnetrznaMOhm2],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const werdykt =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : hasCritical
          ? "red"
          : result.status === "VALID_WITH_WARNINGS"
            ? "yellow"
            : "green"

  const werdyktPoziom: Record<Exclude<typeof werdykt, "incomplete">, WerdyktPoziom> = {
    invalid: "blad",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const werdyktEtykieta: Record<Exclude<typeof werdykt, "incomplete">, string> = {
    invalid: "Nie da się ocenić — sprawdź wpisane dane",
    red: "Zabronione",
    yellow: "Dopuszczalne",
    green: "Bezpieczne do połączenia",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/mixing-rownolegle" />
      <NaglowekEkranu tytul="Łączenie równoległe różnych baterii (Mixing)">
        To jak zaprzęgnięcie konia pociągowego z kucykiem do tego samego wozu — jeden ciągnie
        więcej i szybciej się wykończy. Moduł 4, Ekran 18.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <p className="text-small font-medium">Bateria 1</p>
        <PoleSelect label="Chemia ogniw" value={chemia1} onChange={(e) => setChemia1(e.target.value)}>
          <option value="">— wybierz —</option>
          {BATTERY_TECHNOLOGIES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </PoleSelect>
        <Pole
          label="Napięcie nominalne"
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieNominalneV1}
          onChange={(e) => setNapiecieNominalneV1(e.target.value)}
        />
        <Pole
          label="Rezystancja wewnętrzna"
          unit="mΩ"
          type="number"
          inputMode="decimal"
          value={rezystancjaWewnetrznaMOhm1}
          onChange={(e) => setRezystancjaWewnetrznaMOhm1(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <p className="text-small font-medium">Bateria 2</p>
        <PoleSelect label="Chemia ogniw" value={chemia2} onChange={(e) => setChemia2(e.target.value)}>
          <option value="">— wybierz —</option>
          {BATTERY_TECHNOLOGIES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </PoleSelect>
        <Pole
          label="Napięcie nominalne"
          unit="V"
          type="number"
          inputMode="decimal"
          value={napiecieNominalneV2}
          onChange={(e) => setNapiecieNominalneV2(e.target.value)}
        />
        <Pole
          label="Rezystancja wewnętrzna"
          unit="mΩ"
          type="number"
          inputMode="decimal"
          value={rezystancjaWewnetrznaMOhm2}
          onChange={(e) => setRezystancjaWewnetrznaMOhm2(e.target.value)}
        />
      </div>

      {werdykt === "incomplete" ? (
        <p className="text-small text-muted-foreground">
          Wypełnij dane obu baterii, żeby zobaczyć ocenę połączenia równoległego.
        </p>
      ) : (
        <WerdyktPanel poziom={werdyktPoziom[werdykt]} etykieta={werdyktEtykieta[werdykt]}>
          {werdykt !== "invalid" && (
            <>
              <WynikGlowny>
                {result.value.iWyrownawczyA.toLocaleString("pl-PL", { maximumFractionDigits: 1 })} A
              </WynikGlowny>
              <p className="mt-1 text-small">
                Prąd wyrównawczy w chwili połączenia, przy różnicy napięć{" "}
                {result.value.roznicaNapiecV.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} V
                (próg: {PROG_ROZNICY_NAPIEC_V} V).
              </p>
              <p className="mt-2 text-small">
                Udział w prądzie obciążenia: bateria 1 —{" "}
                {result.value.udzialPradu1Pct.toLocaleString("pl-PL", { maximumFractionDigits: 0 })}%, bateria 2 —{" "}
                {result.value.udzialPradu2Pct.toLocaleString("pl-PL", { maximumFractionDigits: 0 })}% (bateria o
                niższej rezystancji przejmuje większość prądu).
              </p>
            </>
          )}
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-2 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
