import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useMemo, useState } from 'react'
import { Activity, Building2, Calendar, FileText, Stethoscope, Users, Wrench } from 'lucide-react'

import { authService } from '@/services/authService'
import { khoaService } from '@/services/khoaService'
import { doctorService } from '@/services/doctorService'
import { lichHenService } from '@/services/lichHenService'
import { dichVuService } from '@/services/dichVuService'
import { thietBiService } from '@/services/thietBiService'

const HomeAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [khoaList, setKhoaList] = useState([])
  const [dichVuList, setDichVuList] = useState([])
  const [doctorList, setDoctorList] = useState([])
  const [lichHenList, setLichHenList] = useState([])
  const [patientCount, setPatientCount] = useState(0)
  const [recentActivities, setRecentActivities] = useState([])

  const asArray = (v) => (Array.isArray(v) ? v : [])
  const safeNumber = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0)

  const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(safeNumber(num))
  const formatCurrency = (num) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(safeNumber(num))

  const timeAgo = (date) => {
    const t = new Date(date).getTime()
    if (!Number.isFinite(t)) return ''
    const diffSec = Math.max(0, Math.floor((Date.now() - t) / 1000))
    if (diffSec < 60) return 'Vừa xong'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} phút trước`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour} giờ trước`
    const diffDay = Math.floor(diffHour / 24)
    return `${diffDay} ngày trước`
  }

  const getIcon = (type) => {
    switch (type) {
      case 'patient':
        return <Users className="w-4 h-4 text-green-600" />
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-600" />
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-indigo-600" />
      case 'khoa':
        return <Building2 className="w-4 h-4 text-orange-600" />
      case 'device':
        return <Wrench className="w-4 h-4 text-yellow-700" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityBg = (type) => {
    switch (type) {
      case 'patient':
        return 'bg-green-50 border-green-200'
      case 'appointment':
        return 'bg-blue-50 border-blue-200'
      case 'doctor':
        return 'bg-indigo-50 border-indigo-200'
      case 'khoa':
        return 'bg-orange-50 border-orange-200'
      case 'device':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [accountsRes, khoaRes, doctorRes, lichHenRes, dichVuRes, thietBiRes] = await Promise.all([
          authService.getAllAccounts(), // /auth/accounts
          khoaService.getAllKhoa(), // /khoa (trả về array)
          doctorService.getAllDoctors(), // /doctor (trả về {data: []})
          lichHenService.getAllLichHen(), // /lichHen/all (trả về {data: []})
          dichVuService.getAllDichVu(), // /dichvu (trả về {data: []})
          thietBiService.getAllThietBi() // /thietbi (trả về {data: []})
        ])

        const accounts = asArray(accountsRes?.data)
        const khoas = asArray(khoaRes)
        const doctors = asArray(doctorRes?.data ?? doctorRes)
        const lichHen = asArray(lichHenRes?.data)
        const dichVu = asArray(dichVuRes?.data)
        const thietBi = asArray(thietBiRes?.data)

        setKhoaList(khoas)
        setDoctorList(doctors)
        setLichHenList(lichHen)
        setDichVuList(dichVu)

        const patients = accounts.filter((u) => !!u?.NguoiDung)
        setPatientCount(patients.length)

        // ===== Hoạt động gần đây (từ dữ liệu thật) =====
        const newestPatients = [...patients]
          .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())
          .slice(0, 3)
          .map((u, idx) => ({
            id: `p-${idx}-${u?._id}`,
            type: 'patient',
            time: timeAgo(u?.createdAt),
            text: `Bệnh nhân mới đăng ký: ${u?.NguoiDung?.hoTen || u?.username || 'Không rõ'}`
          }))

        const newestAppointments = [...lichHen]
          .sort((a, b) => new Date(b?.createdAt || b?.ngayHen).getTime() - new Date(a?.createdAt || a?.ngayHen).getTime())
          .slice(0, 3)
          .map((lh, idx) => ({
            id: `lh-${idx}-${lh?._id}`,
            type: 'appointment',
            time: timeAgo(lh?.createdAt || lh?.ngayHen),
            text: `Lịch hẹn mới: ${lh?.NguoiDung?.hoTen || 'Bệnh nhân'} - ${lh?.LichLamViec?.BacSi?.tenBS || 'Bác sĩ'}`
          }))

        const newestDoctors = [...doctors]
          .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())
          .slice(0, 2)
          .map((d, idx) => ({
            id: `d-${idx}-${d?._id}`,
            type: 'doctor',
            time: timeAgo(d?.createdAt),
            text: `Bác sĩ mới thêm: ${d?.tenBS || 'Không rõ'}`
          }))

        const newestKhoas = [...khoas]
          .sort((a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())
          .slice(0, 2)
          .map((k, idx) => ({
            id: `k-${idx}-${k?._id}`,
            type: 'khoa',
            time: timeAgo(k?.createdAt),
            text: `Khoa mới tạo: ${k?.tenKhoa || 'Không rõ'}`
          }))

        const warnDevices = thietBi.filter((t) =>
          ['Cần bảo dưỡng', 'Sắp đến hạn bảo dưỡng', 'Hết hạn bảo dưỡng'].includes(t?.tinhTrang)
        )
        const deviceWarn =
          warnDevices.length > 0
            ? [
                {
                  id: 'dev-warn',
                  type: 'device',
                  time: 'Gần đây',
                  text: `Cảnh báo thiết bị: ${warnDevices.length} thiết bị cần chú ý`
                }
              ]
            : []

        const merged = [...newestAppointments, ...newestPatients, ...newestDoctors, ...newestKhoas, ...deviceWarn].slice(0, 8)
        setRecentActivities(merged)
      } catch (e) {
        setError(e?.message || 'Có lỗi xảy ra!')
        setKhoaList([])
        setDichVuList([])
        setDoctorList([])
        setLichHenList([])
        setPatientCount(0)
        setRecentActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const stats = useMemo(() => {
    return [
      { title: 'Tổng bệnh nhân', value: patientCount, icon: Users, iconColor: 'bg-purple-500' },
      { title: 'Số bác sĩ', value: doctorList.length, icon: Stethoscope, iconColor: 'bg-indigo-500' },
      { title: 'Số lịch hẹn', value: lichHenList.length, icon: Calendar, iconColor: 'bg-pink-500' },
      { title: 'Số khoa', value: khoaList.length, icon: Building2, iconColor: 'bg-orange-500' },
      { title: 'Số dịch vụ', value: dichVuList.length, icon: Activity, iconColor: 'bg-green-500' }
    ]
  }, [patientCount, doctorList.length, lichHenList.length, khoaList.length, dichVuList.length])

  const StatCard = ({ title, value, icon: Icon, iconColor }) => {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-lg ${iconColor}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{formatNumber(value)}</p>
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

        <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto">
            {error && (
              <div className="mb-4 p-3 rounded border bg-red-50 border-red-200 text-red-700 text-sm">{error}</div>
            )}
            {loading && <div className="mb-4 text-sm text-gray-500">Đang tải dữ liệu...</div>}

            {/* Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
              {stats.map((s) => (
                <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} iconColor={s.iconColor} />
              ))}
            </div>

            {/* 2 cột: Danh sách khoa + Hoạt động gần đây */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 ">
              {/* Danh sách khoa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-600" />
                    Danh sách khoa ({formatNumber(khoaList.length)})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {khoaList.length === 0 ? (
                    <div className="text-sm text-gray-500">Chưa có dữ liệu khoa.</div>
                  ) : (
                    <div className="max-h-[360px] overflow-y-auto pr-2 space-y-3 hide-scrollbar">
                      {khoaList.map((k) => (
                        <div
                          key={k?._id || k?.tenKhoa}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityBg('khoa')}`}
                        >
                          <div className="mt-0.5">{getIcon('khoa')}</div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{k?.tenKhoa || 'Không rõ'}</p>
                            <p className="text-xs text-gray-600 mt-1 truncate">Email: {k?.email || '-'}</p>
                            <p className="text-xs text-gray-600 truncate">SDT: {k?.SDT || '-'}</p>
                            {k?.moTa ? <p className="text-xs text-gray-500 mt-1">{k.moTa}</p> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Hoạt động gần đây */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Hoạt động gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivities.length === 0 ? (
                    <div className="text-sm text-gray-500">Chưa có hoạt động.</div>
                  ) : (
                    <div className="max-h-[360px] overflow-y-auto pr-2 space-y-3 hide-scrollbar">
                      {recentActivities.map((a) => (
                        <div
                          key={a.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityBg(a.type)}`}
                        >
                          <div className="mt-0.5">{getIcon(a.type)}</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{a.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Danh sách dịch vụ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Danh sách dịch vụ ({formatNumber(dichVuList.length)})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dichVuList.length === 0 ? (
                  <div className="text-sm text-gray-500">Chưa có dữ liệu dịch vụ.</div>
                ) : (
                  <div className="max-h-[480px] overflow-auto hide-scrollbar">
                    <table className="w-full min-w-[900px]">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold text-gray-700">Tên dịch vụ</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Khoa</th>
                          <th className="text-left p-3 font-semibold text-gray-700">Loại</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dichVuList.map((dv) => (
                          <tr key={dv?._id || dv?.tenDV} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-medium text-gray-800">{dv?.tenDV}</td>
                            <td className="p-3 text-gray-600">{dv?.Khoa?.tenKhoa || '-'}</td>
                            <td className="p-3 text-gray-600">{dv?.LoaiDichVu?.loaiDV || '-'}</td>
                            <td className="p-3 text-right font-semibold text-green-700">
                              {formatCurrency(dv?.giaTien)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Backgound>
  )
}

export default HomeAdmin