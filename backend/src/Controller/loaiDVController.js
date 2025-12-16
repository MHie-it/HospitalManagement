import LoaiDichVu from "../Models/LoaiDichVu.js";
import DichVu from "../Models/DichVu.js";
import mongoose from "mongoose";


export const createLoaiDichVu = async (request, response) => {
    try {
        const {
            loaiDV,
            moTa
        } = request.body;

        if (!loaiDV || !moTa) {
            return response.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        const checkLoaiDV = await LoaiDichVu.findOne({ loaiDV });
        if (checkLoaiDV) {
            return response.status(400).json({
                message: "Loại dịch vụ này đã tồn tại!"
            });
        }

        const newLoaiDichVu = new LoaiDichVu({
            loaiDV: loaiDV,
            moTa: moTa
        });

        await newLoaiDichVu.save();

        response.status(201).json({
            message: "Tạo loại dịch vụ thành công!",
            data: newLoaiDichVu
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi tạo loại dịch vụ!",
            error: error.message
        });
    }
}

export const getAllLoaiDichVu = async (request, response) => {
    try {
        const loaiDichVuList = await LoaiDichVu.find()
            .select('-__v')
            .sort({ _id: -1 });
            
        response.status(200).json({
            message: "Lấy danh sách loại dịch vụ thành công!",
            data: loaiDichVuList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách loại dịch vụ!",
            error: error.message
        });
    }
}

export const getLoaiDichVuById = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const loaiDichVu = await LoaiDichVu.findById(id)
            .select('-__v');

        if (!loaiDichVu) {
            return response.status(404).json({
                message: "Không tìm thấy loại dịch vụ!"
            });
        }

        response.status(200).json({
            message: "Lấy thông tin loại dịch vụ thành công!",
            data: loaiDichVu
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy thông tin loại dịch vụ!",
            error: error.message
        });
    }
}


export const updateLoaiDichVu = async (request, response) => {
    try {
        const { id } = request.params;
        const {
            loaiDV,
            moTa
        } = request.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        } 

        const loaiDichVu = await LoaiDichVu.findById(id);
        if (!loaiDichVu) {
            return response.status(404).json({
                message: "Không tìm thấy loại dịch vụ!"
            });
        }

        const updateData = {};
        
        if (loaiDV) {
          
            if (loaiDV !== loaiDichVu.loaiDV) {
                const checkLoaiDV = await LoaiDichVu.findOne({ loaiDV });
                if (checkLoaiDV) {
                    return response.status(400).json({
                        message: "Loại dịch vụ này đã tồn tại!"
                    });
                }
            }
            updateData.loaiDV = loaiDV;
        }

        if (moTa) {
            updateData.moTa = moTa;
        }

        const updatedLoaiDichVu = await LoaiDichVu.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .select('-__v');

        response.status(200).json({
            message: "Cập nhật loại dịch vụ thành công!",
            data: updatedLoaiDichVu
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi cập nhật loại dịch vụ!",
            error: error.message
        });
    }
}


export const deleteLoaiDichVu = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const loaiDichVu = await LoaiDichVu.findById(id);
        if (!loaiDichVu) {
            return response.status(404).json({
                message: "Không tìm thấy loại dịch vụ!"
            });
        }

        const dichVuCount = await DichVu.countDocuments({ 
            LoaiDichVu: id 
        });

        if (dichVuCount > 0) {
            return response.status(400).json({
                message: `Không thể xóa loại dịch vụ! Loại này đang được sử dụng trong ${dichVuCount} dịch vụ.`
            });
        }

        await LoaiDichVu.findByIdAndDelete(id);

        response.status(200).json({
            message: "Xóa loại dịch vụ thành công!",
            data: loaiDichVu
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi xóa loại dịch vụ!",
            error: error.message
        });
    }
}