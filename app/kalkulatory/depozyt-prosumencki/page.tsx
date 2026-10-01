"use client"

import { useMemo } from "react"
import { calculateDepozyt } from "@/lib/core/modules/siec/depozyt-prosumencki/calculator"
import type { SystemCeny } from "@/lib/core/modules/siec/depozyt-prosumencki/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { liczba, liczbaLubNull, poziomWerdyktu, stawkiDoPomocy, zl } from "@/components/siec/wspolne"
import { useTranslate } from "@/lib/i18n/language-context"

type Stan = {
  miesiac: string
  energia: string
  cena: string
  system: SystemCeny
  wykorzystano: string
  pelnyKoszt: string
}

const POCZATKOWY: Stan = { miesiac: "2026-06", energia: "", cena: "", system: "rce", wykorzystano: "", pelnyKoszt: "" }

export default function DepozytProsumenckiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("siec-depozyt-prosumencki", POCZATKOWY)
  const ustaw = <K extends keyof Stan>(pole: K, v: Stan[K]) => setStan((p) => ({ ...p, [pole]: v }))

  const result = useMemo(
    () =>
      calculateDepozyt({
        dataMiesiaca: /^\d{4}-\d{2}$/.test(stan.miesiac) ? `${stan.miesiac}-15` : "0000-01-01",
        energiaOddanaKwh: liczba(stan.energia),
        cenaRynkowaZlMwh: liczba(stan.cena),
        systemCeny: stan.system,
        wykorzystanoZl: liczbaLubNull(stan.wykorzystano),
        pelnyKosztKwhBruttoZl: liczbaLubNull(stan.pelnyKoszt),
      }),
    [stan],
  )
  const poziom = poziomWerdyktu(result.status, result.warnings)
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/depozyt-prosumencki" />
      <NaglowekEkranu
        tytul={t("UI-DEPPRO-NET-METERING-NET")}
        ekran="depozyt-prosumencki"
        wynik={result}
        parametry={stawkiDoPomocy()}
      >
        {t("UI-DEPPRO-ROZLICZANA-ENERGIA-ODDANA")}
      </NaglowekEkranu>

      <SekcjaAkordeon tytul={t("UI-DEPPRO-DWA-SYSTEMY-ROZLICZEN")}>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-small">
          <li>
            <strong>{t("UI-DEPPRO-NET-METERING-OPUSTY")}</strong> {t("UI-DEPPRO-MIKROINSTALACJE-WNIOSKAMI-SP")}
          </li>
          <li>
            <strong>{t("UI-DEPPRO-NET-BILLING")}</strong> {t("UI-DEPPRO-MIKROINSTALACJE-2022-WARTOSC")}
          </li>
          <li>
            {t("UI-DEPPRO-NIEWYKORZYSTANY-DEPOZYT-ZWRO")}
          </li>
        </ul>
      </SekcjaAkordeon>
      <SekcjaAkordeon tytul={t("UI-DEPPRO-DECYZJE-JEDNOKIERUNKOWE-ODEJ")}>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-small">
          <li>{t("UI-DEPPRO-PRZEJSCIE-RCEM-RCE")}</li>
          <li>{t("UI-DEPPRO-ROZWIAZANIE-UMOWY-KONCZY")}</li>
          <li>
            {t("UI-DEPPRO-STARY-PROSUMENT-NET")}
          </li>
          <li>
            {t("UI-DEPPRO-DOTACJA-MAGAZYN-ODLACZENIE")}
          </li>
        </ul>
      </SekcjaAkordeon>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-medium">{t("UI-DEPPRO-POLICZ-DEPOZYT-JEDNEGO")}</h2>
        <Pole
          label={t("UI-DEPPRO-MIESIAC-WPROWADZENIA-ENERGII")}
          type="month"
          value={stan.miesiac}
          onChange={(e) => ustaw("miesiac", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="miesiac" />}
        />
        <Pole
          label={t("UI-DEPPRO-ENERGIA-ODDANA-SIECI")}
          unit="kWh"
          type="number"
          inputMode="decimal"
          value={stan.energia}
          onChange={(e) => ustaw("energia", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="energia" />}
        />
        <PoleSelect
          label={t("UI-DEPPRO-CENA-ROZLICZENIA")}
          value={stan.system}
          onChange={(e) => ustaw("system", e.target.value as SystemCeny)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="cena" params={stawkiDoPomocy()} />}
        >
          <option value="rce">{t("UI-DEPPRO-RCE-CENA-GODZINOWA")}</option>
          <option value="rcem">{t("UI-DEPPRO-RCEM-CENA-MIESIECZNA")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-DEPPRO-SREDNIA-CENA-TEJ")}
          unit={t("UI-DEPPRO-MWH")}
          type="number"
          inputMode="decimal"
          value={stan.cena}
          onChange={(e) => ustaw("cena", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="sredniaCena" />}
        />
        <Pole
          label={t("UI-DEPPRO-ILE-TEGO-DEPOZYTU")}
          unit={t("UI-J-ZL")}
          type="number"
          inputMode="decimal"
          value={stan.wykorzystano}
          onChange={(e) => ustaw("wykorzystano", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="wykorzystanie" />}
        />
        <Pole
          label={t("UI-DEPPRO-PELNY-KOSZT-KWH")}
          unit={t("UI-J-ZL-KWH")}
          type="number"
          inputMode="decimal"
          value={stan.pelnyKoszt}
          onChange={(e) => ustaw("pelnyKoszt", e.target.value)}
          pomoc={<PomocPola ekran="depozyt-prosumencki" pole="pelnyKoszt" />}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-DEPPRO-WPISZ-ENERGIE-CENE")}</p>
      ) : result.status === "INVALID_INPUT" || result.status === "OUT_OF_SCOPE" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-DEPPRO-POLICZYC")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={poziom ?? "uwaga"} etykieta={t("UI-DEPPRO-DEPOZYT-PROSUMENCKI-TEGO")}>
          <WynikGlowny>{zl(v.depozytZl, 2)}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-DEPPRO-WARTOSC-ENERGII-ZWROT", { wartoscEnergiiZl: zl(v.wartoscEnergiiZl, 2), maksZwrotZl: zl(v.maksZwrotZl, 2) })}
          </p>
          {v.niewykorzystanoZl !== null && (
            <p className="mt-1 text-small">
              {t("UI-DEPPRO-NIEWYKORZYSTANE-ZWROT-PRZEPA", { niewykorzystanoZl: zl(v.niewykorzystanoZl, 2), p: zl(v.zwrotZl ?? 0, 2), p2: zl(v.umorzenieZl ?? 0, 2) })}
            </p>
          )}
          {v.wspolczynnikBilansowania !== null && (
            <p className="mt-1 text-small">
              {t("UI-DEPPRO-KWH-ODDANA-WART", { p: (v.wspolczynnikBilansowania * 100).toLocaleString("pl-PL", { maximumFractionDigits: 0 }) })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
