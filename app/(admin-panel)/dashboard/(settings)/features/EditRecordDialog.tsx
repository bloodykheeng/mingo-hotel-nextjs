"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
    getAllFeatures,
    getFeaturesById,
    postFeatures,
    updateFeatures,
    deleteFeatureById,
    postToBulkDestroyFeatures,
} from "@/services/features/features-service";

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
        mutationFn: (updatedData: any) => updateFeatures(initialData.id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["features"] });
            primeReactToast.success("Feature updated successfully");
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
        if (!data) return;

        const formData = new FormData();
        formData.append("_method", "PUT");

        formData.append("name", data.name);
        formData.append("icon", data.icon || "");
        formData.append("status", data.status || "");

        // Handle photo upload
        if (data.photo) {
            const photoStatus = data?.photo?.status;

            // For new photos, append the file
            if (photoStatus === "new" && data?.photo?.file) {
                formData.append("photo[file_path]", data.photo.file);
                formData.append("photo[type]", "image");
                formData.append("photo[status]", "new");
            }
            // // For existing photos, append the existing path info
            // else if (photoStatus === "existing") {
            //     formData.append("photo[file_path]", data.logo_url || "");
            //     formData.append("photo[type]", "image");
            //     formData.append("photo[status]", "existing");
            // }
        }

        // else {
        //     // If photo was removed, indicate that we want to remove it
        //     formData.append("photo[status]", "removed");
        // }




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
                    initialData={{ ...defaultValues, ...initialData, allow_notifications: initialData?.allow_notifications ? true : false }}
                />

                {editMutation.isPending && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/70  z-10">
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
