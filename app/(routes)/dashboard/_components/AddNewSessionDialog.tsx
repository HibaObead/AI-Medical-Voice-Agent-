// "use client"
// import React, { useState } from 'react'
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { DialogClose } from '@radix-ui/react-dialog'
// import { ArrowRight, Divide, Loader, Loader2 } from 'lucide-react'
// import axios from 'axios'
// import DoctorAgentCard, { doctorAgent } from './DoctorAgentCard'
// import { index } from 'drizzle-orm/mysql-core'
// import SuggestedDoctorCard from './SuggestedDoctorCard'

// function AddNewSession() {
//     const [note, setNote] = useState<string>();
//     const [loading, setLoading] = useState(false);
//     const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
//     const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
//     const OnClickNext = async () => {
//         setLoading(true);
//         const result = await axios.post('/api/suggest-doctor', { notes: note, });
//         console.log(result.data);
//         setSuggestedDoctors(result.data);
//         setLoading(false);
//     }
//     const onStartConsultation = async () => {
//         setLoading(true);
//         //save all information to DB
//         const result = await axios.post('/api/session-chat', {
//             notes: note,
//             selectedDoctor: selectedDoctor,
//         });
//         console.log(result.data);
//         if (result.data?.sessionId) {
//             console.log(result.data.sessionId);
//             //route new conversation screen
//         }
//         setLoading(false);
//     }
//     return (

//         <Dialog>
//             <DialogTrigger>
//                 <Button className='mt-3'>+ Start a Consultations</Button>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Add Basic details</DialogTitle>
//                     <DialogDescription asChild>
//                         {!suggestedDoctors ? < div >
//                             <h2>Add Symptoms or Any Other Details</h2>
//                             <Textarea
//                                 placeholder='Add Detail here...'
//                                 className='h-[200px] mt-1'
//                                 onChange={(e) => setNote(e.target.value)}
//                             />
//                         </div> :
//                             <div>
//                                 <h2>Select The Doctor</h2>
//                                 <div className='grid grid-cols-3 gap-5'>
//                                     {/* // Display suggested doctors */}
//                                     {suggestedDoctors.map((doctor, index) => (
//                                         <SuggestedDoctorCard doctorAgent={doctor} key={index}
//                                             setSelectedDoctor={() => setSelectedDoctor(doctor)}
//                                             //@ts-ignore
//                                             selectedDoctor={selectedDoctor}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>}
//                     </DialogDescription>
//                 </DialogHeader>
//                 <DialogFooter>
//                     <DialogClose>
//                         <Button variant={'outline'}>Cancel</Button>
//                     </DialogClose>
//                     {!suggestedDoctors ? <Button disabled={!note || loading} onClick={() => OnClickNext()}>
//                         Next {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
//                     </Button>
//                         : <Button disabled={loading || !selectedDoctor} onClick={() => onStartConsultation()}>
//                             {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
//                             Start Consultation</Button>}

//                 </DialogFooter>
//             </DialogContent>
//         </Dialog >
//     )
// }

// export default AddNewSession


"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { doctorAgent } from "./DoctorAgentCard";

function AddNewSession() {
    const [note, setNote] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();

    const OnClickNext = async () => {
        setLoading(true);
        try {
            const result = await axios.post("/api/suggest-doctor", { notes: note });
            console.log("Doctors:", result.data);
            // Ensure result.data is an array
            const doctors = Array.isArray(result.data) ? result.data : [result.data];
            setSuggestedDoctors(doctors);
        } catch (err) {
            console.error("Frontend error:", err);
        }
        setLoading(false);
    };

    const onStartConsultation = async () => {
        setLoading(true);
        try {
            const result = await axios.post("/api/session-chat", {
                notes: note,
                selectedDoctor,
            });
            console.log(result.data);

            if (result.data?.sessionId) {
                console.log("New session ID:", result.data.sessionId);
                // TODO: redirect to chat page
            }
        } catch (err) {
            console.error("Consultation error:", err);
        }
        setLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="mt-3">+ Start a Consultation</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Basic details</DialogTitle>
                    <DialogDescription asChild>
                        {!suggestedDoctors ? (
                            <div>
                                <h2>Add Symptoms or Any Other Details</h2>
                                <Textarea
                                    placeholder="Add Detail here..."
                                    className="h-[200px] mt-1"
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div>
                                <h2>Select The Doctor</h2>
                                <div className="grid grid-cols-3 gap-5">
                                    {suggestedDoctors.map((doctor, index) => (
                                        <SuggestedDoctorCard
                                            doctorAgent={doctor}
                                            key={index}
                                            setSelectedDoctor={() => setSelectedDoctor(doctor)}
                                            //@ts-ignore
                                            selectedDoctor={selectedDoctor}
                                        />

                                    ))}

                                </div>
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    {!suggestedDoctors ? (
                        <Button disabled={!note || loading} onClick={OnClickNext}>
                            Next{" "}
                            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                        </Button>
                    ) : (
                        <Button
                            disabled={loading || !selectedDoctor}
                            onClick={onStartConsultation}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                            Start Consultation
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddNewSession;
