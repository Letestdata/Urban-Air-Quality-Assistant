from typing import Any, Optional

from fastapi import HTTPException, status


class UrbanAirException(HTTPException):
    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        detail: str = "An unexpected error occurred.",
        error_code: str = "BAD_REQUEST",
        data: Optional[Any] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.data = data


class NotFoundException(UrbanAirException):
    def __init__(self, detail: str = "Resource not found."):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code="NOT_FOUND"
        )


class UnauthorizedException(UrbanAirException):
    def __init__(self, detail: str = "Could not validate credentials."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code="UNAUTHORIZED"
        )


class ForbiddenException(UrbanAirException):
    def __init__(self, detail: str = "Not authorized to access this resource."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code="FORBIDDEN"
        )
