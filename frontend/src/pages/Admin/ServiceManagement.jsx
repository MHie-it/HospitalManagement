import React, { useState, useEffect } from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { dichVuService } from '@/services/dichVuService'
import { khoaService } from '@/services/khoaService'
import { loaiDichVuService } from '@/services/loaiDichVuService'


const ServiceManagement = () => {
  // Dữ liệu cứng - Danh sách dịch vụ
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)

  // State cho danh sách khoa và loại dịch vụ
  const [khoaList, setKhoaList] = useState([])
  const [loaiDichVuList, setLoaiDichVuList] = useState([])

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('')

  // State cho form thêm/sửa dịch vụ
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    tenDV: '',
    moTa: '',
    giaTien: '',
    Khoa: '', // Lưu ý: backend dùng "Khoa" (ObjectId)
    LoaiDichVu: '' // Lưu ý: backend dùng "LoaiDichVu" (ObjectId)
  })

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchServices()
    fetchKhoaList()
    fetchLoaiDichVuList()
  }, [])

  // Hàm lấy danh sách dịch vụ
  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await dichVuService.getAllDichVu()
      // Backend trả về { message, data: [...] }
      const servicesData = response.data || []

      // Map dữ liệu từ backend sang format hiển thị
      const mappedServices = servicesData.map(service => ({
        _id: service._id,
        id: service._id, // Giữ id để tương thích với code cũ
        tenDV: service.tenDV,
        moTa: service.moTa,
        giaTien: service.giaTien,
        khoa: service.Khoa?.tenKhoa || '', // Khoa là object đã populate
        khoaId: service.Khoa?._id || service.Khoa || '',
        loaiDV: service.LoaiDichVu?.loaiDV || '', // LoaiDichVu là object đã populate
        loaiDichVuId: service.LoaiDichVu?._id || service.LoaiDichVu || '',
        ngayTao: service.createdAt ? new Date(service.createdAt).toISOString().split('T')[0] : ''
      }))

      setServices(mappedServices)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', error)
      toast.error(error.message || 'Không thể tải danh sách dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  // Hàm lấy danh sách khoa
  const fetchKhoaList = async () => {
    try {
      const response = await khoaService.getAllKhoa()
      // Xử lý nhiều format response
      let khoaData = []
      if (Array.isArray(response)) {
        khoaData = response
      } else if (response.data && Array.isArray(response.data)) {
        khoaData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        khoaData = response.data.data
      }

      console.log('Danh sách khoa:', khoaData)
      setKhoaList(khoaData)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khoa:', error)
      toast.error(error.message || 'Không thể tải danh sách khoa')
    }
  }


  // Hàm lấy danh sách loại dịch vụ
  const fetchLoaiDichVuList = async () => {
    try {
      const response = await loaiDichVuService.getAllLoaiDichVu()
      // Xử lý nhiều format response
      let loaiDVData = []
      if (Array.isArray(response)) {
        loaiDVData = response
      } else if (response.data && Array.isArray(response.data)) {
        loaiDVData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        loaiDVData = response.data.data
      }

      console.log('Danh sách loại dịch vụ:', loaiDVData)
      setLoaiDichVuList(loaiDVData)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách loại dịch vụ:', error)
      toast.error(error.message || 'Không thể tải danh sách loại dịch vụ')
    }
  }

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
      Khoa: '',
      LoaiDichVu: ''
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
      Khoa: service.khoaId,
      LoaiDichVu: service.loaiDichVuId
    })
    setShowForm(true)
  }

  // Hàm lưu dịch vụ (thêm hoặc sửa)
  const handleSaveService = async () => {
    // Validation
    if (!formData.tenDV || !formData.moTa || !formData.giaTien || !formData.Khoa || !formData.LoaiDichVu) {
      toast.error('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    // Kiểm tra giá tiền phải là số dương
    const giaTien = parseFloat(formData.giaTien)
    if (isNaN(giaTien) || giaTien <= 0) {
      toast.error('Giá tiền phải là số dương!')
      return
    }

    // Kiểm tra Khoa và LoaiDichVu có phải là ObjectId hợp lệ không
    if (!formData.Khoa || formData.Khoa.trim() === '') {
      toast.error('Vui lòng chọn khoa!')
      return
    }

    if (!formData.LoaiDichVu || formData.LoaiDichVu.trim() === '') {
      toast.error('Vui lòng chọn loại dịch vụ!')
      return
    }

    try {
      const serviceData = {
        tenDV: formData.tenDV.trim(),
        moTa: formData.moTa.trim(),
        giaTien: giaTien,
        KhoaId: formData.Khoa,  // Đổi từ Khoa sang KhoaId
        LoaiDichVuId: formData.LoaiDichVu  // Đổi từ LoaiDichVu sang LoaiDichVuId
      }

      // Debug: Log dữ liệu gửi đi
      console.log('Dữ liệu gửi đi:', serviceData)

      if (editingService) {
        // Sửa dịch vụ
        const response = await dichVuService.updateDichVu(editingService._id, serviceData)
        console.log('Response update:', response)
        toast.success(response.message || 'Cập nhật dịch vụ thành công!')
      } else {
        // Thêm dịch vụ mới
        const response = await dichVuService.createDichVu(serviceData)
        console.log('Response create:', response)
        toast.success(response.message || 'Thêm dịch vụ thành công!')
      }

      // Reload danh sách
      await fetchServices()

      // Reset form và đóng form
      setFormData({
        tenDV: '',
        moTa: '',
        giaTien: '',
        Khoa: '',
        LoaiDichVu: ''
      })
      setShowForm(false)
      setEditingService(null)
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error)
      // Hiển thị lỗi chi tiết hơn
      const errorMessage = error.message || error.error || 'Có lỗi xảy ra khi lưu dịch vụ!'
      toast.error(errorMessage)
    }
  }
  // Hàm xóa dịch vụ
  const handleDeleteService = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      return
    }

    try {
      const service = services.find(s => s._id === id || s.id === id)
      await dichVuService.deleteDichVu(id)
      toast.success(`Đã xóa dịch vụ "${service?.tenDV || ''}"`)

      // Reload danh sách
      await fetchServices()
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi xóa dịch vụ!')
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
      <div className="flex w-full h-screen m-0 p-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[250px]">
          <Dashboard />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex-col p-6 overflow-auto hide-scrollbar">
          <Card className=" flex flex-col overflow-hidden h-full">
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

            <CardContent className="flex-1 overflow-y-auto min-h-0 hide-scrollbar">

              {/* Thống kê */}
              <div className="mt-3 mb-3  grid grid-cols-4 gap-4">
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
                              {services.length === 0
                                ? 'Chưa có dịch vụ nào trong hệ thống'
                                : 'Thử thay đổi từ khóa tìm kiếm'
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredServices.map((service, index) => (
                        <tr
                          key={service._id || service.id}
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
                                onClick={() => handleDeleteService(service._id || service.id)}
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


            </CardContent>
          </Card>
        </div>
      </div>
      {/* Form thêm/sửa dịch vụ */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 border-2 border-gray-200 hide-scrollbar">
            {/* Header Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">
                {editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false)
                  setEditingService(null)
                  setFormData({
                    tenDV: '',
                    moTa: '',
                    giaTien: '',
                    Khoa: '',
                    LoaiDichVu: ''
                  })
                }}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Nhập tên dịch vụ"
                  value={formData.tenDV}
                  onChange={(e) => setFormData({ ...formData, tenDV: e.target.value })}
                  className="h-12 text-base"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full min-h-[100px] px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                  placeholder="Nhập mô tả dịch vụ"
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Giá tiền (VND) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Nhập giá tiền"
                    value={formData.giaTien}
                    onChange={(e) => setFormData({ ...formData, giaTien: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700">
                    Khoa <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-12 rounded-lg border-2 border-gray-300 bg-transparent px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.Khoa}
                    onChange={(e) => {
                      console.log('Chọn khoa:', e.target.value)
                      setFormData({ ...formData, Khoa: e.target.value })
                    }}
                  >
                    <option value="">Chọn khoa</option>
                    {khoaList.map(khoa => (
                      <option key={khoa._id || khoa.id} value={khoa._id || khoa.id}>
                        {khoa.tenKhoa}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700">
                  Loại dịch vụ <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-12 rounded-lg border-2 border-gray-300 bg-transparent px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.LoaiDichVu}
                  onChange={(e) => {
                    console.log('Chọn loại dịch vụ:', e.target.value)
                    setFormData({ ...formData, LoaiDichVu: e.target.value })
                  }}
                >
                  <option value="">Chọn loại dịch vụ</option>
                  {loaiDichVuList.map(loai => (
                    <option key={loai._id || loai.id} value={loai._id || loai.id}>
                      {loai.loaiDV}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 rounded-b-2xl flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => {
                  setShowForm(false)
                  setEditingService(null)
                  setFormData({
                    tenDV: '',
                    moTa: '',
                    giaTien: '',
                    Khoa: '',
                    LoaiDichVu: ''
                  })
                }}
              >
                Hủy
              </Button>
              <Button
                variant="gradient"
                className="flex-1 h-12"
                onClick={handleSaveService}
              >
                {editingService ? 'Cập nhật' : 'Thêm dịch vụ'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Backgound>
  )
}

export default ServiceManagement