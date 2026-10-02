"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { TrybDachPlaski } from "./_components/tryb-dach-plaski"
import { TrybPionowy } from "./_components/tryb-pionowy"
import { TrybPowierzchnie } from "./_components/tryb-powierzchnie"
import { TrybRegulowany } from "./_components/tryb-regulowany"
import { TrybWiata } from "./_components/tryb-wiata"
import { useTranslate } from "@/lib/i18n/language-context"

type Tryb = "" | "pionowy" | "dach-plaski" | "dach-skosny" | "wielopolaciowy" | "wiata" | "regulowany"

const TRYBY: { id: Exclude<Tryb, "">; label: string }[] = [
  { id: "dach-skosny", label: "UI-TYPMON-DACH-SKOSNY-JEDNA" },
  { id: "wielopolaciowy", label: "UI-TYPMON-KILKA-POWIERZCHNI-DACH" },
  { id: "dach-plaski", label: "UI-TYPMON-DACH-PLASKI-ALBO" },
  { id: "regulowany", label: "UI-TYPMON-STELAZ-NAZIEMNY-REGULACJA" },
  { id: "pionowy", label: "UI-TYPMON-PIONOWO-OGRODZENIE-SCIANA" },
  { id: "wiata", label: "UI-TYPMON-WIATA-CARPORT" },
]

/** Tryby z nasłonecznieniem PVGIS — pokazują sekcję danych lokalizacji. */
const Z_NASLONECZNIENIEM: Tryb[] = ["pionowy", "dach-skosny", "wielopolaciowy", "regulowany"]

/**
 * Moduł 3, Ekran 2 — "Typ montażu" (dawne 2.4, 2.5, 2.6, 2.7, 2.9; Wzorzec A z przełącznikiem trybu).
 * Każdy tryb to osobny komponent z własnym szkicem (osobny klucz), żeby przełączanie nie gubiło danych.
 */
export default function TypMontazuPage() {
  const t = useTranslate()
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<{ tryb: Tryb }>("typ-montazu", { tryb: "" })

  if (!wczytano) return <StanLadowania linie={6} />

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/typ-montazu" />
      <NaglowekEkranu tytul={t("UI-TYPMON-TYP-MONTAZU")} ekran="typ-montazu">
        {t("UI-TYPMON-GDZIE-STANA-PANELE")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-TYPMON-STANA-PANELE")}
        value={stan.tryb}
        onChange={(e) => setStan({ tryb: e.target.value as Tryb })}
        pomoc={<PomocPola ekran="typ-montazu" pole="tryb" />}
      >
        <option value="">{t("UI-WYBIERZ")}</option>
        {TRYBY.map((tryb) => (
          <option key={tryb.id} value={tryb.id}>
            {t(tryb.label)}
          </option>
        ))}
      </PoleSelect>

      {Z_NASLONECZNIENIEM.includes(stan.tryb) && <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />}

      {stan.tryb === "pionowy" && <TrybPionowy />}
      {stan.tryb === "dach-plaski" && <TrybDachPlaski />}
      {stan.tryb === "dach-skosny" && <TrybPowierzchnie tylkoJednaPolac />}
      {stan.tryb === "wielopolaciowy" && <TrybPowierzchnie tylkoJednaPolac={false} />}
      {stan.tryb === "wiata" && <TrybWiata />}
      {stan.tryb === "regulowany" && <TrybRegulowany />}

      
    </main>
  )
}
