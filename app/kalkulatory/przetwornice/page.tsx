"use client"

import { useMemo } from "react"
import { calculatePrzetwornica } from "@/lib/core/modules/kalkulator-mobilny/przetwornice/calculator"
import { TRYBY_PRZETWORNICY, USB_NAPIECIE_V, ZAPAS_MOCY_BIBLIA, type TrybPrzetwornicy } from "@/lib/core/modules/kalkulator-mobilny/przetwornice/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Wiersz = { id: string; nazwa: string; mocW: string; krotnoscRozruchu: string }

type PolaLiczbowe =
  | "napiecieAkumulatoraV"
  | "sprawnoscPct"
  | "napiecieUrzadzeniaV"
  | "mocUrzadzeniaW"
  | "pradPrzetwornicyA"
  | "zapasMocy"
  | "mocFalownikaW"
  | "mocSzczytowaFalownikaW"

type FormularzStan = Record<PolaLiczbowe, string> & { tryb: TrybPrzetwornicy; urzadzenia: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = {
  tryb: "usb",
  napiecieAkumulatoraV: "",
  sprawnoscPct: "",
  napiecieUrzadzeniaV: "",
  mocUrzadzeniaW: "",
  pradPrzetwornicyA: "",
  zapasMocy: "",
  mocFalownikaW: "",
  mocSzczytowaFalownikaW: "",
  urzadzenia: [],
}

const ETYKIETY_TRYBU: Record<TrybPrzetwornicy, string> = {
  usb: "UI-M12-PRZ-TRYB-USB",
  dcdc: "UI-M12-PRZ-TRYB-DCDC",
  falownik: "UI-M12-PRZ-TRYB-FALOWNIK",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function PrzetwornicePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("przetwornice", STAN_POCZATKOWY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const aktualizuj = (id: string, zmiana: Partial<Wiersz>) =>
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((o) => (o.id === id ? { ...o, ...zmiana } : o)) }))

  const result = useMemo(
    () =>
      calculatePrzetwornica({
        tryb: stan.tryb,
        napiecieAkumulatoraV: liczba(stan.napiecieAkumulatoraV),
        sprawnoscPct: liczba(stan.sprawnoscPct),
        napiecieUrzadzeniaV: liczba(stan.napiecieUrzadzeniaV),
        mocUrzadzeniaW: liczba(stan.mocUrzadzeniaW),
        pradPrzetwornicyA: liczba(stan.pradPrzetwornicyA),
        urzadzenia: stan.urzadzenia.map((o) => ({ nazwa: o.nazwa, mocW: liczba(o.mocW), krotnoscRozruchu: liczba(o.krotnoscRozruchu) })),
        zapasMocy: liczba(stan.zapasMocy),
        mocFalownikaW: liczba(stan.mocFalownikaW),
        mocSzczytowaFalownikaW: liczba(stan.mocSzczytowaFalownikaW),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value
  const falownik = stan.tryb === "falownik"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przetwornice" />
      <NaglowekEkranu tytul={t("UI-M12-PRZ-TYTUL")} ekran="przetwornice" wynik={result}>
        {t("UI-M12-PRZ-OPIS")}
      </NaglowekEkranu>

      <div role="tablist" aria-label={t("UI-M12-PRZ-TRYB")} className="flex flex-wrap gap-2">
        {TRYBY_PRZETWORNICY.map((tryb) => (
          <Button
            key={tryb}
            role="tab"
            aria-selected={tryb === stan.tryb}
            variant={tryb === stan.tryb ? "default" : "outline"}
            onClick={() => setStan((prev) => ({ ...prev, tryb }))}
          >
            {t(ETYKIETY_TRYBU[tryb])}
          </Button>
        ))}
      </div>

      <div role="tabpanel" className="flex flex-col gap-4">
        <Pole label={t("UI-M12-PRZ-NAPIECIE-AKUMULATORA")} unit="V" {...pole("napiecieAkumulatoraV")} pomoc={<PomocPola ekran="przetwornice" pole="napiecieAkumulatora" />} />
        <Pole label={t("UI-M12-PRZ-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscPct")} pomoc={<PomocPola ekran="przetwornice" pole="sprawnosc" />} />

        {!falownik && (
          <>
            {stan.tryb === "dcdc" && (
              <Pole label={t("UI-M12-PRZ-NAPIECIE-URZADZENIA")} unit="V" {...pole("napiecieUrzadzeniaV")} pomoc={<PomocPola ekran="przetwornice" pole="napiecieUrzadzenia" />} />
            )}
            <Pole label={t("UI-M12-PRZ-MOC-URZADZENIA")} unit="W" {...pole("mocUrzadzeniaW")} pomoc={<PomocPola ekran="przetwornice" pole="mocUrzadzenia" />} />
            <Pole label={t("UI-M12-PRZ-PRAD-PRZETWORNICY")} unit="A" {...pole("pradPrzetwornicyA")} pomoc={<PomocPola ekran="przetwornice" pole="pradPrzetwornicy" />} />
          </>
        )}

        {falownik && (
          <>
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-2 text-small font-medium">{t("UI-M12-PRZ-URZADZENIA")}</legend>
              <ul className="flex flex-col gap-4">
                {stan.urzadzenia.map((o, i) => (
                  <li key={o.id} className="flex flex-col gap-3 rounded-md border p-3">
                    <Pole label={t("UI-M12-MA-URZADZENIE", { n: i + 1 })} value={o.nazwa} onChange={(e) => aktualizuj(o.id, { nazwa: e.target.value })} pomoc={<PomocPola ekran="przetwornice" pole="nazwa" />} />
                    <div className="grid grid-cols-2 gap-3">
                      <Pole label={t("UI-M12-MA-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={o.mocW} onChange={(e) => aktualizuj(o.id, { mocW: e.target.value })} pomoc={<PomocPola ekran="przetwornice" pole="moc" />} />
                      <Pole label={t("UI-M12-PRZ-KROTNOSC")} unit="×" type="number" inputMode="decimal" min={0} value={o.krotnoscRozruchu} onChange={(e) => aktualizuj(o.id, { krotnoscRozruchu: e.target.value })} pomoc={<PomocPola ekran="przetwornice" pole="krotnosc" />} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.filter((x) => x.id !== o.id) }))}
                      className="self-start text-caption text-muted-foreground underline"
                      aria-label={t("UI-M12-MA-USUN-ETYKIETA", { n: i + 1 })}
                    >
                      {t("UI-M12-MA-USUN")}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  setStan((prev) => ({
                    ...prev,
                    urzadzenia: [...prev.urzadzenia, { id: crypto.randomUUID(), nazwa: "", mocW: "", krotnoscRozruchu: "" }],
                  }))
                }
                className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
              >
                {t("UI-M12-MA-DODAJ")}
              </button>
            </fieldset>
            <Pole label={t("UI-M12-PRZ-ZAPAS")} unit="×" {...pole("zapasMocy")} pomoc={<PomocPola ekran="przetwornice" pole="zapas" params={{ zapasMin: ZAPAS_MOCY_BIBLIA.min, zapasMax: ZAPAS_MOCY_BIBLIA.max }} />} />
            <Pole label={t("UI-M12-PRZ-MOC-FALOWNIKA")} unit="W" {...pole("mocFalownikaW")} pomoc={<PomocPola ekran="przetwornice" pole="mocFalownika" />} />
            <Pole label={t("UI-M12-PRZ-SZCZYT-FALOWNIKA")} unit="W" {...pole("mocSzczytowaFalownikaW")} pomoc={<PomocPola ekran="przetwornice" pole="szczytFalownika" />} />
          </>
        )}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-PRZ-W-UWAGA" : "UI-M12-PRZ-W-OK")}>
          {falownik ? (
            <>
              <WynikGlowny>{t("UI-M12-PRZ-WYNIK-FALOWNIK", { ciagla: Math.ceil(v.minimalnaMocFalownikaW), szczyt: Math.ceil(v.szczytRozruchuW) })}</WynikGlowny>
              <p className="mt-1 text-small">{t("UI-M12-PRZ-SUMA", { suma: Math.round(v.sumaMocyW), prad: r1(v.pradZAkumulatoraA) })}</p>
              {v.pradPrzyPelnejMocyA > 0 && <p className="mt-1 text-small">{t("UI-M12-PRZ-PRAD-PELNA", { prad: r1(v.pradPrzyPelnejMocyA) })}</p>}
            </>
          ) : (
            <>
              <WynikGlowny>{t("UI-M12-PRZ-WYNIK-DC", { prad: r1(v.pradWyjsciowyA), napiecie: stan.tryb === "usb" ? USB_NAPIECIE_V : v.napiecieWyjscioweV })}</WynikGlowny>
              <p className="mt-1 text-small">{t("UI-M12-PRZ-PRAD-AKUMULATORA", { prad: r1(v.pradZAkumulatoraA) })}</p>
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
