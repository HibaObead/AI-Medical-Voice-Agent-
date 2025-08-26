"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@clerk/nextjs'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader, LoaderIcon } from 'lucide-react';
export type doctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId?: string,
    subscriptionRequired: boolean,

}
export type props = {
    doctorAgent: doctorAgent
}
function DoctorAgentCard({ doctorAgent }: props) {
    // Validate image and specialist properties
    const imageSrc = doctorAgent?.image && doctorAgent.image.trim() !== '' ? doctorAgent.image : '/doctor1.png';
    const altText = doctorAgent?.specialist && doctorAgent.specialist.trim() !== '' ? doctorAgent.specialist : 'Medical Specialist';
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { has } = useAuth();
    //@ts-ignore
    const paidUser = has && has({ plan: 'pro' });
    // console.log("Paid User Status:", paidUser);


    const onStartConsultation = async () => {
        setLoading(true);
        try {
            const result = await axios.post("/api/session-chat", {
                notes: 'New Query',
                selectedDoctor: doctorAgent,
            });
            console.log(result.data);

            if (result.data?.sessionId) {
                console.log("New session ID:", result.data.sessionId);
                // TODO: redirect to chat page
                router.push('/dashboard/medical-agent/' + result.data.sessionId);
            }
        } catch (err) {
            console.error("Consultation error:", err);
        }
        setLoading(false);
    };

    return (
        <div className='relative'>
            {doctorAgent.subscriptionRequired &&
                <Badge className='absolute m-2 right-0'>
                    Premium
                </Badge>}
            <Image
                src={imageSrc}
                alt={altText}
                width={200} height={300}
                className='w-full h-[250px] object-cover rounded-xl' />
            <h2 className='font-bold mt-1'>{doctorAgent.specialist}</h2>
            <p className='line-clamp-2  text-sm text-gray-500'> {doctorAgent.description}</p>
            <Button className='w-full mt-2'
                onClick={onStartConsultation}
                disabled={!paidUser && doctorAgent.subscriptionRequired}>
                Start Consultation{loading ? <LoaderIcon className='animate-spin' /> : <IconArrowRight />}
            </Button>
        </div>
    )
}

export default DoctorAgentCard




