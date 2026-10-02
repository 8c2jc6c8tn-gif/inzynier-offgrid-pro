/** Currency settings (`components/waluta-wybor.tsx`, section in `app/ustawienia/page.tsx`). */
export const pl = {
  "UI-WAL-TYTUL": "Waluta wyświetlania",
  "UI-WAL-OPIS": "Kwoty wyników (koszty, rachunki, zwroty) pokazujemy w wybranej walucie, przeliczone z PLN. Stawki i opłaty w danych to polskie stawki w PLN — zmienia się tylko sposób pokazania wyniku. Pola, w które wpisujesz kwoty, nadal przyjmują PLN.",
  "UI-WAL-WYBOR": "Waluta",
  "UI-WAL-NARZUT": "Narzut na kursie (%)",
  "UI-WAL-NARZUT-OPIS": "Poszerza kurs jak spread karty lub kantoru (kurs × (1 + narzut)). Domyślnie 0 — czysty kurs referencyjny.",
  "UI-WAL-KURS-RECZNY": "Własny kurs: ile {waluta} za 1 PLN (puste = kurs automatyczny)",
  "UI-WAL-ZRODLO": "Kursy automatyczne: referencyjne kursy Europejskiego Banku Centralnego (api.frankfurter.dev). Revolut nie udostępnia publicznego API kursów — jeśli chcesz kurs Revolut, wpisz go ręcznie powyżej (ewentualnie dodaj narzut).",
  "UI-WAL-STAN-KURSOW": "Kursy z dnia {data} (pobrano {pobrano}).",
  "UI-WAL-BRAK-KURSU": "Brak kursu dla {waluta} — kwoty pokazujemy w PLN. Połącz się z internetem albo wpisz kurs ręcznie.",
  "UI-WAL-ODSWIEZ": "Odśwież kursy",
  "UI-WAL-ODSWIEZONO": "Kursy odświeżone.",
  "UI-WAL-ODSWIEZ-BLAD": "Nie udało się pobrać kursów (offline?) — używam ostatnich zapisanych.",
  "UI-WAL-RECZNY-TYLKO": "Dla {waluta} nie ma kursu automatycznego — wpisz kurs ręcznie.",
} as const

export const en: Record<keyof typeof pl, string> = {
  "UI-WAL-TYTUL": "Display currency",
  "UI-WAL-OPIS": "Result amounts (costs, bills, refunds) are shown in the chosen currency, converted from PLN. The rates and fees in the data are Polish PLN rates — only how the result is displayed changes. Fields where you type amounts still take PLN.",
  "UI-WAL-WYBOR": "Currency",
  "UI-WAL-NARZUT": "Rate markup (%)",
  "UI-WAL-NARZUT-OPIS": "Widens the rate like a card or exchange-office spread (rate × (1 + markup)). Default 0 — the plain reference rate.",
  "UI-WAL-KURS-RECZNY": "Own rate: how many {waluta} per 1 PLN (empty = automatic rate)",
  "UI-WAL-ZRODLO": "Automatic rates: European Central Bank reference rates (api.frankfurter.dev). Revolut offers no public rates API — if you want the Revolut rate, enter it by hand above (optionally add a markup).",
  "UI-WAL-STAN-KURSOW": "Rates of {data} (fetched {pobrano}).",
  "UI-WAL-BRAK-KURSU": "No rate for {waluta} — amounts are shown in PLN. Go online or enter a rate by hand.",
  "UI-WAL-ODSWIEZ": "Refresh rates",
  "UI-WAL-ODSWIEZONO": "Rates refreshed.",
  "UI-WAL-ODSWIEZ-BLAD": "Could not fetch rates (offline?) — using the last saved ones.",
  "UI-WAL-RECZNY-TYLKO": "There is no automatic rate for {waluta} — enter one by hand.",
}

export const ru: Record<keyof typeof pl, string> = {
  "UI-WAL-TYTUL": "Валюта отображения",
  "UI-WAL-OPIS": "Суммы результатов (затраты, счета, возвраты) показываются в выбранной валюте, пересчитанной из PLN. Ставки и платежи в данных — польские, в PLN; меняется только способ показа результата. Поля, куда вы вводите суммы, по-прежнему принимают PLN.",
  "UI-WAL-WYBOR": "Валюта",
  "UI-WAL-NARZUT": "Наценка на курс (%)",
  "UI-WAL-NARZUT-OPIS": "Расширяет курс, как спред карты или обменного пункта (курс × (1 + наценка)). По умолчанию 0 — чистый справочный курс.",
  "UI-WAL-KURS-RECZNY": "Свой курс: сколько {waluta} за 1 PLN (пусто = автоматический курс)",
  "UI-WAL-ZRODLO": "Автоматические курсы: справочные курсы Европейского центрального банка (api.frankfurter.dev). У Revolut нет публичного API курсов — если нужен курс Revolut, введите его вручную выше (при желании добавьте наценку).",
  "UI-WAL-STAN-KURSOW": "Курсы на {data} (загружены {pobrano}).",
  "UI-WAL-BRAK-KURSU": "Нет курса для {waluta} — суммы показаны в PLN. Подключитесь к интернету или введите курс вручную.",
  "UI-WAL-ODSWIEZ": "Обновить курсы",
  "UI-WAL-ODSWIEZONO": "Курсы обновлены.",
  "UI-WAL-ODSWIEZ-BLAD": "Не удалось загрузить курсы (офлайн?) — используются последние сохранённые.",
  "UI-WAL-RECZNY-TYLKO": "Для {waluta} нет автоматического курса — введите курс вручную.",
}
