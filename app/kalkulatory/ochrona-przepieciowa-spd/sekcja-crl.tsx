"use client"

import { useMemo } from "react"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateOcenaRyzykaCrl } from "@/lib/core/modules/okablowanie/ocena-ryzyka-crl/calculator"
import type { OdcinekCrl, SrodowiskoCrl } from "@/lib/core/modules/okablowanie/ocena-ryzyka-crl/input"
import { liczba } from "@/lib/lokalizacja/model-dzialki"
import { LP_DLUGOSC_MAX_KM, NG_NA_DZIEN_BURZOWY } from "@/lib/core/modules/okablowanie/ocena-ryzyka-crl/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type Stan = {
  skutkiKrytyczne: boolean
  srodowisko: SrodowiskoCrl | ""
  ng: string
  td: string
  napowietrznaNn: string
  kablowaNn: string
  napowietrznaSn: string
  kablowaSn: string
  dlugosciNiepelne: boolean
  odlegloscDoSpd: string
  /** Key of KOLEJNOSCI; "" = order unknown. Optional: drafts saved before D54 lack it. */
  kolejnosc?: KolejnoscId | ""
}

/** D54: section order from the building outward (LV before MV — the transformer lies between them). `etykieta` is a translation key. */
const KOLEJNOSCI = {
  "nn-nap-kab-sn-nap-kab": {
    etykieta: "UI-CRL-K-1",
    odcinki: ["napowietrznaNnKm", "kablowaNnKm", "napowietrznaSnKm", "kablowaSnKm"],
  },
  "nn-nap-kab-sn-kab-nap": {
    etykieta: "UI-CRL-K-2",
    odcinki: ["napowietrznaNnKm", "kablowaNnKm", "kablowaSnKm", "napowietrznaSnKm"],
  },
  "nn-kab-nap-sn-nap-kab": {
    etykieta: "UI-CRL-K-3",
    odcinki: ["kablowaNnKm", "napowietrznaNnKm", "napowietrznaSnKm", "kablowaSnKm"],
  },
  "nn-kab-nap-sn-kab-nap": {
    etykieta: "UI-CRL-K-4",
    odcinki: ["kablowaNnKm", "napowietrznaNnKm", "kablowaSnKm", "napowietrznaSnKm"],
  },
} as const satisfies Record<string, { etykieta: string; odcinki: readonly OdcinekCrl[] }>
type KolejnoscId = keyof typeof KOLEJNOSCI

const STAN_POCZATKOWY: Stan = {
  skutkiKrytyczne: false,
  srodowisko: "",
  ng: "",
  td: "",
  napowietrznaNn: "",
  kablowaNn: "",
  napowietrznaSn: "",
  kablowaSn: "",
  dlugosciNiepelne: false,
  odlegloscDoSpd: "",
  kolejnosc: "",
}

const n = (s: string) => liczba(s) ?? null
const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

/**
 * Moduł 5, Ekran 2 — "Czy SPD jest wymagany" per HD 60364-4-443 (443.4 + 443.5 CRL). Separate draft from the SPD
 * selection above: a different question (is protection required) with different data (supply network, lightning).
 */
