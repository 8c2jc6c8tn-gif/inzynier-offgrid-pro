"use client"

import { useMemo } from "react"
import { calculateMikropeknieciaTermiczne } from "@/lib/core/modules/pv/mikropekniecia-termiczne/calculator"
import {
  CZAS_DO_MIKROPEKNIEC_LATA,
  ODSTEP_DYLATACYJNY_MIN_MM,
  SCHLODZENIE_PRZY_DESZCZU_C,
  TEMPERATURA_PANELU_MAX_C,
  TEMPERATURA_PANELU_MIN_C,
} from "@/lib/core/modules/pv/mikropekniecia-termiczne/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { MigawkaBox } from "@/components/wzorce/migawka-box"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  odstepDylatacyjnyMm: string
  podkladkiEpdm: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  odstepDylatacyjnyMm: "",
  podkladkiEpdm: false,
}

export default function MikropeknieciaTermicznePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("mikropekniecia-termiczne", STAN_POCZATKOWY)
  const { odstepDylatacyjnyMm, podkladkiEpdm } = stan

  const result = useMemo(
    () =>
      calculateMikropeknieciaTermiczne({
        odstepDylatacyjnyMm: odstepDylatacyjnyMm === "" ? null : Number(odstepDylatacyjnyMm),
        podkladkiEpdm,
      }),
    [odstepDylatacyjnyMm, podkladkiEpdm],
  )

  const poziom: WerdyktPoziom = result.value.montazSztywny ? "uwaga" : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/mikropekniecia-termiczne" />
      <NaglowekEkranu tytul="Mikropęknięcia termiczne">
        Panele nagrzewają się w słońcu do {TEMPERATURA_PANELU_MIN_C}–{TEMPERATURA_PANELU_MAX_C}°C, a przy
        nagłym deszczu chłodzą się o {SCHLODZENIE_PRZY_DESZCZU_C}°C w kilka minut. Aluminium ramy i krzem
        ogniw rozszerzają się inaczej — przy sztywnym montażu bez dylatacji naprężenia prowadzą do
        mikropęknięć w ciągu ok. {CZAS_DO_MIKROPEKNIEC_LATA} lat. Moduł 3, Ekran 7.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <Pole
          label="Odstęp dylatacyjny między panelami"
          unit="mm"
          type="number"
          inputMode="decimal"
          min={0}
          value={odstepDylatacyjnyMm}
          onChange={(e) => setStan((prev) => ({ ...prev, odstepDylatacyjnyMm: e.target.value }))}
          hint={`Luz między sąsiednimi panelami w rzędzie. Zalecane minimum: ${ODSTEP_DYLATACYJNY_MIN_MM} mm. 0 = montaż na styk.`}
        />
        <PoleCheckbox
          id="podkladki-epdm"
          checked={podkladkiEpdm}
          onChange={(e) => setStan((prev) => ({ ...prev, podkladkiEpdm: e.target.checked }))}
          label="Podkładki EPDM (gumowe) w mocowaniach"
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się ocenić — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wpisz odstęp dylatacyjny, żeby zobaczyć ocenę montażu.</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={result.value.montazSztywny ? "Montaż sztywny" : "Montaż elastyczny"}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          {result.value.montazSztywny && (
            <p className="mt-2 text-small text-muted-foreground">
              Zalecane: podkładki EPDM w każdym mocowaniu i odstęp dylatacyjny min. {ODSTEP_DYLATACYJNY_MIN_MM} mm.
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      <MigawkaBox>
        „Materiały »oddychają« przy zmianach temperatury inaczej — trzeba im dać trochę luzu, inaczej
        pękają od środka, niewidocznie.”
      </MigawkaBox>
    </main>
  )
}
