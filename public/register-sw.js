// Rejestracja service workera jako zewnętrzny skrypt (nie inline, nie zależny od hydracji
// Reacta) — docs/standards/05-baza-danych-offline.md, 5.3. Włączany warunkowo (tylko produkcja)
// w app/layout.tsx, tym samym wzorcem co <Analytics />.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
}
