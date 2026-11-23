# CR-027 보완 개발 보고서: 남은 옛 색 정리

작성: 개발팀, 2026-11-23. 지시서: docs/cr027b_dev_prompt.md. 로컬 커밋만 했고 push 하지 않았다. 색 값만 바꿨다(선택자, 다른 속성, JSX, 테마 층 블록, 슬로건 규칙은 그대로).

## 1. 변경 파일
`frontend/app/globals.css`(15개 규칙의 색 값), `frontend/lib/cr027b.test.ts`(신규, 테스트 3건).

## 2. 변경 표 (표의 새 값으로만)
| 선택자 (줄) | 옛 값 | 새 값 |
|---|---|---|
| `.mode-pill` | 배경 `#edf0ff`, 글자 `#4b56c8` | `var(--lav)`, `var(--blue-dark)` |
| `.mode-pill.edit-mode` | 배경 `#fff3dc`, 글자 `#93661e` | `#fff0dc`, `var(--orange)` |
| `.timer-panel` | **테두리** `#e5e8f2`, **배경** `#fafbff` | 테두리 `var(--line)`, 배경 `var(--white)` (옛 값의 쓰임을 코드로 확인: 위 그대로) |
| `.record-delete` | `#a45d66` | `var(--red)` |
| `.stat small` | `#a0a6b4` | `var(--muted)` |
| `.stat strong small` (같은 값, 표에 없는 형제 규칙) | `#a0a6b4` | `var(--muted)` |
| `.bar-label` | `#8991a3` | `var(--muted)` |
| `.mini-bars span` | 배경 `#c6ceff` | `var(--blue)` |
| `.mini-days`, `.scope-note`, `.goal-switch small` | `#778198` | `var(--muted)` |
| `.insight-copy > p` | `#555e73` | `#35445e` |
| `.insight-copy > small` | `#8990a1` | `var(--muted)` |
| 전역 `ul`, `.modal ul` | `#586277` | `#35445e` |
| 포커스 외곽선(`button:focus-visible, …`) | `#bdc7ff` | `var(--blue)` |

- `.stat strong small` 은 표의 `.stat small` 과 같은 옛 값을 가진 하위 규칙이라 함께 바꿨다(표에 없음, PM 이 원치 않으면 `#a0a6b4` 로 되돌리면 된다).
- **`.mini-bars span` 상태별 변형: 없음.** 앱(`AnalysisScreen.tsx`)은 막대마다 높이만 다르고(`style height`) 색 변형 클래스가 없다. 그래서 한 색으로 합친 것이 아니라 원래 한 색이었다. 다만 막대가 진한 파랑(`--blue`)으로 바뀌어 막대 위 숫자 `.mini-bars span i`(§3 참고, 옛 색 그대로)와의 모습은 눈으로 확인하지 못했다.

## 3. 작업 중 발견한 표 밖의 옛 색 (바꾸지 않음, 목록만)
| 선택자 | 옛 값 | 비고 |
|---|---|---|
| `.mini-bars span i` (막대 위 숫자) | `#778198` | `.mini-days` 등과 같은 값, 표에 없음 |
| `.insight-copy .insight-part p` | `#555e73` | `.insight-copy > p` 의 형제, 표에 없음 |
| `.task-time`, `.chip` | `#778198` | 테마 층이 `!important` 로 덮어 화면은 새 색 |
| `td` | `#586277` | 테마 층(`td{color:#35445e!important}`)이 덮음 |

## 4. 테스트와 빌드
- `npm run typecheck`: 통과.
- `npm test`: **257건 통과, 실패 0**(기준 254 + 새 3건). 새 테스트: ① 위 선택자들 규칙에 옛 색 값이 남아 있지 않음(포커스 외곽선 포함) ② 새 값이 표와 같음 ③ 테마 층이 그대로 맨 끝에 있고 슬로건 규칙이 그 앞에 있음. 기존 테스트 중 옛 값을 확인하던 것은 없었다.
- `npm run build`: **종료 코드 0**.

## 5. 미검증
- 눈 확인 전부 미검증(모드 표시 알약, 타이머 패널, 분석 화면 막대와 숫자 조합, 포커스 외곽선 굵기·색).
- 대비 수치는 PM 이 계산한 값을 그대로 믿고 개발팀은 다시 계산하지 않았다.
- 배포 환경: 미검증.

개인 파일은 커밋에 넣지 않았고 다른 작업은 하지 않았다.
