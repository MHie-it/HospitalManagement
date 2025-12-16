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

const DatLichKham = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Danh sách khoa từ MongoDB
  const [khoaList, setKhoaList] = useState([]);
  
  // Danh sách bác sĩ từ MongoDB - sẽ được load khi chọn khoa
  const [bacSiList, setBacSiList] = useState([]);

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

  // Tạo danh sách giờ hành chính (8:00 - 17:30, mỗi 30 phút)
  const generateGioHanhChinh = () => {
    const gioList = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        gioList.push(timeString);
      }
    }
    return gioList;
  };

  const gioHanhChinhList = generateGioHanhChinh();

  // Xử lý thay đổi khoa
  const handleKhoaChange = (khoaId) => {
    setFormData({
      ...formData,
      khoa: khoaId,
      bacSi: '' // Reset bác sĩ khi đổi khoa
    });
  };

  // Xử lý thay đổi ngày - reset giờ nếu chọn ngày hôm nay và giờ đã qua
  const handleNgayHenChange = (ngayHen) => {
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = new Date(ngayHen);
    const now = new Date();
    
    // Nếu chọn ngày hôm nay, kiểm tra giờ
    if (ngayHen === today) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Nếu giờ hiện tại đã qua giờ hành chính, reset giờ
      if (formData.gioHen && formData.gioHen < currentTime) {
        setFormData({
          ...formData,
          ngayHen: ngayHen,
          gioHen: ''
        });
      } else {
        setFormData({
          ...formData,
          ngayHen: ngayHen
        });
      }
    } else {
      setFormData({
        ...formData,
        ngayHen: ngayHen
      });
    }
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
                />
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
                >
                  <option value="">-- Chọn giờ --</option>
                  {(() => {
                    // Nếu chọn ngày hôm nay, chỉ hiển thị giờ còn lại trong ngày
                    const today = new Date().toISOString().split('T')[0];
                    if (formData.ngayHen === today) {
                      const now = new Date();
                      const currentHour = now.getHours();
                      const currentMinute = now.getMinutes();
                      const currentTimeInMinutes = currentHour * 60 + currentMinute;
                      
                      return gioHanhChinhList
                        .filter(gio => {
                          const [hour, minute] = gio.split(':').map(Number);
                          const timeInMinutes = hour * 60 + minute;
                          return timeInMinutes > currentTimeInMinutes;
                        })
                        .map(gio => (
                          <option key={gio} value={gio}>
                            {gio}
                          </option>
                        ));
                    }
                    // Nếu chọn ngày khác, hiển thị tất cả giờ hành chính
                    return gioHanhChinhList.map(gio => (
                      <option key={gio} value={gio}>
                        {gio}
                      </option>
                    ));
                  })()}
                </select>
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

