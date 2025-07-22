import requests
import time
import sys

print("Starting backend workflow test...")  # Debug: script is running

BASE_URL = "http://localhost:3000"
JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDE4NjE1NDQ2MjEyMTE3MDQ4ODkiLCJlbWFpbCI6Im1hcmlvLmd1ZXJyYUBnbWFpbC5jb20iLCJuYW1lIjoibWFyaW8gZ3VlcnJhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lCMDNHWGQ4SEF0QmxEeEpFUFVXZG04SHVydy1xeE1OdktOOFZETzFycmpUaGdBYjVwPXM5Ni1jIiwiZ29vZ2xlVG9rZW5zIjp7ImFjY2Vzc190b2tlbiI6InlhMjkuYTBBUzNINk55X1VjY0REWEhBU2ptcFZkeDJLdGtXVUNEQ09vcWI1dVJTdE9ZYWV2MVZaR0pRMWJmdGtGZ1h0MEhqZ0VJVEVPb3l2UFZXS0dLZlg1QVZaR2lITzBSRlZLTWVfWlp0R1dkd2NIM1JZZkl6Y1Eyd1BfbUY1VThfS2hJa2RVQ1p0NUJCZVQwOGlzZnVCOWk4Z2VoOTJIUUlkcm5DX3VqZDRQSlNhQ2dZS0FZQVNBUTRTRlFIR1gyTWlJVWY4WkdFTXBPaGJfZWs4QVVCYmFRMDE3NSIsInJlZnJlc2hfdG9rZW4iOiIxLy8wZlhkQm9sU0FEZ0NjQ2dZSUFSQUFHQThTTndGLUw5SXI1TFNkOFJnenI1NWlCQ3NUUDJEVTJtWUg4WlhBSDRvM0d3U0dja0xUQlh0VnY3dENmYjFldm9sT0QzcHc1OFUtWTN3Iiwic2NvcGUiOiJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3NwcmVhZHNoZWV0cyBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2RyaXZlLmZpbGUgaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC91c2VyaW5mby5wcm9maWxlIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWwgb3BlbmlkIiwidG9rZW5fdHlwZSI6IkJlYXJlciIsImlkX3Rva2VuIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkltSTFNRGxqTlRFek9EYzJPR1kzWTJZeVpUZ3lOMlV3TkdJeU4yVTNaVFJqWW1NM1ltSTVNVGtpTENKMGVYQWlPaUpLVjFRaWZRLmV5SnBjM01pT2lKb2RIUndjem92TDJGalkyOTFiblJ6TG1kdmIyZHNaUzVqYjIwaUxDSmhlbkFpT2lJMU56azBOakl4T1RVeU1qa3RZbXcyWVRVMU4yWTFiV0p0Y25GMVl6TmtkR296Wm5Oak5qUXhhbTlzTTNFdVlYQndjeTVuYjI5bmJHVjFjMlZ5WTI5dWRHVnVkQzVqYjIwaUxDSmhkV1FpT2lJMU56azBOakl4T1RVeU1qa3RZbXcyWVRVMU4yWTFiV0p0Y25GMVl6TmtkR296Wm5Oak5qUXhhbTlzTTNFdVlYQndjeTVuYjI5bmJHVjFjMlZ5WTI5dWRHVnVkQzVqYjIwaUxDSnpkV0lpT2lJeE1ERTROakUxTkRRMk1qRXlNVEUzTURRNE9Ea2lMQ0psYldGcGJDSTZJbTFoY21sdkxtZDFaWEp5WVVCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWpOUVZXNUxRV3B6ZVUxalRrSlJSbmhDZGtkUE4zY2lMQ0p1WVcxbElqb2liV0Z5YVc4Z1ozVmxjbkpoSWl3aWNHbGpkSFZ5WlNJNkltaDBkSEJ6T2k4dmJHZ3pMbWR2YjJkc1pYVnpaWEpqYjI1MFpXNTBMbU52YlM5aEwwRkRaemh2WTBsQ01ETkhXR1E0U0VGMFFteEVlRXBGVUZWWFpHMDRTSFZ5ZHkxeGVFMU9ka3RPT0ZaRVR6RnljbXBVYUdkQllqVndQWE01Tmkxaklpd2laMmwyWlc1ZmJtRnRaU0k2SW0xaGNtbHZJaXdpWm1GdGFXeDVYMjVoYldVaU9pSm5kV1Z5Y21FaUxDSnBZWFFpT2pFM05UTXlNRGcyT0RZc0ltVjRjQ0k2TVRjMU16SXhNakk0Tm4wLlk0bERkN2JOd0hYQ1NOUHl2eVVyb05UU3VZNGNVakFmVW14ZWZBNnZnZU1NSU5hR25ZY000MS04Yi0wTV9Na3lzakxXWjJrcnI4a2s1QzZIQnRFYTZKSE1NYnZQUVJUZDJ1NDdYNDdDNU1WNzhReUtOMzZHemhlMDlxclZqM3JBOXM5Vnpydi0tdC1FN1JDV1dkU2FpNUY2TExLRGJ3YXVHd3phQTZReUFLYmVBR0hxdVR6STZlVHlic0xSY0Y4VWkwTnZEZ2V4LVF6WDJuWTB4YW9DZUFJeE1OV29yZkJ2SElUVWs0d2tuazZLRklvZlZnU01IaFhwMkRJRTN5WFdXX2Q1YWVJVGE2TjhsTFJTT3ZLdjVKbkxoUGR0cE9ybTJmUlhqeFhpUFJVTm55ZkpnOXRfWndOcGJmbXhFX1JVQWZ5SUI5UjE3NUtOei1aSnFuTklKQSIsInJlZnJlc2hfdG9rZW5fZXhwaXJlc19pbiI6NjA0Nzk5LCJleHBpcnlfZGF0ZSI6MTc1MzIxMjI4NTE0OH0sImlhdCI6MTc1MzIwODY4NiwiZXhwIjoxNzUzMjM3NDg2fQ.qF5Xx-Vo4RG6itfrNUiOyccq4smf80BXLt1N_RXFJDQ"

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
