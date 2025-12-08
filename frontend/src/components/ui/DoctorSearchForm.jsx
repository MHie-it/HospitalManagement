// src/pages/components/DoctorSearchForm.jsx

import React, { useState } from 'react';

const LOCATIONS = ['Toàn hệ thống', 'Hà Nội', 'TPHCM', 'Đà Nẵng'];

const DoctorSearchForm = ({ onSearch, onLocationChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLocation, setActiveLocation] = useState('Toàn hệ thống');

    const handleSearchClick = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleLocationClick = (location) => {
        setActiveLocation(location);
        onLocationChange(location);
    };

    return (
        <div className="search-form-container">
            <form onSubmit={handleSearchClick} className="search-bar container">
                <input
                    type="text"
                    placeholder="Tìm bác sĩ, chuyên khoa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Tìm</button>
            </form>

            <div className="location-tabs">
                {LOCATIONS.map(loc => (
                    <button
                        key={loc}
                        type="button"
                        className={`location-button ${activeLocation === loc ? 'active' : ''}`}
                        onClick={() => handleLocationClick(loc)}
                    >
                        {loc}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default DoctorSearchForm;