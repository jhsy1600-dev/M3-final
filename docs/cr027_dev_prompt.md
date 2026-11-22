# CR-027 개발 지시서: 전체 화면 색상 적용 (표준 목업 기준)

작성: PM, 2026-11-23. 근거: 변경관리 CR-027(`docs/change_management.md`), 색상 검토 `docs/cr027_palette_review.md`, 사용자 승인(2026-11-23). **표준 목업 `mockup/index.html` 이 새 색으로 교체되었다**(기존은 `mockup/archive/index_2026-11-23_before_CR-027.html`). 이 작업만 한다. 다른 CR 은 시작하지 않는다.

## 1. 목표와 범위
- 학습자 화면과 관리자 화면 전체에 목업의 새 색을 적용한다. **색만 바꾼다.**
- **바꾸지 않는 것:** 문구, 요소의 순서·위치·크기·간격, 글자 크기·글꼴, JSX 구조, 로직, 백엔드. 글자 크기 하한(CR-015)을 지킨다. **예외는 §2-1 의 브랜드 문구 세 가지뿐이다.**
- 목업의 색은 `mockup/index.html` 안의 **`<style>` 블록 두 개**로 정의되어 있다. 첫째 `/* CR-027 concept 3 ... */`(색 덮어쓰기 23줄, `!important` 사용), 둘째 `/* CR-027 fixes ... */`(보완 4줄: 경고색·오류색 변수, 입력창·보조 버튼 테두리). 두 블록 밖에서는 목업의 옛 색 값 1곳(`theme-color`)과 §2-1 의 브랜드 문구(사이드바 문구, `.brand em` 크기)만 달라졌다.

## 2. 해야 할 일
1. **두 블록을 `frontend/app/globals.css` 맨 끝에 같은 순서로 그대로 붙인다.** 선택자·속성·값·`!important` 를 바꾸지 않는다. 앞에 `/* CR-027 theme layer: copied from mockup/index.html, remove to revert */` 주석을 둔다. 기존 규칙은 지우지 않는다(되돌리기는 이 블록 삭제로 끝나야 한다).
2. 두 블록의 선택자가 **실제 앱의 요소에 맞는지 확인**한다. 목업과 앱의 클래스는 119개가 같다. 블록에 있으나 앱에 해당 요소가 없는 선택자, 앱에서 모양이 다르게 읽히는 선택자는 **고치지 말고 보고서에 목록으로** 적는다.
3. **실제 앱에만 있는 클래스 64개**는 블록에 규칙이 없다. 이 클래스들의 색을 새 팔레트에 맞춘다. 대상: `advice-title, block-small, bubble, code-block, combo, combo-list, combo-option, combo-toggle, consent-check, conversation-item, description, dot, edit-mode, error, eyebrow, gate, green, html, inline-confirm, insight-label, insight-part, light, long, minutes-field, minutes-unit, mode-banner, nav-soon, ok, plan-continued, plan-header-line, plan-week-group, plan-week-heading, pw-rules, resource-actions, resource-card, resource-checks, resource-desc, resource-form, resource-head, resource-pills, resource-section, resource-suggestion, resource-tags, resource-title, resource-url, returning-box, returning-text, returning-title, schedule-line, scope-label, search-links, search-links-block, selected, server-notice, soon-note, stack, status, task-edit-head, task-edit-row, task-no, task-remove, three, user, week-nav`.
   - 방법: 해당 규칙에 **옛 색 값을 직접 쓴 곳**(예: 옛 파랑·보라 `#4c62dc`, `#3549bd`, `#8064d7`, `#eef0ff`)이 있으면 새 값(CSS 변수 `var(--blue)` 등 또는 목업 블록이 쓰는 색)으로 바꾼다. 색 변수를 이미 쓰는 규칙은 변수가 새 값으로 바뀌므로 건드리지 않는다.
   - 의미 있는 색(오류=빨강 계열, 완료=초록 계열, 경고=주황 계열)을 유지한다. 규칙에서 `ok`, `error`, `green` 같은 상태 클래스는 목업의 완료·오류 색과 같은 계열로 맞춘다.
   - 입력칸·버튼 테두리는 목업의 보완 블록(`#7a87a8`)과 같은 값을 쓴다. 카드 구분선은 그대로 둔다.
4. 목업의 `theme-color`(`#f6f7fb` → `#e9edf8`)에 해당하는 설정이 앱에 있는지 확인한다(`frontend/app/layout.tsx` 에는 `themeColor` 가 없었다). 있으면 같은 값으로, 없으면 "없음"이라고 보고한다.
5. **적용 전에 `frontend/app/globals.css` 에서 위 클래스의 옛 색 값이 있던 줄을 보고서에 표로 남긴다**(클래스, 옛 값, 새 값). 목업과 앱 화면을 나란히 비교한 표도 필수다(§4).

