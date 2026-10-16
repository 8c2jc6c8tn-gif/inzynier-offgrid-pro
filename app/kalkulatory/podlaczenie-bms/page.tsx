"use client"

import { useMemo } from "react"
import { calculatePodlaczenieBms } from "@/lib/core/modules/montaz-baterii/podlaczenie-bms/calculator"
import { CHECKLIST_ITEMS, OSTRZEZENIA_STALE, PRZYKLADOWA_REZYSTANCJA_OHM } from "@/lib/core/modules/montaz-baterii/podlaczenie-bms/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"
import { ZnakStanu } from "@/components/ui/znak-stanu"

/** Schemat: kolejność podłączania BMS — wtyczka balansująca, potem B−, potem pre-charge do P−. */
function PodlaczenieBmsIlustracja() {
  const t = useTranslate()
  return (
    <svg
      viewBox="0 0 440 210"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label={t("UI-PODBMS-SCHEMAT-PODLACZENIA-BMS")}
    >
      {/* Pakiet ogniw */}
      <rect x="16" y="76" width="96" height="48" rx="4" className="fill-indigo-400/60 stroke-current" />
      <text x="64" y="104" textAnchor="middle" className="fill-current text-[10px] font-medium">
        {t("UI-PODBMS-PAKIET-OGNIW")}
      </text>
      <text x="26" y="72" className="fill-current text-[10px] font-semibold">
        +
      </text>
      <text x="98" y="72" className="fill-current text-[10px] font-semibold">
        −
      </text>

      {/* BMS */}
      <rect x="180" y="76" width="80" height="48" rx="4" className="fill-sky-400/60 stroke-current" />
      <text x="220" y="104" textAnchor="middle" className="fill-current text-[10px] font-medium">
        BMS
      </text>

      {/* Falownik */}
      <rect x="336" y="76" width="88" height="48" rx="4" className="fill-emerald-400/60 stroke-current" />
      <text x="380" y="104" textAnchor="middle" className="fill-current text-[10px] font-medium">
        {t("UI-PODBMS-FALOWNIK")}
      </text>

      {/* 1: wtyczka balansująca — kilka cienkich przewodów od góry pakietu do BMS */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={30 + i * 22}
          y1="76"
          x2={190 + i * 12}
          y2="76"
          className="stroke-amber-500"
          strokeWidth="1.5"
        />
      ))}
      <circle cx="150" cy="52" r="9" className="fill-amber-500" />
      <text x="150" y="56" textAnchor="middle" className="fill-white text-[9px] font-bold">
        1
      </text>
      <text x="150" y="38" textAnchor="middle" className="fill-current text-[8px] font-medium">
        {t("UI-PODBMS-WTYCZKA-BALANSUJACA")}
      </text>

      {/* 2: B- od minusa pakietu do BMS */}
      <line x1="112" y1="112" x2="180" y2="112" className="stroke-red-500" strokeWidth="3" />
      <circle cx="146" cy="128" r="9" className="fill-red-500" />
      <text x="146" y="132" textAnchor="middle" className="fill-white text-[9px] font-bold">
        2
      </text>
      <text x="146" y="150" textAnchor="middle" className="fill-current text-[8px] font-medium">
        {t("UI-PODBMS-MINUSA-PAKIETU")}
      </text>

      {/* Rezystor pre-charge symbol między BMS a Falownikiem (linia P-) */}
      <path
        d="M 260 112 L 270 112 L 275 104 L 285 120 L 295 104 L 305 120 L 310 112 L 336 112"
        className="fill-none stroke-red-500"
        strokeWidth="2.5"
      />
      <circle cx="298" cy="128" r="9" className="fill-red-500" />
      <text x="298" y="132" textAnchor="middle" className="fill-white text-[9px] font-bold">
        3
      </text>
      <text x="298" y="150" textAnchor="middle" className="fill-current text-[8px] font-medium">
        {t("UI-PODBMS-PRE-CHARGE")}
      </text>

      {/* Główny plus, bezpośrednio z pakietu do falownika (nad BMS) */}
      <path d="M 64 76 L 64 24 L 380 24 L 380 76" className="fill-none stroke-current" strokeWidth="2" />
      <text x="220" y="18" textAnchor="middle" className="fill-current text-[8px] font-medium">
        {t("UI-PODBMS-GLOWNY-PLUS-BEZPOSREDNIO")}
      </text>

      <text x="220" y="192" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-PODBMS-KOLEJNOSC-GLOWNY-BEZPIECZNIK")}
      </text>
    </svg>
  )
}

