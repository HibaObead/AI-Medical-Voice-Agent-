import React from 'react'
import { doctorAgent } from './DoctorAgentCard'
import Image from 'next/image'
export type props = {
    doctorAgent: doctorAgent,
    setSelectedDoctor: any,
    selectedDoctor: doctorAgent,
}
function SuggestedDoctorCard({ doctorAgent, setSelectedDoctor, selectedDoctor }: props) {
    // Validate image and specialist properties
    const imageSrc = doctorAgent?.image && doctorAgent.image.trim() !== '' ? doctorAgent.image : '/doctor1.png';
    const altText = doctorAgent?.specialist && doctorAgent.specialist.trim() !== '' ? doctorAgent.specialist : 'Medical Specialist';

    return (
        <div className={`flex flex-col items-center justify-between 
        border rounded-2xl shadow p-5
        hover:border-blue-500 cursor-pointer 
        ${selectedDoctor?.id == doctorAgent?.id && "border-blue-500"}`}
            onClick={() => setSelectedDoctor(doctorAgent)}
        >
            <Image
                src={imageSrc}
                alt={altText}
                width={70}
                height={70}
                className='w-[50px] h-[50px] rounded-4xl object-cover'
            />
            <h2 className='font-bold text-sm text-center'>{doctorAgent?.specialist}</h2>
            <p className='text-xs text-center line-clamp-2'>{doctorAgent?.description}</p>
        </div>

    )
}

export default SuggestedDoctorCard

