#!/usr/bin/env node
/**
 * i18n guard, second layer (docs/standards/17-i18n.md 17.9; docs/wklad-do-standardu.md, 05.10.2026):
 * every value that reaches a `*Key` parameter or a `*Key` property must be an EXISTING key of the
 * PL, EN and RU dictionaries — not just key-shaped.
 *
 * `check-i18n-guard.mjs` (AST only) matches functions by name and checks only the key's format, so it
 * is blind to import aliases, re-exports, constants, variables, `a ? "X" : "Y"` and typos
 * (`POLE-KUBATRA`). Here the TypeScript compiler is the source of truth:
 *   - the called function comes from `getResolvedSignature` (aliases, re-exports, methods resolve);
 *   - the argument's value is evaluated to the set of strings it can take: from its type (a literal,
 *     `const`, `as const` member, union of literals), else by following its sources — `const`/`let`
 *     (every assignment), imported constants, `TABLE[x]`, `TABLE[x].prop`, `TABLE.find(...).prop`,
 *     `for (const [a, b] of TABLE)`, `Object.entries(TABLE)`, `a ? b : c`, `a ?? b`, template literals
 *     with `.toUpperCase()`/`.toLowerCase()`, and calls (callee parameters bound to the arguments,
 *     every `return` evaluated) — each resulting string must be a key in PL, EN and RU;
 *   - a value built from a parameter of the enclosing function (`${field.toUpperCase()}-NIEDODATNI`,
 *     `kody.lifepo4`) is evaluated once per call site, climbing through callers that only pass the
 *     parameter on (up to 4 levels);
 *   - a value that cannot be computed statically is a FAILURE unless one of the explicit rules
 *     below vouches for it (each counted in the summary, never a silent "OK"):
 *       (P) a bare parameter of the enclosing function — the arguments at all its call sites are
 *           checked the same way (transitively, until nothing new appears); a function with no call
 *           site in scope has nothing to check;
 *       (D) a property access `x.fooKey` — every place that writes a `fooKey` property in an object
 *           literal is checked by this script;
 *       (W) an entry of WYJATKI below (file + text of the expression + reason + the keys it can
 *           take, which are still checked against PL/EN/RU; an unused entry is a failure).
 *
 * Scope: non-test `.ts`/`.tsx` in `lib/`, `app/`, `components/`. Parameter/property names in
 * NIE_I18N are `*Key` names that are not translation keys (storage keys etc.).
 */
import ts from "typescript"
import path from "node:path"

const ROOT = process.cwd()
const ZAKRES = ["lib/", "app/", "components/"]
const NIE_I18N = new Set(["storageKey", "cacheKey", "apiKey", "sortKey", "queryKey", "idempotencyKey", "rowKey", "supabaseKey", "publicKey"])
/**
 * Explicit exceptions for values not computable statically: `${file}::${expression text}` →
 * { powod, klucze }. The keys the value can take are listed by hand and STILL checked against
 * PL/EN/RU — an exception only replaces the evaluation, never the existence check.
 */
const PROTOKOLY_BMS = ["CAN", "RS485", "MODBUS", "PYLONTECH", "INNY"].map((id) => `UI-STALEBAT-PROTOKOL-${id}`)
const POWOD_BMS = "protocol id comes from the input (string); kluczProtokolu() maps ids of PROTOKOLY to keys and passes an unknown id through on purpose (t() then shows ⚠ [id], never a silent fallback) — keys listed = PROTOKOLY ids, update when PROTOKOLY changes"
const WYJATKI = new Map([
  ["lib/core/modules/baterie/komunikacja-bms/warnings.ts::kluczProtokolu(bms)", { powod: POWOD_BMS, klucze: PROTOKOLY_BMS }],
  ["lib/core/modules/baterie/komunikacja-bms/warnings.ts::kluczProtokolu(falownik)", { powod: POWOD_BMS, klucze: PROTOKOLY_BMS }],
  ["lib/core/modules/baterie/komunikacja-bms/warnings.ts::kluczProtokolu(protokol)", { powod: POWOD_BMS, klucze: PROTOKOLY_BMS }],
])
const uzyteWyjatki = new Set()

