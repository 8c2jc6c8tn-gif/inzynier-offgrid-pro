import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaFaq } from "@/components/siec/lista-faq"
import { FAQ_FIRMA } from "@/components/siec/tresci-faq"

export default function FaqFirmaPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/faq-firma" />
      <NaglowekEkranu tytul="Najczęstsze pytania firm">
        Taryfy C, moc bierna, opłata mocowa, net-billing, magazyny i licznik — odpowiedzi poprawione względem materiału
        źródłowego. M14 „Firma – sieć”, ekran F13.
      </NaglowekEkranu>
      <ListaFaq pytania={FAQ_FIRMA} />
    </main>
  )
}
