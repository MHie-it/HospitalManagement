import { Card } from '@/components/ui/card'
import React from 'react'

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
        <div className="w-full max-w-md bg-white bg-opacity-80 rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Đăng nhập ở đây</h2>
        </div>
        <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg "></Card>
      </div>
    </div>
  )
}

export default LoginPage