const configPath = ts.findConfigFile(ROOT, ts.sys.fileExists, "tsconfig.json")
const config = ts.getParsedCommandLineOfConfigFile(configPath, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} })
const program = ts.createProgram({ rootNames: config.fileNames, options: { ...config.options, incremental: false, noEmit: true } })
const checker = program.getTypeChecker()

const rel = (sf) => path.relative(ROOT, sf.fileName).split(path.sep).join("/")
const wZakresie = (sf) => {
  const r = rel(sf)
  return ZAKRES.some((z) => r.startsWith(z)) && !r.includes("__tests__") && !/\.test\.tsx?$/.test(r) && !sf.isDeclarationFile
}

// --- dictionary key sets (from the compiler's view of the dictionary objects) ---------------------
function eksport(plik, nazwa) {
  const sf = program.getSourceFile(path.join(ROOT, plik))
  if (!sf) throw new Error(`missing ${plik}`)
  const sym = checker.getExportsOfModule(checker.getSymbolAtLocation(sf)).find((s) => s.name === nazwa)
  if (!sym) throw new Error(`missing export ${nazwa} in ${plik}`)
  return checker.getTypeOfSymbolAtLocation(sym, sf)
}
const klucze = { pl: new Set(), en: new Set(), ru: new Set() }
const dodaj = (jezyk, typ) => typ.getProperties().forEach((p) => klucze[jezyk].add(p.name))
dodaj("pl", eksport("lib/i18n/dictionary-pl.ts", "dictionaryPl"))
dodaj("en", eksport("lib/i18n/dictionary-en.ts", "dictionaryEn"))
dodaj("ru", eksport("lib/i18n/dictionary-ru.ts", "dictionaryRu"))
// UI dictionaries: `czesciUi` is an `as const` tuple of modules, each exporting pl/en/ru.
const czesci = eksport("lib/i18n/ui/index.ts", "czesciUi")
for (const czesc of checker.getTypeArguments(czesci)) {
  for (const jezyk of ["pl", "en", "ru"]) {
    const p = czesc.getProperty(jezyk)
    if (p) dodaj(jezyk, checker.getTypeOfSymbol(p))
  }
}
if (klucze.pl.size < 1000) throw new Error(`suspiciously few PL keys (${klucze.pl.size}) — dictionary discovery broke`)

// --- value evaluation -----------------------------------------------------------------------------
/** Literal values of an expression's type, or null when not computable statically. */
function wartosci(expr) {
  const typ = checker.getTypeAtLocation(expr)
  const czlony = typ.isUnion() ? typ.types : [typ]
  const wynik = []
  for (const c of czlony) {
    if (c.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) continue
    if (c.isStringLiteral()) wynik.push(c.value)
    else return null
  }
  return wynik
}

const jestKluczem = (nazwa) => nazwa.length > 3 && nazwa.endsWith("Key") && !NIE_I18N.has(nazwa)

/** Parameter declaration an identifier refers to (also for shorthand `{ labelKey }`). */
function parametr(expr) {
  if (!ts.isIdentifier(expr)) return null
  const sym = ts.isShorthandPropertyAssignment(expr.parent) && expr.parent.name === expr
    ? checker.getShorthandAssignmentValueSymbol(expr.parent)
    : checker.getSymbolAtLocation(expr)
  const decl = sym?.valueDeclaration
  return decl && ts.isParameter(decl) && ts.isIdentifier(decl.name) ? decl : null
}
function regulaD(expr) {
  return (ts.isPropertyAccessExpression(expr) || ts.isPropertyAccessChain?.(expr)) && jestKluczem(expr.name.text)
}

