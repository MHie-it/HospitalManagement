import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Mail, MailIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { authService } from '@/services/authService'

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault(); // Nếu gọi từ form submit

    // Validation
    if (!username.trim() || !password.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(username, password);

      if (response.success) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token || 'temp-token'); // Nếu có JWT token
        
        toast.success(response.message || "Đăng nhập thành công!");

        const userType = response.user.userType;
        if (userType === 'User') {
          navigate("/userpage");
        } else if (userType === 'Doctor') {
          navigate("/doctorhome");
        } else if (userType === 'Admin') {
          navigate("/admin");
        }


      }
    } catch (error) {
      // Hiển thị lỗi từ server
      toast.error(error.message || "Đăng nhập thất bại!");
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setLoading(false);
    }
  };
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" mt-4 w-full px-4 pt-2 border border-gray-300 roynder-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
              disabled={loading}
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
              // onClick={() => {
              //   toast.success("Đăng nhập thành công!");
              //   navigate("/admin");
              // }}
              onClick={handleLogin}
              disabled={loading}
            >
              Đăng nhập
            </Button>

            <p className="text-left text-m">Quên mật khẩu?</p>
            <p className="text-left text-m ">Bạn chưa có tài khoản?
              <Link to="/register"
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
