import React, { useState } from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Ban, CheckCircle, XCircle, Filter, X } from 'lucide-react'
import { toast } from 'sonner'



const AccountManagement = () => {
  // Dữ liệu cứng - Danh sách tài khoản
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      username: 'bsnoi01',
      hoTen: 'Nguyễn Văn A',
      email: 'bsnoi01@hospital.com',
      SDT: '0987654321',
      role: 'Doctor',
      khoa: 'Khoa Nội',
      khoaId: '6918c2e05ec3116888624202',
      isActive: true,
      ngayTao: '2024-01-15'
    },
    {
      id: 2,
      username: 'bsngoai01',
      hoTen: 'Trần Thị B',
      email: 'bsngoai01@hospital.com',
      SDT: '0987654322',
      role: 'Doctor',
      khoa: 'Khoa Ngoại',
      khoaId: '6918c2e05ec3116888624203',
      isActive: true,
      ngayTao: '2024-01-16'
    },
    {
      id: 3,
      username: 'user01',
      hoTen: 'Lê Văn C',
      email: 'user01@gmail.com',
      SDT: '0987654323',
      role: 'User',
      khoa: '-',
      khoaId: null,
      isActive: true,
      ngayTao: '2024-01-17'
    },
    {
      id: 4,
      username: 'admin',
      hoTen: 'Admin System',
      email: 'admin@hospital.com',
      SDT: '0987654324',
      role: 'Admin',
      khoa: '-',
      khoaId: null,
      isActive: true,
      ngayTao: '2024-01-10'
    },
    {
      id: 5,
      username: 'bsnoi02',
      hoTen: 'Phạm Văn D',
      email: 'bsnoi02@hospital.com',
      SDT: '0987654325',
      role: 'Doctor',
      khoa: 'Khoa Nội',
      khoaId: '6918c2e05ec3116888624202',
      isActive: false,
      ngayTao: '2024-01-18'
    }
  ])

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKhoa, setFilterKhoa] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // State cho form thêm tài khoản (không dùng Dialog)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccount, setNewAccount] = useState({
    username: '',
    hoTen: '',
    email: '',
    SDT: '',
    role: 'User',
    khoaId: '',
    password: ''
  })

  // Danh sách khoa (dữ liệu cứng)
  const khoaList = [
    { id: '6918c2e05ec3116888624202', tenKhoa: 'Khoa Nội' },
    { id: '6918c2e05ec3116888624203', tenKhoa: 'Khoa Ngoại' },
    { id: '6918c2e05ec3116888624204', tenKhoa: 'Khoa Sản' },
    { id: '6918c2e05ec3116888624205', tenKhoa: 'Khoa Nhi' }
  ]

  // Lọc danh sách tài khoản
  const filteredAccounts = accounts.filter(account => {
    const matchSearch =
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.SDT.includes(searchTerm)

    const matchKhoa = filterKhoa === 'all' || account.khoaId === filterKhoa
    const matchRole = filterRole === 'all' || account.role === filterRole
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && account.isActive) ||
      (filterStatus === 'inactive' && !account.isActive)

    return matchSearch && matchKhoa && matchRole && matchStatus
  })

  // Hàm thêm tài khoản mới
    // Hàm thêm tài khoản mới
  const handleAddAccount = () => {
    // Validation
    if (!newAccount.username || !newAccount.tenBS || !newAccount.email || !newAccount.SDT || !newAccount.ngaySinh || !newAccount.diaChi) {
      toast.error('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    // Kiểm tra username đã tồn tại
    if (accounts.some(acc => acc.username === newAccount.username)) {
      toast.error('Username đã tồn tại!')
      return
    }

    // Kiểm tra email đã tồn tại
    if (accounts.some(acc => acc.email === newAccount.email)) {
      toast.error('Email đã tồn tại!')
      return
    }

    // Kiểm tra SDT đã tồn tại
    if (accounts.some(acc => acc.SDT === newAccount.SDT)) {
      toast.error('Số điện thoại đã tồn tại!')
      return
    }

    // Nếu là Doctor thì phải chọn khoa
    if (newAccount.role === 'Doctor' && !newAccount.khoaId) {
      toast.error('Vui lòng chọn khoa cho bác sĩ!')
      return
    }

    // Tìm tên khoa
    const khoa = khoaList.find(k => k._id === newAccount.khoaId || k.id === newAccount.khoaId)
    const khoaName = khoa ? khoa.tenKhoa : '-'

    // Thêm tài khoản mới
    const accountToAdd = {
      id: accounts.length + 1,
      username: newAccount.username,
      hoTen: newAccount.tenBS, // Giữ hoTen cho hiển thị
      tenBS: newAccount.tenBS,
      email: newAccount.email,
      SDT: newAccount.SDT,
      ngaySinh: newAccount.ngaySinh,
      diaChi: newAccount.diaChi,
      gioiTinh: newAccount.gioiTinh,
      role: newAccount.role || 'User',
      khoa: khoaName,
      khoaId: newAccount.khoaId || null,
      isActive: true,
      ngayTao: new Date().toISOString().split('T')[0]
    }

    setAccounts([...accounts, accountToAdd])
    toast.success('Thêm tài khoản thành công!')

    // Reset form và đóng form
    setNewAccount({
      username: '',
      tenBS: '',
      email: '',
      SDT: '',
      ngaySinh: '',
      diaChi: '',
      gioiTinh: 'Nam',
      khoaId: '',
      password: ''
    })
    setShowAddForm(false)
  }

  // Hàm đình chỉ/kích hoạt tài khoản
  const handleToggleActive = (id) => {
    const account = accounts.find(acc => acc.id === id)
    const newStatus = !account.isActive

    setAccounts(accounts.map(account =>
      account.id === id
        ? { ...account, isActive: newStatus }
        : account
    ))

    if (newStatus) {
      toast.success(`Đã kích hoạt tài khoản ${account.username}`)
    } else {
      toast.success(`Đã đình chỉ tài khoản ${account.username}`)
    }
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
          <Card className="h-full max-h-full overflow-hidden flex flex-col">
            <CardHeader >
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Quản lý tài khoản
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Quản lý và theo dõi tất cả tài khoản trong hệ thống
                  </p>
                </div>
                <Button
                  variant="gradient"
                  className="flex items-center gap-2"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus className="w-4 h-4" />
                  {showAddForm ? 'Đóng form' : 'Thêm tài khoản'}
                </Button>
              </div>
            </CardHeader>

            <CardContent >
              {/* Form thêm tài khoản - Hiển thị/ẩn đơn giản (không dùng Dialog) */}

              {showAddForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Thêm tài khoản mới</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddForm(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Nhập username"
                          value={newAccount.username}
                          onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tên bác sĩ <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Nhập tên bác sĩ"
                          value={newAccount.tenBS}
                          onChange={(e) => setNewAccount({ ...newAccount, tenBS: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="Nhập email"
                          value={newAccount.email}
                          onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Nhập số điện thoại"
                          value={newAccount.SDT}
                          onChange={(e) => setNewAccount({ ...newAccount, SDT: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={newAccount.ngaySinh}
                          onChange={(e) => setNewAccount({ ...newAccount, ngaySinh: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newAccount.gioiTinh}
                          onChange={(e) => setNewAccount({ ...newAccount, gioiTinh: e.target.value })}
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Địa chỉ <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Nhập địa chỉ"
                        value={newAccount.diaChi}
                        onChange={(e) => setNewAccount({ ...newAccount, diaChi: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Vai trò <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newAccount.role || 'User'}
                          onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value, khoaId: e.target.value !== 'Doctor' ? '' : newAccount.khoaId })}
                        >
                          <option value="User">User</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      {newAccount.role === 'Doctor' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Khoa <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newAccount.khoaId}
                            onChange={(e) => setNewAccount({ ...newAccount, khoaId: e.target.value })}
                          >
                            <option value="">Chọn khoa</option>
                            {khoaList.map(khoa => (
                              <option key={khoa._id || khoa.id} value={khoa._id || khoa.id}>
                                {khoa.tenKhoa}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Mật khẩu
                      </label>
                      <Input
                        type="password"
                        placeholder="Để trống sẽ dùng mật khẩu mặc định"
                        value={newAccount.password}
                        onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Mật khẩu mặc định: hospitalHappy
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        Hủy
                      </Button>
                      <Button variant="gradient" onClick={handleAddAccount}>
                        Thêm tài khoản
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Thống kê */}
              <div className="mb-4 grid grid-cols-4 gap-4">
                <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-600 font-medium">Tổng số</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {filteredAccounts.length}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">tài khoản</div>
                </div>
                <div className="bg-green-50 px-4 py-3 rounded-lg border border-green-100">
                  <div className="text-sm text-green-600 font-medium">Hoạt động</div>
                  <div className="text-2xl font-bold text-green-700 mt-1">
                    {filteredAccounts.filter(a => a.isActive).length}
                  </div>
                  <div className="text-xs text-green-500 mt-1">tài khoản</div>
                </div>
                <div className="bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                  <div className="text-sm text-red-600 font-medium">Đình chỉ</div>
                  <div className="text-2xl font-bold text-red-700 mt-1">
                    {filteredAccounts.filter(a => !a.isActive).length}
                  </div>
                  <div className="text-xs text-red-500 mt-1">tài khoản</div>
                </div>
                <div className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-100">
                  <div className="text-sm text-purple-600 font-medium">Bác sĩ</div>
                  <div className="text-2xl font-bold text-purple-700 mt-1">
                    {filteredAccounts.filter(a => a.role === 'Doctor').length}
                  </div>
                  <div className="text-xs text-purple-500 mt-1">tài khoản</div>
                </div>
              </div>
              {/* end thống kê */}

              {/* Thanh tìm kiếm và lọc */}
              <div className="mb-6 space-y-4">
                {/* Tìm kiếm */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Tìm kiếm theo username, họ tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Bộ lọc */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Filter className="w-4 h-4" />
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
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Lọc theo vai trò</label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="all">Tất cả vai trò</option>
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Lọc theo trạng thái</label>
                    <select
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Tất cả</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Đình chỉ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bảng danh sách tài khoản */}
              <div className="overflow-auto border rounded-lg max-h-[300px] hide-scrollbar">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">STT</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Username</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Họ tên</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Email</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">SĐT</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Vai trò</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Khoa</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Trạng thái</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Ngày tạo</th>
                      <th className="p-3 text-left font-semibold text-sm text-gray-700">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="p-8 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-lg">Không tìm thấy tài khoản nào</p>
                            <p className="text-sm text-gray-400">
                              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAccounts.map((account, index) => (
                        <tr
                          key={account.id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3 text-sm">{index + 1}</td>
                          <td className="p-3">
                            <span className="font-medium text-gray-900">{account.username}</span>
                          </td>
                          <td className="p-3 text-sm">{account.hoTen}</td>
                          <td className="p-3 text-sm text-gray-600">{account.email}</td>
                          <td className="p-3 text-sm text-gray-600">{account.SDT}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${account.role === 'Admin' ? 'bg-red-100 text-red-800' :
                              account.role === 'Doctor' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                              {account.role}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{account.khoa}</td>
                          <td className="p-3">
                            {account.isActive ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Hoạt động
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600 text-sm">
                                <XCircle className="w-4 h-4" />
                                Đình chỉ
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-sm text-gray-600">{account.ngayTao}</td>
                          <td className="p-3">
                            <Button
                              variant={account.isActive ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleToggleActive(account.id)}
                              className="flex items-center gap-1"
                            >
                              <Ban className="w-4 h-4" />
                              {account.isActive ? 'Đình chỉ' : 'Kích hoạt'}
                            </Button>
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
    </Backgound>
  )
}

export default AccountManagement