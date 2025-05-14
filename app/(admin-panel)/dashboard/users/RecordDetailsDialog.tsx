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

    // Define role groups for conditional rendering
    const showRegionalOffices = ["PPDA Admin", "PPDA Officer"].includes(selectedRecord?.role) ||
        ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"].includes(selectedRecord?.role);

    const showCSO = ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"].includes(selectedRecord?.role);


    return (
        <Dialog
            header="User Details"
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
                    icon="pi pi-user"
                    size="xlarge"
                    shape="circle"
                    className="mb-4"
                />
                <h3 className="text-xl font-semibold">{selectedRecord?.name || "N/A"}</h3>
                <p className="text-gray-500">{selectedRecord?.email || "No email provided"}</p>

                <div className="mt-8 w-full max-w-4xl space-y-6 text-sm">

                    {/* Personal Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Name:</strong> {selectedRecord?.name || "N/A"}</p>
                            <p><strong>Email:</strong> {selectedRecord?.email || "N/A"}</p>
                            <p><strong>Address:</strong> {selectedRecord?.address || "N/A"}</p>
                            <p><strong>Phone:</strong> {selectedRecord?.phone || "N/A"}</p>
                            <p><strong>Gender:</strong> {selectedRecord?.gender || "N/A"}</p>
                            <p><strong>Role:</strong> {selectedRecord?.role || "N/A"}</p>
                            <p>
                                <strong>Status:</strong>
                                <span className={`ml-1 font-bold ${selectedRecord?.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedRecord?.status || "N/A"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Regional Office Info */}
                    {showRegionalOffices && (
                        <>
                            <div>
                                <h4 className="text-lg font-semibold mb-3 border-b pb-1">Regional Office</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    <p><strong>Regional Office Name:</strong> {selectedRecord?.regional_office?.name || "N/A"}</p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* CSO Info */}
                    {showCSO && (
                        <>
                            <div>
                                <h4 className="text-lg font-semibold mb-3 border-b pb-1">CSO</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    <p><strong>CSO Name:</strong> {selectedRecord?.cso?.name || "N/A"}</p>
                                </div>
                            </div>
                        </>
                    )}




                    {/* System Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Metadata</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Last Login:</strong> {selectedRecord?.lastlogin || "N/A"}</p>
                            <p><strong>Created By:</strong> {selectedRecord?.created_by?.name || "N/A"}</p>
                            <p><strong>Updated By:</strong> {selectedRecord?.updated_by?.name || "N/A"}</p>
                            <p><strong>Allow Notifications:</strong> {selectedRecord?.allow_notifications ? "Yes" : "No"}</p>
                        </div>
                    </div>
                </div>
            </div>


        </Dialog>
    );
};

export default RecordDetailsDialog;

