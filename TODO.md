# TODO - Softy ERP MVP Phase 1 (Capture Data Only)

## Step 1: Gather repo info
- [ ] List existing files/folders under repo root
- [ ] Search for any existing React/Vite setup or package.json

## Step 2: Confirm architecture
- [ ] Create Phase 1 folder structure under src/
- [ ] Add local-only config JSON files

## Step 3: Implement minimal React app
- [ ] Setup React entry files (main.jsx, App.jsx)
- [ ] Add routes: Login, Operation, Attendance, Opening, Closing
- [ ] Implement localStorage persistence and attendance gating

## Step 4: Implement lightweight components
- [ ] Create shared components (Header, Loader, InputField, SelectField, FormContainer, AttendanceLock, SubmitButton)
- [ ] Ensure minimal clicks UX

## Step 5: Implement single webhook service
- [ ] Create services/webhook.js to POST form payload


## Step 6: Add webhook payload shape
- [ ] React sends {location, employee, operation, formData} can be change later on
- [ ] Generate submission metadata only inside n8n (not in React)

## Step 7: Testing
- [ ] Run dev server / build (if package exists) and verify flows

## Step 8: Extension points (Phase 1.2)
- [ ] Build photo capture components behind optional integration points (no behavior change yet)


