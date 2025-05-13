import React from 'react'
import RoomDetails from "./RoomDetails"
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";


interface PageProps {
    params: Promise<{ roomId: string }>;
    searchParams: Promise<{ roomId: string }>
}

async function Page({ params, searchParams }: PageProps) {
    const { roomId } = await searchParams;
    console.log("🚀 ~ Page ~ roomId:", roomId)

    return (
        <div>
            {/* <PageBreadcrumb pageTitle="View Room" /> */}
            <RoomDetails roomId={roomId} />
        </div>
    )
}

export default Page