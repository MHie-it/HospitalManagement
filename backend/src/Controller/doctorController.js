import User from "../Models/User.js";
import BacSi from "../Models/BacSi.js";
import Role from "../Models/Role.js";
import Khoa from "../Models/Khoa.js";
import bcrypt from "bcryptjs";
import { response } from "express";



export const getAllDoctors = async (request, response) => {
    try {
        const doctors = await BacSi.find()
            .select('-__v')
            .populate('Khoa', 'tenKhoa')
            .sort({ createdAt: -1 });
        response.status(200).json({
            message: "Lấy danh sách bác sĩ thành công!",
            data: doctors,
            count: doctors.length
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách bác sĩ!"
        });
    }
};

export const getDoctorsByKhoa = async (request, response) => {
    try {
        const { khoaId } = request.params;

        if (khoaId && !khoaId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "Id khoa không hợp lệ !"
            });
        }

        const khoa = await Khoa.findById(khoaId);
        if (!khoa) {
            return response.status(404).json({
                message: "Không tìm thấy khoa !"
            });
        }

        const doctors = await BacSi.find({ Khoa: khoaId })
            .select('-__v')
            .populate('Khoa', 'tenKhoa')
            .sort({ createdAt: -1 });

        response.status(200).json({
            message: "Lấy danh sách bác sĩ theo khoa thành công!",
            data: doctors,
            count: doctors.length
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách bác sĩ theo khoa!"
        });
    }
};


export const getDoctorID = async (request, response) => {
    try {
        const { id } = request.params;

        // objectId của mongo là hệ hexa(16) và có 24 ký tự
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const doctor = await BacSi.findById(id)
            .select('-__v')
            .populate('Khoa', 'tenKhoa')

        if (!doctor) {
            return response.status(404).json({
                message: "Không tìm thấy bác sĩ!"
            });
        }

        response.status(200).json({
            message: "Lấy thông tin bác sĩ thành công!",
            data: doctor
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy thông tin bác sĩ!"
        });
    }
};


export const updateDoctor = async (request, response) => {
    try {
        const { id } = request.params;
        const {
            tenBS,
            email,
            SDT,
            ngaySinh,
            diaChi,
            gioiTinh,
            khoaId,
            imgURL
        } = request.body;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const doctor = await BacSi.findById(id);
        if (!doctor) {
            return response.status(404).json({
                message: "Không tìm thấy bác sĩ!"
            });
        }

        if (khoaId) {
            const khoa = await Khoa.findById(khoaId);
            if (!khoa) {
                return response.status(400).json({
                    message: "Không tìm thấy khoa!"
                });
            }
        }

        if (email && email !== doctor.email) {
            const checkEmail = await BacSi.findOne({ email });
            if (checkEmail) {
                return response.status(400).json({
                    message: "Email đã tồn tại!"
                });
            }
        }

        if (SDT && SDT !== doctor.SDT) {
            const checkPhone = await BacSi.findOne({ SDT });
            if (checkPhone) {
                return response.status(400).json({
                    message: "Số điện thoại đã tồn tại!"
                });
            }
        }

        const updateData = {};
        if (tenBS)
            updateData.tenBS = tenBS;

        if (email)
            updateData.email = email;

        if (SDT)
            updateData.SDT = SDT;

        if (ngaySinh)
            updateData.ngaySinh = ngaySinh;

        if (diaChi !== undefined)
            updateData.diaChi = diaChi;

        if (gioiTinh)
            updateData.gioiTinh = gioiTinh;

        if (khoaId)
            updateData.Khoa = khoaId;

        if (imgURL !== undefined)
            updateData.imgURL = imgURL;

        const updatedDoctor = await BacSi.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('Khoa', 'tenKhoa ')
            .populate('User', 'username isActive');

        response.status(200).json({
            message: "Cập nhật thông tin bác sĩ thành công!",
            data: updatedDoctor
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi cập nhật thông tin bác sĩ!",
            error: error.message
        });
    }
};

export const OffDoctor = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const doctor = await BacSi.findById(id);
        if (!doctor) {
            return response.status(404).json({
                message: "Không tìm thấy bác sĩ!"
            });
        }

        if (!doctor.isActive) {
            return response.status(400).json({
                message: "Bác sĩ này đã bị ngừng hoạt động rồi!"
            });
        }

        doctor.isActive = false;
        await doctor.save();

        if (doctor.User) {
            await User.findByIdAndUpdate(doctor.User, { isActive: false });
        }

        response.status(200).json({
            message: "Đã ngừng hoạt động bác sĩ thành công!",
            data: doctor
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi ngừng hoạt động bác sĩ!",
            error: error.message
        });
    }
};
