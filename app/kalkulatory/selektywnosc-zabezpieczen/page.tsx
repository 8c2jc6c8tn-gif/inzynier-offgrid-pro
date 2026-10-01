import { PRZYKLAD, ZASADY } from "@/lib/core/modules/okablowanie/selektywnosc-zabezpieczen/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

export default function SelektywnoscZabezpieczenPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/selektywnosc-zabezpieczen" />
      <NaglowekEkranu tytul={t("UI-SELZAB-SELEKTYWNOSC-ZABEZPIECZEN")} ekran="selektywnosc-zabezpieczen">
        {t("UI-SELZAB-RZECZYWISTA-OCENA-SELEKTYWNO")}
      </NaglowekEkranu>

      <ul className="flex flex-col gap-3">
        {ZASADY.map((zasada) => (
          <li key={zasada.id} className="rounded-md border p-3 text-small">
            <span className="block font-medium">{zasada.tytul}</span>
            <span className="block text-muted-foreground">{zasada.opis}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-md border p-3 text-small">
        <span className="block font-medium">{t("UI-SELZAB-PRZYKLAD")}</span>
        <span className="block text-muted-foreground">{PRZYKLAD}</span>
      </div>

      
    </main>
  )
}
