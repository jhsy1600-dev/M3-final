// CR-027: the mockup's two color blocks are copied to the end of globals.css (colors only), plus the brand wording.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8").replace(/\r\n/g, "\n");

test("globals.css ends with the theme layer: marker, concept 3 block, fixes block, in that order", () => {
  const css = read("../app/globals.css");
  const layer = css.indexOf("/* CR-027 theme layer: copied from mockup/index.html, remove to revert */");
  const concept = css.indexOf("/* CR-027 concept 3:");
  const fixes = css.indexOf("/* CR-027 fixes");
  assert.ok(layer > 0 && concept > layer && fixes > concept, "marker order");
  assert.equal(css.indexOf("/* CR-027 theme layer"), css.lastIndexOf("/* CR-027 theme layer"), "only once");
  assert.ok(css.includes("--blue:#3155d9") && css.includes("--red:#8f1d2c") && css.includes("border-color:#7a87a8!important"));
});

test("the theme layer sets colors only: no font-size, margin, padding or letter-spacing (CR-015 floor stays)", () => {
  const css = read("../app/globals.css");
  const layer = css.slice(css.indexOf("/* CR-027 theme layer"));
  assert.ok(!/font-size|font-weight|margin|padding|letter-spacing|display\s*:|width|height/.test(layer.replace(/\/\*.*?\*\//g, "")));
});

test("the sidebar brand line and the page description use the new wording; .brand em is 11px / .3px", () => {
  assert.match(read("../app/page.tsx"), /PaceMate<em>내 페이스로, 끝까지<\/em>/);
  assert.ok(!read("../app/page.tsx").includes("LEARN AT YOUR PACE"));
  assert.match(
    read("../app/layout.tsx"),
    /description: "목표 설정과 학습 계획부터 실행 기록, 회고, 검토된 참고자료, AI 튜터까지\. PaceMate는 독학 학습자의 처음부터 끝까지를 함께하는 AI 학습 파트너입니다\.",/,
  );
  assert.match(read("../app/layout.tsx"), /title: "PaceMate",/);
  const rule = read("../app/globals.css").split("\n").find((l) => l.startsWith(".brand em"));
  assert.ok(rule && /font-size: 11px; letter-spacing: \.3px/.test(rule));
});

test("status colors keep their meaning: error is the red variable, ok/done the green one", () => {
  const css = read("../app/globals.css");
  assert.match(css, /\.error \{ color: var\(--red\)/);
  assert.match(css, /\.dot\.ok \{ background: var\(--green\)/);
  assert.match(css, /\.save-status \{[^}]*color: var\(--green\)/);
});
