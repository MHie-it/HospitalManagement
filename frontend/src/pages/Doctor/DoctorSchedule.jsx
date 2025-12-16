import Backgound from '@/components/ui/Backgound'
import DoctorHeader from '@/components/ui/DoctorHeader'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Save, CheckCircle, X, CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react'
import { lichLamViecService } from '@/services/lichLamViecService'

const DoctorSchedule = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [doctorId, setDoctorId] = useState(null)
  const [caLamViecList, setCaLamViecList] = useState([])
  const [allSchedules, setAllSchedules] = useState({}) // Lưu tất cả lịch làm việc đã load
  const [weekSchedule, setWeekSchedule] = useState({})
  const [weekOffset, setWeekOffset] = useState(0) // 0 = tuần này, 1 = tuần sau, -1 = tuần trước

  // Lấy các ngày trong tuần dựa trên weekOffset
  const getWeekDays = (offset = 0) => {
    const today = new Date()
    const day = today.getDay()
    // Tính thứ 2 của tuần hiện tại
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const currentMonday = new Date(today)
    currentMonday.setDate(today.getDate() - day + (day === 0 ? -6 : 1))
    
    // Tính thứ 2 của tuần cần lấy (dựa trên offset)
    const targetMonday = new Date(currentMonday)
    targetMonday.setDate(currentMonday.getDate() + (offset * 7))
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(targetMonday)
      date.setDate(targetMonday.getDate() + i)
      days.push(date)
    }
    return days
  }

  const weekDays = getWeekDays(weekOffset)
  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']

  // Lấy thông tin tuần
  const getWeekInfo = () => {
    const monday = weekDays[0]
    const sunday = weekDays[6]
    const today = new Date()
    const isCurrentWeek = weekOffset === 0
    const isPastWeek = weekOffset < 0
    const isFutureWeek = weekOffset > 0

    return {
      monday,
      sunday,
      isCurrentWeek,
      isPastWeek,
      isFutureWeek,
      weekLabel: isCurrentWeek 
        ? 'Tuần này' 
        : isPastWeek 
        ? `Tuần trước (${Math.abs(weekOffset)} tuần)` 
        : `Tuần sau (${weekOffset} tuần)`
    }
  }

  const weekInfo = getWeekInfo()

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
        let currentDoctorId = user.BacSi || user.bacSi

        if (!currentDoctorId && user.profile && user.profile._id) {
          currentDoctorId = user.profile._id
        }

        if (!currentDoctorId) {
          toast.error('Không tìm thấy thông tin bác sĩ!')
          return
        }

        setDoctorId(currentDoctorId)

        // Load danh sách ca làm việc
        const caLamViecResponse = await lichLamViecService.getAllCaLamViec()
        if (caLamViecResponse.data && Array.isArray(caLamViecResponse.data)) {
          // Sắp xếp ca theo thứ tự: Sáng, Chiều, Tối
          const sortedCaLamViec = caLamViecResponse.data.sort((a, b) => {
            const order = { 'Sang': 1, 'Chieu': 2, 'Toi': 3 }
            return (order[a.caLam] || 99) - (order[b.caLam] || 99)
          })
          setCaLamViecList(sortedCaLamViec)
          
          if (sortedCaLamViec.length === 0) {
            toast.warning('Chưa có ca làm việc trong hệ thống! Vui lòng tạo ca làm việc trước.')
          }
        }

        // Load tất cả lịch làm việc
        const scheduleResponse = await lichLamViecService.getLichLamViecByDoctorId(currentDoctorId)
        if (scheduleResponse.data && Array.isArray(scheduleResponse.data)) {
          const scheduleMap = {}
          scheduleResponse.data.forEach(schedule => {
            const date = new Date(schedule.ngayLam)
            const dateKey = date.toISOString().split('T')[0]
            scheduleMap[dateKey] = schedule.CaLamViec.map(ca => ca._id || ca)
          })
          setAllSchedules(scheduleMap)
          // Load lịch cho tuần hiện tại
          loadWeekSchedule(0, scheduleMap)
        } else {
          setAllSchedules({})
          loadWeekSchedule(0, {})
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error(error.response?.data?.message || error.message || 'Không thể tải dữ liệu!')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate])

  // Load lịch làm việc cho tuần cụ thể
  const loadWeekSchedule = (offset, allSchedulesData = null) => {
    const schedules = allSchedulesData || allSchedules
    const weekDaysForSchedule = getWeekDays(offset)
    const weekScheduleMap = {}
    
    weekDaysForSchedule.forEach(day => {
      const dateKey = day.toISOString().split('T')[0]
      weekScheduleMap[dateKey] = schedules[dateKey] || []
    })
    
    setWeekSchedule(weekScheduleMap)
  }

  // Chuyển đổi tuần
  const changeWeek = (direction) => {
    const newOffset = weekOffset + direction
    setWeekOffset(newOffset)
    loadWeekSchedule(newOffset)
  }

  // Về tuần hiện tại
  const goToCurrentWeek = () => {
    setWeekOffset(0)
    loadWeekSchedule(0)
  }

  useEffect(() => {
    // Reload lịch khi weekOffset thay đổi
    if (Object.keys(allSchedules).length > 0 || weekOffset !== 0) {
      loadWeekSchedule(weekOffset)
    }
  }, [weekOffset])

  const toggleCa = (dateKey, caId) => {
    setWeekSchedule(prev => {
      const daySchedule = prev[dateKey] || []
      const isSelected = daySchedule.includes(caId)
      
      return {
        ...prev,
        [dateKey]: isSelected
          ? daySchedule.filter(id => id !== caId)
          : [...daySchedule, caId]
      }
    })
  }

  const isCaSelected = (dateKey, caId) => {
    return (weekSchedule[dateKey] || []).includes(caId)
  }

  const handleSave = async () => {
    if (!doctorId) {
      toast.error('Không tìm thấy thông tin bác sĩ!')
      return
    }

    // Validation: Kiểm tra ràng buộc
    const validation = validateSchedule()
    if (!validation.valid) {
      toast.error(validation.message)
      return
    }

    try {
      setLoading(true)

      // Chuyển đổi weekSchedule thành format API
      const weekScheduleData = weekDays.map(day => {
        const dateKey = day.toISOString().split('T')[0]
        return {
          ngayLam: dateKey,
          caLamViecIds: weekSchedule[dateKey] || []
        }
      })

      const response = await lichLamViecService.createOrUpdateLichLamViec(doctorId, weekScheduleData)
      
      if (response.data) {
        toast.success(response.message || 'Lưu lịch làm việc thành công!')
        // Cập nhật allSchedules với dữ liệu mới
        const updatedSchedules = { ...allSchedules }
        response.data.forEach(schedule => {
          const date = new Date(schedule.ngayLam)
          const dateKey = date.toISOString().split('T')[0]
          updatedSchedules[dateKey] = schedule.CaLamViec.map(ca => ca._id || ca)
        })
        setAllSchedules(updatedSchedules)
        // Reload lịch cho tuần hiện tại
        loadWeekSchedule(weekOffset, updatedSchedules)
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      toast.error(error.response?.data?.message || error.message || 'Lưu lịch làm việc thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const getTotalShifts = () => {
    return Object.values(weekSchedule).reduce((total, shifts) => total + shifts.length, 0)
  }

  // Đếm số buổi tối
  const getToiShifts = () => {
    let count = 0
    Object.values(weekSchedule).forEach(shifts => {
      shifts.forEach(caId => {
        const ca = caLamViecList.find(c => c._id === caId)
        if (ca && ca.caLam === 'Toi') {
          count++
        }
      })
    })
    return count
  }

  // Kiểm tra validation
  const validateSchedule = () => {
    const totalShifts = getTotalShifts()
    const toiShifts = getToiShifts()

    if (totalShifts < 5) {
      return {
        valid: false,
        message: `Bạn phải chọn ít nhất 5 buổi làm việc trong tuần. Hiện tại: ${totalShifts}/5 buổi.`
      }
    }

    if (toiShifts < 2) {
      return {
        valid: false,
        message: `Bạn phải chọn ít nhất 2 buổi tối trong tuần. Hiện tại: ${toiShifts}/2 buổi tối.`
      }
    }

    return { valid: true }
  }

  return (
    <Backgound>
      <DoctorHeader />
      <div className="flex-1 h-full overflow-auto hide-scrollbar">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch làm việc</h1>
              <p className="text-gray-600">Chọn các ca làm việc (Sáng, Chiều, Tối) cho từng ngày trong tuần. Sau khi chọn xong, click "Lưu lịch làm việc" để lưu.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`shadow-lg border-2 ${getTotalShifts() >= 5 ? 'border-green-100' : 'border-yellow-100'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Tổng số buổi làm</p>
                      <p className={`text-3xl font-bold ${getTotalShifts() >= 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {getTotalShifts()}/5
                      </p>
                      {getTotalShifts() < 5 && (
                        <p className="text-xs text-yellow-600 mt-1">Cần thêm {5 - getTotalShifts()} buổi</p>
                      )}
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getTotalShifts() >= 5 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <CalendarClock className={`w-8 h-8 ${getTotalShifts() >= 5 ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`shadow-lg border-2 ${getToiShifts() >= 2 ? 'border-purple-100' : 'border-orange-100'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Buổi tối</p>
                      <p className={`text-3xl font-bold ${getToiShifts() >= 2 ? 'text-purple-600' : 'text-orange-600'}`}>
                        {getToiShifts()}/2
                      </p>
                      {getToiShifts() < 2 && (
                        <p className="text-xs text-orange-600 mt-1">Cần thêm {2 - getToiShifts()} buổi tối</p>
                      )}
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getToiShifts() >= 2 ? 'bg-purple-100' : 'bg-orange-100'}`}>
                      <Clock className={`w-8 h-8 ${getToiShifts() >= 2 ? 'text-purple-600' : 'text-orange-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Trạng thái</p>
                      <p className={`text-2xl font-bold ${validateSchedule().valid ? 'text-green-600' : 'text-red-600'}`}>
                        {validateSchedule().valid ? '✓ Đạt yêu cầu' : '✗ Chưa đạt'}
                      </p>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${validateSchedule().valid ? 'bg-green-100' : 'bg-red-100'}`}>
                      {validateSchedule().valid ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <X className="w-8 h-8 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Week Navigation */}
            <Card className="shadow-lg border-2 border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => changeWeek(-1)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Tuần trước
                  </Button>
                  
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {weekInfo.weekLabel}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {weekInfo.monday.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {weekInfo.sunday.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                    {weekOffset !== 0 && (
                      <Button
                        onClick={goToCurrentWeek}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Về tuần này
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => changeWeek(1)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Tuần sau
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Table */}
            <Card className="shadow-lg border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 border-b-2 border-blue-100">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Lịch làm việc {weekInfo.weekLabel.toLowerCase()}
                </CardTitle>
                <CardDescription className="mt-1">
                  Click vào các nút ca làm việc để chọn/bỏ chọn. Khung giờ của mỗi ca (Sáng, Chiều, Tối) được hiển thị rõ ràng ở header bảng.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading && !weekSchedule ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                ) : caLamViecList.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">Chưa có ca làm việc</p>
                    <p className="text-gray-400 text-sm">Vui lòng tạo ca làm việc (Sáng, Chiều, Tối) trong database trước</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">Ngày</th>
                          {caLamViecList.map((ca) => (
                            <th key={ca._id} className="p-4 text-center text-sm font-semibold text-gray-700">
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="font-bold text-base">{ca.caLam}</span>
                                </div>
                                <div className="bg-white rounded-lg px-3 py-1 border border-blue-200">
                                  <span className="text-xs font-medium text-blue-700">
                                    {ca.gioBatDau} - {ca.gioKetThuc}
                                  </span>
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {weekDays.map((day, dayIndex) => {
                          const dateKey = day.toISOString().split('T')[0]
                          const isToday = dateKey === new Date().toISOString().split('T')[0]
                          
                          return (
                            <tr key={dateKey} className={`border-b border-gray-100 hover:bg-gray-50 ${isToday ? 'bg-blue-50' : ''}`}>
                              <td className="p-4">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900">{dayNames[dayIndex]}</span>
                                  <span className="text-sm text-gray-500">
                                    {day.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                  </span>
                                  {isToday && (
                                    <Badge className="mt-1 w-fit bg-blue-600">Hôm nay</Badge>
                                  )}
                                  {/* Hiển thị các ca đã chọn */}
                                  {weekSchedule[dateKey] && weekSchedule[dateKey].length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {weekSchedule[dateKey].map((caId) => {
                                        const ca = caLamViecList.find(c => c._id === caId)
                                        if (!ca) return null
                                        return (
                                          <Badge 
                                            key={caId} 
                                            className="bg-blue-100 text-blue-700 border border-blue-300 text-xs font-medium"
                                            title={`${ca.gioBatDau} - ${ca.gioKetThuc}`}
                                          >
                                            {ca.caLam} ({ca.gioBatDau}-{ca.gioKetThuc})
                                          </Badge>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              </td>
                              {caLamViecList.map((ca) => {
                                const isSelected = isCaSelected(dateKey, ca._id)
                                
                                return (
                                  <td key={ca._id} className="p-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => toggleCa(dateKey, ca._id)}
                                      title={`${ca.caLam}: ${ca.gioBatDau} - ${ca.gioKetThuc}`}
                                      className={`w-full h-14 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                                        isSelected
                                          ? 'bg-blue-600 border-blue-600 text-white shadow-md hover:bg-blue-700'
                                          : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                                      }`}
                                    >
                                      {isSelected ? (
                                        <div className="flex flex-col items-center gap-1">
                                          <CheckCircle className="w-5 h-5" />
                                          <span className="text-xs font-medium">Đã chọn</span>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center gap-1">
                                          <Clock className="w-5 h-5" />
                                          <span className="text-xs">Chọn</span>
                                        </div>
                                      )}
                                    </button>
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Đang lưu...' : 'Lưu lịch làm việc'}
                  </Button>
                  <Button
                    onClick={() => loadWeekSchedule(weekOffset)}
                    variant="outline"
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Backgound>
  )
}

export default DoctorSchedule

