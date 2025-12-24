import BackgroundUser from '@/components/ui/BackgroundUser'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  X,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { lichLamViecService } from '@/services/lichLamViecService'
import { lichHenService } from '@/services/lichHenService'
import { khoaService } from '@/services/khoaService'

const LaySoThuTu = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingCa, setLoadingCa] = useState(false)
  const [caList, setCaList] = useState([])
  const [bookingSuccess, setBookingSuccess] = useState(null) // {soThuTu, appointmentData}
  const [defaultKhoaId, setDefaultKhoaId] = useState('Khoa Khám bệnh')

  const [formData, setFormData] = useState({
    ngayHen: '',
    caLamViec: '',
    moTa: ''
  })

  // Load danh sách ca làm việc (chỉ Sáng và Chiều)
  useEffect(() => {
    const loadCaList = async () => {
      try {
        setLoadingCa(true)
        const response = await lichLamViecService.getAllCaLamViec()

        if (response.data && Array.isArray(response.data)) {
          // Lọc chỉ lấy ca Sáng và Chiều, sắp xếp theo thứ tự
          const filteredCa = response.data
            .filter(ca => {
              const caLam = ca.caLam || ''
              return caLam.toLowerCase() === 'sang' || caLam.toLowerCase() === 'chieu'
            })
            .sort((a, b) => {
              const order = { 'Sang': 1, 'Chieu': 2 }
              const aCa = (a.caLam || '').toLowerCase()
              const bCa = (b.caLam || '').toLowerCase()
              return (order[aCa] || 99) - (order[bCa] || 99)
            })

          setCaList(filteredCa)
        } else {
          setCaList([])
        }
      } catch (error) {
        console.error('Error loading ca list:', error)
        toast.error('Không thể tải danh sách ca khám')
        setCaList([])
      } finally {
        setLoadingCa(false)
      }
    }

    loadCaList()
  }, [])

  // Load khoa mặc định
  useEffect(() => {
    const loadDefaultKhoa = async () => {
      try {
        const response = await khoaService.getAllKhoa()

        // Xử lý response (có thể là array trực tiếp hoặc có data)
        let khoaList = []
        if (Array.isArray(response)) {
          khoaList = response
        } else if (response.data && Array.isArray(response.data)) {
          khoaList = response.data
        }

        // Set khoa đầu tiên làm mặc định
        if (khoaList.length > 0) {
          setDefaultKhoaId(khoaList[0]._id)
        }
      } catch (error) {
        console.error('Error loading default khoa:', error)
        // Không hiển thị error để không làm phiền user, chỉ log
      }
    }

    loadDefaultKhoa()
  }, [])

  // Hàm xử lý đặt lịch hẹn
  const handleDatLich = async () => {
    // Validation
    if (!formData.ngayHen) {
      toast.error('Vui lòng chọn ngày hẹn!')
      return
    }

    if (!formData.caLamViec) {
      toast.error('Vui lòng chọn ca khám!')
      return
    }

    try {
      setLoading(true)

      // Lấy userId từ localStorage
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        toast.error('Vui lòng đăng nhập!')
        navigate('/')
        return
      }

      const user = JSON.parse(userStr)
      const userId = user._id || user.id

      if (!userId) {
        toast.error('Không tìm thấy thông tin user!')
        return
      }

      // Chuẩn bị data để gửi API
      const appointmentData = {
        userId: userId,
        ngayHen: formData.ngayHen,
        caLamViecId: formData.caLamViec,
        khoaId: defaultKhoaId, // Thêm khoaId mặc định
        moTa: formData.moTa || ''
      }

      // Gọi API đặt lịch hẹn
      const response = await lichHenService.createSTT(appointmentData)

      if (response.data) {
        const soThuTu = response.soThuTu || response.data.soThuTu || 1

        // Hiển thị kết quả thành công
        setBookingSuccess({
          soThuTu: soThuTu,
          appointmentData: response.data,
          ngayHen: formData.ngayHen,
          caLamViec: caList.find(ca => ca._id === formData.caLamViec)
        })

        toast.success(`Đặt lịch hẹn thành công! Số thứ tự của bạn: ${soThuTu}`)
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt lịch hẹn!')
    } finally {
      setLoading(false)
    }
  }

  // Hàm reset form
  const handleReset = () => {
    setFormData({
      ngayHen: '',
      caLamViec: '',
      moTa: ''
    })
    setBookingSuccess(null)
  }

  // Format ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Lấy tên ca từ ID
  const getCaName = (caId) => {
    const ca = caList.find(c => c._id === caId)
    if (!ca) return ''
    const caLam = ca.caLam || ''
    const caNames = {
      'Sang': 'Ca Sáng',
      'Chieu': 'Ca Chiều',
    }
    return caNames[caLam] || caLam
  }

  return (
    <BackgroundUser>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}

          {/* Card chính */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Calendar className="w-6 h-6 text-white" />
                </div>

                <div className="flex flex-col">
                  <span className="text-2xl font-bold">
                    Thông tin đặt lịch hẹn
                  </span>
                  <span className="text-sm text-gray-500">
                    Lấy số thứ tự khám dịch vụ online
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {bookingSuccess ? (
                // Hiển thị kết quả thành công
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-8 text-center">
                    <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-green-700 mb-4">
                      Đặt lịch hẹn thành công!
                    </h3>

                    <div className="bg-white rounded-xl p-6 mt-6 shadow-md">
                      <p className="text-gray-600 mb-3 text-lg">Số thứ tự của bạn là:</p>
                      <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-8 py-4 mb-4">
                        <p className="text-6xl font-bold">{bookingSuccess.soThuTu}</p>
                      </div>

                      <div className="mt-6 space-y-2 text-left">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Ngày hẹn:</span>
                          <span>{formatDate(bookingSuccess.ngayHen)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Ca khám:</span>
                          <span>{getCaName(formData.caLamViec)}</span>
                          {bookingSuccess.caLamViec?.gioBatDau && bookingSuccess.caLamViec?.gioKetThuc && (
                            <span className="text-gray-500">
                              ({bookingSuccess.caLamViec.gioBatDau} - {bookingSuccess.caLamViec.gioKetThuc})
                            </span>
                          )}
                        </div>
                        {bookingSuccess.appointmentData?.LichLamViec?.BacSi?.tenBS && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-semibold">Bác sĩ:</span>
                            <span>{bookingSuccess.appointmentData.LichLamViec.BacSi.tenBS}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={handleReset}
                    >
                      Đặt lịch mới
                    </Button>
                    <Button
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      onClick={() => navigate('/userpage')}
                    >
                      Về trang chủ
                    </Button>
                  </div>
                </div>
              ) : (
                // Form đặt lịch
                <div className="space-y-6">
                  {/* Ngày hẹn */}
                  <div>
                    <Label htmlFor="ngayHen" className="text-base font-semibold mb-2 block">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Ngày hẹn *
                    </Label>
                    <Input
                      id="ngayHen"
                      type="date"
                      value={formData.ngayHen}
                      onChange={(e) => setFormData(prev => ({ ...prev, ngayHen: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  {/* Ca khám */}
                  <div>
                    <Label htmlFor="caLamViec" className="text-base font-semibold mb-2 block">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Ca khám *
                    </Label>
                    {loadingCa ? (
                      <div className="flex items-center justify-center h-12 border border-gray-300 rounded-md">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : caList.length > 0 ? (
                      <select
                        id="caLamViec"
                        value={formData.caLamViec}
                        onChange={(e) => setFormData(prev => ({ ...prev, caLamViec: e.target.value }))}
                        className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        required
                      >
                        <option value="">-- Chọn ca khám --</option>
                        {caList.map(ca => (
                          <option key={ca._id} value={ca._id}>
                            {ca.caLam === 'Sang' ? 'Ca Sáng' : ca.caLam === 'Chieu' ? 'Ca Chiều' : ca.caLam}
                            {ca.gioBatDau && ca.gioKetThuc && ` (${ca.gioBatDau} - ${ca.gioKetThuc})`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-red-500">Không có ca khám khả dụng</p>
                    )}
                  </div>

                  {/* Mô tả */}
                  <div>
                    <Label htmlFor="moTa" className="text-base font-semibold mb-2 block">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Mô tả triệu chứng
                    </Label>
                    <textarea
                      id="moTa"
                      value={formData.moTa}
                      onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                      className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
                      placeholder="Mô tả triệu chứng, tình trạng sức khỏe của bạn (tùy chọn)..."
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 text-base"
                      onClick={() => navigate('/userpage')}
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Thoát
                    </Button>
                    <Button
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base"
                      onClick={handleDatLich}
                      disabled={!formData.ngayHen || !formData.caLamViec || loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Đặt lịch hẹn
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundUser>
  )
}

export default LaySoThuTu