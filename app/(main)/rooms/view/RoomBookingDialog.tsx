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
    postToBulkDestroyRoomBookings
} from "@/services/rooms/room-bookings-service";
import RoomBookingForm from "./RoomBookingForm";

interface RoomBookingDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData?: any;
}

const RoomBookingDialog: React.FC<RoomBookingDialogProps> = ({
    visible,
    onHide,
    initialData,
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const bookingMutation = useMutation({
        mutationFn: postRoomBookings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room-bookings"] });
            primeReactToast.success("Booking created successfully");
            onHide();
        },
    });

    useHandleMutationError(bookingMutation.error);

    const handleFormSubmit = (data: any) => {
        if (!data) return;

        const formData = new FormData();
        formData.append("check_in", data?.check_in);
        formData.append("check_out", data?.check_out);
        formData.append("number_of_adults", data?.number_of_adults);
        formData.append("number_of_children", data?.number_of_children);
        formData.append("description", data?.description || "");

        bookingMutation.mutate(formData);
    };

    const dialogFooter = (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
                disabled={bookingMutation.isPending}
            />
        </div>
    );

    return (
        <Dialog
            header="Create Room Booking"
            visible={visible}
            onHide={onHide}
            style={{ minWidth: "50vw" }}
            modal
            maximizable
            footer={dialogFooter}
            closeOnEscape={!bookingMutation.isPending}
            closable={!bookingMutation.isPending}
        >
            <div className="relative">
                <RoomBookingForm
                    handleFormSubmit={handleFormSubmit}
                    formMutation={bookingMutation}
                />

                {bookingMutation.isPending && (
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

export default RoomBookingDialog;
