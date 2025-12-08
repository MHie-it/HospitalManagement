

import React from 'react';

const SPECIALTIES = ['Tim mạch', 'Nhi', 'Da liễu', 'Răng Hàm Mặt', 'Khác'];
const POSITIONS = ['Trưởng khoa', 'Phó khoa', 'Bác sĩ chính'];
const TITLES = ['PGS. TS.', 'TS.', 'ThS.', 'BSCK II'];

const DoctorFilters = ({ onFilterChange }) => {
    const handleSelectChange = (e) => {
        onFilterChange(e.target.name, e.target.value);
    };

    return (
        <div className="filters-container">
            <select name="specialty" onChange={handleSelectChange}>
                <option value="">Chuyên khoa</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select name="position" onChange={handleSelectChange}>
                <option value="">Chức vụ</option>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select name="academicTitle" onChange={handleSelectChange}>
                <option value="">Học hàm/Học vị</option>
                {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
    );
};
export default DoctorFilters;