## 2-1. 브랜드 문구 적용 (이 지시서에 합침, 2026-11-23 사용자 결정)
색 적용과 함께 아래 **두 곳의 문구와 한 곳의 스타일**만 바꾼다. 브랜드 슬로건은 "배움의 시작부터 완주까지, PaceMate가 함께합니다.", 헤더용 짧은 문구는 "내 페이스로, 끝까지"이다.
1. **사이드바 브랜드 아래 문구:** `frontend/app/page.tsx`(약 193행)의 `PaceMate<em>LEARN AT YOUR PACE</em>` 를 `PaceMate<em>내 페이스로, 끝까지</em>` 로 바꾼다(목업과 같다).
2. **그 문구의 스타일:** `globals.css` 의 `.brand em` 규칙(현재 `font-size: 9px; letter-spacing: 1.45px`는 영어 대문자용)을 목업과 같이 **`font-size: 11px; letter-spacing: .3px`** 로 바꾼다(나머지 속성은 그대로). 한글이 9px 로는 읽기 어렵고 글자 간격이 넓으면 어색하다. 사이드바 폭 안에서 줄바꿈 없이 들어가는지 확인한다(미확인이면 보고서에 적는다).
3. **페이지 설명(메타):** `frontend/app/layout.tsx` 의 `description: "AI 기반 개인 학습 플래너"` 를 다음 문장으로 바꾼다: `목표 설정과 학습 계획부터 실행 기록, 회고, 검토된 참고자료, AI 튜터까지. PaceMate는 독학 학습자의 처음부터 끝까지를 함께하는 AI 학습 파트너입니다.` (`title` 은 "PaceMate" 그대로)
- 이 세 가지 외의 문구·크기 변경은 하지 않는다. 기존 테스트에 `LEARN AT YOUR PACE` 나 옛 설명을 확인하는 곳이 있으면 새 문구로 고치고 보고한다(코드 검색 결과 앱 코드 외 참조는 문서 2건뿐이다).
- 새 테스트 1개를 더한다: 사이드바 문구와 메타 설명이 위 문자열과 같다.

## 3. 하지 않을 것
- 블록 안의 값이나 `!important` 를 정리·리팩터링하지 않는다. 옛 색 값을 변수로 일괄 정리하는 작업(색 변수화)은 이번 범위가 아니다.
- JSX, 텍스트, 폰트, 크기, 간격, 레이아웃 속성을 건드리지 않는다(색과 그림자 색만).
- 다크 모드를 만들지 않는다. 새 색을 임의로 만들지 않는다(목업에 없는 색이 필요하면 보고서에 적고 PM 결정을 기다린다).

## 4. 검증 요구
- `npm run typecheck`, `npm test`(기준 249건, 숫자를 보고서에 적는다), `npm run build` 종료 코드 0.
- 새 테스트 최소 1개: `globals.css` 에 두 블록의 표식 주석이 있고 순서가 맞다, 글자 크기 하한 테스트(CR-015)가 계속 통과한다.
- **목업과 화면 나란히 비교표(필수):** 화면 11개(동의 모달, 대시보드, 학습 경로 설정, 학습 과제 계획, 학습 실행 기록, 종합 학습 분석, AI 튜터, 내 정보·설정, 관리자 3개)별로 "목업의 어느 요소 → 앱의 어느 클래스 → 적용된 색". 브라우저로 확인하지 못한 화면은 "미검증"이라고 쓴다.
- 가능하면 `npm run dev` 로 첫 화면이 열리는지 확인한다. 브라우저 눈 확인은 사용자 몫이므로 하지 못했다면 숨기지 않는다.

## 5. [필수] 완료 조건
- 보고서를 `docs/cr027_report.md` 로 저장한다(변경 파일, 옛 색 → 새 색 표, 선택자 불일치 목록, 나란히 비교표, 테스트 수, 빌드 종료 코드, 미검증 항목).
- **로컬 커밋만 하고 push 하지 않는다.** 개인 파일(`frontend/AGENTS.md`, 변경관리내역서 hwp·pdf, `docs/프롬프트와 응답사례연구.md`)은 커밋에 넣지 않는다. 채팅에는 완료 여부, 테스트 통과 수, 빌드 종료 코드, 보고서 경로만 간단히 보고한다.
- 이 작업만 한다. 끝나면 멈추고 PM 검증과 사용자 지시를 기다린다.
