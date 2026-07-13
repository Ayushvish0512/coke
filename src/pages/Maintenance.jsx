import React, { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import { getUserContext, isAttendanceCompleted } from '../utils/storage.js';
import { sendWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';
import maintenanceFields from '../config/maintenanceFields.json';
import machineTypes from '../config/maintenanceMachineTypes.json';
import SelectField from '../components/SelectField.jsx';

export default function MaintenancePage() {
  const ctx = getUserContext();
  const attendanceDone = isAttendanceCompleted();

  const fieldEntries = useMemo(() => Object.entries(maintenanceFields), []);

  const [formData, setFormData] = useState({
    machineType: '',
    branding: 'OK',
    brandingRemarks: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!ctx) {
    window.location.assign('/login');
    return null;
  }

  const { employee, location } = ctx;

  async function onSubmit(e) {
    e.preventDefault();

    const nextErrors = validateRequiredFields(formData, maintenanceFields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      await sendWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'Maintenance',
        formData: {
          machineType: formData.machineType,
          branding: formData.branding,
          brandingRemarks: formData.brandingRemarks || '',
        },
      });

      window.location.assign('/operation');
    } catch (err) {
      alert(String(err?.message || err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Header title="Maintainase" />
      <FormContainer>
        <form onSubmit={onSubmit}>
          <SelectField
            label="Machine"
            value={formData.machineType}
            onChange={(v) => setFormData((p) => ({ ...p, machineType: v }))}
            options={machineTypes.machineTypes.map((m) => ({ value: m.value, label: m.label }))}
          />

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Branding</div>
            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="branding"
                value="OK"
                checked={formData.branding === 'OK'}
                onChange={(e) => setFormData((p) => ({ ...p, branding: e.target.value }))}
              />{' '}
              OK
            </label>
            <label>
              <input
                type="radio"
                name="branding"
                value="Not OK"
                checked={formData.branding === 'Not OK'}
                onChange={(e) => setFormData((p) => ({ ...p, branding: e.target.value }))}
              />{' '}
              Not OK
            </label>
          </div>

          <InputField
            label="Branding Remarks"
            value={formData.brandingRemarks}
            onChange={(v) => setFormData((p) => ({ ...p, brandingRemarks: v }))}
            placeholder=""
            type="text"
            error={errors.brandingRemarks}
          />

          <div style={{ marginTop: 6 }}>
            <Button disabled={!attendanceDone || isLoading} type="submit">
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
}

