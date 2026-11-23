/** MNT-002: the "과제 완료 처리" / "완료 취소" button of the execution screen, as pure functions. */

export function doneButtonLabel(status: string): string {
  return status === "completed" ? "완료 취소" : "과제 완료 처리";
}

/** The status the button asks for: completed <-> pending (the same values the dashboard checkbox sends). */
export function nextTaskStatus(status: string): "completed" | "pending" {
  return status === "completed" ? "pending" : "completed";
}

export type CompletionDeps = {
  /** PATCH /api/tasks/{id} with the body; rejects on failure. */
  patch: (path: string, body: { status: "completed" | "pending" }) => Promise<unknown>;
  /** Reload the screen's data (tasks, stats). Called only after a successful PATCH. */
  reload: () => Promise<void>;
  /** Text for a failure (the API's own message when it has one). */
  errorText: (error: unknown) => string;
};

export type CompletionResult = { ok: true } | { ok: false; message: string };

export async function changeTaskCompletion(deps: CompletionDeps, taskId: string, currentStatus: string): Promise<CompletionResult> {
  try {
    await deps.patch(`/api/tasks/${taskId}`, { status: nextTaskStatus(currentStatus) });
  } catch (error) {
    return { ok: false, message: deps.errorText(error) };
  }
  await deps.reload();
  return { ok: true };
}
