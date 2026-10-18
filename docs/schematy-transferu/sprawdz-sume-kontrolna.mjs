// Sprawdza pole `sumaKontrolna` pliku transferu: SHA-256 z kanonicznego JSON pola `dane`.
// Użycie: node docs/schematy-transferu/sprawdz-sume-kontrolna.mjs <plik.json> [--wypisz]
//   bez --wypisz: kod wyjścia 0 = suma zgodna, 1 = niezgodna / błąd.
//   z --wypisz: tylko wypisuje obliczoną sumę (do wpisania przy tworzeniu przykładu).
// Kanonizacja zgodna z RFC 8785 (JCS) dla danych złożonych z liczb, napisów, true/false/null,
// tablic i obiektów: klucze sortowane rosnąco po kodach UTF-16, brak białych znaków,
// liczby w zapisie ECMAScript (taki zapis daje JSON.stringify). Nie używaj w `dane` NaN,
// Infinity ani -0. Wymaga wyłącznie Node (moduł crypto), bez zależności.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

function kanon(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(kanon).join(",") + "]";
  const klucze = Object.keys(v).sort();
  return "{" + klucze.map((k) => JSON.stringify(k) + ":" + kanon(v[k])).join(",") + "}";
}

export function sumaKontrolna(dane) {
  return createHash("sha256").update(kanon(dane), "utf8").digest("hex");
}

const [, , plik, flaga] = process.argv;
if (plik) {
  const obj = JSON.parse(readFileSync(plik, "utf8"));
  const obliczona = sumaKontrolna(obj.dane);
  if (flaga === "--wypisz") {
    console.log(obliczona);
  } else if (obliczona === obj.sumaKontrolna) {
    console.log("OK: suma kontrolna zgodna");
  } else {
    console.error(`BŁĄD: suma kontrolna niezgodna (w pliku ${obj.sumaKontrolna}, obliczona ${obliczona})`);
    process.exit(1);
  }
}
