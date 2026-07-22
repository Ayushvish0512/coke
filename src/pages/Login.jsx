import React, { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import SelectField from '../components/SelectField.jsx';
import FormContainer from '../components/FormContainer.jsx';
import { setFifteenHourSession, setUserContext } from '../utils/storage.js';
import locations from '../config/locations.json';
import { sendLoginWebhookPayload } from '../services/webhook.js';
import { upsertLoginActivity, checkTodayAttendance } from '../services/deviceAttendance.js';
import { ensureClientIpAddress } from '../utils/ipAddress.js';

export default function LoginPage() {
  const [locationId, setLocationId] = useState(String(locations[0]?.id ?? ''));
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const location = useMemo(
    () => locations.find((l) => String(l.id) === String(locationId)) || locations[0],
    [locationId],
  );

  const employees = useMemo(() => {
    return location?.employees || location?.employeeList || location?.users || [];
  }, [location]);

  const employee = useMemo(
    () => employees.find((e) => String(e.id) === String(employeeId)) || employees[0],
    [employees, employeeId],
  );

  async function onLogin() {
    setError('');
    if (!location || !employee) return;
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
const data = await sendLoginWebhookPayload({
        location: location?.name,
        password,
      });

      if (!data?.success) {
        setError(String(data?.message || 'Invalid location or password'));
        return;
      }

      setUserContext({
        employee: { id: employee.id, name: employee.name },
        location: { id: location.id, name: data?.location || location.name },
      });

      setFifteenHourSession({
        authenticated: true,
        location: data?.location || location.name,
      });

      // Fire-and-forget: record login activity in Supabase (non-blocking)
      // NOTE: We must await before navigation, otherwise page unload cancels the request
      try {
        const ip = await ensureClientIpAddress();
        console.log('[Supabase] Recording login for', employee?.name, '@', location?.name, 'IP:', ip);
        await upsertLoginActivity({
          location: location?.name,
          employeeName: employee?.name,
          ip: ip || 'unknown',
        });
        console.log('[Supabase] Login recorded successfully');
      } catch (err) {
        console.error('[Supabase] Failed to record login:', err);
      }

      // PRD v2.0: Check if attendance is completed for today
      // If yes → redirect to /operation
      // If no → redirect to /attendance
      try {
        const hasAttendance = await checkTodayAttendance({ employeeName: employee?.name });
        if (hasAttendance) {
          window.location.assign('/operation');
        } else {
          window.location.assign('/attendance');
        }
      } catch (err) {
        console.error('[Login] Attendance check failed, defaulting to /attendance:', err);
        window.location.assign('/attendance');
      }
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Header title="ERP" />
      <FormContainer>
        <div style={{ fontSize: 12, marginBottom: 10, color: '#555' }}>Login</div>

        <SelectField
          label="Location"
          value={String(location?.id)}
          onChange={(v) => {
            setLocationId(v);
            setEmployeeId('');
          }}
          options={locations.map((l) => ({ value: String(l.id), label: l.name }))}
        />

        <SelectField
          label="Employee"
          value={String(employee?.id)}
          onChange={setEmployeeId}
          options={employees.map((e) => ({ value: String(e.id), label: e.name }))}
        />

        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
          />
        </div>

        {error ? (
          <div style={{ marginTop: 12, color: '#dc2626', fontSize: 12 }}>{error}</div>
        ) : null}

        <div style={{ marginTop: 14 }}>
          <Button
            disabled={!location || !employee || isLoading}
            onClick={onLogin}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}


