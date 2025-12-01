import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import React from 'react'

const ServiceManagement = () => {
  return (
    <Backgound>
      <div className=" flex w-full h-screen m-0 p-0  text-center">
        <div className=" w-[250px]">
          <Dashboard />
        </div>
        <div className=" flex-1">
          
        </div>
      </div>
    </Backgound>
  )
}

export default ServiceManagement