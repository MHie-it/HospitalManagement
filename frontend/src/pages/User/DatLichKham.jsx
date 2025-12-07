import BackgroundUser from '@/components/ui/BackgroundUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
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

const DatLichKham = () => {
  const navigate = useNavigate();
  
  // Dữ liệu mẫu - sẽ thay thế bằng API call sau
  const [khoaList] = useState([
    { id: 1, tenKhoa: 'Khoa Nội tổng quát' },
    { id: 2, tenKhoa: 'Khoa Tim mạch' },
    { id: 3, tenKhoa: 'Khoa Dinh dưỡng' },
    { id: 4, tenKhoa: 'Khoa Xét nghiệm' },
    { id: 5, tenKhoa: 'Khoa Nhi' },
    { id: 6, tenKhoa: 'Khoa Sản' }
  ]);

  const [bacSiList] = useState([
    { id: 1, tenBS: 'BS. Nguyễn Văn A', khoaId: 1 },
    { id: 2, tenBS: 'BS. Trần Thị B', khoaId: 1 },
    { id: 3, tenBS: 'BS. Lê Văn C', khoaId: 2 },
    { id: 4, tenBS: 'BS. Phạm Thị D', khoaId: 3 }
  ]);

  const [dichVuList] = useState([
    { id: 1, tenDV: 'Khám tổng quát', khoaId: 1, giaTien: 200000 },
    { id: 2, tenDV: 'Tư vấn dinh dưỡng', khoaId: 3, giaTien: 150000 },
    { id: 3, tenDV: 'Khám tim mạch', khoaId: 2, giaTien: 300000 },
    { id: 4, tenDV: 'Xét nghiệm máu', khoaId: 4, giaTien: 250000 }
  ]);

  const [formData, setFormData] = useState({
    khoa: '',
    bacSi: '',
    dichVu: [],
    ngayHen: '',
    gioHen: '',
    moTa: ''
  });

  const [selectedDichVu, setSelectedDichVu] = useState([]);

  // Lọc bác sĩ theo khoa
  const filteredBacSi = bacSiList.filter(bs => bs.khoaId === parseInt(formData.khoa));
  
  // Lọc dịch vụ theo khoa
  const filteredDichVu = dichVuList.filter(dv => dv.khoaId === parseInt(formData.khoa));

  // Xử lý thay đổi khoa
  const handleKhoaChange = (khoaId) => {
    setFormData({
      ...formData,
      khoa: khoaId,
      bacSi: '',
      dichVu: []
    });
    setSelectedDichVu([]);
  };

  // Xử lý chọn dịch vụ
  const handleDichVuToggle = (dichVuId) => {
    const dichVu = dichVuList.find(dv => dv.id === dichVuId);
    if (!dichVu) return;

    const isSelected = selectedDichVu.some(dv => dv.id === dichVuId);
    
    if (isSelected) {
      setSelectedDichVu(selectedDichVu.filter(dv => dv.id !== dichVuId));
      setFormData({
        ...formData,
        dichVu: formData.dichVu.filter(id => id !== dichVuId)
      });
    } else {
      setSelectedDichVu([...selectedDichVu, dichVu]);
      setFormData({
        ...formData,
        dichVu: [...formData.dichVu, dichVuId]
      });
    }
  };

  // Tính tổng tiền
  const totalPrice = selectedDichVu.reduce((sum, dv) => sum + dv.giaTien, 0);

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

    if (formData.dichVu.length === 0) {
      toast.error('Vui lòng chọn ít nhất một dịch vụ!');
      return;
    }

    if (!formData.ngayHen) {
      toast.error('Vui lòng chọn ngày hẹn!');
      return;
    }

    if (!formData.gioHen) {
      toast.error('Vui lòng chọn giờ hẹn!');
      return;
    }

    try {
      // TODO: Gọi API để đặt lịch
      console.log('Form data:', formData);
      
      toast.success('Đặt lịch khám thành công!');
      
      // Chuyển về trang user sau 1.5 giây
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt lịch!');
      console.error(error);
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
                onClick={() => navigate('/')}
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
                >
                  <option value="">-- Chọn khoa --</option>
                  {khoaList.map((khoa) => (
                    <option key={khoa.id} value={khoa.id}>
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
                  >
                    <option value="">-- Chọn bác sĩ --</option>
                    {filteredBacSi.map((bs) => (
                      <option key={bs.id} value={bs.id}>
                        {bs.tenBS}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Chọn Dịch vụ */}
              {formData.khoa && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Chọn dịch vụ <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredDichVu.map((dv) => {
                      const isSelected = selectedDichVu.some(selected => selected.id === dv.id);
                      return (
                        <div
                          key={dv.id}
                          onClick={() => handleDichVuToggle(dv.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-blue-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{dv.tenDV}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {dv.giaTien.toLocaleString('vi-VN')} đ
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedDichVu.length > 0 && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-gray-600 mb-2">Dịch vụ đã chọn:</p>
                      <ul className="space-y-1">
                        {selectedDichVu.map((dv) => (
                          <li key={dv.id} className="text-sm font-medium text-gray-800">
                            • {dv.tenDV} - {dv.giaTien.toLocaleString('vi-VN')} đ
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-lg font-bold text-blue-700">
                          Tổng tiền: {totalPrice.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </div>
                  )}
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
                  onChange={(e) => setFormData({ ...formData, ngayHen: e.target.value })}
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
                <Input
                  id="gioHen"
                  type="time"
                  value={formData.gioHen}
                  onChange={(e) => setFormData({ ...formData, gioHen: e.target.value })}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
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
                onClick={() => navigate('/')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Xác nhận đặt lịch
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </BackgroundUser>
  );
};

export default DatLichKham;

