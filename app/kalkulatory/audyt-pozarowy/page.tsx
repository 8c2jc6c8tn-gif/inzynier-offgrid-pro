import { calculateAuditPozarowy } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/calculator"
import { SAMPLE_AUDIT_ITEMS } from "@/lib/core/modules/bezpieczenstwo/audyt-pozarowy/constants"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaOdczytowa, type PozycjaOdczytowa } from "@/components/wzorce/panel-odczytowy"
import { ZalozeniaLista } from "@/components/zalozenia-lista"

const STATUS_NA_POZIOM: Record<(typeof SAMPLE_AUDIT_ITEMS)[number]["status"], WerdyktPoziom> = {
  ok: "ok",
  warning: "uwaga",
  critical: "blad",
}

export default function AudytPozarowyPage() {
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
      <NaglowekEkranu tytul="Autonomiczny audyt bezpieczeństwa pożarowego" ekran="audyt-pozarowy" wynik={result}>
        AI regularnie sprawdza, czy w razie pożaru wszystko zadziała tak, jak powinno — żeby nie
        odkryć zepsutego czujnika dopiero w trakcie prawdziwego pożaru. Moduł 8, Ekran 11.
      </NaglowekEkranu>

      <WerdyktPanel poziom={poziom}>
        <p className="mt-1 text-h1 font-semibold">{result.value.procentGotowosci}% gotowości</p>
        <p className="mt-1 text-small">
          {result.value.liczbaOk} OK, {result.value.liczbaOstrzezen} do sprawdzenia,{" "}
          {result.value.liczbaKrytycznych} krytycznych — z {result.value.razem} elementów.
        </p>
      </WerdyktPanel>

      <ListaOdczytowa pozycje={pozycje} />

      <ZalozeniaLista assumptions={result.assumptions} />
      <p className="text-caption text-muted-foreground">
        To ekran wyłącznie do odczytu — nie ma tu pól do
        wypełnienia, tylko wyniki innych systemów.
      </p>
    </main>
  )
}
