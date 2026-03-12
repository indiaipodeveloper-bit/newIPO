// API Configuration - Point this to your Express backend
const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return url.endsWith("/api") ? url : `${url}/api`;
};

const API_BASE_URL = getApiBaseUrl();

const getToken = () => localStorage.getItem("token");

const headers = (json = true) => {
  const h: Record<string, string> = {};
  if (json) h["Content-Type"] = "application/json";
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/login`, { method: "POST", headers: headers(), body: JSON.stringify({ email, password }) }).then(handleResponse),
  register: (data: { name: string; email: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/register`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  forgotPassword: (email: string) =>
    fetch(`${API_BASE_URL}/auth/forgot-password`, { method: "POST", headers: headers(), body: JSON.stringify({ email }) }).then(handleResponse),
  resetPassword: (token: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/reset-password`, { method: "POST", headers: headers(), body: JSON.stringify({ token, password }) }).then(handleResponse),
  getProfile: () =>
    fetch(`${API_BASE_URL}/auth/profile`, { headers: headers() }).then(handleResponse),
};

// IPO API
export const ipoApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetch(`${API_BASE_URL}/ipos${query}`, { headers: headers() }).then(handleResponse);
  },
  getById: (id: string) =>
    fetch(`${API_BASE_URL}/ipos/${id}`, { headers: headers() }).then(handleResponse),
  create: (data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/ipos`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  update: (id: string, data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/ipos/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  delete: (id: string) =>
    fetch(`${API_BASE_URL}/ipos/${id}`, { method: "DELETE", headers: headers() }).then(handleResponse),
};

// IPO List API (ipo_lists table)
export const ipoListApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetch(`${API_BASE_URL}/ipo-lists${query}`, { headers: headers() }).then(handleResponse);
  },
  getById: (id: string) =>
    fetch(`${API_BASE_URL}/ipo-lists/${id}`, { headers: headers() }).then(handleResponse),
  create: (data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/ipo-lists`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  update: (id: string, data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/ipo-lists/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  delete: (id: string) =>
    fetch(`${API_BASE_URL}/ipo-lists/${id}`, { method: "DELETE", headers: headers() }).then(handleResponse),
  getSectors: () =>
    fetch(`${API_BASE_URL}/ipo-lists/sectors/list`, { headers: headers() }).then(handleResponse),
};

// Blog API
export const blogApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetch(`${API_BASE_URL}/blogs${query}`, { headers: headers() }).then(handleResponse);
  },
  getBySlug: (slug: string) =>
    fetch(`${API_BASE_URL}/blogs/${slug}`, { headers: headers() }).then(handleResponse),
  create: (data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/blogs`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  update: (id: string, data: Record<string, unknown>) =>
    fetch(`${API_BASE_URL}/blogs/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  delete: (id: string) =>
    fetch(`${API_BASE_URL}/blogs/${id}`, { method: "DELETE", headers: headers() }).then(handleResponse),
};

// Reports API
export const reportApi = {
  getAll: () => fetch(`${API_BASE_URL}/reports`, { headers: headers() }).then(handleResponse),
  create: (data: FormData) =>
    fetch(`${API_BASE_URL}/reports`, { method: "POST", headers: headers(false), body: data }).then(handleResponse),
  delete: (id: string) =>
    fetch(`${API_BASE_URL}/reports/${id}`, { method: "DELETE", headers: headers() }).then(handleResponse),
};

// Leads API
export const leadApi = {
  getAll: () => fetch(`${API_BASE_URL}/leads`, { headers: headers() }).then(handleResponse),
  create: (data: Record<string, string>) =>
    fetch(`${API_BASE_URL}/leads`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  export: () => fetch(`${API_BASE_URL}/leads/export`, { headers: headers() }).then(res => res.blob()),
};

// Users API (Admin)
export const userApi = {
  getAll: () => fetch(`${API_BASE_URL}/users`, { headers: headers() }).then(handleResponse),
  updateRole: (id: string, role: string) =>
    fetch(`${API_BASE_URL}/users/${id}/role`, { method: "PUT", headers: headers(), body: JSON.stringify({ role }) }).then(handleResponse),
  block: (id: string) =>
    fetch(`${API_BASE_URL}/users/${id}/block`, { method: "PUT", headers: headers() }).then(handleResponse),
};

// Stat API
export const statsApi = {
  getDashboard: () => fetch(`${API_BASE_URL}/stats/dashboard`, { headers: headers() }).then(handleResponse),
};

// Sector API
export const sectorApi = {
  getAll: () => fetch(`${API_BASE_URL}/sectors`, { headers: headers() }).then(handleResponse),
  getAdminAll: () => fetch(`${API_BASE_URL}/sectors/admin`, { headers: headers() }).then(handleResponse),
  create: (data: any) => fetch(`${API_BASE_URL}/sectors`, { method: "POST", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  update: (id: string, data: any) => fetch(`${API_BASE_URL}/sectors/${id}`, { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  delete: (id: string) => fetch(`${API_BASE_URL}/sectors/${id}`, { method: "DELETE", headers: headers() }).then(handleResponse),
};
