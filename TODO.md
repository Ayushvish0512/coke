## Maintenance page - machine issue + remarks (TODO)

- [x] Inspect current `src/pages/Maintenance.jsx`
- [x] Inspect maintenance configs: `maintenanceMerged.json`, `maintenanceFields.json`, `maintenanceMachineTypes.json`
- [ ] Update `src/pages/Maintenance.jsx` to use dropdown for **Machine with issue** (single selection)
- [ ] Rename UI: “Branding” section -> “Working / Not Working” (for selected machine)
- [ ] Show “Remarks” only when selected machine is **Not Working**
- [ ] If selected machine is **Branding**, show “Branding Remarks” + “Remarks”; otherwise hide “Branding Remarks”
- [ ] Adjust webhook payload accordingly (send appropriate fields, avoid misleading branding fields)
- [ ] Run app (npm run dev / build) to ensure no errors

