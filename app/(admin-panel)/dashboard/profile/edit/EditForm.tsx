"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'nextjs-toploader/app';

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Card } from "primereact/card"

import { postToUpdateUserProfile } from "@/services/users/users-service";

import RowForm from "./widgets/RowForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";

import useAuthContext from "@/providers/AuthProvider";

import MaterialUiLoaderLottie from "@/assets/oag-lotties/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/assets/oag-lotties/snail-error-lottie.json";
// import SateLiteLottie from "@/assets/oag-lotties/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/assets/oag-lotties/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/assets/oag-lotties/SkeletonLoadingLottie.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });




//
import useHandleMutationError from "@/hooks/useHandleMutationError";

function EditForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();

  const { user, getUserQuery, isLoading, logout } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;
  console.log("🚀 ~ EditForm ~ loggedInUserData:", loggedInUserData)

  useEffect(() => {
    if (!getUserQuery.isLoading && !loggedInUserData) {
      router.push("/"); // Redirect to home if user is not found
    }
  }, [getUserQuery.isLoading, loggedInUserData, router]);


  const creactMutation = useMutation({
    mutationFn: postToUpdateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      primeReactToast.success("Updated Successfully")
      router.push("/dashboard/profile");

    }
  });

  // Use the useHandleMutationError hook, to handle mutation errors and state
  useHandleMutationError(creactMutation?.error);

  const handleSubmit = async (data: any) => {
    // event.preventDefault();


    let finalData = {
      ...data,
    };

    console.log("data we are submitting while creating a user : ", finalData);
    creactMutation.mutate(finalData);
  };

  const defaultValues = {
    name: "", // Empty string for user input
    email: "", // Empty email
    password: "", // Empty password
    gender: "Prefer not to say", // Default to 'Prefer not to say'
    // agree_to_terms: false, // Default to false (user must check it)
    phone: "", // Empty phone

    allow_notifications: null,


  };

  return (
    <Card className="shadow-md">
      {getUserQuery?.isLoading ? (
        <div className="col-12">
          {/* <ProgressBar mode="indeterminate" style={{ height: "6px" }} /> */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ maxWidth: "100%" }}>
              <Lottie animationData={SkeletonLoadingLottie} loop={true} style={{ height: "300px" }} autoplay={true} />
              <Lottie animationData={MaterialUiLoaderLottie} style={{ height: "50px" }} loop={true} autoplay={true} />
            </div>
          </div>
        </div>
      ) : getUserQuery?.isError ? (
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: "400px" }}>
            <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
          </div>
        </div>
      ) : (
        <>
          <div className="surface-0 border-round shadow-2 w-full flex flex-col items-center justify-center  m-1 pb-6">


            {/* <div className="flex justify-between items-center surface-border p-1 border-bottom-1 w-full">
              <h3 className="text-lg font-semibold">Edit Profile</h3>

              <Button label="Back" severity="info" text raised className='m-1' onClick={() => router.back()} />
            </div> */}

            <div className="w-full">

              <RowForm
                handleFormSubmit={handleSubmit}
                formMutation={creactMutation}
                initialData={{ ...defaultValues, ...loggedInUserData, allow_notifications: loggedInUserData?.allow_notifications ? true : false }}
              />
            </div>


            {/* <h4>{creactProgramsMutation.status}</h4> */}
            {creactMutation?.isPending && (
              <center>
                <ProgressSpinner
                  style={{
                    width: "50px",
                    height: "50px",
                    borderWidth: "8px", // Border thickness
                    borderColor: "blue", // Border color
                    animationDuration: "1s"
                  }}
                  strokeWidth="8"
                  animationDuration="1s"
                />
              </center>
            )}
          </div>
        </>)}



    </Card>
  );
}

export default EditForm;