type FormularzStan = {
  pojemnoscFalownikaUf: string
  rezystancjaPreChargeOhm: string
  potwierdzoneIds: string[]
}

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscFalownikaUf: "2200",
  rezystancjaPreChargeOhm: String(PRZYKLADOWA_REZYSTANCJA_OHM),
  potwierdzoneIds: [],
}

export default function PodlaczenieBmsPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("podlaczenie-bms", STAN_POCZATKOWY)
  const { pojemnoscFalownikaUf, rezystancjaPreChargeOhm, potwierdzoneIds } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPojemnoscFalownikaUf = (a: string | ((p: string) => string)) => setPole("pojemnoscFalownikaUf", a)
  const setRezystancjaPreChargeOhm = (a: string | ((p: string) => string)) => setPole("rezystancjaPreChargeOhm", a)
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) => setPole("potwierdzoneIds", a)

  const result = useMemo(
    () =>
      calculatePodlaczenieBms({
        pojemnoscFalownikaUf: Number(pojemnoscFalownikaUf),
        rezystancjaPreChargeOhm: Number(rezystancjaPreChargeOhm),
        potwierdzoneIds,
      }),
    [pojemnoscFalownikaUf, rezystancjaPreChargeOhm, potwierdzoneIds],
  )

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID"
        ? "ok"
        : result.status === "VALID_WITH_WARNINGS"
          ? "uwaga"
          : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/podlaczenie-bms" />
      <NaglowekEkranu tytul={t("UI-PODBMS-PODLACZENIE-BMS")} ekran="podlaczenie-bms" wynik={result}>
        {t("UI-PODBMS-ZANIM-GLOWNY-BEZPIECZNIK")}
      </NaglowekEkranu>

      <PodlaczenieBmsIlustracja />

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-PODBMS-POJEMNOSC-WEJSCIOWA-FALOWNIK")}
          unit="µF"
          type="number"
          inputMode="decimal"
          value={pojemnoscFalownikaUf}
          onChange={(e) => setPojemnoscFalownikaUf(e.target.value)}
          pomoc={<PomocPola ekran="podlaczenie-bms" pole="pojemnosc" />}
        />
        <Pole
          label={t("UI-PODBMS-REZYSTOR-WSTEPNY-PRE")}
          unit="Ω"
          type="number"
          inputMode="decimal"
          value={rezystancjaPreChargeOhm}
          onChange={(e) => setRezystancjaPreChargeOhm(e.target.value)}
          pomoc={<PomocPola ekran="podlaczenie-bms" pole="rezystor" params={{ rezystor: PRZYKLADOWA_REZYSTANCJA_OHM }} />}
        />
      </div>

      {result.status !== "INVALID_INPUT" && (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-PODBMS-CZAS-PRE-CHARGE")}>
          <WynikGlowny>{result.value.czasPreChargeS.toLocaleString("pl-PL")} s</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-PODBMS-TRZYMAJ-REZYSTOR-PODLACZONY")}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        numerowana
        renderLabel={(item, index) => (
          <>
            <span className="font-medium">{t("UI-PODBMS-KROK", { p: index + 1 })} </span>
            {item.krok}
          </>
        )}
      />

      <ul className="flex flex-col gap-1 text-caption text-muted-foreground">
        {OSTRZEZENIA_STALE.map((w) => (
          <li key={w}><ZnakStanu poziom="blad" />{w}</li>
        ))}
      </ul>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-PODBMS-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : poziom !== null && poziom !== "blad" ? (
        <WerdyktPanel poziom={poziom} etykieta={poziom === "ok" ? t("UI-PODBMS-BMS-PODLACZONY-POPRAWNIE") : undefined}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      ) : (
        <p className="text-small text-muted-foreground">
          {t("UI-PODBMS-POTWIERDZONO-KROKOW-KOLEI", { potwierdzoneWKolejnosci: result.value.potwierdzoneWKolejnosci, razem: result.value.razem })}
        </p>
      )}
    </main>
  )
}
