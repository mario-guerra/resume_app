#!/bin/bash

# Replace this with your actual JWT
JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDE4NjE1NDQ2MjEyMTE3MDQ4ODkiLCJlbWFpbCI6Im1hcmlvLmd1ZXJyYUBnbWFpbC5jb20iLCJuYW1lIjoibWFyaW8gZ3VlcnJhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lCMDNHWGQ4SEF0QmxEeEpFUFVXZG04SHVydy1xeE1OdktOOFZETzFycmpUaGdBYjVwPXM5Ni1jIiwiZ29vZ2xlVG9rZW5zIjp7ImFjY2Vzc190b2tlbiI6InlhMjkuYTBBUzNINk54cXU3eVEtc29jTFBlVGE0ZXhjU214UnlzQnZlRHN4c1l0dGlCa0Q3M3NsVEcwSnpoWGVuTThhYUFfdFZFeUNYNG9fdmpacnh4YVBCbXg2ZHlpNS1WN2ROeV9LNFZIZm9XVTZvS2RtWGlIeC1HaWhIODNJbVF3dVBmQzMteVFDcUVMc0l0bVdiMXh5bGllZXNwMW44UF9FZmUwQ0JtOXNnMWdhQ2dZS0FkTVNBUmNTRlFIR1gyTWlGbHhsdWtXdUdPX0VfWXpyclFodjBnMDE3NSIsInJlZnJlc2hfdG9rZW4iOiIxLy8wZnhqUlEtQmdvVVdLQ2dZSUFSQUFHQThTTndGLUw5SXJZVW1FMVlBMTh6UEQ2cVkwdGtZeUIyLThWdkRKUFBPSk94WTJxUTctRS1mRzBsMmNtblFUR1NoRjM0Mm9zNl95N3JZIiwic2NvcGUiOiJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3VzZXJpbmZvLnByb2ZpbGUgb3BlbmlkIGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWwiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiaWRfdG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0ltdHBaQ0k2SW1JMU1EbGpOVEV6T0RjMk9HWTNZMll5WlRneU4yVXdOR0l5TjJVM1pUUmpZbU0zWW1JNU1Ua2lMQ0owZVhBaU9pSktWMVFpZlEuZXlKcGMzTWlPaUpvZEhSd2N6b3ZMMkZqWTI5MWJuUnpMbWR2YjJkc1pTNWpiMjBpTENKaGVuQWlPaUkxTnprME5qSXhPVFV5TWprdFltdzJZVFUxTjJZMWJXSnRjbkYxWXpOa2RHb3pabk5qTmpReGFtOXNNM0V1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUkxTnprME5qSXhPVFV5TWprdFltdzJZVFUxTjJZMWJXSnRjbkYxWXpOa2RHb3pabk5qTmpReGFtOXNNM0V1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TURFNE5qRTFORFEyTWpFeU1URTNNRFE0T0RraUxDSmxiV0ZwYkNJNkltMWhjbWx2TG1kMVpYSnlZVUJuYldGcGJDNWpiMjBpTENKbGJXRnBiRjkyWlhKcFptbGxaQ0k2ZEhKMVpTd2lZWFJmYUdGemFDSTZJbEowYUdWUFFqTXlSVUp4VTJ0RU9WOXBUVWxtUjBFaUxDSnVZVzFsSWpvaWJXRnlhVzhnWjNWbGNuSmhJaXdpY0dsamRIVnlaU0k2SW1oMGRIQnpPaTh2YkdnekxtZHZiMmRzWlhWelpYSmpiMjUwWlc1MExtTnZiUzloTDBGRFp6aHZZMGxDTUROSFdHUTRTRUYwUW14RWVFcEZVRlZYWkcwNFNIVnlkeTF4ZUUxT2RrdE9PRlpFVHpGeWNtcFVhR2RCWWpWd1BYTTVOaTFqSWl3aVoybDJaVzVmYm1GdFpTSTZJbTFoY21sdklpd2labUZ0YVd4NVgyNWhiV1VpT2lKbmRXVnljbUVpTENKcFlYUWlPakUzTlRNeU1EYzJNamtzSW1WNGNDSTZNVGMxTXpJeE1USXlPWDAuaTZPNkc2cVJXWlNFcTNTMlhzSV84UUlFRFVhYXR3bnd2bWw3MFdBZmx5a1FjZVcxVnhpSUp6aDI1UGZfb2YtUVpIclhNNXp3bng0ZXYyVHVkZU1pei1EcFpMdVdraGhaR0ppcG5pdi1PY255bGRROGxsZHliOHMxVnRkS2tEa2pnR2FibUg4M01aUEJEb0JhRnVJUV9mMTFnZ2d3b3k4SGRyNlZ1aHpYb2UwenhYOUttY0dSZmhZWnFTTDhnUTJjMDJrVVpKWUV4M05GeklUeFRSV3luOWxyU1k4d3NodU96emJrUVNoZktOVGw5azRvY08zZXJGVTdmeFI4clZfUjNnYnR6RVpDQUlkSllPVmVJeU0tblJfYjZBX3ZiVTNIN2xCbzVUbXlOWGxxUTJqUDNJRU9lWTM0NTRrTWFiT25rRGxvZHU1N2laclJtMUJ1bnM4anlnIiwicmVmcmVzaF90b2tlbl9leHBpcmVzX2luIjo2MDQ3OTksImV4cGlyeV9kYXRlIjoxNzUzMjExMjI4MjI0fSwiaWF0IjoxNzUzMjA3NjI5LCJleHAiOjE3NTMyMTEyMjl9.e_58PYi_r3vDVc6s1jW_lJD0Cu6G4H0LJLIakaGGdTk"

