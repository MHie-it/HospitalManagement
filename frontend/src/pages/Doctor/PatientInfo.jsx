// src/pages/Doctor/PatientInfo.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MOCK_PATIENT_INFO = {
    1: { name: "Nguyễn Văn B", age: 45, phone: "0900111222", history: "Tiền sử cao huyết áp, chưa phẫu thuật.", lastVisit: "01/10/2025" },
    2: { name: "Lê Thị C", age: 58, phone: "0900333444", history: "Đã mổ tim 5 năm trước, đang dùng thuốc chống đông.", lastVisit: "05/12/2025" },
    3: { name: "Trần Văn D", age: 22, phone: "0900555666", history: "Không có tiền sử bệnh mãn tính. Lần đầu khám Da liễu.", lastVisit: "N/A" },
};

const PatientInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const patient = MOCK_PATIENT_INFO[id];

    if (!patient) {
        return <div className="patient-info-page"><h2>Bệnh nhân không tồn tại.</h2></div>;
    }

    return (
        <div className="patient-info-page">
            <h2>📝 Hồ sơ Bệnh nhân: {patient.name}</h2>

            <div className="patient-details">
                <h3>Thông tin cá nhân</h3>
                <ul>
                    <li>**Họ tên:** {patient.name}</li>
                    <li>**ID Lịch hẹn:** #{id}</li>
                    <li>**Tuổi:** {patient.age}</li>
                    <li>**Điện thoại:** {patient.phone}</li>
                    <li>**Lần khám cuối:** {patient.lastVisit}</li>
                </ul>

                <h3>Lịch sử Y khoa</h3>
                <div style={{ padding: '15px', border: '1px solid var(--border-color)', borderRadius: '5px', backgroundColor: 'var(--background-light)' }}>
                    <p>{patient.history}</p>
                </div>
            </div>

            <div style={{ marginTop: '30px' }}>
                <button className="btn-secondary" onClick={() => navigate('/doctor/appointments')}>
                    Quay lại Lịch hẹn
                </button>
            </div>
        </div>
    );
};
export default PatientInfo;