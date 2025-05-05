"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import { postUser } from "@/services/users/users-service";
import RowForm from "./widgets/RowForm"; // Ensure this is correct

interface CreateRecordDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData?: any;
    usersCategory: string;
}

const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
    visible,
    onHide,
    initialData,
    usersCategory
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const createMutation = useMutation({
        mutationFn: postUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            primeReactToast.success("User created successfully");
            onHide();
        }
    });

    useHandleMutationError(createMutation.error);

    const handleFormSubmit = (formData: any) => {
        console.log("🚀 ~ users handleFormSubmit ~ formData:", formData)

        if (formData) {
            const finalData = {
                ...formData,
                regional_office_id: formData?.regional_office?.id,
                cso_id: formData?.cso?.id
            }
            createMutation.mutate(finalData);
        }
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
            header={`Create ${usersCategory === "cso_users" ? "CSO User" : "PPDA User"}`}
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
                    usersCategory={usersCategory}
                />

                {createMutation.isPending && (
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

export default CreateRecordDialog;


