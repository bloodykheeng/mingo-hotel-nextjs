"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import { useRouter } from 'nextjs-toploader/app';

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

    const router = useRouter();
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const bookingMutation = useMutation({
        mutationFn: postRoomBookings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["room-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            primeReactToast.success("Booking created successfully youill be contacted shortly once booking gets approved");
            onHide();
            router.push("/rooms")
        },
    });

    useHandleMutationError(bookingMutation.error);

    const handleFormSubmit = (data: any) => {
        console.log("🚀 ~ handleFormSubmit ~ data:", data)
        if (!data) return;

        const finalData = { ...data, status: "new", room_id: initialData?.id }

        bookingMutation.mutate(finalData);
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
                    room={initialData}
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
