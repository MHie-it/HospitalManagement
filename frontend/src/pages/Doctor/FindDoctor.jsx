// src/pages/Doctor/FindDoctor.jsx

import React, { useState, useMemo } from 'react';
// Đã sửa đường dẫn import
import HeaderBanner from "../components/HeaderBanner.jsx";
import DoctorSearchForm from "../components/DoctorSearchForm.jsx";
import DoctorFilters from "../components/DoctorFilters.jsx";
import DoctorCard from "../components/DoctorCard.jsx";

// Dữ liệu giả định
const MOCK_DOCTORS = [
    { id: 1, name: "Nguyễn Văn A", academicTitle: "PGS.", degree: "TS.", specialty: "Tim mạch", position: "Trưởng khoa", hospital: "Bệnh viện Chợ Rẫy", location: "TPHCM", imageUrl: "https://via.placeholder.com/100?text=Dr+A", shortDescription: "Chuyên gia phẫu thuật can thiệp tim mạch." },
    { id: 2, name: "Trần Thị B", academicTitle: "ThS.", degree: "BSCK II", specialty: "Da liễu", position: "Phó khoa", hospital: "Bệnh viện Da liễu Trung ương", location: "Hà Nội", imageUrl: "https://via.placeholder.com/100?text=Dr+B", shortDescription: "Tư vấn và điều trị chuyên sâu về da liễu thẩm mỹ." },
    { id: 3, name: "Lê Văn C", academicTitle: "TS.", degree: "BSCK I", specialty: "Nhi", position: "Bác sĩ chính", hospital: "Bệnh viện Nhi Đồng 1", location: "TPHCM", imageUrl: "https://via.placeholder.com/100?text=Dr+C", shortDescription: "Chuyên khám và điều trị các bệnh lý hô hấp ở trẻ em." },
    { id: 4, name: "Phạm Thu D", academicTitle: "ThS.", degree: "BSCK I", specialty: "Tim mạch", position: "Bác sĩ chính", hospital: "Bệnh viện Đại học Y Dược", location: "TPHCM", imageUrl: "https://via.placeholder.com/100?text=Dr+D", shortDescription: "Khám và điều trị nội khoa tim mạch." },
];

const FindDoctor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});

    // Sử dụng useMemo để lọc dữ liệu dựa trên searchTerm và filters
    const filteredDoctors = useMemo(() => {
        let currentDoctors = MOCK_DOCTORS;

        // 1. Lọc theo Thanh tìm kiếm (searchTerm)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            currentDoctors = currentDoctors.filter(doc =>
                doc.name.toLowerCase().includes(lowerCaseSearch) ||
                doc.specialty.toLowerCase().includes(lowerCaseSearch) ||
                doc.hospital.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // 2. Lọc theo Bộ lọc (filters)
        currentDoctors = currentDoctors.filter(doc => {
            // Lọc theo Chuyên khoa
            if (filters.specialty && doc.specialty !== filters.specialty) {
                return false;
            }
            // Lọc theo Chức vụ
            if (filters.position && doc.position !== filters.position) {
                return false;
            }
            // Lọc theo Học hàm/Học vị
            if (filters.academicTitle && doc.academicTitle !== filters.academicTitle) {
                return false;
            }
            return true;
        });

        return currentDoctors;
    }, [searchTerm, filters]);

    // Logic cập nhật searchTerm
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Logic cập nhật filters
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value === "" ? undefined : value
        }));
    };

    return (
        <div className="find-doctor-page">
            <HeaderBanner />

            <DoctorSearchForm onSearch={handleSearch} onLocationChange={(loc) => console.log('Location changed to:', loc)} />

            <div className="container">
                <h2>Tìm kiếm Bác sĩ</h2>

                <DoctorFilters onFilterChange={handleFilterChange} />

                <div className="doctor-list">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy bác sĩ nào phù hợp với yêu cầu của bạn.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindDoctor;