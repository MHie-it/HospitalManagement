import Backgound from '@/components/ui/Backgound'
import DoctorHeader from '@/components/ui/DoctorHeader'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  Stethoscope,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  CalendarClock,
  ArrowRight
} from 'lucide-react'
import { doctorService } from '@/services/doctorService'
import { userService } from '@/services/userService'

const DoctorPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [statistics, setStatistics] = useState({
    today: 0,
    upcoming: 0,
    completed: 0,
    pending: 0
  })

  useEffect(() => {
    const loadData = async () => {
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

        // Load thông tin bác sĩ
        const doctorResponse = await doctorService.getDoctorID(doctorId)
        if (doctorResponse.data) {
          setDoctorInfo(doctorResponse.data)
        }

        // Load lịch hẹn
        const appointmentsResponse = await userService.getAppointmentsByDoctor(doctorId)
        if (appointmentsResponse.data && Array.isArray(appointmentsResponse.data)) {
          const transformedData = appointmentsResponse.data.map(lh => {
            const ngayHen = new Date(lh.ngayHen)
            let status = 'pending'
            if (lh.trangThai === 'Đã xác nhận') status = 'confirmed'
            else if (lh.trangThai === 'Đã khám') status = 'completed'
            else if (lh.trangThai === 'Đã hủy') status = 'cancelled'

            return {
              id: lh._id,
              patientName: lh.NguoiDung?.hoTen || 'N/A',
              appointmentDate: ngayHen,
              appointmentTime: ngayHen.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              status: status,
              reason: lh.DichVu?.map(dv => dv.tenDV).join(', ') || lh.moTa || 'Khám bệnh'
            }
          })
          setAppointments(transformedData)

          // Tính toán thống kê
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const todayEnd = new Date(today)
          todayEnd.setHours(23, 59, 59, 999)

          const stats = {
            today: 0,
            upcoming: 0,
            completed: 0,
            pending: 0
          }

          transformedData.forEach(apt => {
            const aptDate = new Date(apt.appointmentDate)
            aptDate.setHours(0, 0, 0, 0)

            if (apt.status === 'completed') {
              stats.completed++
            } else if (apt.status === 'pending') {
              stats.pending++
            } else if (apt.status === 'confirmed') {
              if (aptDate.getTime() === today.getTime()) {
                stats.today++
              } else if (aptDate > today) {
                stats.upcoming++
              }
            }
          })

          setStatistics(stats)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        const errorMessage = error.response?.data?.message || error.message || 'Không thể tải dữ liệu!'
        console.error('Error details:', {
          message: errorMessage,
          response: error.response,
          request: error.request
        })
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate])

  // Lấy lịch hẹn sắp tới (5 lịch gần nhất)
  const upcomingAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(apt.appointmentDate)
      return aptDate >= new Date() && (apt.status === 'pending' || apt.status === 'confirmed')
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 5)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã khám'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'pending':
        return 'Chờ xác nhận'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <Backgound>
      <DoctorHeader />
      <div className="flex-1 h-full overflow-auto hide-scrollbar">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chào mừng, {doctorInfo?.tenBS || 'Bác sĩ'}!
              </h1>
              <p className="text-gray-600">Đây là tổng quan về lịch làm việc của bạn</p>
            </div>

            {/* Doctor Info Card */}
            {doctorInfo && (
              <Card className="shadow-lg border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {doctorInfo.tenBS?.charAt(0) || 'BS'}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{doctorInfo.tenBS}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">{doctorInfo.Khoa?.tenKhoa || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{doctorInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{doctorInfo.SDT}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg border-2 border-blue-100 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Lịch hẹn hôm nay</p>
                      <p className="text-3xl font-bold text-blue-600">{statistics.today}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-green-100 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Sắp tới</p>
                      <p className="text-3xl font-bold text-green-600">{statistics.upcoming}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CalendarClock className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-yellow-100 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Chờ xác nhận</p>
                      <p className="text-3xl font-bold text-yellow-600">{statistics.pending}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-purple-100 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Đã hoàn thành</p>
                      <p className="text-3xl font-bold text-purple-600">{statistics.completed}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card className="shadow-lg border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 border-b-2 border-blue-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CalendarCheck className="w-6 h-6 text-blue-600" />
                    Lịch hẹn sắp tới
                  </CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/lichhenkham')}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">Không có lịch hẹn sắp tới</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-teal-50/50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.appointmentTime}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{appointment.reason}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(appointment.status)} border`}>
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Backgound>
  )
}

export default DoctorPage