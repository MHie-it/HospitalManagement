  import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MailIcon, X, KeyRound } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { authService } from '@/services/authService'

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // States cho quên mật khẩu
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

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
      const errorMessage = error.response?.data?.message || error.message || "Đăng nhập thất bại!";
      toast.error(errorMessage);
      console.error("Lỗi đăng nhập:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý quên mật khẩu
  const handleForgotPassword = async (e) => {
    e?.preventDefault();

    if (!forgotUsername.trim()) {
      toast.error("Vui lòng nhập username!");
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Vui lòng nhập mật khẩu mới!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setForgotLoading(true);

    try {
      const response = await authService.forgotPassword(
        forgotUsername.trim(),
        newPassword
      );

      if (response.success) {
        toast.success(response.message || "Đặt lại mật khẩu thành công!");
        
        // Đóng modal và reset form
        setShowForgotPassword(false);
        setForgotUsername('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      // Xử lý error message từ API
      // Ưu tiên lấy message từ error.response.data.message, sau đó error.message
      let errorMessage = "Có lỗi xảy ra!";
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      console.error("Lỗi quên mật khẩu:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", errorMessage);
    } finally {
      setForgotLoading(false);
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

            <p className="text-left text-m mt-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </p>
            <p className="text-left text-m ">Bạn chưa có tài khoản?
              <Link to="/register"
                className="ml-2 hover:color-red">
                Đăng ký ngay!
              </Link>
            </p>

          </Card>

          {/* Modal Quên mật khẩu */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md p-6 relative">
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotUsername('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <KeyRound className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Quên mật khẩu</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  Vui lòng nhập username và mật khẩu mới của bạn.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgotUsername">Username <span className="text-red-500">*</span></Label>
                    <Input
                      id="forgotUsername"
                      type="text"
                      placeholder="Nhập username"
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      className="w-full"
                      disabled={forgotLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới <span className="text-red-500">*</span></Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full"
                      disabled={forgotLoading}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full"
                      disabled={forgotLoading}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotUsername('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      disabled={forgotLoading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default LoginPage
