"use client"

import type { CalcResult } from "@/lib/core/calc-result"
import type { ChecklistaChemiiResult } from "@/lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/calculator"
import type { ChecklistaChemiiInput, ChemiaChecklisty } from "@/lib/core/modules/kalkulator-mobilny/bezpieczenstwo-kamper/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { StanPusty } from "@/components/ui/stany"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { chemia: ChemiaChecklisty | ""; potwierdzoneIds: string[] }

const STAN_POCZATKOWY: FormularzStan = { chemia: "", potwierdzoneIds: [] }

/** Checklist screen body shared by M12/E22 and M12/E36: chemistry select + items for that chemistry + verdict. */
export function EkranChecklistyChemii({
  kluczSzkicu,
  oblicz,
  etykietaGotowe,
}: {
  kluczSzkicu: string
  oblicz: (input: ChecklistaChemiiInput) => CalcResult<ChecklistaChemiiResult>
  etykietaGotowe: string
}) {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>(kluczSzkicu, STAN_POCZATKOWY)
  const result = oblicz({ chemia: stan.chemia === "" ? null : stan.chemia, potwierdzoneIds: stan.potwierdzoneIds })
  const { pozycje, potwierdzone, razem } = result.value
  const widoczneIds = stan.potwierdzoneIds.filter((id) => pozycje.some((p) => p.id === id))
  const maOstrzezenie = result.warnings.some((w) => w.level !== "info")
  const maTwardyStop = result.warnings.some((w) => w.level === "critical")

  function toggle(id: string) {
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: prev.potwierdzoneIds.includes(id) ? prev.potwierdzoneIds.filter((x) => x !== id) : [...prev.potwierdzoneIds, id],
    }))
  }

  return (
    <>
      <PoleSelect
        label={t("UI-EKRCHECHE-TYP-AKUMULATORA")}
        value={stan.chemia}
        onChange={(e) => setStan((prev) => ({ ...prev, chemia: e.target.value as FormularzStan["chemia"] }))}
        pomoc={<PomocPola ekran="checklista-chemii" pole="typ" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        <option value="AGM">{t("UI-EKRCHECHE-AGM-VRLA-SZCZELNY")}</option>
        <option value="kwasowy">{t("UI-EKRCHECHE-KWASOWY-ZALEWOWY")}</option>
        <option value="LiFePO4">{t("UI-EKRCHECHE-LIFEPO4")}</option>
      </PoleSelect>

      {stan.chemia !== "" && (
        <ListaChecklist
          items={pozycje}
          potwierdzoneIds={widoczneIds}
          onToggle={toggle}
          renderLabel={(item) => (
            <>
              <span className="block font-medium">{item.element}</span>
              {item.uwaga !== "—" && <span className="block text-muted-foreground">{item.uwaga}</span>}
            </>
          )}
        />
      )}

      {stan.chemia === "" ? (
        <p className="text-small text-muted-foreground">{t("UI-EKRCHECHE-WYBIERZ-TYP-AKUMULATORA")}</p>
      ) : result.status === "VALID" && !maOstrzezenie ? (
        <WerdyktPanel poziom="ok" etykieta={etykietaGotowe}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : maOstrzezenie ? (
        <WerdyktPanel poziom={maTwardyStop ? "blad" : "uwaga"} etykieta={t("UI-EKRCHECHE-POTWIERDZONO", { potwierdzone, razem })}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <StanPusty tytul={t("UI-EKRCHECHE-POTWIERDZONO-POZYCJI", { potwierdzone, razem })} />
      )}
    </>
  )
}
