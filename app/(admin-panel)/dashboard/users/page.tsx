import React from 'react'
import UserList from './RecordsList'
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ usersCategory?: string }>;
    searchParams: Promise<{ usersCategory: string }>
}

async function Page({ params, searchParams }: PageProps) {
    const { usersCategory } = await searchParams;

    if (!usersCategory) {
        return notFound(); // Trigger Next.js 404 page if userCategory is missing
    }


    return (
        <div>
            <PageBreadcrumb pageTitle="Users" />
            <UserList usersCategory={usersCategory} />
        </div>
    )
}

export default Page