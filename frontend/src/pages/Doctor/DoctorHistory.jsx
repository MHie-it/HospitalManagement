import Backgound from '@/components/ui/Backgound'
import DoctorHeader from '@/components/ui/DoctorHeader'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, Clock, User, Phone, Mail, MapPin, Eye, X, CheckCircle2, History, Stethoscope, Building2, FileText } from 'lucide-react'
import { userService } from '@/services/userService'

const DoctorHistory = () => {
  const navigate = useNavigate()
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true)
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          toast.error('Vui lòng đăng nhập lại!')
          navigate('/')
          return
        }

        const user = JSON.parse(userStr)
        let doctorId = user.BacSi || user.bacSi

        if (!doctorId && user.profile && user.profile._id) {
          doctorId = user.profile._id
        }

        if (!doctorId) {
          toast.error('Không tìm thấy thông tin bác sĩ!')
          return
        }

        const response = await userService.getAppointmentsByDoctor(doctorId)
        
        if (response.data && Array.isArray(response.data)) {
          // Chỉ lấy các lịch hẹn đã hoàn thành (trangThai === 'Đã khám')
          const completedAppointments = response.data
            .filter(lh => lh.trangThai === 'Đã khám')
            .map(lh => {
              const ngayHen = new Date(lh.ngayHen)
              const age = lh.NguoiDung?.ngaySinh 
                ? Math.floor((new Date() - new Date(lh.NguoiDung.ngaySinh)) / (365.25 * 24 * 60 * 60 * 1000))
                : 0

              return {
                id: lh._id,
                patientName: lh.NguoiDung?.hoTen || 'N/A',
                patientPhone: lh.NguoiDung?.SDT || 'N/A',
                patientEmail: lh.NguoiDung?.email || 'N/A',
                appointmentDate: ngayHen.toISOString().split('T')[0],
                appointmentTime: ngayHen.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                status: 'completed',
                reason: lh.DichVu?.map(dv => dv.tenDV).join(', ') || lh.moTa || 'Khám bệnh',
                address: lh.NguoiDung?.diaChi || 'N/A',
                notes: lh.moTa || '',
                age: age,
                gender: lh.NguoiDung?.gioiTinh || 'N/A',
                bacSi: lh.LichLamViec?.BacSi?.tenBS || 'N/A',
                khoa: lh.LichLamViec?.BacSi?.Khoa?.tenKhoa || 'N/A',
                createdAt: lh.createdAt
              }
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp mới nhất trước

          setAppointments(completedAppointments)
        }
      } catch (error) {
        console.error('Error loading appointments:', error)
        toast.error(error.response?.data?.message || error.message || 'Không thể tải danh sách lịch sử!')
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [navigate])

  const filteredAppointments = appointments.filter(apt => {
    const searchLower = searchTerm.toLowerCase()
    return (
      apt.patientName.toLowerCase().includes(searchLower) ||
      apt.patientPhone.includes(searchTerm) ||
      apt.patientEmail.toLowerCase().includes(searchLower) ||
      apt.reason.toLowerCase().includes(searchLower)
    )
  })

  const stats = {
    total: appointments.length,
    thisMonth: appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate)
      const now = new Date()
      return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()
    }).length,
    thisWeek: appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return aptDate >= weekAgo
    }).length
  }

  return (
    <Backgound>
      <DoctorHeader />
      <div className="flex-1 h-full overflow-auto hide-scrollbar">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử khám bệnh</h1>
              <p className="text-gray-600">Xem lại các lần khám đã hoàn thành</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Tổng số lần khám</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <History className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Tuần này</p>
                      <p className="text-3xl font-bold text-green-600">{stats.thisWeek}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Tháng này</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.thisMonth}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="shadow-lg border-2 border-blue-100">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm theo tên, số điện thoại, email hoặc lý do khám..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <div className="space-y-4">
              {loading ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500 text-xl font-medium mb-2">Đang tải lịch sử...</p>
                  </CardContent>
                </Card>
              ) : filteredAppointments.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-12 text-center">
                    <History className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-xl font-medium mb-2">Không tìm thấy lịch sử khám bệnh</p>
                    <p className="text-gray-400 text-sm">
                      {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Chưa có lịch khám nào đã hoàn thành'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                              <User className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{appointment.patientName}</h3>
                              <Badge className="bg-green-100 text-green-700 border-green-300 mt-1">
                                Đã khám
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="bg-blue-50 rounded-lg p-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Ngày khám</p>
                                <p className="text-sm font-semibold">
                                  {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="bg-blue-50 rounded-lg p-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Giờ khám</p>
                                <p className="text-sm font-semibold">{appointment.appointmentTime}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="bg-blue-50 rounded-lg p-2">
                                <Phone className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Số điện thoại</p>
                                <p className="text-sm font-semibold">{appointment.patientPhone}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="bg-blue-50 rounded-lg p-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Lý do khám</p>
                                <p className="text-sm font-semibold">{appointment.reason}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAppointment(appointment)
                          }}
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

      {/* Modal Chi tiết */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedAppointment(null)}
        >
          <Card
            className="w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl border-0 animate-in zoom-in-95 duration-200 hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b-2 border-green-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-6 h-6 text-green-600" />
                  Chi tiết lịch khám
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAppointment(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Thông tin bệnh nhân */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-5">
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
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.patientPhone}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.patientEmail}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Tuổi</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.age} tuổi</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Giới tính</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.gender}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.address}</p>
                  </div>
                </div>
              </div>

              {/* Thông tin lịch khám */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="bg-purple-600 rounded-lg p-2">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Thông tin lịch khám
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Ngày khám</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Giờ khám</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.appointmentTime}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Bác sĩ</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.bacSi}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Khoa</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.khoa}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Lý do khám</p>
                    <p className="text-base font-semibold text-gray-900">{selectedAppointment.reason}</p>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedAppointment.notes && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <div className="bg-yellow-600 rounded-lg p-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    Ghi chú
                  </h3>
                  <p className="text-base text-gray-700 bg-white rounded-lg p-4">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setSelectedAppointment(null)} variant="outline">
                  Đóng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Backgound>
  )
}

export default DoctorHistory

