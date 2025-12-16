import React from 'react'
import { Button } from './button'
import { LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { authService } from '@/services/authService'
import { toast } from 'sonner'

const Dashboard = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        authService.logout()
        toast.success('Đăng xuất thành công!')
        navigate('/')
    }
    return (
        <div className="h-full  bg-white w-full mt-0 p-0 shadow-xl  ">
            <img src="./public/IMG/LOGO.png" alt="logo" className="p-4 m-0  mx-auto" />

            <Link
                to="/admin"
                className="text-inherit no-underline"
            >
                <div className="w-full  h-12 text-xl text-black hover:bg-blue-300 flex items-center justify-center">
                    Home
                </div>
            </Link>


            <Link
                to="/DoctorManagement"
                className="text-inherit no-underline"
            >
                <div className="w-full h-12 text-xl text-black hover:bg-blue-300 flex items-center justify-center">
                    Quản lý khoa & bác sĩ
                </div>
            </Link>

            <Link
                to="/AccountManagement"
                className="text-inherit no-underline"
            >
                <div className="w-full h-12 text-xl text-black hover:bg-blue-300 flex items-center justify-center">
                    Quản lý tài khoản
                </div>
            </Link>

            <Link
                to="/loaidv"
                className="text-inherit no-underline"
            >
                <div className="w-full h-12 text-xl text-black hover:bg-blue-300 flex items-center justify-center">
                    Quản lý loại dịch vụ
                </div>
            </Link>

            <Link
                to="/ServiceManagement"
                className="text-inherit no-underline"
            >
                <div className="w-full h-12 text-xl text-black hover:bg-blue-300 flex items-center justify-center">
                    Quản lý dịch vụ
                </div>
            </Link>

            <Link
                to="/MedicalDevicesManagement"
                className="text-inherit no-underline"
            >
                <div className="w-full h-12 text-xl text-black hover:bg-blue-300 flex items-center justify-center">
                    Quản lý thiết bị
                </div>
            </Link>


            <Link
                to="/lichhen"
                className="text-inherit no-underline"
            >
                <div className="w-full h-12 text-xl text-black hover:bg-blue-300 flex items-center justify-center">
                    Quản lý lịch hẹn
                </div>
            </Link>

            <Button
                className=" h-12 !bg-red-500 text-white text-center mb-10 hover:bg-red-700 rounded-lg mt-20 mx-auto"
                onClick={handleLogout}
            >
                <LogOut />
                Đăng xuất
            </Button>
        </div>
    )
}

export default Dashboard