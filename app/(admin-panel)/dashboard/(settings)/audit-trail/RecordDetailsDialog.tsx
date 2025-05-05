"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

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
                <Avatar icon="pi pi-book" size="xlarge" shape="circle" className="mb-4" />

                <div className="mt-8 w-full max-w-4xl space-y-6 text-sm">

                    {/* Audit Log Information */}
                    {/* Audit Log Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Audit Log Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Name:</strong> {selectedRecord?.log_name || "N/A"}</p>
                            <p><strong>Description:</strong> {selectedRecord?.description || "N/A"}</p>

                        </div>
                    </div>

                    {/* Metadata */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Metadata</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>IP Address:</strong> {selectedRecord?.properties?.ip || "N/A"}</p>
                            <p><strong>Country:</strong> {selectedRecord?.properties?.country || "N/A"}</p>
                            <p><strong>City:</strong> {selectedRecord?.properties?.city || "N/A"}</p>
                            <p><strong>User Agent:</strong> {selectedRecord?.properties?.user_agent || "N/A"}</p>
                            <p><strong>Causer:</strong> {selectedRecord?.properties?.created_by || "N/A"}</p>
                            <p><strong>Causer Email:</strong> {selectedRecord?.properties?.created_by_email || "N/A"}</p>
                            <p><strong>Region:</strong> {selectedRecord?.properties?.region || "N/A"}</p>
                            <p><strong>Latitude:</strong> {selectedRecord?.properties?.latitude || "N/A"}</p>
                            <p><strong>Longitude:</strong> {selectedRecord?.properties?.longitude || "N/A"}</p>
                            <p><strong>Timezone:</strong> {selectedRecord?.properties?.timezone || "N/A"}</p>
                            <p><strong>Device:</strong> {selectedRecord?.properties?.device || "N/A"}</p>
                            <p><strong>Platform:</strong> {selectedRecord?.properties?.platform || "N/A"}</p>
                            <p><strong>Platform Version:</strong> {selectedRecord?.properties?.platform_version || "N/A"}</p>
                            <p><strong>Browser:</strong> {selectedRecord?.properties?.browser || "N/A"}</p>
                            <p><strong>Browser Version:</strong> {selectedRecord?.properties?.browser_version || "N/A"}</p>
                        </div>
                    </div>


                </div>
            </div>



        </Dialog>
    );
};

export default RecordDetailsDialog;

