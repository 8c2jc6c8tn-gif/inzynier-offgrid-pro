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
  { id: "sprawnosc", etykieta: "Sprawność" },
  { id: "degradacja", etykieta: "Degradacja" },
  { id: "uzysk", etykieta: "Uzysk roczny" },
  { id: "cienkowarstwowe", etykieta: "Cienkowarstwowe" },
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
    { naglowek: "Technologia", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "Sprawność", render: (r) => opisSprawnosci(r.sprawnosc), liczbowa: true },
    { naglowek: "Powierzchnia modułów", render: (r) => opisPowierzchni(r.id), liczbowa: true },
    { naglowek: "Na czym polega", render: (r) => r.opis },
  ]
  const kolumnyDegradacja: Kolumna<Wiersz>[] = [
    { naglowek: "Technologia", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    {
      naglowek: "Degradacja roczna",
      render: (r) => (r.degradacjaRocznaPct === null ? "brak danych" : `${f1(r.degradacjaRocznaPct)}%/rok`),
      liczbowa: true,
    },
    { naglowek: "LID", render: (r) => r.lidOpis ?? "brak danych" },
    { naglowek: "PID", render: (r) => r.pidOpis ?? "brak danych" },
  ]
  const kolumnyUzysk: Kolumna<Wiersz>[] = [
    { naglowek: "Technologia", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "Uzysk względem PERC (wg źródła)", render: (r) => r.uzyskWzgledemPercOpis, liczbowa: true },
  ]
  type Grupa = (typeof GRUPY_TECHNOLOGII)[number]
  const kolumnyGrupy: Kolumna<Grupa>[] = [
    { naglowek: "Rodzaj", render: (r) => <span className="font-medium">{r.nazwa}</span> },
    { naglowek: "Sprawność", render: (r) => opisSprawnosci(r.sprawnosc), liczbowa: true },
    { naglowek: "Powierzchnia modułów", render: (r) => opisPowierzchni(r.id), liczbowa: true },
    { naglowek: "Zalety", render: (r) => r.zalety },
    { naglowek: "Gdzie się sprawdzi", render: (r) => r.zastosowanie },
  ]

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/technologie-paneli" />
      <NaglowekEkranu tytul="Technologie paneli" ekran="technologie-paneli" wzor={result.formula}>
        Half-Cut, PERC, TOPCon, HJT i panele cienkowarstwowe różnią się sprawnością, tempem starzenia i
        tym, gdzie się sprawdzą. Moduł 3, Ekran 15.
      </NaglowekEkranu>

      <Pole
        label="Planowana moc instalacji"
        unit="kWp"
        type="number"
        inputMode="decimal"
        min={0}
        value={mocInstalacjiKwp}
        onChange={(e) => setStan((prev) => ({ ...prev, mocInstalacjiKwp: e.target.value }))}
        pomoc={<PomocPola ekran="technologie-paneli" pole="moc" />}
      />
      {result.status === "INVALID_INPUT" && (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      )}

      <div role="tablist" aria-label="Porównanie technologii" className="flex flex-wrap gap-2">
        {ZAKLADKI.map((z) => (
          <Button
            key={z.id}
            role="tab"
            aria-selected={z.id === zakladka}
            variant={z.id === zakladka ? "default" : "outline"}
            onClick={() => setStan((prev) => ({ ...prev, zakladka: z.id }))}
          >
            {z.etykieta}
          </Button>
        ))}
      </div>

      <div role="tabpanel" className="flex flex-col gap-3">
        {zakladka === "sprawnosc" && (
          <>
            <KartaPorownawcza kolumny={kolumnySprawnosc} wiersze={TECHNOLOGIE_KRYSTALICZNE} />
            <p className="text-small text-muted-foreground">Rekomendacja źródła: do off-gridu wybierz TOPCon lub HJT.</p>
          </>
        )}
        {zakladka === "degradacja" && (
          <>
            <KartaPorownawcza kolumny={kolumnyDegradacja} wiersze={TECHNOLOGIE_KRYSTALICZNE} minWidth={480} />
            <p className="text-small text-muted-foreground">
              LID — utrata mocy w pierwszych godzinach pracy pod wpływem światła. LETID — powolna degradacja
              pod wpływem światła i temperatury. PID — degradacja indukowana napięciem. Rekomendacja źródła:
              do off-gridu panele z certyfikatem anty-PID i niskim LID.
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
              Rekomendacja źródła: na dach — krystaliczne; cienkowarstwowe na dużą, równą powierzchnię gruntu.
            </p>
          </>
        )}
      </div>

      {result.status === "VALID" && <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />}

      
    </main>
  )
}
