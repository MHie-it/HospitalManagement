import NguoiDung from "../Models/NguoiDung.js";
import User from "../Models/User.js";

// Lấy thông tin người dùng theo userId
export const getNguoiDungByUserId = async (request, response) => {
    try {
        const { userId } = request.params;

        if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "Không tìm thấy user!"
            });
        }

        if (!user.NguoiDung) {
            return response.status(404).json({
                message: "Không tìm thấy thông tin người dùng!"
            });
        }

        const nguoiDung = await NguoiDung.findById(user.NguoiDung)
            .select('-__v');

        response.status(200).json({
            message: "Lấy thông tin thành công!",
            data: nguoiDung
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy thông tin người dùng!",
            error: error.message
        });
    }
};

// Cập nhật thông tin người dùng
export const updateNguoiDung = async (request, response) => {
    try {
        const { userId } = request.params;
        const {
            hoTen,
            email,
            SDT,
            ngaySinh,
            diaChi,
            gioiTinh,
            imgURL
        } = request.body;

        if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "Không tìm thấy user!"
            });
        }

        if (!user.NguoiDung) {
            return response.status(404).json({
                message: "Không tìm thấy thông tin người dùng!"
            });
        }

        const nguoiDung = await NguoiDung.findById(user.NguoiDung);

        // Kiểm tra email và SDT nếu có thay đổi
        if (email && email !== nguoiDung.email) {
            const checkEmail = await NguoiDung.findOne({ email, _id: { $ne: nguoiDung._id } });
            if (checkEmail) {
                return response.status(400).json({
                    message: "Email đã tồn tại!"
                });
            }
        }

        if (SDT && SDT !== nguoiDung.SDT) {
            const checkPhone = await NguoiDung.findOne({ SDT, _id: { $ne: nguoiDung._id } });
            if (checkPhone) {
                return response.status(400).json({
                    message: "Số điện thoại đã tồn tại!"
                });
            }
        }

        const updateData = {};
        if (hoTen) updateData.hoTen = hoTen;
        if (email) updateData.email = email;
        if (SDT) updateData.SDT = SDT;
        if (ngaySinh) updateData.ngaySinh = ngaySinh;
        if (diaChi !== undefined) updateData.diaChi = diaChi;
        if (gioiTinh) updateData.gioiTinh = gioiTinh;
        if (imgURL !== undefined) updateData.imgURL = imgURL;

        const updatedNguoiDung = await NguoiDung.findByIdAndUpdate(
            nguoiDung._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-__v');

        response.status(200).json({
            message: "Cập nhật thông tin thành công!",
            data: updatedNguoiDung
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi cập nhật thông tin!",
            error: error.message
        });
    }
};

