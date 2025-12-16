import BackgroundUser from '@/components/ui/BackgroundUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  ArrowLeft,
  CheckCircle,
  FileText,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { khoaService } from '@/services/khoaService';
import { doctorService } from '@/services/doctorService';
import { userService } from '@/services/userService';
import { lichLamViecService } from '@/services/lichLamViecService';

const DatLichKham = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Danh sách khoa từ MongoDB
  const [khoaList, setKhoaList] = useState([]);
  
  // Danh sách bác sĩ từ MongoDB - sẽ được load khi chọn khoa
  const [bacSiList, setBacSiList] = useState([]);

  // Danh sách giờ khả dụng dựa trên ca làm việc của bác sĩ
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  
  // Danh sách các ngày bác sĩ có lịch làm việc (format: YYYY-MM-DD)
  const [availableDates, setAvailableDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);

  const [formData, setFormData] = useState({
    khoa: '',
    bacSi: '',
    ngayHen: '',
    gioHen: '',
    moTa: ''
  });

  // Load danh sách khoa từ MongoDB khi component mount
  useEffect(() => {
    const loadKhoaList = async () => {
      try {
        setLoading(true);
        const response = await khoaService.getAllKhoa();
        
        // API trả về array trực tiếp
        if (Array.isArray(response)) {
          setKhoaList(response);
        } else if (response.data && Array.isArray(response.data)) {
          setKhoaList(response.data);
        } else {
          setKhoaList([]);
        }
      } catch (error) {
        console.error('Error loading khoa list:', error);
        toast.error(error.message || 'Không thể tải danh sách khoa!');
        setKhoaList([]);
      } finally {
        setLoading(false);
      }
    };

    loadKhoaList();
  }, []);

  // Load danh sách bác sĩ khi khoa được chọn
  useEffect(() => {
    const loadBacSiList = async () => {
      if (!formData.khoa) {
        setBacSiList([]);
        setFormData(prev => ({ ...prev, bacSi: '' }));
        return;
      }

      try {
        setLoading(true);
        const doctors = await doctorService.getDoctorsByKhoa(formData.khoa);
        
        // Xử lý response - có thể là array hoặc object có data
        if (Array.isArray(doctors)) {
          setBacSiList(doctors);
        } else if (doctors && Array.isArray(doctors.data)) {
          setBacSiList(doctors.data);
        } else {
          setBacSiList([]);
        }
      } catch (error) {
        console.error('Error loading doctors list:', error);
        toast.error(error.message || 'Không thể tải danh sách bác sĩ!');
        setBacSiList([]);
      } finally {
        setLoading(false);
      }
    };

    loadBacSiList();
  }, [formData.khoa]);

  // Tạo danh sách giờ hành chính (8:00 - 17:30) và ca tối (18:00 - 21:30, mỗi 30 phút)
  const generateGioHanhChinh = () => {
    const gioList = [];
    // Giờ hành chính: 8:00 - 17:30
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        gioList.push(timeString);
      }
    }
    // Ca tối: 18:00 - 21:30
    for (let hour = 18; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        gioList.push(timeString);
      }
    }
    return gioList;
  };

  const gioHanhChinhList = generateGioHanhChinh();

  // Hàm chuyển đổi giờ (HH:MM) thành phút để so sánh
  const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Hàm lấy giờ mặc định dựa trên ca làm việc
  const getDefaultShiftTimes = (caLam) => {
    const shiftDefaults = {
      'Sang': { start: '08:00', end: '12:00' },
      'Chieu': { start: '13:00', end: '17:00' },
      'Toi': { start: '18:00', end: '22:00' }
    };
    const normalizedCa = String(caLam).toLowerCase();
    if (normalizedCa === 'sang') return shiftDefaults.Sang;
    if (normalizedCa === 'chieu') return shiftDefaults.Chieu;
    if (normalizedCa === 'toi') return shiftDefaults.Toi;
    return null;
  };

  // Hàm kiểm tra giờ có nằm trong khoảng ca làm việc không
  const isTimeInShift = (timeString, shifts) => {
    if (!shifts || shifts.length === 0) return false;
    
    const timeMinutes = timeToMinutes(timeString);
    
    return shifts.some(shift => {
      // Lấy giờ bắt đầu và kết thúc, nếu null thì dùng default dựa trên ca làm việc
      let gioBatDau = shift.gioBatDau;
      let gioKetThuc = shift.gioKetThuc;
      
      // Nếu không có giờ, dùng default dựa trên ca làm việc
      if (!gioBatDau || !gioKetThuc) {
        const defaultTimes = getDefaultShiftTimes(shift.caLam);
        if (defaultTimes) {
          gioBatDau = gioBatDau || defaultTimes.start;
          gioKetThuc = gioKetThuc || defaultTimes.end;
        } else {
          return false; // Không có thông tin ca làm việc
        }
      }
      
      const startMinutes = timeToMinutes(gioBatDau);
      const endMinutes = timeToMinutes(gioKetThuc);
      // Kiểm tra giờ có nằm trong khoảng [start, end) (không bao gồm end)
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
  };

  // Load tất cả lịch làm việc của bác sĩ khi chọn bác sĩ (để lấy danh sách ngày rảnh)
  useEffect(() => {
    const loadDoctorAvailableDates = async () => {
      if (!formData.bacSi) {
        setAvailableDates([]);
        setFormData(prev => ({ ...prev, ngayHen: '', gioHen: '' }));
        return;
      }

      try {
        setLoadingDates(true);
        // Lấy tất cả lịch làm việc của bác sĩ
        const response = await lichLamViecService.getLichLamViecByDoctorId(formData.bacSi);
        
        if (response.data && Array.isArray(response.data)) {
          // Lọc các ngày có lịch làm việc (có ít nhất 1 ca làm việc)
          // Và loại bỏ các ngày chỉ có 1 ca tối
          const datesWithSchedule = response.data
            .filter(schedule => {
              // Phải có ít nhất 1 ca làm việc
              if (!schedule.CaLamViec || schedule.CaLamViec.length === 0) {
                return false;
              }
              
              // Nếu chỉ có 1 ca và ca đó là "Toi", thì bỏ qua
              if (schedule.CaLamViec.length === 1) {
                const ca = schedule.CaLamViec[0];
                // Kiểm tra nếu ca là "Toi" (đã được populate nên là object)
                const caLam = ca?.caLam || ca;
                // So sánh không phân biệt hoa thường
                if (String(caLam).toLowerCase() === 'toi') {
                  return false; // Bỏ qua ngày chỉ có 1 ca tối
                }
              }
              
              return true;
            })
            .map(schedule => {
              const date = new Date(schedule.ngayLam);
              return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            })
            .filter((date, index, self) => self.indexOf(date) === index) // Remove duplicates
            .sort(); // Sort dates

          // Chỉ lấy các ngày từ hôm nay trở đi
          const today = new Date().toISOString().split('T')[0];
          const futureDates = datesWithSchedule.filter(date => date >= today);
          
          setAvailableDates(futureDates);

          // Nếu ngày hiện tại đã chọn không còn trong danh sách, reset
          if (formData.ngayHen && !futureDates.includes(formData.ngayHen)) {
            setFormData(prev => ({ ...prev, ngayHen: '', gioHen: '' }));
            toast.warning('Ngày đã chọn không còn khả dụng. Vui lòng chọn ngày khác!');
          }
        } else {
          setAvailableDates([]);
        }
      } catch (error) {
        console.error('Error loading doctor available dates:', error);
        setAvailableDates([]);
        toast.error(error.response?.data?.message || error.message || 'Không thể tải lịch làm việc của bác sĩ!');
      } finally {
        setLoadingDates(false);
      }
    };

    loadDoctorAvailableDates();
  }, [formData.bacSi]);

  // Load lịch làm việc của bác sĩ khi chọn bác sĩ và ngày (để lấy giờ khả dụng)
  useEffect(() => {
    const loadDoctorSchedule = async () => {
      // Reset giờ khi chưa chọn đủ bác sĩ hoặc ngày
      if (!formData.bacSi || !formData.ngayHen) {
        setAvailableTimes([]);
        setFormData(prev => ({ ...prev, gioHen: '' }));
        return;
      }

      // Kiểm tra ngày có trong danh sách ngày rảnh không
      if (availableDates.length > 0 && !availableDates.includes(formData.ngayHen)) {
        setAvailableTimes([]);
        setFormData(prev => ({ ...prev, gioHen: '' }));
        toast.warning('Bác sĩ không có lịch làm việc trong ngày này. Vui lòng chọn ngày khác!');
        return;
      }

      try {
        setLoadingSchedule(true);
        const response = await lichLamViecService.getLichLamViecByDoctorIdAndDate(
          formData.bacSi,
          formData.ngayHen
        );

        console.log('API Response for schedule:', response); // Debug log

        if (response.availableShifts && response.availableShifts.length > 0) {
          console.log('Available shifts:', response.availableShifts); // Debug log
          
          // Xử lý các ca làm việc: nếu không có gioBatDau/gioKetThuc, dùng default
          const processedShifts = response.availableShifts.map(shift => {
            if (!shift.gioBatDau || !shift.gioKetThuc) {
              const defaultTimes = getDefaultShiftTimes(shift.caLam);
              return {
                ...shift,
                gioBatDau: shift.gioBatDau || defaultTimes?.start || '08:00',
                gioKetThuc: shift.gioKetThuc || defaultTimes?.end || '17:00'
              };
            }
            return shift;
          });
          
          console.log('Processed shifts:', processedShifts); // Debug log
          
          // Lọc danh sách giờ hành chính dựa trên ca làm việc
          const filteredTimes = gioHanhChinhList.filter(time => 
            isTimeInShift(time, processedShifts)
          );
          
          console.log('Filtered available times:', filteredTimes); // Debug log
          
          setAvailableTimes(filteredTimes);

          // Nếu giờ hiện tại không còn trong danh sách khả dụng, reset giờ
          if (formData.gioHen && !filteredTimes.includes(formData.gioHen)) {
            setFormData(prev => ({ ...prev, gioHen: '' }));
            toast.warning('Giờ đã chọn không còn khả dụng. Vui lòng chọn lại!');
          }
        } else {
          // Bác sĩ không có lịch làm việc trong ngày này
          console.log('No available shifts found'); // Debug log
          setAvailableTimes([]);
          setFormData(prev => ({ ...prev, gioHen: '' }));
          toast.warning('Bác sĩ không có lịch làm việc trong ngày này. Vui lòng chọn ngày khác!');
        }
      } catch (error) {
        console.error('Error loading doctor schedule:', error);
        console.error('Error details:', error.response?.data); // Debug log
        // Nếu có lỗi, vẫn hiển thị tất cả giờ hành chính (fallback)
        setAvailableTimes(gioHanhChinhList);
        toast.error(error.response?.data?.message || error.message || 'Không thể tải lịch làm việc của bác sĩ!');
      } finally {
        setLoadingSchedule(false);
      }
    };

    loadDoctorSchedule();
  }, [formData.bacSi, formData.ngayHen, availableDates]);

  // Xử lý thay đổi khoa
  const handleKhoaChange = (khoaId) => {
    setFormData({
      ...formData,
      khoa: khoaId,
      bacSi: '', // Reset bác sĩ khi đổi khoa
      ngayHen: '',
      gioHen: ''
    });
    setAvailableTimes([]);
    setAvailableDates([]);
  };

  // Xử lý thay đổi ngày - validate và reset giờ để load lại lịch làm việc
  const handleNgayHenChange = (ngayHen) => {
    // Kiểm tra ngày có trong danh sách ngày rảnh không
    if (availableDates.length > 0 && !availableDates.includes(ngayHen)) {
      toast.warning('Bác sĩ không có lịch làm việc trong ngày này. Vui lòng chọn ngày khác!');
      return;
    }

    // Kiểm tra ngày không được trước ngày hiện tại
    const selectedDate = new Date(ngayHen);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error('Ngày hẹn không được trước ngày hiện tại!');
      return;
    }

    setFormData({
      ...formData,
      ngayHen: ngayHen,
      gioHen: '' // Reset giờ để load lại danh sách giờ khả dụng
    });
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.khoa) {
      toast.error('Vui lòng chọn khoa!');
      return;
    }

    if (!formData.bacSi) {
      toast.error('Vui lòng chọn bác sĩ!');
      return;
    }

    if (!formData.ngayHen) {
      toast.error('Vui lòng chọn ngày hẹn!');
      return;
    }

    // Kiểm tra ngày không được trước ngày hiện tại
    const selectedDate = new Date(formData.ngayHen);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error('Ngày hẹn không được trước ngày hiện tại!');
      return;
    }

    if (!formData.gioHen) {
      toast.error('Vui lòng chọn giờ hẹn!');
      return;
    }

    // Nếu chọn ngày hôm nay, kiểm tra giờ không được trước giờ hiện tại
    if (formData.ngayHen === today.toISOString().split('T')[0]) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const [selectedHour, selectedMinute] = formData.gioHen.split(':').map(Number);
      
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;
      
      if (selectedTimeInMinutes <= currentTimeInMinutes) {
        toast.error('Giờ hẹn phải sau giờ hiện tại!');
        return;
      }
    }

    try {
      setLoading(true);
      
      // Lấy userId từ localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        toast.error('Vui lòng đăng nhập lại!');
        navigate('/');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user._id || user.id;

      if (!userId) {
        toast.error('Không tìm thấy thông tin user!');
        return;
      }

      // Gọi API để đặt lịch
      const appointmentData = {
        userId: userId,
        bacSiId: formData.bacSi,
        ngayHen: formData.ngayHen,
        gioHen: formData.gioHen,
        dichVuIds: [], // Không có dịch vụ, để rỗng - backend sẽ tự tìm dịch vụ mặc định
        moTa: formData.moTa || ''
      };

      const response = await userService.createAppointment(appointmentData);
      
      if (response.data) {
        toast.success(response.message || 'Đặt lịch khám thành công!');
        
        // Chuyển về trang user sau 1.5 giây
        setTimeout(() => {
          navigate('/userpage');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt lịch!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundUser>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/userpage')}
                className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Quay lại</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent font-bold">
                  Đặt lịch khám bệnh
                </h1>
                <p className="text-xs text-gray-600">Điền thông tin để đặt lịch hẹn</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <Card className="shadow-xl border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 border-b-2 border-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calendar className="w-6 h-6" />
              Thông tin đặt lịch
            </CardTitle>
            <CardDescription>Vui lòng điền đầy đủ thông tin bên dưới</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-6">
              {/* Chọn Khoa */}
              <div className="space-y-2">
                <Label htmlFor="khoa" className="flex items-center gap-2 text-base font-semibold">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Chọn khoa <span className="text-red-500">*</span>
                </Label>
                <select
                  id="khoa"
                  value={formData.khoa}
                  onChange={(e) => handleKhoaChange(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">{loading ? 'Đang tải...' : '-- Chọn khoa --'}</option>
                  {khoaList.map((khoa) => (
                    <option key={khoa._id} value={khoa._id}>
                      {khoa.tenKhoa}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chọn Bác sĩ */}
              {formData.khoa && (
                <div className="space-y-2">
                  <Label htmlFor="bacSi" className="flex items-center gap-2 text-base font-semibold">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    Chọn bác sĩ <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="bacSi"
                    value={formData.bacSi}
                    onChange={(e) => setFormData({ ...formData, bacSi: e.target.value })}
                    className="flex h-11 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                  >
                    <option value="">{loading ? 'Đang tải...' : '-- Chọn bác sĩ --'}</option>
                    {bacSiList.length === 0 && !loading && (
                      <option value="" disabled>Không có bác sĩ nào trong khoa này</option>
                    )}
                    {bacSiList.map((bs) => (
                      <option key={bs._id} value={bs._id}>
                        {bs.tenBS}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ngày hẹn */}
              <div className="space-y-2">
                <Label htmlFor="ngayHen" className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Ngày hẹn <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ngayHen"
                  type="date"
                  value={formData.ngayHen}
                  onChange={(e) => handleNgayHenChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={!formData.bacSi || loadingDates}
                />
                {formData.bacSi && (
                  <div className="mt-3">
                    {loadingDates ? (
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4 animate-spin" />
                        Đang tải lịch làm việc của bác sĩ...
                      </p>
                    ) : availableDates.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Các ngày bác sĩ có lịch làm việc:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableDates.slice(0, 14).map((date) => {
                            const dateObj = new Date(date);
                            const isSelected = formData.ngayHen === date;
                            const isToday = date === new Date().toISOString().split('T')[0];
                            
                            return (
                              <button
                                key={date}
                                type="button"
                                onClick={() => handleNgayHenChange(date)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : isToday
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                }`}
                              >
                                {dateObj.toLocaleDateString('vi-VN', {
                                  weekday: 'short',
                                  day: '2-digit',
                                  month: '2-digit'
                                })}
                                {isToday && !isSelected && (
                                  <span className="ml-1 text-xs">(Hôm nay)</span>
                                )}
                              </button>
                            );
                          })}
                          {availableDates.length > 14 && (
                            <span className="px-3 py-1.5 text-sm text-gray-500">
                              +{availableDates.length - 14} ngày khác
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Hoặc chọn ngày khác trong ô trên (chỉ các ngày có lịch làm việc mới được chấp nhận)
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                            Bác sĩ chưa có lịch làm việc trong thời gian tới. Vui lòng chọn bác sĩ khác hoặc liên hệ bác sĩ để đặt lịch.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Giờ hẹn */}
              <div className="space-y-2">
                <Label htmlFor="gioHen" className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Giờ hẹn <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gioHen"
                  value={formData.gioHen}
                  onChange={(e) => setFormData({ ...formData, gioHen: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loadingSchedule || !formData.bacSi || !formData.ngayHen || availableTimes.length === 0}
                >
                  <option value="">
                    {loadingSchedule 
                      ? 'Đang tải lịch làm việc...' 
                      : !formData.bacSi || !formData.ngayHen
                      ? 'Vui lòng chọn bác sĩ và ngày trước'
                      : availableTimes.length === 0
                      ? 'Bác sĩ không có lịch làm việc trong ngày này'
                      : '-- Chọn giờ --'}
                  </option>
                  {(() => {
                    // Nếu có danh sách giờ khả dụng từ ca làm việc, sử dụng danh sách đó
                    if (availableTimes.length > 0) {
                      const today = new Date().toISOString().split('T')[0];
                      const now = new Date();
                      const currentHour = now.getHours();
                      const currentMinute = now.getMinutes();
                      const currentTimeInMinutes = currentHour * 60 + currentMinute;

                      return availableTimes
                        .filter(gio => {
                          // Nếu chọn ngày hôm nay, chỉ hiển thị giờ còn lại trong ngày
                          if (formData.ngayHen === today) {
                            const [hour, minute] = gio.split(':').map(Number);
                            const timeInMinutes = hour * 60 + minute;
                            return timeInMinutes > currentTimeInMinutes;
                          }
                          return true;
                        })
                        .map(gio => (
                          <option key={gio} value={gio}>
                            {gio}
                          </option>
                        ));
                    }
                    // Fallback: hiển thị tất cả giờ hành chính nếu chưa có lịch làm việc
                    return null;
                  })()}
                </select>
                {formData.bacSi && formData.ngayHen && availableTimes.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Các giờ khả dụng dựa trên lịch làm việc của bác sĩ
                  </p>
                )}
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <Label htmlFor="moTa" className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Mô tả triệu chứng (tùy chọn)
                </Label>
                <textarea
                  id="moTa"
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  rows={4}
                  className="flex w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Mô tả các triệu chứng hoặc vấn đề sức khỏe của bạn..."
                />
              </div>
            </CardContent>

            <CardFooter className="flex gap-3 pt-6 border-t-2 border-blue-50 bg-gradient-to-r from-blue-50/30 to-teal-50/30">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-blue-200 hover:bg-blue-50"
                onClick={() => navigate('/userpage')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Đặt lịch
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </BackgroundUser>
  );
};

export default DatLichKham;

