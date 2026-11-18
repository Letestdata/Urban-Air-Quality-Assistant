import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import (
    air_quality,
    assistant,
    auth,
    family,
    impact,
    indoor,
    locations,
    notifications,
    plans,
    reports,
    routes,
    users,
    weather,
)
from app.api.v1 import (
    settings as settings_api,
)
from app.core.config import get_settings
from app.core.database import Base, engine
from app.core.exceptions import UrbanAirException

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Urban Air AI - Production API",
    description="AI-powered environmental intelligence and daily planning platform for India.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Timing & Performance Middleware (tracking < 500ms read budget)
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    return response


# Global Exception Handler
@app.exception_handler(UrbanAirException)
async def urban_air_exception_handler(request: Request, exc: UrbanAirException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "error_code": exc.error_code,
            "message": exc.detail,
            "data": exc.data
        }
    )


# Health check
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Urban Air AI Backend",
        "environment": settings.ENVIRONMENT,
        "standard": "CPCB_NAQI_INDIA",
        "version": "1.0.0"
    }


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Urban Air AI: Breathe Smarter. Live Healthier.",
        "documentation": "/docs",
        "api_v1": "/api/v1"
    }


# Mount API Routers under /api/v1
app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(locations.router, prefix="/api/v1")
app.include_router(air_quality.router, prefix="/api/v1")
app.include_router(weather.router, prefix="/api/v1")
app.include_router(plans.router, prefix="/api/v1")
app.include_router(indoor.router, prefix="/api/v1")
app.include_router(family.router, prefix="/api/v1")
app.include_router(routes.router, prefix="/api/v1")
app.include_router(impact.router, prefix="/api/v1")
app.include_router(assistant.router, prefix="/api/v1")
app.include_router(notifications.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(settings_api.router, prefix="/api/v1")
