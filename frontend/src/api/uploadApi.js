// src/api/uploadApi.js
import API from './axios';

export const uploadCSV = async (formData) => {
  const response = await API.post('/agents/upload-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
