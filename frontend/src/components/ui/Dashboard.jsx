import React from 'react'
import { Button } from './button'
import { LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'
import { authService } from '@/services/authService'
import { toast } from 'sonner'

const Dashboard = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        authService.logout()
        toast.success('Đăng xuất thành công!')
        navigate('/')
    }
    const navItemClass = ({ isActive }) =>
        `text-inherit no-underline w-full h-12 text-xl text-black p-5 flex items-center
    hover:bg-blue-300 ${isActive ? 'bg-blue-300' : ''}`
    return (
        <div className="h-full  bg-white w-full mt-0 p-0 shadow-xl  ">
            <img src="./public/IMG/admin.jpg" alt="logo" className="p-0 m-0 h-50 w-50  mx-auto" />

            <NavLink to="/admin" end className={navItemClass}>
                Home
            </NavLink>

            <NavLink to="/DoctorManagement" className={navItemClass}>
                Quản lý khoa & bác sĩ
            </NavLink>

            <NavLink to="/AccountManagement" className={navItemClass}>
                Quản lý tài khoản
            </NavLink>

            <NavLink to="/loaidv" className={navItemClass}>
                Quản lý loại dịch vụ
            </NavLink>

            <NavLink to="/ServiceManagement" className={navItemClass}>
                Quản lý dịch vụ
            </NavLink>

            <NavLink to="/MedicalDevicesManagement" className={navItemClass}>
                Quản lý thiết bị
            </NavLink>

            <NavLink to="/lichhen" className={navItemClass}>
                Quản lý lịch hẹn
            </NavLink>

            <Button
                className=" h-12 bg-red-500 text-white text-center mb-10 hover:bg-red-700 rounded-lg mt-20 justify-center flex mx-auto  "
                onClick={handleLogout}
            >
                <LogOut />
                Đăng xuất
            </Button>
        </div>
    )
}

export default Dashboard