import { calculateAuditPozarowy } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/calculator"
import { SAMPLE_AUDIT_ITEMS } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/constants"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaOdczytowa, type PozycjaOdczytowa } from "@/components/wzorce/panel-odczytowy"
import { ZalozeniaLista } from "@/components/zalozenia-lista"
import { useTranslate } from "@/lib/i18n/language-context"

const STATUS_NA_POZIOM: Record<(typeof SAMPLE_AUDIT_ITEMS)[number]["status"], WerdyktPoziom> = {
  ok: "ok",
  warning: "uwaga",
  critical: "blad",
}

export default function AudytPozarowyPage() {
  const t = useTranslate()
  const result = calculateAuditPozarowy(SAMPLE_AUDIT_ITEMS)

  const poziom: WerdyktPoziom =
    result.value.liczbaKrytycznych > 0
      ? "blad"
      : result.value.liczbaOstrzezen > 0
        ? "uwaga"
        : "ok"

  const pozycje: PozycjaOdczytowa[] = SAMPLE_AUDIT_ITEMS.map((item) => ({
    id: item.id,
    poziom: STATUS_NA_POZIOM[item.status],
    tytul: `${item.kategoria} — ${item.element}`,
    opis: item.opis,
  }))

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/audyt-pozarowy" />
      <NaglowekEkranu tytul={t("UI-AUDPOZ-AUTONOMICZNY-AUDYT-BEZPIECZE")} ekran="audyt-pozarowy" wynik={result}>
        {t("UI-AUDPOZ-REGULARNIE-SPRAWDZA-RAZIE")}
      </NaglowekEkranu>

      <WerdyktPanel poziom={poziom}>
        <p className="mt-1 text-h1 font-semibold">{t("UI-AUDPOZ-GOTOWOSCI", { procentGotowosci: result.value.procentGotowosci })}</p>
        <p className="mt-1 text-small">
          {t("UI-AUDPOZ-SPRAWDZENIA-KRYTYCZNYCH-ELEM", { liczbaOk: result.value.liczbaOk, liczbaOstrzezen: result.value.liczbaOstrzezen, liczbaKrytycznych: result.value.liczbaKrytycznych, razem: result.value.razem })}
        </p>
      </WerdyktPanel>

      <ListaOdczytowa pozycje={pozycje} />

      <ZalozeniaLista assumptions={result.assumptions} />
      <p className="text-caption text-muted-foreground">
        {t("UI-AUDPOZ-EKRAN-WYLACZNIE-ODCZYTU")}
      </p>
    </main>
  )
}
