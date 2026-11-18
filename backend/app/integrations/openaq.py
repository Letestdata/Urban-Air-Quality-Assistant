"""OpenAQ Integration for Open Environmental Station Data."""

from typing import Any, Dict, List

import httpx

from app.core.config import get_settings

settings = get_settings()


class OpenAQClient:
    def __init__(self) -> None:
        self.base_url = "https://api.openaq.org/v3"
        self.api_key = settings.OPENAQ_API_KEY

    async def get_locations_by_city(self, city: str) -> List[Dict[str, Any]]:
        """Search available OpenAQ monitoring stations in India."""
        headers = {}
        if self.api_key:
            headers["X-API-Key"] = self.api_key

        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                resp = await client.get(
                    f"{self.base_url}/locations",
                    params={"iso": "IN", "limit": 10},
                    headers=headers
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data.get("results", [])
        except Exception:
            pass
        return []


openaq_client = OpenAQClient()
