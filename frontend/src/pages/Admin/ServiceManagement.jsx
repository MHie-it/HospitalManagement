import React, { useState } from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

const ServiceManagement = () => {
  // Dữ liệu cứng - Danh sách dịch vụ
  const [services, setServices] = useState([
    {
      id: 1,
      tenDV: 'Khám tổng quát',
      moTa: 'Khám sức khỏe tổng quát định kỳ',
      giaTien: 200000,
      khoa: 'Khoa Nội',
      khoaId: '6918c2e05ec3116888624202',
      loaiDV: 'Ngoai Tru',
      loaiDichVuId: '1',
      ngayTao: '2024-01-15'
    },
    {
      id: 2,
      tenDV: 'Xét nghiệm máu',
      moTa: 'Xét nghiệm công thức máu cơ bản',
      giaTien: 150000,
      khoa: 'Khoa Nội',
      khoaId: '6918c2e05ec3116888624202',
      loaiDV: 'Ho Tro Chuan Doan',
      loaiDichVuId: '2',
      ngayTao: '2024-01-16'
    },
    {
      id: 3,
      tenDV: 'Phẫu thuật ngoại khoa',
      moTa: 'Phẫu thuật các bệnh ngoại khoa',
      giaTien: 5000000,
      khoa: 'Khoa Ngoại',
      khoaId: '6918c2e05ec3116888624203',
      loaiDV: 'Ngoai Khoa',
      loaiDichVuId: '3',
      ngayTao: '2024-01-17'
    },
    {
      id: 4,
      tenDV: 'Cấp cứu khẩn cấp',
      moTa: 'Dịch vụ cấp cứu 24/7',
      giaTien: 1000000,
      khoa: 'Khoa Cấp Cứu',
      khoaId: '6918c2e05ec3116888624204',
      loaiDV: 'Cap Cuu',
      loaiDichVuId: '4',
      ngayTao: '2024-01-18'
    },
    {
      id: 5,
      tenDV: 'Nội soi dạ dày',
      moTa: 'Nội soi đường tiêu hóa trên',
      giaTien: 800000,
      khoa: 'Khoa Nội',
      khoaId: '6918c2e05ec3116888624202',
      loaiDV: 'Ho Tro Chuan Doan',
      loaiDichVuId: '2',
      ngayTao: '2024-01-19'
    },
    {
      id: 6,
      tenDV: 'Điều trị nội trú',
      moTa: 'Điều trị và theo dõi bệnh nhân nội trú',
      giaTien: 2000000,
      khoa: 'Khoa Nội',
      khoaId: '6918c2e05ec3116888624202',
      loaiDV: 'Noi Tru',
      loaiDichVuId: '5',
      ngayTao: '2024-01-20'
    }
  ])

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('')

  // State cho form thêm/sửa dịch vụ
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    tenDV: '',
    moTa: '',
    giaTien: '',
    khoaId: '',
    loaiDV: ''
  })

  // Danh sách khoa (dữ liệu cứng)
  const khoaList = [
    { id: '6918c2e05ec3116888624202', tenKhoa: 'Khoa Nội' },
    { id: '6918c2e05ec3116888624203', tenKhoa: 'Khoa Ngoại' },
    { id: '6918c2e05ec3116888624204', tenKhoa: 'Khoa Cấp Cứu' },
    { id: '6918c2e05ec3116888624205', tenKhoa: 'Khoa Nhi' },
    { id: '6918c2e05ec3116888624206', tenKhoa: 'Khoa Sản' }
  ]

  // Danh sách loại dịch vụ
  const loaiDichVuList = [
    { id: '1', loaiDV: 'Ngoai Tru' },
    { id: '2', loaiDV: 'Ho Tro Chuan Doan' },
    { id: '3', loaiDV: 'Ngoai Khoa' },
    { id: '4', loaiDV: 'Cap Cuu' },
    { id: '5', loaiDV: 'Noi Tru' },
    { id: '6', loaiDV: 'Khac' }
  ]

  // Lọc danh sách dịch vụ
  const filteredServices = services.filter(service => {
    const matchSearch = 
      service.tenDV.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.moTa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.khoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.loaiDV.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.giaTien.toString().includes(searchTerm)
    
    return matchSearch
  })

  // Hàm mở form thêm mới
  const handleAddClick = () => {
    setEditingService(null)
    setFormData({
      tenDV: '',
      moTa: '',
      giaTien: '',
      khoaId: '',
      loaiDV: ''
    })
    setShowForm(true)
  }

  // Hàm mở form sửa
  const handleEditClick = (service) => {
    setEditingService(service)
    setFormData({
      tenDV: service.tenDV,
      moTa: service.moTa,
      giaTien: service.giaTien.toString(),
      khoaId: service.khoaId,
      loaiDV: service.loaiDV
    })
    setShowForm(true)
  }

  // Hàm lưu dịch vụ (thêm hoặc sửa)
  const handleSaveService = () => {
    // Validation
    if (!formData.tenDV || !formData.moTa || !formData.giaTien || !formData.khoaId || !formData.loaiDV) {
      toast.error('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    // Kiểm tra giá tiền phải là số dương
    const giaTien = parseFloat(formData.giaTien)
    if (isNaN(giaTien) || giaTien <= 0) {
      toast.error('Giá tiền phải là số dương!')
      return
    }

    // Kiểm tra tên dịch vụ đã tồn tại (trừ khi đang sửa chính dịch vụ đó)
    if (services.some(s => s.tenDV === formData.tenDV && s.id !== editingService?.id)) {
      toast.error('Tên dịch vụ đã tồn tại!')
      return
    }

    // Tìm tên khoa
    const khoa = khoaList.find(k => k.id === formData.khoaId)
    const khoaName = khoa ? khoa.tenKhoa : ''

    if (editingService) {
      // Sửa dịch vụ
      setServices(services.map(service => 
        service.id === editingService.id
          ? {
              ...service,
              tenDV: formData.tenDV,
              moTa: formData.moTa,
              giaTien: giaTien,
              khoa: khoaName,
              khoaId: formData.khoaId,
              loaiDV: formData.loaiDV
            }
          : service
      ))
      toast.success('Cập nhật dịch vụ thành công!')
    } else {
      // Thêm dịch vụ mới
      const newService = {
        id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
        tenDV: formData.tenDV,
        moTa: formData.moTa,
        giaTien: giaTien,
        khoa: khoaName,
        khoaId: formData.khoaId,
        loaiDV: formData.loaiDV,
        loaiDichVuId: loaiDichVuList.find(l => l.loaiDV === formData.loaiDV)?.id || '',
        ngayTao: new Date().toISOString().split('T')[0]
      }
      setServices([...services, newService])
      toast.success('Thêm dịch vụ thành công!')
    }

    // Reset form và đóng form
    setFormData({
      tenDV: '',
      moTa: '',
      giaTien: '',
      khoaId: '',
      loaiDV: ''
    })
    setShowForm(false)
    setEditingService(null)
  }

  // Hàm xóa dịch vụ
  const handleDeleteService = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      const service = services.find(s => s.id === id)
      setServices(services.filter(service => service.id !== id))
      toast.success(`Đã xóa dịch vụ "${service.tenDV}"`)
    }
  }

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
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
                    Quản lý dịch vụ
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Quản lý và theo dõi tất cả dịch vụ trong hệ thống
                  </p>
                </div>
                <Button 
                  variant="gradient" 
                  className="flex items-center gap-2"
                  onClick={handleAddClick}
                >
                  <Plus className="w-4 h-4" />
                  Thêm dịch vụ
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Form thêm/sửa dịch vụ */}
              {showForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowForm(false)
                        setEditingService(null)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tên dịch vụ <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Nhập tên dịch vụ"
                        value={formData.tenDV}
                        onChange={(e) => setFormData({...formData, tenDV: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Mô tả <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mô tả dịch vụ"
                        value={formData.moTa}
                        onChange={(e) => setFormData({...formData, moTa: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Giá tiền (VND) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          placeholder="Nhập giá tiền"
                          value={formData.giaTien}
                          onChange={(e) => setFormData({...formData, giaTien: e.target.value})}
                        />
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
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Loại dịch vụ <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.loaiDV}
                        onChange={(e) => setFormData({...formData, loaiDV: e.target.value})}
                      >
                        <option value="">Chọn loại dịch vụ</option>
                        {loaiDichVuList.map(loai => (
                          <option key={loai.id} value={loai.loaiDV}>{loai.loaiDV}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowForm(false)
                          setEditingService(null)
                        }}
                      >
                        Hủy
                      </Button>
                      <Button variant="gradient" onClick={handleSaveService}>
                        {editingService ? 'Cập nhật' : 'Thêm dịch vụ'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Thanh tìm kiếm */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm theo tên, mô tả, khoa, loại dịch vụ, giá tiền..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Bảng danh sách dịch vụ */}
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">STT</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Tên dịch vụ</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Mô tả</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Giá tiền</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Khoa</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Loại dịch vụ</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Ngày tạo</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-lg">Không tìm thấy dịch vụ nào</p>
                            <p className="text-sm text-gray-400">
                              Thử thay đổi từ khóa tìm kiếm
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredServices.map((service, index) => (
                        <tr 
                          key={service.id} 
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3 text-sm">{index + 1}</td>
                          <td className="p-3">
                            <span className="font-medium text-gray-900">{service.tenDV}</span>
                          </td>
                          <td className="p-3 text-sm text-gray-600 max-w-xs truncate" title={service.moTa}>
                            {service.moTa}
                          </td>
                          <td className="p-3 text-sm font-semibold text-blue-600">
                            {formatPrice(service.giaTien)}
                          </td>
                          <td className="p-3 text-sm text-gray-600">{service.khoa}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {service.loaiDV}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{service.ngayTao}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(service)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="w-4 h-4" />
                                Sửa
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteService(service.id)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Thống kê */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-600 font-medium">Tổng số dịch vụ</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {filteredServices.length}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">dịch vụ</div>
                </div>
                <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                  <div className="text-sm text-green-600 font-medium">Tổng giá trị</div>
                  <div className="text-2xl font-bold text-green-700 mt-1">
                    {formatPrice(filteredServices.reduce((sum, s) => sum + s.giaTien, 0))}
                  </div>
                  <div className="text-xs text-green-500 mt-1">tổng cộng</div>
                </div>
                <div className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-100">
                  <div className="text-sm text-purple-600 font-medium">Giá trung bình</div>
                  <div className="text-2xl font-bold text-purple-700 mt-1">
                    {filteredServices.length > 0 
                      ? formatPrice(filteredServices.reduce((sum, s) => sum + s.giaTien, 0) / filteredServices.length)
                      : formatPrice(0)
                    }
                  </div>
                  <div className="text-xs text-purple-500 mt-1">mỗi dịch vụ</div>
                </div>
                <div className="bg-orange-50 px-4 py-3 rounded-lg border border-orange-100">
                  <div className="text-sm text-orange-600 font-medium">Loại dịch vụ</div>
                  <div className="text-2xl font-bold text-orange-700 mt-1">
                    {new Set(filteredServices.map(s => s.loaiDV)).size}
                  </div>
                  <div className="text-xs text-orange-500 mt-1">loại khác nhau</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Backgound>
  )
}

export default ServiceManagement