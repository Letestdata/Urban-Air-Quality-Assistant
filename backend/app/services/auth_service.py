from sqlalchemy.orm import Session

from app.core.exceptions import UnauthorizedException, UrbanAirException
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import Location, User, UserLocation, UserPreference
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse


class AuthService:
    @staticmethod
    def register_user(db: Session, req: RegisterRequest) -> TokenResponse:
        """Register a new user with Argon2id password hash and default preferences."""
        if req.password != req.confirm_password:
            raise UrbanAirException(detail="Passwords do not match.", error_code="PASSWORD_MISMATCH")

        existing_user = db.query(User).filter(User.email == req.email.lower().strip()).first()
        if existing_user:
            raise UrbanAirException(detail="An account with this email already exists.", error_code="EMAIL_EXISTS")

        hashed_pw = hash_password(req.password)
        new_user = User(
            email=req.email.lower().strip(),
            hashed_password=hashed_pw,
            full_name=req.full_name.strip(),
            country=req.country,
            preferred_language=req.preferred_language
        )
        db.add(new_user)
        db.flush()

        # Initialize default preferences
        pref = UserPreference(
            user_id=new_user.id,
            occupation="office_worker",
            wake_time="06:30",
            sleep_time="22:30",
            working_hours="09:00-18:00",
            commute_mode="metro",
            exercise_type="walking",
            environmental_goals="Understand air quality, improve indoor air",
            onboarding_completed=False
        )
        db.add(pref)

        # Initialize default Delhi location
        default_loc = Location(
            city_name="Delhi NCR",
            state_name="Delhi",
            latitude=28.6139,
            longitude=77.2090,
            monitoring_station_name="Anand Vihar, Delhi - CPCB Monitoring Station",
            station_source="CPCB"
        )
        db.add(default_loc)
        db.flush()

        user_loc = UserLocation(
            user_id=new_user.id,
            location_id=default_loc.id,
            is_primary=True
        )
        db.add(user_loc)
        db.commit()
        db.refresh(new_user)

        token = create_access_token(data={"sub": new_user.id, "email": new_user.email})
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(new_user)
        )

    @staticmethod
    def login_user(db: Session, req: LoginRequest) -> TokenResponse:
        """Authenticate user and return JWT bearer token."""
        user = db.query(User).filter(User.email == req.email.lower().strip()).first()
        if not user or not verify_password(req.password, user.hashed_password):
            raise UnauthorizedException(detail="Invalid email or password.")

        token = create_access_token(data={"sub": user.id, "email": user.email})
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )

    @staticmethod
    def get_current_user(db: Session, user_id: str) -> User:
        """Retrieve user by ID or raise Unauthorized."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UnauthorizedException(detail="User account no longer exists.")
        return user
