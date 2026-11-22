# CR-026 개발 지시서: AI 호출 실패 원인의 로그 가시화

작성: PM, 2026-11-23. **발행 조건: CR-022 가 PM 검증을 마친 뒤에 개발팀에 전달한다**(개발 지시서는 한 번에 하나만). 근거: 변경관리 CR-026(`docs/change_management.md`), 사용자 승인(2026-11-23 "가"), 계기: 2026-11-20~23 배포 AI 기능이 OpenAI 키 만료(401 `expired_secret_key`)로 막혔는데 서버 로그가 `ai_call_failed kind=unavailable` 한 줄뿐이라 원인을 구분하지 못했다(`docs/user_feedback_2026-11.md`). 이 작업만 한다. CR-021 ②~④(튜터 프롬프트), 023, 024 는 시작하지 않는다.

## 1. 해야 할 일 (범위는 로그에 한정)
`backend/ai_client.py` 의 `OpenAIClient._call`(약 243~245행 `except Exception`)과 연결 오류 처리(약 240~242행)에서 실패 원인을 **분류해 로그에 남긴다.**

1. 로그 한 줄에 기존 `kind=unavailable` 을 유지하고 아래 필드를 **덧붙인다.**
   - `status=<HTTP 상태 숫자>`: 공급자 응답이 있을 때만(`getattr(exc, "status_code", None)`), 없으면 `status=none`
   - `code=<공급자 오류 코드>`: 예 `expired_secret_key`, `invalid_api_key`, `insufficient_quota`, `rate_limit_exceeded`, `model_not_found`. 공급자 오류 본문의 `code` 필드에서만 가져오고, **영문 소문자·숫자·밑줄 1~64자(`^[a-z0-9_]{1,64}$`)와 일치할 때만 기록한다.** 일치하지 않거나 없으면 `code=none`
   - `exc=<예외 클래스 이름>`: 예 `AuthenticationError`, `RateLimitError`, `APIConnectionError`
   예: `ai_call_failed kind=unavailable status=401 code=expired_secret_key exc=AuthenticationError`
2. 연결 오류(`APIConnectionError`)도 같은 형식으로 남긴다(`status=none code=none exc=APIConnectionError`).
3. 기존 사용자 응답(HTTP 503, 한국어 안내 문구)과 재시도·예외 종류(`AIUnavailableError` 등)는 **바꾸지 않는다.**

## 2. 절대 하지 않을 것 (핵심 결정: 로그에 사용자 입력 원문, AI 응답 원문, 토큰·키를 남기지 않는다)
- 예외 **메시지 문자열은 로그에 쓰지 않는다**(OpenAI 인증 오류 메시지에는 마스킹된 키 조각이 들어 있다). `str(exc)`, `exc.args`, `exc.body` 전체, `exc.response` 를 기록하지 않는다. 기록은 위 세 필드뿐이다.
- 요청 본문(프롬프트, 사용자 질문)·응답 본문을 기록하지 않는다.
- `/health` 에 키 유효성 점검을 넣지 않는다(호출 비용과 지연이 생기므로 이번 범위 밖).
- 프롬프트, DTO, 화면, 환경변수 이름은 건드리지 않는다.

## 3. 검증 요구
- `python -m pytest`(backend 폴더, `.venv/Scripts/python -m pytest`) 전체 통과, 통과 수를 보고서에 숫자로 적는다(기준: 이전 보고 기준 1378 이상).
- 새 테스트(최소):
  1. 상태 401, 오류 본문 `code=expired_secret_key` 인 예외를 일으키면 로그에 `status=401 code=expired_secret_key exc=…` 가 남는다.
  2. 예외 메시지에 `sk-proj-TESTSECRET123`, 사용자 질문 문자열을 넣어도 **로그 전체(caplog)에 그 문자열이 없다.**
  3. `code` 가 규칙에 맞지 않는 값(공백, 대문자, 70자 초과, 한글)이면 `code=none` 으로 기록된다.
  4. 연결 오류와 상태 없는 일반 예외는 `status=none` 으로 기록된다.
- **실제 OpenAI 호출은 하지 않는다.** 공급자 예외는 테스트 안에서 만들어 쓴다(비용 없음).

## 4. [필수] 완료 조건
- 보고서를 `docs/cr026_report.md` 로 저장한다(변경 파일, 로그 예시 3줄, 테스트 수, 미검증 항목).
- **로컬 커밋만 하고 push 하지 않는다.** 채팅에는 완료 여부, 테스트 통과 수, 보고서 경로만 간단히 보고한다.
- 이 작업만 한다. 끝나면 멈추고 PM 검증과 사용자 지시를 기다린다.
