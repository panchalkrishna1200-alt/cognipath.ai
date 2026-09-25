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
  checkHealth: () => request("/"),

  matchSkills: (text, engine = "langchain") =>
    request("/api/skills/match", {
      method: "POST",
      body: JSON.stringify({ text, engine }),
    }),

  getSkillFramework: () => request("/api/skills/framework"),

  createStudent: (payload) =>
    request("/api/students", { method: "POST", body: JSON.stringify(payload) }),

  getStudent: (studentId) => request(`/api/students/${studentId}`),

  // Single file upload (backward compatible)
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

  // Multi-file upload
  uploadMultipleDocuments: (studentId, subject, files) => {
    const form = new FormData();
    form.append("student_id", studentId);
    form.append("subject", subject);
    for (const file of files) {
      form.append("files", file);
    }
    return fetch(`${BASE_URL}/api/upload/multi`, { method: "POST", body: form }).then(
      async (res) => {
        if (!res.ok) {
          const detail = await res.json().catch(() => ({}));
          throw new Error(detail.detail || "Upload failed");
        }
        return res.json();
      }
    );
  },

  // List all documents for a student
  getStudentDocuments: (studentId) =>
    request(`/api/upload/documents/${studentId}`),

  // Generate assessment — now accepts document_ids array
  generateAssessment: (payload) =>
    request("/api/assessment/generate", { method: "POST", body: JSON.stringify(payload) }),

  submitAssessment: (payload) =>
    request("/api/assessment/submit", { method: "POST", body: JSON.stringify(payload) }),

  getCompetency: (studentId) => request(`/api/competency/${studentId}`),

  generateRoadmap: (studentId, weeks = 4) =>
    request(`/api/roadmap/${studentId}/generate?weeks=${weeks}`, { method: "POST" }),

  getLatestRoadmap: (studentId) => request(`/api/roadmap/${studentId}/latest`),

  // Training ROI Dashboard methods
  getTrainingRoiAnalytics: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/training-roi/analytics${qs ? `?${qs}` : ""}`);
  },

  // AI Career Path Generator methods
  getCareerTracks: (scores = {}) => {
    const qs = new URLSearchParams(scores).toString();
    return request(`/api/career-path/tracks${qs ? `?${qs}` : ""}`);
  },

  simulateCareerGrowth: (payload) =>
    request("/api/career-path/simulate", { method: "POST", body: JSON.stringify(payload) }),

  generateCareerAdvice: (payload) =>
    request("/api/career-path/advise", { method: "POST", body: JSON.stringify(payload) }),
};
