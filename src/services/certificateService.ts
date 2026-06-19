import { api } from './api';

export const certificateService = {
  async issueCertificate(courseId: string) {
    const { data } = await api.post(`/certificates/${courseId}/issue`);
    return data;
  },

  async getMyCertificates() {
    const { data } = await api.get('/certificates/me');
    return data;
  },

  async verifyCertificate(code: string) {
    const { data } = await api.get(`/certificates/verify/${code}`);
    return data;
  },

  getDownloadUrl(certificateId: string) {
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
    return `${baseUrl}/certificates/${certificateId}/download`;
  },
};
