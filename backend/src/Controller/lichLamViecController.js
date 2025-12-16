import LichLamViec from "../Models/LichLamViec.js";
import BacSi from "../Models/BacSi.js";
import CaLamViec from "../Models/CaLamViec.js";

// Lấy lịch làm việc của bác sĩ
export const getLichLamViecByDoctorId = async (request, response) => {
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

        const lichLamViecList = await LichLamViec.find({ BacSi: doctorId })
            .populate('CaLamViec')
            .populate({
                path: 'BacSi',
                select: 'tenBS',
                populate: {
                    path: 'Khoa',
                    select: 'tenKhoa'
                }
            })
            .sort({ ngayLam: 1 })
            .select('-__v');

        response.status(200).json({
            message: "Lấy lịch làm việc thành công!",
            data: lichLamViecList,
            count: lichLamViecList.length
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy lịch làm việc!",
            error: error.message
        });
    }
};

// Tạo hoặc cập nhật lịch làm việc cho bác sĩ (theo tuần)
export const createOrUpdateLichLamViec = async (request, response) => {
    try {
        const { doctorId } = request.params;
        const { weekSchedule } = request.body; // weekSchedule: [{ ngayLam, caLamViecIds }]

        if (!doctorId || !doctorId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID bác sĩ không hợp lệ!"
            });
        }

        if (!weekSchedule || !Array.isArray(weekSchedule)) {
            return response.status(400).json({
                message: "Vui lòng cung cấp lịch làm việc trong tuần!"
            });
        }

        const bacSi = await BacSi.findById(doctorId);
        if (!bacSi) {
            return response.status(404).json({
                message: "Không tìm thấy bác sĩ!"
            });
        }

        const results = [];

        for (const schedule of weekSchedule) {
            const { ngayLam, caLamViecIds } = schedule;

            if (!ngayLam) {
                console.log(`[createOrUpdateLichLamViec] Skipping schedule with no ngayLam:`, schedule);
                continue;
            }

            // Chuyển đổi ngayLam thành Date object
            // Sử dụng cách parse trực tiếp từ string YYYY-MM-DD để tránh vấn đề timezone
            const [year, month, day] = ngayLam.split('-').map(Number);
            const ngayLamDate = new Date(year, month - 1, day, 0, 0, 0, 0);
            
            console.log(`[createOrUpdateLichLamViec] Processing date: ${ngayLam}, parsed as: ${ngayLamDate.toISOString()}, local: ${ngayLamDate.toLocaleDateString('vi-VN')}`);

            // Kiểm tra caLamViecIds có tồn tại không
            if (caLamViecIds && Array.isArray(caLamViecIds) && caLamViecIds.length > 0) {
                const caLamViecList = await CaLamViec.find({ _id: { $in: caLamViecIds } });
                if (caLamViecList.length !== caLamViecIds.length) {
                    return response.status(400).json({
                        message: `Một số ca làm việc không tồn tại cho ngày ${ngayLam}!`
                    });
                }
            }

            // Tìm lịch làm việc đã tồn tại
            const startOfDay = new Date(ngayLamDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(ngayLamDate);
            endOfDay.setHours(23, 59, 59, 999);

            let existingLichLamViec = await LichLamViec.findOne({
                BacSi: doctorId,
                ngayLam: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            });

            if (existingLichLamViec) {
                // Cập nhật lịch làm việc
                existingLichLamViec.CaLamViec = caLamViecIds || [];
                await existingLichLamViec.save();
                results.push(existingLichLamViec);
            } else {
                // Tạo mới lịch làm việc
                const newLichLamViec = new LichLamViec({
                    BacSi: doctorId,
                    ngayLam: ngayLamDate,
                    CaLamViec: caLamViecIds || []
                });
                const savedLichLamViec = await newLichLamViec.save();
                results.push(savedLichLamViec);
            }
        }

        // Populate kết quả
        const populatedResults = await LichLamViec.find({
            _id: { $in: results.map(r => r._id) }
        })
            .populate('CaLamViec')
            .populate({
                path: 'BacSi',
                select: 'tenBS',
                populate: {
                    path: 'Khoa',
                    select: 'tenKhoa'
                }
            })
            .sort({ ngayLam: 1 })
            .select('-__v');

        response.status(200).json({
            message: "Cập nhật lịch làm việc thành công!",
            data: populatedResults,
            count: populatedResults.length
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi cập nhật lịch làm việc!",
            error: error.message
        });
    }
};

