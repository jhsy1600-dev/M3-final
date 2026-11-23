import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { LeaveConfirmDialog } from "../components/LeaveConfirmDialog";
import { resolveLeave, shouldMoveWithoutDialog } from "./leaveGuard";

// Minimal sessionStorage so the real wizardStorage functions can be used.
const store = new Map<string, string>();
(globalThis as unknown as { sessionStorage: unknown }).sessionStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};
import { clearWizardDraft, loadWizardDraft, saveWizardDraft } from "./wizardStorage";

function run(choice: "move" | "discard" | "cancel") {
  saveWizardDraft({ field: "x" });
  let moved = false;
  let discarded = false;
  let closed = false;
  resolveLeave(choice, () => (moved = true), {
    clearDraft: clearWizardDraft,
    markDiscarded: () => (discarded = true),
    close: () => (closed = true),
  });
  return { moved, discarded, closed, draft: loadWizardDraft() };
}

test("① three buttons in order 이동 / 계획 제거 / 취소", () => {
  const html = renderToStaticMarkup(createElement(LeaveConfirmDialog, { onChoose: () => {} }));
  const labels = [...html.matchAll(/<button[^>]*>([^<]+)<\/button>/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["이동", "계획 제거", "취소"]);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.ok(html.includes("작성 중인 학습 경로·계획이 있습니다. 이동해도 이 탭에서는 내용이 보관되어"));
});

test("② 이동: navigates and the draft stays", () => {
  const r = run("move");
  assert.equal(r.moved, true);
  assert.equal(r.closed, true);
  assert.notEqual(r.draft, null);
});

test("③ 계획 제거: navigates, draft null, save effect told to stop", () => {
  const r = run("discard");
  assert.equal(r.moved, true);
  assert.equal(r.discarded, true);
  assert.equal(r.draft, null);
  const wiz = readFileSync(new URL("../components/LearningPathWizard.tsx", import.meta.url), "utf8");
  assert.match(wiz, /if \(discardedRef\.current\) return;\s*\n\s*const snapshot/);
});

test("④ 취소: stays, draft kept", () => {
  const r = run("cancel");
  assert.equal(r.moved, false);
  assert.equal(r.closed, true);
  assert.notEqual(r.draft, null);
});

test("⑤ Esc = 취소 (source)", () => {
  const src = readFileSync(new URL("../components/LeaveConfirmDialog.tsx", import.meta.url), "utf8");
  assert.match(src, /e\.key === "Escape"[\s\S]{0,80}onChoose\("cancel"\)/);
});

test("⑥ no dialog when nothing to protect or already saved", () => {
  assert.equal(shouldMoveWithoutDialog({ hasProgress: false, confirmStatus: "idle" }), true);
  assert.equal(shouldMoveWithoutDialog({ hasProgress: true, confirmStatus: "done" }), true);
  assert.equal(shouldMoveWithoutDialog({ hasProgress: true, confirmStatus: "idle" }), false);
});

test("⑦ focus starts on 취소, trapped in dialog (source)", () => {
  const src = readFileSync(new URL("../components/LeaveConfirmDialog.tsx", import.meta.url), "utf8");
  assert.match(src, /cancelRef\.current\?\.focus\(\)/);
  assert.match(src, /e\.key === "Tab"/);
  assert.match(src, /ref=\{cancelRef\}/);
});

test("guard wiring: page.tsx passes proceed; wizard has no window.confirm", () => {
  const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /leaveGuard\.current\(proceed\)/);
  const wiz = readFileSync(new URL("../components/LearningPathWizard.tsx", import.meta.url), "utf8");
  assert.ok(!wiz.includes("window.confirm"));
});
