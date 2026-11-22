"""CR-026: a failed provider call logs status, error code and exception class, and nothing else."""
import logging

import httpx2 as httpx
import pytest
from openai import APIConnectionError, AuthenticationError, RateLimitError

from ai_client import AIUnavailableError, OpenAIClient

SECRET = "sk-proj-TESTSECRET123"
QUESTION = "내 비밀 질문 문자열 XYZ"


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-not-real")
    return OpenAIClient()


def _status_error(cls, status, code, message):
    request = httpx.Request("POST", "https://api.openai.com/v1/chat/completions")
    response = httpx.Response(status, request=request)
    return cls(message, response=response, body={"error": {"code": code, "message": message}})


def _fail_with(client, monkeypatch, exc):
    def _raise(*args, **kwargs):
        raise exc

    monkeypatch.setattr(client._client.chat.completions, "create", _raise)
    with pytest.raises(AIUnavailableError):
        client._raw_complete("sys", {"q": QUESTION})


def _failure_lines(caplog):
    return [r.getMessage() for r in caplog.records if "ai_call_failed" in r.getMessage()]


def test_auth_error_logs_status_code_and_class(client, monkeypatch, caplog):
    exc = _status_error(AuthenticationError, 401, "expired_secret_key", "expired")
    with caplog.at_level(logging.INFO, logger="pacemate.ai"):
        _fail_with(client, monkeypatch, exc)
    assert _failure_lines(caplog) == [
        "ai_call_failed kind=unavailable status=401 code=expired_secret_key exc=AuthenticationError"
    ]


def test_rate_limit_error_logs_its_code(client, monkeypatch, caplog):
    exc = _status_error(RateLimitError, 429, "insufficient_quota", "quota")
    with caplog.at_level(logging.INFO, logger="pacemate.ai"):
        _fail_with(client, monkeypatch, exc)
    assert "status=429 code=insufficient_quota exc=RateLimitError" in _failure_lines(caplog)[0]


def test_no_message_key_or_question_reaches_the_log(client, monkeypatch, caplog):
    message = f"Incorrect API key provided: {SECRET}. question: {QUESTION}"
    exc = _status_error(AuthenticationError, 401, "invalid_api_key", message)
    with caplog.at_level(logging.DEBUG):
        _fail_with(client, monkeypatch, exc)
    everything = caplog.text + " ".join(r.getMessage() for r in caplog.records)
    assert SECRET not in everything
    assert QUESTION not in everything
    assert "TESTSECRET" not in everything


@pytest.mark.parametrize("bad", ["has space", "UPPER_CASE", "a" * 70, "한글코드", "ok\n", "", None, 123])
def test_code_outside_the_allowed_pattern_is_none(client, monkeypatch, caplog, bad):
    exc = _status_error(AuthenticationError, 401, bad, "msg")
    with caplog.at_level(logging.INFO, logger="pacemate.ai"):
        _fail_with(client, monkeypatch, exc)
    assert "status=401 code=none exc=AuthenticationError" in _failure_lines(caplog)[0]


def test_code_of_64_characters_is_accepted(client, monkeypatch, caplog):
    exc = _status_error(AuthenticationError, 401, "a" * 64, "msg")
    with caplog.at_level(logging.INFO, logger="pacemate.ai"):
        _fail_with(client, monkeypatch, exc)
    assert f"code={'a' * 64} " in _failure_lines(caplog)[0]


def test_connection_error_has_no_status_and_no_code(client, monkeypatch, caplog):
    exc = APIConnectionError(request=httpx.Request("POST", "https://api.openai.com"))
    with caplog.at_level(logging.INFO, logger="pacemate.ai"):
        _fail_with(client, monkeypatch, exc)
    assert _failure_lines(caplog) == ["ai_call_failed kind=unavailable status=none code=none exc=APIConnectionError"]


def test_plain_exception_has_status_none(client, monkeypatch, caplog):
    with caplog.at_level(logging.INFO, logger="pacemate.ai"):
        _fail_with(client, monkeypatch, RuntimeError(f"detail {SECRET}"))
    assert _failure_lines(caplog) == ["ai_call_failed kind=unavailable status=none code=none exc=RuntimeError"]
    assert SECRET not in caplog.text


def test_user_response_error_type_is_unchanged(client, monkeypatch):
    exc = _status_error(AuthenticationError, 401, "expired_secret_key", "x")
    with pytest.raises(AIUnavailableError, match="AI 서비스 호출에 실패했습니다."):
        monkeypatch.setattr(client._client.chat.completions, "create", lambda *a, **k: (_ for _ in ()).throw(exc))
        client._raw_complete("sys", {})
