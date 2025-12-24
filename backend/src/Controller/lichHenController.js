import LichHen from "../Models/LichHen.js";
import NguoiDung from "../Models/NguoiDung.js";
import User from "../Models/User.js";
import LichLamViec from "../Models/LichLamViec.js";
import BacSi from "../Models/BacSi.js";
import DichVu from "../Models/DichVu.js";
import CaLamViec from "../Models/CaLamViec.js"

// Lấy danh sách lịch hẹn của người dùng
export const getLichHenByUserId = async (request, response) => {
    try {
        const { userId } = request.params;

        if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const user = await User.findById(userId);
        if (!user || !user.NguoiDung) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng!"
            });
        }

        const lichHenList = await LichHen.find({ NguoiDung: user.NguoiDung })
            .populate({
                path: 'LichLamViec',
                populate: {
                    path: 'BacSi',
                    select: 'tenBS',
                    populate: {
                        path: 'Khoa',
                        select: 'tenKhoa'
                    }
                }
            })
            .populate('DichVu', 'tenDV giaTien')
            .select('-__v')
            .sort({ ngayHen: -1 });

        // Format Decimal128 thành số
        const formattedList = lichHenList.map(lh => ({
            ...lh.toObject(),
            DichVu: lh.DichVu.map(dv => ({
                ...dv.toObject(),
                giaTien: parseFloat(dv.giaTien.toString())
            }))
        }));

        response.status(200).json({
            message: "Lấy danh sách lịch hẹn thành công!",
            data: formattedList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách lịch hẹn!",
            error: error.message
        });
    }
};

export const getAllLichHen = async (request, response) => {
    try {
        const lichHenList = await LichHen.find()
            .populate('NguoiDung', 'hoTen SDT email diaChi gioiTinh ngaySinh')
            .populate({
                path: 'LichLamViec',
                populate: {
                    path: 'BacSi',
                    select: 'tenBS',
                    populate: {
                        path: 'Khoa',
                        select: 'tenKhoa'
                    }
                }
            })
            .populate('CaLamViec', 'caLam gioBatDau gioKetThuc')
            .populate('DichVu', 'tenDV giaTien')
            .select('-__v')
            .sort({ ngayHen: -1 });

        // Format Decimal128 thành số
        const formattedList = lichHenList.map(lh => ({
            ...lh.toObject(),
            DichVu: lh.DichVu.map(dv => ({
                ...dv.toObject(),
                giaTien: parseFloat(dv.giaTien.toString())
            }))
        }));

        response.status(200).json({
            message: "Lấy danh sách lịch hẹn thành công!",
            data: formattedList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách lịch hẹn!",
            error: error.message
        });
    }
};

