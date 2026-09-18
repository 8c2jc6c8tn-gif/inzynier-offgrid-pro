"use client"

import { useMemo, useState } from "react"
import { calculateMixingRownolegle } from "@/lib/core/modules/baterie/mixing-rownolegle/calculator"
import { PROG_ROZNICY_NAPIEC_V } from "@/lib/core/modules/baterie/mixing-rownolegle/constants"
import { BATTERY_TECHNOLOGIES } from "@/lib/core/modules/baterie/porownanie-technologii/constants"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

export default function MixingRownoleglePage() {
  const t = useTranslate()
  const [chemia1, setChemia1] = useState("")
  const [chemia2, setChemia2] = useState("")
  const [napiecieNominalneV1, setNapiecieNominalneV1] = useState("")
  const [napiecieNominalneV2, setNapiecieNominalneV2] = useState("")
  const [rezystancjaWewnetrznaMOhm1, setRezystancjaWewnetrznaMOhm1] = useState("")
  const [rezystancjaWewnetrznaMOhm2, setRezystancjaWewnetrznaMOhm2] = useState("")

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
