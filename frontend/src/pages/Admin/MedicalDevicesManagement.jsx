import React, { useState, useMemo, useEffect } from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit, Trash2, X, AlertTriangle, CheckCircle, Clock, XCircle, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { thietBiService } from '@/services/thietBiService'
import { khoaService } from '@/services/khoaService'

const MedicalDevicesManagement = () => {
  // State cho danh sách thiết bị
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)

  // State cho danh sách khoa
  const [khoaList, setKhoaList] = useState([])

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTinhTrang, setFilterTinhTrang] = useState('all')
  const [filterKhoa, setFilterKhoa] = useState('all')

  // State cho form thêm/sửa thiết bị
  const [showForm, setShowForm] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  const [formData, setFormData] = useState({
    tenThietBi: '',
    maThietBi: '',
    loaiThietBi: '',
    nhaSanXuat: '',
    ngayMua: '',
    ngayHetHanBaoHanh: '',
    ngayBaoDuongTiepTheo: '',
    tinhTrang: 'Hoạt động tốt',
    KhoaId: '',
    soLuong: '',
    moTa: ''
  })

  // Danh sách loại thiết bị
  const loaiThietBiList = [
    'Chẩn đoán hình ảnh',
    'Chẩn đoán',
    'Theo dõi bệnh nhân',
    'Hỗ trợ hô hấp',
    'Điều trị',
    'Phẫu thuật',
    'Khác'
  ]

  // Danh sách tình trạng
  const tinhTrangList = [
    'Hoạt động tốt',
    'Cần bảo dưỡng',
    'Sắp đến hạn bảo dưỡng',
    'Hết hạn bảo dưỡng',
    'Hỏng'
  ]

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchDevices()
    fetchKhoaList()
  }, [])

  // Hàm lấy danh sách thiết bị
  const fetchDevices = async () => {
    setLoading(true)
    try {
      const response = await thietBiService.getAllThietBi()
      const devicesData = response.data || []

      // Map dữ liệu từ backend sang format hiển thị
      const mappedDevices = devicesData.map(device => ({
        _id: device._id,
        id: device._id,
        tenThietBi: device.tenThietBi,
        maThietBi: device.maThietBi,
        loaiThietBi: device.loaiThietBi,
        nhaSanXuat: device.nhaSanXuat,
        ngayMua: device.ngayMua ? new Date(device.ngayMua).toISOString().split('T')[0] : '',
        ngayHetHanBaoHanh: device.ngayHetHanBaoHanh ? new Date(device.ngayHetHanBaoHanh).toISOString().split('T')[0] : '',
        ngayBaoDuongTiepTheo: device.ngayBaoDuongTiepTheo ? new Date(device.ngayBaoDuongTiepTheo).toISOString().split('T')[0] : '',
        tinhTrang: device.tinhTrang,
        khoa: device.Khoa?.tenKhoa || '',
        khoaId: device.Khoa?._id || device.Khoa || '',
        soLuong: device.soLuong,
        moTa: device.moTa || ''
      }))

      setDevices(mappedDevices)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thiết bị:', error)
      toast.error(error.message || 'Không thể tải danh sách thiết bị')
    } finally {
      setLoading(false)
    }
  }

  // Hàm lấy danh sách khoa
  const fetchKhoaList = async () => {
    try {
      const response = await khoaService.getAllKhoa()
      let khoaData = []
      if (Array.isArray(response)) {
        khoaData = response
      } else if (response.data && Array.isArray(response.data)) {
        khoaData = response.data
      }
      setKhoaList(khoaData)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khoa:', error)
      toast.error(error.message || 'Không thể tải danh sách khoa')
    }
  }

  // Tính toán các thiết bị cần cảnh báo
  const devicesNeedingAttention = useMemo(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today)
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    return devices.filter(device => {
      const baoDuongDate = new Date(device.ngayBaoDuongTiepTheo)
      const hetHanBaoHanh = new Date(device.ngayHetHanBaoHanh)

      return (
        device.tinhTrang === 'Hết hạn bảo dưỡng' ||
        device.tinhTrang === 'Hỏng' ||
        (baoDuongDate <= thirtyDaysFromNow && baoDuongDate >= today) ||
        hetHanBaoHanh < today
      )
    })
  }, [devices])

  // Lọc danh sách thiết bị
  const filteredDevices = devices.filter(device => {
    const matchSearch =
      device.tenThietBi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.maThietBi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.loaiThietBi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.nhaSanXuat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.khoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.tinhTrang.toLowerCase().includes(searchTerm.toLowerCase())

    const matchTinhTrang = filterTinhTrang === 'all' || device.tinhTrang === filterTinhTrang
    const matchKhoa = filterKhoa === 'all' || device.khoaId === filterKhoa

    return matchSearch && matchTinhTrang && matchKhoa
  })

  // Hàm mở form thêm mới
  const handleAddClick = () => {
    setEditingDevice(null)
    setFormData({
      tenThietBi: '',
      maThietBi: '',
      loaiThietBi: '',
      nhaSanXuat: '',
      ngayMua: '',
      ngayHetHanBaoHanh: '',
      ngayBaoDuongTiepTheo: '',
      tinhTrang: 'Hoạt động tốt',
      KhoaId: '',
      soLuong: '',
      moTa: ''
    })
    setShowForm(true)
  }

  // Hàm mở form sửa
  const handleEditClick = (device) => {
    setEditingDevice(device)
    setFormData({
      tenThietBi: device.tenThietBi,
      maThietBi: device.maThietBi,
      loaiThietBi: device.loaiThietBi,
      nhaSanXuat: device.nhaSanXuat,
      ngayMua: device.ngayMua,
      ngayHetHanBaoHanh: device.ngayHetHanBaoHanh,
      ngayBaoDuongTiepTheo: device.ngayBaoDuongTiepTheo,
      tinhTrang: device.tinhTrang,
      KhoaId: device.khoaId,
      soLuong: device.soLuong.toString(),
      moTa: device.moTa || ''
    })
    setShowForm(true)
  }

  // Hàm lưu thiết bị (thêm hoặc sửa)
  const handleSaveDevice = async () => {
    // Validation
    if (!formData.tenThietBi || !formData.maThietBi || !formData.loaiThietBi ||
      !formData.nhaSanXuat || !formData.ngayMua || !formData.ngayHetHanBaoHanh ||
      !formData.ngayBaoDuongTiepTheo || !formData.KhoaId || !formData.soLuong) {
      toast.error('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    // Kiểm tra số lượng
    const soLuong = parseInt(formData.soLuong)
    if (isNaN(soLuong) || soLuong <= 0) {
      toast.error('Số lượng phải là số nguyên dương!')
      return
    }

    try {
      const deviceData = {
        tenThietBi: formData.tenThietBi.trim(),
        maThietBi: formData.maThietBi.trim(),
        loaiThietBi: formData.loaiThietBi,
        nhaSanXuat: formData.nhaSanXuat.trim(),
        ngayMua: formData.ngayMua,
        ngayHetHanBaoHanh: formData.ngayHetHanBaoHanh,
        ngayBaoDuongTiepTheo: formData.ngayBaoDuongTiepTheo,
        tinhTrang: formData.tinhTrang,
        KhoaId: formData.KhoaId,
        soLuong: soLuong,
        moTa: formData.moTa.trim()
      }

      if (editingDevice) {
        // Sửa thiết bị
        await thietBiService.updateThietBi(editingDevice._id, deviceData)
        toast.success('Cập nhật thiết bị thành công!')
      } else {
        // Thêm thiết bị mới
        await thietBiService.createThietBi(deviceData)
        toast.success('Thêm thiết bị thành công!')
      }

      // Reload danh sách
      await fetchDevices()

      // Reset form và đóng form
      setFormData({
        tenThietBi: '',
        maThietBi: '',
        loaiThietBi: '',
        nhaSanXuat: '',
        ngayMua: '',
        ngayHetHanBaoHanh: '',
        ngayBaoDuongTiepTheo: '',
        tinhTrang: 'Hoạt động tốt',
        KhoaId: '',
        soLuong: '',
        moTa: ''
      })
      setShowForm(false)
      setEditingDevice(null)
    } catch (error) {
      console.error('Lỗi khi lưu thiết bị:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi lưu thiết bị!')
    }
  }

  // Hàm xóa thiết bị
  const handleDeleteDevice = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      return
    }

    try {
      const device = devices.find(d => d._id === id || d.id === id)
      await thietBiService.deleteThietBi(id)
      toast.success(`Đã xóa thiết bị "${device?.tenThietBi || ''}"`)

      // Reload danh sách
      await fetchDevices()
    } catch (error) {
      console.error('Lỗi khi xóa thiết bị:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi xóa thiết bị!')
    }
  }

  // Hàm lấy màu badge theo tình trạng
  const getStatusBadgeColor = (tinhTrang) => {
    switch (tinhTrang) {
      case 'Hoạt động tốt':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'Cần bảo dưỡng':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'Sắp đến hạn bảo dưỡng':
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case 'Hết hạn bảo dưỡng':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'Hỏng':
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200'
    }
  }

  // Hàm lấy icon theo tình trạng
  const getStatusIcon = (tinhTrang) => {
    switch (tinhTrang) {
      case 'Hoạt động tốt':
        return <CheckCircle className="w-4 h-4" />
      case 'Cần bảo dưỡng':
      case 'Sắp đến hạn bảo dưỡng':
        return <Clock className="w-4 h-4" />
      case 'Hết hạn bảo dưỡng':
      case 'Hỏng':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  // Tính số ngày còn lại đến bảo dưỡng
  const getDaysUntilMaintenance = (ngayBaoDuong) => {
    const today = new Date()
    const baoDuongDate = new Date(ngayBaoDuong)
    const diffTime = baoDuongDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Backgound>
      <div className="flex w-full h-screen m-0 p-0 overflow-hidden hide-scrollbar">
        {/* Sidebar */}
        <div className="w-[250px] flex-shrink-0">
          <Dashboard />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="p-6 h-full overflow-auto">
            {/* Card chính */}
            <Card className="h-full flex flex-col shadow-lg">
              {/* Header */}
              <CardHeader className=" border-b flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                      Quản lý thiết bị y tế
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Quản lý và theo dõi tất cả thiết bị y tế trong hệ thống
                    </p>
                  </div>
                  <Button
                    variant="gradient"
                    className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
                    onClick={handleAddClick}
                  >
                    <Plus className="w-5 h-5" />
                    Thêm thiết bị
                  </Button>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="p-6 flex-1 overflow-y-auto min-h-0 hide-scrollbar">
                {/* Loading state */}
                {/* {loading && (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
                  </div>
                )} */}

                {/* Thống kê */}
                {!loading && (
                  <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-5 py-4 rounded-xl border-2 border-blue-200 shadow-md">
                      <div className="text-sm text-blue-700 font-semibold mb-1">Tổng số thiết bị</div>
                      <div className="text-3xl font-bold text-blue-800">
                        {filteredDevices.length}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">thiết bị</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 px-5 py-4 rounded-xl border-2 border-green-200 shadow-md">
                      <div className="text-sm text-green-700 font-semibold mb-1">Hoạt động tốt</div>
                      <div className="text-3xl font-bold text-green-800">
                        {filteredDevices.filter(d => d.tinhTrang === 'Hoạt động tốt').length}
                      </div>
                      <div className="text-xs text-green-600 mt-1">thiết bị</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 px-5 py-4 rounded-xl border-2 border-red-200 shadow-md">
                      <div className="text-sm text-red-700 font-semibold mb-1">Cần chú ý</div>
                      <div className="text-3xl font-bold text-red-800">
                        {filteredDevices.filter(d =>
                          d.tinhTrang === 'Hết hạn bảo dưỡng' ||
                          d.tinhTrang === 'Hỏng' ||
                          d.tinhTrang === 'Cần bảo dưỡng'
                        ).length}
                      </div>
                      <div className="text-xs text-red-600 mt-1">thiết bị</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-5 py-4 rounded-xl border-2 border-purple-200 shadow-md">
                      <div className="text-sm text-purple-700 font-semibold mb-1">Tổng số lượng</div>
                      <div className="text-3xl font-bold text-purple-800">
                        {filteredDevices.reduce((sum, d) => sum + d.soLuong, 0)}
                      </div>
                      <div className="text-xs text-purple-600 mt-1">đơn vị</div>
                    </div>
                  </div>
                )}

                {/* Cảnh báo thiết bị cần chú ý */}
                {!loading && devicesNeedingAttention.length > 0 && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="font-bold text-lg text-red-800">
                        Cảnh báo: {devicesNeedingAttention.length} thiết bị cần chú ý
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {devicesNeedingAttention.map(device => {
                        const daysLeft = getDaysUntilMaintenance(device.ngayBaoDuongTiepTheo)
                        return (
                          <div key={device._id || device.id} className="bg-white p-4 rounded-lg border-2 border-red-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 mb-1 truncate">{device.tenThietBi}</p>
                                <p className="text-xs text-gray-500 truncate">{device.khoa}</p>
                              </div>
                              <div className="text-right ml-3 flex-shrink-0">
                                {device.tinhTrang === 'Hết hạn bảo dưỡng' || device.tinhTrang === 'Hỏng' ? (
                                  <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-red-600 rounded whitespace-nowrap">Đã quá hạn</span>
                                ) : daysLeft >= 0 ? (
                                  <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-orange-500 rounded whitespace-nowrap">
                                    Còn {daysLeft} ngày
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-1 text-xs font-bold text-white bg-red-600 rounded whitespace-nowrap">
                                    Quá {Math.abs(daysLeft)} ngày
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Thanh tìm kiếm và lọc */}
                {!loading && (
                  <>
                    <Card className="mb-6 border-2 border-gray-200 shadow-md">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Tìm kiếm */}
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              placeholder="Tìm kiếm theo tên, mã, loại, nhà sản xuất, khoa..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-12 h-12 text-base border-2 focus:border-blue-500"
                            />
                          </div>

                          {/* Bộ lọc */}
                          <div className="flex gap-4 items-end">
                            <div className="flex-1 min-w-0">
                              <label className="text-sm font-semibold mb-2 block text-gray-700 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Lọc theo tình trạng
                              </label>
                              <select
                                className="w-full h-11 rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={filterTinhTrang}
                                onChange={(e) => setFilterTinhTrang(e.target.value)}
                              >
                                <option value="all">Tất cả tình trạng</option>
                                {tinhTrangList.map(tinhTrang => (
                                  <option key={tinhTrang} value={tinhTrang}>{tinhTrang}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex-1 min-w-0">
                              <label className="text-sm font-semibold mb-2 block text-gray-700 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Lọc theo khoa
                              </label>
                              <select
                                className="w-full h-11 rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={filterKhoa}
                                onChange={(e) => setFilterKhoa(e.target.value)}
                              >
                                <option value="all">Tất cả khoa</option>
                                {khoaList.map(khoa => (
                                  <option key={khoa._id || khoa.id} value={khoa._id || khoa.id}>{khoa.tenKhoa}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bảng danh sách thiết bị */}                 
                    <Card className="border-2 border-gray-200 shadow-md">
                      <CardContent className="p-6">
                        {filteredDevices.length === 0 ? (
                          <div className="p-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-lg font-semibold text-gray-600">Không tìm thấy thiết bị nào</p>
                              <p className="text-sm text-gray-400">
                                {devices.length === 0
                                  ? 'Chưa có thiết bị nào trong hệ thống'
                                  : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                }
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDevices.map((device, index) => {
                              const daysLeft = getDaysUntilMaintenance(device.ngayBaoDuongTiepTheo)

                              return (
                                <Card
                                  key={device._id || device.id}
                                  className="border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-200 bg-white h-full flex flex-col"
                                >
                                  <CardContent className="p-5 flex flex-col flex-1">
                                    {/* Header với tên và trạng thái */}
                                    <div className="mb-4 pb-4 border-b-2 border-gray-100">
                                      <div className="flex items-start justify-between gap-2 mb-3">
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">
                                          {device.tenThietBi}
                                        </h3>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0 ${getStatusBadgeColor(device.tinhTrang)}`}>
                                          {getStatusIcon(device.tinhTrang)}
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded border border-gray-200 text-gray-700">
                                          {device.maThietBi}
                                        </span>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                                          SL: {device.soLuong}
                                        </span>
                                        {daysLeft >= 0 && daysLeft <= 30 && (
                                          <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${daysLeft <= 7 ? 'bg-red-100 text-red-700 border-red-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                            Còn {daysLeft} ngày
                                          </span>
                                        )}
                                        {daysLeft < 0 && (
                                          <span className="text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded border border-red-200">
                                            Quá {Math.abs(daysLeft)} ngày
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Thông tin đầy đủ */}
                                    <div className="space-y-3 mb-4 flex-1">
                                      {/* Loại thiết bị */}
                                      <div className="flex items-start gap-3">
                                        <div className="w-20 flex-shrink-0">
                                          <span className="text-xs font-semibold text-gray-500 uppercase">Loại:</span>
                                        </div>
                                        <div className="flex-1">
                                          <span className="text-sm text-gray-800 font-medium">{device.loaiThietBi}</span>
                                        </div>
                                      </div>

                                      {/* Nhà sản xuất */}
                                      <div className="flex items-start gap-3">
                                        <div className="w-20 flex-shrink-0">
                                          <span className="text-xs font-semibold text-gray-500 uppercase">Nhà SX:</span>
                                        </div>
                                        <div className="flex-1">
                                          <span className="text-sm text-gray-800 font-medium">{device.nhaSanXuat}</span>
                                        </div>
                                      </div>

                                      {/* Khoa */}
                                      <div className="flex items-start gap-3">
                                        <div className="w-20 flex-shrink-0">
                                          <span className="text-xs font-semibold text-gray-500 uppercase">Khoa:</span>
                                        </div>
                                        <div className="flex-1">
                                          <span className="text-sm text-gray-800 font-medium">{device.khoa}</span>
                                        </div>
                                      </div>

                                      {/* Ngày mua */}
                                      {device.ngayMua && (
                                        <div className="flex items-start gap-3">
                                          <div className="w-20 flex-shrink-0">
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Ngày mua:</span>
                                          </div>
                                          <div className="flex-1">
                                            <span className="text-sm text-gray-800">{device.ngayMua}</span>
                                          </div>
                                        </div>
                                      )}

                                      {/* Ngày hết hạn bảo hành */}
                                      {device.ngayHetHanBaoHanh && (
                                        <div className="flex items-start gap-3">
                                          <div className="w-20 flex-shrink-0">
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Bảo hành:</span>
                                          </div>
                                          <div className="flex-1">
                                            <span className={`text-sm ${new Date(device.ngayHetHanBaoHanh) < new Date()
                                                ? 'text-red-600 font-semibold'
                                                : 'text-gray-800'
                                              }`}>
                                              {device.ngayHetHanBaoHanh}
                                            </span>
                                            {new Date(device.ngayHetHanBaoHanh) < new Date() && (
                                              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                                Hết hạn
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      {/* Bảo dưỡng tiếp theo */}
                                      <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                                        <div className="w-20 flex-shrink-0">
                                          <span className="text-xs font-semibold text-gray-500 uppercase">Bảo dưỡng:</span>
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-sm text-gray-800 font-medium mb-1">
                                            {device.ngayBaoDuongTiepTheo}
                                          </div>
                                          {daysLeft >= 0 && daysLeft <= 30 && (
                                            <div className={`text-xs font-semibold px-2 py-1 rounded inline-block ${daysLeft <= 7 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                              Còn {daysLeft} ngày
                                            </div>
                                          )}
                                          {daysLeft < 0 && (
                                            <div className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded inline-block">
                                              Quá {Math.abs(daysLeft)} ngày
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Mô tả */}
                                      {device.moTa && (
                                        <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                                          <div className="w-20 flex-shrink-0">
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Mô tả:</span>
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                              {device.moTa}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Buttons - Nằm ở đáy card */}
                                    <div className="mt-auto pt-4 border-t-2 border-gray-100 flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditClick(device)}
                                        className="flex-1 flex items-center justify-center gap-1.5 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                      >
                                        <Edit className="w-4 h-4" />
                                        Sửa
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteDevice(device._id || device.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Xóa
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Form thêm/sửa thiết bị - Hiển thị đè lên trên cùng */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-md  ">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 hide-scrollbar">
            {/* Header Modal */}
            <div className="sticky top-0 bg-gradient-to-r bg-gradient-to-r bg-gradient-to-br from-teal-600 to-blue-600 to-indigo-600 text-white p-3 px-10 rounded-t-2xl flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingDevice ? 'Sửa thiết bị' : 'Thêm thiết bị mới'}
                </h2>
                <p className="text-sm text-blue-100 mt-1">
                  {editingDevice ? 'Cập nhật thông tin thiết bị' : 'Điền thông tin để thêm thiết bị mới'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false)
                  setEditingDevice(null)
                }}
                className="h-10 w-10 p-0 hover:bg-white hover:bg-opacity-20 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form Content */}
            <div className="p-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Tên thiết bị <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Nhập tên thiết bị"
                    value={formData.tenThietBi}
                    onChange={(e) => setFormData({ ...formData, tenThietBi: e.target.value })}
                    className="h-11 border-2 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Mã thiết bị <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Nhập mã thiết bị (VD: TB001)"
                    value={formData.maThietBi}
                    onChange={(e) => setFormData({ ...formData, maThietBi: e.target.value })}
                    className="h-11 border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Loại thiết bị <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-11 rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={formData.loaiThietBi}
                    onChange={(e) => setFormData({ ...formData, loaiThietBi: e.target.value })}
                  >
                    <option value="">Chọn loại thiết bị</option>
                    {loaiThietBiList.map(loai => (
                      <option key={loai} value={loai}>{loai}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Nhà sản xuất <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Nhập nhà sản xuất"
                    value={formData.nhaSanXuat}
                    onChange={(e) => setFormData({ ...formData, nhaSanXuat: e.target.value })}
                    className="h-11 border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Hàng 3: Các ngày */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Ngày mua <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.ngayMua}
                    onChange={(e) => setFormData({ ...formData, ngayMua: e.target.value })}
                    className="h-11 border-2 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Ngày hết hạn bảo hành <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.ngayHetHanBaoHanh}
                    onChange={(e) => setFormData({ ...formData, ngayHetHanBaoHanh: e.target.value })}
                    className="h-11 border-2 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Ngày bảo dưỡng tiếp theo <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.ngayBaoDuongTiepTheo}
                    onChange={(e) => setFormData({ ...formData, ngayBaoDuongTiepTheo: e.target.value })}
                    className="h-11 border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Hàng 4: Tình trạng, Khoa, Số lượng */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Tình trạng <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-11 rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={formData.tinhTrang}
                    onChange={(e) => setFormData({ ...formData, tinhTrang: e.target.value })}
                  >
                    {tinhTrangList.map(tinhTrang => (
                      <option key={tinhTrang} value={tinhTrang}>{tinhTrang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Khoa <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-11 rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={formData.KhoaId}
                    onChange={(e) => setFormData({ ...formData, KhoaId: e.target.value })}
                  >
                    <option value="">Chọn khoa</option>
                    {khoaList.map(khoa => (
                      <option key={khoa._id || khoa.id} value={khoa._id || khoa.id}>{khoa.tenKhoa}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Nhập số lượng"
                    value={formData.soLuong}
                    onChange={(e) => setFormData({ ...formData, soLuong: e.target.value })}
                    min="1"
                    className="h-11 border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div className='mb-3'>
                <label className="text-sm font-semibold mb-2 block text-gray-700">
                  Mô tả
                </label>
                <textarea
                  className="w-full  rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Nhập mô tả thiết bị (tùy chọn)"
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mb-3 ">
                {/* <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingDevice(null)
                  }}
                  className="px-8 h-11"
                >
                  Hủy
                </Button> */}
                <Button
                  variant="gradient"
                  onClick={handleSaveDevice}
                  className="px-8 h-11 shadow-md hover:shadow-lg transition-shadow"
                >
                  {editingDevice ? 'Cập nhật' : 'Thêm thiết bị'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Backgound>
  )
}

export default MedicalDevicesManagement