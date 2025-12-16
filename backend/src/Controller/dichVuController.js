// Xóa dòng này: import { response } from "express";
import DichVu from "../Models/DichVu.js";
import Khoa from "../Models/Khoa.js";
import LoaiDichVu from "../Models/LoaiDichVu.js";
import LichHen from "../Models/LichHen.js";
import mongoose from "mongoose";

export const createDichVu = async (request, response) => {
    try {
        const {
            tenDV,
            moTa,
            giaTien,
            KhoaId,
            LoaiDichVuId
        } = request.body;

        if (!tenDV || !moTa || !giaTien || !KhoaId || !LoaiDichVuId) {
            return response.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        const checkName = await DichVu.findOne({ tenDV });
        if (checkName) {
            return response.status(400).json({
                message: "Tên dịch vụ đã tồn tại!"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(KhoaId)) {
            return response.status(400).json({
                message: "ID khoa không hợp lệ!"
            });
        }
        const khoaExists = await Khoa.findById(KhoaId);
        if (!khoaExists) {
            return response.status(400).json({
                message: "Khoa không tồn tại!"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(LoaiDichVuId)) {
            return response.status(400).json({
                message: "ID loại dịch vụ không hợp lệ!"
            });
        }
        const loaiDichVuExists = await LoaiDichVu.findById(LoaiDichVuId);
        if (!loaiDichVuExists) {
            return response.status(400).json({
                message: "Loại dịch vụ không tồn tại!"
            });
        }

        const price = parseFloat(giaTien);
        if (isNaN(price) || price < 0) {
            return response.status(400).json({
                message: "Giá tiền không hợp lệ!"
            });
        }

        // Tạo dịch vụ mới
        const newDichVu = new DichVu({
            tenDV: tenDV,
            moTa: moTa,
            giaTien: mongoose.Types.Decimal128.fromString(price.toString()),
            Khoa: KhoaId,
            LoaiDichVu: LoaiDichVuId
        });

        await newDichVu.save();

        const populatedDichVu = await DichVu.findById(newDichVu._id)
            .populate('Khoa', 'tenKhoa')
            .populate('LoaiDichVu', 'loaiDV moTa')
            .select('-__v');

        // Convert Decimal128 to Number
        const formattedDichVu = {
            ...populatedDichVu.toObject(),
            giaTien: parseFloat(populatedDichVu.giaTien.toString())
        };

        response.status(201).json({
            message: "Tạo dịch vụ thành công!",
            data: formattedDichVu
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi tạo dịch vụ!",
            error: error.message
        });
    }
}

export const getAllDichVu = async (request, response) => {
    try {

        const dichVuList = await DichVu.find()
            .populate('Khoa', 'tenKhoa')
            .populate('LoaiDichVu', 'loaiDV moTa')
            .select('-__v')
            .sort({ _id: -1 });

        // Convert Decimal128 to Number for response
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
}

export const getDichVuById = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const dichVu = await DichVu.findById(id)
            .populate('Khoa', 'tenKhoa')
            .populate('LoaiDichVu', 'loaiDV moTa')
            .select('-__v');

        if (!dichVu) {
            return response.status(404).json({
                message: "Không tìm thấy dịch vụ!"
            });
        }

        // Convert Decimal128 to Number
        const formattedDichVu = {
            ...dichVu.toObject(),
            giaTien: parseFloat(dichVu.giaTien.toString())
        };

        response.status(200).json({
            message: "Lấy thông tin dịch vụ thành công!",
            data: formattedDichVu
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy thông tin dịch vụ!",
            error: error.message
        });
    }
}

export const getDichVuByKhoa = async (request, response) => {
    try {
        const { khoaId } = request.params;

        if (!khoaId || !mongoose.Types.ObjectId.isValid(khoaId)) {
            return response.status(400).json({
                message: "ID khoa không hợp lệ!"
            });
        }

        const dichVuList = await DichVu.find({ Khoa: khoaId })
            .populate('Khoa', 'tenKhoa')
            .populate('LoaiDichVu', 'loaiDV moTa')
            .select('-__v')
            .sort({ _id: -1 }); 

        // Convert Decimal128 to Number
        const formattedList = dichVuList.map(dv => ({
            ...dv.toObject(),
            giaTien: parseFloat(dv.giaTien.toString())
        }));

        response.status(200).json({
            message: "Lấy danh sách dịch vụ theo khoa thành công!",
            data: formattedList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách dịch vụ theo khoa!",
            error: error.message
        });
    }
}

export const updateDichVu = async (request, response) => {
    try {
        const { id } = request.params;
        const {
            tenDV,
            moTa,
            giaTien,
            KhoaId,
            LoaiDichVuId
        } = request.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const dichVu = await DichVu.findById(id);
        if (!dichVu) {
            return response.status(404).json({
                message: "Không tìm thấy dịch vụ!"
            });
        }

        if (tenDV && tenDV !== dichVu.tenDV) {
            const checkName = await DichVu.findOne({ tenDV });
            if (checkName) {
                return response.status(400).json({
                    message: "Tên dịch vụ đã tồn tại!"
                });
            }
        }

        const updateData = {};
        if (tenDV) updateData.tenDV = tenDV;
        if (moTa) updateData.moTa = moTa;
        if (giaTien) {
            const price = parseFloat(giaTien);
            if (isNaN(price) || price < 0) {
                return response.status(400).json({
                    message: "Giá tiền không hợp lệ!"
                });
            }
            updateData.giaTien = mongoose.Types.Decimal128.fromString(price.toString());
        }
        if (KhoaId) {
            if (!mongoose.Types.ObjectId.isValid(KhoaId)) {
                return response.status(400).json({
                    message: "ID khoa không hợp lệ!"
                });
            }
            const khoaExists = await Khoa.findById(KhoaId);
            if (!khoaExists) {
                return response.status(400).json({
                    message: "Khoa không tồn tại!"
                });
            }
            updateData.Khoa = KhoaId;
        }
        if (LoaiDichVuId) {
            if (!mongoose.Types.ObjectId.isValid(LoaiDichVuId)) {
                return response.status(400).json({
                    message: "ID loại dịch vụ không hợp lệ!"
                });
            }
            const loaiDichVuExists = await LoaiDichVu.findById(LoaiDichVuId);
            if (!loaiDichVuExists) {
                return response.status(400).json({
                    message: "Loại dịch vụ không tồn tại!"
                });
            }
            updateData.LoaiDichVu = LoaiDichVuId;
        }

        const updatedDichVu = await DichVu.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('Khoa', 'tenKhoa')
        .populate('LoaiDichVu', 'loaiDV moTa')
        .select('-__v');

        // Convert Decimal128 to Number
        const formattedDichVu = {
            ...updatedDichVu.toObject(),
            giaTien: parseFloat(updatedDichVu.giaTien.toString())
        };

        response.status(200).json({
            message: "Cập nhật dịch vụ thành công!",
            data: formattedDichVu
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi cập nhật dịch vụ!",
            error: error.message
        });
    }
}

export const deleteDichVu = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const dichVu = await DichVu.findById(id);
        if (!dichVu) {
            return response.status(404).json({
                message: "Không tìm thấy dịch vụ!"
            });
        }

        const lichHenCount = await LichHen.countDocuments({ 
            DichVu: { $in: [id] } 
        });

        if (lichHenCount > 0) {
            return response.status(400).json({
                message: `Không thể xóa dịch vụ! Dịch vụ này đang được sử dụng trong ${lichHenCount} lịch hẹn.`
            });
        }

        // Xóa dịch vụ
        await DichVu.findByIdAndDelete(id);

        response.status(200).json({
            message: "Xóa dịch vụ thành công!",
            data: dichVu
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi xóa dịch vụ!",
            error: error.message
        });
    }
}