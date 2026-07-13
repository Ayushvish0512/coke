export function validateRequiredFields(formData, fieldsMap) {
  const errors = {};

  for (const [key, meta] of Object.entries(fieldsMap)) {
    if (!meta?.required) continue;
    const v = formData?.[key];

    if (meta.type === 'number') {
      if (v === '' || v === null || v === undefined || Number.isNaN(Number(v))) {
        errors[key] = `${meta.label} is required`;
      }
    } else {
      if (v === '' || v === null || v === undefined) {
        errors[key] = `${meta.label} is required`;
      }
    }
  }

  return errors;
}

