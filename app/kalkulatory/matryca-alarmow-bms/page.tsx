import { MATRYCA_ALARMOW, MIGAWKA, PRZYKLADOWY_KOMUNIKAT } from "@/lib/core/modules/baterie/matryca-alarmow-bms/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { MigawkaBox } from "@/components/wzorce/migawka-box"

export default function MatrycaAlarmowBmsPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/matryca-alarmow-bms" />
      <NaglowekEkranu tytul="Matryca alarmów BMS i reakcje systemu">
        Moduł 4, Ekran 34. Tabela referencyjna — co robi BMS automatycznie, gdy wykryje dany
        stan alarmowy.
      </NaglowekEkranu>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-small">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="p-2 font-medium">Alarm</th>
              <th className="p-2 font-medium">Reakcja systemu</th>
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
        <p className="font-medium">Przykładowy komunikat</p>
        <p className="mt-1 text-muted-foreground">{PRZYKLADOWY_KOMUNIKAT}</p>
      </div>

      <MigawkaBox>{MIGAWKA}</MigawkaBox>
    </main>
  )
}
