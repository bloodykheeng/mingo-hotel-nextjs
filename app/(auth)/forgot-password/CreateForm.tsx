"use client";
import React, { useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";

import { forgotPassword } from "@/services/auth/auth-service";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";

//
import useHandleMutationError from "@/hooks/useHandleMutationError";

import Image from "next/image";


function CreateForm() {
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  const creactMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      data?.data?.success ? primeReactToast.success(data?.data?.message) : primeReactToast.warn(data?.data?.message);

    }
  });

  // Use the useHandleMutationError hook, to handle mutation errors and state
  useHandleMutationError(creactMutation?.error);

  const handleSubmit = async (data: any) => {
    // event.preventDefault();

    let finalData = {
      ...data,
      region_id: data?.region?.id,
      district_id: data?.district?.id,
      county_id: data?.county?.id,
      subcounty_id: data?.subcounty?.id,
      parish_id: data?.parish?.id,
      village_id: data?.village?.id
    };

    console.log("data we are submitting while creating a user : ", finalData);
    creactMutation.mutate(finalData);
  };

  return (
    <>

      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full sm:w-96 md:w-[28rem] lg:w-[32rem] shadow-lg rounded-lg bg-white dark:bg-gray-800 p-6">
          <div className="flex flex-wrap flex-col items-center justify-center gap-3 text-center mb-1 w-full">
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
            <span className="text-gray-900 dark:text-gray-100 text-3xl font-medium mb-3">Forgot Password</span>
          </div>

          <RowForm handleFormSubmit={handleSubmit} formMutation={creactMutation} />

          {creactMutation?.isPending && (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>


    </>
  );
}

export default CreateForm;
