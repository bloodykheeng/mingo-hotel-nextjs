"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

interface RecordDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any;
}

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
                <Avatar
                    icon="pi pi-map"
                    size="xlarge"
                    shape="circle"
                    className="mb-4"
                />

                <div className="mt-8 w-full max-w-4xl space-y-6 text-sm">

                    {/* Personal Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Region Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Question:</strong> {selectedRecord?.question || "N/A"}</p>
                            <p>
                                <strong>Status:</strong>
                                <span className={`px-2 py-1 rounded ${selectedRecord?.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                                    }`}>
                                    {selectedRecord?.status || "N/A"}
                                </span>
                            </p>
                            <p><strong>Answer:</strong> {selectedRecord?.answer || "N/A"}</p>
                        </div>

                    </div>



                    {/* System Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Metadata</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">

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

