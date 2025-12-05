import React, { useState, useMemo } from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit, Trash2, X, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { toast } from 'sonner'

const MedicalDevicesManagement = () => {
  // Dữ liệu cứng - Danh sách thiết bị y tế
  const [devices, setDevices] = useState([
    {
      id: 1,
      tenThietBi: 'Máy X-quang',
      maThietBi: 'TB001',
      loaiThietBi: 'Chẩn đoán hình ảnh',
      nhaSanXuat: 'Siemens',
      ngayMua: '2022-01-15',
      ngayHetHanBaoHanh: '2025-01-15',
      ngayBaoDuongTiepTheo: '2024-12-20',
      tinhTrang: 'Hoạt động tốt',
      khoa: 'Khoa Chẩn đoán hình ảnh',
      khoaId: '6918c2e05ec3116888624207',
      soLuong: 2,
      moTa: 'Máy X-quang kỹ thuật số hiện đại'
    },
    {
      id: 2,
      tenThietBi: 'Máy siêu âm',
      maThietBi: 'TB002',
      loaiThietBi: 'Chẩn đoán hình ảnh',
      nhaSanXuat: 'GE Healthcare',
      ngayMua: '2021-06-10',
      ngayHetHanBaoHanh: '2024-06-10',
      ngayBaoDuongTiepTheo: '2024-12-15',
      tinhTrang: 'Cần bảo dưỡng',
      khoa: 'Khoa Sản',
      khoaId: '6918c2e05ec3116888624206',
      soLuong: 3,
      moTa: 'Máy siêu âm 4D cho sản phụ khoa'
    },
    {
      id: 3,
      tenThietBi: 'Máy đo huyết áp',
      maThietBi: 'TB003',
      loaiThietBi: 'Theo dõi bệnh nhân',
      nhaSanXuat: 'Omron',
      ngayMua: '2023-03-20',
      ngayHetHanBaoHanh: '2026-03-20',
      ngayBaoDuongTiepTheo: '2024-12-10',
      tinhTrang: 'Hoạt động tốt',
      khoa: 'Khoa Nội',
      khoaId: '6918c2e05ec3116888624202',
      soLuong: 15,
      moTa: 'Máy đo huyết áp điện tử tự động'
    },
    {
      id: 4,
      tenThietBi: 'Máy thở',
      maThietBi: 'TB004',
      loaiThietBi: 'Hỗ trợ hô hấp',
      nhaSanXuat: 'Medtronic',
      ngayMua: '2020-11-05',
      ngayHetHanBaoHanh: '2023-11-05',
      ngayBaoDuongTiepTheo: '2024-11-25',
      tinhTrang: 'Hết hạn bảo dưỡng',
      khoa: 'Khoa Cấp Cứu',
      khoaId: '6918c2e05ec3116888624204',
      soLuong: 5,
      moTa: 'Máy thở cơ học cho bệnh nhân nặng'
    },
    {
      id: 5,
      tenThietBi: 'Máy nội soi',
      maThietBi: 'TB005',
      loaiThietBi: 'Chẩn đoán',
      nhaSanXuat: 'Olympus',
      ngayMua: '2022-08-12',
      ngayHetHanBaoHanh: '2025-08-12',
      ngayBaoDuongTiepTheo: '2024-12-25',
      tinhTrang: 'Hoạt động tốt',
      khoa: 'Khoa Nội',
      khoaId: '6918c2e05ec3116888624202',
      soLuong: 2,
      moTa: 'Hệ thống nội soi tiêu hóa'
    },
    {
      id: 6,
      tenThietBi: 'Máy điện tim',
      maThietBi: 'TB006',
      loaiThietBi: 'Chẩn đoán',
      nhaSanXuat: 'Philips',
      ngayMua: '2021-09-18',
      ngayHetHanBaoHanh: '2024-09-18',
      ngayBaoDuongTiepTheo: '2024-12-05',
      tinhTrang: 'Sắp đến hạn bảo dưỡng',
      khoa: 'Khoa Tim mạch',
      khoaId: '6918c2e05ec3116888624208',
      soLuong: 4,
      moTa: 'Máy điện tim 12 chuyển đạo'
    },
    {
      id: 7,
      tenThietBi: 'Máy lọc máu',
      maThietBi: 'TB007',
      loaiThietBi: 'Điều trị',
      nhaSanXuat: 'Fresenius',
      ngayMua: '2019-05-22',
      ngayHetHanBaoHanh: '2022-05-22',
      ngayBaoDuongTiepTheo: '2024-10-15',
      tinhTrang: 'Hỏng',
      khoa: 'Khoa Thận',
      khoaId: '6918c2e05ec3116888624209',
      soLuong: 1,
      moTa: 'Máy lọc máu nhân tạo'
    },
    {
      id: 8,
      tenThietBi: 'Máy CT Scanner',
      maThietBi: 'TB008',
      loaiThietBi: 'Chẩn đoán hình ảnh',
      nhaSanXuat: 'Siemens',
      ngayMua: '2023-01-10',
      ngayHetHanBaoHanh: '2026-01-10',
      ngayBaoDuongTiepTheo: '2024-12-30',
      tinhTrang: 'Hoạt động tốt',
      khoa: 'Khoa Chẩn đoán hình ảnh',
      khoaId: '6918c2e05ec3116888624207',
      soLuong: 1,
      moTa: 'Máy chụp cắt lớp vi tính 64 lát cắt'
    }
  ])

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
    khoaId: '',
    soLuong: '',
    moTa: ''
  })

  // Danh sách khoa (dữ liệu cứng)
  const khoaList = [
    { id: '6918c2e05ec3116888624202', tenKhoa: 'Khoa Nội' },
    { id: '6918c2e05ec3116888624203', tenKhoa: 'Khoa Ngoại' },
    { id: '6918c2e05ec3116888624204', tenKhoa: 'Khoa Cấp Cứu' },
    { id: '6918c2e05ec3116888624205', tenKhoa: 'Khoa Nhi' },
    { id: '6918c2e05ec3116888624206', tenKhoa: 'Khoa Sản' },
    { id: '6918c2e05ec3116888624207', tenKhoa: 'Khoa Chẩn đoán hình ảnh' },
    { id: '6918c2e05ec3116888624208', tenKhoa: 'Khoa Tim mạch' },
    { id: '6918c2e05ec3116888624209', tenKhoa: 'Khoa Thận' }
  ]

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
      khoaId: '',
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
      khoaId: device.khoaId,
      soLuong: device.soLuong.toString(),
      moTa: device.moTa
    })
    setShowForm(true)
  }

  // Hàm lưu thiết bị (thêm hoặc sửa)
  const handleSaveDevice = () => {
    // Validation
    if (!formData.tenThietBi || !formData.maThietBi || !formData.loaiThietBi || 
        !formData.nhaSanXuat || !formData.ngayMua || !formData.ngayHetHanBaoHanh || 
        !formData.ngayBaoDuongTiepTheo || !formData.khoaId || !formData.soLuong) {
      toast.error('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    // Kiểm tra số lượng phải là số dương
    const soLuong = parseInt(formData.soLuong)
    if (isNaN(soLuong) || soLuong <= 0) {
      toast.error('Số lượng phải là số nguyên dương!')
      return
    }

    // Kiểm tra mã thiết bị đã tồn tại (trừ khi đang sửa chính thiết bị đó)
    if (devices.some(d => d.maThietBi === formData.maThietBi && d.id !== editingDevice?.id)) {
      toast.error('Mã thiết bị đã tồn tại!')
      return
    }

    // Kiểm tra ngày hợp lệ
    const ngayMua = new Date(formData.ngayMua)
    const ngayBaoDuong = new Date(formData.ngayBaoDuongTiepTheo)
    const ngayHetHanBH = new Date(formData.ngayHetHanBaoHanh)

    if (ngayBaoDuong < ngayMua) {
      toast.error('Ngày bảo dưỡng không thể trước ngày mua!')
      return
    }

    // Tìm tên khoa
    const khoa = khoaList.find(k => k.id === formData.khoaId)
    const khoaName = khoa ? khoa.tenKhoa : ''

    if (editingDevice) {
      // Sửa thiết bị
      setDevices(devices.map(device => 
        device.id === editingDevice.id
          ? {
              ...device,
              tenThietBi: formData.tenThietBi,
              maThietBi: formData.maThietBi,
              loaiThietBi: formData.loaiThietBi,
              nhaSanXuat: formData.nhaSanXuat,
              ngayMua: formData.ngayMua,
              ngayHetHanBaoHanh: formData.ngayHetHanBaoHanh,
              ngayBaoDuongTiepTheo: formData.ngayBaoDuongTiepTheo,
              tinhTrang: formData.tinhTrang,
              khoa: khoaName,
              khoaId: formData.khoaId,
              soLuong: soLuong,
              moTa: formData.moTa
            }
          : device
      ))
      toast.success('Cập nhật thiết bị thành công!')
    } else {
      // Thêm thiết bị mới
      const newDevice = {
        id: devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1,
        tenThietBi: formData.tenThietBi,
        maThietBi: formData.maThietBi,
        loaiThietBi: formData.loaiThietBi,
        nhaSanXuat: formData.nhaSanXuat,
        ngayMua: formData.ngayMua,
        ngayHetHanBaoHanh: formData.ngayHetHanBaoHanh,
        ngayBaoDuongTiepTheo: formData.ngayBaoDuongTiepTheo,
        tinhTrang: formData.tinhTrang,
        khoa: khoaName,
        khoaId: formData.khoaId,
        soLuong: soLuong,
        moTa: formData.moTa
      }
      setDevices([...devices, newDevice])
      toast.success('Thêm thiết bị thành công!')
    }

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
      khoaId: '',
      soLuong: '',
      moTa: ''
    })
    setShowForm(false)
    setEditingDevice(null)
  }

  // Hàm xóa thiết bị
  const handleDeleteDevice = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      const device = devices.find(d => d.id === id)
      setDevices(devices.filter(device => device.id !== id))
      toast.success(`Đã xóa thiết bị "${device.tenThietBi}"`)
    }
  }

  // Hàm lấy màu badge theo tình trạng
  const getStatusBadgeColor = (tinhTrang) => {
    switch (tinhTrang) {
      case 'Hoạt động tốt':
        return 'bg-green-100 text-green-800'
      case 'Cần bảo dưỡng':
        return 'bg-yellow-100 text-yellow-800'
      case 'Sắp đến hạn bảo dưỡng':
        return 'bg-orange-100 text-orange-800'
      case 'Hết hạn bảo dưỡng':
        return 'bg-red-100 text-red-800'
      case 'Hỏng':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
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
      <div className="flex w-full h-screen m-0 p-0">
        {/* Sidebar */}
        <div className="w-[250px]">
          <Dashboard />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Quản lý thiết bị y tế
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Quản lý và theo dõi tất cả thiết bị y tế trong hệ thống
                  </p>
                </div>
                <Button 
                  variant="gradient" 
                  className="flex items-center gap-2"
                  onClick={handleAddClick}
                >
                  <Plus className="w-4 h-4" />
                  Thêm thiết bị
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Cảnh báo thiết bị cần chú ý */}
              {devicesNeedingAttention.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">
                      Cảnh báo: {devicesNeedingAttention.length} thiết bị cần chú ý
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {devicesNeedingAttention.map(device => {
                      const daysLeft = getDaysUntilMaintenance(device.ngayBaoDuongTiepTheo)
                      return (
                        <div key={device.id} className="bg-white p-3 rounded border border-red-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{device.tenThietBi}</p>
                              <p className="text-xs text-gray-600">{device.khoa}</p>
                            </div>
                            <div className="text-right">
                              {device.tinhTrang === 'Hết hạn bảo dưỡng' || device.tinhTrang === 'Hỏng' ? (
                                <span className="text-xs font-semibold text-red-600">Đã quá hạn</span>
                              ) : daysLeft >= 0 ? (
                                <span className="text-xs font-semibold text-orange-600">
                                  Còn {daysLeft} ngày
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-red-600">
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

              {/* Form thêm/sửa thiết bị */}
              {showForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingDevice ? 'Sửa thiết bị' : 'Thêm thiết bị mới'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowForm(false)
                        setEditingDevice(null)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tên thiết bị <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Nhập tên thiết bị"
                          value={formData.tenThietBi}
                          onChange={(e) => setFormData({...formData, tenThietBi: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Mã thiết bị <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Nhập mã thiết bị"
                          value={formData.maThietBi}
                          onChange={(e) => setFormData({...formData, maThietBi: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Loại thiết bị <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.loaiThietBi}
                          onChange={(e) => setFormData({...formData, loaiThietBi: e.target.value})}
                        >
                          <option value="">Chọn loại thiết bị</option>
                          {loaiThietBiList.map(loai => (
                            <option key={loai} value={loai}>{loai}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Nhà sản xuất <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Nhập nhà sản xuất"
                          value={formData.nhaSanXuat}
                          onChange={(e) => setFormData({...formData, nhaSanXuat: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Ngày mua <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={formData.ngayMua}
                          onChange={(e) => setFormData({...formData, ngayMua: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Ngày hết hạn bảo hành <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={formData.ngayHetHanBaoHanh}
                          onChange={(e) => setFormData({...formData, ngayHetHanBaoHanh: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Ngày bảo dưỡng tiếp theo <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={formData.ngayBaoDuongTiepTheo}
                          onChange={(e) => setFormData({...formData, ngayBaoDuongTiepTheo: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tình trạng <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.tinhTrang}
                          onChange={(e) => setFormData({...formData, tinhTrang: e.target.value})}
                        >
                          {tinhTrangList.map(tinhTrang => (
                            <option key={tinhTrang} value={tinhTrang}>{tinhTrang}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Khoa <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.khoaId}
                          onChange={(e) => setFormData({...formData, khoaId: e.target.value})}
                        >
                          <option value="">Chọn khoa</option>
                          {khoaList.map(khoa => (
                            <option key={khoa.id} value={khoa.id}>{khoa.tenKhoa}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Số lượng <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          placeholder="Nhập số lượng"
                          value={formData.soLuong}
                          onChange={(e) => setFormData({...formData, soLuong: e.target.value})}
                          min="1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Mô tả
                      </label>
                      <textarea
                        className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả thiết bị"
                        value={formData.moTa}
                        onChange={(e) => setFormData({...formData, moTa: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false)
                          setEditingDevice(null)
                        }}
                      >
                        Hủy
                      </Button>
                      <Button variant="gradient" onClick={handleSaveDevice}>
                        {editingDevice ? 'Cập nhật' : 'Thêm thiết bị'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Thanh tìm kiếm và lọc */}
              <div className="mb-6 space-y-4">
                {/* Tìm kiếm */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm theo tên, mã, loại, nhà sản xuất, khoa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Bộ lọc */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Lọc theo tình trạng
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterTinhTrang}
                      onChange={(e) => setFilterTinhTrang(e.target.value)}
                    >
                      <option value="all">Tất cả tình trạng</option>
                      {tinhTrangList.map(tinhTrang => (
                        <option key={tinhTrang} value={tinhTrang}>{tinhTrang}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Lọc theo khoa
                    </label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterKhoa}
                      onChange={(e) => setFilterKhoa(e.target.value)}
                    >
                      <option value="all">Tất cả khoa</option>
                      {khoaList.map(khoa => (
                        <option key={khoa.id} value={khoa.id}>{khoa.tenKhoa}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bảng danh sách thiết bị */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">STT</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Tên thiết bị</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Mã thiết bị</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Loại</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Nhà SX</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Số lượng</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Khoa</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Tình trạng</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Bảo dưỡng</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevices.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="p-8 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-lg">Không tìm thấy thiết bị nào</p>
                            <p className="text-sm text-gray-400">
                              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDevices.map((device, index) => {
                        const daysLeft = getDaysUntilMaintenance(device.ngayBaoDuongTiepTheo)
                        return (
                          <tr 
                            key={device.id} 
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3 text-sm">{index + 1}</td>
                            <td className="p-3">
                              <span className="font-medium text-gray-900">{device.tenThietBi}</span>
                            </td>
                            <td className="p-3 text-sm text-gray-600">{device.maThietBi}</td>
                            <td className="p-3 text-sm text-gray-600">{device.loaiThietBi}</td>
                            <td className="p-3 text-sm text-gray-600">{device.nhaSanXuat}</td>
                            <td className="p-3 text-sm font-semibold text-blue-600">
                              {device.soLuong}
                            </td>
                            <td className="p-3 text-sm text-gray-600">{device.khoa}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${getStatusBadgeColor(device.tinhTrang)}`}>
                                {getStatusIcon(device.tinhTrang)}
                                {device.tinhTrang}
                              </span>
                            </td>
                            <td className="p-3 text-sm">
                              <div>
                                <div className="text-gray-600">{device.ngayBaoDuongTiepTheo}</div>
                                {daysLeft >= 0 && daysLeft <= 30 && (
                                  <div className={`text-xs mt-1 ${daysLeft <= 7 ? 'text-red-600 font-semibold' : 'text-orange-600'}`}>
                                    Còn {daysLeft} ngày
                                  </div>
                                )}
                                {daysLeft < 0 && (
                                  <div className="text-xs mt-1 text-red-600 font-semibold">
                                    Quá {Math.abs(daysLeft)} ngày
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditClick(device)}
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="w-4 h-4" />
                                  Sửa
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteDevice(device.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Xóa
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Thống kê */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-600 font-medium">Tổng số thiết bị</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {filteredDevices.length}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">thiết bị</div>
                </div>
                <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                  <div className="text-sm text-green-600 font-medium">Hoạt động tốt</div>
                  <div className="text-2xl font-bold text-green-700 mt-1">
                    {filteredDevices.filter(d => d.tinhTrang === 'Hoạt động tốt').length}
                  </div>
                  <div className="text-xs text-green-500 mt-1">thiết bị</div>
                </div>
                <div className="bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                  <div className="text-sm text-red-600 font-medium">Cần chú ý</div>
                  <div className="text-2xl font-bold text-red-700 mt-1">
                    {filteredDevices.filter(d => 
                      d.tinhTrang === 'Hết hạn bảo dưỡng' || 
                      d.tinhTrang === 'Hỏng' ||
                      d.tinhTrang === 'Cần bảo dưỡng'
                    ).length}
                  </div>
                  <div className="text-xs text-red-500 mt-1">thiết bị</div>
                </div>
                <div className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-100">
                  <div className="text-sm text-purple-600 font-medium">Tổng số lượng</div>
                  <div className="text-2xl font-bold text-purple-700 mt-1">
                    {filteredDevices.reduce((sum, d) => sum + d.soLuong, 0)}
                  </div>
                  <div className="text-xs text-purple-500 mt-1">đơn vị</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Backgound>
  )
}

export default MedicalDevicesManagement