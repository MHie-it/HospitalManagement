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
  CreditCard,
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
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';

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

  const [upcomingAppointments] = useState([
    {
      id: 1,
      ngayHen: '2024-12-20',
      gioHen: '09:00',
      bacSi: 'BS. Nguyễn Văn B',
      khoa: 'Khoa Nội tổng quát',
      dichVu: 'Khám tổng quát',
      trangThai: 'Đã xác nhận'
    },
    {
      id: 2,
      ngayHen: '2024-12-25',
      gioHen: '14:30',
      bacSi: 'BS. Trần Thị C',
      khoa: 'Khoa Dinh dưỡng',
      dichVu: 'Tư vấn dinh dưỡng',
      trangThai: 'Chưa xác nhận'
    }
  ]);

  const [appointmentHistory] = useState([
    {
      id: 1,
      ngayHen: '2024-11-15',
      bacSi: 'BS. Lê Văn D',
      khoa: 'Khoa Tim mạch',
      dichVu: 'Khám tim mạch',
      trangThai: 'Đã khám'
    },
    {
      id: 2,
      ngayHen: '2024-10-20',
      bacSi: 'BS. Phạm Thị E',
      khoa: 'Khoa Xét nghiệm',
      dichVu: 'Xét nghiệm máu',
      trangThai: 'Đã khám'
    }
  ]);

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

  // Load user info khi component mount
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
      } catch (error) {
        console.error('Error loading user info:', error);
        toast.error(error.message || 'Không thể tải thông tin người dùng!');
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
        
        // Cập nhật lại user trong localStorage nếu cần
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          localStorage.setItem('user', JSON.stringify(user));
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
  const handleServiceClick = (serviceId) => {
    if (serviceId === 1) {
      // Đặt lịch khám
      navigate('/dat-lich-kham');
    } else {
      toast.info(`Chức năng ${serviceId} đang được phát triển`);
    }
  };

  const services = [
    { id: 1, name: 'Đặt lịch khám', icon: Calendar, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { id: 2, name: 'Tư vấn trực tuyến', icon: MessageSquare, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50', textColor: 'text-teal-600' },
    { id: 3, name: 'Xem kết quả', icon: FileText, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50', textColor: 'text-cyan-600' },
    { id: 4, name: 'Thanh toán', icon: CreditCard, color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
  ];

  const getStatusConfig = (status) => {
    switch(status) {
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
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 shadow-sm border-b border-blue-100">
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
        <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="group cursor-pointer border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  onClick={() => handleServiceClick(service.id)}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{service.name}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* PHẦN GIỚI THIỆU BỆNH VIỆN - Thêm sau phần Quick Services (sau dòng 299) */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 rounded-3xl shadow-2xl overflow-hidden relative">
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
                className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  pkg.popular 
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
                    onClick={() => handleBookPackage(pkg.id)}
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
                <Card className="lg:col-span-1 shadow-xl border-2 border-blue-100 overflow-hidden">
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
                    <form className="space-y-5" onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="hoTen" className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Họ và tên
                          </Label>
                          <Input
                            id="hoTen"
                            value={userInfo.hoTen}
                            onChange={(e) => setUserInfo({...userInfo, hoTen: e.target.value})}
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
                            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
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
                            onChange={(e) => setUserInfo({...userInfo, SDT: e.target.value})}
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
                            onChange={(e) => setUserInfo({...userInfo, ngaySinh: e.target.value})}
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
                            onChange={(e) => setUserInfo({...userInfo, gioiTinh: e.target.value})}
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
                          onChange={(e) => setUserInfo({...userInfo, diaChi: e.target.value})}
                          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex gap-3 pt-4 border-t-2 border-blue-50 bg-gradient-to-r from-blue-50/30 to-teal-50/30">
                    <Button 
                      type="submit"
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
                    <Card key={appointment.id} className="group hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 overflow-hidden">
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
                        <Button variant="outline" size="sm" className="flex-1 border-blue-200 hover:bg-blue-50">
                          Chi tiết
                        </Button>
                        {appointment.trangThai === 'Chưa xác nhận' && (
                          <Button size="sm" variant="destructive" className="flex-1">
                            <XCircle className="w-4 h-4 mr-1" />
                            Hủy lịch
                          </Button>
                        )}
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
                    <Card key={appointment.id} className="hover:shadow-xl transition-all duration-300 border-2 border-blue-100 overflow-hidden">
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
                            <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
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
    </BackgroundUser>
  );
};

export default UserPage;