// Tạo lịch hẹn mới
export const createLichHen = async (request, response) => {
    try {
        const {
            userId,
            bacSiId,
            ngayHen,
            gioHen,
            dichVuIds,
            moTa
        } = request.body;

        if (!userId || !bacSiId || !ngayHen || !gioHen) {
            return response.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        // Kiểm tra user
        const user = await User.findById(userId);
        if (!user || !user.NguoiDung) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng!"
            });
        }

        // Kiểm tra bác sĩ
        const bacSi = await BacSi.findById(bacSiId);
        if (!bacSi || !bacSi.isActive) {
            return response.status(400).json({
                message: "Bác sĩ không tồn tại hoặc không hoạt động!"
            });
        }

        // Xử lý dịch vụ - cho phép không có dịch vụ (array rỗng)
        let finalDichVuIds = dichVuIds || [];
        
        // Chỉ kiểm tra dịch vụ nếu có
        if (finalDichVuIds && Array.isArray(finalDichVuIds) && finalDichVuIds.length > 0) {
            // Kiểm tra dịch vụ có tồn tại không
            const dichVuList = await DichVu.find({ _id: { $in: finalDichVuIds } });
            if (dichVuList.length !== finalDichVuIds.length) {
                return response.status(400).json({
                    message: "Một số dịch vụ không tồn tại!"
                });
            }
        }

        // Tìm hoặc tạo LichLamViec cho bác sĩ vào ngày đó
        // Tạm thời tạo một LichLamViec mới (có thể cần logic phức tạp hơn)
        const ngayHenDate = new Date(ngayHen);
        const startOfDay = new Date(ngayHenDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(ngayHenDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const existingLichLamViec = await LichLamViec.findOne({
            BacSi: bacSiId,
            ngayLam: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        let lichLamViecId;
        if (existingLichLamViec) {
            lichLamViecId = existingLichLamViec._id;
        } else {
            // Tạo mới LichLamViec (cần có CaLamViec, nhưng tạm thời để trống)
            const newLichLamViec = new LichLamViec({
                BacSi: bacSiId,
                ngayLam: startOfDay
            });
            const savedLichLamViec = await newLichLamViec.save();
            lichLamViecId = savedLichLamViec._id;
        }

        // Tạo lịch hẹn - kết hợp ngày và giờ
        const ngayGioHen = new Date(`${ngayHen}T${gioHen}`);
        
        console.log(`[createLichHen] Creating appointment for bacSiId: ${bacSiId}, lichLamViecId: ${lichLamViecId}`);
        
        const newLichHen = new LichHen({
            NguoiDung: user.NguoiDung,
            LichLamViec: lichLamViecId,
            ngayHen: ngayGioHen,
            DichVu: finalDichVuIds,
            moTa: moTa || '',
            trangThai: 'Chưa xác nhận'
        });

        const savedLichHen = await newLichHen.save();
        console.log(`[createLichHen] Created appointment with ID: ${savedLichHen._id}`);

        // Populate để trả về đầy đủ thông tin
        const populatedLichHen = await LichHen.findById(savedLichHen._id)
            .populate('NguoiDung', 'hoTen SDT email diaChi gioiTinh ngaySinh')
            .populate({
                path: 'LichLamViec',
                populate: {
                    path: 'BacSi',
                    select: 'tenBS',
                    populate: {
                        path: 'Khoa',
                        select: 'tenKhoa'
                    }
                }
            })
            .populate('DichVu', 'tenDV giaTien')
            .select('-__v');

        // Format Decimal128 thành số
        const formattedLichHen = {
            ...populatedLichHen.toObject(),
            DichVu: populatedLichHen.DichVu.map(dv => ({
                ...dv.toObject(),
                giaTien: parseFloat(dv.giaTien.toString())
            }))
        };

        response.status(201).json({
            message: "Đặt lịch hẹn thành công!",
            data: formattedLichHen
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi đặt lịch hẹn!",
            error: error.message
        });
    }
};

// Lấy danh sách lịch hẹn của bác sĩ
export const getLichHenByDoctorId = async (request, response) => {
    try {
        const { doctorId } = request.params;

        if (!doctorId || !doctorId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID bác sĩ không hợp lệ!"
            });
        }

        // Kiểm tra bác sĩ
        const bacSi = await BacSi.findById(doctorId);
        if (!bacSi) {
            return response.status(404).json({
                message: "Không tìm thấy bác sĩ!"
            });
        }

        // Tìm tất cả LichLamViec của bác sĩ
        const lichLamViecList = await LichLamViec.find({ BacSi: doctorId });
        const lichLamViecIds = lichLamViecList.map(llv => llv._id);

        console.log(`[getLichHenByDoctorId] doctorId: ${doctorId}`);
        console.log(`[getLichHenByDoctorId] Found ${lichLamViecIds.length} LichLamViec:`, lichLamViecIds);

        // Nếu không có LichLamViec nào, trả về mảng rỗng
        if (lichLamViecIds.length === 0) {
            console.log(`[getLichHenByDoctorId] No LichLamViec found for doctorId: ${doctorId}`);
            return response.status(200).json({
                message: "Lấy danh sách lịch hẹn thành công!",
                data: []
            });
        }

        // Tìm tất cả lịch hẹn liên quan đến các LichLamViec này
        const lichHenList = await LichHen.find({ LichLamViec: { $in: lichLamViecIds } })
            .populate('NguoiDung', 'hoTen SDT email diaChi gioiTinh ngaySinh')
            .populate({
                path: 'LichLamViec',
                populate: {
                    path: 'BacSi',
                    select: 'tenBS',
                    populate: {
                        path: 'Khoa',
                        select: 'tenKhoa'
                    }
                }
            })
            .populate('DichVu', 'tenDV giaTien')
            .select('-__v')
            .sort({ ngayHen: -1 });

        console.log(`[getLichHenByDoctorId] Found ${lichHenList.length} appointments`);

        // Format Decimal128 thành số
        const formattedList = lichHenList.map(lh => ({
            ...lh.toObject(),
            DichVu: lh.DichVu.map(dv => ({
                ...dv.toObject(),
                giaTien: parseFloat(dv.giaTien.toString())
            }))
        }));

        response.status(200).json({
            message: "Lấy danh sách lịch hẹn thành công!",
            data: formattedList
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách lịch hẹn!",
            error: error.message
        });
    }
};

