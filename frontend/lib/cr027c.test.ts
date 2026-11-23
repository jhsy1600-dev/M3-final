// CR-027 finish: bar and analysis-text colors follow the standard mockup (3 rules).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8").replace(/\r\n/g, "\n");
const rule = (start: string) => css.split("\n").find((l) => l.startsWith(start)) ?? "";

test("the three rules have the new values and not the old ones", () => {
  assert.match(rule(".mini-bars span {"), /background: #6f86ee;/);
  assert.ok(!rule(".mini-bars span {").includes("var(--blue)"));
  assert.match(rule(".mini-bars span i"), /color: var\(--muted\)/);
  assert.ok(!rule(".mini-bars span i").includes("#778198"));
  assert.match(rule(".insight-copy .insight-part p"), /color: #35445e/);
  assert.ok(!rule(".insight-copy .insight-part p").includes("#555e73"));
});
