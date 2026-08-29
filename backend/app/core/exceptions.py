import logging

from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.responses import ApiResponse

logger = logging.getLogger(__name__)


async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception for %s %s", request.method, request.url.path)
    payload = ApiResponse(
        success=False,
        message="Internal server error",
        data=None,
        error=str(exc),
    )
    return JSONResponse(status_code=500, content=payload.model_dump())
