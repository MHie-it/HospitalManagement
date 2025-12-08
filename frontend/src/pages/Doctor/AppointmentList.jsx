

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const MOCK_APPOINTMENTS = [
    { id: 1, patient: "Nguyễn Văn B", date: "05/12/2025", time: "09:00", status: "Chờ xác nhận", reason: "Khám tổng quát" },
    { id: 2, patient: "Lê Thị C", date: "05/12/2025", time: "10:30", status: "Đã xác nhận", reason: "Tái khám Tim mạch" },
    { id: 3, patient: "Trần Văn D", date: "06/12/2025", time: "14:00", status: "Đã khám", reason: "Khám Da liễu" },
    { id: 4, patient: "Phạm Thu E", date: "06/12/2025", time: "15:00", status: "Đã hủy", reason: "Cảm cúm" },
    { id: 5, patient: "Hoàng Minh F", date: "07/12/2025", time: "08:30", status: "Chờ xác nhận", reason: "Tư vấn dinh dưỡng" },
];

const AppointmentList = () => {
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
    const [filter, setFilter] = useState('Tất cả');

    const filteredAppointments = useMemo(() => {
        const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

        return appointments.filter(app => {
            if (filter === 'Tất cả') return true;
            if (filter === 'Hôm nay') {
                return app.date === today && app.status !== 'Đã khám' && app.status !== 'Đã hủy';
            }
            return app.status === filter;
        });
    }, [appointments, filter]);

    const handleAction = (id, newStatus) => {
        setAppointments(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Đã xác nhận': return 'status-Đã-xác-nhận';
            case 'Chờ xác nhận': return 'status-Chờ-xác-nhận';
            case 'Đã khám': return 'status-Đã-khám';
            case 'Đã hủy': return 'status-Đã-hủy';
            default: return '';
        }
    };

    return (
        <div className="appointment-list">
            <h2>📅 Danh sách Lịch hẹn</h2>

            <div className="list-filters" style={{ marginBottom: '20px' }}>
                {['Tất cả', 'Hôm nay', 'Chờ xác nhận', 'Đã xác nhận', 'Đã khám', 'Đã hủy'].map(f => (
                    <button
                        key={f}
                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <table className="appointments-table">
                <thead>
                    <tr>
                        <th>Ngày/Giờ</th>
                        <th>Bệnh nhân</th>
                        <th>Lý do</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(app => (
                            <tr key={app.id} className={getStatusClass(app.status)}>
                                <td>{app.date} <span style={{ fontWeight: 'bold', display: 'block' }}>{app.time}</span></td>
                                <td>{app.patient}</td>
                                <td>{app.reason}</td>
                                <td><span className="appointment-status-badge">{app.status}</span></td>
                                <td className="appointment-actions">
                                    <Link to={`/doctor/patient/${app.id}`} className="action-link" style={{ marginRight: '10px', color: 'var(--primary-color)' }}>Xem chi tiết</Link>

                                    {app.status === 'Chờ xác nhận' && (
                                        <>
                                            <button className="btn-action-confirm btn-primary" onClick={() => handleAction(app.id, 'Đã xác nhận')} style={{ padding: '5px 10px', fontSize: '0.85rem' }}>Xác nhận</button>
                                            <button className="btn-action-cancel btn-cancel" onClick={() => handleAction(app.id, 'Đã hủy')} style={{ padding: '5px 10px', fontSize: '0.85rem', marginLeft: '5px' }}>Hủy</button>
                                        </>
                                    )}
                                    {app.status === 'Đã xác nhận' && (
                                        <button className="btn-action-complete" onClick={() => handleAction(app.id, 'Đã khám')} style={{ padding: '5px 10px', fontSize: '0.85rem' }}>Hoàn tất Khám</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Không có lịch hẹn nào phù hợp.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default AppointmentList;