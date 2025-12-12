import React from 'react'
import { Button } from './button'
import { LogOut, Home, Calendar, CalendarClock, History, UserCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router'

const DoctorHeader = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItemClass = (path) => {
    const baseClass = "h-full px-4 text-base font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-all duration-200 cursor-pointer border-b-4 whitespace-nowrap"
    const activeClass = isActive(path) 
      ? "bg-blue-50 text-blue-700 border-blue-600 font-semibold" 
      : "border-transparent hover:border-blue-300"
    return `${baseClass} ${activeClass}`
  }

  return (
    <header className="h-[55px] relative w-screen overflow-hiden mx-auto w-full flex items-center justify-between bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <nav className="flex items-center bg-white justify-center gap-1 h-full flex-1">
        <Link
          to="/doctorhome"
          className="text-inherit no-underline h-full"
        >
          <div className={menuItemClass("/doctorhome")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </div>
        </Link>

        <Link
          to="/lichhen"
          className="text-inherit no-underline h-full"
        >
          <div className={menuItemClass("/lichhen")}>
            <Calendar className="w-4 h-4 mr-2" />
            Lịch hẹn
          </div>
        </Link>

        <Link
          to="/doctor/schedule"
          className="text-inherit no-underline h-full"
        >
          <div className={menuItemClass("/doctor/schedule")}>
            <CalendarClock className="w-4 h-4 mr-2" />
            Lịch làm việc
          </div>
        </Link>

        <Link
          to="/doctor/history"
          className="text-inherit no-underline h-full"
        >
          <div className={menuItemClass("/doctor/history")}>
            <History className="w-4 h-4 mr-2" />
            Lịch sử khám bệnh
          </div>
        </Link>

        <Link
          to="/doctor/profile"
          className="text-inherit no-underline h-full"
        >
          <div className={menuItemClass("/doctor/profile")}>
            <UserCircle className="w-4 h-4 mr-2" />
            Hồ sơ
          </div>
        </Link>
      </nav>
        <Button 
          className="h-10  !bg-red-500 text-white hover:bg-red-600 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg px-4"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>

      
      
    </header>
  )
}

export default DoctorHeader