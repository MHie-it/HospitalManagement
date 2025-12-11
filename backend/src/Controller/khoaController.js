import { response } from "express";
import Khoa from "../Models/Khoa.js"

export const regisKhoa = async (request, response) => {
    try {
        const {
            tenKhoa,
            email,
            SDT,
            moTa
        } = request.body;

        if (!tenKhoa || !email || !SDT || !moTa) {
            return response.status(400).json({
                message: " Vui lòng nhập đầy đủ thông tin !"
            });
        }

        const checkName = await Khoa.findOne({ tenKhoa });
        if (checkName) {
            return response.status(400).json({
                message: "Khoa đã tồn tại !"
            });
        }

        const checkEmail = await Khoa.findOne({ email });
        if (checkEmail) {
            return response.status(400).json({
                message: "Email đã tồn tại!"
            });
        }

        const checkPhone = await Khoa.findOne({ SDT });
        if (checkPhone) {
            return response.status(400).json({
                message: "SDT đã tồn tại !"
            });
        }

        const newKhoa = new Khoa({
            tenKhoa: tenKhoa,
            email: email,
            SDT: SDT,
            moTa: moTa
        });

        await newKhoa.save();

        response.status(201).json({
            message: "Tạo khoa thành công!"
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Error!"
        });
    }
}


export const getAllKhoa = async (request, response) => {
    try {
        const getKhoa = await Khoa.find()
            .select('-__v')
            .sort({ createAt: -1 });

        response.status(200).json(getKhoa);
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Error get Khoa!"
        })
    }
}

export const getKhoaId = async (request, response) => {
    try {
        const { id } = request.params;
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "Id không hợp lệ"
            });
        }


        const khoa = await Khoa.findById(id)
            .select('-__v')

        if (!khoa) {
            return response.status(400).json({
                message: "Không tìm thấy bác sĩ"
            });
        }

        response.status(200).json({
            message: "Lấy thành công !",
            data: khoa
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "lỗi khi lấy khoa!"
        })
    }
}

export const deleteKhoa = async (request, response) => {
    try {
        const { id } = request.params;

        // Kiểm tra ID hợp lệ
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        // Kiểm tra khoa có tồn tại không
        const khoa = await Khoa.findById(id);
        if (!khoa) {
            return response.status(404).json({
                message: "Không tìm thấy khoa!"
            });
        }

        const BacSi = await BacSi.default;
        const doctorsCount = await BacSi.countDocuments({ Khoa: id });

        if (doctorsCount > 0) {
            return response.status(400).json({
                message: `Không thể xóa khoa! Khoa này đang có ${doctorsCount} bác sĩ.`
            });
        }

        // Xóa khoa
        await Khoa.findByIdAndDelete(id);

        response.status(200).json({
            message: "Xóa khoa thành công!",
            data: khoa
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi xóa khoa!",
            error: error.message
        });
    }
};



export const updateKhoa = async (reques, response) => {
    try {
        const { id } = reques.params;

        const {
            tenKhoa,
            email,
            SDT,
            moTa
        } = request.body;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ "
            });
        }

        if (email && email !== Khoa.email) {
            const checkEmail = await Khoa.findOne({ email });
            if (checkEmail) {
                return response.status(400).json({
                    message: "Email đã tồn tại!"
                });
            }
        }

        if (SDT && SDT !== Khoa.SDT) {
            const checkPhone = await Khoa.findOne({ SDT });
            if (checkPhone) {
                return response.status(400).json({
                    message: "Số điện thoại đã tồn tại!"
                });
            }
        }

        const updateData = {};
        if (tenKhoa)
            updateData.tenKhoa = tenKhoa;

        if (email)
            updateData.email = email;

        if (SDT)
            updateData.SDT = SDT;

        if (moTa)
            updateData.moTa = moTa;

       
        const updatedKhoa = await Khoa.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
          

        response.status(200).json({
            message: "Cập nhật thông tin khoa thành công!",
            data: updatedKhoa
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Update khoa thất bại !"
        });
    }
}