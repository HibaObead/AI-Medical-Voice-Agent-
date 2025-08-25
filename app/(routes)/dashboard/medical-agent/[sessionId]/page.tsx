"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, PhoneCall, PhoneOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import axios from 'axios';

export type sessionDetails = {
    id: number,
    notes: string,
    sessionId: string,
    report: JSON,
    selectedDoctor: doctorAgent,
    createdOn: string,
}


type messages = {
    role: string,
    text: string,
}

function MedicalVoiceAgent() {
    const { sessionId } = useParams();
    const [sessionDetails, setSessionDetails] = useState<sessionDetails>();
    const [callStarted, setCallStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentRole, setCurrentRole] = useState<string | null>();
    const [liveTranscript, setLiveTranscript] = useState<string>();
    const [message, setMessage] = useState<messages[]>([]);

    useEffect(() => {
        // Initialize Vapi only if environment variables are available
        if (process.env.NEXT_PUBLIC_VAPI_API_KEY) {
            setVapi(new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY));
        }
    }, []);

    useEffect(() => {
        console.log('SessionId from params:', sessionId, typeof sessionId);
        if (sessionId && typeof sessionId === 'string') {
            GetSessionDetails();
        }
    }, [sessionId]);

    const GetSessionDetails = async () => {
        if (!sessionId || typeof sessionId !== 'string') {
            setError('Invalid session ID');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            // Use fetch API to ensure correct port
            const response = await fetch(`/api/session-chat?sessionId=${sessionId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            setSessionDetails(data);
        } catch (error: any) {
            console.error('Error fetching session details:', error);
            if (error.message?.includes('404')) {
                setError('Session not found. Please check the session ID.');
            } else {
                setError('Failed to load session details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    const StartCall = () => {
        if (!vapi || !process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID) {
            console.error('Vapi not initialized or missing voice assistant ID');
            return;
        }


        // const VapiAgentConfig = {
        //     name: 'AI Medical Doctor Voice Agent',
        //     firstMessage: 'Hello, I am your AI medical assistant. How can I help you today?',
        //     transcribter: {
        //         provider: 'assembly-ai',
        //         language: 'en'
        //     },
        //     voice: {
        //         provider: '11labs',
        //         voiceId: sessionDetails?.selectedDoctor.voiceId,
        //     },
        //     modle: {
        //         provider: 'openai',
        //         name: 'gpt-4',
        //         messages: [
        //             {
        //                 role: 'system',
        //                 content: sessionDetails?.selectedDoctor.agentPrompt,
        //             }
        //         ]
        //     }
        // }



        // Start voice conversation'

        //@ts-ignore
        vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);
        // Listen for events
        vapi.on('call-start', () => {
            console.log('Call started')
            setCallStarted(true);
        });
        vapi.on('call-end', () => {
            console.log('Call ended')
            setCallStarted(false);
        });
        vapi.on('message', (message) => {
            if (message.type === 'transcript') {
                const { role, transcriptType, transcript } = message;
                console.log(`${message.role}: ${message.transcript}`);
                if (transcriptType == 'partial') {
                    setLiveTranscript(transcript);
                    setCurrentRole(role);
                }
                else if (transcriptType == 'final') {
                    //final transcript
                    setMessage((prev: any) => [...prev, { role: role, text: transcript }])
                    setLiveTranscript("");
                    setCurrentRole(null);
                }
            }
        });
        vapi.on('speech-start', () => {
            console.log('Assistant started speaking');
            setIsSpeaking(true);
            setCurrentRole('assistant');
        });
        vapi.on('speech-end', () => {
            console.log('Assistant stopped speaking');
            setIsSpeaking(false);
            setCurrentRole('user');
        });

    }

    const EndCall = async () => {
        setLoading(true);
        try {
            if (vapi) {
                vapi.stop();
                setCallStarted(false);

                // Generate report when call ends
                if (message.length > 0) {
                    console.log('Generating medical report...');
                    const result = await GenerateReport();
                    console.log('Report generated:', result);
                } else {
                    console.log('No messages to generate report from');
                }
            }
        } catch (error) {
            console.error('Error ending call:', error);
            setError(`Failed to end call: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    }

    const GenerateReport = async () => {
        //call api to generate report
        const result = await axios.post('/api/medical-report', {
            messages: message,
            sessionDetails: sessionDetails,
            sessionId: sessionId,
        });
        console.log(result.data);
        return result.data;
    }

    if (loading) {
        return (
            <div className='p-5 border rounded-3xl bg-secondary flex items-center justify-center min-h-[400px]'>
                <div className='flex items-center gap-2'>
                    <Loader2 className='w-6 h-6 animate-spin' />
                    <span>Loading session details...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='p-5 border rounded-3xl bg-secondary'>
                <div className='flex items-center justify-center min-h-[400px] flex-col'>
                    <h2 className='text-red-500 text-lg mb-4'>Error</h2>
                    <p className='text-gray-600 text-center mb-4'>{error}</p>
                    <Button onClick={GetSessionDetails} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='p-5 border rounded-3xl bg-secondary'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <h2 className='p-1 px-2 rounded-md border gap-2 flex items-center'>
                        <Circle className={`w-4 h-4 ${callStarted ? 'text-green-500' : 'text-red-500'}`} />
                        {callStarted ? 'Connected' : 'Not Connected'}
                    </h2>
                    {callStarted && (
                        <h2 className='p-1 px-2 rounded-md border gap-2 flex items-center'>
                            <Circle className={`w-4 h-4 ${isSpeaking ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                            {isSpeaking ? 'Speaking' : 'Listening'}
                        </h2>
                    )}
                </div>
                <h2 className='font-bold text-xl text-gray-500'> 00:00 </h2>
            </div>

            {sessionDetails &&
                <div className='flex items-center mt-10 flex-col px-10 md:px-28 lg:px-52 xl:px-72'>
                    <Image
                        src={sessionDetails?.selectedDoctor?.image && sessionDetails.selectedDoctor.image.trim() !== '' ? sessionDetails.selectedDoctor.image : '/doctor1.png'}
                        alt={sessionDetails?.selectedDoctor?.specialist && sessionDetails.selectedDoctor.specialist.trim() !== '' ? sessionDetails.selectedDoctor.specialist : 'Medical Specialist'}
                        width={120}
                        height={120}
                        className='h-[100px] w-[100px] object-cover rounded-full'
                    />
                    <h2 className='mt-2 text-lg'>{sessionDetails?.selectedDoctor?.specialist} </h2>
                    <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>

                    <div className='mt-12 overflow-y-auto flex flex-col items-center '>
                        {message?.slice(-4).map((msg: messages, index) => (
                            <h2 className=' text-gray-400 p-2' key={index}>
                                {msg.role}:{msg.text}
                            </h2>

                        ))}
                        {liveTranscript && liveTranscript?.length > 0 && < h2 className='text-lg' >{currentRole}:{liveTranscript}</h2>}
                    </div>
                    {!callStarted ?
                        <Button className='mt-20' onClick={StartCall} disabled={!vapi}>
                            <PhoneCall /> Start Call
                        </Button>
                        :
                        <Button className='mt-20' variant={"destructive"} onClick={EndCall}>
                            <PhoneOff /> Disconnect
                        </Button>
                    }
                </div>
            }
        </div >
    )
}

export default MedicalVoiceAgent
