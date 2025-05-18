'use client'

import React from 'react'

import { Card } from 'primereact/card';
import { Panel } from "primereact/panel";


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";


import {
    getAllStatisticsCards
} from "@/services/dashboard/dashboards-service";


import useHandleQueryError from "@/hooks/useHandleQueryError";
import { useQuery } from "@tanstack/react-query";

import { Avatar } from "primereact/avatar";


import moment from "moment";



import { notFound } from "next/navigation";

import MaterialUiLoaderLottie from "@/assets/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/assets/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/assets/lottie-files/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/assets/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/assets/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/assets/lottie-files/nodata.json";

import { useRouter } from 'nextjs-toploader/app';

import StatCard from "./widget/StatCard"

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Sample statistics data with explicit color classes
const statisticsData = [
    {
        title: 'Total Projects',
        link: '/projects',
        icon: 'pi-briefcase',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-500',
        message: 'Total number of projects in the system',
        count: 42
    },
    {
        title: 'Total Reports',
        link: '/reports',
        icon: 'pi-file',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-500',
        message: 'Total reports submitted',
        count: 16
    },
    {
        title: 'Assigned To Me',
        link: '/reports',
        icon: 'pi-user',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-500',
        message: 'Reports assigned to current user',
        count: 40
    },
    {
        title: 'New Reports',
        link: '/reports',
        icon: 'pi-bell',
        bgColor: 'bg-green-100',
        textColor: 'text-green-500',
        message: 'Newly created reports',
        count: 39
    },
    {
        title: 'Submitted',
        link: '/reports',
        icon: 'pi-check-circle',
        bgColor: 'bg-cyan-100',
        textColor: 'text-cyan-500',
        message: 'Reports submitted for review',
        count: 8
    },
    {
        title: 'Rejected by Verifier',
        link: '/reports',
        icon: 'pi-times-circle',
        bgColor: 'bg-red-100',
        textColor: 'text-red-500',
        message: 'Reports rejected during verification',
        count: 3
    },
    {
        title: 'Archived',
        link: '/reports',
        icon: 'pi-archive',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-500',
        message: 'Archived reports',
        count: 5
    },
    {
        title: 'Approver',
        link: '/reports',
        icon: 'pi-thumbs-up',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-500',
        message: 'Reports waiting for approval',
        count: 7
    },
    {
        title: 'Assigned to PPDA Admin',
        link: '/reports',
        icon: 'pi-user-edit',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-500',
        message: 'Reports assigned to PPDA administrators',
        count: 12
    },
    {
        title: 'Assigned to PPDA Officer',
        link: '/reports',
        icon: 'pi-users',
        bgColor: 'bg-pink-100',
        textColor: 'text-pink-500',
        message: 'Reports assigned to PPDA officers',
        count: 8
    },
    {
        title: 'Reopened',
        link: '/reports',
        icon: 'pi-refresh',
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-500',
        message: 'Previously closed reports that were reopened',
        count: 4
    }
];

interface StatItem {
    title: string;
    link: string;
    icon: string;
    bgColor: string;
    textColor: string;
    message: string;
    count: number;
}

function StatisticsCards() {

    // Fetch data using useQuery
    const getAllStatisticsCardsQuery = useQuery({
        queryKey: ["rooms", "dashboard-statistics-cards"], // Include page and search term in query key
        queryFn: getAllStatisticsCards,
    });
    console.log("🚀 ~ RecordsList ~ getAllStatisticsCardsQuery:", getAllStatisticsCardsQuery)

    useHandleQueryError(getAllStatisticsCardsQuery);

    const cardStatisticsData = getAllStatisticsCardsQuery?.data?.data ?? []

    return (
        <Panel header={`Statistics`} toggleable className="w-full">


            {getAllStatisticsCardsQuery?.isLoading ? (
                <div className="col-12">
                    {/* <ProgressBar mode="indeterminate" style={{ height: "6px" }} /> */}
                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ maxWidth: "100%" }}>
                            <Lottie animationData={SkeletonLoadingLottie} loop={true} style={{ height: "300px" }} autoplay={true} />
                            <Lottie animationData={MaterialUiLoaderLottie} style={{ height: "50px" }} loop={true} autoplay={true} />
                        </div>
                    </div>
                </div>
            ) : getAllStatisticsCardsQuery?.isError ? (
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ maxWidth: "400px" }}>
                        <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
                    </div>
                </div>
            ) : (
                <>
                    {/* <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Statistics</h2>
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                            <i className="pi pi-minus text-gray-500"></i>
                        </button>
                    </div> */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cardStatisticsData.map((stat: StatItem, index: number) => (
                            <StatCard
                                key={index}
                                title={stat.title}
                                link={stat?.link}
                                count={stat.count}
                                icon={stat.icon}
                                bgColor={stat.bgColor}
                                textColor={stat.textColor}
                                message={stat.message}
                            />
                        ))}
                    </div>
                </>
            )}


        </Panel>
    )
}

export default StatisticsCards