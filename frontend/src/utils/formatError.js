/**
 * Safely format any error into a displayable string for React JSX children.
 * Prevents "Objects are not valid as a React child (found: object with keys {code, message})".
 */
export function formatError(error, fallback = '') {
  if (error === null || error === undefined) return fallback;
  if (typeof error === 'string') return error;
  if (typeof error === 'number' || typeof error === 'boolean') return String(error);
  if (typeof error === 'object') {
    if (typeof error.message === 'string' && error.message) return error.message;
    if (typeof error.code === 'string' && error.code) return error.code;
    if (typeof error.error === 'string' && error.error) return error.error;
    if (typeof error.msg === 'string' && error.msg) return error.msg;
    if (error.data) return formatError(error.data, fallback);
    if (error.response?.data) return formatError(error.response.data, fallback);
    try {
      const json = JSON.stringify(error);
      return json === '{}' ? (error.name || fallback || 'An error occurred') : json;
    } catch {
      return String(error || fallback);
    }
  }
  return String(error || fallback);
}

export default formatError;
