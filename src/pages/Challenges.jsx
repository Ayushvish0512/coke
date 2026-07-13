import React, { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import SelectField from '../components/SelectField.jsx';
import { getUserContext, isAttendanceCompleted } from '../utils/storage.js';
import { sendWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';
import challengesFields from '../config/challengesFields.json';

const YES_NO_OPTIONS = [
  { value: '', label: '-- Select --' },
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

export default function ChallengesPage() {
  const ctx = getUserContext();
  const attendanceDone = isAttendanceCompleted();

  const fieldEntries = useMemo(() => Object.entries(challengesFields), []);

  const [formData, setFormData] = useState({
    challengeType: '',
    lessCround: '',
    rawMaterialUnavailable: '',
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

    const nextErrors = validateRequiredFields(formData, challengesFields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      await sendWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'Challenges',
        formData: {
          challengeType: formData.challengeType,
          lessCround: formData.lessCround || undefined,
          rawMaterialUnavailable: formData.rawMaterialUnavailable || undefined,
          remarks: formData.remarks || '',
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
      <Header title="Challenges" />
      <FormContainer>
        <form onSubmit={onSubmit}>
          <InputField
            label={challengesFields.challengeType.label}
            value={formData.challengeType}
            onChange={(v) => setFormData((p) => ({ ...p, challengeType: v }))}
            placeholder=""
            type="text"
            error={errors.challengeType}
          />

          <SelectField
            label={challengesFields.lessCround.label}
            value={formData.lessCround}
            onChange={(v) => setFormData((p) => ({ ...p, lessCround: v }))}
            options={YES_NO_OPTIONS}
          />

          <SelectField
            label={challengesFields.rawMaterialUnavailable.label}
            value={formData.rawMaterialUnavailable}
            onChange={(v) => setFormData((p) => ({ ...p, rawMaterialUnavailable: v }))}
            options={YES_NO_OPTIONS}
          />

          <InputField
            label={challengesFields.remarks.label}
            value={formData.remarks}
            onChange={(v) => setFormData((p) => ({ ...p, remarks: v }))}
            placeholder=""
            type="text"
            error={errors.remarks}
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

