const API_URL = typeof window !== "undefined"
  ? `${window.location.protocol}//${window.location.hostname}:5000/api`
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api");

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
  }

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("wedora_token");
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: "POST", body: JSON.stringify(body) }); }
  patch(endpoint, body) { return this.request(endpoint, { method: "PATCH", body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: "DELETE" }); }

  async uploadFile(endpoint, formData) {
    const token = this.getToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST", headers, body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data;
  }

  setAuth(token, refreshToken) {
    localStorage.setItem("wedora_token", token);
    localStorage.setItem("wedora_refresh", refreshToken);
  }

  clearAuth() {
    localStorage.removeItem("wedora_token");
    localStorage.removeItem("wedora_refresh");
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const api = new ApiClient();
export default api;
