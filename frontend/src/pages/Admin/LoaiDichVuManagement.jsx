
import React, { useEffect, useState, useRef } from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Edit, Trash2, X, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { loaiDichVuService } from '@/services/loaiDichVuService'

const LoaiDichVuManagement = () => {
    const [loaiDichVuList, setLoaiDichVuList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLoaiDV, setSelectedLoaiDV] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingLoaiDV, setEditingLoaiDV] = useState(null)
    const [formData, setFormData] = useState({
        loaiDV: '',
        moTa: ''
    })

    const scrollContainerRef = useRef(null)

    useEffect(() => {
        fetchLoaiDichVuList()
    }, [])

    const fetchLoaiDichVuList = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await loaiDichVuService.getAllLoaiDichVu()

            if (Array.isArray(data)) {
                setLoaiDichVuList(data)
            } else if (data.data) {
                setLoaiDichVuList(data.data)
            } else {
                setLoaiDichVuList([])
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách loại dịch vụ:', error)
            setError(error.message || 'Không thể tải danh sách loại dịch vụ')
            toast.error(error.message || 'Không thể tải danh sách loại dịch vụ')
        } finally {
            setLoading(false)
        }
    }

    // Lọc loại dịch vụ theo từ khóa tìm kiếm
    const filteredLoaiDV = loaiDichVuList.filter(loaiDV =>
        loaiDV.loaiDV.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loaiDV.moTa.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Hàm mở form thêm loại dịch vụ
    const handleAddClick = () => {
        setSelectedLoaiDV(null)
        setEditingLoaiDV(null)
        setFormData({
            loaiDV: '',
            moTa: ''
        })
        setShowAddForm(true)
    }

    // Hàm mở form sửa loại dịch vụ
    const handleEditClick = (loaiDV, e) => {
        e.stopPropagation()
        setSelectedLoaiDV(null)
        setEditingLoaiDV(loaiDV)
        setFormData({
            loaiDV: loaiDV.loaiDV,
            moTa: loaiDV.moTa
        })
        setShowAddForm(true)
    }

    // Hàm lưu loại dịch vụ (thêm hoặc sửa)
    const handleSave = async () => {
        if (!formData.loaiDV || !formData.moTa) {
            toast.error('Vui lòng nhập đầy đủ thông tin!')
            return
        }

        // Kiểm tra trùng loại dịch vụ
        if (loaiDichVuList.some(ldv => ldv.loaiDV === formData.loaiDV && ldv._id !== editingLoaiDV?._id)) {
            toast.error('Loại dịch vụ này đã tồn tại!')
            return
        }

        try {
            if (editingLoaiDV) {
                await loaiDichVuService.updateLoaiDichVu(editingLoaiDV._id, formData)
                toast.success('Cập nhật loại dịch vụ thành công!')
            } else {
                await loaiDichVuService.createLoaiDichVu(formData)
                toast.success('Thêm loại dịch vụ thành công!')
            }

            await fetchLoaiDichVuList()

            // Reset form
            setFormData({
                loaiDV: '',
                moTa: ''
            })
            setShowAddForm(false)
            setEditingLoaiDV(null)
        } catch (error) {
            console.error('Lỗi khi lưu loại dịch vụ:', error)
            toast.error(error.message || 'Có lỗi xảy ra khi lưu loại dịch vụ')
        }
    }

    // Hàm xóa loại dịch vụ
    const handleDelete = async (loaiDV, e) => {
        e.stopPropagation()

        if (!window.confirm(`Bạn có chắc chắn muốn xóa loại dịch vụ "${loaiDV.loaiDV}"?`)) {
            return
        }

        try {
            await loaiDichVuService.deleteLoaiDichVu(loaiDV._id)
            toast.success('Xóa loại dịch vụ thành công!')
            await fetchLoaiDichVuList()

            // Nếu đang chọn loại dịch vụ bị xóa, reset selection
            if (selectedLoaiDV && selectedLoaiDV._id === loaiDV._id) {
                setSelectedLoaiDV(null)
            }
        } catch (error) {
            console.error('Lỗi khi xóa loại dịch vụ:', error)
            toast.error(error.message || 'Có lỗi xảy ra khi xóa loại dịch vụ')
        }
    }

    // Hàm click vào card
    const handleCardClick = (loaiDV) => {
        setSelectedLoaiDV(loaiDV)
        setShowAddForm(false)
        setEditingLoaiDV(null)
    }

    return (
        <Backgound>
            <div className="flex w-full h-screen m-0 p-0 overflow-hidden">
                <div className="w-[250px] flex-shrink-0">
                    <Dashboard />
                </div>
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý loại dịch vụ</h1>
                        <p className="text-gray-600 mt-1">Quản lý các loại dịch vụ khám bệnh</p>
                    </div>

                    <div className="flex gap-6 flex-1 min-h-0">
                        {/* Cột trái: Danh sách loại dịch vụ */}
                        <div className="w-2/3 flex flex-col min-h-0">
                            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                <h3 className="text-lg font-semibold text-gray-800">Danh sách loại dịch vụ</h3>
                                <Button
                                    variant="default"
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                    onClick={handleAddClick}
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm loại dịch vụ
                                </Button>
                            </div>

                            {/* Tìm kiếm */}
                            <div className="mb-4 flex-shrink-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Tìm kiếm loại dịch vụ..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Danh sách loại dịch vụ */}
                            <Card className="flex-1 overflow-hidden flex flex-col">
                                <CardContent className="flex-1 overflow-y-auto p-4" ref={scrollContainerRef}>
                                    {loading ? (
                                        <div className="text-center py-8 text-gray-500">Đang tải...</div>
                                    ) : error ? (
                                        <div className="text-center py-8 text-red-500">{error}</div>
                                    ) : filteredLoaiDV.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            {searchTerm ? 'Không tìm thấy loại dịch vụ nào' : 'Chưa có loại dịch vụ nào'}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredLoaiDV.map((loaiDV) => (
                                                <Card
                                                    key={loaiDV._id}
                                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                                        selectedLoaiDV?._id === loaiDV._id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'hover:border-gray-300'
                                                    }`}
                                                    onClick={() => handleCardClick(loaiDV)}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Tag className="w-5 h-5 text-blue-600" />
                                                                    <h4 className="font-semibold text-lg text-gray-900">
                                                                        {loaiDV.loaiDV}
                                                                    </h4>
                                                                </div>
                                                                <p className="text-sm text-gray-600 mb-2">
                                                                    {loaiDV.moTa}
                                                                </p>
                                                                {loaiDV.createdAt && (
                                                                    <p className="text-xs text-gray-400">
                                                                        Ngày tạo: {new Date(loaiDV.createdAt).toLocaleDateString('vi-VN')}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2 ml-4">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={(e) => handleEditClick(loaiDV, e)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={(e) => handleDelete(loaiDV, e)}
                                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Cột phải: Form thêm/sửa loại dịch vụ */}
                        <div className="w-1/3 flex flex-col min-h-0">
                            {showAddForm ? (
                                <Card className="flex flex-col h-full max-h-full overflow-hidden">
                                    <CardHeader className="flex-shrink-0">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg font-semibold">
                                                {editingLoaiDV ? 'Sửa loại dịch vụ' : 'Thêm loại dịch vụ mới'}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setShowAddForm(false)
                                                    setEditingLoaiDV(null)
                                                    setFormData({ loaiDV: '', moTa: '' })
                                                }}
                                                className="h-8 w-8 p-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Loại dịch vụ <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                placeholder="Ví dụ: Ngoai Tru, Noi Tru, Cap Cuu..."
                                                value={formData.loaiDV}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, loaiDV: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Mô tả <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                placeholder="Nhập mô tả cho loại dịch vụ..."
                                                value={formData.moTa}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, moTa: e.target.value })
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                    <CardContent className="flex-shrink-0 border-t pt-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => {
                                                    setShowAddForm(false)
                                                    setEditingLoaiDV(null)
                                                    setFormData({ loaiDV: '', moTa: '' })
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                onClick={handleSave}
                                            >
                                                {editingLoaiDV ? 'Cập nhật' : 'Thêm mới'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : selectedLoaiDV ? (
                                <Card className="flex flex-col h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                            <Tag className="w-5 h-5 text-blue-600" />
                                            Chi tiết loại dịch vụ
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Loại dịch vụ</label>
                                                <p className="text-base font-semibold text-gray-900 mt-1">
                                                    {selectedLoaiDV.loaiDV}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Mô tả</label>
                                                <p className="text-base text-gray-700 mt-1">{selectedLoaiDV.moTa}</p>
                                            </div>
                                            {selectedLoaiDV.createdAt && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                                                    <p className="text-base text-gray-700 mt-1">
                                                        {new Date(selectedLoaiDV.createdAt).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="flex flex-col h-full items-center justify-center">
                                    <CardContent className="text-center">
                                        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Chọn một loại dịch vụ để xem chi tiết</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Backgound>
    )
}

export default LoaiDichVuManagement