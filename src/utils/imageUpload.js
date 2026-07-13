// Frontend helper for converting an image file to base64 and doing basic validation.
// Backend is responsible for uploading the image to imgbb.

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file, { maxBytes = 10 * 1024 * 1024 } = {}) {
  if (!file) return { ok: false, error: 'Image is required' };

  if (file.size > maxBytes) {
    return { ok: false, error: `Image must be less than 10 MB` };
  }

  // Basic mime check
  if (!file.type || !file.type.startsWith('image/')) {
    return { ok: false, error: 'File must be an image' };
  }

  return { ok: true };
}

