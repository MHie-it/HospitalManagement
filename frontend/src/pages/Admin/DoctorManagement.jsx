import React, { useState } from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Edit, Trash2, X, Users, Building2 } from 'lucide-react'
import { toast } from 'sonner'

const DoctorManagement = () => {
    // Dữ liệu cứng - Danh sách khoa
    const [khoaList, setKhoaList] = useState([
        {
            _id: "1",
            tenKhoa: "Khoa Nội",
            email: "khoanoi@hospital.com",
            SDT: "0987654321",
            moTa: "Khoa điều trị các bệnh nội khoa",
            status: "active",
            isActive: true,
            createdAt: new Date("2024-01-15T15:30:14"),
        },
        {
            _id: "2",
            tenKhoa: "Khoa Ngoại",
            email: "khoangoai@hospital.com",
            SDT: "0987654322",
            moTa: "Khoa phẫu thuật ngoại khoa",
            status: "active",
            isActive: true,
            createdAt: new Date("2024-01-16T10:20:00"),
        },
        {
            _id: "3",
            tenKhoa: "Khoa Nhi",
            email: "khoanhi@hospital.com",
            SDT: "0987654323",
            moTa: "Khoa điều trị bệnh nhi",
            status: "active",
            isActive: true,
            createdAt: new Date("2024-01-17T14:15:30"),
        },
        {
            _id: "4",
            tenKhoa: "Khoa Sản",
            email: "khoasan@hospital.com",
            SDT: "0987654324",
            moTa: "Khoa sản phụ khoa",
            status: "active",
            isActive: true,
            createdAt: new Date("2024-01-18T09:00:00"),
        },
    ])

    // Dữ liệu cứng - Danh sách bác sĩ
    const [bacSiList] = useState([
        {
            _id: "bs1",
            tenBS: "Nguyễn Văn A",
            email: "bsnoi01@hospital.com",
            SDT: "0912345678",
            ngaySinh: "1980-05-15",
            diaChi: "123 Đường ABC, Quận 1, TP.HCM",
            gioiTinh: "Nam",
            Khoa: "1",
            isActive: true,
        },
        {
            _id: "bs2",
            tenBS: "Trần Thị B",
            email: "bsnoi02@hospital.com",
            SDT: "0912345679",
            ngaySinh: "1985-08-20",
            diaChi: "456 Đường XYZ, Quận 2, TP.HCM",
            gioiTinh: "Nữ",
            Khoa: "1",
            isActive: true,
        },
        {
            _id: "bs3",
            tenBS: "Lê Văn C",
            email: "bsngoai01@hospital.com",
            SDT: "0912345680",
            ngaySinh: "1978-12-10",
            diaChi: "789 Đường DEF, Quận 3, TP.HCM",
            gioiTinh: "Nam",
            Khoa: "2",
            isActive: true,
        },
        {
            _id: "bs4",
            tenBS: "Phạm Thị D",
            email: "bsngoai02@hospital.com",
            SDT: "0912345681",
            ngaySinh: "1982-03-25",
            diaChi: "321 Đường GHI, Quận 4, TP.HCM",
            gioiTinh: "Nữ",
            Khoa: "2",
            isActive: true,
        },
        {
            _id: "bs5",
            tenBS: "Hoàng Văn E",
            email: "bsnhi01@hospital.com",
            SDT: "0912345682",
            ngaySinh: "1987-07-30",
            diaChi: "654 Đường JKL, Quận 5, TP.HCM",
            gioiTinh: "Nam",
            Khoa: "3",
            isActive: true,
        },
        {
            _id: "bs6",
            tenBS: "Võ Thị F",
            email: "bsan01@hospital.com",
            SDT: "0912345683",
            ngaySinh: "1983-11-15",
            diaChi: "987 Đường MNO, Quận 6, TP.HCM",
            gioiTinh: "Nữ",
            Khoa: "4",
            isActive: true,
        },
    ])

    // State
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedKhoa, setSelectedKhoa] = useState(null)
    const [showAddKhoaForm, setShowAddKhoaForm] = useState(false)
    const [editingKhoa, setEditingKhoa] = useState(null)
    const [khoaFormData, setKhoaFormData] = useState({
        tenKhoa: '',
        email: '',
        SDT: '',
        moTa: ''
    })

    // Lọc khoa theo từ khóa tìm kiếm
    const filteredKhoa = khoaList.filter(khoa =>
        khoa.tenKhoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        khoa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        khoa.SDT.includes(searchTerm)
    )

    // Lấy danh sách bác sĩ của khoa được chọn
    const doctorsOfSelectedKhoa = selectedKhoa
        ? bacSiList.filter(bacSi => bacSi.Khoa === selectedKhoa._id)
        : []

    // Hàm xử lý click vào khoa
    const handleKhoaClick = (khoa) => {
        setSelectedKhoa(khoa)
        setShowAddKhoaForm(false)
        setEditingKhoa(null)
    }

    // Hàm mở form thêm khoa
    const handleAddKhoaClick = () => {
        setSelectedKhoa(null)
        setEditingKhoa(null)
        setKhoaFormData({
            tenKhoa: '',
            email: '',
            SDT: '',
            moTa: ''
        })
        setShowAddKhoaForm(true)
    }

    // Hàm mở form sửa khoa
    const handleEditKhoaClick = (khoa, e) => {
        e.stopPropagation() // Ngăn chặn sự kiện click lan ra card
        setSelectedKhoa(null)
        setEditingKhoa(khoa)
        setKhoaFormData({
            tenKhoa: khoa.tenKhoa,
            email: khoa.email,
            SDT: khoa.SDT,
            moTa: khoa.moTa
        })
        setShowAddKhoaForm(true)
    }

    // Hàm lưu khoa (thêm hoặc sửa)
    const handleSaveKhoa = () => {
        // Validation
        if (!khoaFormData.tenKhoa || !khoaFormData.email || !khoaFormData.SDT || !khoaFormData.moTa) {
            toast.error('Vui lòng nhập đầy đủ thông tin!')
            return
        }

        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(khoaFormData.email)) {
            toast.error('Email không hợp lệ!')
            return
        }

        // Kiểm tra số điện thoại hợp lệ
        const phoneRegex = /^(0|\+84)[0-9]{9}$/
        if (!phoneRegex.test(khoaFormData.SDT)) {
            toast.error('Số điện thoại không hợp lệ!')
            return
        }

        // Kiểm tra tên khoa đã tồn tại (trừ khi đang sửa chính khoa đó)
        if (khoaList.some(k => k.tenKhoa === khoaFormData.tenKhoa && k._id !== editingKhoa?._id)) {
            toast.error('Tên khoa đã tồn tại!')
            return
        }

        // Kiểm tra email đã tồn tại
        if (khoaList.some(k => k.email === khoaFormData.email && k._id !== editingKhoa?._id)) {
            toast.error('Email đã tồn tại!')
            return
        }

        if (editingKhoa) {
            // Sửa khoa
            setKhoaList(khoaList.map(khoa =>
                khoa._id === editingKhoa._id
                    ? {
                        ...khoa,
                        tenKhoa: khoaFormData.tenKhoa,
                        email: khoaFormData.email,
                        SDT: khoaFormData.SDT,
                        moTa: khoaFormData.moTa
                    }
                    : khoa
            ))
            toast.success('Cập nhật khoa thành công!')
        } else {
            // Thêm khoa mới
            const newKhoa = {
                _id: (khoaList.length > 0 ? Math.max(...khoaList.map(k => parseInt(k._id))) + 1 : 1).toString(),
                tenKhoa: khoaFormData.tenKhoa,
                email: khoaFormData.email,
                SDT: khoaFormData.SDT,
                moTa: khoaFormData.moTa,
                status: "active",
                isActive: true,
                createdAt: new Date()
            }
            setKhoaList([...khoaList, newKhoa])
            toast.success('Thêm khoa thành công!')
        }

        // Reset form
        setKhoaFormData({
            tenKhoa: '',
            email: '',
            SDT: '',
            moTa: ''
        })
        setShowAddKhoaForm(false)
        setEditingKhoa(null)
    }

    // Hàm xóa khoa
    const handleDeleteKhoa = (khoa, e) => {
        e.stopPropagation() // Ngăn chặn sự kiện click lan ra card
        if (window.confirm(`Bạn có chắc chắn muốn xóa khoa "${khoa.tenKhoa}"?`)) {
            // Kiểm tra xem khoa có bác sĩ không
            const hasDoctors = bacSiList.some(bs => bs.Khoa === khoa._id)
            if (hasDoctors) {
                toast.error('Không thể xóa khoa đang có bác sĩ!')
                return
            }

            setKhoaList(khoaList.filter(k => k._id !== khoa._id))
            if (selectedKhoa && selectedKhoa._id === khoa._id) {
                setSelectedKhoa(null)
            }
            toast.success(`Đã xóa khoa "${khoa.tenKhoa}"`)
        }
    }

    // Tính tổng số bác sĩ
    const totalDoctors = bacSiList.length
    const totalKhoa = khoaList.length

    return (
        <Backgound>
            <div className="flex w-full h-screen m-0 p-0 overflow-hidden">
                <div className="w-[250px] flex-shrink-0">
                    <Dashboard />
                </div>
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                    <Card className="h-full flex flex-col overflow-hidden">
                        <CardHeader className="flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-800">
                                        Quản lý Khoa & Bác sĩ
                                    </CardTitle>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Quản lý các khoa và bác sĩ trong bệnh viện
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-y-auto">
                            {/* Thống kê */}
                            <div className="grid grid-cols-3 gap-4 mb-6 flex-shrink-0">
                                <Card className="bg-blue-50 border-blue-200">
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-600">Tổng số khoa</span>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-700">{totalKhoa}</div>
                                    </div>
                                </Card>
                                <Card className="bg-green-50 border-green-200">
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-600">Tổng số bác sĩ</span>
                                        </div>
                                        <div className="text-2xl font-bold text-green-700">{totalDoctors}</div>
                                    </div>
                                </Card>
                                <Card className="bg-purple-50 border-purple-200">
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            <span className="text-sm font-medium text-purple-600">
                                                Bác sĩ {selectedKhoa ? `(${selectedKhoa.tenKhoa})` : '(chưa chọn)'}
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold text-purple-700">
                                            {selectedKhoa ? doctorsOfSelectedKhoa.length : 0}
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Thanh tìm kiếm */}
                            <div className="mb-6 flex-shrink-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="Tìm kiếm khoa theo tên, email, số điện thoại..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6 flex-1 min-h-0">
                                {/* Cột trái: Danh sách khoa */}
                                <div className="w-2/3 flex flex-col min-h-0">
                                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                        <h3 className="text-lg font-semibold text-gray-800">Danh sách khoa</h3>
                                        <Button
                                            variant="gradient"
                                            className="flex items-center gap-2"
                                            onClick={handleAddKhoaClick}
                                        >
                                            <Plus className="w-4 h-4" />
                                            Thêm khoa
                                        </Button>
                                    </div>

                                    {/* Danh sách khoa */}
                                    <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                                        {filteredKhoa.length === 0 ? (
                                            <Card className="p-8 text-center">
                                                <p className="text-gray-500">Không tìm thấy khoa nào</p>
                                            </Card>
                                        ) : (
                                            filteredKhoa.map((khoa) => (
                                                <Card
                                                    key={khoa._id}
                                                    className={`p-4 cursor-pointer transition-all hover:shadow-lg ${selectedKhoa && selectedKhoa._id === khoa._id
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'hover:border-gray-300'
                                                        }`}
                                                    onClick={() => handleKhoaClick(khoa)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-lg text-gray-800 mb-1">
                                                                {khoa.tenKhoa}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mb-1">{khoa.moTa}</p>
                                                            <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                                                <span>📧 {khoa.email}</span>
                                                                <span>📞 {khoa.SDT}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                Ngày tạo: {new Date(khoa.createdAt).toLocaleDateString('vi-VN')}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 ml-4">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => handleEditKhoaClick(khoa, e)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                                Sửa
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={(e) => handleDeleteKhoa(khoa, e)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Xóa
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Cột phải: Form thêm/sửa khoa hoặc Danh sách bác sĩ */}
                                <div className="w-1/3 flex flex-col min-h-0">
                                    {showAddKhoaForm ? (
                                        <Card className="flex flex-col h-full max-h-full overflow-hidden">
                                            <CardHeader className="flex-shrink-0">
                                                <div className="flex justify-between items-center">
                                                    <CardTitle className="text-lg font-semibold">
                                                        {editingKhoa ? 'Sửa khoa' : 'Thêm khoa mới'}
                                                    </CardTitle>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShowAddKhoaForm(false)
                                                            setEditingKhoa(null)
                                                        }}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-1 overflow-y-auto">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block">
                                                            Tên khoa <span className="text-red-500">*</span>
                                                        </label>
                                                        <Input
                                                            placeholder="Nhập tên khoa"
                                                            value={khoaFormData.tenKhoa}
                                                            onChange={(e) =>
                                                                setKhoaFormData({ ...khoaFormData, tenKhoa: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block">
                                                            Email <span className="text-red-500">*</span>
                                                        </label>
                                                        <Input
                                                            type="email"
                                                            placeholder="Nhập email"
                                                            value={khoaFormData.email}
                                                            onChange={(e) =>
                                                                setKhoaFormData({ ...khoaFormData, email: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block">
                                                            Số điện thoại <span className="text-red-500">*</span>
                                                        </label>
                                                        <Input
                                                            placeholder="Nhập số điện thoại"
                                                            value={khoaFormData.SDT}
                                                            onChange={(e) =>
                                                                setKhoaFormData({ ...khoaFormData, SDT: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-2 block">
                                                            Mô tả <span className="text-red-500">*</span>
                                                        </label>
                                                        <textarea
                                                            className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Nhập mô tả khoa"
                                                            value={khoaFormData.moTa}
                                                            onChange={(e) =>
                                                                setKhoaFormData({ ...khoaFormData, moTa: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1"
                                                            onClick={() => {
                                                                setShowAddKhoaForm(false)
                                                                setEditingKhoa(null)
                                                            }}
                                                        >
                                                            Hủy
                                                        </Button>
                                                        <Button
                                                            variant="gradient"
                                                            className="flex-1"
                                                            onClick={handleSaveKhoa}
                                                        >
                                                            {editingKhoa ? 'Cập nhật' : 'Thêm khoa'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : selectedKhoa ? (
                                        <Card className="flex flex-col h-full max-h-full overflow-hidden">
                                            <CardHeader className="flex-shrink-0">
                                                <CardTitle className="text-lg font-semibold">
                                                    Bác sĩ - {selectedKhoa.tenKhoa}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-1 overflow-y-auto">
                                                {doctorsOfSelectedKhoa.length === 0 ? (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                                        <p>Khoa này chưa có bác sĩ nào</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3 pr-2">
                                                        {doctorsOfSelectedKhoa.map((bacSi) => (
                                                            <Card key={bacSi._id} className="p-4">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-800 mb-2">
                                                                        {bacSi.tenBS}
                                                                    </h4>
                                                                    <div className="space-y-1 text-sm text-gray-600">
                                                                        <p>📧 {bacSi.email}</p>
                                                                        <p>📞 {bacSi.SDT}</p>
                                                                        <p>🎂 {new Date(bacSi.ngaySinh).toLocaleDateString('vi-VN')}</p>
                                                                        <p>📍 {bacSi.diaChi}</p>
                                                                        <p>
                                                                            {bacSi.gioiTinh === 'Nam' ? '👨' : '👩'} {bacSi.gioiTinh}
                                                                        </p>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <span
                                                                            className={`px-2 py-1 rounded text-xs font-medium ${bacSi.isActive
                                                                                    ? 'bg-green-100 text-green-800'
                                                                                    : 'bg-gray-100 text-gray-800'
                                                                                }`}
                                                                        >
                                                                            {bacSi.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="h-full">
                                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                                <Building2 className="w-16 h-16 text-gray-400 mb-4" />
                                                <p className="text-gray-500 mb-2">Chưa chọn khoa</p>
                                                <p className="text-sm text-gray-400">
                                                    Click vào một khoa để xem danh sách bác sĩ
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Backgound>
    )
}

export default DoctorManagement