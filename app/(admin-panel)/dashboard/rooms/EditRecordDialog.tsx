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
        mutationFn: (updatedData: any) => updateRooms(initialData.id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
            primeReactToast.success("Room updated successfully");
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
        console.log("🚀 ~room edit handleFormSubmit ~ data:", data)
        if (!data) return;

        const formData = new FormData();
        formData.append("_method", "PUT");

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
                const status = item.status || 'new';

                console.log("🚀 ~ edit data.attachments.forEach ~ file:", file)

                // Only append file if status is 'new'
                if (status === 'new' && file) {
                    formData.append(`attachments[${index}][file_path]`, file);
                }

                // Append the type
                formData.append(`attachments[${index}][type]`, fileType);

                // Append the caption directly with the attachment
                formData.append(`attachments[${index}][caption]`, caption);

                formData.append(`attachments[${index}][status]`, status);

                // If it's an existing attachment, potentially append existing_attachment_id or the attachement id in the report attachememnsts table
                if (status === 'existing') {
                    formData.append(`attachments[${index}][existing_attachment_id]`, item?.existing_attachment_id);
                }
            });
        }


        editMutation.mutate(formData);
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
