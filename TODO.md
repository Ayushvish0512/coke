# TODO - Auto logout (15 hours)

- [ ] Implement session expiry helpers in `src/utils/storage.js` and `src/utils/constants.js`.
- [ ] Update `src/pages/Login.jsx` to set `sessionExpiresAt = Date.now() + 15h` on successful login.
- [ ] Add route/session guard to all protected pages (start with `src/pages/Operation.jsx`).
- [ ] Add failsafe auto-logout timer while app is open (optional).
- [ ] Verify by running dev server and checking redirect/clearing after expiry.

