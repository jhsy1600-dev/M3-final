"use client";

import { useEffect, useRef } from "react";

import type { LeaveChoice } from "@/lib/leaveGuard";

export const LEAVE_DIALOG_TEXT =
  "작성 중인 학습 경로·계획이 있습니다. 이동해도 이 탭에서는 내용이 보관되어 돌아오면 이어서 쓸 수 있습니다. 완전히 지우려면 '계획 제거'를 누르세요. 탭을 닫으면 사라집니다.";

/** CR-029: in-app 3-button dialog (이동 / 계획 제거 / 취소). Focus starts on 취소; Esc = 취소. */
export function LeaveConfirmDialog({ onChoose }: { onChoose: (choice: LeaveChoice) => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const moveRef = useRef<HTMLButtonElement>(null);
  const discardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onChoose("cancel");
      return;
    }
    if (e.key === "Tab") {
      // Keep focus inside the dialog.
      const order = [moveRef.current, discardRef.current, cancelRef.current].filter(Boolean) as HTMLButtonElement[];
      const i = order.indexOf(document.activeElement as HTMLButtonElement);
      const next = e.shiftKey ? (i <= 0 ? order.length - 1 : i - 1) : i === -1 || i === order.length - 1 ? 0 : i + 1;
      e.preventDefault();
      order[next]?.focus();
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="leave-dialog-text" onKeyDown={onKeyDown}>
      <section className="modal">
        <p id="leave-dialog-text">{LEAVE_DIALOG_TEXT}</p>
        <div className="modal-actions">
          <button type="button" className="btn" ref={moveRef} onClick={() => onChoose("move")}>
            이동
          </button>
          <button type="button" className="btn secondary" ref={discardRef} onClick={() => onChoose("discard")}>
            계획 제거
          </button>
          <button type="button" className="btn secondary" ref={cancelRef} onClick={() => onChoose("cancel")}>
            취소
          </button>
        </div>
      </section>
    </div>
  );
}
