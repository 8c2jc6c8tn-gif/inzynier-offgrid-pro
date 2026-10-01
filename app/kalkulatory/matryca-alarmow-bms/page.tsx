import { MATRYCA_ALARMOW, PRZYKLADOWY_KOMUNIKAT } from "@/lib/core/modules/baterie/matryca-alarmow-bms/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { useTranslate } from "@/lib/i18n/language-context"

export default function MatrycaAlarmowBmsPage() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/matryca-alarmow-bms" />
      <NaglowekEkranu tytul={t("UI-MATALABMS-MATRYCA-ALARMOW-BMS")} ekran="matryca-alarmow-bms">
        {t("UI-MATALABMS-MODUL-EKRAN-TABELA")}
      </NaglowekEkranu>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-small">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-2 font-medium">{t("UI-MATALABMS-ALARM")}</th>
              <th className="p-2 font-medium">{t("UI-MATALABMS-REAKCJA-SYSTEMU")}</th>
            </tr>
          </thead>
          <tbody>
            {MATRYCA_ALARMOW.map((w) => (
              <tr key={w.id} className="border-b last:border-0">
                <td className="p-2">{w.alarm}</td>
                <td className="p-2 text-muted-foreground">{w.reakcja}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 text-small">
        <p className="font-medium">{t("UI-MATALABMS-PRZYKLADOWY-KOMUNIKAT")}</p>
        <p className="mt-1 text-muted-foreground">{PRZYKLADOWY_KOMUNIKAT}</p>
      </div>

      
    </main>
  )
}