const odpakuj = (e) => {
  while (e && (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isNonNullExpression(e) || ts.isSatisfiesExpression?.(e) || ts.isTypeAssertionExpression(e))) e = e.expression
  return e
}
/** Symbol an identifier refers to — through shorthand properties and import aliases / re-exports. */
function symbol(id) {
  const s = ts.isShorthandPropertyAssignment(id.parent) && id.parent.name === id ? checker.getShorthandAssignmentValueSymbol(id.parent) : checker.getSymbolAtLocation(id)
  return s && s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s
}
/** Object/array literal an expression stands for (through `const` variables, also imported ones). */
function literal(e) {
  e = odpakuj(e)
  if (e && ts.isIdentifier(e)) {
    const d = symbol(e)?.valueDeclaration
    return d && ts.isVariableDeclaration(d) && d.initializer && ts.getCombinedNodeFlags(d) & ts.NodeFlags.Const ? literal(d.initializer) : null
  }
  return e && (ts.isObjectLiteralExpression(e) || ts.isArrayLiteralExpression(e)) ? e : null
}
const wartosciLiteralu = (lit) =>
  ts.isObjectLiteralExpression(lit)
    ? lit.properties.map((p) => (ts.isPropertyAssignment(p) ? p.initializer : null))
    : lit.elements.map((el) => (ts.isSpreadElement(el) ? null : el))
