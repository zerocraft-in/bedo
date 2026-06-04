"""FitAI Backend API tests"""
import pytest
import requests
import os

BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL', '').rstrip('/')

@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s

# Health check
class TestHealth:
    def test_health(self, client):
        r = client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"

# Motivation endpoint
class TestMotivation:
    def test_motivation_default(self, client):
        r = client.get(f"{BASE_URL}/api/motivation")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert len(data["message"]) > 0

    def test_motivation_with_params(self, client):
        r = client.get(f"{BASE_URL}/api/motivation?user_name=Alex&streak=12")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data

# Chat endpoint
class TestChat:
    SESSION_ID = "test-session-fitai-001"

    def test_chat_basic(self, client):
        r = client.post(f"{BASE_URL}/api/chat", json={
            "session_id": self.SESSION_ID,
            "message": "Motivate me!",
            "user_name": "TestUser",
            "streak": 5,
            "total_workouts": 20
        })
        assert r.status_code == 200
        data = r.json()
        assert "response" in data
        assert len(data["response"]) > 0
        assert data["session_id"] == self.SESSION_ID

    def test_chat_history(self, client):
        r = client.get(f"{BASE_URL}/api/chat/history/{self.SESSION_ID}")
        assert r.status_code == 200
        data = r.json()
        assert "messages" in data

# User profile
class TestUserProfile:
    USER_ID = "TEST_user_001"

    def test_save_profile(self, client):
        r = client.post(f"{BASE_URL}/api/user/profile", json={
            "user_id": self.USER_ID,
            "name": "TEST_Alex",
            "goal": "build_muscle",
            "fitness_level": "intermediate",
            "workout_style": "gym",
            "weight": 75.0,
            "target_weight": 70.0
        })
        assert r.status_code == 200
        data = r.json()
        assert data["success"] is True

    def test_get_profile(self, client):
        r = client.get(f"{BASE_URL}/api/user/profile/{self.USER_ID}")
        assert r.status_code == 200
        data = r.json()
        assert data["user_id"] == self.USER_ID
        assert data["name"] == "TEST_Alex"

    def test_get_nonexistent_profile(self, client):
        r = client.get(f"{BASE_URL}/api/user/profile/nonexistent-xyz-999")
        assert r.status_code == 404
