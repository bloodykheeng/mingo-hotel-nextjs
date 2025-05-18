"use client";

import React, { useMemo } from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Image } from "primereact/image"
import AttachementsFiles from "@/components/admin-panel/attachements/AttachementsFiles"

import moment from "moment";

interface RecordDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any;
}

// Helper function to format dates
const formatDate = (date?: string): string =>
    date ? moment(date).format("MMMM Do YYYY") : "N/A";

const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({ visible, onHide, selectedRecord }) => {
    console.log("🚀 ~ cso selectedRecord:", selectedRecord)

    // Calculate duration between check-in and check-out
    const calculateDuration = () => {
        if (!selectedRecord?.check_in || !selectedRecord?.check_out) return "N/A";

        const start = moment(selectedRecord.check_in);
        const end = moment(selectedRecord.check_out);
        const duration = moment.duration(end.diff(start));

        const days = Math.floor(duration.asDays());
        const hours = duration.hours();

        return (
            <>
                {days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : ''}
                {hours > 0 ? `${days > 0 ? ', ' : ''}${hours} hour${hours !== 1 ? 's' : ''}` : ''}
            </>
        );
    };

    // Format date helper function
    const formatDateTime = (dateString: string) => {
        if (!dateString) return "N/A";
        return moment(dateString).format("MMM DD, YYYY h:mm A");
    };

    // Get status class based on status value
    const getStatusClass = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-200 text-blue-800";
            case "accepted": return "bg-green-200 text-green-800";
            case "declined": return "bg-red-200 text-red-800";
            default: return "bg-gray-200 text-gray-800";
        }
    };




    return (
        <Dialog
            header="Record Details"
            visible={visible}
            style={{ minWidth: '300px' }}
            modal
            footer={<Button label="Close" icon="pi pi-times" onClick={onHide} className="p-button-text" />}
            onHide={onHide}
            closeOnEscape
            closable
            maximizable
        >
            <div className="flex flex-col items-center p-6">
                {/* Room Image */}
                {selectedRecord?.room?.photo_url ? (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${selectedRecord.room.photo_url}`}
                        alt={selectedRecord?.room?.name}
                        className="h-32 w-32 object-cover rounded-lg shadow-md"
                        preview
                    />
                ) : (
                    <Avatar
                        icon="pi pi-home"
                        size="xlarge"
                        shape="circle"
                        className="mb-4"
                    />
                )}

                {/* Room Name */}
                <h3 className="text-xl font-bold mt-3 mb-8">
                    {selectedRecord?.room?.name || "Unknown Room"}
                </h3>

                <div className="mt-4 w-full max-w-4xl space-y-6 text-sm">
                    {/* Booking Status */}
                    <div className="flex justify-center mb-6">
                        <span className={`px-3 py-1.5 rounded-full text-base font-medium capitalize ${getStatusClass(selectedRecord?.status)}`}>
                            {selectedRecord?.status || "N/A"}
                        </span>
                    </div>

                    {/* Booking Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Booking Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Booking ID:</strong> #{selectedRecord?.id || "N/A"}</p>
                            <p><strong>Room:</strong> {selectedRecord?.room?.name || "N/A"}</p>
                            <p><strong>Check-in:</strong> {formatDateTime(selectedRecord?.check_in)}</p>
                            <p><strong>Check-out:</strong> {formatDateTime(selectedRecord?.check_out)}</p>
                            <p><strong>Duration:</strong> {calculateDuration()}</p>
                            <p><strong>Status:</strong>
                                <span className={`ml-2 px-2 py-0.5 rounded capitalize ${getStatusClass(selectedRecord?.status)}`}>
                                    {selectedRecord?.status || "N/A"}
                                </span>
                            </p>
                            <p><strong>Number of Adults:</strong> {selectedRecord?.number_of_adults || "N/A"}</p>
                            <p><strong>Number of Children:</strong> {selectedRecord?.number_of_children || "N/A"}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {selectedRecord?.description && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 border-b pb-1">Description</h4>
                            <p className="text-gray-700 whitespace-pre-line">{selectedRecord.description}</p>
                        </div>
                    )}

                    {/* Room Details */}
                    {selectedRecord?.room && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 border-b pb-1">Room Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                {selectedRecord.room.price && (
                                    <p><strong>Price:</strong> UGX {Number(selectedRecord.room.price).toLocaleString() || "0"}</p>
                                )}
                                {selectedRecord.room.stars && (
                                    <p><strong>Stars:</strong> {selectedRecord.room.stars || "N/A"} ★</p>
                                )}
                                {selectedRecord.room.booked !== undefined && (
                                    <p>
                                        <strong>Room Status:</strong>{" "}
                                        <span
                                            className={`px-2 py-0.5 rounded ${selectedRecord.room.booked ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}
                                        >
                                            {selectedRecord.room.booked ? "Booked" : "Available"}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* System Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">System Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Created:</strong> {formatDateTime(selectedRecord?.created_at)}</p>
                            <p><strong>Last Updated:</strong> {formatDateTime(selectedRecord?.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </div>



        </Dialog>
    );
};

export default RecordDetailsDialog;

