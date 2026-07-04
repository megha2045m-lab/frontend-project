const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const sanitizedBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
export const API_URL = `${sanitizedBaseUrl}/api/files`;
