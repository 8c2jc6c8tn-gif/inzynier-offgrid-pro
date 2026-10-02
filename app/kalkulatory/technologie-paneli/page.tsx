"use client"

import { useMemo } from "react"
import { calculateTechnologiePaneli } from "@/lib/core/modules/pv/technologie-paneli/calculator"
import {
  GRUPY_TECHNOLOGII,
  TECHNOLOGIE_KRYSTALICZNE,
  type Sprawnosc,
} from "@/lib/core/modules/pv/technologie-paneli/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { KartaPorownawcza, type Kolumna } from "@/components/wzorce/karta-porownawcza"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type Zakladka = "sprawnosc" | "degradacja" | "uzysk" | "cienkowarstwowe"

const ZAKLADKI: { id: Zakladka; etykieta: string }[] = [
  { id: "sprawnosc", etykieta: "UI-TECPAN-SPRAWNOSC" },
  { id: "degradacja", etykieta: "UI-TECPAN-DEGRADACJA" },
  { id: "uzysk", etykieta: "UI-TECPAN-UZYSK-ROCZNY" },
  { id: "cienkowarstwowe", etykieta: "UI-TECPAN-CIENKOWARSTWOWE" },
]

type FormularzStan = { zakladka: Zakladka; mocInstalacjiKwp: string }

const STAN_POCZATKOWY: FormularzStan = { zakladka: "sprawnosc", mocInstalacjiKwp: "" }

const f1 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

function opisSprawnosci(s: Sprawnosc): string {
  if (s.maxPct === null) return `${s.minPct}%+`
  return s.minPct === s.maxPct ? `~${s.minPct}%` : `${s.minPct}–${s.maxPct}%`
}

