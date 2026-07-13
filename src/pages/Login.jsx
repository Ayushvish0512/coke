import React, { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import SelectField from '../components/SelectField.jsx';
import FormContainer from '../components/FormContainer.jsx';
import { getUserContext, setUserContext } from '../utils/storage.js';
import locations from '../config/locations.json';

export default function LoginPage() {
  const existing = getUserContext();

  const [locationId, setLocationId] = useState(
    existing?.location?.id
      ? String(existing.location.id)
      : String(locations[0]?.id ?? ''),
  );

  const [employeeId, setEmployeeId] = useState(
    existing?.employee?.id
      ? String(existing.employee.id)
      : '',
  );

  const location = useMemo(
    () => locations.find((l) => String(l.id) === String(locationId)) || locations[0],
    [locationId],
  );

  // “Employees” are now expected to come from the selected location data.
  const employees = useMemo(() => {
    return location?.employees || location?.employeeList || location?.users || [];
  }, [location]);

  const employee = useMemo(
    () => employees.find((e) => String(e.id) === String(employeeId)) || employees[0],
    [employees, employeeId],
  );


  return (
    <div>
      <Header title="SOFTY ERP" />
      <FormContainer>
        <div style={{ fontSize: 12, marginBottom: 10, color: '#555' }}>Login</div>

        <SelectField
          label="Location"
          value={String(location?.id)}
          onChange={setLocationId}
          options={locations.map((l) => ({ value: String(l.id), label: l.name }))}
        />

        <SelectField
          label="Employee"
          value={String(employee?.id)}
          onChange={setEmployeeId}
          options={employees.map((e) => ({ value: String(e.id), label: e.name }))}
        />

        <div style={{ marginTop: 14 }}>
          <Button
            disabled={!location || !employee}
            onClick={() => {
              setUserContext({
                employee: { id: employee.id, name: employee.name },
                location: { id: location.id, name: location.name },
              });
              window.location.assign('/operation');
            }}
          >
            Login
          </Button>
        </div>
      </FormContainer>
    </div>
  );
}

