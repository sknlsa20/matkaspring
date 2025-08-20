import axios from 'axios';
export const API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://matkaspringrest-1.onrender.com/api'  // Render backend URL
    : 'http://localhost:7777/api';                  // Local backend URL

export default axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});