export default function TechnologiePaneliPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("technologie-paneli", STAN_POCZATKOWY)
  const { zakladka, mocInstalacjiKwp } = stan

  const result = useMemo(
    () => calculateTechnologiePaneli({ mocInstalacjiKwp: mocInstalacjiKwp === "" ? 0 : Number(mocInstalacjiKwp) }),
    [mocInstalacjiKwp],
  )
  const powierzchnie = new Map(
    [...result.value.krystaliczne, ...result.value.grupy].map((p) => [p.id, p] as const),
  )
  const opisPowierzchni = (id: string) => {
    const p = powierzchnie.get(id)
    if (!p) return "—"
    return p.powierzchniaMinM2 === null
      ? `≤ ${f1(p.powierzchniaMaxM2)} m²`
      : Math.abs(p.powierzchniaMaxM2 - p.powierzchniaMinM2) < 1e-9
        ? `${f1(p.powierzchniaMaxM2)} m²`
        : `${f1(p.powierzchniaMinM2)}–${f1(p.powierzchniaMaxM2)} m²`
  }

  type Wiersz = (typeof TECHNOLOGIE_KRYSTALICZNE)[number]
  const kolumnySprawnosc: Kolumna<Wiersz>[] = [
    { naglowek: t("UI-TECPAN-TECHNOLOGIA"), render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: t("UI-TECPAN-SPRAWNOSC"), render: (r) => opisSprawnosci(r.sprawnosc), liczbowa: true },
    { naglowek: t("UI-TECPAN-POWIERZCHNIA-MODULOW"), render: (r) => opisPowierzchni(r.id), liczbowa: true },
    { naglowek: t("UI-TECPAN-CZYM-POLEGA"), render: (r) => r.opis },
  ]
  const kolumnyDegradacja: Kolumna<Wiersz>[] = [
    { naglowek: t("UI-TECPAN-TECHNOLOGIA"), render: (r) => <span className="font-medium">{r.nazwa}</span> },
    {
      naglowek: t("UI-TECPAN-DEGRADACJA-ROCZNA"),
      render: (r) => (r.degradacjaRocznaPct === null ? t("UI-TECPAN-BRAK-DANYCH") : t("UI-TECPAN-PCT-ROK", { p: f1(r.degradacjaRocznaPct) })),
      liczbowa: true,
    },
    { naglowek: "LID", render: (r) => r.lidOpis ?? t("UI-TECPAN-BRAK-DANYCH") },
    { naglowek: "PID", render: (r) => r.pidOpis ?? t("UI-TECPAN-BRAK-DANYCH") },
  ]
  const kolumnyUzysk: Kolumna<Wiersz>[] = [
    { naglowek: t("UI-TECPAN-TECHNOLOGIA"), render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: t("UI-TECPAN-UZYSK-WZGLEDEM-PERC"), render: (r) => r.uzyskWzgledemPercOpis, liczbowa: true },
  ]
  type Grupa = (typeof GRUPY_TECHNOLOGII)[number]
  const kolumnyGrupy: Kolumna<Grupa>[] = [
    { naglowek: t("UI-TECPAN-RODZAJ"), render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: t("UI-TECPAN-SPRAWNOSC"), render: (r) => opisSprawnosci(r.sprawnosc), liczbowa: true },
    { naglowek: t("UI-TECPAN-POWIERZCHNIA-MODULOW"), render: (r) => opisPowierzchni(r.id), liczbowa: true },
    { naglowek: t("UI-TECPAN-ZALETY"), render: (r) => r.zalety },
    { naglowek: t("UI-TECPAN-GDZIE-SPRAWDZI"), render: (r) => r.zastosowanie },
  ]

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/technologie-paneli" />
      <NaglowekEkranu tytul={t("UI-TECPAN-TECHNOLOGIE-PANELI")} ekran="technologie-paneli" wynik={result}>
        {t("UI-TECPAN-HALF-CUT-PERC")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-TECPAN-PLANOWANA-MOC-INSTALACJI")}
        unit="kWp"
        type="number"
        inputMode="decimal"
        min={0}
        value={mocInstalacjiKwp}
        onChange={(e) => setStan((prev) => ({ ...prev, mocInstalacjiKwp: e.target.value }))}
        pomoc={<PomocPola ekran="technologie-paneli" pole="moc" />}
      />
      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta={t("UI-TECPAN-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}

      <div role="tablist" aria-label={t("UI-TECPAN-POROWNANIE-TECHNOLOGII")} className="flex flex-wrap gap-2">
        {ZAKLADKI.map((z) => (
          <Button
            key={z.id}
            role="tab"
            aria-selected={z.id === zakladka}
            variant={z.id === zakladka ? "default" : "outline"}
            onClick={() => setStan((prev) => ({ ...prev, zakladka: z.id }))}
          >
            {t(z.etykieta)}
          </Button>
        ))}
      </div>

      <div role="tabpanel" className="flex flex-col gap-3">
        {zakladka === "sprawnosc" && (
          <>
            <KartaPorownawcza kolumny={kolumnySprawnosc} wiersze={TECHNOLOGIE_KRYSTALICZNE} />
            <p className="text-small text-muted-foreground">{t("UI-TECPAN-REKOMENDACJA-ZRODLA-OFF")}</p>
          </>
        )}
        {zakladka === "degradacja" && (
          <>
            <KartaPorownawcza kolumny={kolumnyDegradacja} wiersze={TECHNOLOGIE_KRYSTALICZNE} minWidth={480} />
            <p className="text-small text-muted-foreground">
              {t("UI-TECPAN-LID-UTRATA-MOCY")}
            </p>
          </>
        )}
        {zakladka === "uzysk" && (
          <>
            <KartaPorownawcza kolumny={kolumnyUzysk} wiersze={TECHNOLOGIE_KRYSTALICZNE} minWidth={320} />
            <p className="rounded-lg border border-werdykt-uwaga-border bg-werdykt-uwaga-bg p-3 text-small">
              🔎 {t("TECHNOLOGIE-SPRAWNOSC-TO-POWIERZCHNIA")}
            </p>
          </>
        )}
        {zakladka === "cienkowarstwowe" && (
          <>
            <KartaPorownawcza kolumny={kolumnyGrupy} wiersze={GRUPY_TECHNOLOGII} minWidth={640} />
            <p className="text-small text-muted-foreground">
              {t("UI-TECPAN-REKOMENDACJA-ZRODLA-DACH")}
            </p>
          </>
        )}
      </div>

      {result.status === "VALID" && <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />}

      
    </main>
  )
}
