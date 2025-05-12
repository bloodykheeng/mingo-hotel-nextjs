"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
    getAllRooms,
    getRoomsById,
    postRooms,
    updateRooms,
    deleteRoomById,
    postToBulkDestroyRooms,
} from "@/services/rooms/rooms-service";

import RowForm from "./widgets/RowForm"; // Ensure this is correct

interface CreateRecordDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData?: any;
}

const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
    visible,
    onHide,
    initialData
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const createMutation = useMutation({
        mutationFn: postRooms,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            primeReactToast.success("Room created successfully");
            onHide();
        }
    });

    useHandleMutationError(createMutation.error);

    // const handleFormSubmit = (formData: any) => {
    //     if (formData) {
    //         createMutation.mutate(formData);
    //     }
    // };


    const handleFormSubmit = (data: any) => {
        console.log("🚀 ~ room handleFormSubmit ~ data:", data);
        if (!data) return;

        const formData = new FormData();

        // Basic fields
        formData.append("name", data?.name);
        formData.append("description", data?.description);
        formData.append("status", data?.status);
        formData.append("room_type", data?.room_type);
        formData.append("price", data?.price);
        formData.append("stars", data?.stars);
        formData.append("booked", data?.booked ?? "");
        formData.append("number_of_adults", data?.number_of_adults);
        formData.append("number_of_children", data?.number_of_children);

        // Features array as JSON
        formData.append("features", JSON.stringify(data?.features ?? []));


        // Append attachments with their captions
        if (data.attachments && data.attachments.length > 0) {
            data.attachments.forEach((item: any, index: number) => {
                const file = item.file; // File object
                const fileType = item.type || "image";
                const caption = item.caption || "";

                console.log("🚀 ~ data.attachments.forEach ~ file:", file)

                // Append the file under 'file_path'
                formData.append(`attachments[${index}][file_path]`, file);

                // Append the type
                formData.append(`attachments[${index}][type]`, fileType);

                // Append the caption directly with the attachment
                formData.append(`attachments[${index}][caption]`, caption);
            });

        }


        createMutation.mutate(formData);
    };


    const dialogFooter = (
        <div className="flex justify-end gap-2 mt-4">
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
                disabled={createMutation.isPending}
            />
        </div>
    );

    return (
        <Dialog
            header="Create New Record"
            visible={visible}
            onHide={onHide}
            style={{ minWidth: "50vw" }}
            modal
            maximizable
            footer={dialogFooter}
            closeOnEscape={!createMutation.isPending}
            closable={!createMutation.isPending}
        >
            <div className="relative">
                <RowForm
                    handleFormSubmit={handleFormSubmit}
                    formMutation={createMutation}
                    initialData={initialData}
                />

                {createMutation.isPending && (
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

export default CreateRecordDialog;


