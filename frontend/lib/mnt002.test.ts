// MNT-002: the task completion button of the execution screen.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { changeTaskCompletion, doneButtonLabel, nextTaskStatus } from "./taskCompletion";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const errorText = (e: unknown) => (e instanceof Error ? e.message : "완료 상태를 바꾸지 못했습니다.");

test("the label follows the status", () => {
  assert.equal(doneButtonLabel("pending"), "과제 완료 처리");
  assert.equal(doneButtonLabel("in_progress"), "과제 완료 처리");
  assert.equal(doneButtonLabel("completed"), "완료 취소");
});

test("pressing it asks for completed <-> pending on PATCH /api/tasks/{id}, then reloads", async () => {
  const calls: string[] = [];
  const deps = {
    patch: async (path: string, body: { status: string }) => void calls.push(`PATCH ${path} ${body.status}`),
    reload: async () => void calls.push("reload"),
    errorText,
  };
  assert.deepEqual(await changeTaskCompletion(deps, "t1", "pending"), { ok: true });
  assert.deepEqual(await changeTaskCompletion(deps, "t2", "completed"), { ok: true });
  assert.deepEqual(calls, ["PATCH /api/tasks/t1 completed", "reload", "PATCH /api/tasks/t2 pending", "reload"]);
  assert.equal(nextTaskStatus("completed"), "pending");
});

test("a failed PATCH reports the message, does not reload, and can be tried again", async () => {
  let fail = true;
  const calls: string[] = [];
  const deps = {
    patch: async () => {
      calls.push("patch");
      if (fail) throw new Error("서버 오류");
    },
    reload: async () => void calls.push("reload"),
    errorText,
  };
  assert.deepEqual(await changeTaskCompletion(deps, "t1", "pending"), { ok: false, message: "서버 오류" });
  assert.deepEqual(calls, ["patch"]);
  fail = false;
  assert.deepEqual(await changeTaskCompletion(deps, "t1", "pending"), { ok: true });
  assert.deepEqual(calls, ["patch", "patch", "reload"]);
});

test("the screen puts the button under the record list in task-record-controls, disables only that button while sending, shows errors via saveError", () => {
  const src = read("../components/ExecutionScreen.tsx").replace(/\s+/g, " ");
  assert.match(src, /아직 기록이 없습니다\.<\/p>\} <\/div> <div className="task-record-controls" style=\{\{ marginTop: 8 \}\}> <button type="button" className="link-btn task-done" onClick=\{\(\) => toggleDone\(task\)\} disabled=\{completingId === task\.id\}> \{doneButtonLabel\(task\.status\)\} <\/button> <\/div> <\/article>/);
  assert.match(src, /if \(!result\.ok\) setSaveError\(result\.message\)/);
  assert.match(src, /reload: load/);
});
