import Backgound from '@/components/ui/Backgound'
import DoctorHeader from '@/components/ui/DoctorHeader'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Edit,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Stethoscope,
  Camera,
  XCircle
} from 'lucide-react'
import { doctorService } from '@/services/doctorService'
import { khoaService } from '@/services/khoaService'

const DoctorProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [doctorInfo, setDoctorInfo] = useState(null)
  const [khoaList, setKhoaList] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = React.useRef(null)

  const [formData, setFormData] = useState({
    tenBS: '',
    email: '',
    SDT: '',
    ngaySinh: '',
    diaChi: '',
    gioiTinh: 'Nam',
    khoaId: '',
    imgURL: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

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
        let doctorId = user.BacSi || user.bacSi

        if (!doctorId && user.profile && user.profile._id) {
          doctorId = user.profile._id
        }

        if (!doctorId) {
          toast.error('Không tìm thấy thông tin bác sĩ!')
          return
        }

        // Load thông tin bác sĩ
        const doctorResponse = await doctorService.getDoctorID(doctorId)
        if (doctorResponse.data) {
          const doctor = doctorResponse.data
          setDoctorInfo(doctor)
          setFormData({
            tenBS: doctor.tenBS || '',
            email: doctor.email || '',
            SDT: doctor.SDT || '',
            ngaySinh: doctor.ngaySinh ? new Date(doctor.ngaySinh).toISOString().split('T')[0] : '',
            diaChi: doctor.diaChi || '',
            gioiTinh: doctor.gioiTinh || 'Nam',
            khoaId: doctor.Khoa?._id || doctor.Khoa || '',
            imgURL: doctor.imgURL || ''
          })
          setImagePreview(null) // Reset preview khi load lại
        }

        // Load danh sách khoa từ MongoDB
        const khoaResponse = await khoaService.getAllKhoa()
        console.log('Khoa response:', khoaResponse)
        // Backend trả về trực tiếp array hoặc { data: [...] }
        if (khoaResponse) {
          if (Array.isArray(khoaResponse)) {
            // Backend trả về trực tiếp array
            setKhoaList(khoaResponse)
          } else if (khoaResponse.data && Array.isArray(khoaResponse.data)) {
            // Backend trả về { data: [...] }
            setKhoaList(khoaResponse.data)
          } else if (khoaResponse.data && Array.isArray(khoaResponse.data.data)) {
            // Nested data
            setKhoaList(khoaResponse.data.data)
          } else {
            console.warn('Unexpected khoa response format:', khoaResponse)
            setKhoaList([])
          }
        } else {
          setKhoaList([])
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        toast.error('Vui lòng đăng nhập lại!')
        navigate('/')
        return
      }

      const user = JSON.parse(userStr)
      let doctorId = user.BacSi || user.bacSi

      if (!doctorId && user.profile && user.profile._id) {
        doctorId = user.profile._id
      }

      if (!doctorId) {
        toast.error('Không tìm thấy thông tin bác sĩ!')
        return
      }

      const updateData = {
        tenBS: formData.tenBS,
        email: formData.email,
        SDT: formData.SDT,
        ngaySinh: formData.ngaySinh,
        diaChi: formData.diaChi,
        gioiTinh: formData.gioiTinh,
        khoaId: formData.khoaId,
        imgURL: formData.imgURL
      }

      const response = await doctorService.updateDoctor(doctorId, updateData)
      if (response.data) {
        toast.success(response.message || 'Cập nhật thông tin thành công!')
        setIsEditing(false)
        setImagePreview(null) // Reset preview sau khi lưu
        // Reload data
        const doctorResponse = await doctorService.getDoctorID(doctorId)
        if (doctorResponse.data) {
          setDoctorInfo(doctorResponse.data)
          setFormData(prev => ({
            ...prev,
            imgURL: doctorResponse.data.imgURL || prev.imgURL
          }))
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin!')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!')
      return
    }

    try {
      setLoading(true)
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        toast.error('Vui lòng đăng nhập lại!')
        navigate('/')
        return
      }

      const user = JSON.parse(userStr)
      const userId = user._id || user.id

      if (!userId) {
        toast.error('Không tìm thấy thông tin user!')
        return
      }

      const response = await doctorService.changePassword(userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })

      if (response.success) {
        toast.success(response.message || 'Đổi mật khẩu thành công!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error.response?.data?.message || error.message || 'Đổi mật khẩu thất bại!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (doctorInfo) {
      setFormData({
        tenBS: doctorInfo.tenBS || '',
        email: doctorInfo.email || '',
        SDT: doctorInfo.SDT || '',
        ngaySinh: doctorInfo.ngaySinh ? new Date(doctorInfo.ngaySinh).toISOString().split('T')[0] : '',
        diaChi: doctorInfo.diaChi || '',
        gioiTinh: doctorInfo.gioiTinh || 'Nam',
        khoaId: doctorInfo.Khoa?._id || doctorInfo.Khoa || '',
        imgURL: doctorInfo.imgURL || ''
      })
    }
    setImagePreview(null)
    setIsEditing(false)
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh!')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB!')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      setImagePreview(base64String)
      setFormData(prev => ({
        ...prev,
        imgURL: base64String
      }))
      toast.success('Đã chọn ảnh thành công!')
    }
    reader.onerror = () => {
      toast.error('Có lỗi xảy ra khi đọc file!')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData(prev => ({
      ...prev,
      imgURL: ''
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Đã xóa ảnh!')
  }

  const handleChooseImage = () => {
    fileInputRef.current?.click()
  }

  return (
    <Backgound>
      <DoctorHeader />
      <div className="flex-1 h-full overflow-auto hide-scrollbar">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ bác sĩ</h1>
              <p className="text-gray-600">Quản lý thông tin cá nhân và tài khoản của bạn</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
              </TabsList>

              {/* Tab Thông tin cá nhân */}
              <TabsContent value="profile">
                <Card className="shadow-lg border-2 border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 border-b-2 border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Stethoscope className="w-6 h-6 text-blue-600" />
                          Thông tin bác sĩ
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Quản lý thông tin cá nhân của bạn
                        </CardDescription>
                      </div>
                      {!isEditing && (
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {loading && !isEditing ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6 pb-6 border-b">
                          <div className="relative">
                            <Avatar className="w-24 h-24 border-4 border-blue-200">
                              <AvatarImage src={imagePreview || formData.imgURL} alt={formData.tenBS} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                                {formData.tenBS?.charAt(0) || 'BS'}
                              </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                              <>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageSelect}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={handleChooseImage}
                                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700 shadow-lg border-2 border-white"
                                  title="Chọn ảnh đại diện"
                                >
                                  <Camera className="w-4 h-4" />
                                </Button>
                                {(imagePreview || formData.imgURL) && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-red-500 hover:bg-red-600 shadow-lg border-2 border-white"
                                    title="Xóa ảnh"
                                  >
                                    <XCircle className="w-3 h-3" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{formData.tenBS}</h3>
                            <p className="text-gray-600 flex items-center gap-2 mt-1">
                              <Building2 className="w-4 h-4" />
                              {khoaList.find(k => k._id === formData.khoaId)?.tenKhoa || doctorInfo?.Khoa?.tenKhoa || 'N/A'}
                            </p>
                            {isEditing && (
                              <p className="text-xs text-gray-500 mt-2">
                                Nhấn vào biểu tượng camera để chọn ảnh đại diện
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="tenBS" className="flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-600" />
                              Họ và tên <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="tenBS"
                              name="tenBS"
                              value={formData.tenBS}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              required
                              className="h-11"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-blue-600" />
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              required
                              className="h-11"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="SDT" className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-blue-600" />
                              Số điện thoại <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="SDT"
                              name="SDT"
                              value={formData.SDT}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              required
                              className="h-11"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="ngaySinh" className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              Ngày sinh <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="ngaySinh"
                              name="ngaySinh"
                              type="date"
                              value={formData.ngaySinh}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              required
                              className="h-11"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gioiTinh" className="flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-600" />
                              Giới tính <span className="text-red-500">*</span>
                            </Label>
                            <select
                              id="gioiTinh"
                              name="gioiTinh"
                              value={formData.gioiTinh}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              required
                              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                              <option value="Khác">Khác</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="khoaId" className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              Khoa <span className="text-red-500">*</span>
                            </Label>
                            <select
                              id="khoaId"
                              name="khoaId"
                              value={formData.khoaId}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              required
                              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="">-- Chọn khoa --</option>
                              {khoaList.map((khoa) => (
                                <option key={khoa._id} value={khoa._id}>
                                  {khoa.tenKhoa}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="diaChi" className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              Địa chỉ
                            </Label>
                            <Input
                              id="diaChi"
                              name="diaChi"
                              value={formData.diaChi}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="h-11"
                            />
                          </div>

                        </div>

                        {isEditing && (
                          <div className="flex gap-3 pt-4 border-t">
                            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                              <Save className="w-4 h-4 mr-2" />
                              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                            <Button type="button" onClick={handleCancel} variant="outline">
                              <X className="w-4 h-4 mr-2" />
                              Hủy
                            </Button>
                          </div>
                        )}
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Đổi mật khẩu */}
              <TabsContent value="password">
                <Card className="shadow-lg border-2 border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50 border-b-2 border-blue-100">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Lock className="w-6 h-6 text-blue-600" />
                      Đổi mật khẩu
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Thay đổi mật khẩu đăng nhập của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-blue-600" />
                          Mật khẩu hiện tại <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="h-11 pr-10"
                            placeholder="Nhập mật khẩu hiện tại"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-blue-600" />
                          Mật khẩu mới <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            className="h-11 pr-10"
                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                            minLength={6}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-blue-600" />
                          Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            className="h-11 pr-10"
                            placeholder="Nhập lại mật khẩu mới"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t">
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                          variant="outline"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Hủy
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Backgound>
  )
}

export default DoctorProfile

