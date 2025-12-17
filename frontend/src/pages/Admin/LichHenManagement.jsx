import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  CalendarCheck, 
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { lichHenService } from '@/services/lichHenService'

const LichHenManagement = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPeriod, setFilterPeriod] = useState('all') // 'all', 'today', 'week', 'month'

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchAppointments()
  }, [])

  // Hàm lấy danh sách lịch hẹn
  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const response = await lichHenService.getAllLichHen()
      const appointmentsData = response.data || []
      
      // Map dữ liệu từ backend sang format hiển thị
      const mappedAppointments = appointmentsData.map(apt => ({
        _id: apt._id,
        id: apt._id,
        NguoiDung: apt.NguoiDung ? {
          hoTen: apt.NguoiDung.hoTen || '',
          soDienThoai: apt.NguoiDung.SDT || '',
          email: apt.NguoiDung.email || '',
          diaChi: apt.NguoiDung.diaChi || ''
        } : null,
        LichLamViec: apt.LichLamViec ? {
          BacSi: apt.LichLamViec.BacSi ? {
            tenBS: apt.LichLamViec.BacSi.tenBS || '',
            Khoa: apt.LichLamViec.BacSi.Khoa ? {
              tenKhoa: apt.LichLamViec.BacSi.Khoa.tenKhoa || ''
            } : null
          } : null
        } : null,
        ngayHen: apt.ngayHen ? new Date(apt.ngayHen) : new Date(),
        DichVu: apt.DichVu || [],
        moTa: apt.moTa || '',
        trangThai: apt.trangThai || 'Chưa xác nhận'
      }))

      setAppointments(mappedAppointments)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', error)
      toast.error(error.message || 'Không thể tải danh sách lịch hẹn')
    } finally {
      setLoading(false)
    }
  }

  // Hàm cập nhật trạng thái lịch hẹn
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await lichHenService.updateLichHen(appointmentId, { trangThai: newStatus })
      toast.success('Cập nhật trạng thái thành công!')
      await fetchAppointments()
      setSelectedAppointment(null)
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái!')
    }
  }

  // Lọc lịch hẹn
  const filteredAppointments = useMemo(() => {
    let filtered = appointments

    // Lọc theo thời gian
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (filterPeriod === 'today') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.ngayHen)
        aptDate.setHours(0, 0, 0, 0)
        return aptDate.getTime() === today.getTime()
      })
    } else if (filterPeriod === 'week') {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)

      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.ngayHen)
        return aptDate >= weekStart && aptDate <= weekEnd
      })
    } else if (filterPeriod === 'month') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.ngayHen)
        return aptDate >= monthStart && aptDate <= monthEnd
      })
    }

    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.NguoiDung?.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.NguoiDung?.soDienThoai?.includes(searchTerm) ||
        appointment.LichLamViec?.BacSi?.tenBS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.DichVu?.some(dv => dv.tenDV?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Lọc theo trạng thái
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.trangThai === filterStatus)
    }

    return filtered
  }, [appointments, searchTerm, filterStatus, filterPeriod])

  // Thống kê
  const stats = useMemo(() => {
    return {
      total: appointments.length,
      chuaXacNhan: appointments.filter(a => a.trangThai === 'Chưa xác nhận').length,
      daXacNhan: appointments.filter(a => a.trangThai === 'Đã xác nhận').length,
      daKham: appointments.filter(a => a.trangThai === 'Đã khám').length,
      daHuy: appointments.filter(a => a.trangThai === 'Đã hủy').length
    }
  }, [appointments])

  // Hàm lấy màu status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Chưa xác nhận':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Đã xác nhận':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Đã khám':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Đã hủy':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  // Hàm lấy icon status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Chưa xác nhận':
        return <AlertCircle className="w-4 h-4" />
      case 'Đã xác nhận':
        return <CalendarCheck className="w-4 h-4" />
      case 'Đã khám':
        return <CheckCircle2 className="w-4 h-4" />
      case 'Đã hủy':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  // Format ngày
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Backgound>
      <div className="flex w-full h-screen m-0 p-0 overflow-hidden">
        <div className="w-[250px] flex-shrink-0">
          <Dashboard />
        </div>
        <div className="flex-1 overflow-auto hide-scrollbar">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
              <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả lịch hẹn khám bệnh</p>
            </div>

            {/* Thống kê Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
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

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium mb-1">Chưa xác nhận</p>
                      <p className="text-3xl font-bold">{stats.chuaXacNhan}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium mb-1">Đã xác nhận</p>
                      <p className="text-3xl font-bold">{stats.daXacNhan}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium mb-1">Đã khám</p>
                      <p className="text-3xl font-bold">{stats.daKham}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium mb-1">Đã hủy</p>
                      <p className="text-3xl font-bold">{stats.daHuy}</p>
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
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Tìm kiếm theo tên, số điện thoại, bác sĩ, dịch vụ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>

                  {/* Filter Period */}
                  <div className="flex gap-2">
                    <Button
                      variant={filterPeriod === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPeriod('all')}
                      className="h-11"
                    >
                      Tất cả
                    </Button>
                    <Button
                      variant={filterPeriod === 'today' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPeriod('today')}
                      className="h-11"
                    >
                      Hôm nay
                    </Button>
                    <Button
                      variant={filterPeriod === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPeriod('week')}
                      className="h-11"
                    >
                      Tuần này
                    </Button>
                    <Button
                      variant={filterPeriod === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPeriod('month')}
                      className="h-11"
                    >
                      Tháng này
                    </Button>
                  </div>

                  {/* Filter Status */}
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
                      variant={filterStatus === 'Chưa xác nhận' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('Chưa xác nhận')}
                      className="h-11"
                    >
                      Chưa xác nhận
                    </Button>
                    {/* <Button
                      variant={filterStatus === 'Đã xác nhận' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('Đã xác nhận')}
                      className="h-11"
                    >
                      Đã xác nhận
                    </Button> */}
                    <Button
                      variant={filterStatus === 'Đã khám' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('Đã khám')}
                      className="h-11"
                    >
                      Đã khám
                    </Button>
                    {/* <Button
                      variant={filterStatus === 'Đã hủy' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('Đã hủy')}
                      className="h-11"
                    >
                      Đã hủy
                    </Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="shadow-md border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">STT</th>
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">Bệnh nhân</th>
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">Số điện thoại</th>
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">Ngày hẹn</th>
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">Giờ hẹn</th>
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">Bác sĩ</th>
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">Khoa</th>
                        {/* <th className="p-3 text-left font-semibold text-sm text-gray-700">Dịch vụ</th> */}
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">Trạng thái</th>
                        <th className="p-3 text-left font-semibold text-sm text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="10" className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            {/* <p className="text-gray-500 text-xl font-medium">Đang tải dữ liệu...</p> */}
                          </td>
                        </tr>
                      ) : filteredAppointments.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="p-12 text-center">
                            <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-xl font-medium mb-2">Không tìm thấy lịch hẹn nào</p>
                            <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAppointments.map((appointment, index) => (
                          <tr key={appointment._id || appointment.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-3 text-sm">{index + 1}</td>
                            <td className="p-3">
                              <div className="font-medium text-gray-900">{appointment.NguoiDung?.hoTen}</div>
                            </td>
                            <td className="p-3 text-sm text-gray-600">{appointment.NguoiDung?.soDienThoai}</td>
                            <td className="p-3 text-sm text-gray-600">{formatDate(appointment.ngayHen)}</td>
                            <td className="p-3 text-sm text-gray-600">{formatTime(appointment.ngayHen)}</td>
                            <td className="p-3 text-sm text-gray-600">{appointment.LichLamViec?.BacSi?.tenBS}</td>
                            <td className="p-3 text-sm text-gray-600">{appointment.LichLamViec?.BacSi?.Khoa?.tenKhoa}</td>
                            {/* <td className="p-3 text-sm text-gray-600">
                              {appointment.DichVu?.map(dv => dv.tenDV).join(', ') || 'Không có'}
                            </td> */}
                            <td className="p-3">
                              <Badge className={`${getStatusColor(appointment.trangThai)} flex items-center gap-1 w-fit`}>
                                {getStatusIcon(appointment.trangThai)}
                                {appointment.trangThai}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedAppointment(appointment)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Xem
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Chi tiết lịch hẹn */}
      {selectedAppointment && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <Card 
            className="relative w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl border-0 hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50  pt-0 pb-3 px-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl  font-bold text-gray-900 flex items-center gap-2">
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
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.NguoiDung?.hoTen || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Số điện thoại
                    </p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.NguoiDung?.soDienThoai || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </p>
                    <p className="text-base font-semibold text-gray-900 break-all">{selectedAppointment.NguoiDung?.email || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ
                    </p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.NguoiDung?.diaChi || 'N/A'}</p>
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
                    <p className="text-base font-semibold text-gray-900">{formatDateTime(selectedAppointment.ngayHen)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Giờ hẹn</p>
                    <p className="text-base font-semibold text-gray-900">{formatTime(selectedAppointment.ngayHen)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Bác sĩ</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.LichLamViec?.BacSi?.tenBS || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Khoa</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.LichLamViec?.BacSi?.Khoa?.tenKhoa || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Dịch vụ</p>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedAppointment.DichVu?.map(dv => dv.tenDV).join(', ') || 'Không có'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                    <Badge className={`${getStatusColor(selectedAppointment.trangThai)} flex items-center gap-1 w-fit px-3 py-1`}>
                      {getStatusIcon(selectedAppointment.trangThai)}
                      {selectedAppointment.trangThai}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedAppointment.moTa && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Ghi chú</h3>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedAppointment.moTa}</p>
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
                {selectedAppointment.trangThai === 'Chưa xác nhận' && (
                  <Button 
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => handleUpdateStatus(selectedAppointment._id || selectedAppointment.id, 'Đã xác nhận')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Xác nhận lịch hẹn
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Backgound>
  )
}

export default LichHenManagement