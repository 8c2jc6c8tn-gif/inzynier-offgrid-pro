"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateUziemienieMaleInstalacje } from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/calculator"
import { MIEJSCA_Z_ZASILANIEM_ZEWNETRZNYM } from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/constants"
import type {
  MiejsceUziemienia,
  OdpowiedzKontrolna,
  RodzajMalejInstalacji,
} from "@/lib/core/modules/kalkulator-mobilny/uziemienie-male-instalacje/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

/**
 * Pętla zwarcia w wyspie z falownika (D56, decyzja właściciela 29.09.2026): ochrona nie potrzebuje ziemi, tylko zamkniętej
 * drogi obudowa → PE → punkt N–PE w falowniku → falownik; RCD 30 mA za tym punktem. Źródło (Biblia §12.53): obudowa
 * falownika i styk ochronny gniazd podłączone do uziemienia pojazdu — tu jako wspólna szyna PE z podwoziem.
 */
function SchematPetliZwarcia() {
  const t = useTranslate()
  return (
    <svg
      viewBox="0 0 400 262"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label={t("UI-UMI-SCHEMAT-ARIA")}
    >
      <rect x="15" y="20" width="120" height="110" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="75" y="40" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        {t("UI-UMI-SCH-FALOWNIK")}
      </text>
      <text x="120" y="64" textAnchor="end" className="fill-current text-[9px]">
        L
      </text>
      <text x="120" y="94" textAnchor="end" className="fill-current text-[9px]">
        N
      </text>
      {/* N–PE bond inside the inverter */}
      <line x1="75" y1="90" x2="75" y2="130" className="stroke-current" strokeWidth="2" />
      <line x1="75" y1="90" x2="135" y2="90" className="stroke-current" strokeWidth="2" />
      <circle cx="75" cy="118" r="4" className="fill-current" />
      <text x="70" y="114" textAnchor="end" className="fill-current text-[9px] font-semibold">
        N–PE
      </text>

      <rect x="165" y="45" width="60" height="60" rx="4" className="fill-sky-400/50 stroke-current" />
      <text x="195" y="72" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        RCD
      </text>
      <text x="195" y="86" textAnchor="middle" className="fill-current text-[9px]">
        30 mA
      </text>
      <line x1="135" y1="60" x2="165" y2="60" className="stroke-current" strokeWidth="2" />
      <line x1="225" y1="60" x2="265" y2="60" className="stroke-current" strokeWidth="2" />
      <line x1="225" y1="90" x2="265" y2="90" className="stroke-current" strokeWidth="2" />
      <line x1="135" y1="90" x2="165" y2="90" className="stroke-current" strokeWidth="2" />

      <rect x="265" y="30" width="120" height="100" rx="4" className="fill-amber-400/70 stroke-current" />
      <text x="325" y="50" textAnchor="middle" className="fill-current text-[10px] font-semibold">
        {t("UI-UMI-SCH-ODBIORNIK")}
      </text>
      <text x="325" y="63" textAnchor="middle" className="fill-current text-[9px]">
        {t("UI-UMI-SCH-GNIAZDO")}
      </text>
      {/* insulation fault L → enclosure */}
      <polyline points="290,72 300,84 310,76 320,94 330,88 340,104" className="fill-none stroke-red-600" strokeWidth="2" />
      <text x="325" y="120" textAnchor="middle" className="fill-red-600 text-[9px] font-semibold">
        {t("UI-UMI-SCH-ZWARCIE")}
      </text>

      {/* protective conductor PE (green-yellow): enclosure, chassis, N–PE point */}
      {[
        [325, 130, 325, 180],
        [75, 130, 75, 180],
        [200, 180, 200, 205],
        [75, 180, 325, 180],
      ].map(([x1, y1, x2, y2]) => (
        <g key={`${x1}-${y1}-${x2}-${y2}`}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-green-600" strokeWidth="4" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-yellow-400" strokeWidth="4" strokeDasharray="6 6" />
        </g>
      ))}
      <text x="250" y="174" textAnchor="middle" className="fill-current text-[9px] font-semibold">
        {t("UI-UMI-SCH-PE")}
      </text>
      <rect x="140" y="205" width="120" height="18" rx="4" className="fill-green-600/30 stroke-current" />
      <text x="200" y="218" textAnchor="middle" className="fill-current text-[9px] font-semibold">
        {t("UI-UMI-SCH-PODWOZIE")}
      </text>

      <text x="200" y="240" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-UMI-SCH-PRAD")}
      </text>
      <text x="200" y="254" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-UMI-SCH-DUZY")}
      </text>
    </svg>
  )
}

