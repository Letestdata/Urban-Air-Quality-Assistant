import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key-urban-air-ai-2026"

from app.core.database import Base, get_db
from app.core.security import hash_password
from app.main import app
from app.models.user import User, UserPreference

# In-memory SQLite engine for tests
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    user = User(
        email="testuser@urbanair.ai",
        hashed_password=hash_password("Password123!"),
        full_name="Aarav Sharma",
        country="India",
        preferred_language="en"
    )
    db_session.add(user)
    db_session.flush()

    pref = UserPreference(
        user_id=user.id,
        occupation="office_worker",
        wake_time="06:30",
        sleep_time="22:30",
        working_hours="09:00-18:00",
        commute_mode="metro",
        exercise_type="walking",
        onboarding_completed=True
    )
    db_session.add(pref)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def auth_headers(client, test_user):
    resp = client.post("/api/v1/auth/login", json={
        "email": "testuser@urbanair.ai",
        "password": "Password123!"
    })
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
