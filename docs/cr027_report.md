# CR-027 개발 보고서: 표준 목업의 새 색 적용 + 브랜드 문구 네 곳(§2-1 의 4번 포함, 지시서 개정 반영)

작성: 개발팀, 2026-11-23. 지시서: docs/cr027_dev_prompt.md. 로컬 커밋만 했고 push 하지 않았다.

## 1. 변경 파일
| 파일 | 내용 |
|---|---|
| `frontend/app/globals.css` | ① 맨 끝에 `/* CR-027 theme layer: copied from mockup/index.html, remove to revert */` 주석 + 목업의 `<style>` 두 블록(`concept 3` 23줄, `fixes` 4줄)을 **그대로** 붙임(스크립트로 목업 본문과 문자열 일치 확인). ② 앱 전용 클래스 옛 색 값 교체(§2) ③ `.brand em` 크기·간격 ④ **(§2-1 4번)** `.heading .brand-slogan` 규칙과 `@media (min-width: 1200px)` 규칙을 목업과 같은 값으로 추가(테마 층 **앞**에 두어 테마 층이 계속 맨 끝) |
| `frontend/app/page.tsx` | 사이드바 문구 `LEARN AT YOUR PACE` → `내 페이스로, 끝까지` |
| `frontend/components/Dashboard.tsx` | **(§2-1 4번)** `heading` 안, 인사말 `<div>` 와 `＋ 학습 경로 만들기` 버튼 사이에 `<p className="brand-slogan">배움의 시작부터 완주까지,<br />PaceMate가 함께합니다.</p>` 추가(이 화면에만) |
| `frontend/app/layout.tsx` | `description` 을 지시서의 문장으로 교체(`title` "PaceMate" 그대로) |
| `frontend/lib/cr027.test.ts` (신규) | 테스트 5건 |
| `frontend/lib/levelSelection.test.ts` | 옛 색 `#d9dcec` 를 확인하던 한 줄을 새 값 `#cbd4e6` 로 수정(이 CR 의 색 변경에 따른 테스트 수정, 로직 변경 없음) |

JSX 구조, 로직, 백엔드, 글꼴, 간격, 크기(§2-1 의 `.brand em` 제외)는 바꾸지 않았다. 기존 규칙은 지우지 않았다. 두 블록 안의 선택자·값·`!important` 는 손대지 않았다.
`theme-color` 에 해당하는 설정: 앱에 **없음**(`layout.tsx` 에 `themeColor`/`theme-color` 없음, 검색 확인). 그래서 추가하지 않았다.

## 2. 옛 색 → 새 색 (적용 전 줄 기록, 앱 전용 클래스)
| 클래스 | 옛 값 | 새 값 | 근거 |
|---|---|---|---|
| `.nav-soon` (어두워진 사이드바 위) | 글자 `#9aa0b0`, 배경 `#f1f2f6` | `#aebcda`, `#263958` | 블록의 사이드바 색(`.nav-title`, `.nav-item:hover`) |
| `.block-small` | `#a0a6b4` | `#53627a` | 블록의 `--muted` |
| `.bubble small` | `#7e879b` | `#53627a` | `--muted` |
| `.conversation-item:hover` 테두리 | `#d9def4` | `#aabaff` | 블록의 `.conversation-item.active` 테두리 |
| `.error` | `#c65361` | `var(--red)` (= `#8f1d2c`) | 오류=빨강 계열 유지 |
| `.save-status.error` | `#c65361` | `var(--red)` | 〃 |
| `.save-status` | `#248160` | `var(--green)` (= `#18794e`) | 완료=초록 계열 유지 |
| `.pw-rules li[data-ok=true] strong` | `#248160` | `var(--green)` | 〃 |
| `.pw-rules li[data-ok=false] strong` | `#c65361` | `var(--red)` | 〃 |
| `.pw-rules` 글자 | `#586277` | `#35445e` | 블록의 본문 글자(`td`) |
| `.dot` | `#f1ae4d` | `var(--orange)` (= `#a34a08`) | 경고=주황 계열 |
| `.dot.ok` | `#22c55e` | `var(--green)` | 완료=초록 |
| `.status` | 배경 `#f6f8fc`, 글자 `#475569` | `#f5f3fb`, `#35445e` | 블록의 `.chip` 배경·글자 |
| `.returning-text` | `#586277` | `#35445e` | 본문 글자 |
| `.scope-label` | `#4b5ed2` | `#2449c4` | 블록의 `.goal-switch label` 색 |
| `.task-edit-row` 테두리 | `#d9dcec` | `#cbd4e6` | `--line` |
| `.task-edit-row` 안 input/textarea/select 테두리 | `#e2e5ed` | `#7a87a8` | 보완 블록의 입력칸 테두리 |
| `.soon-note` | `#a8aebd` | `var(--muted)` | `--muted` |
| `.plan-week-heading` 아래선 | `#eff0f4` | `#d9deeb` | 블록의 `.wbs-row` 구분선 |
| `.plan-continued` 배경 | `#f6f7fb` | `#f4f2fb` | 블록의 `.task` 배경 |
| `.resource-desc` | `#555e73` | `#35445e` | 본문 글자 |
| `.resource-suggestion` 배경 | `#f6f7ff` | `#f5f3fb` | 블록의 `.chip` 배경 |
| `.composer input` 테두리 | `var(--line)` | `#7a87a8` | 입력칸 테두리 |
| `.searchbar` 테두리 | `var(--line)` | `#7a87a8` | 〃 |
| `.goal-switch select` 테두리 | `#c6ceff` | `#7a87a8` | 〃 |
| `.brand em` | `font-size: 9px; letter-spacing: 1.45px` | `11px; .3px` | §2-1 |

