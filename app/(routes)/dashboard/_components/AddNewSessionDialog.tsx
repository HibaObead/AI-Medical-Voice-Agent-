"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { useAuth } from '@clerk/nextjs'
import { sessionDetails } from "../medical-agent/[sessionId]/page";

function AddNewSession() {
    const [note, setNote] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
    const [error, setError] = useState<string>();
    const router = useRouter();
    const [historyList, setHistoryList] = useState<sessionDetails[]>([]);
    const { has } = useAuth();
    //@ts-ignore
    const paidUser = has && has({ plan: 'pro' });
    useEffect(() => {
        GetHistoryList();
    }, []);
    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all');
        console.log(result.data);
        setHistoryList(result.data);
    }
    const OnClickNext = async () => {
        setLoading(true);
        setError(undefined);
        try {
            const result = await axios.post("/api/suggest-doctor", { notes: note });
            console.log("Doctors:", result.data);
            // Ensure result.data is an array
            const doctors = Array.isArray(result.data) ? result.data : [result.data];
            setSuggestedDoctors(doctors);
        } catch (err: any) {
            console.error("Frontend error:", err);
            if (err.response?.status === 401) {
                setError("Authentication failed. Please check your API configuration.");
            } else if (err.response?.status === 429) {
                setError("Rate limit exceeded. Please try again later.");
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError("An error occurred while fetching doctors. Please try again.");
            }
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
                router.push('/dashboard/medical-agent/' + result.data.sessionId);
            }
        } catch (err) {
            console.error("Consultation error:", err);
        }
        setLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="mt-3"
                    disabled={!paidUser && historyList?.length >= 1}>
                    + Start a Consultation
                </Button>
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
                                {error && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </div>
                                )}
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
