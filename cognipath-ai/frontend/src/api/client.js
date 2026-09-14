const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  createStudent: (payload) =>
    request("/api/students", { method: "POST", body: JSON.stringify(payload) }),

  getStudent: (studentId) => request(`/api/students/${studentId}`),

  uploadDocument: (studentId, subject, file) => {
    const form = new FormData();
    form.append("student_id", studentId);
    form.append("subject", subject);
    form.append("file", file);
    return fetch(`${BASE_URL}/api/upload`, { method: "POST", body: form }).then(async (res) => {
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.detail || "Upload failed");
      }
      return res.json();
    });
  },

  generateAssessment: (payload) =>
    request("/api/assessment/generate", { method: "POST", body: JSON.stringify(payload) }),

  submitAssessment: (payload) =>
    request("/api/assessment/submit", { method: "POST", body: JSON.stringify(payload) }),

  getCompetency: (studentId) => request(`/api/competency/${studentId}`),

  generateRoadmap: (studentId, weeks = 4) =>
    request(`/api/roadmap/${studentId}/generate?weeks=${weeks}`, { method: "POST" }),

  getLatestRoadmap: (studentId) => request(`/api/roadmap/${studentId}/latest`),
};
