import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Ensure your base URL is correct
});

// Set up Axios interceptor to automatically add the token from localStorage to the headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;  // Add token to the Authorization header
    console.log('Token added to request header:', token);  // Debugging line
  } else {
    console.error('No token found in localStorage');  // Debugging line
  }
  return req;
});

export default API;
