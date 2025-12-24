import React, { useEffect, useState, useRef } from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Edit, Trash2, X, Tag, Filter } from 'lucide-react'
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
        (loaiDV.moTa && loaiDV.moTa.toLowerCase().includes(searchTerm.toLowerCase()))
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
            moTa: loaiDV.moTa || ''
        })
        setShowAddForm(true)
        setTimeout(() => {
            // Cuộn container CardContent
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
            }
            // Hoặc cuộn window nếu cần
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 0)
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

        setTimeout(() => {
            // Cuộn container CardContent
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
            }
            // Hoặc cuộn window nếu cần
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 0)
    }


    return (
        <Backgound>
            <div className="flex w-full h-screen m-0 p-0 overflow-hidden ">
                {/* Sidebar */}
                <div className="w-[250px] flex-shrink-0">
                    <Dashboard />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden ">
                    <div className="p-6 h-full overflow-auto hide-scrollbar" ref={scrollContainerRef}>
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Quản lý loại dịch vụ
                            </h1>
                            <p className="text-sm text-gray-600">
                                Quản lý các loại dịch vụ khám bệnh trong hệ thống
                            </p>
                        </div>

                        {/* Search và Add Button */}
                        <Card className="mb-6 border-2 border-gray-200 shadow-md">
                            <CardContent className="py-0 ">
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <Input
                                            placeholder="Tìm kiếm loại dịch vụ..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-12 h-12 text-base border-2 focus:border-blue-500"
                                        />
                                    </div>
                                    <Button
                                        variant="gradient"
                                        className="flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow flex-shrink-0 h-12 px-6"
                                        onClick={handleAddClick}
                                    >
                                        <Plus className="w-5 h-5" />
                                        Thêm loại dịch vụ
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thống kê */}
                        {!loading && (
                            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-5 py-4 rounded-xl border-2 border-blue-200 shadow-md">
                                    <div className="text-sm text-blue-700 font-semibold mb-1">Tổng số loại dịch vụ</div>
                                    <div className="text-3xl font-bold text-blue-800">
                                        {loaiDichVuList.length}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">loại dịch vụ</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 px-5 py-4 rounded-xl border-2 border-green-200 shadow-md">
                                    <div className="text-sm text-green-700 font-semibold mb-1">Đang hiển thị</div>
                                    <div className="text-3xl font-bold text-green-800">
                                        {filteredLoaiDV.length}
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">kết quả</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-5 py-4 rounded-xl border-2 border-purple-200 shadow-md">
                                    <div className="text-sm text-purple-700 font-semibold mb-1">Đã tìm thấy</div>
                                    <div className="text-3xl font-bold text-purple-800">
                                        {searchTerm ? filteredLoaiDV.length : loaiDichVuList.length}
                                    </div>
                                    <div className="text-xs text-purple-600 mt-1">kết quả</div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-6 flex-1 min-h-0">
                            {/* Cột trái: Danh sách loại dịch vụ */}
                            <div className="w-2/3 flex flex-col min-h-0 ">
                                <Card className="flex-1 flex flex-col border-2 border-gray-200 shadow-md overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 flex-shrink-0">
                                        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            <Tag className="w-5 h-5 text-blue-600" />
                                            Danh sách loại dịch vụ
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto p-6" >
                                        {loading ? (
                                            <div className="text-center py-12">
                                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                                <p className="text-gray-500 text-lg">Đang tải dữ liệu...</p>
                                            </div>
                                        ) : error ? (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <X className="w-8 h-8 text-red-600" />
                                                </div>
                                                <p className="text-lg font-semibold text-red-600">{error}</p>
                                            </div>
                                        ) : filteredLoaiDV.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Search className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-lg font-semibold text-gray-600">
                                                    {searchTerm ? 'Không tìm thấy loại dịch vụ nào' : 'Chưa có loại dịch vụ nào'}
                                                </p>
                                                <p className="text-sm text-gray-400 mt-2">
                                                    {searchTerm ? 'Thử thay đổi từ khóa tìm kiếm' : 'Nhấn "Thêm loại dịch vụ" để bắt đầu'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {filteredLoaiDV.map((loaiDV) => (
                                                    <Card
                                                        key={loaiDV._id}
                                                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedLoaiDV?._id === loaiDV._id
                                                            ? 'border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                                                            : 'border-2 border-gray-200 hover:border-blue-300 bg-white'
                                                            }`}
                                                        onClick={() => handleCardClick(loaiDV)}
                                                    >
                                                        <CardContent className="p-5">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                                            <Tag className="w-5 h-5 text-blue-600" />
                                                                        </div>
                                                                        <h4 className="font-bold text-lg text-gray-900">
                                                                            {loaiDV.loaiDV}
                                                                        </h4>
                                                                    </div>
                                                                    {loaiDV.moTa && (
                                                                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                                                            {loaiDV.moTa}
                                                                        </p>
                                                                    )}
                                                                    {loaiDV.createdAt && (
                                                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                                                            <span>📅</span>
                                                                            Ngày tạo: {new Date(loaiDV.createdAt).toLocaleDateString('vi-VN', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric'
                                                                            })}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2 flex-shrink-0" >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={(e) => handleEditClick(loaiDV, e)}
                                                                        className="h-9 w-9 p-0 hover:bg-blue-50 hover:border-blue-300"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={(e) => handleDelete(loaiDV, e)}
                                                                        className="h-9 w-9 p-0"
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

                            {/* Cột phải: Form thêm/sửa hoặc chi tiết */}
                            <div className="w-1/3 flex flex-col min-h-0 max-h-[400px]">
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
                                    <Card className="flex flex-col h-full border-2 border-gray-200 shadow-md overflow-hidden">
                                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200 flex-shrink-0">
                                            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                <Tag className="w-5 h-5 text-blue-600" />
                                                Chi tiết loại dịch vụ
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1 overflow-y-auto p-6">
                                            <div className="space-y-6">
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                    <label className="text-xs font-semibold text-blue-700 uppercase mb-2 block">
                                                        Loại dịch vụ
                                                    </label>
                                                    <p className="text-lg font-bold text-blue-900">
                                                        {selectedLoaiDV.loaiDV}
                                                    </p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                    <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">
                                                        Mô tả
                                                    </label>
                                                    <p className="text-base text-gray-800 leading-relaxed">
                                                        {selectedLoaiDV.moTa || 'Chưa có mô tả'}
                                                    </p>
                                                </div>
                                                {selectedLoaiDV.createdAt && (
                                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                        <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">
                                                            Ngày tạo
                                                        </label>
                                                        <p className="text-base text-gray-800">
                                                            {new Date(selectedLoaiDV.createdAt).toLocaleDateString('vi-VN', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="flex flex-col h-full border-2 border-gray-200 shadow-md items-center justify-center">
                                        <CardContent className="text-center p-8">
                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Tag className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <p className="text-lg font-semibold text-gray-600 mb-2">
                                                Chọn một loại dịch vụ
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Nhấn vào card bên trái để xem chi tiết
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Backgound>
    )
}

export default LoaiDichVuManagement