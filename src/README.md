# Softy ERP - MVP Phase 1 (Capture Data Only)

This repo currently contains the Phase 1 React source structure.

## Env
- Copy `.env.example` to `.env` and set `VITE_WEBHOOK_URL`.

## Webhook
React sends a single POST payload to your n8n webhook URL.

Payload shape:
- Opening/Closing:
  {
    "location": "Sector 29",
    "employee": "Rahul",
    "operation": "Opening" | "Closing",
    "formData": { ... }
  }
- Attendance:
  {
    "location": "Sector 29",
    "employee": "Rahul",
    "operation": "Attendance",
    "formData": { "status": "Present" | ... , "remarks": "" }
  }