- `.save-status`, `.save-status.error`, `.searchbar`, `.composer input`, `.goal-switch select` 는 지시서의 64개 목록에 없던 규칙이다(CR-013 이후 추가된 앱 전용 규칙과 공용 입력칸). 같은 종류(상태 색, 입력칸 테두리)라서 같이 고쳤다. 원치 않으면 위 옛 값으로 되돌릴 수 있다.
- 앱에서 블록이 이미 `!important` 로 덮는 클래스(`.bubble`, `.bubble.user`, `.code-block`, `.conversation-item(.active)`, `.mode-banner`, `.insight-label`, `.record-entry.selected`, `.light` 등)는 옛 값을 남겨 두었다. 결과 화면은 블록 색이다.
- 색 변수(`var(--blue)` 등)를 이미 쓰는 앱 전용 규칙(`.eyebrow`, `.combo-*`, `.task-no`, `.returning-box`, `.minutes-unit` 등)은 변수가 새 값으로 바뀌므로 건드리지 않았다.
- **되돌리기 주의:** 지시서 §2-3 대로 앱 전용 규칙의 값을 직접 고쳤기 때문에, 블록 삭제만으로는 위 표의 값이 옛 값으로 돌아가지 않는다. 완전한 되돌리기는 이 표 또는 `git revert` 로 한다.

## 3. 선택자 불일치 목록 (고치지 않고 보고)
- 블록에는 있으나 **앱에 해당 요소가 없는** 선택자: `.level`, `.level.done`, `.level.current`, `.level.target`(앱에는 `.level-desc` 만 있고 `.level` 요소는 없음), `.level-pick`, `.level-pick.sel`, `.role-switch`, `.session-group`, `.session-row`. 적용될 대상이 없을 뿐 해는 없다.
- 블록의 클래스 71개 중 앱 소스에서 이름 자체가 보이지 않는 것은 `level-pick`, `role-switch`, `session-group`, `session-row` 4개다.

## 4. 이번 범위에서 옛 색이 남은 곳 (PM 결정 요청)
블록도 덮지 않고 지시서 목록에도 없어서 그대로 두었다. 목업에 대응 색이 정해져 있지 않아 임의로 만들지 않았다(지시서 §3).
`.mode-pill`(`#edf0ff`/`#4b56c8`), `.mode-pill.edit-mode`(`#fff3dc`/`#93661e`), `.timer-panel`(`#e5e8f2`/`#fafbff`), `.record-delete`(`#a45d66`), `.stat small`(`#a0a6b4`), `.bar-label`(`#8991a3`), `.mini-bars span`(`#c6ceff`), `.mini-days`·`.scope-note`·`.goal-switch small`(`#778198`), `.insight-copy > p`(`#555e73`)·`> small`(`#8990a1`), 전역 `ul`·`.modal ul`(`#586277`), 포커스 외곽선(`#bdc7ff`). PM 이 값을 정해 주면 같은 방식으로 적용한다.

