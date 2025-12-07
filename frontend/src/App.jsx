// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Trang Công khai
import FindDoctor from './pages/Doctor/FindDoctor.jsx';
// Trang Dashboard Bác sĩ
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import AppointmentList from "./pages/Doctor/AppointmentList.jsx";
import ScheduleRegister from "./pages/Doctor/ScheduleRegister.jsx";
import ProfileSettings from "./pages/Doctor/ProfileSettings.jsx";
import PatientInfo from "./pages/Doctor/PatientInfo.jsx";

// Components giả lập cho các routes còn thiếu (FIX TRANG TRẮNG)
const DoctorProfilePage = () => <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>Hồ sơ Bác sĩ Công khai</h1>
    <p>Đây là trang chi tiết hồ sơ công khai của bác sĩ (Route: /doctor/:id). Nội dung sẽ được xây dựng sau.</p>
</div>;

const BookAppointmentPage = () => <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>Form Đặt Lịch Hẹn</h1>
    <p>Đây là trang form đặt lịch hẹn (Route: /book/:id). Nội dung sẽ được xây dựng sau.</p>
</div>;


const App = () => {
    // Giả lập trạng thái đăng nhập của bác sĩ
    const isLoggedIn = true;

    return (
        <Router>
            <Routes>
                {/* 1. Route Trang Chủ (Find Doctor) */}
                <Route path="/" element={<FindDoctor />} />

                {/* 2. Routes Công Khai Đã Thiếu (FIX LỖI TRANG TRẮNG) */}
                <Route path="/doctor/:id" element={<DoctorProfilePage />} />
                <Route path="/book/:id" element={<BookAppointmentPage />} />

                {/* 3. Route Dashboard Bác sĩ */}
                <Route path="/doctor" element={isLoggedIn ? <DoctorDashboard /> : <Navigate to="/" />}>
                    {/* Dashboard mặc định sẽ là trang Lịch hẹn */}
                    <Route index element={<Navigate to="appointments" replace />} />

                    <Route path="appointments" element={<AppointmentList />} />
                    <Route path="schedule" element={<ScheduleRegister />} />
                    <Route path="profile" element={<ProfileSettings />} />
                    <Route path="patient/:id" element={<PatientInfo />} />
                </Route>

                {/* Các Routes Khác */}
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
            </Routes>
        </Router>
    );
};

export default App;