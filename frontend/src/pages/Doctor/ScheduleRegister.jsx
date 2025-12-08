// src/pages/Doctor/ScheduleRegister.jsx

import React, { useState, useMemo } from 'react';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const MOCK_SCHEDULE = {
    '2025-12-08': ['08:00', '09:00', '14:00'],
    '2025-12-09': ['Nghỉ'],
    '2025-12-10': ['10:00', '11:00', '16:00', '17:00'],
};

const getNextDate = (currentDate, days) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const ScheduleRegister = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [isDayOff, setIsDayOff] = useState(false);
    const [schedule, setSchedule] = useState(MOCK_SCHEDULE);

    // --- LOGIC XEM LỊCH TỔNG QUAN ---
    const weeklySchedule = useMemo(() => {
        const today = new Date();
        const startOfWeek = today.toISOString().split('T')[0];
        const scheduleData = [];

        for (let i = 0; i < 7; i++) {
            const dateStr = getNextDate(startOfWeek, i);
            const dateObj = new Date(dateStr);
            const dayOfWeek = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });

            const slots = schedule[dateStr];
            let status = '';
            let slotList = '';

            if (!slots || slots.length === 0) {
                status = 'Trống';
            } else if (slots.includes('Nghỉ')) {
                status = 'NGHỈ';
            } else {
                status = 'Làm việc';
                slotList = slots.sort().join(', ');
            }

            scheduleData.push({
                date: dateStr,
                day: dayOfWeek,
                status: status,
                slots: slotList
            });
        }
        return scheduleData;
    }, [schedule]);


    // --- LOGIC ĐĂNG KÝ LỊCH ---

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);

        const currentSchedule = schedule[date] || [];

        if (currentSchedule.includes('Nghỉ')) {
            setIsDayOff(true);
            setSelectedSlots([]);
        } else {
            setIsDayOff(false);
            setSelectedSlots(currentSchedule);
        }
    };

    const toggleSlot = (slot) => {
        setSelectedSlots(prev =>
            prev.includes(slot)
                ? prev.filter(s => s !== slot)
                : [...prev, slot]
        );
    };

    const handleDayOffToggle = (checked) => {
        setIsDayOff(checked);
        setSelectedSlots([]);
    };

    const handleRegister = () => {
        if (!selectedDate) {
            alert("Vui lòng chọn ngày.");
            return;
        }

        let newSlots = [];
        if (isDayOff) {
            newSlots = ['Nghỉ'];
        } else if (selectedSlots.length === 0) {
            alert("Vui lòng chọn ít nhất một khung giờ hoặc chọn Ngày Nghỉ.");
            return;
        } else {
            newSlots = selectedSlots;
        }

        setSchedule(prev => ({
            ...prev,
            [selectedDate]: newSlots
        }));

        const message = isDayOff ?
            `Đã đăng ký NGÀY NGHỈ vào ${selectedDate}.` :
            `Đã cập nhật ${newSlots.length} khung giờ làm việc vào ${selectedDate}.`;

        alert(message);
    };

    // --- GIAO DIỆN HIỂN THỊ ---
    return (
        <div className="schedule-register">
            <h2>🗓️ Quản lý Lịch làm việc & Nghỉ</h2>

            {/* PHẦN XEM LỊCH LÀM VIỆC TỔNG QUAN */}
            <div className="weekly-schedule-view" style={{ marginBottom: '40px' }}>
                <h3>Xem Lịch làm việc 7 ngày tới</h3>
                <table className="appointments-table" style={{ fontSize: '0.9rem' }}>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Thứ</th>
                            <th>Trạng thái</th>
                            <th>Khung giờ làm việc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weeklySchedule.map(day => (
                            <tr key={day.date} style={{
                                backgroundColor: day.status === 'NGHỈ' ? '#fcebeb' : day.status === 'Làm việc' ? '#e9f7ee' : 'white'
                            }}>
                                <td>{day.date}</td>
                                <td>{day.day}</td>
                                <td style={{ fontWeight: 'bold', color: day.status === 'NGHỈ' ? '#dc3545' : day.status === 'Làm việc' ? '#28a745' : '#6c757d' }}>
                                    {day.status}
                                </td>
                                <td>{day.slots || '---'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <hr style={{ margin: '20px 0', borderTop: '1px solid #dee2e6' }} />

            {/* PHẦN ĐĂNG KÝ/CẬP NHẬT LỊCH */}
            <h3>✍️ Đăng ký/Cập nhật Lịch</h3>
            <div className="schedule-controls">
                <div className="form-group">
                    <label htmlFor="scheduleDate">Chọn Ngày Cần Cập nhật:</label>
                    <input
                        type="date"
                        id="scheduleDate"
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {selectedDate && (
                    <div className="form-group">
                        <label style={{ fontWeight: 'bold' }}>
                            <input
                                type="checkbox"
                                checked={isDayOff}
                                onChange={(e) => handleDayOffToggle(e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            Đăng ký **Ngày Nghỉ**
                        </label>
                    </div>
                )}
            </div>

            {selectedDate && !isDayOff && (
                <div className="time-slots-selection">
                    <h4>Khung giờ làm việc ({selectedSlots.length} đã chọn):</h4>
                    <div className="slot-grid">
                        {TIME_SLOTS.map(slot => (
                            <button
                                key={slot}
                                type="button"
                                className={`slot-button ${selectedSlots.includes(slot) ? 'selected' : ''}`}
                                onClick={() => toggleSlot(slot)}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                className="btn-primary"
                onClick={handleRegister}
                disabled={!selectedDate}
                style={{ marginTop: '20px' }}
            >
                Cập nhật Lịch
            </button>
        </div>
    );
};
export default ScheduleRegister;