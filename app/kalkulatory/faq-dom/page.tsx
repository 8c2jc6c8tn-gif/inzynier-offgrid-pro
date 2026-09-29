import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaFaq } from "@/components/siec/lista-faq"
import { FAQ_DOM } from "@/components/siec/tresci-faq"

export default function FaqDomPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/faq-dom" />
      <NaglowekEkranu tytul="Najczęstsze pytania — dom i sieć">
        Rachunek, prosument, odłączenie i bezpieczeństwo w krótkich odpowiedziach, z odnośnikami do kalkulatorów. M14 „Dom –
        sieć”, ekran D14.
      </NaglowekEkranu>
      <ListaFaq pytania={FAQ_DOM} />
    </main>
  )
}
