# MNT-002 개발 지시서: 학습 실행 기록 화면의 과제 완료 처리 버튼 (목업에 있으나 앱에 없음)

작성: PM, 2026-11-23. 근거: `docs/operations_maintenance_log.md` MNT-002. 운영유지보수(오류) 작업이므로 변경관리 CR 과 개발 완료보고서에 올리지 않는다. 이 작업만 한다. MNT-001 지시서(`docs/mnt001_dev_prompt.md`)는 **열어 보거나 시작하지 않는다**(같은 화면이라 순서대로 따로 낸다).

## 1. 배경
표준 목업 `mockup/index.html` 의 학습 실행 기록 화면 과제 카드에는, 기록 목록 아래에 **"과제 완료 처리"(완료된 과제는 "완료 취소") 링크 버튼**이 있다(`<div class="task-record-controls" style="margin-top:8px"><button type="button" class="link-btn task-done">`). 앱 `frontend/components/ExecutionScreen.tsx` 에는 이 버튼이 구현된 적이 없고 상태 글자(`완료`/`진행 중`)만 있다. 완료 처리는 대시보드 "오늘의 추천 과제"(이번 주 과제만)에서만 가능해서, 시간을 기록하는 화면에서 완료를 누르지 못하고 다른 주·미래 시작 학습의 과제는 완료할 곳이 없다.
서버 API 는 이미 있다: `PATCH /api/tasks/{id}`, 본문 `{ "status": "completed" | "pending" }`(`Dashboard.tsx` 의 `toggleTask` 가 같은 호출을 한다). **서버·DTO 는 바꾸지 않는다.**

## 2. 해야 할 일
1. `ExecutionScreen.tsx` 과제 카드(`task-record-group`)의 기록 목록(`task-records`) **아래**, 목업과 같은 위치에 `<div className="task-record-controls" style={{ marginTop: 8 }}>` 와 그 안의 `<button type="button" className="link-btn task-done">` 를 둔다. 글자: 완료 전 **"과제 완료 처리"**, 완료 후 **"완료 취소"**(목업과 같은 문구).
2. 동작: 누르면 `PATCH /api/tasks/${task.id}` 로 `status` 를 `completed` ↔ `pending` 으로 바꾼다. 요청 중에는 그 버튼만 비활성화한다. **성공하면 목록을 다시 불러와**(기존 `load()` 가 쓰이는 방식) 과제의 `완료`/`진행 중` 글자와 위쪽 통계("진행 중 과제" 개수)가 갱신되게 한다. 실패하면 기존 저장 오류 표시(`saveError` 등)와 같은 방식으로 오류를 보이고 다시 누를 수 있게 한다(조용히 삼키지 않는다).
3. **다른 학습의 과제**(학습 전환 후)와 **전체 기간 보기**에서도 같은 버튼이 나온다(카드가 보이면 버튼도 보인다).
4. 타이머가 그 과제에서 돌고 있어도 완료 처리는 막지 않는다(타이머 로직은 건드리지 않는다).
5. 새 CSS 는 만들지 않는다(목업에 `.task-done` 전용 규칙이 없고 `.link-btn`, `.task-record-controls` 가 이미 있다).

## 3. 하지 않을 것
서버, DTO, 대시보드의 완료 토글, 진행률 정의(완료 과제 수 ÷ 전체 과제 수), 달성률 상한 처리(MNT-001, 별도), 색·크기·레이아웃의 다른 변경, 문구 변경.

## 4. 검증 요구
- `npm run typecheck`, `npm test`(기준 258건), `npm run build` 종료 코드 0. 숫자 보고.
- **목업과 앱 나란히 비교표(필수):** 목업의 이 버튼 위치·문구·상태 변화 ↔ 앱의 해당 요소. 눈으로 못 봤으면 "미검증".
- 새 테스트: 버튼 문구가 상태에 따라 "과제 완료 처리"/"완료 취소", 누르면 `PATCH /api/tasks/{id}` 가 올바른 `status` 로 호출됨, 성공 후 재조회, 실패 시 오류 표시와 재시도 가능.

## 5. [필수] 완료 조건
- 보고서 `docs/mnt002_report.md`(변경 파일, 나란히 비교표, 테스트 수, 빌드 종료 코드, 미검증). **로컬 커밋만 하고 push 하지 않는다.** 개인 파일(`frontend/AGENTS.md`, 변경관리내역서 hwp·pdf, `docs/프롬프트와 응답사례연구.md`)은 커밋하지 않는다. 채팅에는 완료 여부, 테스트 수, 빌드 종료 코드, 보고서 경로만 간단히 보고한다. 끝나면 멈춘다.