/** Object literals `x` may stand for: `TABLE` or every entry of `TABLE[i]`. */
function obiekty(x) {
  x = odpakuj(x)
  const lit = literal(x)
  if (lit) return [lit]
  if (ts.isIdentifier(x)) {
    const d = symbol(x)?.valueDeclaration
    return d && ts.isVariableDeclaration(d) && d.initializer && ts.getCombinedNodeFlags(d) & ts.NodeFlags.Const ? obiekty(d.initializer) : null
  }
  if (ts.isCallExpression(x) && ts.isPropertyAccessExpression(x.expression) && x.expression.name.text === "find") {
    const tab = literal(x.expression.expression)
    if (!tab || !ts.isArrayLiteralExpression(tab)) return null
    const wpisy = tab.elements.map((w) => literal(w))
    return wpisy.every(Boolean) ? wpisy : null
  }
  if (ts.isElementAccessExpression(x)) {
    const tab = literal(x.expression)
    if (!tab) return null
    const wpisy = wartosciLiteralu(tab).map((w) => (w ? literal(w) : null))
    return wpisy.every(Boolean) ? wpisy : null
  }
  return null
}
const nazwaWlasciwosci = (p) => p.name.getText().replace(/^["']|["']$/g, "")

/**
 * Where a non-literal value comes from: the expressions it is built from, followed through `const`
 * variables, `let` with all its assignments, `for (const [a, b] of TABLE)`, `Object.entries(TABLE)`,
 * `TABLE[x]`, `obj.prop`, `TABLE[x].prop`, `a ? b : c`, `a ?? b`. null = cannot be traced.
 */
function zrodla(e) {
  if (ts.isConditionalExpression(e)) return [e.whenTrue, e.whenFalse]
  if (ts.isBinaryExpression(e) && [ts.SyntaxKind.QuestionQuestionToken, ts.SyntaxKind.BarBarToken].includes(e.operatorToken.kind)) return [e.left, e.right]
  if (ts.isIdentifier(e)) {
    const sym = symbol(e)
    const d = sym?.valueDeclaration
    if (!d) return null
    if (ts.isVariableDeclaration(d) && ts.isIdentifier(d.name)) {
      if (ts.getCombinedNodeFlags(d) & ts.NodeFlags.Const) return d.initializer ? [d.initializer] : null
      // `let`: the initializer plus every assignment in the enclosing scope.
      const wynik = d.initializer ? [d.initializer] : []
      const zakres = ts.findAncestor(d, (n) => ts.isFunctionLike(n) || ts.isSourceFile(n))
      const szukaj = (n) => {
        if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isIdentifier(n.left) && symbol(n.left) === sym) wynik.push(n.right)
        else if ((ts.isBinaryExpression(n) && ts.isIdentifier(n.left) && symbol(n.left) === sym && n.operatorToken.kind !== ts.SyntaxKind.EqualsToken && n.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && n.operatorToken.kind <= ts.SyntaxKind.LastAssignment) ||
          ((ts.isPrefixUnaryExpression(n) || ts.isPostfixUnaryExpression(n)) && ts.isIdentifier(n.operand) && symbol(n.operand) === sym)) wynik.push(null)
        ts.forEachChild(n, szukaj)
      }
      szukaj(zakres)
      return wynik.length ? wynik : null
    }
    if (ts.isBindingElement(d) && ts.isArrayBindingPattern(d.parent)) {
      const indeks = d.parent.elements.indexOf(d)
      const decl = d.parent.parent
      const petla = decl?.parent?.parent
      if (!ts.isVariableDeclaration(decl) || !petla || !ts.isForOfStatement(petla)) return null
      const iter = odpakuj(petla.expression)
      if (ts.isCallExpression(iter) && iter.expression.getText() === "Object.entries") {
        const obj = literal(iter.arguments[0])
        if (!obj || !ts.isObjectLiteralExpression(obj) || indeks !== 1) return null
        return wartosciLiteralu(obj)
      }
      const tab = literal(iter)
      if (!tab || !ts.isArrayLiteralExpression(tab)) return null
      return tab.elements.map((w) => {
        const krotka = literal(w)
        return krotka && ts.isArrayLiteralExpression(krotka) ? krotka.elements[indeks] ?? null : null
      })
    }
    return null
  }
  if (ts.isElementAccessExpression(e)) {
    const lit = literal(e.expression)
    return lit ? wartosciLiteralu(lit) : null
  }
  if (ts.isPropertyAccessExpression(e)) {
    const obj = obiekty(e.expression)
    if (!obj || !obj.every(ts.isObjectLiteralExpression)) return null
    return obj.map((o) => o.properties.find((p) => ts.isPropertyAssignment(p) && nazwaWlasciwosci(p) === e.name.text)?.initializer ?? null)
  }
  return null
}

const ZMIANA_WIELKOSCI = { toUpperCase: (s) => s.toUpperCase(), toLowerCase: (s) => s.toLowerCase() }
const iloczyn = (czesci) => czesci.reduce((acc, zb) => acc.flatMap((a) => zb.map((b) => a + b)), [""])

/**
 * Every string `e` can evaluate to, or null. `env` binds parameters to their possible values (a call
 * site's arguments); a parameter outside `env` is recorded in `ctx.parametry`, any other dead end
 * sets `ctx.inne` — so the caller knows whether evaluating per call site can still succeed.
 */
function ewaluuj(e, env, ctx, glebokosc = 0) {
  e = odpakuj(e)
  if (glebokosc > 12) return void (ctx.inne = true), null
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return [e.text]
  if (ts.isIdentifier(e)) {
    const d = symbol(e)?.valueDeclaration
    if (d && ts.isParameter(d)) {
      if (env.has(d)) return ewaluuj(env.get(d).expr, env.get(d).env, ctx, glebokosc + 1)
      const typ = wartosci(e)
      if (typ) return typ
      ctx.parametry.add(d)
      return null
    }
  }
  const typ = wartosci(e)
  if (typ) return typ
  if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(odpakuj(e.expression))) {
    const d = symbol(odpakuj(e.expression))?.valueDeclaration
    if (d && ts.isParameter(d)) {
      if (!env.has(d)) return ctx.parametry.add(d), null
      const { expr, env: envArg } = env.get(d)
      const obj = obiekty(expr)
      const pola = obj?.every(ts.isObjectLiteralExpression)
        ? obj.map((o) => o.properties.find((p) => ts.isPropertyAssignment(p) && nazwaWlasciwosci(p) === e.name.text)?.initializer ?? null)
        : null
      return pola ? zbierz(pola, envArg, ctx, glebokosc) : (void (ctx.inne = true), null)
    }
  }
  if (ts.isTemplateExpression(e)) {
    const czesci = [[e.head.text]]
    let ok = true
    for (const span of e.templateSpans) {
      const w = ewaluuj(span.expression, env, ctx, glebokosc + 1)
      if (!w) ok = false
      else czesci.push(w.map(String))
      czesci.push([span.literal.text])
    }
    return ok ? iloczyn(czesci) : null
  }
  if (ts.isCallExpression(e)) {
    const callee = e.expression
    if (ts.isPropertyAccessExpression(callee) && ZMIANA_WIELKOSCI[callee.name.text] && e.arguments.length === 0) {
      const w = ewaluuj(callee.expression, env, ctx, glebokosc + 1)
      return w && w.map(ZMIANA_WIELKOSCI[callee.name.text])
    }
    // A call: bind the callee's parameters to the arguments, evaluate every `return`.
    const d = checker.getResolvedSignature(e)?.declaration
    if (!d || !d.body) return void (ctx.inne = true), null
    const env2 = new Map(env)
    d.parameters.forEach((p, i) => e.arguments[i] && env2.set(p, { expr: e.arguments[i], env }))
    const zwroty = []
    if (!ts.isBlock(d.body)) zwroty.push(d.body)
    else {
      const szukaj = (n) => {
        if (ts.isFunctionLike(n)) return
        if (ts.isReturnStatement(n)) zwroty.push(n.expression ?? null)
        ts.forEachChild(n, szukaj)
      }
      ts.forEachChild(d.body, szukaj)
    }
    return zbierz(zwroty, env2, ctx, glebokosc)
  }
  const z = zrodla(e)
  if (!z) return void (ctx.inne = true), null
  return zbierz(z, env, ctx, glebokosc)
}
function zbierz(wyrazenia, env, ctx, glebokosc) {
  if (!wyrazenia.length || !wyrazenia.every(Boolean)) return void (ctx.inne = true), null
  const wynik = new Set()
  let ok = true
  for (const w of wyrazenia) {
    const v = ewaluuj(w, env, ctx, glebokosc + 1)
    if (v) v.forEach((x) => wynik.add(x))
    else ok = false
  }
  return ok ? [...wynik] : null
}

