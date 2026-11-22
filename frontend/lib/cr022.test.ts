// CR-022: the estimated-minutes input of a plan-preview task shows the unit "분" next to it.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { TaskMinutesInput } from "../components/TaskMinutesInput";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("the minutes input shows a visible 분 right after the number input and keeps its aria-label", () => {
  const html = renderToStaticMarkup(createElement(TaskMinutesInput, { value: 900, onChange: () => {} }));
  assert.match(html, /value="900"/);
  assert.match(html, /aria-label="예상 학습 시간\(분\)"/);
  assert.match(html, /<input[^>]*>\s*<span class="minutes-unit"[^>]*>분<\/span>/);
});

test("an empty (NaN) value renders an empty input, the unit is still there", () => {
  const html = renderToStaticMarkup(createElement(TaskMinutesInput, { value: Number.NaN, onChange: () => {} }));
  assert.match(html, /value=""/);
  assert.match(html, />분<\/span>/);
});

test("the wizard uses the component and the unit text keeps the 12px floor (CR-015)", () => {
  assert.match(read("../components/LearningPathWizard.tsx"), /<TaskMinutesInput /);
  const rule = read("../app/globals.css").split("\n").find((l) => l.startsWith(".minutes-unit"));
  assert.ok(rule && /font-size: 12px/.test(rule));
});
