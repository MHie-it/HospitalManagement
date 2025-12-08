// src/pages/Doctor/ProfileSettings.jsx

import React, { useState } from 'react';

const MOCK_PROFILE = {
    name: "Nguyễn Văn A",
    email: "dr.nguyenvana@hospital.com",
    phone: "0901234567",
    specialty: "Tim mạch",
    position: "Trưởng khoa",
    academicTitle: "PGS. TS.",
    description: "Chuyên gia hàng đầu về phẫu thuật tim mạch can thiệp, có 20 năm kinh nghiệm.",
};

const ProfileSettings = () => {
    const [profile, setProfile] = useState(MOCK_PROFILE);
    const [isEditing, setIsEditing] = useState(false);
    const [passwordFields, setPasswordFields] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        console.log("Saving profile:", profile);
        alert("Thông tin cá nhân đã được cập nhật!");
        setIsEditing(false);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwordFields.new !== passwordFields.confirm) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }
        console.log("Changing password...");
        alert("Mật khẩu đã được thay đổi thành công!");
        setPasswordFields({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="profile-settings">
            <h2>👤 Thông tin Cá nhân & Chuyên môn</h2>

            <form onSubmit={handleSaveProfile} className="profile-form">
                <h3>Thông tin cơ bản</h3>
                <div className="form-group">
                    <label>Họ tên:</label>
                    <input type="text" name="name" value={profile.name} onChange={handleProfileChange} disabled={!isEditing} />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={profile.email} onChange={handleProfileChange} disabled={!isEditing} />
                </div>
                <div className="form-group">
                    <label>Điện thoại:</label>
                    <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} disabled={!isEditing} />
                </div>

                <h3>Thông tin Chuyên môn</h3>
                <div className="form-group">
                    <label>Học hàm/Học vị:</label>
                    <input type="text" name="academicTitle" value={profile.academicTitle} onChange={handleProfileChange} disabled={!isEditing} />
                </div>
                <div className="form-group">
                    <label>Chuyên khoa:</label>
                    <input type="text" name="specialty" value={profile.specialty} onChange={handleProfileChange} disabled={!isEditing} />
                </div>
                <div className="form-group">
                    <label>Chức vụ:</label>
                    <input type="text" name="position" value={profile.position} onChange={handleProfileChange} disabled={!isEditing} />
                </div>
                <div className="form-group">
                    <label>Mô tả ngắn (Hiển thị công khai):</label>
                    <textarea name="description" value={profile.description} onChange={handleProfileChange} disabled={!isEditing} />
                </div>

                <div className="profile-actions">
                    {!isEditing ? (
                        <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>Chỉnh sửa Thông tin</button>
                    ) : (
                        <>
                            <button type="submit" className="btn-accent">Lưu Thay đổi</button>
                            <button type="button" className="btn-secondary" onClick={() => { setIsEditing(false); setProfile(MOCK_PROFILE); }}>Hủy</button>
                        </>
                    )}
                </div>
            </form>

            <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <form onSubmit={handlePasswordChange} className="password-form">
                <h3>Đổi Mật khẩu</h3>
                <div className="form-group">
                    <label>Mật khẩu hiện tại:</label>
                    <input type="password" value={passwordFields.current} onChange={(e) => setPasswordFields({ ...passwordFields, current: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Mật khẩu mới:</label>
                    <input type="password" value={passwordFields.new} onChange={(e) => setPasswordFields({ ...passwordFields, new: e.target.value })} required />
                </div>
                <div className="form-group">
                    <label>Xác nhận mật khẩu mới:</label>
                    <input type="password" value={passwordFields.confirm} onChange={(e) => setPasswordFields({ ...passwordFields, confirm: e.target.value })} required />
                </div>
                <button type="submit" className="btn-cancel">Đổi Mật khẩu</button>
            </form>
        </div>
    );
};
export default ProfileSettings;