const bledy = new Set()
const stat = { sprawdzone: 0, P: 0, D: 0, T: 0, S: 0, W: 0 }
/** Parameters whose value ends up in a key slot — their call-site arguments are checked too. */
const kluczoweParametry = new Set()
/** Key expressions built from parameters of the enclosing function — evaluated per call site. */
const odroczone = []
const gdzieJest = (n) => {
  const sf = n.getSourceFile()
  return `${rel(sf)}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}`
}
function sprawdzKlucze(wart, miejsce, gdzie) {
  for (const k of wart) {
    stat.sprawdzone++
    if (k === "") continue
    const brak = ["pl", "en", "ru"].filter((j) => !klucze[j].has(k))
    if (brak.length) bledy.add(`${miejsce} — ${gdzie}: key "${k}" missing in ${brak.join("/").toUpperCase()}`)
  }
}

/** The one function whose parameters blocked an evaluation, if nothing else did. */
function funkcjaParametrow(ctx) {
  const f = new Set([...ctx.parametry].map((p) => p.parent))
  return !ctx.inne && f.size === 1 ? [...f][0] : null
}

function sprawdz(expr, gdzie) {
  const e = odpakuj(expr)
  const miejsce = gdzieJest(expr)
  const wart = wartosci(e)
  if (wart !== null) return sprawdzKlucze(wart, miejsce, gdzie)
  const param = parametr(e)
  if (param) {
    kluczoweParametry.add(param)
    return void stat.P++
  }
  if (regulaD(e)) return void stat.D++
  const wyjatek = `${rel(e.getSourceFile())}::${e.getText()}`
  if (WYJATKI.has(wyjatek)) {
    uzyteWyjatki.add(wyjatek)
    stat.W++
    return sprawdzKlucze(WYJATKI.get(wyjatek).klucze, miejsce, `${gdzie} (exception)`)
  }
  const ctx = { parametry: new Set(), inne: false }
  const v = ewaluuj(e, new Map(), ctx)
  if (v) {
    stat.T++
    return sprawdzKlucze(v, miejsce, gdzie)
  }
  const fn = funkcjaParametrow(ctx)
  if (fn) return void odroczone.push({ e, fn, miejsce, gdzie })
  bledy.add(`${miejsce} — ${gdzie}: value not computable statically (\`${e.getText()}\`) — make it a literal/const or add an explicit exception`)
}

