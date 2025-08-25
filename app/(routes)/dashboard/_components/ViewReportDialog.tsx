import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { sessionDetails } from '../medical-agent/[sessionId]/page'
import moment from 'moment'
import { Stethoscope } from 'lucide-react'

type Props = {

    record: sessionDetails
}


function ViewReportDialog({ record }: Props) {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant={'link'} size={'sm'} >View Report</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className='text-center text-4xl'>Medical AI Voice Agent Report </h2>
                    </DialogTitle>

                    <DialogDescription>
                        <div className="mt-10 max-h-[70vh] overflow-y-auto pr-2">
                            {/* Header */}
                            <h2 className="flex items-center justify-center gap-2 font-bold text-blue-500 text-lg">
                                <Stethoscope className="w-5 h-5" />
                                Medical AI Voice Agent Report
                            </h2>

                            {/* Session Info */}
                            <div>
                                <h3 className="font-bold text-blue-500 mt-2">Session Info</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <p><span className="font-bold">Doctor:</span> {record.selectedDoctor?.specialist}</p>
                                    <p><span className="font-bold">User:</span> Anonymous</p>
                                    <p><span className="font-bold">Consulted On:</span> {moment(new Date(record?.createdOn)).fromNow()}</p>
                                    <p><span className="font-bold">Agent:</span> {record.selectedDoctor?.specialist} AI</p>
                                </div>
                            </div>

                            {/* Chief Complaint */}
                            <div>
                                <h3 className="font-bold text-blue-500 mt-2">Chief Complaint</h3>
                                <p>User reports sharp back pain.</p>
                            </div>

                            {/* Summary */}
                            <div>
                                <h3 className="font-bold text-blue-500 mt-2">Summary</h3>
                                <p>
                                    The user is experiencing sharp back pain. The AI assistant recommended
                                    over-the-counter pain relievers like ibuprofen or acetaminophen,
                                    emphasizing the importance of following dosage instructions. It also
                                    advised consulting a healthcare provider if the pain persists or worsens.
                                </p>
                            </div>

                            {/* Symptoms */}
                            <div>
                                <h3 className="font-bold text-blue-500 mt-2">Symptoms</h3>
                                <ul className="list-disc ml-6">
                                    <li>back pain</li>
                                    <li>sharp pain</li>
                                </ul>
                            </div>

                            {/* Duration & Severity */}
                            <div>
                                <h3 className="font-bold text-blue-500 mt-2">Duration & Severity</h3>
                                <p><span className="font-bold">Duration:</span> Not specified</p>
                                <p><span className="font-bold">Severity:</span> Moderate</p>
                            </div>

                            {/* Medications */}
                            <div>
                                <h3 className="font-bold text-blue-500 mt-2">Medications Mentioned</h3>
                                <ul className="list-disc ml-6">
                                    <li>ibuprofen</li>
                                    <li>acetaminophen</li>
                                </ul>
                            </div>

                            {/* Recommendations */}
                            <div>
                                <h3 className="font-bold text-blue-500 mt-2">Recommendations</h3>
                                <ul className="list-disc ml-6">
                                    <li>Try over-the-counter pain relievers (ibuprofen or acetaminophen)</li>
                                    <li>Follow dosage instructions carefully</li>
                                    <li>Consult a healthcare provider if pain persists or worsens</li>
                                </ul>
                            </div>

                            {/* Footer */}
                            <p className="text-xs text-gray-500 mt-8 text-center">
                                This report was generated by an AI Medical Assistant for informational purposes only.
                            </p>
                        </div>
                    </DialogDescription>


                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ViewReportDialog