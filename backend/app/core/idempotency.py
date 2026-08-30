import hashlib
import json
from typing import Any, Callable

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.idempotency_key import IdempotencyKey


def _hash_request_body(body: dict | None) -> str:
    if body is None:
        body = {}
    body_str = json.dumps(body, sort_keys=True)
    return hashlib.sha256(body_str.encode("utf-8")).hexdigest()


def get_or_create_idempotent_response(
    db: Session,
    key: str | None,
    user_id: int,
    endpoint: str,
    request_body: dict | None,
    handler_fn: Callable[..., Any],
) -> Any:
    """
    Idempotency helper for POST endpoints.
    
    - Missing Idempotency-Key header → call handler_fn directly.
    - Existing (key, user_id, endpoint) with matching request_hash → return stored response, no re-execution.
    - Existing key with different request_hash → 422.
    - New key → run handler_fn in the same transaction, store result, commit, return fresh response.
    """
    if not key:
        return handler_fn()

    request_hash = _hash_request_body(request_body)

    # Check for existing idempotency key
    existing = (
        db.query(IdempotencyKey)
        .filter(
            IdempotencyKey.key == key,
            IdempotencyKey.user_id == user_id,
            IdempotencyKey.endpoint == endpoint,
        )
        .first()
    )

    if existing:
        if existing.request_hash != request_hash:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Idempotency key mismatch: request body changed for the same key",
            )
        
        # Return the stored response
        try:
            stored_response = json.loads(existing.response_body) if existing.response_body else {}
        except json.JSONDecodeError:
            stored_response = existing.response_body
            
        # Re-construct ApiResponse or similar structure depending on endpoint
        return stored_response

    # Execute handler and capture the response
    # handler_fn is expected to execute any DB changes inside the current session
    response = handler_fn()
    
    # Extract the dictionary format from the response (assuming Pydantic models or dicts)
    if hasattr(response, "model_dump"):
        response_dict = response.model_dump()
    elif isinstance(response, dict):
        response_dict = response
    else:
        # Fallback if the response is not easily serializable
        response_dict = {"data": str(response)}

    # Store the result
    idempotency_record = IdempotencyKey(
        key=key,
        user_id=user_id,
        endpoint=endpoint,
        request_hash=request_hash,
        response_body=json.dumps(response_dict, default=str),
        status_code=200, # Assuming success if handler_fn didn't raise exception
    )
    
    db.add(idempotency_record)
    db.commit()
    
    return response
