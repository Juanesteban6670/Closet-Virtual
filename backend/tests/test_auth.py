from fastapi.testclient import TestClient


def register_user(client: TestClient) -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Ada Lovelace",
            "email": "ada@example.com",
            "password": "StrongPassword1!",
        },
    )
    assert response.status_code == 201
    return response.json()


def test_register_user_and_reject_duplicate_email(client: TestClient) -> None:
    user = register_user(client)
    assert user["email"] == "ada@example.com"
    duplicate_response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Another Ada",
            "email": "ADA@example.com",
            "password": "StrongPassword1!",
        },
    )
    assert duplicate_response.status_code == 409


def test_login_refresh_and_profile(client: TestClient) -> None:
    register_user(client)
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "StrongPassword1!"},
    )
    assert login_response.status_code == 200
    access_token = login_response.json()["access_token"]
    assert login_response.cookies.get("virtual_closet_refresh_token")

    profile_response = client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert profile_response.status_code == 200
    assert profile_response.json()["name"] == "Ada Lovelace"

    refresh_response = client.post("/api/v1/auth/refresh")
    assert refresh_response.status_code == 200
    assert refresh_response.json()["access_token"] != access_token


def test_login_rejects_invalid_password(client: TestClient) -> None:
    register_user(client)
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "ada@example.com", "password": "WrongPassword1!"},
    )
    assert response.status_code == 401
