"use client";

import React from 'react';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import moment from "moment";

interface HeroSliderDetailsDialogProps {
    visible: boolean;
    onHide: () => void;
    selectedRecord: any;
}

const formatDate = (date?: string): string =>
    date ? moment(date).format("MMMM Do YYYY, h:mm A") : "N/A";

const HeroSliderDetailsDialog: React.FC<HeroSliderDetailsDialogProps> = ({ visible, onHide, selectedRecord }) => {
    return (
        <Dialog
            header="Hero Slider Details"
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
                {selectedRecord?.image_url ? (
                    <Avatar
                        image={`${process.env.NEXT_PUBLIC_BASE_URL}${selectedRecord.image_url}`}
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

                    {/* Slider Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3 border-b pb-1">Slider Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <p><strong>Title:</strong> {selectedRecord?.title || "N/A"}</p>
                            <p><strong>Subtitle:</strong> {selectedRecord?.subtitle || "N/A"}</p>
                            <p><strong>Button one:</strong> {selectedRecord?.button_link_one || "N/A"}</p>
                            <p><strong>Button two:</strong> {selectedRecord?.button_link_two || "N/A"}</p>
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

export default HeroSliderDetailsDialog;
