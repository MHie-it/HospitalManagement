import React, { useState } from 'react'
import Backgound from '@/components/ui/Backgound'
import DoctorHeader from '@/components/ui/DoctorHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, Clock, User, Phone, Mail, MapPin, Eye, X, CheckCircle2, AlertCircle, CalendarCheck, XCircle } from 'lucide-react'

const LichHen = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Dữ liệu cứng - Danh sách lịch hẹn
  const appointments = [
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      patientPhone: '0901234567',
      patientEmail: 'nguyenvana@email.com',
      appointmentDate: '2024-12-20',
      appointmentTime: '09:00',
      status: 'pending',
      reason: 'Khám tổng quát',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      notes: 'Bệnh nhân có tiền sử dị ứng thuốc',
      age: 35,
      gender: 'Nam'
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      patientPhone: '0912345678',
      patientEmail: 'tranthib@email.com',
      appointmentDate: '2024-12-20',
      appointmentTime: '10:30',
      status: 'confirmed',
      reason: 'Tái khám sau phẫu thuật',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      notes: 'Cần kiểm tra vết thương',
      age: 28,
      gender: 'Nữ'
    },
    {
      id: 3,
      patientName: 'Lê Văn C',
      patientPhone: '0923456789',
      patientEmail: 'levanc@email.com',
      appointmentDate: '2024-12-20',
      appointmentTime: '14:00',
      status: 'pending',
      reason: 'Khám chuyên khoa tim mạch',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      notes: '',
      age: 45,
      gender: 'Nam'
    },
    {
      id: 4,
      patientName: 'Phạm Thị D',
      patientPhone: '0934567890',
      patientEmail: 'phamthid@email.com',
      appointmentDate: '2024-12-21',
      appointmentTime: '08:30',
      status: 'confirmed',
      reason: 'Khám sức khỏe định kỳ',
      address: '321 Đường GHI, Quận 4, TP.HCM',
      notes: 'Bệnh nhân mới',
      age: 52,
      gender: 'Nữ'
    },
    {
      id: 5,
      patientName: 'Hoàng Văn E',
      patientPhone: '0945678901',
      patientEmail: 'hoangvane@email.com',
      appointmentDate: '2024-12-21',
      appointmentTime: '11:00',
      status: 'completed',
      reason: 'Khám tổng quát',
      address: '654 Đường JKL, Quận 5, TP.HCM',
      notes: 'Đã hoàn thành khám',
      age: 40,
      gender: 'Nam'
    },
    {
      id: 6,
      patientName: 'Võ Thị F',
      patientPhone: '0956789012',
      patientEmail: 'vothif@email.com',
      appointmentDate: '2024-12-21',
      appointmentTime: '15:30',
      status: 'cancelled',
      reason: 'Khám chuyên khoa',
      address: '987 Đường MNO, Quận 6, TP.HCM',
      notes: 'Bệnh nhân hủy lịch',
      age: 33,
      gender: 'Nữ'
    }
  ]

  // Lọc lịch hẹn
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone.includes(searchTerm) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  // Thống kê
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  }

  // Hàm lấy màu status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Hàm lấy text status
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  // Hàm lấy icon status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'confirmed':
        return <CalendarCheck className="w-4 h-4" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <Backgound>
      <div className="w-full h-full  m-0 p-0 overflow-hidden sticky ">
       
        
          <DoctorHeader />
        

        {/* Main Content */}
       <div className="flex-1 h-full overflow-auto hide-scrollbar">
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
             

              {/* Thống kê Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium mb-1">Tổng lịch hẹn</p>
                        <p className="text-3xl font-bold">{stats.total}</p>
                      </div>
                      <div className="bg-white/20 rounded-full p-3">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm font-medium mb-1">Chờ xác nhận</p>
                        <p className="text-3xl font-bold">{stats.pending}</p>
                      </div>
                      <div className="bg-white/20 rounded-full p-3">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm font-medium mb-1">Đã xác nhận</p>
                        <p className="text-3xl font-bold">{stats.confirmed}</p>
                      </div>
                      <div className="bg-white/20 rounded-full p-3">
                        <CalendarCheck className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium mb-1">Hoàn thành</p>
                        <p className="text-3xl font-bold">{stats.completed}</p>
                      </div>
                      <div className="bg-white/20 rounded-full p-3">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm font-medium mb-1">Đã hủy</p>
                        <p className="text-3xl font-bold">{stats.cancelled}</p>
                      </div>
                      <div className="bg-white/20 rounded-full p-3">
                        <XCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter Section */}
              <Card className="shadow-md border-0">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="Tìm kiếm theo tên, số điện thoại, lý do khám..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 text-base"
                      />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant={filterStatus === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('all')}
                        className="h-11"
                      >
                        Tất cả
                      </Button>
                      <Button
                        variant={filterStatus === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('pending')}
                        className="h-11"
                      >
                        Chờ xác nhận
                      </Button>
                      <Button
                        variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('confirmed')}
                        className="h-11"
                      >
                        Đã xác nhận
                      </Button>
                      <Button
                        variant={filterStatus === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('completed')}
                        className="h-11"
                      >
                        Hoàn thành
                      </Button>
                      <Button
                        variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterStatus('cancelled')}
                        className="h-11"
                      >
                        Đã hủy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appointments List */}
              <div className="space-y-4 hide-scrollbar">
                {filteredAppointments.length === 0 ? (
                  <Card className="border-2 border-dashed">
                    <CardContent className="p-12 text-center">
                      <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-xl font-medium mb-2">Không tìm thấy lịch hẹn nào</p>
                      <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <Card 
                      key={appointment.id}
                      className="hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-blue-600 group"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="flex-1 w-full">
                            {/* Header với tên và status */}
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                              <div className="bg-blue-100 rounded-full p-2">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {appointment.patientName}
                                </h3>
                                <p className="text-sm text-gray-500">{appointment.age} tuổi - {appointment.gender}</p>
                              </div>
                              <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1 px-3 py-1`}>
                                {getStatusIcon(appointment.status)}
                                {getStatusText(appointment.status)}
                              </Badge>
                            </div>

                            {/* Thông tin lịch hẹn */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="bg-blue-50 rounded-lg p-2">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Ngày hẹn</p>
                                  <p className="text-sm font-semibold">{appointment.appointmentDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="bg-purple-50 rounded-lg p-2">
                                  <Clock className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Giờ hẹn</p>
                                  <p className="text-sm font-semibold">{appointment.appointmentTime}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="bg-green-50 rounded-lg p-2">
                                  <Phone className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Số điện thoại</p>
                                  <p className="text-sm font-semibold">{appointment.patientPhone}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="bg-orange-50 rounded-lg p-2">
                                  <Calendar className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Lý do khám</p>
                                  <p className="text-sm font-semibold line-clamp-1">{appointment.reason}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Button Xem chi tiết */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAppointment(appointment)
                            }}
                            className="lg:ml-4 w-full lg:w-auto group-hover:bg-blue-50 group-hover:border-blue-300 group-hover:text-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Chi tiết lịch hẹn */}
        {selectedAppointment && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedAppointment(null)}
          >
            <Card 
              className="w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl border-0 animate-in zoom-in-95 duration-200 hide-scrollbar hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="bg-blue-600 rounded-lg p-2">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    Chi tiết lịch hẹn
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedAppointment(null)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Thông tin bệnh nhân */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="bg-blue-600 rounded-lg p-2">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Thông tin bệnh nhân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                      <p className="text-base font-semibold text-gray-900">{selectedAppointment.patientName}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Tuổi / Giới tính</p>
                      <p className="text-base font-semibold text-gray-900">{selectedAppointment.age} tuổi - {selectedAppointment.gender}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Số điện thoại
                      </p>
                      <p className="text-base font-semibold text-gray-900">{selectedAppointment.patientPhone}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </p>
                      <p className="text-base font-semibold text-gray-900 break-all">{selectedAppointment.patientEmail}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ
                      </p>
                      <p className="text-base font-semibold text-gray-900">{selectedAppointment.address}</p>
                    </div>
                  </div>
                </div>

                {/* Thông tin lịch hẹn */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="bg-purple-600 rounded-lg p-2">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    Thông tin lịch hẹn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Ngày hẹn</p>
                      <p className="text-base font-semibold text-gray-900">{selectedAppointment.appointmentDate}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Giờ hẹn</p>
                      <p className="text-base font-semibold text-gray-900">{selectedAppointment.appointmentTime}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Lý do khám</p>
                      <p className="text-base font-semibold text-gray-900">{selectedAppointment.reason}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                      <Badge className={`${getStatusColor(selectedAppointment.status)} flex items-center gap-1 w-fit px-3 py-1`}>
                        {getStatusIcon(selectedAppointment.status)}
                        {getStatusText(selectedAppointment.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Ghi chú */}
                {selectedAppointment.notes && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ghi chú</h3>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedAppointment.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 h-11"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    Đóng
                  </Button>
                  {selectedAppointment.status === 'pending' && (
                    <Button className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Xác nhận lịch hẹn
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Backgound>
  )
}

export default LichHen