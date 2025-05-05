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
    deleteUserById,
    postToBulkDestroyUsers,
} from "@/services/users/users-service";

import RowForm from "./widgets/RowForm"; // Make sure this points to your form component
import moment from "moment";
import { useRouter } from 'nextjs-toploader/app';

interface CreateRecordProps {
    initialData?: any;
}

const CreateRecord: React.FC<CreateRecordProps> = ({
    initialData
}) => {
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();
    const router = useRouter();

    const createMutation = useMutation({
        mutationFn: postUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            primeReactToast.success("User created successfully");
            router.push("/dashboard/users");
        }
    });

    useHandleMutationError(createMutation.error);

    const handleFormSubmit = (data: any) => {
        console.log("🚀 ~ handleFormSubmit ~ data:", data);
        if (!data) return;

        const formData = new FormData();

        // Core user fields
        formData.append("name", data.name);

        // Optional fields with null checking
        if (data.email) formData.append("email", data.email);
        formData.append("allow_notifications", data.allow_notifications ? "1" : "0");
        formData.append("status", data.status || "deactive");
        formData.append("password", data.password);
        formData.append("agree", data.agree ? "1" : "0");

        if (data.phone) formData.append("phone", data.phone);
        if (data.gender) formData.append("gender", data.gender);
        if (data.nationality) formData.append("nationality", data.nationality);
        if (data.age) formData.append("age", data.age.toString());

        // Date fields
        if (data.date_of_birth) {
            formData.append("date_of_birth",
                moment(data.date_of_birth).format("YYYY-MM-DD HH:mm:ss")
            );
        }

        // Optional token fields
        if (data.device_token) formData.append("device_token", data.device_token);
        if (data.web_app_firebase_token) formData.append("web_app_firebase_token", data.web_app_firebase_token);

        // Handle photo upload
        if (data.photo && data.photo.status === "new" && data.photo.file) {
            formData.append("photo", data.photo.file);
        } else if (data.photo && data.photo.status === "existing" && data.logo_url) {
            formData.append("existing_photo", data.logo_url);
        }

        createMutation.mutate(formData);
    };

    return (
        <div className="relative">
            <RowForm
                handleFormSubmit={handleFormSubmit}
                formMutation={createMutation}
                initialData={initialData}
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
    );
};

export default CreateRecord;