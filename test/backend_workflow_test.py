import requests
import time
import sys

print("Starting backend workflow test...")  # Debug: script is running

BASE_URL = "http://localhost:3000"
JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDE4NjE1NDQ2MjEyMTE3MDQ4ODkiLCJlbWFpbCI6Im1hcmlvLmd1ZXJyYUBnbWFpbC5jb20iLCJuYW1lIjoibWFyaW8gZ3VlcnJhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lCMDNHWGQ4SEF0QmxEeEpFUFVXZG04SHVydy1xeE1OdktOOFZETzFycmpUaGdBYjVwPXM5Ni1jIiwiZ29vZ2xlVG9rZW5zIjp7ImFjY2Vzc190b2tlbiI6InlhMjkuQTBBUzNINk55X1MxbVl2eE0waXlmNjlQU2lvSEllVHVfbEsxZUJkX1lkZ3ozSGZpdGhyeTNJbzQzYnU0S0ZKUXVzbW1TdG91MTNicTY2SktXSmx4Q05LTE50VXZTY3djTFpzeElFNVBQSGRzckxIZTlPOU0yM3VEenhxZ3Rza3VJQzdIeUdYNEN2YXRZbUhlVHNnazlXaHhreDY1a2hCbHVuaXhGak93NmNzelhUYmN5d3Q0MlMwd3FjalFoeEIxVktMTE5rS1BvYUNnWUtBZm9TQVJBU0ZRSEdYMk1pbDZ5UlZic0JHR09pWkdSV3lnQkxZUTAyMDYiLCJyZWZyZXNoX3Rva2VuIjoiMS8vMDFsOXBfa0dqdnJNd0NnWUlBUkFBR0FFU053Ri1MOUlyRDdqQ2steGtBVDdwckRiMEsyb1MwbzBBNkJNZUZnd0VJWXF6NXdMVWh5Sy1USGNtQ0dmY2V0XzdYaHpTV1VKeXVRdyIsInNjb3BlIjoiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC91c2VyaW5mby5wcm9maWxlIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWwgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9kcml2ZS5maWxlIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvc3ByZWFkc2hlZXRzIG9wZW5pZCIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJpZF90b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW10cFpDSTZJbUkxTURsak5URXpPRGMyT0dZM1kyWXlaVGd5TjJVd05HSXlOMlUzWlRSalltTTNZbUk1TVRraUxDSjBlWEFpT2lKS1YxUWlmUS5leUpwYzNNaU9pSm9kSFJ3Y3pvdkwyRmpZMjkxYm5SekxtZHZiMmRzWlM1amIyMGlMQ0poZW5BaU9pSTFOemswTmpJeE9UVXlNamt0WW13MllUVTFOMlkxYldKdGNuRjFZek5rZEdvelpuTmpOalF4YW05c00zRXVZWEJ3Y3k1bmIyOW5iR1YxYzJWeVkyOXVkR1Z1ZEM1amIyMGlMQ0poZFdRaU9pSTFOemswTmpJeE9UVXlNamt0WW13MllUVTFOMlkxYldKdGNuRjFZek5rZEdvelpuTmpOalF4YW05c00zRXVZWEJ3Y3k1bmIyOW5iR1YxYzJWeVkyOXVkR1Z1ZEM1amIyMGlMQ0p6ZFdJaU9pSXhNREU0TmpFMU5EUTJNakV5TVRFM01EUTRPRGtpTENKbGJXRnBiQ0k2SW0xaGNtbHZMbWQxWlhKeVlVQm5iV0ZwYkM1amIyMGlMQ0psYldGcGJGOTJaWEpwWm1sbFpDSTZkSEoxWlN3aVlYUmZhR0Z6YUNJNkltOVZkMnR5V0dWeFJXNUxSM1ZZYlRWc2VHcFpjSGNpTENKdVlXMWxJam9pYldGeWFXOGdaM1ZsY25KaElpd2ljR2xqZEhWeVpTSTZJbWgwZEhCek9pOHZiR2d6TG1kdmIyZHNaWFZ6WlhKamIyNTBaVzUwTG1OdmJTOWhMMEZEWnpodlkwbENNRE5IV0dRNFNFRjBRbXhFZUVwRlVGVlhaRzA0U0hWeWR5MXhlRTFPZGt0T09GWkVUekZ5Y21wVWFHZEJZalZ3UFhNNU5pMWpJaXdpWjJsMlpXNWZibUZ0WlNJNkltMWhjbWx2SWl3aVptRnRhV3g1WDI1aGJXVWlPaUpuZFdWeWNtRWlMQ0pwWVhRaU9qRTNOVE0wTmpBM01EY3NJbVY0Y0NJNk1UYzFNelEyTkRNd04zMC5pOTJudEtNUUZJbmZXSWZPV3ZJdnNlQ0tTclpVOXJMTFdWNk0xTEt5UkVtMmhtTjdVSWRqbkRnNlFna2NYVVo2ZC1PRGlCM0xYc182VXJ4OEZqUG9jRnJQelRSbF95WGhKWGpTdkRnWkx5MHRYQ3FXQU1uNl9TYU9jdG16a0w4U3JuX0pyZ3liVzhjTXMzN0o4elY1RmYtSU80ajlZV092TUN4aWgwZVhDM2E5WllLSllkQ1pIODFNR1phSUpIdjB2VGp4TkV1SlU2NVpVSXdpc1hvYWVTYXhSQ2dBczNxaHpjSnJQUzA4bVpzcWY2TTBieWc4QWRpVkYta2Z3V2R5cHRRdFAtc3JUaDhjOV9NYVZ5cTlJaTFORTN2NGpTZ0tDQktYTldqOXp3SzVPcm1CVk1Pb21lUE1kYV9Sb1ZJOGJ2RUU1b0NuY2cteFpPRDdaUkJ0enciLCJyZWZyZXNoX3Rva2VuX2V4cGlyZXNfaW4iOjYwNDc5OSwiZXhwaXJ5X2RhdGUiOjE3NTM0NjQzMDc0ODR9LCJpYXQiOjE3NTM0NjA3MDgsImV4cCI6MTc1MzQ4OTUwOH0.uKC-MD-0NwWOreRGiWuPCT0a6dR_Kv2Vm_sWbyyztgo"

