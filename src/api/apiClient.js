import axios from 'axios';

const API_BASE_URL = 'https://backend-learning-support-sistem.vercel.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

export const categoryApi = {
  getAll: () => apiClient.get('/categories'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

export const subjectApi = {
  getAll: () => apiClient.get('/subjects'),
  getById: (id) => apiClient.get(`/subjects/${id}`),
  create: (data) => apiClient.post('/subjects', data),
  update: (id, data) => apiClient.put(`/subjects/${id}`, data),
  delete: (id) => apiClient.delete(`/subjects/${id}`),
};

export const chapterApi = {
  getAll: () => apiClient.get('/chapters'),
  getBySubject: (subjectId) => apiClient.get(`/chapters?subjectId=${subjectId}`),
  getById: (id) => apiClient.get(`/chapters/${id}`),
  create: (data) => apiClient.post('/chapters', data),
  update: (id, data) => apiClient.put(`/chapters/${id}`, data),
  delete: (id) => apiClient.delete(`/chapters/${id}`),
};

export const materialApi = {
  getAll: () => apiClient.get('/materials'),
  getByChapter: (chapterId) => apiClient.get(`/materials?chapterId=${chapterId}`),
  getById: (id) => apiClient.get(`/materials/${id}`),
  create: (data) => apiClient.post('/materials', data),
  update: (id, data) => apiClient.put(`/materials/${id}`, data),
  delete: (id) => apiClient.delete(`/materials/${id}`),
  complete: (id) => apiClient.post(`/materials/${id}/complete`),
};

export const quizApi = {
  getAll: () => apiClient.get('/quizzes'),
  getById: (id) => apiClient.get(`/quizzes/${id}`),
  getByMaterial: (materialId) => apiClient.get(`/quizzes?materialId=${materialId}`),
  create: (data) => apiClient.post('/quizzes', data),
  update: (id, data) => apiClient.put(`/quizzes/${id}`, data),
  delete: (id) => apiClient.delete(`/quizzes/${id}`),
  submit: (data) => apiClient.post('/quizzes/submit', data),
  // Question handling
  addQuestions: (data) => apiClient.post('/quizzes/questions', data), // Support bulk as per user request
  updateQuestion: (id, data) => apiClient.put(`/quizzes/questions/${id}`, data),
  deleteQuestion: (id) => apiClient.delete(`/quizzes/questions/${id}`),
  getQuestion: (id) => apiClient.get(`/quizzes/questions/${id}`),
};

export const analyticsApi = {
  getDashboard: () => apiClient.get('/analytics/dashboard'),
};

export default apiClient;