type FormularzStan = {
  rodzaj: RodzajMalejInstalacji | ""
  miejsce: MiejsceUziemienia | ""
  obudowa: OdpowiedzKontrolna | ""
  gniazda: OdpowiedzKontrolna | ""
  npe: OdpowiedzKontrolna | ""
  rcd: OdpowiedzKontrolna | ""
  zasilanie: "tak" | "nie" | ""
  npeRozlaczane: OdpowiedzKontrolna | ""
}

const STAN_POCZATKOWY: FormularzStan = {
  rodzaj: "",
  miejsce: "",
  obudowa: "",
  gniazda: "",
  npe: "",
  rcd: "",
  zasilanie: "",
  npeRozlaczane: "",
}

type PoleOdpowiedzi = "obudowa" | "gniazda" | "npe" | "rcd" | "npeRozlaczane"

/** `label` is a translation key (`t()`). */
const MIEJSCA: { id: MiejsceUziemienia; label: string }[] = [
  { id: "garaz", label: "UI-UMI-M-GARAZ" },
  { id: "kamper", label: "UI-UMI-M-KAMPER" },
  { id: "jacht", label: "UI-UMI-M-JACHT" },
  { id: "zewnatrz", label: "UI-UMI-M-ZEWNATRZ" },
  { id: "namiot", label: "UI-UMI-M-NAMIOT" },
]

const ODPOWIEDZI: { id: OdpowiedzKontrolna; label: string }[] = [
  { id: "tak", label: "UI-TAK-DUZE" },
  { id: "nie", label: "UI-NIE-DUZE" },
  { id: "nie-wiem", label: "UI-NIE-WIEM" },
]

const doOdpowiedzi = (v: OdpowiedzKontrolna | "") => (v === "" ? null : v)

export default function UziemienieMaleInstalacjePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("uziemienie-male-instalacje", STAN_POCZATKOWY)
  // Drafts saved before D56 (29.09.2026) have no `npe`/`rcd` — treat as empty (INCOMPLETE, never "OK").
  const npe = stan.npe ?? ""
  const rcd = stan.rcd ?? ""
  // Same for `zasilanie`/`npeRozlaczane` before D57.
  const zasilanie = stan.zasilanie ?? ""
  const npeRozlaczane = stan.npeRozlaczane ?? ""
  const odpowiedzi: Record<PoleOdpowiedzi, OdpowiedzKontrolna | ""> = {
    obudowa: stan.obudowa,
    gniazda: stan.gniazda,
    npe,
    rcd,
    npeRozlaczane,
  }

  const result = useMemo(
    () =>
      calculateUziemienieMaleInstalacje({
        rodzaj: stan.rodzaj === "" ? null : stan.rodzaj,
        miejsce: stan.miejsce === "" ? null : stan.miejsce,
        obudowaFalownikaUziemiona: doOdpowiedzi(stan.obudowa),
        gniazdaZeStykiemOchronnym: doOdpowiedzi(stan.gniazda),
        polaczenieNPE: doOdpowiedzi(npe),
        rcd30mA: doOdpowiedzi(rcd),
        zasilanieZewnetrzne: zasilanie === "" ? null : zasilanie,
        npeRozlaczanePrzyZasilaniuZewnetrznym: doOdpowiedzi(npeRozlaczane),
      }),
    [stan, npe, rcd, zasilanie, npeRozlaczane],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const kody = new Set(result.warnings.map((w) => w.code))
  const gniazdaBezStyku = kody.has("UMI-GNIAZDA-BEZ-STYKU-OCHRONNEGO")
  const { wymaganeUziemienieOchronne, zalecaneZeWzgleduNaWilgoc } = result.value
  const ac230 = stan.rodzaj === "ac230"
  const namiot = stan.miejsce === "namiot"
  const pytajOZasilanie = stan.miejsce !== "" && MIEJSCA_Z_ZASILANIEM_ZEWNETRZNYM.includes(stan.miejsce)
  // Tent (D57): the N–PE question comes first; enclosure, sockets and RCD only apply to an output with an N–PE bond.
  const namiotPlywajace = namiot && npe !== "tak"
  const zeSlupka = pytajOZasilanie && zasilanie === "tak"
  // Variant of the external-supply texts: J = yacht (shore power), K = camper (hook-up post).
  const w = stan.miejsce === "jacht" ? "J" : "K"

  /** `klucz` is the translation key of the question label. */
  const pytanie = (pole: PoleOdpowiedzi, klucz: string) => (
    <PoleSelect
      label={t(klucz)}
      value={odpowiedzi[pole]}
      onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value as OdpowiedzKontrolna | "" }))}
      pomoc={<PomocPola ekran="uziemienie-male-instalacje" pole={pole} />}
    >
      <option value="">{t("UI-WYBIERZ")}</option>
      {ODPOWIEDZI.map((o) => (
        <option key={o.id} value={o.id}>
          {t(o.label)}
        </option>
      ))}
    </PoleSelect>
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/uziemienie-male-instalacje" />
      <NaglowekEkranu tytul={t("UI-UMI-TYTUL")} ekran="uziemienie-male-instalacje" wynik={result}>
        {t("UI-UMI-OPIS")}
      </NaglowekEkranu>
      

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-UMI-RODZAJ")}
          value={stan.rodzaj}
          onChange={(e) => setStan((prev) => ({ ...prev, rodzaj: e.target.value as FormularzStan["rodzaj"] }))}
          pomoc={<PomocPola ekran="uziemienie-male-instalacje" pole="rodzaj" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="dc">{t("UI-UMI-RODZAJ-DC")}</option>
          <option value="ac230">{t("UI-UMI-RODZAJ-AC")}</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-UMI-GDZIE")}
          value={stan.miejsce}
          onChange={(e) => setStan((prev) => ({ ...prev, miejsce: e.target.value as FormularzStan["miejsce"] }))}
          pomoc={<PomocPola ekran="uziemienie-male-instalacje" pole="miejsce" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {MIEJSCA.map((m) => (
            <option key={m.id} value={m.id}>
              {t(m.label)}
            </option>
          ))}
        </PoleSelect>
        {ac230 && pytajOZasilanie && (
          <PoleSelect
            label={t(`UI-UMI-Q-ZASILANIE-${w}`)}
            value={zasilanie}
            onChange={(e) => setStan((prev) => ({ ...prev, zasilanie: e.target.value as FormularzStan["zasilanie"] }))}
            pomoc={<PomocPola ekran="uziemienie-male-instalacje" pole="zasilanie" />}
          >
            <option value="">{t("UI-WYBIERZ")}</option>
            <option value="tak">{t("UI-TAK-DUZE")}</option>
            <option value="nie">{t("UI-NIE-DUZE")}</option>
          </PoleSelect>
        )}
        {ac230 && namiot && pytanie("npe", "UI-UMI-Q-NPE-NAMIOT")}
        {ac230 && !namiotPlywajace && (
          <>
            {pytanie("obudowa", "UI-UMI-Q-OBUDOWA")}
            {pytanie("gniazda", "UI-UMI-Q-GNIAZDA")}
            {!namiot && pytanie("npe", "UI-UMI-Q-NPE")}
            {zeSlupka && npe === "tak" && pytanie("npeRozlaczane", "UI-UMI-Q-NPE-ROZLACZANE")}
            {pytanie("rcd", "UI-UMI-Q-RCD")}
          </>
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t(ac230 ? "UI-UMI-WYBIERZ-AC" : "UI-UMI-WYBIERZ-DC")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={t(
            kody.has("UMI-PODWOJNE-POLACZENIE-N-PE")
              ? "UI-UMI-W-PODWOJNE"
              : kody.has("UMI-OBUDOWA-FALOWNIKA-NIEUZIEMIONA")
                ? "UI-UMI-W-OBUDOWA"
                : kody.has("UMI-BRAK-POLACZENIA-N-PE")
                  ? "UI-UMI-W-BRAK-NPE"
                  : kody.has("UMI-BRAK-RCD-30MA")
                    ? "UI-UMI-W-BRAK-RCD"
                    : kody.has("UMI-NAMIOT-WYJSCIE-PLYWAJACE")
                      ? "UI-UMI-W-NAMIOT"
                      : gniazdaBezStyku
                        ? "UI-UMI-W-GNIAZDA"
                        : wymaganeUziemienieOchronne
                          ? "UI-UMI-W-PETLA"
                          : zalecaneZeWzgleduNaWilgoc
                            ? "UI-UMI-W-WILGOC"
                            : "UI-UMI-W-ZWYKLE",
          )}
        >
          <WynikGlowny>
            {t(
              wymaganeUziemienieOchronne
                ? "UI-UMI-G-WYMAGANE"
                : namiotPlywajace && ac230
                  ? "UI-UMI-G-PLYWAJACE"
                  : "UI-UMI-G-ZWYKLE",
            )}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      {ac230 && namiotPlywajace && (
        <section className="flex flex-col gap-2">
          <h2 className="text-small font-semibold">{t("UI-UMI-NAMIOT-H")}</h2>
          <p className="text-small text-muted-foreground">{t("UI-UMI-NAMIOT-OPIS")}</p>
          <ul className="list-disc pl-5 text-small text-muted-foreground">
            <li>{t("UI-UMI-NAMIOT-1")}</li>
            <li>{t("UI-UMI-NAMIOT-2")}</li>
            <li>{t("UI-UMI-NAMIOT-3")}</li>
            <li>{t("UI-UMI-NAMIOT-4")}</li>
            <li>
              {t("UI-UMI-NAMIOT-5")}{" "}
              <Link href="/kalkulatory/wilgoc-male-instalacje" className="underline">
                {t("UI-UMI-NAMIOT-5-L")}
              </Link>
              .
            </li>
            <li>{t("UI-UMI-NAMIOT-6")}</li>
          </ul>
        </section>
      )}

      {ac230 && !namiotPlywajace && (
        <section className="flex flex-col gap-2">
          <h2 className="text-small font-semibold">{t("UI-UMI-OCHRONA-H")}</h2>
          <p className="text-small text-muted-foreground">{t("UI-UMI-OCHRONA-OPIS")}</p>
          <ul className="list-disc pl-5 text-small text-muted-foreground">
            <li>{t("UI-UMI-OCHRONA-1")}</li>
            <li>{t("UI-UMI-OCHRONA-2")}</li>
            <li>{t("UI-UMI-OCHRONA-3")}</li>
          </ul>
          <p className="text-small text-muted-foreground">{t("UI-UMI-PRET")}</p>
          {zeSlupka && (
            <>
              <p className="text-small text-muted-foreground">
                <strong>{t(`UI-UMI-Z-P1-S-${w}`)}</strong> {t(`UI-UMI-Z-P1-${w}`)}
              </p>
              <p className="text-small text-muted-foreground">{t(`UI-UMI-Z-P2-${w}`)}</p>
              <ol className="list-decimal pl-5 text-small text-muted-foreground">
                <li>
                  <strong>{t("UI-UMI-Z-L1-S")}</strong> {t(`UI-UMI-Z-L1-${w}`)}
                </li>
                <li>
                  <strong>{t(`UI-UMI-Z-L2-S-${w}`)}</strong> {t(`UI-UMI-Z-L2-${w}`)}
                </li>
                <li>
                  <strong>{t("UI-UMI-Z-L3-S")}</strong> {t(`UI-UMI-Z-L3-${w}`)}
                </li>
                {stan.miejsce === "jacht" && (
                  <li>
                    <strong>{t("UI-UMI-Z-L4-S")}</strong> {t("UI-UMI-Z-L4")}
                  </li>
                )}
              </ol>
              <p className="text-small text-muted-foreground">{t("UI-UMI-Z-P3")}</p>
            </>
          )}
          {stan.miejsce === "kamper" && (
            <p className="text-small text-muted-foreground">
              <strong>{t("UI-UMI-POSTOJ-S")}</strong> {t("UI-UMI-POSTOJ")}
            </p>
          )}
          <SchematPetliZwarcia />
        </section>
      )}

      <p className="text-small text-muted-foreground">
        {t("UI-UMI-STOPKA")}{" "}
        <Link href="/kalkulatory/projekt-uziemienia" className="underline">
          {t("UI-UMI-STOPKA-L1")}
        </Link>
        {t("UI-UMI-STOPKA-ORAZ")}
        <Link href="/kalkulatory/uziemienie-funkcjonalne-ochronne" className="underline">
          {t("UI-UMI-STOPKA-L2")}
        </Link>
        .
      </p>
    </main>
  )
}