HEADERS = {"Authorization": f"Bearer {JWT}"}

def print_and_validate(resp, expected_status=200, label=""):
    print(f"\n--- {label} ---")
    print(f"Status: {resp.status_code}")
    try:
        data = resp.json()
        print("Response:", data)
    except Exception:
        print("Raw Response:", resp.text)
        data = None
    if resp.status_code != expected_status:
        print(f"ERROR: Expected {expected_status}, got {resp.status_code}")
        sys.exit(1)
    return data

def main():
    print("Running main workflow...")  # Debug: main is running

    # 1. Health check
    resp = requests.get(f"{BASE_URL}/health")
    print_and_validate(resp, 200, "Health Check")
    time.sleep(2)

    # 2. Initialize Google Sheet
    resp = requests.post(f"{BASE_URL}/sheets/init", headers=HEADERS)
    data = print_and_validate(resp, 201, "Sheet Init")
    spreadsheet_id = data.get("spreadsheet_id") if data else None
    assert spreadsheet_id, "No spreadsheet_id returned"
    time.sleep(2)

    # 3. Create a job application
    app_payload = {
        "company": "Acme Corp",
        "job_title": "Software Engineer",
        "location": "Remote",
        "description": "Frontend role",
        "link": "https://example.com",
        "contact": "recruiter@email.com",
        "referral": "Jane Doe",
        "date_applied": "2025-07-22",
        "status": "applied",
        "favorite": False
    }
    resp = requests.post(
        f"{BASE_URL}/applications?sheetId={spreadsheet_id}",
        headers={**HEADERS, "Content-Type": "application/json"},
        json=app_payload
    )
    data = print_and_validate(resp, 201, "Create Application")
    application_id = data.get("id") if data else None
    assert application_id, "No application id returned"
    time.sleep(2)

    # 4. List job applications
    resp = requests.get(f"{BASE_URL}/applications?sheetId={spreadsheet_id}", headers=HEADERS)
    print_and_validate(resp, 200, "List Applications")
    time.sleep(2)

    # 5. Create a reminder
    reminder_payload = {
        "application_id": application_id,
        "reminder_date": "2025-07-25",
        "note": "Follow up"
    }
    resp = requests.post(
        f"{BASE_URL}/reminders?sheetId={spreadsheet_id}",
        headers={**HEADERS, "Content-Type": "application/json"},
        json=reminder_payload
    )
    print_and_validate(resp, 201, "Create Reminder")
    time.sleep(2)

    # 6. List reminders
    resp = requests.get(f"{BASE_URL}/reminders?sheetId={spreadsheet_id}", headers=HEADERS)
    print_and_validate(resp, 200, "List Reminders")
    time.sleep(2)

    # 7. Get analytics summary
    resp = requests.get(f"{BASE_URL}/analytics/summary?sheetId={spreadsheet_id}", headers=HEADERS)
    print_and_validate(resp, 200, "Analytics Summary")
    time.sleep(2)

    # 8. Get analytics trends
    resp = requests.get(f"{BASE_URL}/analytics/trends?sheetId={spreadsheet_id}", headers=HEADERS)
    print_and_validate(resp, 200, "Analytics Trends")

if __name__ == "__main__":
    main()
