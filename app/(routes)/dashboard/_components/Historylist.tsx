"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import AddNewSession from './AddNewSessionDialog';
import axios from 'axios';
import { sessionDetails } from '../medical-agent/[sessionId]/page';
import HistoryTable from './HistoryTable';

function Historylist() {
    const [history, setHistory] = useState<sessionDetails[]>([]);
    useEffect(() => {
        GetHistoryList();
    }, []);
    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all');
        console.log(result.data);
        setHistory(result.data);
    }



    return (
        <div className='mt-10'>
            {history.length == 0 ?
                <div className='flex items-center justify-center flex-col p-7  border-2 border-dashed rounded-2xl'>
                    <Image src={'/medical-assistance .png'} alt="Medical Assistant" width={150} height={150} />
                    <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
                    <p>It looks like you haven't consulted with any Doctor yet.</p>
                    <AddNewSession />
                </div>
                :
                <div>
                    <HistoryTable history={history} />
                </div>
            }
        </div>
    )
}

export default Historylist