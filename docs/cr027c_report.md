# CR-027 마무리 개발 보고서: 막대·분석 문구 색 3곳

작성: 개발팀, 2026-11-23. 지시서: docs/cr027c_dev_prompt.md. 로컬 커밋만 했고 push 하지 않았다. 색 값만 바꿨다(선택자, 다른 속성, 테마 층, 슬로건 규칙은 그대로).

## 1. 변경 표 (`frontend/app/globals.css`)
| 선택자 | 속성 | 옛 값 | 새 값 |
|---|---|---|---|
| `.mini-bars span` | `background` | `var(--blue)` | `#6f86ee` |
| `.mini-bars span i` | `color` | `#778198` | `var(--muted)` |
| `.insight-copy .insight-part p` | `color` | `#555e73` | `#35445e` |

## 2. 테스트
- 기존 테스트 `lib/cr027b.test.ts` 가 막대의 옛 값 `var(--blue)` 를 확인하고 있어 새 값 `#6f86ee` 로 고쳤다(1줄).
- 새 테스트 `lib/cr027c.test.ts` 1건: 위 3줄이 새 값이고 옛 값이 없다.
- `npm run typecheck`: 통과. `npm test`: 아래 숫자(§3). `npm run build`: §3.

## 3. 결과
- `npm run typecheck`: 통과.
- `npm test`: **258건 통과, 실패 0**(기준 257 + 새 1건).
- `npm run build`: **종료 코드 0**.

## 4. 표 밖에서 발견한 옛 색
이번 작업 중 새로 발견한 것은 없다. 앞선 보완 보고서(`docs/cr027b_report.md` §3)의 `.task-time`, `.chip`, `td` 는 테마 층이 `!important` 로 덮어 화면은 새 색이다(수정하지 않음).

## 5. 미검증
- 눈 확인(분석 화면의 막대 `#6f86ee` 와 위 숫자, 인사이트 카드 본문)은 하지 못했다.
- 대비 수치(3.15, 5.87, 7.9 이상)는 PM 이 계산한 값을 그대로 썼고 다시 계산하지 않았다.
- 배포 환경: 미검증.

개인 파일은 커밋에 넣지 않았고 다른 작업은 하지 않았다.
