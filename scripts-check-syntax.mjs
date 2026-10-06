// Verifies the emitted bundle really is ES2015 and free of syntax that older
// TV engines cannot parse. Run with: node scripts-check-syntax.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const acorn = createRequire(import.meta.url)('acorn');

const file = readdirSync('out/assets').find((f) => f.startsWith('app') && f.endsWith('.js'));
const code = readFileSync(`out/assets/${file}`, 'utf8');

const levels = [2020, 2019, 2017, 2015, 5].filter((v) => {
  try { acorn.parse(code, { ecmaVersion: v, sourceType: 'script', allowReturnOutsideFunction: true }); return true; }
  catch { return false; }
});
const lowest = levels.length ? `ES${levels[levels.length - 1]}` : 'none';

let ast;
try { ast = acorn.parse(code, { ecmaVersion: 2022, sourceType: 'script', allowReturnOutsideFunction: true }); }
catch (e) { console.error('PARSE FAIL:', e.message); process.exit(1); }

let optional = 0, nullish = 0, classFields = 0;
(function walk(n) {
  if (!n || typeof n !== 'object') return;
  if (Array.isArray(n)) return n.forEach(walk);
  if (n.optional === true) optional++;
  if (n.type === 'LogicalExpression' && n.operator === '??') nullish++;
  if (n.type === 'PropertyDefinition') classFields++;
  for (const k of Object.keys(n)) if (k !== 'type' && k !== 'start' && k !== 'end') walk(n[k]);
})(ast);

console.log(`${file}: lowest viable ${lowest}`);
console.log(`  optionalChaining=${optional} nullishCoalescing=${nullish} classFields=${classFields}`);
if (lowest !== 'ES2015' || optional || nullish || classFields) {
  console.error('  FAIL: bundle is not ES2015-clean'); process.exit(1);
}
console.log('  OK');
