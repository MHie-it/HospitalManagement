import Backgound from '@/components/ui/Backgound'

import DoctorHeader from '@/components/ui/DoctorHeader'
import React from 'react'

const DoctorPage = () => {
  return (
    <Backgound>
        <div className=" w-full h-full flex m-0 p-0 overflow-hidden">
            <div className =" w-[250px] h-full">
                <DoctorHeader/>
            </div>
            <div className="flex-1 h-full">

            </div>
        </div>
        
    </Backgound>
  )
}

export default DoctorPage