// src/pages/components/DoctorCard.jsx

import React ,{useState}from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();

    // 1. Chức năng Đặt lịch hẹn (Điều hướng thực tế)
    const handleBookAppointment = () => {
        // Điều hướng đến trang đặt lịch (Route: /book/:id)
      //  navigate(`/book/${doctor.id}`);
        console.log(`Đã điều hướng đến trang đặt lịch cho bác sĩ ID: ${doctor.id}`);
    };

    // 2. Chức năng Xem chi tiết hồ sơ công khai (Điều hướng thực tế)
    const handleViewDetails = () => {
        // Điều hướng đến trang hồ sơ công khai bác sĩ (Route: /doctor/:id)
      //  navigate(`/doctor/${doctor.id}`);
        console.log(`Đã điều hướng đến trang hồ sơ công khai bác sĩ ID: ${doctor.id}`);
    };

    return (
        <div className="doctor-card">
            <div className="card-header-info">
                <div className="doctor-photo-wrapper">
                    <img src={doctor.imageUrl} alt={doctor.name} className="doctor-photo" />
                </div>
                <div className="doctor-details">
                    <h2 className="doctor-name">
                        {doctor.academicTitle} {doctor.degree}. {doctor.name}
                    </h2>
                    <p className="doctor-title">{doctor.position} - **{doctor.specialty}**</p>
                    <p className="doctor-hospital">{doctor.hospital} - {doctor.location}</p>
                </div>
            </div>
            <div className="card-body">
                <p className="short-desc">{doctor.shortDescription}</p>
            </div>
            <div className="card-actions">
                <button
                    className="btn-detail btn-secondary"
                    onClick={handleViewDetails}
                >
                    Xem chi tiết
                </button>

                <button
                    className="btn-book btn-primary"
                    onClick={handleBookAppointment}
                >
                    Đặt lịch hẹn
                </button>
            </div>
        </div>
    );
};
export default DoctorCard;