// Cập nhật trạng thái và ghi chú của bác sĩ cho lịch hẹn
export const updateLichHen = async (request, response) => {
    try {
        const { id } = request.params;
        const { trangThai, ghiChuBacSi } = request.body;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID lịch hẹn không hợp lệ!"
            });
        }

        // Kiểm tra lịch hẹn có tồn tại không
        const lichHen = await LichHen.findById(id);
        if (!lichHen) {
            return response.status(404).json({
                message: "Không tìm thấy lịch hẹn!"
            });
        }

        // Cập nhật dữ liệu
        const updateData = {};
        if (trangThai) {
            // Validate trạng thái
            const validStatuses = ['Đã xác nhận', 'Chưa xác nhận', 'Đã hủy', 'Đã khám'];
            if (!validStatuses.includes(trangThai)) {
                return response.status(400).json({
                    message: "Trạng thái không hợp lệ!"
                });
            }
            updateData.trangThai = trangThai;
        }
        if (ghiChuBacSi !== undefined) {
            updateData.ghiChuBacSi = ghiChuBacSi;
        }

        // Cập nhật lịch hẹn
        const updatedLichHen = await LichHen.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('NguoiDung', 'hoTen SDT email diaChi gioiTinh ngaySinh')
            .populate({
                path: 'LichLamViec',
                populate: {
                    path: 'BacSi',
                    select: 'tenBS',
                    populate: {
                        path: 'Khoa',
                        select: 'tenKhoa'
                    }
                }
            })
            .populate('DichVu', 'tenDV giaTien')
            .select('-__v');

        // Format Decimal128 thành số
        const formattedLichHen = {
            ...updatedLichHen.toObject(),
            DichVu: updatedLichHen.DichVu.map(dv => ({
                ...dv.toObject(),
                giaTien: parseFloat(dv.giaTien.toString())
            }))
        };

        response.status(200).json({
            message: "Cập nhật lịch hẹn thành công!",
            data: formattedLichHen
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi cập nhật lịch hẹn!",
            error: error.message
        });
    }
};


