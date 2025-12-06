import Backgound from '@/components/ui/Backgound.jsx'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Mail, MailIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { authService } from '@/services/authService'

const RegisterPage = () => {
  const navigate = useNavigate();
  const [regis, setRegis] = useState({
    username: '',
    password: '',
    hoTen: '',
    email: '',
    SDT: '',
    ngaySinh: '',
    diaChi: '',
    gioiTinh: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegis(prev => ({
      ...prev,
      [name]: value
    }))
  };

  const validateForm = () => {
    if (!regis.username.trim() || !regis.password.trim() || !regis.hoTen || !regis.email.trim() || !regis.SDT.trim() || !regis.ngaySinh || !regis.diaChi || !regis.gioiTinh) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return false;
    }

    if (regis.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }

    if (regis.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/
      if (!emailRegex.test(regis.email)) {
        toast.error("Địa chỉ email không hợp lệ.");
        return false;
      }
    }

    if (regis.SDT) {
      const phoneRegex = /^(0|\+84)[0-9]{9}$/
      if (!phoneRegex.test(regis.SDT)) {
        toast.error("Số điện thoại không hợp lệ.");
        return false;
      }
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await authService.register({
        username: regis.username,
        password: regis.password,
        hoTen: regis.hoTen,
        email: regis.email || undefined,
        SDT: regis.SDT,
        ngaySinh: regis.ngaySinh,
        diaChi: regis.diaChi,
        gioiTinh: regis.gioiTinh
      })

      toast.success(response.message || 'Đăng ký thành công!')

      navigate('/')


    } catch (error) {
      // Xử lý lỗi từ API
      const errorMessage = error.message || error.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.'
      toast.error(errorMessage)
      console.error('Lỗi đăng ký:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGmailRegister = () => {
    toast.info('Tính năng đăng ký bằng Gmail đang được phát triển')
  }

  return (
    <Backgound>
      {/* Nội dung chính */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-8 px-4">
        <div className="w-full max-w-md">
          <Card className="px-8 py-8 border-0 bg-white shadow-xl rounded-2xl">
            <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">
              HOSPITAL HAPPY
            </h2>
            <p className="text-lg font-semibold text-gray-800 text-center mb-6">
              Sức khỏe của bạn, sứ mệnh của chúng tôi.
            </p>

            {/* Form đăng ký */}
            <div className="space-y-4">
              <Input
                type="text"
                name="hoTen"
                placeholder="Họ và tên"
                value={regis.hoTen}
                onChange={handleChange}
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
                required
              />

              <Input
                type="tel"
                name="SDT"
                placeholder="Số điện thoại"
                value={regis.SDT}
                onChange={handleChange}
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
                required
              />

              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={regis.username}
                onChange={handleChange}
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={regis.password}
                onChange={handleChange}
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
                required
              />

              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={regis.email}
                onChange={handleChange}
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
                required
              />

              <Input
                type="date"
                name="ngaySinh"
                placeholder="Ngày sinh"
                value={regis.ngaySinh}
                onChange={handleChange}
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
                max={new Date().toISOString().split('T')[0]}
                required
              />

              <Input
                type="text"
                name="diaChi"
                placeholder="Địa chỉ"
                value={regis.diaChi}
                onChange={handleChange}
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                disabled={loading}
                required
              />

              {/* Giới tính - Radio buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Giới tính
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gioiTinh"
                      value="Nam"
                      checked={regis.gioiTinh === 'Nam'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                      required
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                      Nam
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gioiTinh"
                      value="Nữ"
                      checked={regis.gioiTinh === 'Nữ'}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                      required
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                      Nữ
                    </span>
                  </label>
                </div>
              </div>

              <p className="text-left text-sm text-gray-600 pt-2">
                Khi bạn nhấn vào{' '}
                <span className="text-red-600 font-semibold">ĐĂNG KÝ</span>
                , đồng nghĩa với việc bạn đã đồng ý với mọi điều khoản của chúng tôi.
              </p>

              <Button
                variant="gradient"
                size="lg"
                className="w-full mt-4 h-11 font-semibold shadow-md hover:shadow-lg transition-all"
                onClick={handleSubmit}
                disabled={loading}
              >
                Đăng ký
              </Button>

              <Button
                variant="gmail"
                size="lg"
                className="w-full mt-4 h-11 font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                onClick={handleGmailRegister}
                disabled={loading}
              >
                <MailIcon className="w-5 h-5" />
                Đăng ký bằng Gmail
              </Button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Bạn đã có tài khoản?{' '}
                <Link
                  to="/"
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                >
                  Đăng nhập ngay!
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Backgound>
  )
}

export default RegisterPage