# MNT-002 개발 보고서: 학습 실행 기록 화면의 과제 완료 처리 버튼

작성: 개발팀, 2026-11-23. 지시서: docs/mnt002_dev_prompt.md. 운영유지보수(오류) 작업이라 변경관리 CR 로 올리지 않았다. 로컬 커밋만 했고 push 하지 않았다. MNT-001 지시서는 열지 않았다.

## 1. 변경 파일
| 파일 | 내용 |
|---|---|
| `frontend/components/ExecutionScreen.tsx` | 과제 카드(`task-record-group`)의 기록 목록(`task-records`) 아래에 `<div className="task-record-controls" style={{ marginTop: 8 }}>` + `<button type="button" className="link-btn task-done">` 추가. 글자는 완료 전 "과제 완료 처리", 완료 후 "완료 취소". `toggleDone(task)` 와 상태 `completingId` 추가(요청 중 **그 과제의 버튼만** 비활성화) |
| `frontend/lib/taskCompletion.ts` (신규) | 순수 함수: `doneButtonLabel`, `nextTaskStatus`(completed↔pending), `changeTaskCompletion`(PATCH 후 성공 때만 재조회, 실패는 메시지 반환) |
| `frontend/lib/mnt002.test.ts` (신규) | 테스트 4건 |

서버, DTO, 대시보드 완료 토글, 진행률 정의, 타이머 로직, CSS, 문구는 바꾸지 않았다. 새 CSS 없음(`.link-btn`, `.task-record-controls` 기존 규칙 사용).

## 2. 동작
- 누르면 `PATCH /api/tasks/{id}`, 본문 `{ "status": "completed" | "pending" }`(대시보드 `toggleTask` 와 같은 호출, 현재 상태의 반대 값).
- 성공하면 기존 `load()` 로 다시 불러온다(저장·삭제 후와 같은 방식). 그래서 과제의 `완료`/`진행 중` 글자와 위쪽 통계("진행 중 과제" 개수)가 서버 값으로 갱신된다. `load()` 가 잠깐 "불러오는 중…" 을 보이는 것도 기존 저장·삭제 후와 같다.
- 실패하면 PATCH 를 하고 재조회는 하지 않으며, 기존 `saveError`(목록 위 빨간 안내, `role="alert"`)로 메시지를 보인다. 버튼은 다시 활성화되어 다시 누를 수 있다.
- 카드가 보이면 버튼도 보인다: 다른 학습으로 전환한 뒤의 과제, "전체 기간" 보기 모두 같은 카드 코드를 쓴다(조건 없음).
- 타이머가 그 과제에서 돌고 있어도 완료 처리를 막는 조건을 넣지 않았다(타이머 코드는 손대지 않음).

## 3. 목업 ↔ 앱 나란히 비교
| 항목 | 목업(`mockup/index.html`, `renderActivity`) | 앱 |
|---|---|---|
| 위치 | `task-records` 닫힌 직후, `</article>` 직전 | 같은 자리(기록 목록 `</div>` 다음, `</article>` 앞) |
| 요소 | `<div class="task-record-controls" style="margin-top:8px"><button type="button" class="link-btn task-done">` | `<div className="task-record-controls" style={{ marginTop: 8 }}><button type="button" className="link-btn task-done">` |
| 문구 | 완료 전 "과제 완료 처리", 완료 후 "완료 취소" | 같음 |
| 상태 변화 | 누르면 완료 여부 반전, 진행 중 과제 수 갱신 | PATCH 후 재조회로 `완료`/`진행 중` 글자와 "진행 중 과제" 개수 갱신 |
| 요청 중 | (목업은 서버 없음) | 그 과제의 버튼만 비활성화 |
눈으로 본 비교가 아니라 코드와 목업 HTML 문자열의 대조다.

## 4. 테스트와 빌드
- `npm run typecheck`: 통과.
- `npm test`: **262건 통과, 실패 0**(기준 258 + 새 4건).
- `npm run build`: **종료 코드 0**.
- 새 테스트: ① 라벨이 상태에 따라 "과제 완료 처리"/"완료 취소" ② 누르면 `PATCH /api/tasks/{id}` 가 올바른 `status`(pending→completed, completed→pending)로 호출되고 성공 뒤 재조회 ③ 실패 시 메시지를 돌려주고 재조회하지 않으며 다시 시도하면 성공 ④ 화면 코드에서 버튼 위치·클래스·인라인 스타일, 요청 중 그 과제만 비활성화, `saveError` 로 오류 표시, `reload: load` 연결(소스 문자열 대조).
- 한계: 이 프로젝트의 테스트는 DOM 없이 노드에서 돌아서, 버튼을 실제로 클릭하는 시험은 하지 않았다. 클릭 동작은 ②③의 함수 시험과 ④의 연결 확인으로 갈음했다.

## 5. 미검증
- 브라우저에서 실제로 누르기: 완료·취소 전환, 통계 갱신, 전체 기간 보기, 다른 학습 전환 후, 실패 때의 오류 표시와 재시도, 타이머가 도는 과제에서의 동작 — 모두 미검증.
- 실제 서버(`PATCH /api/tasks/{id}`)에 대한 호출: 하지 않음(기존 대시보드와 같은 호출이라 서버 변경은 없음).
- 모바일 화면에서 링크 버튼의 터치 크기: 미확인.
- 배포 환경: 미검증.

개인 파일은 커밋에 넣지 않았고 다른 작업은 하지 않았다.
