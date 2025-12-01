import User from "../Models/User.js";
import NguoiDung from "../Models/NguoiDung.js";
import BacSi from "../Models/BacSi.js";
import Role from "../Models/Role.js";
import bcrypt from "bcryptjs"
import { response } from "express";
import Khoa from "../Models/Khoa.js";

export const registerDoctor = async (request, response) => {
    try {

        const {
            username,
            tenBS,
            email,
            SDT,
            ngaySinh,
            diaChi,
            gioiTinh,
            khoaId,
        } = request.body;

        const khoa = await Khoa.findById(khoaId);
        if (!khoa) {
            return response.status(400).json({
                message: "Không tìm thấy khoa"
            });
        }

        if (!username || !tenBS || !email || !SDT || !ngaySinh || !diaChi || !gioiTinh || !khoaId) {
            return response.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin !"
            });
        }

        const checkEmail = await BacSi.findOne({ email });
        if (checkEmail) {
            return response.status(400).json({
                message: "Email đã tồn tại !"
            });
        }

        const checkPhone = await BacSi.findOne({ SDT });
        if (checkPhone) {
            return response.status(400).json({
                message: "SDT đã tồn tại !"
            });
        }

        const checkUser = await User.findOne({ username });
        if (checkUser) {
            return response.status(400).json({
                message: "User đã tồn tại!"
            });
        }

        const defaultPass = "hospitalHappy";
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(defaultPass, saltRounds);

        const doctorRole = await Role.findOne({ name: 'Doctor' });
        if (!doctorRole) {
            return response.status(400).json({
                message: " Không tìm thấy Role"
            });
        }

        const newUser = new User({
            username: username,
            password: hashedPassword,
            role: [doctorRole._id],
            isActive: true
        });

        const saveUser = await newUser.save();

        const newDoctor = new BacSi({
            tenBS: tenBS,
            email: email,
            SDT: SDT,
            ngaySinh: ngaySinh,
            diaChi: diaChi,
            gioiTinh: gioiTinh,
            Khoa: khoaId,
            User: saveUser._id
        });

        const saveDoctor = await newDoctor.save();

        saveUser.BacSi = saveDoctor._id;

        await saveUser.save();
        await saveDoctor.save();

        response.status(201).json({
            message: "Đăng ký tài khoản thành công !",
            data: {
                username: saveUser.username,
                password: defaultPass
            }

        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "ERROR"
        });
    }
}

export const register = async (request, response) => {
    try {
        const {
            username,
            password,
            hoTen,
            email,
            SDT,
            ngaySinh,
            diaChi,
            gioiTinh
        } = request.body;

        if (!username || !password || !hoTen || !SDT || !ngaySinh || !diaChi || !gioiTinh) {
            return response.status(400).json({
                message: " Vui long điền đầy đủ thông tin!"
            });
        }

        const checkUser = await User.findOne({ username });
        if (checkUser) {
            return response.status(400).json({
                message: "Username đã tồn tại!"
            });
        }

        const checkPhone = await NguoiDung.findOne({ SDT });
        if (checkPhone) {
            return response.status(400).json({
                messgae: "SDT đã tôn tại !"
            });
        }

        const checkEmail = await NguoiDung.findOne({ email });
        if (checkEmail) {
            return response.status(400).json({
                message: "Email đã tồn tại!"
            });
        }
        // thêm muối cho hash  mức độ bảo mật của mật khaaur
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const defaultRole = await Role({ name: 'User' });
        if (!defaultRole) {
            return response.status(400).json({
                message: "Không tìm thấy role!"
            });
        }

        const newUser = new User({
            username: username,
            password: hashedPassword,
            role: [defaultRole._id],
            isActive: true
        });

        const saveUser = await newUser.save();

        const newNguoiDung = new NguoiDung({
            hoTen: hoTen,
            email: email || undefined,
            SDT: SDT,
            ngaySinh: ngaySinh,
            diaChi: diaChi,
            gioiTinh: gioiTinh,
            User: saveUser._id
        });

        const saveNguoiDung = await newNguoiDung.save();

        saveUser.NguoiDung = saveNguoiDung._id;
        await saveUser.save();
        await saveNguoiDung.save();


        // const userWithDetails = await User.findById(savedUser._id)
        //     .populate('NguoiDung')  // Thay ObjectId bằng thông tin NguoiDung đầy đủ
        //     .populate('role')        // Thay ObjectId bằng thông tin Role đầy đủ
        //     .select('-password');    // Không trả về password

        response.status(201).json({
            message: "Đăng ký tài khoảng thành công !"
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: " lỗi !"
        });
    }

}

export const Login = async (request, response) => {
    try {
        const { username, password } = request.body;

        if (!username || !password) {
            return response.status(400).json({
                message: " VUi long nhập đầy đủ thông tin"
            });
        }

        // kiem tra quyen gif
        const user = await User.findOne({ username })
            .populate('role')

        if (!user) {
            return response.status(400).json({
                message: "không tìm thấy user"
            });
        }

        if (User.isActive === false) {
            return response.status(400).json({
                message: "Tài khoản ngừng hoạt động!"
            });
        }

        const isPasswordHash = await bcrypt.compare(password, user.password);

        if (!isPasswordHash) {
            return response.status(400).json({
                message: "Mật khẩu sai!"
            });
        }

        const userRole = user.role.map(role => role.name);

        let profileInfo = null;
        let userType = null;

        if (userRole.includes('Doctor')) {
            if (user.BacSi) {
                profileInfo = await BacSi.findById(user.BacSi)
                    .populate('Khoa');
                userType = 'Doctor';
            }
        } else if (userRole.includes('User')) {
            if (user.NguoiDung) {
                profileInfo = await NguoiDung.findById(user.NguoiDung);
                userType = 'User';
            }
        } else if (userRole.includes('Admin')) {
            profileInfo = null;
            userType = 'Admin';
        }

        const userData = {
            _id: user._id,
            username: user.username,
            role: user.role,
            isActive: user.isActive,
            userType: userType,
            profile: profileInfo
        };

        response.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            user: userData
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi đăng nhập!"
        });
    }
}