# 1. Health check
curl -X GET http://localhost:3000/health
sleep 2

# 2. Initialize Google Sheet (get spreadsheet_id)
curl -X POST http://localhost:3000/sheets/init -H "Authorization: Bearer $JWT"
sleep 2

# Replace SHEET_ID below with the spreadsheet_id returned from the previous command
SHEET_ID="<your_spreadsheet_id>"

# 3. Create a job application
curl -X POST "http://localhost:3000/applications?sheetId=$SHEET_ID" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"company":"Acme Corp","job_title":"Software Engineer","location":"Remote","description":"Frontend role","link":"https://example.com","contact":"recruiter@email.com","referral":"Jane Doe","date_applied":"2025-07-22","status":"applied","favorite":false}'
sleep 2

# 4. List job applications
curl -X GET "http://localhost:3000/applications?sheetId=$SHEET_ID" -H "Authorization: Bearer $JWT"
sleep 2

# 5. Create a reminder (replace APPLICATION_ID with an actual application id)
APPLICATION_ID="<your_application_id>"
curl -X POST "http://localhost:3000/reminders?sheetId=$SHEET_ID" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d "{\"application_id\":\"$APPLICATION_ID\",\"reminder_date\":\"2025-07-25\",\"note\":\"Follow up\"}"
sleep 2

# 6. List reminders
curl -X GET "http://localhost:3000/reminders?sheetId=$SHEET_ID" -H "Authorization: Bearer $JWT"
sleep 2

# 7. Get analytics summary
curl -X GET "http://localhost:3000/analytics/summary?sheetId=$SHEET_ID" -H "Authorization: Bearer $JWT"
sleep 2

# 8. Get analytics trends
curl -X GET "http://localhost:3000/analytics/trends?sheetId=$SHEET_ID" -H "Authorization: Bearer $JWT"
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"company":"Acme Corp","job_title":"Software Engineer","location":"Remote","description":"Frontend role","link":"https://example.com","contact":"recruiter@email.com","referral":"Jane Doe","date_applied":"2025-07-22","status":"applied","favorite":false}'

# 4. List job applications
curl -X GET "http://localhost:3000/applications?sheetId=$SHEET_ID" -H "Authorization: Bearer $JWT"

# 5. Create a reminder (replace APPLICATION_ID with an actual application id)
APPLICATION_ID="<your_application_id>"
curl -X POST "http://localhost:3000/reminders?sheetId=$SHEET_ID" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d "{\"application_id\":\"$APPLICATION_ID\",\"reminder_date\":\"2025-07-25\",\"note\":\"Follow up\"}"

# 6. List reminders
curl -X GET "http://localhost:3000/reminders?sheetId=$SHEET_ID" -H "Authorization: Bearer $JWT"

# 7. Get analytics summary
curl -X GET "http://localhost:3000/analytics/summary?sheetId=$SHEET_ID" -H "Authorization: Bearer $JWT"

# 8. Get analytics trends
curl -X GET "http://localhost:3000/analytics/trends?sheetId=$SHEET_ID" -H "Authorization: Bearer $JWT"