/** Every call argument with its parameter declaration, resolved by the compiler. */
const argumenty = []
/** Every call, keyed by the declaration the compiler resolved it to. */
const wywolania = new Map()
for (const sf of program.getSourceFiles()) {
  if (!wZakresie(sf)) continue
  const visit = (node) => {
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      const sygnatura = checker.getResolvedSignature(node)
      const params = sygnatura?.getParameters() ?? []
      if (sygnatura?.declaration) wywolania.set(sygnatura.declaration, [...(wywolania.get(sygnatura.declaration) ?? []), node])
      ;(node.arguments ?? []).forEach((arg, i) => {
        const decl = params[i]?.valueDeclaration
        if (!decl || !ts.isParameter(decl) || decl.dotDotDotToken || ts.isSpreadElement(arg)) return
        argumenty.push({ sf, arg, decl })
        if (jestKluczem(params[i].name)) sprawdz(arg, `argument \`${params[i].name}\``)
      })
    }
    if (ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) && jestKluczem(node.name.text)) {
      sprawdz(node.initializer, `property \`${node.name.text}\``)
    }
    if (ts.isShorthandPropertyAssignment(node) && jestKluczem(node.name.text)) {
      sprawdz(node.name, `property \`${node.name.text}\``)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}
// Follow parameters that feed a key slot back to their call sites, until nothing new appears.
const sprawdzoneArgumenty = new Set()
for (let rozmiar = -1; rozmiar !== kluczoweParametry.size; ) {
  rozmiar = kluczoweParametry.size
  for (const a of argumenty) {
    if (sprawdzoneArgumenty.has(a) || !kluczoweParametry.has(a.decl)) continue
    sprawdzoneArgumenty.add(a)
    if (jestKluczem(a.decl.name.text)) continue // already checked in the first pass
    sprawdz(a.arg, `argument \`${a.decl.name.text}\` (flows into a key)`)
  }
}

for (const w of WYJATKI.keys()) if (!uzyteWyjatki.has(w)) bledy.add(`WYJATKI: stale exception "${w}" — the expression no longer exists, remove it`)

// Keys built from a parameter (`${field.toUpperCase()}-NIEDODATNI`): evaluate once per call site,
// climbing through callers that only pass the parameter on (`checkCount(field)` → `notPositive(field)`).
function rozwin(o, fn, envDla, lancuch) {
  const miejscaWywolan = wywolania.get(fn) ?? []
  if (!miejscaWywolan.length) {
    bledy.add(`${o.miejsce} — ${o.gdzie}: built from parameters of a function with no resolvable call site (\`${o.e.getText()}\`) — make it a literal/const or add an explicit exception`)
    return
  }
  for (const wyw of miejscaWywolan) {
    // `envDla(outer)` builds the env of the key expression once the caller's own env is known.
    const zbuduj = (outer) => envDla(new Map(fn.parameters.map((p, i) => [p, wyw.arguments?.[i]]).filter(([, a]) => a).map(([p, a]) => [p, { expr: a, env: outer }])))
    const ctx = { parametry: new Set(), inne: false }
    const v = ewaluuj(o.e, zbuduj(new Map()), ctx)
    const sciezka = [gdzieJest(wyw), ...lancuch].join(" → ")
    if (v) {
      stat.S++
      sprawdzKlucze(v, `${sciezka} → ${o.miejsce}`, o.gdzie)
      continue
    }
    const wyzej = funkcjaParametrow(ctx)
    if (wyzej && lancuch.length < 4) rozwin(o, wyzej, zbuduj, [gdzieJest(wyw), ...lancuch])
    else bledy.add(`${sciezka} — ${o.gdzie} at ${o.miejsce}: argument not computable statically (\`${wyw.getText().slice(0, 80)}\`) — make it a literal/const or add an explicit exception`)
  }
}
for (const o of odroczone) rozwin(o, o.fn, (env) => env, [])

if (bledy.size) {
  console.error(`check:i18n-keys — ${bledy.size} problem(s):\n` + [...bledy].map((b) => "  " + b).join("\n"))
  process.exit(1)
}
console.log(
  `check:i18n-keys OK — ${stat.sprawdzone} key value(s) exist in PL/EN/RU; traced: ${stat.P} parameter(s) followed to their call sites, ${stat.T} value(s) evaluated through const/let/table/loop/conditional/template/call, ${stat.S} parameter-built key(s) evaluated per call site; vouched by rule: ${stat.D} (D: *Key property), ${stat.W} (W: explicit exception).`,
)
