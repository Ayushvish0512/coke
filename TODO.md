# Daily Login & Attendance Flow PRD

## Version
**v1.0**

---

# Overview

This feature manages the user's daily entry into the application.

The application should:

- Authenticate the user using Supabase Authentication.
- Record one login entry per user per day.
- Allow users to log out and log back in without repeating the daily login process.
- Require attendance after **2:00 PM IST (UTC+5:30)** before allowing access to the rest of the application.

This feature is the first mandatory step of the user's daily workflow.

---

# Objectives

- Secure application access using Supabase Authentication.
- Store one daily login record for each user.
- Prevent duplicate login records for the same day.
- Automatically restore user access if they already logged in earlier that day.
- Enforce attendance after 2:00 PM IST.
- Make the flow scalable for future mandatory daily steps.

---

# User Flow

```text
User Opens App
        │
        ▼
Check Supabase Session
        │
 ┌──────┴──────┐
 │             │
No            Yes
 │             │
 ▼             ▼
Login      Daily Login Check
```

---

## Step 1 — Authentication

### If no active session

- Show Login Screen.
- User authenticates using Supabase Auth.
- Continue to Daily Login Validation.

### If session exists

Continue directly to Daily Login Validation.

---

## Step 2 — Daily Login Validation

Check the `daily_login` table for:

- user_id
- Today's date (Asia/Kolkata timezone)

### Login record exists

- Do not create another record.
- Continue to Attendance Check.

### Login record does not exist

Create a new login record.

Example:

| Field | Value |
|--------|-------|
| user_id | Current User |
| login_date | Today (IST) |
| login_time | Current Timestamp |
| created_at | Current Timestamp |

Then continue.

---

## Step 3 — Attendance Validation

Determine current server time.

### Before 2:00 PM IST

Attendance is not required.

User gets full application access.

---

### After 2:00 PM IST

Check today's attendance.

### Attendance exists

Grant application access.

### Attendance missing

Redirect user to the Attendance screen.

No other screens should be accessible until attendance is submitted.

After attendance is saved:

- Unlock the application.
- Continue normal navigation.

---

# Logout Flow

```text
User Logout
      │
      ▼
Supabase Session Ends
      │
      ▼
User Logs In Again
      │
      ▼
Check Daily Login
      │
 ┌────┴────┐
 │         │
Exists    Missing
 │         │
 │      Create Record
 └────┬────┘
      ▼
Attendance Check
```

The logout action should never delete the daily login record.

---

# Database Design

## Table: daily_login

| Column | Type |
|----------|------|
| id | uuid |
| user_id | uuid |
| login_date | date |
| login_time | timestamptz |
| created_at | timestamptz |

### Constraint

```sql
UNIQUE(user_id, login_date)
```

This guarantees only one login record per user per day.

---

## Table: attendance

| Column | Type |
|----------|------|
| id | uuid |
| user_id | uuid |
| attendance_date | date |
| marked_at | timestamptz |
| status | text |
| created_at | timestamptz |

### Constraint

```sql
UNIQUE(user_id, attendance_date)
```

---

# React Application Flow

```text
App Start
      │
      ▼
Check Auth Session
      │
 ┌────┴─────┐
 │          │
Login     Authenticated
              │
              ▼
Check Daily Login
              │
      ┌───────┴────────┐
      │                │
Exists            Not Exists
      │                │
      │          Create Login
      │                │
      └───────┬────────┘
              ▼
Current Time > 2PM ?
              │
      ┌───────┴────────┐
      │                │
     No               Yes
      │                │
      ▼                ▼
 Open App      Check Attendance
                      │
             ┌────────┴────────┐
             │                 │
        Exists            Missing
             │                 │
             ▼                 ▼
         Open App     Attendance Screen
                             │
                             ▼
                    Save Attendance
                             │
                             ▼
                         Open App
```

---

# Business Rules

## Login

- User must authenticate using Supabase.
- Only one login record is allowed per day.
- Logging out does not remove the login record.
- Re-login on the same day must reuse the existing record.

---

## Attendance

- Attendance is required only after **2:00 PM IST**.
- Attendance can only be submitted once per day.
- Until attendance is submitted, access to the application is blocked.

---

## Timezone

Use **Asia/Kolkata (UTC+5:30)** for:

- Current date
- Current time
- Daily login validation
- Attendance validation

Do not rely solely on the device timezone.

---

# Suggested React Structure

```text
App
│
├── AuthProvider
├── SessionProvider
├── DailyLoginProvider
├── AttendanceProvider
└── ProtectedRoutes
        │
        ├── Login
        ├── Attendance
        └── Dashboard
```

---

# Application Startup Logic

On every application launch:

1. Check Supabase authentication session.
2. If not authenticated, redirect to Login.
3. Check today's daily login record.
4. Create the login record if it doesn't exist.
5. Check current IST time.
6. If after 2:00 PM, verify attendance.
7. If attendance is missing, redirect to the Attendance page.
8. If attendance exists (or it is before 2:00 PM), grant access to the application.

---

# Future Enhancements

This flow should evolve into a configurable **Daily Workflow Engine**.

Example workflow:

1. Login
2. Attendance
3. Daily Checklist
4. Task Assignment
5. Daily Briefing
6. End-of-Day Report

The application should always determine the first incomplete step and redirect the user accordingly. This design allows new mandatory daily actions to be added without changing the authentication flow.

---

# Success Criteria

- ✅ One login record per user per day.
- ✅ Re-login on the same day does not create duplicate records.
- ✅ Attendance is enforced after 2:00 PM IST.
- ✅ Users cannot bypass attendance after the cutoff time.
- ✅ Full application access is granted only after all required daily steps are completed.
- ✅ The architecture supports future expansion of mandatory daily workflows.


### Login Record Lookup

The application must not load all login records to determine whether the user has already logged in today.

Instead, it must query the `login` table using filters and return only one matching record.

**Validation Logic**

1. User successfully authenticates with Supabase.
2. Search the `login` table for a record that matches:
   - Employee
   - Location
   - Today's date (IST)
3. Return only the latest matching record (`LIMIT 1`).
4. If a record is found:
   - Consider the user already logged in for today.
   - Skip creating a new login record.
   - Continue to Attendance Validation.
5. If no record is found:
   - Create a new login record.
   - Continue to Attendance Validation.

**Example Query**

```sql
SELECT *
FROM login
WHERE
    emp_name = :employeeName
    AND location = :location
    AND DATE(created_at AT TIME ZONE 'Asia/Kolkata') = CURRENT_DATE
ORDER BY created_at DESC
LIMIT 1;
```

**Performance Requirement**

- Never fetch the entire login table.
- Always filter by employee, location, and today's date.
- Always use `LIMIT 1`.
- This approach remains fast even if the login table contains millions of records.