import TuVan from "../Models/TuVan.js";
import NguoiDung from "../Models/NguoiDung.js";
import User from "../Models/User.js";
import BacSi from "../Models/BacSi.js";
import Khoa from "../Models/Khoa.js";
import { generateAIResponse } from "../Services/aiChatbotService.js";

// Tạo yêu cầu tư vấn mới
export const createTuVan = async (request, response) => {
    try {
        const { userId, khoaId, bacSiId, cauHoi } = request.body;

        if (!userId || !cauHoi || !cauHoi.trim()) {
            return response.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin (userId và câu hỏi)!"
            });
        }

        // Kiểm tra user
        const user = await User.findById(userId);
        if (!user || !user.NguoiDung) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng!"
            });
        }

        // Kiểm tra khoa nếu có
        if (khoaId) {
            const khoa = await Khoa.findById(khoaId);
            if (!khoa) {
                return response.status(400).json({
                    message: "Khoa không tồn tại!"
                });
            }
        }

        // Kiểm tra bác sĩ nếu có
        if (bacSiId) {
            const bacSi = await BacSi.findById(bacSiId);
            if (!bacSi || !bacSi.isActive) {
                return response.status(400).json({
                    message: "Bác sĩ không tồn tại hoặc không hoạt động!"
                });
            }
        }

        // Tạo yêu cầu tư vấn
        const newTuVan = new TuVan({
            NguoiDung: user.NguoiDung,
            Khoa: khoaId || null,
            BacSi: bacSiId || null,
            cauHoi: cauHoi.trim(),
            trangThai: 'Chờ trả lời',
            loaiTraLoi: 'AI'
        });

        const savedTuVan = await newTuVan.save();

        // Gọi AI để trả lời tự động
        try {
            const aiResponse = await generateAIResponse(cauHoi.trim(), khoaId);
            
            // Cập nhật câu trả lời từ AI
            savedTuVan.traLoi = aiResponse;
            savedTuVan.trangThai = 'Đã trả lời';
            savedTuVan.loaiTraLoi = 'AI';
            await savedTuVan.save();
        } catch (aiError) {
            console.error('Error generating AI response:', aiError);
            // Vẫn trả về yêu cầu đã tạo, nhưng chưa có câu trả lời
        }

        // Populate để trả về đầy đủ thông tin
        const populatedTuVan = await TuVan.findById(savedTuVan._id)
            .populate('NguoiDung', 'hoTen email SDT')
            .populate('Khoa', 'tenKhoa')
            .populate('BacSi', 'tenBS')
            .select('-__v');

        response.status(201).json({
            message: "Gửi yêu cầu tư vấn thành công!",
            data: populatedTuVan
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi tạo yêu cầu tư vấn!",
            error: error.message
        });
    }
};

// Lấy danh sách tư vấn của user
export const getTuVanByUserId = async (request, response) => {
    try {
        const { userId } = request.params;

        if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID người dùng không hợp lệ!"
            });
        }

        const user = await User.findById(userId);
        if (!user || !user.NguoiDung) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng!"
            });
        }

        const tuVanList = await TuVan.find({ NguoiDung: user.NguoiDung })
            .populate('NguoiDung', 'hoTen email SDT')
            .populate('Khoa', 'tenKhoa')
            .populate('BacSi', 'tenBS')
            .sort({ createdAt: -1 })
            .select('-__v');

        response.status(200).json({
            message: "Lấy danh sách tư vấn thành công!",
            data: tuVanList,
            count: tuVanList.length
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách tư vấn!",
            error: error.message
        });
    }
};

// Lấy danh sách tư vấn của bác sĩ
export const getTuVanByDoctorId = async (request, response) => {
    try {
        const { doctorId } = request.params;

        if (!doctorId || !doctorId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID bác sĩ không hợp lệ!"
            });
        }

        const bacSi = await BacSi.findById(doctorId);
        if (!bacSi) {
            return response.status(404).json({
                message: "Không tìm thấy bác sĩ!"
            });
        }

        const tuVanList = await TuVan.find({ BacSi: doctorId })
            .populate('NguoiDung', 'hoTen email SDT')
            .populate('Khoa', 'tenKhoa')
            .populate('BacSi', 'tenBS')
            .sort({ createdAt: -1 })
            .select('-__v');

        response.status(200).json({
            message: "Lấy danh sách tư vấn thành công!",
            data: tuVanList,
            count: tuVanList.length
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách tư vấn!",
            error: error.message
        });
    }
};

// Cập nhật câu trả lời (cho bác sĩ hoặc AI)
export const updateTuVan = async (request, response) => {
    try {
        const { id } = request.params;
        const { traLoi, trangThai, loaiTraLoi } = request.body;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID tư vấn không hợp lệ!"
            });
        }

        const tuVan = await TuVan.findById(id);
        if (!tuVan) {
            return response.status(404).json({
                message: "Không tìm thấy yêu cầu tư vấn!"
            });
        }

        if (traLoi !== undefined) tuVan.traLoi = traLoi.trim();
        if (trangThai) {
            const validTrangThai = ['Chờ trả lời', 'Đã trả lời', 'Đang xử lý'];
            if (validTrangThai.includes(trangThai)) {
                tuVan.trangThai = trangThai;
            }
        }
        if (loaiTraLoi) {
            const validLoai = ['AI', 'BacSi'];
            if (validLoai.includes(loaiTraLoi)) {
                tuVan.loaiTraLoi = loaiTraLoi;
            }
        }

        await tuVan.save();

        const updatedTuVan = await TuVan.findById(tuVan._id)
            .populate('NguoiDung', 'hoTen email SDT')
            .populate('Khoa', 'tenKhoa')
            .populate('BacSi', 'tenBS')
            .select('-__v');

        response.status(200).json({
            message: "Cập nhật tư vấn thành công!",
            data: updatedTuVan
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi cập nhật tư vấn!",
            error: error.message
        });
    }
};

// Xóa tư vấn
export const deleteTuVan = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID tư vấn không hợp lệ!"
            });
        }

        const tuVan = await TuVan.findById(id);
        if (!tuVan) {
            return response.status(404).json({
                message: "Không tìm thấy yêu cầu tư vấn!"
            });
        }

        await TuVan.findByIdAndDelete(id);

        response.status(200).json({
            message: "Xóa yêu cầu tư vấn thành công!"
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi xóa tư vấn!",
            error: error.message
        });
    }
};

