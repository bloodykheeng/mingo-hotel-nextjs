"use client";

import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Divider } from "primereact/divider";
import { useState } from "react";
import { PrimeIcons } from "primereact/api";

import useAuthContext from "@/providers/AuthProvider";

import { useRouter } from 'nextjs-toploader/app';

import MaterialUiLoaderLottie from "@/assets/oag-lotties/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/assets/oag-lotties/snail-error-lottie.json";
// import SateLiteLottie from "@/assets/oag-lotties/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/assets/oag-lotties/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/assets/oag-lotties/SkeletonLoadingLottie.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Profile = () => {

    const router = useRouter();
    const { user, getUserQuery, isLoading, logout } = useAuthContext();
    console.log("🚀 ~ Header ~ getUserQuery:", getUserQuery)
    const loggedInUserData = getUserQuery?.data?.data;

    const handleEdit = () => {
        router.push(`/dashboard/profile/edit`);
    };

    // Define role groups for conditional rendering
    const showRegionalOffices = ["PPDA Admin", "PPDA Officer"].includes(loggedInUserData?.role) ||
        ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"].includes(loggedInUserData?.role);

    const showCSO = ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"].includes(loggedInUserData?.role);

    return (<>
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
                <div className="p-1">
                    <div className="p-2 mt-2">
                        <Card className="shadow-lg p-1 bg-surface-100 dark:bg-surface-900">
                            <div className="flex flex-column md:flex-row align-items-center gap-4">
                                {/* Profile Picture */}
                                <Avatar
                                    //  image={user.photoUrl}
                                    icon="pi pi-user"
                                    size="xlarge" shape="circle" />

                                {/* User Info */}
                                <div className="flex-grow-1">
                                    <h2 className="text-2xl font-semibold">{loggedInUserData?.name}</h2>
                                    <p className="text-sm text-gray-500">Role : {loggedInUserData?.role}</p>
                                    <p className="text-sm text-gray-400">Last login: {loggedInUserData?.lastlogin}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    {/* <Button label="App" icon="pi pi-mobile" />
                            <Button label="Message" icon="pi pi-envelope" className="p-button-outlined" /> */}
                                    <Button label="Edit" icon="pi pi-user-edit" className="p-button-text" onClick={handleEdit} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-12 mt-4">
                        {/* Left Section - Settings */}
                        <div className="col-span-12 md:col-span-8">
                            <Card className="p-4">
                                <h3 className="text-lg font-semibold">Profile Information</h3>
                                <Divider />
                                <p className="text-sm text-gray-600">
                                    Hi, {loggedInUserData?.name}! Welcome to the PPDA Content Management System (CMS).
                                    Here, you can manage your profile, update your details, and customize your preferences to enhance your experience.
                                </p>

                                <div className="mt-3">
                                    <div><strong>Full Name:</strong> {loggedInUserData?.name ?? 'N/A'}</div>
                                    <div><strong>Email:</strong> {loggedInUserData?.email ?? 'N/A'}</div>
                                    <div><strong>Phone:</strong> {loggedInUserData?.phone ?? 'N/A'}</div>
                                    <div><strong>Status:</strong> {loggedInUserData?.status ?? 'N/A'}</div>
                                    <div className="flex items-start gap-2">

                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Allow Notifications: </span>
                                            {loggedInUserData?.allow_notifications ? (
                                                <i className="pi pi-check-circle text-green-500 mt-1" />
                                            ) : (
                                                <i className="pi pi-times-circle text-red-500 mt-1" />
                                            )}
                                            <span className="mt-1">
                                                {loggedInUserData?.allow_notifications ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </div>
                                    <div><strong>Gender:</strong> {loggedInUserData?.gender ?? 'N/A'}</div>

                                    {/* Regional Office Info - Only show if applicable */}
                                    {showRegionalOffices && (
                                        <div>
                                            <strong>Regional office :</strong>   <span className="mt-1">{loggedInUserData?.regional_office?.name || "N/A"}</span>
                                        </div>


                                    )}

                                    {/* CSO Info - Only show if applicable */}
                                    {showCSO && (
                                        <div>
                                            <strong>CSO :</strong>   <span className="mt-1">{loggedInUserData?.cso?.name || "N/A"}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>


                        {/* Right Section - Profile Information */}
                        <div className="col-span-12 md:col-span-4">
                            <Card className="p-4">
                                <h3 className="text-lg font-semibold">CFP Profile Section</h3>
                                <Divider />
                                <div className="flex justify-between align-items-center my-3">
                                    <p>
                                        The PPDA CMS Profile Section is designed to give system users a streamlined and efficient way to manage their account details.
                                        Whether it's updating personal information like name, email, and phone number, or managing preferences such as notification settings,
                                        this section ensures all data is accurate and up to date. Built with usability in mind, it empowers users to maintain their profiles with ease,
                                        supporting a secure and personalized experience within the PPDA Content Management System.
                                    </p>

                                </div>
                            </Card>
                        </div>
                    </div>

                </div>
            </>)}
    </>

    );
};

export default Profile;

