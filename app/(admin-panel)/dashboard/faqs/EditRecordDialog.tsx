"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
    getAllFaqs,
    getFaqsById,
    postFaqs,
    updateFaqs,
    deleteFaqById,
    postToBulkDestroyFaqs,
} from "@/services/faqs/faqs-service";

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
        mutationFn: (updatedData: any) => updateFaqs(initialData.id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
            primeReactToast.success("FAQ updated successfully");
            onHide();
        }
    });

    useHandleMutationError(editMutation.error);

    const handleFormSubmit = (formData: any) => {
        if (formData) {
            editMutation.mutate(formData);
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
        question: "",
        answer: "",
        status: "active",
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