export const createSTT = async (request, response) => {
    try {
        const {
            userId,
            ngayHen,  // Format: YYYY-MM-DD
            caLamViecId,
            khoaId, // Thêm khoaId
            moTa
        } = request.body;

        // Validation
        if (!userId || !ngayHen || !caLamViecId) {
            return response.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin (userId, ngayHen, caLamViecId)!"
            });
        }

        // Kiểm tra user
        const user = await User.findById(userId);
        if (!user || !user.NguoiDung) {
            return response.status(404).json({
                message: "Không tìm thấy người dùng!"
            });
        }

        // Kiểm tra ca làm việc
        const caLamViec = await CaLamViec.findById(caLamViecId);
        if (!caLamViec) {
            return response.status(404).json({
                message: "Không tìm thấy ca làm việc!"
            });
        }

        // Parse ngày
        const [year, month, day] = ngayHen.split('-').map(Number);
        const ngayHenDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        const startOfDay = new Date(ngayHenDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(ngayHenDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Tìm tất cả lịch làm việc có ca này trong ngày và populate Khoa
        let lichLamViecList = await LichLamViec.find({
            ngayLam: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            CaLamViec: caLamViecId
        }).populate({
            path: 'BacSi',
            select: 'tenBS isActive Khoa',
            populate: {
                path: 'Khoa',
                select: 'tenKhoa _id'
            }
        });

        // Filter theo khoa nếu có khoaId
        if (khoaId) {
            lichLamViecList = lichLamViecList.filter(llv => 
                llv.BacSi && 
                llv.BacSi.Khoa && 
                llv.BacSi.Khoa._id.toString() === khoaId.toString()
            );
        }

        if (lichLamViecList.length === 0) {
            return response.status(400).json({
                message: khoaId 
                    ? "Không có bác sĩ nào có lịch làm việc trong khoa này cho ca này vào ngày này!" 
                    : "Không có bác sĩ nào có lịch làm việc trong ca này vào ngày này!"
            });
        }

        // Lọc chỉ các bác sĩ đang hoạt động
        const activeLichLamViecList = lichLamViecList.filter(llv => 
            llv.BacSi && llv.BacSi.isActive
        );

        if (activeLichLamViecList.length === 0) {
            return response.status(400).json({
                message: khoaId 
                    ? "Không có bác sĩ nào đang hoạt động trong khoa này cho ca làm việc này!" 
                    : "Không có bác sĩ nào đang hoạt động trong ca này!"
            });
        }

        // Tính số thứ tự CHUNG cho tất cả lịch hẹn trong ngày + ca (KHÔNG phân biệt bác sĩ)
        const countQuery = {
            ngayHen: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            CaLamViec: caLamViecId,
            trangThai: { $ne: 'Đã hủy' }
        };
        const existingCount = await LichHen.countDocuments(countQuery);
        const soThuTu = existingCount + 1;

        // Chọn bác sĩ có ít lịch hẹn nhất trong ca đó để phân bổ
        let selectedLichLamViec = activeLichLamViecList[0];
        let minAppointments = Infinity;

        for (const lichLamViec of activeLichLamViecList) {
            const appointmentCount = await LichHen.countDocuments({
                LichLamViec: lichLamViec._id,
                ngayHen: {
                    $gte: startOfDay,
                    $lt: endOfDay
                },
                CaLamViec: caLamViecId,
                trangThai: { $ne: 'Đã hủy' }
            });

            if (appointmentCount < minAppointments) {
                minAppointments = appointmentCount;
                selectedLichLamViec = lichLamViec;
            }
        }

        // Tạo lịch hẹn với giờ mặc định của ca (hoặc giờ đầu ca)
        const gioHen = caLamViec.gioBatDau || '08:00';
        const ngayGioHen = new Date(`${ngayHen}T${gioHen}`);

        const newLichHen = new LichHen({
            NguoiDung: user.NguoiDung,
            LichLamViec: selectedLichLamViec._id,
            CaLamViec: caLamViecId,
            ngayHen: ngayGioHen,
            soThuTu: soThuTu,
            DichVu: [],
            moTa: moTa || '',
            trangThai: 'Chưa xác nhận'
        });

        const savedLichHen = await newLichHen.save();

        // Populate để trả về đầy đủ thông tin
        const populatedLichHen = await LichHen.findById(savedLichHen._id)
            .populate('NguoiDung', 'hoTen SDT email diaChi')
            .populate({
                path: 'LichLamViec',
                populate: {
                    path: 'BacSi',
                    select: 'tenBS',
                    populate: {
                        path: 'Khoa',
                        select: 'tenKhoa'
                    }
                }
            })
            .populate('CaLamViec', 'caLam gioBatDau gioKetThuc');

        response.status(201).json({
            message: "Đặt lịch hẹn thành công!",
            data: populatedLichHen,
            soThuTu: soThuTu
        });
    } catch (error) {
        console.error('[createLichHenWithoutKhoa] Error:', error);
        response.status(500).json({
            message: "Lỗi khi đặt lịch hẹn!",
            error: error.message
        });
    }
};
