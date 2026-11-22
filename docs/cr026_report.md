# CR-026 개발 보고서: AI 호출 실패 원인의 로그 분류

작성: 개발팀, 2026-11-23. 지시서: docs/cr026_dev_prompt.md. 로컬 커밋만 했고 push 하지 않았다.

## 1. 변경 파일
| 파일 | 내용 |
|---|---|
| `backend/ai_client.py` | `_failure_log_fields(exc)` 추가. `OpenAIClient._call` 의 연결 오류와 일반 예외 두 곳의 `ai_call_failed kind=unavailable` 로그 뒤에 `status`, `code`, `exc` 세 필드를 덧붙임. `import re` 추가 |
| `backend/tests/test_cr026_failure_log.py` (신규) | 테스트 15건(파라미터 포함) |

- 기록하는 것은 세 필드뿐이다. `status`: 예외의 `status_code` 가 정수일 때만, 아니면 `none`. `code`: 예외의 `code`(없으면 `body` 의 `error.code`/`code`)가 문자열이고 `[a-z0-9_]{1,64}` 와 **전체 일치**(`fullmatch`, 끝의 줄바꿈도 거부)할 때만, 아니면 `none`. `exc`: 예외 클래스 이름.
- 예외 메시지, `str(exc)`, `exc.args`, `body` 전체, `response`, 요청·응답 본문은 기록하지 않는다.
- 사용자 응답(503, 한국어 안내)과 예외 종류(`AIUnavailableError`, 같은 메시지)와 재시도 동작은 바꾸지 않았다. 타임아웃(재시도) 경로, 프롬프트, DTO, 화면, 환경변수, `/health` 는 건드리지 않았다.

## 2. 로그 예시 (테스트에서 실제로 확인한 줄)
```
ai_call_failed kind=unavailable status=401 code=expired_secret_key exc=AuthenticationError
ai_call_failed kind=unavailable status=none code=none exc=APIConnectionError
ai_call_failed kind=unavailable status=none code=none exc=RuntimeError
```
(429 는 `status=429 code=insufficient_quota exc=RateLimitError`.)

## 3. 테스트
- 전체: `.venv/Scripts/python -m pytest` → **1393건 통과, 실패 0**(기준 1378 + 새 15건).
- 새 테스트가 확인하는 것: ① 401 + `expired_secret_key` 가 `status=401 code=expired_secret_key exc=AuthenticationError` 로 남음(정확히 한 줄), 429 `insufficient_quota` ② 예외 메시지에 `sk-proj-TESTSECRET123`, 사용자 질문 문자열을 넣어도 로그 전체(DEBUG 수준 포함)에 없음 ③ `code` 가 공백 포함·대문자·70자·한글·끝 줄바꿈·빈 문자열·None·숫자이면 `code=none`, 64자는 기록됨 ④ 연결 오류와 상태 없는 일반 예외는 `status=none code=none` ⑤ 사용자에게 가는 예외 종류와 메시지가 그대로임.
- 공급자 예외는 테스트 안에서 SDK 예외 클래스로 만들어 썼다(OpenAI SDK 3.35.1). **실제 OpenAI 호출은 하지 않았다.**

## 4. 미검증
- 실제 OpenAI 가 만료 키로 돌려주는 오류 본문에서 SDK 가 `code`(`expired_secret_key`)를 `exc.code` 로 채우는지: 실제 호출을 하지 않아 미검증. 테스트는 SDK 가 본문에서 `code` 를 파싱한다는 전제(예외 생성 시 `body` 전달)로 만들었다. 실제 키 문제가 다시 생기면 배포 로그에서 확인할 수 있다.
- 배포(Render) 로그에서의 실제 출력: 미검증(push 전).
- `generate_text`/`generate` 의 timeout·schema·empty 로그 줄은 범위 밖이라 그대로다.

## 5. 기타
개인 파일(`frontend/AGENTS.md`, 변경관리내역서 hwp·pdf, `docs/프롬프트와 응답사례연구.md`)은 커밋에 넣지 않았다. CR-021 ②~④, 023, 024 는 시작하지 않았다.