export function SekcjaCrl() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("ochrona-przepieciowa-spd-crl", STAN_POCZATKOWY)
  const ustaw = (z: Partial<Stan>) => setStan((s) => ({ ...s, ...z }))
  const wynik = useMemo(
    () =>
      calculateOcenaRyzykaCrl({
        skutkiKrytyczne: stan.skutkiKrytyczne,
        srodowisko: stan.srodowisko || null,
        gestoscWyladowanNg: n(stan.ng),
        dniBurzoweTd: n(stan.td),
        napowietrznaNnKm: n(stan.napowietrznaNn) ?? 0,
        kablowaNnKm: n(stan.kablowaNn) ?? 0,
        napowietrznaSnKm: n(stan.napowietrznaSn) ?? 0,
        kablowaSnKm: n(stan.kablowaSn) ?? 0,
        dlugosciNiepelne: stan.dlugosciNiepelne,
        odlegloscDoSpdWSieciKm: n(stan.odlegloscDoSpd),
        kolejnoscOdBudynku: stan.kolejnosc ? [...KOLEJNOSCI[stan.kolejnosc].odcinki] : null,
      }),
    [stan],
  )
  const v = wynik.value
  const dlugosc = (klucz: "napowietrznaNn" | "kablowaNn" | "napowietrznaSn" | "kablowaSn", label: string) => (
    <Pole
      label={label}
      unit="km"
      type="number"
      inputMode="decimal"
      min={0}
      value={stan[klucz]}
      onChange={(e) => ustaw({ [klucz]: e.target.value })}
      pomoc={<PomocPola ekran="spd-crl" pole={klucz} />}
    />
  )

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">Czy SPD jest w ogóle wymagany? (HD 60364-4-443)</h2>
      <p className="text-small text-muted-foreground">
        Norma liczy ryzyko od linii, które zasilają budynek: im dłuższa linia napowietrzna i im więcej burz, tym mniejszy wskaźnik
        CRL. Poniżej 1000 — ochrona obowiązkowa. Dom w pełni off-grid bez żadnej linii: zostaw długości puste.
      </p>
      <PoleCheckbox
        id="crl-skutki"
        label="Przepięcie zagroziłoby życiu, usługom publicznym, działalności gospodarczej (także gospodarstwu) albo wielu osobom"
        checked={stan.skutkiKrytyczne}
        onChange={(e) => ustaw({ skutkiKrytyczne: e.target.checked })}
      />
      <PoleSelect
        label="Otoczenie"
        value={stan.srodowisko}
        onChange={(e) => ustaw({ srodowisko: e.target.value as SrodowiskoCrl | "" })}
        pomoc={<PomocPola ekran="spd-crl" pole="otoczenie" />}
      >
        <option value="">— wybierz —</option>
        <option value="wiejskie">Wiejskie lub podmiejskie (mało budynków)</option>
        <option value="miejskie">Miejskie</option>
      </PoleSelect>
      <div className="grid gap-3 sm:grid-cols-2">
        <Pole
          label="Gęstość wyładowań Ng"
          unit="1/(km²·rok)"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.ng}
          onChange={(e) => ustaw({ ng: e.target.value })}
          pomoc={<PomocPola ekran="spd-crl" pole="ng" />}
        />
        <Pole
          label="albo dni burzowe w roku Td"
          unit="dni"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.td}
          onChange={(e) => ustaw({ td: e.target.value })}
          pomoc={<PomocPola ekran="spd-crl" pole="td" params={{ lpMax: LP_DLUGOSC_MAX_KM, ngNaDzien: NG_NA_DZIEN_BURZOWY }} />}
        />
        {dlugosc("napowietrznaNn", "Linia napowietrzna nn")}
        {dlugosc("kablowaNn", "Kabel ziemny nn")}
        {dlugosc("napowietrznaSn", "Linia napowietrzna SN")}
        {dlugosc("kablowaSn", "Kabel ziemny SN")}
        <Pole
          label="Odległość do pierwszego SPD w sieci (opcjonalnie)"
          unit="km"
          type="number"
          inputMode="decimal"
          min={0}
          value={stan.odlegloscDoSpd}
          onChange={(e) => ustaw({ odlegloscDoSpd: e.target.value })}
          pomoc={<PomocPola ekran="spd-crl" pole="odlegloscSpd" params={{ lpMax: LP_DLUGOSC_MAX_KM, ngNaDzien: NG_NA_DZIEN_BURZOWY }} />}
        />
      </div>
      <PoleSelect
        label={t("UI-CRL-KOLEJNOSC")}
        value={stan.kolejnosc ?? ""}
        onChange={(e) => ustaw({ kolejnosc: e.target.value as KolejnoscId | "" })}
        pomoc={<PomocPola ekran="spd-crl" pole="kolejnosc" params={{ lpMax: LP_DLUGOSC_MAX_KM, ngNaDzien: NG_NA_DZIEN_BURZOWY }} />}
      >
        <option value="">{t("UI-CRL-K-NIE-WIEM")}</option>
        {(Object.keys(KOLEJNOSCI) as KolejnoscId[]).map((id) => (
          <option key={id} value={id}>
            {t(KOLEJNOSCI[id].etykieta)}
          </option>
        ))}
      </PoleSelect>
      <PoleCheckbox
        id="crl-niepelne"
        label="Nie znam wszystkich długości sieci (reszta do 1 km liczona jako linia napowietrzna nn)"
        checked={stan.dlugosciNiepelne}
        onChange={(e) => ustaw({ dlugosciNiepelne: e.target.checked })}
      />

      {wynik.status === "INCOMPLETE" && <p className="text-small text-muted-foreground">Wybierz otoczenie i wpisz Ng albo dni burzowe.</p>}
      {wynik.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta="Sprawdź dane">
          <WynikSzczegoly assumptions={[]} warnings={wynik.warnings} formula={wynik.formula} />
        </WerdyktPanel>
      )}
      {v && (
        <WerdyktPanel
          poziom={v.spdWymagany ? "uwaga" : "ok"}
          etykieta={v.spdWymagany ? "Ochrona przeciwprzepięciowa wymagana" : "Norma nie wymaga SPD od strony sieci"}
        >
          <WynikGlowny>{v.crl === null ? (v.powod === "brak-linii" ? "Brak linii zasilających" : "Wymagana z mocy 443.4") : `CRL = ${f1(v.crl)}`}</WynikGlowny>
          <p className="mt-1 text-small">
            L<sub>P</sub> = {f2(v.lpKm)} km{v.fEnv !== null && <>, f<sub>env</sub> = {v.fEnv}</>}
            {v.ngUzyte !== null && <>, N<sub>g</sub> = {f2(v.ngUzyte)}</>}. Próg: CRL &lt; 1000 → SPD obowiązkowy.
          </p>
          {!v.spdWymagany && v.powod === "crl" && (
            <p className="mt-1 text-small">
              <strong>{t("UI-CRL-ZALECENIE-S")}</strong> {t("UI-CRL-ZALECENIE")}
            </p>
          )}
          <WynikSzczegoly assumptions={wynik.assumptions} warnings={wynik.warnings} formula={wynik.formula} />
        </WerdyktPanel>
      )}
    </section>
  )
}
