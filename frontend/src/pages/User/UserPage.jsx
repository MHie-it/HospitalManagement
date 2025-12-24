import BackgroundUser from '@/components/ui/BackgroundUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  CalendarCheck,
  History,
  Stethoscope,
  MessageSquare,
  FileText,
  Edit,
  Camera,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCircle,
  Activity,
  Building2,
  Award,
  Shield,
  Users,
  Heart,
  Star,
  Sparkles,
  CheckCircle2,
  X,
  ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { tuVanService } from '@/services/tuVanService';
import { khoaService } from '@/services/khoaService';

const UserPage = () => {
  const navigate = useNavigate();
  // Thêm ref cho phần profile tabs
  const profileSectionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Dữ liệu user info - sẽ được load từ API
  const [userInfo, setUserInfo] = useState({
    hoTen: '',
    email: '',
    SDT: '',
    ngaySinh: '',
    diaChi: '',
    gioiTinh: 'Nam',
    imgURL: ''
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [examResults, setExamResults] = useState([]); // Danh sách kết quả khám bệnh
  const [showResultsModal, setShowResultsModal] = useState(false); // State để hiển thị modal
  const [loadingResults, setLoadingResults] = useState(false);

  // Modal xem chi tiết lịch hẹn
  const [showAppointmentDetailModal, setShowAppointmentDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // State cho tư vấn trực tuyến
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    khoa: '',
    bacSi: '',
    cauHoi: ''
  });
  const [consultationHistory, setConsultationHistory] = useState([]);
  const [loadingConsultation, setLoadingConsultation] = useState(false);
  const [sendingQuestion, setSendingQuestion] = useState(false);
  const [khoaList, setKhoaList] = useState([]);
  const [hoveredService, setHoveredService] = useState(null);

  // Thêm dữ liệu gói khám sau services array 
  const healthPackages = [
    {
      id: 1,
      name: 'Gói khám tổng quát cơ bản',
      price: '2.000.000',
      originalPrice: '2.500.000',
      description: 'Khám sức khỏe tổng quát cơ bản dành cho mọi đối tượng',
      features: [
        'Khám lâm sàng tổng quát',
        'Xét nghiệm máu cơ bản',
        'Xét nghiệm nước tiểu',
        'Đo điện tim',
        'Siêu âm bụng tổng quát',
        'Tư vấn sức khỏe'
      ],
      duration: '2-3 giờ',
      popular: false,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'Gói khám tổng quát chuyên sâu',
      price: '3.600.000',
      originalPrice: '4.500.000',
      description: 'Khám sức khỏe toàn diện với các xét nghiệm chuyên sâu',
      features: [
        'Khám lâm sàng đầy đủ',
        'Xét nghiệm máu chuyên sâu',
        'Xét nghiệm chức năng gan, thận',
        'Đo điện tim, X-quang ngực',
        'Siêu âm bụng, tuyến giáp',
        'Tư vấn dinh dưỡng',
        'Báo cáo chi tiết'
      ],
      duration: '3-4 giờ',
      popular: true,
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 3,
      name: 'Gói khám chuyên sâu Nam',
      price: '4.100.000',
      originalPrice: '5.200.000',
      description: 'Gói khám chuyên biệt dành cho nam giới',
      features: [
        'Tất cả dịch vụ gói chuyên sâu',
        'Xét nghiệm PSA (ung thư tiền liệt tuyến)',
        'Siêu âm tuyến tiền liệt',
        'Tư vấn sức khỏe nam giới',
        'Đánh giá nguy cơ tim mạch',
        'Tư vấn dinh dưỡng cá nhân hóa'
      ],
      duration: '4-5 giờ',
      popular: false,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 4,
      name: 'Gói khám chuyên sâu Nữ',
      price: '4.900.000',
      originalPrice: '6.000.000',
      description: 'Gói khám chuyên biệt dành cho nữ giới',
      features: [
        'Tất cả dịch vụ gói chuyên sâu',
        'Khám phụ khoa',
        'Siêu âm vú, tử cung',
        'Xét nghiệm tầm soát ung thư cổ tử cung',
        'Tư vấn sức khỏe phụ nữ',
        'Đánh giá loãng xương',
        'Tư vấn dinh dưỡng cá nhân hóa'
      ],
      duration: '4-5 giờ',
      popular: true,
      color: 'from-pink-500 to-rose-600'
    }
  ];

  // Thêm handler cho đăng ký gói khám
  const handleBookPackage = (packageId) => {
    toast.info(`Chức năng đặt gói khám ${packageId} đang được phát triển`);
    // TODO: Navigate to booking page or open modal
  };

  // Load user info và lịch hẹn khi component mount
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // Lấy user từ localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          toast.error('Vui lòng đăng nhập lại!');
          navigate('/');
          return;
        }

        const user = JSON.parse(userStr);
        const currentUserId = user._id || user.id;

        if (!currentUserId) {
          toast.error('Không tìm thấy thông tin user!');
          return;
        }

        setUserId(currentUserId);

        // Fetch user info từ API
        setLoading(true);
        const response = await userService.getUserInfo(currentUserId);

        if (response.data) {
          const data = response.data;
          setUserInfo({
            hoTen: data.hoTen || '',
            email: data.email || '',
            SDT: data.SDT || '',
            ngaySinh: data.ngaySinh ? new Date(data.ngaySinh).toISOString().split('T')[0] : '',
            diaChi: data.diaChi || '',
            gioiTinh: data.gioiTinh || 'Nam',
            imgURL: data.imgURL || ''
          });
        }

        // Load lịch hẹn từ MongoDB
        const appointmentsResponse = await userService.getAppointments(currentUserId);
        if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcoming = [];
          const history = [];

          appointmentsResponse.data.forEach(lh => {
            const ngayHen = new Date(lh.ngayHen);
            const appointmentData = {
              id: lh._id,
              ngayHen: ngayHen.toISOString().split('T')[0],
              gioHen: ngayHen.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              bacSi: lh.LichLamViec?.BacSi?.tenBS || 'N/A',
              khoa: lh.LichLamViec?.BacSi?.Khoa?.tenKhoa || 'N/A',
              dichVu: lh.DichVu?.map(dv => dv.tenDV).join(', ') || lh.moTa || 'Khám bệnh',
              trangThai: lh.trangThai || 'Chưa xác nhận',
              ghiChuBacSi: lh.ghiChuBacSi || '' // Thêm ghi chú của bác sĩ
            };

            if (lh.trangThai === 'Đã khám') {
              history.push(appointmentData);
            } else if (ngayHen >= today) {
              upcoming.push(appointmentData);
            } else {
              history.push(appointmentData);
            }
          });

          // Sắp xếp: upcoming theo ngày tăng dần, history theo ngày giảm dần
          upcoming.sort((a, b) => new Date(a.ngayHen) - new Date(b.ngayHen));
          history.sort((a, b) => new Date(b.ngayHen) - new Date(a.ngayHen));

          setUpcomingAppointments(upcoming);
          setAppointmentHistory(history);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        toast.error(error.response?.data?.message || error.message || 'Không thể tải thông tin người dùng!');
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [navigate]);

  // Handler để cập nhật thông tin
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('Không tìm thấy thông tin user!');
      return;
    }

    // Validation
    if (!userInfo.hoTen.trim() || !userInfo.email.trim() || !userInfo.SDT.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.updateUserInfo(userId, userInfo);

      if (response.data) {
        toast.success(response.message || 'Cập nhật thông tin thành công!');

        const data = response.data;

        // 1) cập nhật UI ngay
        setUserInfo((prev) => ({
          ...prev,
          ...data,
          ngaySinh: data.ngaySinh ? new Date(data.ngaySinh).toISOString().split('T')[0] : '',
        }));

        // 2) (tuỳ chọn) cập nhật localStorage nếu chỗ khác dùng user
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
        }
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      toast.error(error.message || 'Cập nhật thông tin thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Handler cho đăng xuất
  const handleLogout = () => {
    // Xóa token và user info
    authService.logout();

    // Hiển thị thông báo
    toast.success('Đăng xuất thành công!');

    // Chuyển hướng về trang login
    navigate('/');
  };

  // Handler để scroll đến phần thông tin
  const handleScrollToProfile = () => {
    // Scroll đến phần tabs
    if (profileSectionRef.current) {
      profileSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Đảm bảo tab "profile" được active (nếu dùng controlled tabs)
      // Nếu dùng uncontrolled, có thể cần thêm state để control
    }
  };

  // Handler cho các dịch vụ nhanh
  const handleServiceClick = async (serviceId) => {
    if (serviceId === 1) {
      // Đặt lịch khám
      navigate('/dat-lich-kham');
    } else if (serviceId === 2) {
      // Tư vấn trực tuyến
      await handleOpenConsultation();
    } else if (serviceId === 3) {
      // Xem kết quả khám bệnh
      await handleViewResults();
    } else {
      toast.info(`Chức năng ${serviceId} đang được phát triển`);
    }
  };

  const openAppointmentDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailModal(true);
  };

  const closeAppointmentDetail = () => {
    setShowAppointmentDetailModal(false);
    setSelectedAppointment(null);
  };

  // Handler mở modal tư vấn
  const handleOpenConsultation = async () => {
    try {
      setShowConsultationModal(true);
      setLoadingConsultation(true);

      // Load danh sách khoa
      const khoaResponse = await khoaService.getAllKhoa();
      if (Array.isArray(khoaResponse)) {
        setKhoaList(khoaResponse);
      } else if (khoaResponse.data && Array.isArray(khoaResponse.data)) {
        setKhoaList(khoaResponse.data);
      }

      // Load lịch sử tư vấn
      if (userId) {
        const historyResponse = await tuVanService.getTuVanByUserId(userId);
        if (historyResponse.data && Array.isArray(historyResponse.data)) {
          setConsultationHistory(historyResponse.data);
        }
      }
    } catch (error) {
      console.error('Error loading consultation data:', error);
      toast.error('Không thể tải dữ liệu tư vấn!');
    } finally {
      setLoadingConsultation(false);
    }
  };

  // Handler gửi câu hỏi
  const handleSendQuestion = async () => {
    if (!consultationForm.cauHoi || !consultationForm.cauHoi.trim()) {
      toast.error('Vui lòng nhập câu hỏi!');
      return;
    }

    if (!userId) {
      toast.error('Không tìm thấy thông tin user!');
      return;
    }

    try {
      setSendingQuestion(true);

      const response = await tuVanService.createTuVan({
        userId: userId,
        khoaId: consultationForm.khoa || null,
        bacSiId: consultationForm.bacSi || null,
        cauHoi: consultationForm.cauHoi.trim()
      });

      if (response.data) {
        toast.success('Câu hỏi đã được gửi! AI đang xử lý...');

        // Thêm vào lịch sử
        setConsultationHistory(prev => [response.data, ...prev]);

        // Reset form
        setConsultationForm({
          khoa: '',
          bacSi: '',
          cauHoi: ''
        });

        // Reload lịch sử để lấy câu trả lời từ AI
        setTimeout(async () => {
          try {
            const historyResponse = await tuVanService.getTuVanByUserId(userId);
            if (historyResponse.data && Array.isArray(historyResponse.data)) {
              setConsultationHistory(historyResponse.data);
            }
          } catch (error) {
            console.error('Error reloading consultation history:', error);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending question:', error);
      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi gửi câu hỏi!');
    } finally {
      setSendingQuestion(false);
    }
  };

  // Handler để xem kết quả khám bệnh
  const handleViewResults = async () => {
    try {
      setLoadingResults(true);

      if (!userId) {
        toast.error('Không tìm thấy thông tin user!');
        return;
      }

      // Load lại danh sách lịch hẹn để lấy kết quả mới nhất
      const appointmentsResponse = await userService.getAppointments(userId);

      if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data)) {
        // Lọc ra các lịch hẹn đã khám và có ghi chú của bác sĩ
        const results = appointmentsResponse.data
          .filter(lh => lh.trangThai === 'Đã khám' && lh.ghiChuBacSi && lh.ghiChuBacSi.trim() !== '')
          .map(lh => {
            const ngayHen = new Date(lh.ngayHen);
            return {
              id: lh._id,
              ngayHen: ngayHen.toISOString().split('T')[0],
              gioHen: ngayHen.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              bacSi: lh.LichLamViec?.BacSi?.tenBS || 'N/A',
              khoa: lh.LichLamViec?.BacSi?.Khoa?.tenKhoa || 'N/A',
              dichVu: lh.DichVu?.map(dv => dv.tenDV).join(', ') || lh.moTa || 'Khám bệnh',
              ghiChuBacSi: lh.ghiChuBacSi || '',
              moTa: lh.moTa || ''
            };
          })
          .sort((a, b) => new Date(b.ngayHen) - new Date(a.ngayHen)); // Sắp xếp mới nhất trước

        setExamResults(results);
        setShowResultsModal(true);

        if (results.length === 0) {
          toast.info('Bạn chưa có kết quả khám bệnh nào');
        }
      }
    } catch (error) {
      console.error('Error loading exam results:', error);
      toast.error(error.response?.data?.message || error.message || 'Không thể tải kết quả khám bệnh!');
    } finally {
      setLoadingResults(false);
    }
  };

  const services = [
    { id: 1, name: 'Đặt lịch khám', icon: Calendar, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { id: 2, name: 'Tư vấn trực tuyến', icon: MessageSquare, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50', textColor: 'text-teal-600' },
    { id: 3, name: 'Xem kết quả', icon: FileText, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50', textColor: 'text-cyan-600' },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Đã xác nhận':
        return {
          icon: CheckCircle,
          variant: 'default',
          className: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
        };
      case 'Chưa xác nhận':
        return {
          icon: AlertCircle,
          variant: 'secondary',
          className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100'
        };
      case 'Đã hủy':
        return {
          icon: XCircle,
          variant: 'destructive',
          className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'
        };
      case 'Đã khám':
        return {
          icon: CheckCircle,
          variant: 'outline',
          className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100'
        };
      default:
        return {
          icon: AlertCircle,
          variant: 'outline',
          className: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100'
        };
    }
  };

  return (
    <BackgroundUser>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 shadow-sm border-b border-blue-100 hide-scrollbar">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition"></div>
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center text-white shadow-lg">
                  <Activity className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
                  Bệnh viện
                </h1>
                <p className="text-xs text-gray-600">Chăm sóc sức khỏe toàn diện</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div
                className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100 cursor-pointer hover:shadow-md transition-shadow"
                onClick={handleScrollToProfile}
              >
                <Avatar className="h-11 w-11 ring-2 ring-blue-200">
                  <AvatarImage src={userInfo.imgURL} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                    {userInfo.hoTen.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">{userInfo.hoTen}</p>
                  <p className="text-xs text-gray-600">Bệnh nhân</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl hide-scrollbar">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white rounded-full"></div>
          </div>
          <div className="relative z-10 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl mb-2">
                  Xin chào, <span className="text-yellow-300">{userInfo.hoTen}</span>! 👋
                </h2>
                <p className="text-blue-50 text-sm sm:text-base">Chúng tôi luôn sẵn sàng chăm sóc sức khỏe của bạn</p>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[100px] text-center">
                  <p className="text-xs text-blue-100 mb-1">Lịch hẹn</p>
                  <p className="text-2xl sm:text-3xl">{upcomingAppointments.length}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[100px] text-center">
                  <p className="text-xs text-blue-100 mb-1">Đã khám</p>
                  <p className="text-2xl sm:text-3xl">{appointmentHistory.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Services */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl mb-4 flex items-center gap-2 text-gray-800">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Dịch vụ nhanh
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {services.map((service) => {
              const IconComponent = service.icon;
              const isBookingService = service.id === 1; // Service "Đặt lịch khám"
              const isHovered = hoveredService === service.id;

              return (
                <Card
                  key={service.id}
                  className={`group cursor-pointer border-2 transition-all duration-300 ${
                    isHovered && isBookingService ? 'border-blue-400 shadow-xl -translate-y-1' : 'hover:border-blue-300 hover:shadow-xl hover:-translate-y-1'
                  } relative overflow-hidden`}
                  onMouseEnter={() => isBookingService && setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                  onClick={() => {
                    // Chỉ onClick nếu không phải service đặt lịch hoặc không đang hover
                    if (!isBookingService || !isHovered) {
                      handleServiceClick(service.id);
                    }
                  }}
                >
                  <CardContent className="p-4 sm:p-6 text-center relative">
                    {/* Icon */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg transition-transform duration-300 ${
                      isHovered && isBookingService ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>

                    {/* Nội dung chính */}
                    {!(isBookingService && isHovered) && (
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{service.name}</p>
                    )}

                    {/* Hiển thị 2 button khi hover vào service đặt lịch */}
                    {isBookingService && isHovered && (
                      <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md text-sm sm:text-base"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/dat-lich-kham');
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Đặt lịch khám
                        </Button>
                        <Button
                          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md text-sm sm:text-base"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/laysott');
                          }}
                        >
                          <ClipboardList className="w-4 h-4 mr-2" />
                          Lấy số thứ tự
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* PHẦN GIỚI THIỆU BỆNH VIỆN - Thêm sau phần Quick Services (sau dòng 299) */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 rounded-3xl shadow-2xl overflow-hidden relative hide-scrollbar">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full -ml-36 -mb-36"></div>
            </div>
            <div className="relative z-10 p-6 sm:p-8 lg:p-12 text-white">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Giới thiệu về Bệnh viện
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <p className="text-lg text-blue-50 leading-relaxed">
                      Bệnh viện chúng tôi là hệ thống y tế hàng đầu với nhiều năm kinh nghiệm trong việc chăm sóc sức khỏe toàn diện.
                      Chúng tôi tự hào mang đến dịch vụ y tế chất lượng cao với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại.
                    </p>
                    <p className="text-base text-blue-100">
                      Với mục tiêu "Chăm sóc sức khỏe - Nâng cao chất lượng cuộc sống", chúng tôi cam kết mang đến cho bạn
                      những dịch vụ y tế tốt nhất với sự tận tâm và chuyên nghiệp.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-2xl font-bold mb-1">50+</p>
                        <p className="text-sm text-blue-100">Bác sĩ chuyên khoa</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Award className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-2xl font-bold mb-1">15+</p>
                        <p className="text-sm text-blue-100">Năm kinh nghiệm</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-2xl font-bold mb-1">100K+</p>
                        <p className="text-sm text-blue-100">Bệnh nhân hài lòng</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                        <Star className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-2xl font-bold mb-1">24/7</p>
                        <p className="text-sm text-blue-100">Cấp cứu</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Trang thiết bị hiện đại</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Đội ngũ bác sĩ chuyên nghiệp</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Dịch vụ chăm sóc tận tâm</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Hệ thống quản lý hiện đại</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN CÁC GÓI KHÁM BỆNH - Thêm sau phần giới thiệu */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                Các gói khám sức khỏe
              </h3>
              <p className="text-gray-600">Lựa chọn gói khám phù hợp với nhu cầu của bạn</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {healthPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hide-scrollbar ${pkg.popular
                  ? 'border-blue-400 shadow-xl ring-4 ring-blue-100'
                  : 'border-blue-100 hover:border-blue-300'
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    PHỔ BIẾN
                  </div>
                )}

                <CardHeader className={`bg-gradient-to-br ${pkg.color} text-white pb-4`}>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg sm:text-xl font-bold text-white">
                      {pkg.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-blue-50 text-sm mt-2">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-gray-800">
                        {pkg.price}
                      </span>
                      <span className="text-lg text-gray-600"> đ</span>
                    </div>
                    {pkg.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          {pkg.originalPrice} đ
                        </span>
                        <Badge className="bg-red-100 text-red-700 text-xs">
                          Tiết kiệm {(parseInt(pkg.originalPrice.replace(/\./g, '')) - parseInt(pkg.price.replace(/\./g, ''))).toLocaleString('vi-VN')} đ
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Thời gian: {pkg.duration}</span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-800 mb-2">Bao gồm:</p>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 pb-6 px-6">
                  <Button
                    className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white shadow-lg`}
                    onClick={() => navigate('/dat-lich-kham')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Đặt lịch ngay
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Tabs - Thêm ref và id */}
        <div ref={profileSectionRef} id="profile-section">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1.5 bg-white rounded-xl shadow-md border-2 border-blue-100">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 rounded-lg py-2.5 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Thông tin</span>
                <span className="sm:hidden">Hồ sơ</span>
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="flex items-center gap-2 rounded-lg py-2.5 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
              >
                <CalendarCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Lịch hẹn</span>
                <span className="sm:hidden">Hẹn</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 rounded-lg py-2.5 sm:py-3 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Lịch sử</span>
                <span className="sm:hidden">Sử</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1 shadow-xl border-2 border-blue-100 overflow-hidden hide-scrollbar">
                  <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 relative">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                    </div>
                  </div>
                  <CardContent className="text-center -mt-16 relative z-10 pb-6">
                    <div className="relative inline-block">
                      <Avatar className="h-32 w-32 ring-4 ring-white shadow-2xl mx-auto">
                        <AvatarImage src={userInfo.imgURL} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-white text-5xl">
                          {userInfo.hoTen.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 h-10 w-10 rounded-full p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="text-2xl mt-4 mb-1 text-gray-800">{userInfo.hoTen}</h3>
                    <p className="text-sm text-gray-600 mb-6">{userInfo.email}</p>

                    <Separator className="my-6" />

                    <div className="space-y-4 text-left">
                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                        <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Số điện thoại</p>
                          <p className="font-semibold text-gray-800">{userInfo.SDT}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Ngày sinh</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(userInfo.ngaySinh).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                        <User className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Giới tính</p>
                          <p className="font-semibold text-gray-800">{userInfo.gioiTinh}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Địa chỉ</p>
                          <p className="font-semibold text-gray-800 text-sm">{userInfo.diaChi}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Edit Profile Form */}
                <Card className="lg:col-span-2 shadow-xl border-2 border-blue-100">
                  <CardHeader className="border-b-2 border-blue-50 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Edit className="w-6 h-6" />
                      Cập nhật thông tin
                    </CardTitle>
                    <CardDescription>Chỉnh sửa thông tin cá nhân của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form id="update-profile-form"
                      className="space-y-5"
                      onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="hoTen" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Họ và tên
                          </Label>
                          <Input
                            id="hoTen"
                            value={userInfo.hoTen}
                            onChange={(e) => setUserInfo({ ...userInfo, hoTen: e.target.value })}
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="SDT" className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            Số điện thoại
                          </Label>
                          <Input
                            id="SDT"
                            value={userInfo.SDT}
                            onChange={(e) => setUserInfo({ ...userInfo, SDT: e.target.value })}
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ngaySinh" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            Ngày sinh
                          </Label>
                          <Input
                            id="ngaySinh"
                            type="date"
                            value={userInfo.ngaySinh}
                            onChange={(e) => setUserInfo({ ...userInfo, ngaySinh: e.target.value })}
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gioiTinh" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Giới tính
                          </Label>
                          <select
                            id="gioiTinh"
                            value={userInfo.gioiTinh}
                            onChange={(e) => setUserInfo({ ...userInfo, gioiTinh: e.target.value })}
                            className="flex h-9 w-full rounded-md border border-blue-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diaChi" className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          Địa chỉ
                        </Label>
                        <Input
                          id="diaChi"
                          value={userInfo.diaChi}
                          onChange={(e) => setUserInfo({ ...userInfo, diaChi: e.target.value })}
                          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex gap-3 pt-4 border-t-2 border-blue-50 bg-gradient-to-r from-blue-50/30 to-teal-50/30">
                    <Button
                      type="submit"
                      form="update-profile-form"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md"
                      disabled={loading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-blue-200 hover:bg-blue-50"
                      onClick={() => window.location.reload()}
                      disabled={loading}
                    >
                      Hủy
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white rounded-2xl border-2 border-blue-100 shadow-lg">
                <div>
                  <h2 className="text-2xl text-gray-800 flex items-center gap-2">
                    <CalendarCheck className="w-6 h-6 text-blue-600" />
                    Lịch hẹn sắp tới
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Quản lý các cuộc hẹn của bạn</p>
                </div>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md"
                  onClick={() => navigate('/dat-lich-kham')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Đặt lịch mới
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingAppointments.map((appointment) => {
                  const statusConfig = getStatusConfig(appointment.trangThai);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card key={appointment.id} className="group hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 overflow-hidden hide-scrollbar">
                      <div className="h-2 bg-gradient-to-r from-blue-600 to-teal-600"></div>
                      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50/50 to-teal-50/50">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-1 text-blue-700 flex items-center gap-2">
                              <Stethoscope className="w-5 h-5" />
                              {appointment.dichVu}
                            </CardTitle>
                            <CardDescription className="font-medium">{appointment.bacSi}</CardDescription>
                            <p className="text-sm text-gray-600 mt-1">{appointment.khoa}</p>
                          </div>
                          <Badge variant={statusConfig.variant} className={`${statusConfig.className} flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {appointment.trangThai}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Ngày khám</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(appointment.ngayHen).toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Giờ khám</p>
                            <p className="font-semibold text-gray-800 text-xl">{appointment.gioHen}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-4 border-t-2 border-blue-50">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-blue-200 hover:bg-blue-50"
                          onClick={() => openAppointmentDetail(appointment)}
                        >
                          Chi tiết
                        </Button>
                        {/* {appointment.trangThai === 'Chưa xác nhận' && (
                          <Button size="sm" variant="destructive" className="flex-1">
                            <XCircle className="w-4 h-4 mr-1" />
                            Hủy lịch
                          </Button>
                        )} */}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {upcomingAppointments.length === 0 && (
                <Card className="border-2 border-blue-100 shadow-lg">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                      <CalendarCheck className="w-10 h-10 text-blue-600" />
                    </div>
                    <p className="text-gray-600 mb-2">Bạn chưa có lịch hẹn nào sắp tới</p>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 mt-4"
                      onClick={() => navigate('/dat-lich-kham')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Đặt lịch hẹn ngay
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <div className="p-6 bg-white rounded-2xl border-2 border-blue-100 shadow-lg">
                <h2 className="text-2xl text-gray-800 flex items-center gap-2">
                  <History className="w-6 h-6 text-blue-600" />
                  Lịch sử khám bệnh
                </h2>
                <p className="text-sm text-gray-600 mt-1">Xem lại các lần khám trước đây của bạn</p>
              </div>

              <div className="space-y-4">
                {appointmentHistory.map((appointment) => {
                  const statusConfig = getStatusConfig(appointment.trangThai);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Card key={appointment.id} className="hover:shadow-xl transition-all duration-300 border-2 border-blue-100 overflow-hidden hide-scrollbar">
                      <div className="h-1.5 bg-gradient-to-r from-blue-600 to-teal-600"></div>
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <FileText className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl mb-2 text-blue-700 flex items-center gap-2">
                                  {appointment.dichVu}
                                </h3>
                                <p className="font-medium text-gray-700 mb-2">{appointment.khoa}</p>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span>Bác sĩ: {appointment.bacSi}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span>
                                      Ngày khám: {new Date(appointment.ngayHen).toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <Badge variant={statusConfig.variant} className={`${statusConfig.className} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {appointment.trangThai}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 hover:bg-blue-50"
                              onClick={() => openAppointmentDetail(appointment)}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {appointmentHistory.length === 0 && (
                <Card className="border-2 border-blue-100 shadow-lg">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                      <History className="w-10 h-10 text-blue-600" />
                    </div>
                    <p className="text-gray-600">Chưa có lịch sử khám bệnh</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal hiển thị kết quả khám bệnh */}
      {showResultsModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setShowResultsModal(false)}
        >
          <Card
            className="w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border-0 animate-in zoom-in-95 duration-200 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b border-boder rounded-t-xl bg-gradient-to-r from-blue-50 to-teal-50 flex-shrink-0">
              <div className="flex items-center justify-between top-0 p-0 ">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex justify-center items-center gap-2 p-3">
                  <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg p-2">
                    <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  Kết quả khám bệnh
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowResultsModal(false)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CardDescription className="mt-1 text-sm">
                Danh sách kết quả khám bệnh đã được bác sĩ xác nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex-1 overflow-y-auto hide-scrollbar">
              {loadingResults ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center animate-spin">
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600">Đang tải kết quả khám bệnh...</p>
                </div>
              ) : examResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium mb-2">Chưa có kết quả khám bệnh</p>
                  <p className="text-gray-500 text-sm">Bác sĩ sẽ cập nhật kết quả sau khi khám xong</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {examResults.map((result) => (
                    <Card
                      key={result.id}
                      className="border-2 border-blue-100 hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-4 sm:p-5">
                        <div className="space-y-3">
                          {/* Header với thông tin cơ bản */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-3 border-b-2 border-blue-50">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                <span className="truncate">{result.dichVu}</span>
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-700">
                                  <User className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                  <span className="truncate"><strong>Bác sĩ:</strong> {result.bacSi}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Building2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                  <span className="truncate"><strong>Khoa:</strong> {result.khoa}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                  <span className="truncate">
                                    <strong>Ngày khám:</strong>{' '}
                                    {new Date(result.ngayHen).toLocaleDateString('vi-VN', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                  <span><strong>Giờ khám:</strong> {result.gioHen}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex items-center gap-1 px-2.5 py-1 text-xs sm:text-sm flex-shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Đã khám
                            </Badge>
                          </div>

                          {/* Ghi chú của bác sĩ */}
                          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-3 sm:p-4 border-2 border-blue-100">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                              <div className="bg-blue-600 rounded-lg p-1.5">
                                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                              </div>
                              Kết quả khám bệnh
                            </h4>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-200">
                              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {result.ghiChuBacSi}
                              </p>
                            </div>
                          </div>

                          {/* Mô tả triệu chứng ban đầu (nếu có) */}
                          {result.moTa && (
                            <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
                              <h4 className="text-xs sm:text-sm font-semibold text-amber-800 mb-1.5 flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Triệu chứng ban đầu
                              </h4>
                              <p className="text-xs sm:text-sm text-amber-700">{result.moTa}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>

          </Card>
        </div>
      )}

      {/* Modal Tư vấn trực tuyến */}
      {showConsultationModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowConsultationModal(false)}
        >
          <Card
            className="w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border-0 animate-in zoom-in-95 duration-200 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b border-boder rounded-t-xl bg-gradient-to-r from-teal-50 to-blue-50 sticky top-0 z-10 flex-shrink-0 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg p-2">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  Tư vấn trực tuyến với AI
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConsultationModal(false)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                Đặt câu hỏi về sức khỏe và nhận tư vấn từ AI chatbot
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col hide-scrollbar">
              {/* Form đặt câu hỏi */}
              <div className="mb-6 space-y-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 border-2 border-teal-100">
                <div className="space-y-2">
                  <Label htmlFor="consultation-khoa" className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    Chọn khoa (tùy chọn)
                  </Label>
                  <select
                    id="consultation-khoa"
                    value={consultationForm.khoa}
                    onChange={(e) => setConsultationForm({ ...consultationForm, khoa: e.target.value, bacSi: '' })}
                    className="flex h-10 w-full rounded-md border border-teal-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">-- Chọn khoa (tùy chọn) --</option>
                    {khoaList.map((khoa) => (
                      <option key={khoa._id} value={khoa._id}>
                        {khoa.tenKhoa}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultation-question" className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    Câu hỏi của bạn <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="consultation-question"
                    value={consultationForm.cauHoi}
                    onChange={(e) => setConsultationForm({ ...consultationForm, cauHoi: e.target.value })}
                    rows={4}
                    placeholder="Ví dụ: Tôi bị đau đầu thường xuyên, có cách nào để giảm đau không?"
                    className="flex w-full rounded-md border border-teal-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    disabled={sendingQuestion}
                  />
                </div>

                <Button
                  onClick={handleSendQuestion}
                  disabled={sendingQuestion || !consultationForm.cauHoi.trim()}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-md"
                >
                  {sendingQuestion ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Gửi câu hỏi
                    </>
                  )}
                </Button>
              </div>

              {/* Lịch sử tư vấn */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-teal-600" />
                  Lịch sử tư vấn
                </h3>

                {loadingConsultation ? (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-teal-600 animate-spin" />
                    <p className="text-gray-600 text-sm">Đang tải lịch sử...</p>
                  </div>
                ) : consultationHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 font-medium mb-1">Chưa có lịch sử tư vấn</p>
                    <p className="text-gray-500 text-sm">Hãy đặt câu hỏi để bắt đầu tư vấn!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto hide-scrollbar">
                    {consultationHistory.map((item) => (
                      <div key={item._id} className="space-y-3">
                        {/* Câu hỏi */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <p className="text-sm font-medium text-gray-800 mb-1">Bạn hỏi:</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.cauHoi}</p>
                            {item.Khoa && (
                              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                Khoa: {item.Khoa.tenKhoa}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(item.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>

                        {/* Câu trả lời */}
                        {item.traLoi && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-3 border-2 border-teal-200">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-800">AI trả lời:</p>
                                <Badge className="bg-teal-100 text-teal-700 border-teal-200 text-xs">
                                  {item.loaiTraLoi === 'AI' ? 'AI' : 'Bác sĩ'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{item.traLoi}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(item.updatedAt).toLocaleString('vi-VN')}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Đang chờ trả lời */}
                        {!item.traLoi && item.trangThai === 'Chờ trả lời' && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Activity className="w-4 h-4 text-gray-400 animate-spin" />
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-sm text-gray-500 italic">AI đang xử lý câu hỏi của bạn...</p>
                            </div>
                          </div>
                        )}

                        <Separator className="my-4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>

          </Card>
        </div>
      )}

      {/* Modal xem chi tiết lịch hẹn */}
      {showAppointmentDetailModal && selectedAppointment && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeAppointmentDetail}
        >
          <Card
            className="w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border-0 animate-in zoom-in-95 duration-200 p-0 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-2 bg-gradient-to-r from-blue-600 to-teal-600"></div>
            <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50 flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                    Chi tiết lịch hẹn
                  </CardTitle>

                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeAppointmentDetail}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 flex-1 overflow-y-auto hide-scrollbar">
              {(() => {
                const statusConfig = getStatusConfig(selectedAppointment.trangThai);
                const StatusIcon = statusConfig?.icon;
                return (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Badge
                        variant={statusConfig.variant}
                        className={`${statusConfig.className} flex items-center gap-1`}
                      >
                        {StatusIcon ? <StatusIcon className="w-3 h-3" /> : null}
                        {selectedAppointment.trangThai}
                      </Badge>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-blue-100 bg-white">
                      <p className="text-sm text-gray-600 mb-1">Dịch vụ</p>
                      <p className="text-lg font-semibold text-blue-700">
                        {selectedAppointment.dichVu}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50">
                        <p className="text-sm text-gray-600 mb-1">Khoa</p>
                        <p className="font-semibold text-gray-800">{selectedAppointment.khoa}</p>
                      </div>
                      <div className="p-4 rounded-xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50">
                        <p className="text-sm text-gray-600 mb-1">Bác sĩ</p>
                        <p className="font-semibold text-gray-800">{selectedAppointment.bacSi}</p>
                      </div>
                      <div className="p-4 rounded-xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50">
                        <p className="text-sm text-gray-600 mb-1">Ngày khám</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(selectedAppointment.ngayHen).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50">
                        <p className="text-sm text-gray-600 mb-1">Giờ khám</p>
                        <p className="font-semibold text-gray-800 text-lg">
                          {selectedAppointment.gioHen}
                        </p>
                      </div>
                    </div>

                    {selectedAppointment.ghiChuBacSi && selectedAppointment.ghiChuBacSi.trim() !== '' && (
                      <div className="p-4 rounded-xl border-2 border-emerald-100 bg-emerald-50">
                        <p className="text-sm text-emerald-700 font-semibold mb-2">
                          Ghi chú của bác sĩ
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedAppointment.ghiChuBacSi}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>

            <CardFooter className="p-4 border-t border-blue-100 flex gap-2 justify-end flex-shrink-0">
              <Button variant="outline" className="border-blue-200" onClick={closeAppointmentDetail}>
                Đóng
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md"
                onClick={() => navigate('/dat-lich-kham')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Đặt lịch mới
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </BackgroundUser>
  );
};

export default UserPage;
