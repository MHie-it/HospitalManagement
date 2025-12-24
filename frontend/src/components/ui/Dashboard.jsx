import React from 'react'
import { Button } from './button'
import { BookPlus, CalendarCheck, HardDrive, HeartPulse, Hospital, House, LogOut, SquareUser } from 'lucide-react'
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
        `text-inherit no-underline  h-12 text-xl text-black p-5 flex items-center
    hover:bg-blue-300  rounded-2xl mx-3 ${isActive ? 'bg-blue-300' : ''}`
    return (
        <div className="h-full rounded-2xl my-6 mx-3  bg-white w-full  p-0 shadow-xl  ">
            <img src="./public/IMG/admin.jpg" alt="logo" className="p-0 m-0 h-50 w-50  mx-auto" />

            <NavLink to="/admin" end className={navItemClass} >

                <House className='mx-3 w-5 h-5' />

                Home
            </NavLink>



            <NavLink to="/DoctorManagement" className={navItemClass}>
                <Hospital className='mx-3 w-5 h-5' />
                Khoa & bác sĩ
            </NavLink>

            <NavLink to="/AccountManagement" className={navItemClass}>
                <SquareUser className='mx-3 w-5 h-5' />
                Tài khoản
            </NavLink>

            <NavLink to="/loaidv" className={navItemClass}>
                <BookPlus className='mx-3 w-5 h-5' />
                Loại dịch vụ
            </NavLink>

            <NavLink to="/ServiceManagement" className={navItemClass}>
                <HeartPulse className='mx-3 w-5 h-5' />
                Dịch vụ
            </NavLink>

            <NavLink to="/MedicalDevicesManagement" className={navItemClass}>
                <HardDrive className='mx-3 w-5 h-5' />
                Thiết bị
            </NavLink>

            <NavLink to="/lichhen" className={navItemClass}>
                <CalendarCheck className='mx-3 w-5 h-5' />
                Lịch hẹn
            </NavLink>

            <Button
                className=" h-12 bg-red-500 text-white text-center  hover:bg-red-700 rounded-lg mt-10 justify-center flex mx-auto  "
                onClick={handleLogout}
            >
                <LogOut />
                Đăng xuất
            </Button>
        </div>
    )
}

export default Dashboard