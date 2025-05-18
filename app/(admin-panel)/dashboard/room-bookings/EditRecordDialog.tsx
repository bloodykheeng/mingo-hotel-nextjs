"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
    getAllRoomBookings,
    getRoomBookingsById,
    postRoomBookings,
    updateRoomBookings,
    deleteRoomBookingById,
    postToBulkDestroyRoomBookings,
} from "@/services/rooms/room-bookings-service";

import RowForm from "./widgets/RowForm"; // Ensure path is correct

interface EditRecordDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData: any; // Required for editing
}

const EditRecordDialog: React.FC<EditRecordDialogProps> = ({
    visible,
    onHide,
    initialData
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const editMutation = useMutation({
        mutationFn: (updatedData: any) => updateRoomBookings(initialData.id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms", "room-booking"] });
            primeReactToast.success("Room Booking updated successfully");
            onHide();
        }
    });

    useHandleMutationError(editMutation.error);

    // const handleFormSubmit = (formData: any) => {
    //     if (formData) {
    //         editMutation.mutate(formData);
    //     }
    // };

    const handleFormSubmit = (data: any) => {
        console.log("🚀 ~room booking edit handleFormSubmit ~ data:", data)
        if (!data) return;

        editMutation.mutate(data);
    };

    const dialogFooter = (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
                disabled={editMutation.isPending}
            />
        </div>
    );


    const defaultValues = {
        name: "",
        abbreviation: "",
        designation: "Private", // Must be exactly "Private" | "NGO"
        type: "Indigenous", // Must be exactly "Indigenous" | "Foreign"
        description: "",
        status: "active", // Must be exactly "active" | "deactive"
        regional_offices: undefined,
        districts: undefined,
    };

    const features = initialData?.room_features?.map((item: any) => item?.feature)
    console.log("🚀 ~dfesfse initialData:", initialData)

    return (
        <Dialog
            header="Edit Record"
            visible={visible}
            onHide={onHide}
            style={{ minWidth: "50vw" }}
            modal
            maximizable
            footer={dialogFooter}
            closeOnEscape={!editMutation.isPending}
            closable={!editMutation.isPending}
        >
            <div className="relative">
                <RowForm
                    handleFormSubmit={handleFormSubmit}
                    formMutation={editMutation}
                    initialData={{ ...defaultValues, ...initialData, features: features, booked: initialData?.booked ? true : false }}
                />

                {editMutation.isPending && (
                    <div className="absolute inset-0 flex justify-center items-center dark:bg-black/70 bg-white/70 z-10">
                        <ProgressSpinner
                            style={{ width: "40px", height: "40px" }}
                            strokeWidth="4"
                            animationDuration="1s"
                        />
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default EditRecordDialog;
