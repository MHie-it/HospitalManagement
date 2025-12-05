import Backgound from '@/components/ui/Backgound.jsx'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Mail, MailIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router'

const RegisterPage = () => {
  const [gioiTinh, setGioiTinh] = useState('')

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
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />

              <Input
                type="tel"
                name="SDT"
                placeholder="Số điện thoại"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />

              <Input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />

              <Input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />

              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />

              <Input
                type="date"
                name="ngaySinh"
                placeholder="Ngày sinh"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />

              <Input
                type="text"
                name="diaChi"
                placeholder="Địa chỉ"
                className="w-full h-11 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                      checked={gioiTinh === 'Nam'}
                      onChange={(e) => setGioiTinh(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                      checked={gioiTinh === 'Nữ'}
                      onChange={(e) => setGioiTinh(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
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
              >
                Đăng ký
              </Button>

              <Button
                variant="gmail"
                size="lg"
                className="w-full mt-4 h-11 font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MailIcon className="w-5 h-5" />
                Đăng ký bằng Gmail
              </Button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Bạn đã có tài khoản?{' '}
                <Link
                  to="/login"
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