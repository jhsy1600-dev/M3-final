// CR-027 follow-up: the leftover old colors of the listed rules are replaced by the PM's table values.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\r\n/g, "\n");
const rule = (start: string) => {
  const line = css.split("\n").find((l) => l.startsWith(start));
  assert.ok(line, `rule ${start}`);
  return line;
};

test("the listed rules no longer contain their old color values", () => {
  const old: Record<string, string[]> = {
    ".mode-pill {": ["#edf0ff", "#4b56c8"],
    ".mode-pill.edit-mode": ["#fff3dc", "#93661e"],
    ".timer-panel {": ["#e5e8f2", "#fafbff"],
    ".record-delete": ["#a45d66"],
    ".stat small": ["#a0a6b4"],
    ".stat strong small": ["#a0a6b4"],
    ".bar-label": ["#8991a3"],
    ".mini-bars span {": ["#c6ceff"],
    ".mini-days": ["#778198"],
    ".scope-note": ["#778198"],
    ".goal-switch small": ["#778198"],
    ".insight-copy > p": ["#555e73"],
    ".insight-copy > small": ["#8990a1"],
    ".modal ul": ["#586277"],
    "ul {": ["#586277"],
  };
  for (const [sel, colors] of Object.entries(old)) for (const c of colors) assert.ok(!rule(sel).includes(c), `${sel} still has ${c}`);
  assert.ok(!rule("button:focus-visible").includes("#bdc7ff"));
});

test("the new values are the table's", () => {
  assert.match(rule(".mode-pill {"), /background: var\(--lav\); color: var\(--blue-dark\)/);
  assert.match(rule(".mode-pill.edit-mode"), /background: #fff0dc; color: var\(--orange\)/);
  assert.match(rule(".timer-panel {"), /border: 1px solid var\(--line\)[^}]*background: var\(--white\)/);
  assert.match(rule(".record-delete"), /color: var\(--red\)/);
  assert.match(rule(".mini-bars span {"), /background: var\(--blue\)/);
  assert.match(rule(".insight-copy > p"), /color: #35445e/);
  assert.match(rule("button:focus-visible"), /outline: 3px solid var\(--blue\)/);
});

test("the theme layer is untouched: still last and still colors only", () => {
  const layer = css.slice(css.indexOf("/* CR-027 theme layer"));
  assert.ok(layer.includes("CR-027 concept 3") && layer.includes("CR-027 fixes"));
  assert.ok(css.indexOf("brand-slogan") < css.indexOf("/* CR-027 theme layer"));
});
