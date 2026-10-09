"use client"

import { useState } from "react"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { znajdzUrzadzeniePv, type RodzajUrzadzeniaPv } from "@/lib/core/dane/katalog-urzadzen-pv"
import { modeleUrzadzen, producenciUrzadzen, RODZAJE_URZADZEN_PV } from "@/lib/core/dane/katalog-urzadzen-pv/wybor"
import { useTranslate } from "@/lib/i18n/language-context"

const KLUCZ_RODZAJU: Record<RodzajUrzadzeniaPv, string> = {
  "regulator-mppt": "UI-DOPTABFAL-RODZAJ-REGULATOR-MPPT",
  "falownik-wyspowy": "UI-DOPTABFAL-RODZAJ-FALOWNIK-WYSPOWY",
  "falownik-hybrydowy": "UI-DOPTABFAL-RODZAJ-FALOWNIK-HYBRYDOWY",
  "mikroinwerter-sieciowy": "UI-DOPTABFAL-RODZAJ-MIKROINWERTER-SIECIOWY",
}

/**
 * Wybór falownika/regulatora z katalogu krok po kroku (rodzaj → producent → model). Wybór modelu wstawia dane urządzenia (`onWybierz`);
 * link do źródła i data odczytu pokazują, skąd liczby. Rodzaj i producenta pamięta komponent; gdy urządzenie już pochodzi z katalogu,
 * pola startują od jego wartości.
 */
export function WyborUrzadzeniaPv(p: { urzadzenieId: string; onWybierz: (id: string) => void }) {
  const t = useTranslate()
  const obecne = znajdzUrzadzeniePv(p.urzadzenieId)
  // `null` = user has not touched the field yet: then it shows the value of the device already taken from the catalogue.
  const [rodzajWybrany, setRodzaj] = useState<RodzajUrzadzeniaPv | "" | null>(null)
  const [producentWybrany, setProducent] = useState<string | null>(null)
  const rodzaj = rodzajWybrany ?? obecne?.rodzaj ?? ""
  const producent = producentWybrany ?? (rodzajWybrany === null ? obecne?.producent : undefined) ?? ""
  const producenci = rodzaj ? producenciUrzadzen(rodzaj) : []
  const modele = rodzaj && producent ? modeleUrzadzen(rodzaj, producent) : []
  return (
    <div className="flex flex-col gap-2">
      <p className="text-small font-medium">{t("UI-DOPTABFAL-Z-KATALOGU")}</p>
      <PoleSelect
        label={t("UI-DOPTABFAL-KAT-RODZAJ")}
        value={rodzaj}
        onChange={(e) => {
          setRodzaj(e.target.value as RodzajUrzadzeniaPv | "")
          setProducent("")
        }}
        pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="katalogRodzaj" />}
      >
        <option value="">{t("UI-DOPTABFAL-KAT-WYBIERZ")}</option>
        {RODZAJE_URZADZEN_PV.map((r) => (
          <option key={r} value={r}>
            {t(KLUCZ_RODZAJU[r])}
          </option>
        ))}
      </PoleSelect>
      <PoleSelect
        label={t("UI-DOPTABFAL-KAT-PRODUCENT")}
        value={producent}
        disabled={rodzaj === ""}
        onChange={(e) => setProducent(e.target.value)}
        pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="katalogProducent" />}
      >
        <option value="">{t("UI-DOPTABFAL-KAT-WYBIERZ")}</option>
        {producenci.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </PoleSelect>
      <PoleSelect
        label={t("UI-DOPTABFAL-KAT-MODEL")}
        value={modele.some((x) => x.id === p.urzadzenieId) ? p.urzadzenieId : ""}
        disabled={modele.length === 0}
        onChange={(e) => e.target.value !== "" && p.onWybierz(e.target.value)}
        pomoc={<PomocPola ekran="dopasowanie-tablicy-falownika" pole="katalogModel" />}
      >
        <option value="">{t("UI-DOPTABFAL-KAT-WYBIERZ")}</option>
        {modele.map((x) => (
          <option key={x.id} value={x.id}>
            {x.model}
          </option>
        ))}
      </PoleSelect>
      {obecne && (
        <div className="flex flex-col gap-1 text-small text-muted-foreground">
          <p>{t("UI-DOPTABFAL-KAT-NOTA")}</p>
          {obecne.rodzaj === "mikroinwerter-sieciowy" && <p>{t("UI-DOPTABFAL-KAT-NOTA-MIKRO")}</p>}
          <a href={obecne.zrodloUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {t("UI-DOPTABFAL-KAT-ZRODLO", { data: obecne.dataOdczytu })}
          </a>
        </div>
      )}
    </div>
  )
}
