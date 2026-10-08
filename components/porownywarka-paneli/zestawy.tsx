"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { KWOTY_ZESTAWOW, kolejnyId, STAN_ZESTAWOW_POCZATKOWY, type FormularzStan, type StanZestawow } from "@/lib/porownywarka-paneli/stan"

/**
 * „Moje zestawy” (spec 12, U20): nazwane migawki całego formularza porównania (miejsca, panele, wycena, kryteria),
 * do których można wracać. Zapis w IndexedDB jak szkic ekranu; nic nie jest wczytywane bez kliknięcia.
 */
export function ZestawyPorownan({ stan, onWczytaj }: { stan: FormularzStan; onWczytaj: (s: FormularzStan) => void }) {
  const t = useTranslate()
  const [zapisane, setZapisane] = usePersistedDraft<StanZestawow>("porownywarka-zestawy", STAN_ZESTAWOW_POCZATKOWY, KWOTY_ZESTAWOW)
  const [nazwa, setNazwa] = useState("")
  const [doUsuniecia, setDoUsuniecia] = useState<string | null>(null)
  const teraz = () => new Date().toISOString()

  const zapiszNowy = () => {
    const wpisana = nazwa.trim()
    setZapisane((prev) => ({
      zestawy: [
        ...prev.zestawy,
        { id: kolejnyId("z", prev.zestawy), nazwa: wpisana || t("UI-PORP-ZEST-DOMYSLNA", { n: prev.zestawy.length + 1 }), zapisanoIso: teraz(), stan },
      ],
    }))
    setNazwa("")
  }

  return (
    <details className="rounded-lg border p-4">
      <summary className="cursor-pointer text-small font-medium">{t("UI-PORP-ZEST-TYTUL", { n: zapisane.zestawy.length })}</summary>
      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-48 flex-1">
            <Pole
              label={t("UI-PORP-ZEST-NAZWA")}
              type="text"
              value={nazwa}
              onChange={(e) => setNazwa(e.target.value)}
              pomoc={<PomocPola ekran="porownywarka-paneli" pole="zestawNazwa" />}
            />
          </div>
          <Button variant="outline" className="min-h-11" onClick={zapiszNowy}>
            {t("UI-PORP-ZEST-ZAPISZ")}
          </Button>
        </div>
        {zapisane.zestawy.length === 0 ? (
          <p className="text-small text-muted-foreground">{t("UI-PORP-ZEST-PUSTO")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {zapisane.zestawy.map((z) => (
              <li key={z.id} className="flex flex-col gap-2 rounded-md border p-3 text-small">
                <span className="font-medium">{z.nazwa}</span>
                <span className="text-caption text-muted-foreground">{t("UI-PORP-ZEST-ZAPISANO", { data: new Date(z.zapisanoIso).toLocaleDateString("pl-PL") })}</span>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="min-h-11" onClick={() => onWczytaj(z.stan)}>
                    {t("UI-PORP-ZEST-WCZYTAJ")}
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11"
                    onClick={() => setZapisane((prev) => ({ zestawy: prev.zestawy.map((x) => (x.id === z.id ? { ...x, zapisanoIso: teraz(), stan } : x)) }))}
                  >
                    {t("UI-PORP-ZEST-AKTUALIZUJ")}
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-11"
                    onClick={() =>
                      setZapisane((prev) => ({
                        zestawy: [...prev.zestawy, { ...z, id: kolejnyId("z", prev.zestawy), nazwa: t("UI-PORP-ZEST-KOPIA", { nazwa: z.nazwa }), zapisanoIso: teraz() }],
                      }))
                    }
                  >
                    {t("UI-PORP-ZEST-DUPLIKUJ")}
                  </Button>
                  {doUsuniecia === z.id ? (
                    <Button
                      variant="outline"
                      className="min-h-11"
                      onClick={() => {
                        setZapisane((prev) => ({ zestawy: prev.zestawy.filter((x) => x.id !== z.id) }))
                        setDoUsuniecia(null)
                      }}
                    >
                      {t("UI-PORP-ZEST-USUN-PEWNY")}
                    </Button>
                  ) : (
                    <Button variant="outline" className="min-h-11" onClick={() => setDoUsuniecia(z.id)}>
                      {t("UI-PORP-ZEST-USUN")}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-caption text-muted-foreground">{t("UI-PORP-ZEST-NOTA")}</p>
      </div>
    </details>
  )
}
