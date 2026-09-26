// N.1 completeness audit (GOD BOOK v2.39): every "(dawne X.Y)" item of the canonical Bible
// must have at least one row in docs/rejestr-pokrycia.md. Also reports Bible items missing
// from the per-module screen files (docs/zrodla/Tresc_Modul_*), which is where gaps like
// M13 7.7 and M12 8.8 were found. Exit code 1 when any Bible item has no register row.
import { readFileSync, readdirSync } from "node:fs";

const BIBLE = "docs/zrodla/Biblia_Offgrid_v2_0_Architektura_Modulowa.md";
const REGISTER = "docs/rejestr-pokrycia.md";

// Collects "P.N" ids, expanding ranges ("8.23-28", "8.29–8.36") and short lists ("8.17,18,19").
function idsIn(text) {
  const ids = new Set();
  const range = /(?<![\d.])(\d+)\.(\d+)(?:\s*[-–]\s*(?:\d+\.)?(\d+))?(?![\d.])/g;
  for (const m of text.matchAll(range)) {
    const a = Number(m[2]);
    let b = m[3] ? Number(m[3]) : a;
    if (b < a || b - a > 40) b = a;
    for (let n = a; n <= b; n++) ids.add(`${m[1]}.${n}`);
  }
  const list = /(?<![\d.])(\d+)\.(\d+)((?:,\s*\d+(?![\d.]))+)/g;
  for (const m of text.matchAll(list)) {
    ids.add(`${m[1]}.${m[2]}`);
    for (const n of m[3].match(/\d+/g)) ids.add(`${m[1]}.${n}`);
  }
  return ids;
}

const lines = readFileSync(BIBLE, "utf8").split("\n");
const starts = [];
lines.forEach((line, i) => {
  const m = line.match(/^## Moduł (\d+) \(Kafel/);
  if (m) starts.push({ mod: Number(m[1]), i });
});

const register = idsIn(readFileSync(REGISTER, "utf8"));
const tresc = Object.fromEntries(
  readdirSync("docs/zrodla")
    .map((f) => [f.match(/^Tresc_Modul_(\d+)_/)?.[1], f])
    .filter(([n]) => n)
    .map(([n, f]) => [Number(n), idsIn(readFileSync(`docs/zrodla/${f}`, "utf8"))]),
);

let missingTotal = 0;
starts.forEach(({ mod, i }, k) => {
  const section = lines.slice(i, starts[k + 1]?.i ?? lines.length).join("\n");
  const bible = [...section.matchAll(/\(dawne (\d+\.\d+)\)/g)].map((m) => m[1]);
  if (bible.length === 0) return;
  const noRow = bible.filter((id) => !register.has(id));
  const noTresc = tresc[mod] ? bible.filter((id) => !tresc[mod].has(id)) : [];
  missingTotal += noRow.length;
  console.log(
    `M${mod}: ${bible.length} pozycji Biblii` +
      (noRow.length ? ` — BEZ WIERSZA w rejestrze: ${noRow.join(", ")}` : " — komplet w rejestrze") +
      (noTresc.length ? ` | brak w Tresc_Modul_${mod}: ${noTresc.join(", ")}` : ""),
  );
});

if (missingTotal > 0) {
  console.error(`\nN.1: ${missingTotal} pozycji Biblii bez wiersza w ${REGISTER}.`);
  process.exit(1);
}
console.log("\nN.1: każda pozycja Biblii ma wiersz w rejestrze pokrycia.");
