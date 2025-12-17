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
      // Server trả về lỗi - giữ nguyên error object để có thể truy cập error.response.data
      // Thêm message vào error object từ response.data.message
      const errorMessage = error.response.data?.message || error.message || 'Có lỗi xảy ra!';
      const enhancedError = new Error(errorMessage);
      enhancedError.response = error.response;
      enhancedError.status = error.response.status;
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      return Promise.reject(new Error('Không thể kết nối đến server!'));
    } else {
      // Lỗi khi setup request
      return Promise.reject(new Error(error.message || 'Có lỗi xảy ra!'));
    }
  }
);

export default api;