## 5. 목업 ↔ 앱 나란히 비교 (클래스 단위, 코드 대조만. 브라우저 눈 확인은 모두 미검증)
| 화면 | 목업 요소 → 앱 클래스 | 적용된 색 | 확인 |
|---|---|---|---|
| 공통 틀 | 사이드바 `.sidebar`, 로고 `.brand-icon`, 메뉴 `.nav-item(.active)`, 상단 `.topbar`, `.crumb` | 사이드바 `#182944`, 활성 `#344f82`, 로고 그라데이션 `#4778ff→#9a52d6`, 상단 `#e2e8f5ee` | 코드 대조. 화면 미검증 |
| 동의 모달 | `.modal`(앱 전용 흰 바탕), `.btn`, `.consent-check`, `.returning-box`(변수), `.pw-rules` | 버튼 `#3155d9`, 입구 상자 `--blue/--lav`, 규칙 목록 `--green/--red` | 코드 대조. 미검증 |
| 대시보드 | `.stat:nth-child(1~4)`, `.stat-icon`, `.progress-card`, `.bar span`, `.task`, `.coach`, `.day(.hit/.now)`, `.goal-row.clickable:hover` | 통계 4색 `#eef1ff/#f2eaff/#e5f5ed/#fff0dc`, 진행 바 `#3155d9→#8a45d1`, 코치 `#2448bf→#7135b8` | 코드 대조. 미검증 |
| 학습 경로 설정 | `.field input`, `.chip(.on)`, `.tab.active`, `.task-edit-row`(앱), `.btn.secondary`, `.goal-switch` | 입력칸 테두리 `#7a87a8`, 칩 `#f5f3fb`, 선택 `#e1e7ff/#9eafff` | 코드 대조. 미검증 |
| 학습 과제 계획 | `.wbs-row`, `.wbs-date`, `.weekday-select`, `.plan-week-heading`/`.plan-continued`(앱), `.save-status`(앱) | 구분선 `#d9deeb`, 날짜 `#2449c4`, 저장 상태 `--green` | 코드 대조. 미검증 |
| 학습 실행 기록 | `.record-entry(.selected)`, `.task-progress-line`, `.insight-card`, `.insight-label`, `.mode-pill`(앱, 옛 색 남음) | 기록 `#f0eff7`, 선택 `#e3e9ff`, 인사이트 `#e8e4ff→#e0edff` | 코드 대조. 미검증 |
| 종합 학습 분석 | `.stat`, `.bar`, `.mini-bars`(옛 색 남음), `.goal-row`, `.pill` | `.bar` `#cbd4e8`, pill `#d9f1e5/#145c3b` | 코드 대조. 미검증 |
| AI 튜터 | `.conversation-item(.active)`, `.bubble(.user)`, `.code-block`, `.composer input`(앱) | 말풍선 `#e9e8f2`, 사용자 `#3155d9`, 입력 테두리 `#7a87a8` | 코드 대조. 미검증 |
| 내 정보·설정 | `.card`, `.field`, `.btn(.danger)`, `.pw-rules`, `.status`, `.dot(.ok)` | 카드 `#faf8ff`, 위험 버튼 `#fde8eb/#9f1d31` | 코드 대조. 미검증 |
| 관리자(사용자·피드백) | `table th/td`, `.admin-banner`, `.pill`, `.tab` | 표 구분선 `#d9deeb`, 배너 `#ffebcf/#713800` | 코드 대조. 미검증 |
| 관리자(참고자료) | `.resource`, `.resource-card/-desc/-suggestion/-url`(앱), `.pill.gold/.blue/.gray` | 설명 `#35445e`, 제안 상자 `#f5f3fb`, 링크 `#2449c4` | 코드 대조. 미검증 |

## 6. 테스트와 빌드
- `npm run typecheck`: 통과.
- `npm test`: **254건 통과, 실패 0**(기준 249 + 새 5건). 새 테스트: ① 마커 주석 순서(theme layer → concept 3 → fixes, 한 번만)와 핵심 값 ② 테마 층에 글자 크기·간격·폭 등 색 외 속성이 없음(CR-015 하한 유지) ③ 사이드바 문구와 메타 설명이 지시서 문자열과 일치, `.brand em` 11px/.3px ④ 오류=`--red`, 완료=`--green` ⑤ 대시보드 슬로건: 위치(인사말과 버튼 사이)·문구·CSS 두 규칙이 지시서와 같고 다른 화면 9개에는 없음, 테마 층이 계속 맨 끝. 옛 색을 확인하던 기존 테스트 1건(`levelSelection.test.ts`)은 새 값으로 고쳤다(처음엔 이 1건이 실패했다).
- `npm run build`: **종료 코드 0**.
- `npm run dev`(포트 3018, 확인 후 종료): `GET /` 가 200, 응답 HTML 의 `<meta name="description">` 이 새 문장으로 나옴.

## 7. 미검증
- **브라우저 눈 확인 전부 미검증**: 11개 화면의 실제 색과 대비, 모바일(720px 이하)의 어두운 하단 메뉴 막대, 사이드바에서 "내 페이스로, 끝까지"(11px)가 252px 폭에서 줄바꿈 없이 들어가는지(한 줄 짧은 문구라 들어갈 것으로 보이나 미확인).
- **대시보드 슬로건(§2-1 4번):** 1200px 이상에서 보이고 미만에서는 숨는지, 보일 때 버튼과 겹치거나 인사말을 밀어내지 않는지: 코드(CSS)만 확인했고 눈으로는 미검증. 슬로건은 한 줄(`white-space: nowrap`, 가운데 정렬, `flex: 1 1 auto`)이라 1200px 근처 폭에서 인사말 블록과 경쟁할 수 있다.
- 어두운 사이드바 위 `.nav-soon` 의 가독성(대비): 미확인. 대비 비율 계산은 하지 않았다(목업의 색 검토 문서가 근거).
- 배포 환경: 미검증.

## 8. 기타
개인 파일(`frontend/AGENTS.md`, 변경관리내역서 hwp·pdf, `docs/프롬프트와 응답사례연구.md`)은 커밋에 넣지 않았다. 다른 CR 은 시작하지 않았다. `docs/phase5c_report.md` 의 옛 문구 `LEARN AT YOUR PACE` 는 과거 보고서라 수정하지 않았다.
