"use client";

import React, { useMemo } from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Accordion, AccordionTab } from "primereact/accordion";

import moment from "moment";

import {
    FaWifi, FaTv, FaBed, FaCoffee, FaUtensils, FaConciergeBell, FaBath,
    FaSwimmingPool, FaParking, FaRProject, FaVolumeUp, FaSpa, FaCouch,
    FaDoorOpen, FaSnowflake, FaShower, FaPlane, FaCocktail, FaHotel
} from "react-icons/fa";
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

    // Define a type for the icon values
    type IconKey = 'wifi' | 'tv' | 'bed' | 'breakfast' | 'dinner' | 'buffet' |
        'bathroom' | 'swimming pool' | 'parking' | 'projector' | 'speakers' |
        'massage' | 'sofa' | 'balcony' | 'fridge' | 'shower' | 'airport' |
        'rooftop' | 'double bed' | 'single room';

    // Use the same type for your iconMap
    const iconMap: Record<IconKey, React.ReactNode> = {
        wifi: <FaWifi />,
        tv: <FaTv />,
        bed: <FaBed />,
        breakfast: <FaCoffee />,
        dinner: <FaUtensils />,
        buffet: <FaConciergeBell />,
        bathroom: <FaBath />,
        "swimming pool": <FaSwimmingPool />,
        parking: <FaParking />,
        projector: <FaRProject />,
        speakers: <FaVolumeUp />,
        massage: <FaSpa />,
        sofa: <FaCouch />,
        balcony: <FaDoorOpen />,
        fridge: <FaSnowflake />,
        shower: <FaShower />,
        airport: <FaPlane />,
        rooftop: <FaCocktail />,
        "double bed": <FaBed />,
        "single room": <FaHotel />,
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
                {selectedRecord?.photo_url ? (
                    <Avatar
                        image={`${process.env.NEXT_PUBLIC_BASE_URL}${selectedRecord.photo_url}`}
                        size="xlarge"
                        shape="circle"
                        className="mb-4"
                    />
                ) : (
                    <Avatar
                        icon="pi pi-image"
                        size="xlarge"
                        shape="circle"
                        className="mb-4"
                    />
                )}


                <div className="mt-8 w-full max-w-4xl space-y-6 text-sm">

                    {/* Feature Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Feature Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p>
                                <strong>Name:</strong> {selectedRecord?.name || "N/A"}
                            </p>

                            <p>
                                <strong>Icon:</strong>{" "}
                                {selectedRecord?.icon ? (
                                    iconMap[selectedRecord?.icon as IconKey]
                                ) : (
                                    "No Icon"
                                )}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`px-2 py-1 rounded ${selectedRecord?.status === "active"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-red-200 text-red-800"
                                        }`}
                                >
                                    {selectedRecord?.status || "N/A"}
                                </span>
                            </p>

                            <p>
                                <strong>Created At:</strong> {formatDate(selectedRecord?.created_at) || "N/A"}
                            </p>

                            <p>
                                <strong>Updated At:</strong> {formatDate(selectedRecord?.updated_at) || "N/A"}
                            </p>


                        </div>
                    </div>

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

