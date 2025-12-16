import DichVu from "../Models/DichVu.js";
import Khoa from "../Models/Khoa.js";

// Lấy tất cả dịch vụ
export const getAllDichVu = async (request, response) => {
    try {
        const dichVuList = await DichVu.find()
            .populate('Khoa', 'tenKhoa')
            .populate('LoaiDichVu', 'loaiDV')
            .select('-__v')
            .sort({ createdAt: -1 });

        // Chuyển đổi Decimal128 thành số
        const formattedList = dichVuList.map(dv => ({
            ...dv.toObject(),
            giaTien: parseFloat(dv.giaTien.toString())
        }));

        response.status(200).json({
            message: "Lấy danh sách dịch vụ thành công!",
            data: formattedList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách dịch vụ!",
            error: error.message
        });
    }
};

// Lấy dịch vụ theo khoa
export const getDichVuByKhoa = async (request, response) => {
    try {
        const { khoaId } = request.params;

        if (!khoaId || !khoaId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID khoa không hợp lệ!"
            });
        }

        const khoa = await Khoa.findById(khoaId);
        if (!khoa) {
            return response.status(404).json({
                message: "Không tìm thấy khoa!"
            });
        }

        const dichVuList = await DichVu.find({ Khoa: khoaId })
            .populate('LoaiDichVu', 'loaiDV')
            .select('-__v')
            .sort({ createdAt: -1 });

        // Chuyển đổi Decimal128 thành số
        const formattedList = dichVuList.map(dv => ({
            ...dv.toObject(),
            giaTien: parseFloat(dv.giaTien.toString())
        }));

        response.status(200).json({
            message: "Lấy danh sách dịch vụ thành công!",
            data: formattedList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách dịch vụ!",
            error: error.message
        });
    }
};

