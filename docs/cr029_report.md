# CR-029 개발 보고서: 작성 중 화면 이동 경고창 3버튼(이동 / 계획 제거 / 취소)

작성: 개발팀, 2026-11-24. 지시서: docs/cr029_dev_prompt.md. 로컬 커밋만 했고 push 하지 않았다.

## 1. 변경 파일
| 파일 | 내용 |
|---|---|
| `frontend/components/LeaveConfirmDialog.tsx` (신규) | 앱 안 대화상자. 버튼 순서 이동 / 계획 제거 / 취소. 열리면 취소에 초점, Esc = 취소, Tab/Shift+Tab 은 3버튼 안에서만 순환 |
| `frontend/lib/leaveGuard.ts` (신규) | React 없는 순수 로직: `shouldMoveWithoutDialog`, `resolveLeave(choice, proceed, deps)` |
| `frontend/components/LearningPathWizard.tsx` | `window.confirm` 제거. 가드가 대화상자를 열고, `discardedRef` 로 계획 제거 뒤 자동 보관 효과를 멈춤 |
| `frontend/app/page.tsx` | `go()` 가 이동 동작(`proceed`)을 가드에 넘김. 가드 타입 `(proceed) => boolean` |
| `frontend/lib/cr029.test.ts` (신규) | 테스트 8건 |

서버, DTO, sessionStorage 보관·복원 규칙, `hasProgress` 조건, CSS(새 규칙·새 색 없음)는 바꾸지 않았다.

## 2. 이동 보호 방식
`go()` 는 이동 동작을 `proceed` 함수로 만들어 가드에 넘긴다. 위저드가 등록한 가드는 보호할 것이 없으면(`hasProgress` 아님, 또는 `confirmStatus === "done"`) true 를 돌려 `go()` 가 바로 이동한다. 보호할 것이 있으면 `proceed` 를 상태(`pendingLeave`)에 보관하고 false 를 돌려 `go()` 는 멈추며 대화상자가 뜬다. 사용자가 "이동"이나 "계획 제거"를 고르면 위저드가 `proceed` 를 직접 호출하고, "취소"는 닫기만 한다. `go()` 를 쓰는 모든 경로(메뉴, 로고, 검색 이동, 화면 안 이동 버튼)가 같은 가드를 지난다. 대화상자는 전체 화면 backdrop(`z-index 15`)과 aria-modal 이라 떠 있는 동안 사이드바를 누를 수 없고, 초점도 대화상자 안에 갇힌다. **계획 제거:** `discardedRef` 를 먼저 true 로 해 자동 보관 효과가 다시 저장하지 못하게 한 뒤 `clearWizardDraft()` 를 부르고 이동한다. 이동하면 위저드가 사라지므로 상태가 초기화되고, 돌아오면 `loadWizardDraft()` 가 null 이라 빈 화면이다(별도의 상태 초기화 코드는 두지 않았다: 언마운트가 그 역할을 한다).

## 3. 기존 모달과 나란히 비교
| 항목 | `ConsentModal.tsx` | 새 대화상자 |
|---|---|---|
| 바깥 | `div.modal-backdrop` `role="dialog" aria-modal="true" aria-labelledby` | 같음(`aria-labelledby` 는 본문 `<p id>` 를 가리킴, 제목 없음) |
| 안쪽 | `section.modal` | 같음 |
| 본문 | `<p>` | `<p id="leave-dialog-text">` |
| 버튼 줄 | `div.modal-actions` | 같음 |
| 버튼 | 보조 `btn secondary`, 주 `btn` | 이동 `btn`(주), 계획 제거 `btn secondary`, 취소 `btn secondary` |
코드와 클래스 문자열 대조이며 눈으로 본 비교가 아니다.

## 4. 테스트와 빌드
- `npm run typecheck`: 통과.
- `npm test`: **270건 통과, 실패 0**(기준 262 + 새 8건).
- `npm run build`: **종료 코드 0**.
- 새 테스트: ① 3버튼 순서·role·aria-modal·본문(렌더 결과) ② 이동: 이동 호출, 초안 남음 ③ 계획 제거: 이동 호출, `loadWizardDraft()` null, 자동 보관 효과 차단 코드 확인 ④ 취소: 이동 안 함, 초안 남음 ⑤ Esc=취소(소스) ⑥ 내용 없음·저장 완료면 대화상자 없이 이동 ⑦ 초점이 취소에 놓임·Tab 순환(소스) ⑧ page.tsx 연결, `window.confirm` 제거.
- 한계: 이 프로젝트는 DOM 테스트가 없어 ②③④ 는 `resolveLeave` 를 실제 sessionStorage 대역과 함께 시험했고, ⑤⑦ 은 소스 문자열 대조다.

## 5. 미검증
- 브라우저에서 실제 동작(대화상자 표시, 초점이 취소에 놓이는지, Esc, Tab 순환, 이동·제거·취소 결과, 제거 뒤 되돌아와 빈 화면인지): 미검증.
- "계획 제거" 직후 자동 보관 효과가 되살리지 않는다는 것은 코드·함수 수준 확인이며 실제 화면에서는 미검증.
- 모달의 실제 시각(색, 버튼 3개 배치, 모바일 폭): 미검증. 배포 환경: 미검증.
