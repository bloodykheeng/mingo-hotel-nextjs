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

import MaterialUiLoaderLottie from "@/assets/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/assets/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/assets/lottie-files/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/assets/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/assets/lottie-files/SkeletonLoadingLottie.json";
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
                                    Hi, {loggedInUserData?.name}! Welcome to the Mingo Hotel Management System.
                                    Here, you can manage your profile, update your details, and customize your preferences to enhance your experience as part of the Mingo Hotel team.
                                </p>


                                <div className="mt-3">
                                    <div><strong>Full Name:</strong> {loggedInUserData?.name ?? 'N/A'}</div>
                                    <div><strong>Email:</strong> {loggedInUserData?.email ?? 'N/A'}</div>
                                    <div><strong>Address:</strong> {loggedInUserData?.address ?? 'N/A'}</div>
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


                                </div>
                            </Card>
                        </div>


                        {/* Right Section - Profile Information */}
                        <div className="col-span-12 md:col-span-4">
                            <Card className="p-4">
                                <h3 className="text-lg font-semibold">Mingo Hotel Overview</h3>
                                <Divider />
                                <div className="flex justify-between align-items-center my-3">
                                    <p>
                                        Mingo Hotel is designed to offer guests a modern, comfortable, and luxurious hospitality experience.
                                        Whether you're visiting for business or leisure, the hotel features well-appointed rooms, attentive service,
                                        and a range of amenities including fine dining, conference facilities, and wellness services.
                                        With a commitment to exceptional quality and guest satisfaction, Mingo Hotel ensures every stay is memorable.
                                        The hotel management system allows staff to efficiently manage bookings, room features, and guest preferences,
                                        enhancing the overall experience for all guests.
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

