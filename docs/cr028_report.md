# CR-028 개발 보고서: Next.js 보안 업데이트(빌드 종료 코드 0)

작성: 개발팀, 2026-11-23. 지시서: docs/cr028_dev_prompt.md. 로컬 커밋만 했고 push 하지 않았다.

## 1. 원인
`npm run build` 는 컴파일과 정적 페이지 생성까지 성공하지만, 끝에서 `Error [SecurityFatalError]: Your version of Next.js is affected by a known security vulnerability`(참조: npm 보안 권고 조회 주소)로 종료 코드 1이 됐다. 설치된 `next@16.4.2` 가 알려진 취약점 대상이라서다. CR-022 보고에서 "원인 미확인"이던 종료 코드 1의 원인이 이것이다.

## 2. 근거와 선택한 버전
npm 보안 권고 조회(`/-/npm/v1/security/advisories/bulk`, 패키지 이름과 버전만 보냄)로 `next@16.4.2` 를 조회한 결과 권고 7건(모두 moderate):
| 권고 | 내용 | 영향 범위 |
|---|---|---|
| GHSA-mfr8-8qww-v76h | `use cache` 를 `unstable_cache()` 로 호출 시 정보 노출 | >=16.3.0 <=16.4.4 |
| GHSA-vc7v-qv4w-wrv8 | 중첩 `use cache` 의 캐시 누출 | >=16.2.0 <=16.4.4 |
| GHSA-7qx7-33qx-rqx2 | 이미지 최적화의 SVG 거부 우회 | >=16.0.0 <=16.4.4 |
| GHSA-f3mh-rxg3-f5g2 | Edge 런타임 라우트의 HttpOnly 쿠키 노출 | >=16.0.0 <=16.4.4 |
| GHSA-pc58-hwjq-p385 | 자체 호스팅에서 fetch 응답 전달 시 응답 주입 | >=16.0.0 <=16.4.4 |
| GHSA-rhh4-g77r-r9qj | `use cache` 의 이진 인자 캐시 오염 | >=16.0.0 <=16.4.4 |
| GHSA-vvgp-ww4w-46vf | Cache Components 의 fallback 셸 캐시 오염 | >=16.4.0 <=16.4.4 |

7건 모두 상한이 **16.4.4** 이므로 같은 메이저(16.x)에서 가장 낮은 안전 버전은 **16.4.5**(npm 에 16.4.5, 16.4.6(latest)이 있음). 16.4.5 를 같은 방법으로 조회하면 권고 0건(`{}`)이다. 최신(16.4.6)이 아니라 가장 낮은 안전 버전을 지시서대로 골랐다.
참고: 이 앱은 `use cache`, Edge 라우트, 이미지 최적화를 쓰지 않는 정적 페이지(`/`, `/_not-found`)라 실제 노출 위험은 작아 보이나(코드로 전수 확인하지는 않음), 빌드 점검이 중단되므로 올렸다.

## 3. 변경
- 명령: `npm install next@16.4.5` (`next upgrade` 는 쓰지 않음). 점검을 끄거나 우회하지 않았다.
- `frontend/package.json`: `"next": "^16.0.0"` → `"^16.4.5"` (이 한 줄만 변경).
- `frontend/package-lock.json`: 41줄 추가·41줄 삭제. `next` 와 `@next/swc-*` 플랫폼 패키지 10개의 버전이 16.4.2 → 16.4.5 로만 바뀜. 다른 패키지(react, react-dom, firebase 등)는 올리지 않았다.
- 설정 파일 호환 조정: 없음. 소스, 화면, CSS, 백엔드: 변경 없음.
- `git diff --stat`: 2 files changed, 41 insertions(+), 41 deletions(-).
- 전후 버전: next 16.4.2 → 16.4.5.

## 4. 검증 결과
- `npm run typecheck`: 통과(종료 코드 0).
- `npm test`: **249건 통과, 실패 0**(기준 249).
- `npm run build`: **종료 코드 0**(`echo $?` 로 확인). 출력에서 보안 취약점 경고와 SecurityFatalError 가 사라짐.
- `npm run dev`(포트 3017, 확인 후 종료): `GET /` 가 HTTP 200, 응답 HTML 의 제목 "PaceMate". 브라우저 화면 조작은 하지 않았다(미검증).
- dev 실행이 `frontend/next-env.d.ts` 를 자동 수정(`.next/dev/types` 경로)해서 `git checkout` 으로 되돌렸다. 커밋에 넣지 않았다.

## 5. 남은 `npm audit` (고치지 않음)
high 4건, 모두 `next` 와 무관한 Firebase 계열 체인: `@grpc/grpc-js <=1.13.5` → `@firebase/firestore` → `@firebase/firestore-compat` → `firebase`. 해소하려면 `npm audit fix --force`(호환 깨질 수 있음)가 필요하다고 나온다. 지시서에 따라 손대지 않았고, 필요하면 PM 이 CR 로 따로 받아야 한다. (프론트는 Firestore 를 직접 쓰지 않는다는 기존 기록이 있어 영향은 작을 것으로 보이나 이번에 코드로 재확인하지는 않았다.)

## 6. 미검증
- Vercel 에서의 실제 배포 빌드(같은 점검이 거기서도 통과하는지): 미검증. 로컬 빌드만 확인했다.
- 브라우저에서 화면 조작, 버전 변화에 따른 동작 차이: 미검증(첫 화면 HTTP 200 만 확인).
- 설치 중 `allow-scripts` 경고(`@firebase/util`, `esbuild`, `protobufjs` 설치 스크립트 미승인 알림)가 나왔으나 이번 변경과 무관하게 보여 그대로 두었다.

## 7. 기타
개인 파일(`frontend/AGENTS.md`, 변경관리내역서 hwp·pdf, `docs/프롬프트와 응답사례연구.md`)은 커밋에 넣지 않았다. CR-026 지시서는 열지 않았다.
