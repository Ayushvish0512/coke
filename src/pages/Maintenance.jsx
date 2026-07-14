import React, { useMemo, useState } from 'react';

import Header from '../components/Header.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import { getUserContext, isAttendanceCompleted } from '../utils/storage.js';
import { sendOperationWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';
import maintenanceMerged from '../config/maintenanceMerged.json';
import SelectField from '../components/SelectField.jsx';

const MACHINE_OPTIONS = maintenanceMerged.machineTypes.map((m) => ({ value: m.value, label: m.label }));

export default function MaintenancePage() {
  const ctx = getUserContext();
  const attendanceDone = isAttendanceCompleted();

  // (Not used currently, but kept since it existed in your original file)
  const fieldEntries = useMemo(() => Object.entries(maintenanceMerged.fields), []);

  const [formData, setFormData] = useState({
    // solo issue type: machine (Working/Not Working)
    machineType: '',
    workingStatus: 'OK',

    // solo issue type: branding (OK/Not OK)
    branding: 'OK',
    brandingRemarks: '',

    // general remarks when machine is not working
    remarks: '',
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

    const payloadForValidation = {
      ...formData,
      // remarks only when Not OK
      remarks: formData.workingStatus === 'Not OK' ? (formData.remarks || '') : '',
    };

    const nextErrors = validateRequiredFields(payloadForValidation, maintenanceMerged.fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      // login date time auto captured (India time, UTC+05:30)
      const loginDateTime = new Date().toISOString().replace(/Z$/, '+05:30');

await sendOperationWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'Maintenance',
        formData: {
          // Backend keys (used in your earlier mapping)
          machineType: formData.machineType,
          branding:
            formData.machineType === 'Branding'
              ? formData.branding
              : formData.workingStatus,
          brandingRemarks: formData.machineType === 'Branding' ? (formData.brandingRemarks || '') : '',
          remarks: formData.workingStatus === 'Not OK' ? (formData.remarks || '') : '',
          loginDateTime,
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
      <Header title="Maintainase" onBack={() => window.location.assign('/operation')} />

      <FormContainer>
        <form onSubmit={onSubmit}>
          {/* Solo issue: machine selection */}
          <SelectField
            label={maintenanceMerged.fields.machineType.label}
            value={formData.machineType}
            onChange={(v) => setFormData((p) => ({ ...p, machineType: v }))}
            // remove Branding option from machine dropdown (user requested separate branding)
            options={MACHINE_OPTIONS.filter((o) => o.value !== 'Branding')}
          />

          {/* Machine issue: Working / Not Working */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Working / Not Working</div>

            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="workingStatus"
                value="OK"
                checked={formData.workingStatus === 'OK'}
                onChange={(e) => setFormData((p) => ({ ...p, workingStatus: e.target.value }))}
              />{' '}
              Working
            </label>

            <label>
              <input
                type="radio"
                name="workingStatus"
                value="Not OK"
                checked={formData.workingStatus === 'Not OK'}
                onChange={(e) => setFormData((p) => ({ ...p, workingStatus: e.target.value }))}
              />{' '}
              Not Working
            </label>
          </div>

          {/* Remarks only for machine Not Working */}
          {formData.workingStatus === 'Not OK' ? (
            <InputField
              label="Remarks"
              value={formData.remarks}
              onChange={(v) => setFormData((p) => ({ ...p, remarks: v }))}
              placeholder=""
              type="text"
              error={errors.remarks}
            />
          ) : null}


          {/* Branding solo issue: separate from machine dropdown */}
          <div style={{ marginTop: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Branding / OK / Not OK</div>

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
            
            {formData.branding === 'Not OK' ? (
            <InputField
              label="Branding Remarks"
              value={formData.brandingRemarks}
              onChange={(v) => setFormData((p) => ({ ...p, brandingRemarks: v }))}
              placeholder=""
              type="text"
              error={errors.brandingRemarks}
            />
            ) : null}
          </div>

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

