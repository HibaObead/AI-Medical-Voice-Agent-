import React from 'react'
import Historylist from './_components/Historylist'
import { Button } from '@/components/ui/button'
import DoctorAgentList from './_components/DoctorAgentList'
import AddNewSession from './_components/AddNewSessionDialog'

function Workspace() {
    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl'>My Dashboard</h2>
                <AddNewSession />
            </div>

            <Historylist />
            <DoctorAgentList />
        </div>
    )
}

export default Workspace