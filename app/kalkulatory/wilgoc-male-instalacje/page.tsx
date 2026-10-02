"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateWilgocMaleInstalacje } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/calculator"
import {
  IP_ZALECANE_NAMIOT_JACHT,
  IP_ZALECANE_WILGOC,
  MIEJSCA_PODWYZSZONE_RYZYKO,
  OPCJE_IP_MALE_INSTALACJE,
  type ZalecenieWilgoc,
} from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/constants"
import type { MiejsceMalejInstalacji } from "@/lib/core/modules/kalkulator-mobilny/wilgoc-male-instalacje/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  miejsce: MiejsceMalejInstalacji | ""
  narazone: "" | "tak" | "nie"
  ipKod: number
}

const STAN_POCZATKOWY: FormularzStan = { miejsce: "", narazone: "", ipKod: 0 }

const KLUCZE_IP: Record<number, string> = {
  20: "UI-STALE-IP-20",
  54: "UI-STALE-IP-54",
  55: "UI-STALE-IP-55",
  65: "UI-STALE-IP-65",
  66: "UI-STALE-IP-66",
  67: "UI-STALE-IP-67",
  68: "UI-STALE-IP-68",
}

const MIEJSCA: { id: MiejsceMalejInstalacji; label: string }[] = [
  { id: "garaz", label: "UI-WILMALINS-GARAZ" },
  { id: "piwnica", label: "UI-WILMALINS-PIWNICA" },
  { id: "namiot", label: "UI-WILMALINS-NAMIOT" },
  { id: "jacht", label: "UI-WILMALINS-JACHT-LODZ" },
]

/** Lista osłon — brzmienie z Biblii §12.34. */
const OPIS_ZALECENIA: Record<ZalecenieWilgoc, string> = {
  "obudowy-ip": "UI-WILMALINS-OBUDOWY-URZADZEN-ODPOWIEDNIM",
  "puszki-z-uszczelka": "UI-WILMALINS-PUSZKI-ZLACZA-USZCZELKA",
  "przewody-w-peszlu": "UI-WILMALINS-PRZEWODY-PESZLU",
  "osuszacz-pochlaniacz": "UI-WILMALINS-OSUSZACZ-ALBO-POCHLANIACZ",
}

export default function WilgocMaleInstalacjePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("wilgoc-male-instalacje", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateWilgocMaleInstalacje({
        miejsce: stan.miejsce === "" ? null : stan.miejsce,
        narazoneNaWilgoc: stan.narazone === "" ? null : stan.narazone === "tak",
        ipKod: stan.ipKod,
      }),
    [stan],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const { minimalneIp, zalecenia } = result.value
  // Tent/yacht are always treated as exposed to moisture (D44) — the moisture question is not asked there.
  const podwyzszoneRyzyko = (MIEJSCA_PODWYZSZONE_RYZYKO as readonly string[]).includes(stan.miejsce)
  const zalecaneIp = podwyzszoneRyzyko ? `IP${IP_ZALECANE_NAMIOT_JACHT}–IP68` : `IP${IP_ZALECANE_WILGOC}`

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wilgoc-male-instalacje" />
      <NaglowekEkranu
        tytul={t("UI-WILMALINS-ZABEZPIECZENIA-PRZECIWWILGOC")}
        ekran="wilgoc-male-instalacje"
        wynik={result}
      >
        {t("UI-WILMALINS-GARAZ-PIWNICA-NAMIOT")}
      </NaglowekEkranu>
      

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-WILMALINS-GDZIE-STOI-INSTALACJA")}
          value={stan.miejsce}
          onChange={(e) => setStan((prev) => ({ ...prev, miejsce: e.target.value as FormularzStan["miejsce"] }))}
          pomoc={<PomocPola ekran="wilgoc-male-instalacje" pole="miejsce" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {MIEJSCA.map((m) => (
            <option key={m.id} value={m.id}>
              {t(m.label)}
            </option>
          ))}
        </PoleSelect>
        {podwyzszoneRyzyko ? (
          <p className="text-small text-muted-foreground">
            {t("UI-WILMALINS-NAMIOT-JACHT-ZAWSZE")}
          </p>
        ) : (
          <PoleSelect
            label={t("UI-WILMALINS-MIEJSCE-NARAZONE-WILGOC")}
            value={stan.narazone}
            onChange={(e) => setStan((prev) => ({ ...prev, narazone: e.target.value as FormularzStan["narazone"] }))}
            pomoc={<PomocPola ekran="wilgoc-male-instalacje" pole="wilgoc" />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            <option value="tak">{t("UI-TAK-DUZE")}</option>
            <option value="nie">{t("UI-WILMALINS-SUCHO")}</option>
          </PoleSelect>
        )}
        <PoleSelect
          label={t("UI-WILMALINS-STOPIEN-OCHRONY-OBUDOWY")}
          value={stan.ipKod}
          onChange={(e) => setStan((prev) => ({ ...prev, ipKod: Number(e.target.value) }))}
          pomoc={<PomocPola ekran="wilgoc-male-instalacje" pole="ip" />}
        >
          <option value={0}>{t("UI-WYBIERZ")}</option>
          {OPCJE_IP_MALE_INSTALACJE.map((o) => (
            <option key={o.kod} value={o.kod}>
              {KLUCZE_IP[o.kod] ? t(KLUCZE_IP[o.kod]) : o.label}
            </option>
          ))}
        </PoleSelect>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-WILMALINS-WYBIERZ-MIEJSCE-ODPOWIEDZ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={
            hasCritical
              ? t("UI-WILMALINS-OBUDOWA-SLABA-WILGOC")
              : hasWarning
                ? t("UI-WILMALINS-OBUDOWA-DOPUSZCZALNA-ZALECAN", { zalecaneIp })
                : minimalneIp === null
                  ? t("UI-WILMALINS-MIEJSCE-SUCHE")
                  : t("UI-WILMALINS-OBUDOWA-WYSTARCZAJACA")
          }
        >
          <WynikGlowny>{minimalneIp === null ? t("UI-WILMALINS-PROG-DOTYCZY") : t("UI-WILMALINS-MINIMUM", { minimalneIp })}</WynikGlowny>
          {zalecenia.length > 0 && (
            <>
              <p className="mt-2 text-small font-medium">{t("UI-WILMALINS-ZALECANE-OSLONY")}</p>
              <ul className="list-disc pl-5 text-small">
                {zalecenia.map((z) => (
                  <li key={z}>{t(OPIS_ZALECENIA[z])}</li>
                ))}
              </ul>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <p className="text-small text-muted-foreground">
        {t("UI-WILMALINS-OBUDOWIE-BEDZIE-SKRAPLAC")}
        <Link href="/kalkulatory/ochrona-wilgoc" className="underline">
          {t("UI-WILMALINS-MODUL-OCHRONA-PRZED")}
        </Link>
        .
      </p>
    </main>
  )
}
