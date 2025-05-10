"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
    getAllUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUserById
} from "@/services/users/users-service";
import RowForm from "./widgets/RowForm"; // Ensure path is correct

interface EditRecordDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData: any; // Required for editing
}

const EditRecordDialog: React.FC<EditRecordDialogProps> = ({
    visible,
    onHide,
    initialData,
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const editMutation = useMutation({
        mutationFn: (updatedData: any) => updateUser(initialData.id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            primeReactToast.success("User updated successfully");
            onHide();
        }
    });

    useHandleMutationError(editMutation.error);


    const handleFormSubmit = (formData: any) => {
        if (formData) {
            const isEditing = formData.editing;

            // Clone and clean the data
            const finalData = {
                ...formData,
                regional_office_id: formData?.regional_office?.id,
                cso_id: formData?.cso?.id,
            };

            // Remove password if empty during editing
            if (isEditing && !formData.password) {
                delete finalData.password;
            }

            // Always remove `editing` before sending
            delete finalData.editing;

            editMutation.mutate(finalData);
        }
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

        name: "", // Empty string for user input
        email: "", // Empty email
        password: "", // Empty password
        gender: "Prefer not to say", // Default to 'Prefer not to say'
        // agree_to_terms: false, // Default to false (user must check it)
        phone: "", // Empty phone

        allow_notifications: null,
        status: "active", // Must be exactly "active" | "deactive"

        // regional_offices: undefined,
        regional_office: undefined,
        cso: undefined, // Required for local users
        role: "",
        editing: true
    };

    return (
        <Dialog
            header={`Edit User`}
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
                    <div className="absolute inset-0 flex justify-center items-center bg-white/70 z-10">
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
