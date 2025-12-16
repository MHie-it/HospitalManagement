# Hướng dẫn Test API với Thunder Client

## Cài đặt Thunder Client

1. Mở VS Code
2. Vào Extensions (Ctrl+Shift+X)
3. Tìm "Thunder Client" và cài đặt
4. Mở Thunder Client từ sidebar (biểu tượng sấm sét)

## Cấu hình Base URL

**Base URL:** `http://localhost:5001/api`

## Danh sách API Endpoints

### 1. Lấy tất cả ca làm việc

**Method:** `GET`  
**URL:** `http://localhost:5001/api/lichLamViec/ca-lam-viec`

**Headers:**
```
Content-Type: application/json
```

**Response mẫu:**
```json
{
  "message": "Lấy danh sách ca làm việc thành công!",
  "data": [
    {
      "_id": "...",
      "caLam": "Sang",
      "gioBatDau": "08:00",
      "gioKetThuc": "12:00"
    },
    {
      "_id": "...",
      "caLam": "Chieu",
      "gioBatDau": "13:00",
      "gioKetThuc": "17:00"
    },
    {
      "_id": "...",
      "caLam": "Toi",
      "gioBatDau": "18:00",
      "gioKetThuc": "22:00"
    }
  ],
  "count": 3
}
```

---

### 2. Lấy lịch làm việc của bác sĩ

**Method:** `GET`  
**URL:** `http://localhost:5001/api/lichLamViec/doctor/{doctorId}`

**Ví dụ:** `http://localhost:5001/api/lichLamViec/doctor/67890abcdef1234567890123`

**Headers:**
```
Content-Type: application/json
```

**Response mẫu:**
```json
{
  "message": "Lấy lịch làm việc thành công!",
  "data": [
    {
      "_id": "...",
      "ngayLam": "2024-12-23T00:00:00.000Z",
      "BacSi": {
        "_id": "...",
        "tenBS": "BS. Nguyễn Văn A",
        "Khoa": {
          "_id": "...",
          "tenKhoa": "Khoa Nội tổng quát"
        }
      },
      "CaLamViec": [
        {
          "_id": "...",
          "caLam": "Sang",
          "gioBatDau": "08:00",
          "gioKetThuc": "12:00"
        }
      ]
    }
  ],
  "count": 1
}
```

---

### 3. Tạo hoặc cập nhật lịch làm việc

**Method:** `POST`  
**URL:** `http://localhost:5001/api/lichLamViec/doctor/{doctorId}`

**Ví dụ:** `http://localhost:5001/api/lichLamViec/doctor/67890abcdef1234567890123`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "weekSchedule": [
    {
      "ngayLam": "2024-12-23",
      "caLamViecIds": [
        "caLamViecId1",
        "caLamViecId2"
      ]
    },
    {
      "ngayLam": "2024-12-24",
      "caLamViecIds": [
        "caLamViecId1"
      ]
    }
  ]
}
```

**Lưu ý:**
- `ngayLam`: Format YYYY-MM-DD
- `caLamViecIds`: Mảng các ID của ca làm việc (Sáng, Chiều, Tối)
- Có thể gửi nhiều ngày trong tuần cùng lúc

**Response mẫu:**
```json
{
  "message": "Cập nhật lịch làm việc thành công!",
  "data": [
    {
      "_id": "...",
      "ngayLam": "2024-12-23T00:00:00.000Z",
      "BacSi": "...",
      "CaLamViec": [
        {
          "_id": "...",
          "caLam": "Sang",
          "gioBatDau": "08:00",
          "gioKetThuc": "12:00"
        }
      ]
    }
  ],
  "count": 1
}
```

---

### 4. Xóa lịch làm việc

**Method:** `DELETE`  
**URL:** `http://localhost:5001/api/lichLamViec/{lichLamViecId}`

**Ví dụ:** `http://localhost:5001/api/lichLamViec/67890abcdef1234567890123`

**Headers:**
```
Content-Type: application/json
```

**Response mẫu:**
```json
{
  "message": "Xóa lịch làm việc thành công!"
}
```

---

## Cách test trong Thunder Client

### Bước 1: Tạo Request mới
1. Click nút **"New Request"** hoặc **Ctrl+N**
2. Chọn method (GET, POST, DELETE)
3. Nhập URL

### Bước 2: Thêm Headers
1. Click tab **"Headers"**
2. Thêm header `Content-Type: application/json`

### Bước 3: Thêm Body (cho POST)
1. Click tab **"Body"**
2. Chọn **"JSON"**
3. Paste JSON body vào

### Bước 4: Gửi Request
1. Click nút **"Send"** hoặc **Ctrl+Enter**
2. Xem kết quả ở tab **"Response"**

---

## Ví dụ Test Case

### Test Case 1: Lấy danh sách ca làm việc
```
GET http://localhost:5001/api/lichLamViec/ca-lam-viec
```

### Test Case 2: Lấy lịch làm việc của bác sĩ
```
GET http://localhost:5001/api/lichLamViec/doctor/67890abcdef1234567890123
```
*(Thay doctorId bằng ID thực tế từ database)*

### Test Case 3: Tạo lịch làm việc cho tuần
```
POST http://localhost:5001/api/lichLamViec/doctor/67890abcdef1234567890123

Body:
{
  "weekSchedule": [
    {
      "ngayLam": "2024-12-23",
      "caLamViecIds": ["caId1", "caId2"]
    },
    {
      "ngayLam": "2024-12-24",
      "caLamViecIds": ["caId1"]
    }
  ]
}
```

---

## Lưu ý quan trọng

1. **Đảm bảo backend đang chạy** trên port 5001
2. **Kiểm tra MongoDB connection** trước khi test
3. **Sử dụng ID thực tế** từ database (không dùng ID mẫu)
4. **Format ngày:** YYYY-MM-DD (ví dụ: 2024-12-23)
5. **caLamViecIds** phải là mảng các ObjectId hợp lệ

---

## Troubleshooting

### Lỗi: Connection refused
- Kiểm tra backend có đang chạy không
- Kiểm tra port 5001 có đúng không

### Lỗi: Invalid ID format
- Đảm bảo ID là MongoDB ObjectId (24 ký tự hex)
- Kiểm tra format: `/^[0-9a-fA-F]{24}$/`

### Lỗi: Ca làm việc không tồn tại
- Đảm bảo đã tạo ca làm việc (Sáng, Chiều, Tối) trong database
- Kiểm tra ID ca làm việc có đúng không

---

## Export Collection cho Thunder Client

Bạn có thể tạo Collection trong Thunder Client để lưu các request này:

1. Click **"Collections"** tab
2. Click **"New Collection"**
3. Đặt tên: "Hospital Management API"
4. Thêm các request vào collection
5. Lưu lại để sử dụng sau

