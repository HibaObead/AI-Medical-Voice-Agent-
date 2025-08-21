import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
export type doctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
}
export type props = {
    doctorAgent: doctorAgent
}
function DoctorAgentCard({ doctorAgent }: props) {
    // Validate image and specialist properties
    const imageSrc = doctorAgent?.image && doctorAgent.image.trim() !== '' ? doctorAgent.image : '/doctor1.png';
    const altText = doctorAgent?.specialist && doctorAgent.specialist.trim() !== '' ? doctorAgent.specialist : 'Medical Specialist';

    return (
        <div>
            <Image
                src={imageSrc}
                alt={altText}
                width={200} height={300}
                className='w-full h-[250px] object-cover rounded-xl' />
            <h2 className='font-bold mt-1'>{doctorAgent.specialist}</h2>
            <p className='line-clamp-2  text-sm text-gray-500'> {doctorAgent.description}</p>
            <Button className='w-full mt-2'>Start Consultation <IconArrowRight /></Button>
        </div>
    )
}

export default DoctorAgentCard




