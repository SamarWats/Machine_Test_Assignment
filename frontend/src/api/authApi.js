import axios from 'axios';
// Ensure axios is set up with the correct backend URL

export const loginUser = async (formData) => {
  try {
    const response = await axios.post('/auth/login', formData);
    return response.data; // This should return the token and other user data
  } catch (err) {
    throw err; // This will be caught in the Login.js component
  }
};
