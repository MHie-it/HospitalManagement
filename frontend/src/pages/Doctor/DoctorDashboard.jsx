// src/pages/Doctor/DoctorDashboard.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Sidebar = () => (
    <div className="sidebar">
        <div className="sidebar-header">
            <h3>🏥 Bác sĩ Dashboard</h3>
        </div>
        <nav className="sidebar-nav">
            <NavLink to="/doctor/appointments" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                📅 Lịch hẹn
            </NavLink>
            <NavLink to="/doctor/schedule" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                ✍️ Lịch làm việc/Nghỉ
            </NavLink>
            <NavLink to="/doctor/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                👤 Thông tin cá nhân
            </NavLink>
            <button className="nav-item logout">🚪 Đăng xuất</button>
        </nav>
    </div>
);

const DoctorDashboard = () => {
    const doctorName = "PGS. TS. Nguyễn Văn A";

    return (
        <div className="doctor-dashboard-layout">
            <Sidebar />
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <h1>Chào mừng, Bác sĩ {doctorName}</h1>
                </header>
                <main className="dashboard-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DoctorDashboard;