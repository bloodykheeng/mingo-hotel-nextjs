"use client";

import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
    postToCheckRoomAvailability
} from "@/services/rooms/rooms-service";

import BookingForm from "./BookingForm"; // Ensure this is correct

import { useRouter } from 'nextjs-toploader/app';




const CreateBooking = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const createMutation = useMutation({
        mutationFn: postToCheckRoomAvailability,
        onSuccess: (response) => {
            const searchCriteria = response?.data?.data?.search_criteria;
            console.log("🚀 ~ CreateBooking ~ searchCriteria:", response)

            if (searchCriteria) {
                const queryParams = new URLSearchParams({
                    check_in: searchCriteria.check_in,
                    check_out: searchCriteria.check_out,
                    adults: searchCriteria.adults.toString(),
                    children: searchCriteria.children.toString(),
                });

                // Show success message
                primeReactToast.success("Check Completed successfully");

                // Navigate to the rooms page with query params
                router.push(`/rooms?${queryParams.toString()}`);
            }

        },
    });

    useHandleMutationError(createMutation.error);

    const handleFormSubmit = (formData: any) => {
        if (formData) {
            createMutation.mutate(formData);
        }
    };


    return (
        <>
            <div className="relative">
                <BookingForm
                    handleFormSubmit={handleFormSubmit}
                    formMutation={createMutation}
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
        </>


    );
};

export default CreateBooking;


