/**
 * CR-029: logic of the "leave while writing" dialog, kept free of React so it can be tested.
 * The guard is asynchronous now: it either lets the move happen at once (returns true) or
 * opens the dialog and keeps the move as `proceed` until the user chooses.
 */
export type LeaveChoice = "move" | "discard" | "cancel";

export type LeaveState = { hasProgress: boolean; confirmStatus: string };

/** true = nothing to protect (no progress, or saved), move at once without a dialog. */
export function shouldMoveWithoutDialog(state: LeaveState): boolean {
  return !state.hasProgress || state.confirmStatus === "done";
}

export type LeaveDeps = {
  /** clearWizardDraft() */
  clearDraft: () => void;
  /** tell the draft-saving effect not to write again after the discard */
  markDiscarded: () => void;
  close: () => void;
};

/** Apply the user's choice. `proceed` performs the requested navigation. */
export function resolveLeave(choice: LeaveChoice, proceed: () => void, deps: LeaveDeps): void {
  if (choice === "cancel") {
    deps.close();
    return;
  }
  if (choice === "discard") {
    deps.markDiscarded();
    deps.clearDraft();
  }
  deps.close();
  proceed();
}
