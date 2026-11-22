# CR-022 개발 보고서: 학습경로 미리보기 시간 입력칸에 단위 "분" 표시

작성: 개발팀, 2026-11-23. 지시서: docs/cr022_dev_prompt.md. 로컬 커밋만 했고 push 하지 않았다.

## 1. 변경 파일
| 파일 | 내용 |
|---|---|
| `frontend/components/TaskMinutesInput.tsx` (신규) | 시간 입력칸과 그 오른쪽의 눈에 보이는 "분"을 한 묶음(`.minutes-field`)으로 렌더. `aria-label="예상 학습 시간(분)"` 유지, 최소 1 최대 6000 유지. 단위 글자는 `aria-hidden`(라벨과 중복 읽기 방지) |
| `frontend/components/LearningPathWizard.tsx` | 학습 과제 탭의 `<input type="number">` 를 `<TaskMinutesInput>` 로 교체(동작은 같음: 빈 값은 NaN) |
| `frontend/app/globals.css` | `.minutes-field`(flex, 간격 6px), `.minutes-field input`(남는 너비 사용, `min-width: 0`), `.minutes-unit`(12px, 입력칸과 같은 크기) 추가 |
| `frontend/lib/cr022.test.ts` (신규) | 테스트 3건 |

방식: 입력칸 옆 접미 글자. 기존 `.field-grid`(입력칸 | 요일 선택) 구조는 그대로이고 첫 칸 안만 flex 로 바뀐다. 입력칸은 칸 너비에서 "분" 폭만 뺀 나머지를 쓰므로 4자리(6000)가 들어갈 공간은 있다(아래 미검증 참고).
API, DTO, 백엔드, 목업은 건드리지 않았다. 900분을 15시간으로 바꾸는 환산도 하지 않았다.

## 2. 전수 확인 (시간 숫자의 단위 표시)
| 위치 | 표시 | 결과 |
|---|---|---|
| Wizard 학습 과제 입력칸 (`LearningPathWizard.tsx` 약 920행) | 단위 없음(aria-label 에만 분) | **고침**: "분" 추가 |
| Wizard 주차 머리글 `weekGroupHeading` | "예정 5시간 30분" (`formatHoursMinutes`) | 이미 단위 있음, 그대로 |
| Wizard 이어짐 `continuedLabel` | "이번 주 90분 / 총 150분" | 이미 단위 있음 |
| Wizard 계획 요약·초과 안내·가용 시간 (`planSummaryText`, `overBudgetMessage`) | 시간·분 | 이미 단위 있음 |
| Wizard 저장 후 요약 목록 (556행) | "{제목} · N분" | 이미 단위 있음 |
| WeeklyPlanScreen 과제 행 (441행) | "예상 N분" / `continuedLabel` | 이미 단위 있음 |
| WeeklyPlanScreen 헤더·이번 주 예정 (`weeklyPlanHeaderText`, `formatHoursMinutes`) | 시간·분 | 이미 단위 있음 |
| `{...Minutes}` 형태로 단위 없이 출력되는 곳 | grep 으로 두 파일을 확인 | 위 입력칸 1곳뿐이었음 |

새로 찾아 같이 고친 곳은 없다(고친 곳은 입력칸 1곳).

## 3. 테스트와 빌드
- `npm run typecheck`: 통과.
- `npm test`: **249건 통과, 실패 0** (기준 246 + 새 3건).
  - 새 테스트: ① 렌더 결과에서 `<input …>` 바로 뒤에 "분"이 있고 aria-label 이 유지됨(값 900) ② 빈 값(NaN)이면 입력칸은 비고 단위는 남음 ③ Wizard 가 컴포넌트를 쓰고 단위 글자가 12px(CR-015 하한)임.
- `npm run build`: 컴파일, TypeScript, 정적 페이지 생성까지 모두 성공 출력이 나오지만 **프로세스 종료 코드가 1**이다. 내 변경을 되돌린(stash) 기준 상태에서도 같은 종료 코드 1이라 이번 변경의 영향은 아니다. 출력의 "Next.js 보안 취약점 알림"(registry 조회) 직후 종료되는 것으로 보이나 원인은 확인하지 못했다. 배포(Vercel) 빌드가 같은 이유로 실패하는지는 모른다 → PM 확인 필요.

## 4. 미검증
- **화면 폭 3종(넓은 화면, 태블릿, 휴대폰) 눈 확인: 미검증.** 브라우저를 띄워 보지 않았다. CSS 로 겹침을 막도록만 작성했다(`min-width: 0`, 모바일은 기존 규칙대로 `.field-grid` 가 한 줄 1칸). 휴대폰에서 6000 이 잘리지 않는지는 사용자 또는 PM 이 확인해야 한다.
- 입력칸 안의 숫자가 브라우저 기본 스피너 때문에 좁은 폭에서 가려지는지: 미확인.
- `npm run build` 종료 코드 1의 원인(위 3번).
- 배포 환경: 미검증.

## 5. 기타
- 작업 폴더의 개인 파일(`frontend/AGENTS.md`, 변경관리내역서 hwp·pdf, 프롬프트와 응답사례연구.md)은 건드리지 않았고 커밋에도 넣지 않았다.
- 목업은 PM 소유라 수정하지 않았다.
