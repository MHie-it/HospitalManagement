import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Mail, MailIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

const LoginPage = () => {
  return (
    <div className="relative min-h-screen w-screen bg-white overflow-hidden">
      {/* Soft Blue Radial Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at top center, rgba(59, 130, 246, 0.5), transparent 70%)
          `,
          backgroundColor: "#ffffff",
        }}
      />

      {/* Nội dung chính */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md ">
          <Card className="px-12 py-6  border-0 bg-white shadow-custom-lg g-2 ">
            <h2 className="text-2xl font-bold text-blue-600 text-center">
              HOSPITAL HAPPY
            </h2>
            <p className="text-xl font-semibold text-gray-800 text-center ">
              Sức khỏe của bạn, sức mệnh của chúng tôi.
            </p>
            {/* đăng nhập */}
            <Input
              type="text"
              placeholder="Username"
              className=" mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="Password"
              placeholder="Password"
              className=" mt-4 w-full px-4 pt-2 border border-gray-300 roynder-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            <Button
              variant="gradient"
              size="lg"
              className="w-full mt-4 flex items-center justify-center gap-2"
            >
              <MailIcon />
              Đăng nhập bằng Gmail
            </Button>

            <Button
              variant="gradient"
              size="lg"
              className="w-full mt-4  "
            >
              Đăng nhập
            </Button>

            <p className="text-left text-m">Quên mật khẩu?</p>
            <p className="text-left text-m ">Bạn chưa có tài khoản?  
              <Link to ="/register"
              className="ml-2 hover:color-red">
                Đăng ký ngay!
              </Link>
              </p>

          </Card>

        </div>

      </div>
    </div>
  )
}

export default LoginPage
