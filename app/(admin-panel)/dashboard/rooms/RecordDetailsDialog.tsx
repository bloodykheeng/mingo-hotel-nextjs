"use client";

import React, { useMemo } from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Accordion, AccordionTab } from "primereact/accordion";
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

    const groupDistrictsByRegionalOffice = (selectedRecord: any) => {
        if (!selectedRecord?.districts || !selectedRecord?.regional_offices) return [];

        const regionalDistricts: any[] = [];

        selectedRecord.regional_offices.forEach((regionalOffice: any) => {
            // Find districts that belong to this regional office
            const matchedDistricts = selectedRecord.districts.filter((district: any) =>
                regionalOffice.districts?.some((d: any) => d.id === district.id)
            );

            if (matchedDistricts.length > 0) {
                regionalDistricts.push({
                    regionalOffice: regionalOffice.name,
                    districts: matchedDistricts,
                });
            }
        });

        return regionalDistricts;
    };

    // Process the districts
    const regionalDistricts = groupDistrictsByRegionalOffice(selectedRecord);
    console.log("🚀 ~ regionalDistricts:", regionalDistricts)

    // Display JSON output
    console.log(JSON.stringify(regionalDistricts, null, 2));



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
                {selectedRecord?.logo_url ? (
                    <Avatar
                        image={`${process.env.NEXT_PUBLIC_BASE_URL}${selectedRecord.logo_url}`}
                        size="xlarge"
                        shape="circle"
                        className="mb-4"
                    />
                ) : (
                    <Avatar
                        icon="pi pi-map"
                        size="xlarge"
                        shape="circle"
                        className="mb-4"
                    />
                )}


                <div className="mt-8 w-full max-w-4xl space-y-6 text-sm">

                    {/* Room Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Room Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Room Type:</strong> {selectedRecord?.room_type || "N/A"}</p>
                            <p><strong>Name:</strong> {selectedRecord?.name || "N/A"}</p>
                            <p><strong>Description:</strong> {selectedRecord?.description || "N/A"}</p>
                            <p><strong>Price:</strong> UGX {Number(selectedRecord?.price).toLocaleString() || "0"}</p>
                            <p><strong>Stars:</strong> {selectedRecord?.stars || "N/A"} ★</p>
                            <p><strong>Number of Adults:</strong> {selectedRecord?.number_of_adults || "N/A"}</p>
                            <p><strong>Number of Children:</strong> {selectedRecord?.number_of_children || "N/A"}</p>
                            <p>
                                <strong>Booked:</strong>{" "}
                                <span
                                    className={`px-2 py-1 rounded ${selectedRecord?.booked ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                                        }`}
                                >
                                    {selectedRecord?.booked ? "Yes" : "No"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Room Features */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                            Features
                        </h4>

                        {Array.isArray(selectedRecord?.room_features) && selectedRecord?.room_features?.length > 0 ? (
                            <ul className="list-disc pl-6">
                                {selectedRecord.room_features.map((feature: any) => (
                                    <li key={feature.id}>{feature?.feature?.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No features assigned.</p>
                        )}
                    </div>

                    {/* Attachments */}
                    <div className="w-full mt-4">
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Attachments</h4>
                        <AttachementsFiles attachementsData={selectedRecord?.room_attachments} />
                    </div>



                    {/* Districts */}
                    {/* <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Districts</h4>
                        <p>
                            <strong>Assigned Districts:</strong>{" "}
                            {selectedRecord?.districts?.length > 0
                                ? selectedRecord.districts.map((d: any) => d.name).join(", ")
                                : "None"}
                        </p>

                    </div> */}

                    {/* Metadata */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Metadata</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Created At:</strong> {formatDate(selectedRecord?.created_at)}</p>
                            <p><strong>Updated At:</strong> {formatDate(selectedRecord?.updated_at)}</p>
                            <p><strong>Created By:</strong> {selectedRecord?.created_by?.name || "N/A"}</p>
                            <p><strong>Updated By:</strong> {selectedRecord?.updated_by?.name || "N/A"}</p>
                        </div>
                    </div>

                </div>
            </div>



        </Dialog>
    );
};

export default RecordDetailsDialog;

