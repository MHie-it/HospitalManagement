import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung
    if (error.response) {
      // Server trả về lỗi
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      return Promise.reject({ message: 'Không thể kết nối đến server!' });
    } else {
      // Lỗi khi setup request
      return Promise.reject({ message: 'Có lỗi xảy ra!' });
    }
  }
);

export default api;