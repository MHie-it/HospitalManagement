import React from 'react'
import Backgound from '@/components/ui/Backgound'
import Dashboard from '@/components/ui/Dashboard'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

const DoctorManagement = () => {
    return (
        <Backgound>
            <div className=" flex w-full h-screen m-0 p-0  text-center">
                <div className=" w-[250px]">
                    <Dashboard />
                </div>
                <div className=" flex-1 ">
                    <div className="text-center text-blue-500 text-4xl font-bold mt-5 mb-5">Deparment & Doctor Management</div>
                    <div className=" w-full flex m-auto ">
                        <Card className="w-1/3 bg-white rounded-lg shadow p-3 m-5" >
                            <p className="text-xl font-bold"   > Deparment</p>
                            <span> SL </span>
                        </Card>

                        <Card className="w-1/3 bg-white rounded-lg shadow-lg p-3 m-5" >
                            <p className="text-xl font-bold "> Doctor</p>
                            <span> Doctor </span>
                        </Card>

                        <Card className="w-1/3 bg-white rounded-lg shadow p-3 m-5 " >
                            <div className="flex m-auto">
                                <Input
                                    type="text"
                                    placeholder=" Found here !"
                                    className="w-2/3 h-10 mr-4"
                                />

                                <Button
                                    variant="default"
                                    size="lg"
                                    className="w-1/3 hover:font-bold bg-red-500 hover:bg-red-700 transfrom transition-transfrom hover:scale-105">
                                    <Search />
                                    Search
                                </Button>
                            </div>

                        </Card>

                    </div>
                </div>
            </div>
        </Backgound>
    )
}

export default DoctorManagement