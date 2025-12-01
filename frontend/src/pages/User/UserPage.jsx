import BackgroundUser from '@/components/ui/BackgroundUser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
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
  Building2
} from 'lucide-react';

const UserPage = () => {
  // Dữ liệu mẫu
  const [userInfo, setUserInfo] = useState({
    hoTen: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    SDT: '0123456789',
    ngaySinh: '1990-01-01',
    diaChi: '123 Đường ABC, Quận XYZ, TP.HCM',
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
                  Bệnh viện Hoàn Mỹ
                </h1>
                <p className="text-xs text-gray-600">Chăm sóc sức khỏe toàn diện</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100">
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

        {/* Main Tabs */}
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
                  <form className="space-y-5">
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
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                  <Button variant="outline" className="flex-1 border-blue-200 hover:bg-blue-50">
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
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md">
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
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 mt-4">
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
    </BackgroundUser>
  );
};

export default UserPage;