// Xóa lịch làm việc
export const deleteLichLamViec = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID không hợp lệ!"
            });
        }

        const lichLamViec = await LichLamViec.findById(id);
        if (!lichLamViec) {
            return response.status(404).json({
                message: "Không tìm thấy lịch làm việc!"
            });
        }

        await LichLamViec.findByIdAndDelete(id);

        response.status(200).json({
            message: "Xóa lịch làm việc thành công!"
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi xóa lịch làm việc!",
            error: error.message
        });
    }
};

// Lấy lịch làm việc của bác sĩ theo ngày cụ thể
export const getLichLamViecByDoctorIdAndDate = async (request, response) => {
    try {
        const { doctorId } = request.params;
        const { date } = request.query; // Format: YYYY-MM-DD

        if (!doctorId || !doctorId.match(/^[0-9a-fA-F]{24}$/)) {
            return response.status(400).json({
                message: "ID bác sĩ không hợp lệ!"
            });
        }

        if (!date) {
            return response.status(400).json({
                message: "Vui lòng cung cấp ngày!"
            });
        }

        const bacSi = await BacSi.findById(doctorId);
        if (!bacSi) {
            return response.status(404).json({
                message: "Không tìm thấy bác sĩ!"
            });
        }

        // Chuyển đổi date thành Date object (tránh vấn đề timezone)
        // Parse trực tiếp từ string YYYY-MM-DD
        const [year, month, day] = date.split('-').map(Number);
        const targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        console.log(`[getLichLamViecByDoctorIdAndDate] Looking for schedule on date: ${date}, parsed as: ${targetDate.toISOString()}`);

        // Tìm lịch làm việc của bác sĩ trong ngày đó
        const lichLamViec = await LichLamViec.findOne({
            BacSi: doctorId,
            ngayLam: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        })
            .populate('CaLamViec')
            .populate({
                path: 'BacSi',
                select: 'tenBS',
                populate: {
                    path: 'Khoa',
                    select: 'tenKhoa'
                }
            })
            .select('-__v');

        if (!lichLamViec || !lichLamViec.CaLamViec || lichLamViec.CaLamViec.length === 0) {
            return response.status(200).json({
                message: "Bác sĩ không có lịch làm việc trong ngày này!",
                data: null,
                availableShifts: []
            });
        }

        // Trả về danh sách ca làm việc với thông tin giờ bắt đầu và kết thúc
        const availableShifts = lichLamViec.CaLamViec.map(ca => ({
            _id: ca._id,
            caLam: ca.caLam,
            gioBatDau: ca.gioBatDau,
            gioKetThuc: ca.gioKetThuc
        }));

        response.status(200).json({
            message: "Lấy lịch làm việc thành công!",
            data: lichLamViec,
            availableShifts: availableShifts
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy lịch làm việc!",
            error: error.message
        });
    }
};

// Lấy tất cả ca làm việc
export const getAllCaLamViec = async (request, response) => {
    try {
        const caLamViecList = await CaLamViec.find()
            .sort({ gioBatDau: 1 })
            .select('-__v');

        response.status(200).json({
            message: "Lấy danh sách ca làm việc thành công!",
            data: caLamViecList,
            count: caLamViecList.length
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Lỗi khi lấy danh sách ca làm việc!",
            error: error.message
        });
    }
};

