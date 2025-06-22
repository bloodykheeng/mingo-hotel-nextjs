"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import Image from "next/image";
import Link from "next/link";

import {
    getAllUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUserById,
    postToBulkDestroyUsers,
    postToRegisterUser,
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
        mutationFn: postToRegisterUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            primeReactToast.success("User created successfully");
            router.push("/login");
        }
    });

    useHandleMutationError(createMutation.error);

    const handleFormSubmit = (data: any) => {
        console.log("🚀 ~ handleFormSubmit ~ data:", data);
        if (!data) return;

        const formData = new FormData();

        // Core user fields
        formData.append("name", data.name);
        formData.append("address", data.address);


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

        // Handle photo upload
        if (data.photo && data.photo.status === "new" && data.photo.file) {
            formData.append("photo", data.photo.file);
        } else if (data.photo && data.photo.status === "existing" && data.logo_url) {
            formData.append("existing_photo", data.logo_url);
        }

        createMutation.mutate(formData);
    };

    return (
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full m-1 lg:m-4 shadow-lg rounded-lg bg-white dark:bg-gray-800 p-6 relative">
                {/* Logo and Heading */}
                <div className="text-center flex items-center justify-center flex-col mb-6">

                    <Image
                        src="/mingo-hotel-logo/mongo-no-bg.png"
                        alt="logo"
                        width={140}
                        height={30}
                        style={{ height: "40px", width: "auto" }}
                        className="w-full dark:hidden"
                    />
                    <Image
                        src="/mingo-hotel-logo/mongo-no-bg.png"
                        alt="logo"
                        width={140}
                        height={30}
                        style={{ height: "40px", width: "auto" }}
                        className="hidden w-full dark:block"
                    />


                    <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-semibold mb-2">Register</h2>
                    <p className="text-gray-600 text-sm">
                        Already have an account?
                        <Link href="/login" className="ml-2 text-blue-500 hover:underline">
                            Login here!
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <RowForm
                    handleFormSubmit={handleFormSubmit}
                    formMutation={createMutation}
                    initialData={initialData}
                />

                {/* Loading Overlay */}
                {createMutation.isPending && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/70   z-10">
                        <ProgressSpinner
                            style={{ width: "40px", height: "40px" }}
                            strokeWidth="4"
                            animationDuration="1s"
                        />
                    </div>
                )}
            </div>
        </div>
    );

};

export default CreateRecord;