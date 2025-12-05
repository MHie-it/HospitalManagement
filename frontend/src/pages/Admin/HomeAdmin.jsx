import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'
import {
  Users,
  UserCheck,
  Building2,
  Activity,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Stethoscope,
  BedDouble,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Heart,
  AlertCircle
} from 'lucide-react'

const HomeAdmin = () => {
  // Dữ liệu cứng - Thống kê tổng quan
  const [statistics] = useState({
    // Lượt truy cập
    luotTruyCap: {
      hienTai: 12580,
      thangTruoc: 11200,
      tangTruong: 12.3
    },
    // Lượt sử dụng dịch vụ
    luotSuDungDichVu: {
      hienTai: 3450,
      thangTruoc: 3200,
      tangTruong: 7.8
    },
    // Tổng số bệnh nhân
    tongBenhNhan: {
      hienTai: 8560,
      thangTruoc: 8200,
      tangTruong: 4.4
    },
    // Tổng số bác sĩ
    tongBacSi: {
      hienTai: 156,
      thangTruoc: 150,
      tangTruong: 4.0
    },
    // Tổng số khoa
    tongKhoa: {
      hienTai: 12,
      thangTruoc: 12,
      tangTruong: 0
    },
    // Số lịch hẹn
    soLichHen: {
      hienTai: 1240,
      thangTruoc: 1180,
      tangTruong: 5.1
    },
    // Doanh thu (triệu VND)
    doanhThu: {
      hienTai: 12500,
      thangTruoc: 11500,
      tangTruong: 8.7
    },
    // Tỷ lệ sử dụng giường bệnh (%)
    tyLeSuDungGiuong: {
      hienTai: 78.5,
      thangTruoc: 75.2,
      tangTruong: 4.4
    }
  })

  // Dữ liệu cứng - Dịch vụ được sử dụng nhiều nhất
  const [topServices] = useState([
    { id: 1, tenDV: 'Khám tổng quát', soLuot: 1250, doanhThu: 250000000 },
    { id: 2, tenDV: 'Xét nghiệm máu', soLuot: 980, doanhThu: 147000000 },
    { id: 3, tenDV: 'Nội soi dạ dày', soLuot: 450, doanhThu: 360000000 },
    { id: 4, tenDV: 'Siêu âm', soLuot: 720, doanhThu: 216000000 },
    { id: 5, tenDV: 'Chụp X-quang', soLuot: 680, doanhThu: 136000000 }
  ])

  // Dữ liệu cứng - Hoạt động gần đây
  const [recentActivities] = useState([
    { id: 1, thoiGian: '10 phút trước', hoatDong: 'Bệnh nhân mới đăng ký', loai: 'success' },
    { id: 2, thoiGian: '25 phút trước', hoatDong: 'Lịch hẹn mới được tạo', loai: 'info' },
    { id: 3, thoiGian: '1 giờ trước', hoatDong: 'Thanh toán dịch vụ thành công', loai: 'success' },
    { id: 4, thoiGian: '2 giờ trước', hoatDong: 'Bác sĩ mới được thêm vào hệ thống', loai: 'info' },
    { id: 5, thoiGian: '3 giờ trước', hoatDong: 'Cảnh báo thiết bị cần bảo dưỡng', loai: 'warning' },
    { id: 6, thoiGian: '4 giờ trước', hoatDong: 'Dịch vụ mới được thêm', loai: 'success' }
  ])

  // Dữ liệu cứng - Thống kê theo khoa
  const [statsByKhoa] = useState([
    { tenKhoa: 'Khoa Nội', soBenhNhan: 1250, soBacSi: 25, doanhThu: 2500000000 },
    { tenKhoa: 'Khoa Ngoại', soBenhNhan: 980, soBacSi: 20, doanhThu: 3200000000 },
    { tenKhoa: 'Khoa Nhi', soBenhNhan: 1450, soBacSi: 30, doanhThu: 1800000000 },
    { tenKhoa: 'Khoa Sản', soBenhNhan: 720, soBacSi: 15, doanhThu: 1500000000 },
    { tenKhoa: 'Khoa Cấp Cứu', soBenhNhan: 2100, soBacSi: 35, doanhThu: 4200000000 }
  ])

  // Hàm format số
  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  // Hàm format tiền
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num)
  }

  // Component thẻ thống kê
  const StatCard = ({ title, value, previousValue, growth, icon: Icon, iconColor, trend }) => {
    const isPositive = growth >= 0
    const TrendIcon = isPositive ? TrendingUp : TrendingDown

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${iconColor}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{Math.abs(growth).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{formatNumber(value)}</p>
            {previousValue && (
              <p className="text-xs text-gray-500 mt-1">
                Tháng trước: {formatNumber(previousValue)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Backgound>
      <div className="flex w-full h-screen m-0 p-0 overflow-hidden">
        <div className="w-[250px] flex-shrink-0">
          <Dashboard />
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
           

            {/* Thống kê chính - 4 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Lượt truy cập"
                value={statistics.luotTruyCap.hienTai}
                previousValue={statistics.luotTruyCap.thangTruoc}
                growth={statistics.luotTruyCap.tangTruong}
                icon={Eye}
                iconColor="bg-blue-500"
                trend={true}
              />
              <StatCard
                title="Lượt sử dụng dịch vụ"
                value={statistics.luotSuDungDichVu.hienTai}
                previousValue={statistics.luotSuDungDichVu.thangTruoc}
                growth={statistics.luotSuDungDichVu.tangTruong}
                icon={Activity}
                iconColor="bg-green-500"
                trend={true}
              />
              <StatCard
                title="Tổng số bệnh nhân"
                value={statistics.tongBenhNhan.hienTai}
                previousValue={statistics.tongBenhNhan.thangTruoc}
                growth={statistics.tongBenhNhan.tangTruong}
                icon={Users}
                iconColor="bg-purple-500"
                trend={true}
              />
              <StatCard
                title="Tổng số bác sĩ"
                value={statistics.tongBacSi.hienTai}
                previousValue={statistics.tongBacSi.thangTruoc}
                growth={statistics.tongBacSi.tangTruong}
                icon={Stethoscope}
                iconColor="bg-indigo-500"
                trend={true}
              />
            </div>

            {/* Thống kê phụ - 4 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Tổng số khoa"
                value={statistics.tongKhoa.hienTai}
                previousValue={statistics.tongKhoa.thangTruoc}
                growth={statistics.tongKhoa.tangTruong}
                icon={Building2}
                iconColor="bg-orange-500"
                trend={true}
              />
              <StatCard
                title="Số lịch hẹn"
                value={statistics.soLichHen.hienTai}
                previousValue={statistics.soLichHen.thangTruoc}
                growth={statistics.soLichHen.tangTruong}
                icon={Calendar}
                iconColor="bg-pink-500"
                trend={true}
              />
              <StatCard
                title="Doanh thu (triệu VND)"
                value={statistics.doanhThu.hienTai}
                previousValue={statistics.doanhThu.thangTruoc}
                growth={statistics.doanhThu.tangTruong}
                icon={DollarSign}
                iconColor="bg-emerald-500"
                trend={true}
              />
              <StatCard
                title="Tỷ lệ sử dụng giường (%)"
                value={statistics.tyLeSuDungGiuong.hienTai}
                previousValue={statistics.tyLeSuDungGiuong.thangTruoc}
                growth={statistics.tyLeSuDungGiuong.tangTruong}
                icon={BedDouble}
                iconColor="bg-cyan-500"
                trend={true}
              />
            </div>

            {/* 2 cột: Top dịch vụ và Hoạt động gần đây */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Top dịch vụ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Dịch vụ được sử dụng nhiều nhất
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topServices.map((service, index) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{service.tenDV}</p>
                            <p className="text-sm text-gray-500">
                              {formatNumber(service.soLuot)} lượt sử dụng
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            {formatCurrency(service.doanhThu)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hoạt động gần đây */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Hoạt động gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => {
                      const getIcon = () => {
                        switch (activity.loai) {
                          case 'success':
                            return <UserCheck className="w-4 h-4 text-green-600" />
                          case 'warning':
                            return <AlertCircle className="w-4 h-4 text-yellow-600" />
                          default:
                            return <FileText className="w-4 h-4 text-blue-600" />
                        }
                      }
                      const getBgColor = () => {
                        switch (activity.loai) {
                          case 'success':
                            return 'bg-green-50 border-green-200'
                          case 'warning':
                            return 'bg-yellow-50 border-yellow-200'
                          default:
                            return 'bg-blue-50 border-blue-200'
                        }
                      }

                      return (
                        <div
                          key={activity.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${getBgColor()}`}
                        >
                          <div className="mt-0.5">{getIcon()}</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {activity.hoatDong}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{activity.thoiGian}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Thống kê theo khoa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  Thống kê theo khoa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold text-gray-700">Khoa</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Số bệnh nhân</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Số bác sĩ</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsByKhoa.map((khoa, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="font-medium text-gray-800">{khoa.tenKhoa}</span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-600">{formatNumber(khoa.soBenhNhan)}</td>
                          <td className="p-3 text-gray-600">{formatNumber(khoa.soBacSi)}</td>
                          <td className="p-3 font-semibold text-green-600">
                            {formatCurrency(khoa.doanhThu)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Backgound>
  )
}

export default HomeAdmin