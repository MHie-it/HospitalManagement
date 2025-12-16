import ThietBi from "../Models/ThietBi.js";
import Khoa from "../Models/Khoa.js";
import mongoose from "mongoose";

// Tạo thiết bị mới
export const createThietBi = async (request, response) => {
    try {
        const {
            tenThietBi,
            maThietBi,
            loaiThietBi,
            nhaSanXuat,
            ngayMua,
            ngayHetHanBaoHanh,
            ngayBaoDuongTiepTheo,
            tinhTrang,
            KhoaId,
            soLuong,
            moTa
        } = request.body;

        // Validation
        if (!tenThietBi || !maThietBi || !loaiThietBi || !nhaSanXuat || 
            !ngayMua || !ngayHetHanBaoHanh || !ngayBaoDuongTiepTheo || 
            !KhoaId || !soLuong) {
            return response.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        // Kiểm tra mã thiết bị đã tồn tại
        const checkMaThietBi = await ThietBi.findOne({ maThietBi });
        if (checkMaThietBi) {
            return response.status(400).json({
                message: "Mã thiết bị đã tồn tại!"
            });
        }

        // Kiểm tra KhoaId hợp lệ
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

        // Kiểm tra số lượng
        const soLuongNum = parseInt(soLuong);
        if (isNaN(soLuongNum) || soLuongNum <= 0) {
            return response.status(400).json({
                message: "Số lượng phải là số nguyên dương!"
            });
        }

        // Kiểm tra ngày hợp lệ
        const ngayMuaDate = new Date(ngayMua);
        const ngayBaoDuongDate = new Date(ngayBaoDuongTiepTheo);
        if (ngayBaoDuongDate < ngayMuaDate) {
            return response.status(400).json({
                message: "Ngày bảo dưỡng không thể trước ngày mua!"
            });
        }

        // Tạo thiết bị mới
        const newThietBi = new ThietBi({
            tenThietBi: tenThietBi.trim(),
            maThietBi: maThietBi.trim().toUpperCase(),
            loaiThietBi,
            nhaSanXuat: nhaSanXuat.trim(),
            ngayMua: new Date(ngayMua),
            ngayHetHanBaoHanh: new Date(ngayHetHanBaoHanh),
            ngayBaoDuongTiepTheo: new Date(ngayBaoDuongTiepTheo),
            tinhTrang: tinhTrang || 'Hoạt động tốt',
            Khoa: KhoaId,
            soLuong: soLuongNum,
            moTa: moTa ? moTa.trim() : ''
        });

        await newThietBi.save();

        // Populate để lấy thông tin khoa
        const populatedThietBi = await ThietBi.findById(newThietBi._id)
            .populate('Khoa', 'tenKhoa')
            .select('-__v');

        response.status(201).json({
            message: "Tạo thiết bị thành công!",
            data: populatedThietBi
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi tạo thiết bị!",
            error: error.message
        });
    }
}

// Lấy tất cả thiết bị
export const getAllThietBi = async (request, response) => {
    try {
        const thietBiList = await ThietBi.find()
            .populate('Khoa', 'tenKhoa')
            .select('-__v')
            .sort({ createdAt: -1 });

        response.status(200).json({
            message: "Lấy danh sách thiết bị thành công!",
            data: thietBiList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách thiết bị!",
            error: error.message
        });
    }
}

// Lấy thiết bị theo ID
export const getThietBiById = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const thietBi = await ThietBi.findById(id)
            .populate('Khoa', 'tenKhoa')
            .select('-__v');

        if (!thietBi) {
            return response.status(404).json({
                message: "Không tìm thấy thiết bị!"
            });
        }

        response.status(200).json({
            message: "Lấy thông tin thiết bị thành công!",
            data: thietBi
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy thông tin thiết bị!",
            error: error.message
        });
    }
}

// Lấy thiết bị theo khoa
export const getThietBiByKhoa = async (request, response) => {
    try {
        const { khoaId } = request.params;

        if (!khoaId || !mongoose.Types.ObjectId.isValid(khoaId)) {
            return response.status(400).json({
                message: "ID khoa không hợp lệ!"
            });
        }

        const thietBiList = await ThietBi.find({ Khoa: khoaId })
            .populate('Khoa', 'tenKhoa')
            .select('-__v')
            .sort({ createdAt: -1 });

        response.status(200).json({
            message: "Lấy danh sách thiết bị theo khoa thành công!",
            data: thietBiList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách thiết bị theo khoa!",
            error: error.message
        });
    }
}

// Cập nhật thiết bị
export const updateThietBi = async (request, response) => {
    try {
        const { id } = request.params;
        const {
            tenThietBi,
            maThietBi,
            loaiThietBi,
            nhaSanXuat,
            ngayMua,
            ngayHetHanBaoHanh,
            ngayBaoDuongTiepTheo,
            tinhTrang,
            KhoaId,
            soLuong,
            moTa
        } = request.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const thietBi = await ThietBi.findById(id);
        if (!thietBi) {
            return response.status(404).json({
                message: "Không tìm thấy thiết bị!"
            });
        }

        // Kiểm tra mã thiết bị trùng (trừ chính nó)
        if (maThietBi && maThietBi !== thietBi.maThietBi) {
            const checkMaThietBi = await ThietBi.findOne({ maThietBi });
            if (checkMaThietBi) {
                return response.status(400).json({
                    message: "Mã thiết bị đã tồn tại!"
                });
            }
        }

        const updateData = {};
        if (tenThietBi) updateData.tenThietBi = tenThietBi.trim();
        if (maThietBi) updateData.maThietBi = maThietBi.trim().toUpperCase();
        if (loaiThietBi) updateData.loaiThietBi = loaiThietBi;
        if (nhaSanXuat) updateData.nhaSanXuat = nhaSanXuat.trim();
        if (ngayMua) updateData.ngayMua = new Date(ngayMua);
        if (ngayHetHanBaoHanh) updateData.ngayHetHanBaoHanh = new Date(ngayHetHanBaoHanh);
        if (ngayBaoDuongTiepTheo) updateData.ngayBaoDuongTiepTheo = new Date(ngayBaoDuongTiepTheo);
        if (tinhTrang) updateData.tinhTrang = tinhTrang;
        if (soLuong) {
            const soLuongNum = parseInt(soLuong);
            if (isNaN(soLuongNum) || soLuongNum <= 0) {
                return response.status(400).json({
                    message: "Số lượng phải là số nguyên dương!"
                });
            }
            updateData.soLuong = soLuongNum;
        }
        if (moTa !== undefined) updateData.moTa = moTa.trim();

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

        // Kiểm tra ngày hợp lệ
        if (updateData.ngayBaoDuongTiepTheo && updateData.ngayMua) {
            if (updateData.ngayBaoDuongTiepTheo < updateData.ngayMua) {
                return response.status(400).json({
                    message: "Ngày bảo dưỡng không thể trước ngày mua!"
                });
            }
        }

        const updatedThietBi = await ThietBi.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('Khoa', 'tenKhoa')
        .select('-__v');

        response.status(200).json({
            message: "Cập nhật thiết bị thành công!",
            data: updatedThietBi
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi cập nhật thiết bị!",
            error: error.message
        });
    }
}

// Xóa thiết bị
export const deleteThietBi = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const thietBi = await ThietBi.findById(id);
        if (!thietBi) {
            return response.status(404).json({
                message: "Không tìm thấy thiết bị!"
            });
        }

        await ThietBi.findByIdAndDelete(id);

        response.status(200).json({
            message: "Xóa thiết bị thành công!",
            data: thietBi
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi xóa thiết bị!",
            error: error.message
        });
    }
}