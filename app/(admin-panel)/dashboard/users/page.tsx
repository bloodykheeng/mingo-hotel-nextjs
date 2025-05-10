import React from 'react'
import UserList from './RecordsList'
import PageBreadcrumb from "@/components/admin-panel/common/PageBreadCrumb";

import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ usersCategory?: string }>;
    searchParams: Promise<{ usersCategory: string }>
}

async function Page({ params, searchParams }: PageProps) {

    return (
        <div>
            <PageBreadcrumb pageTitle="Users" />
            <UserList />
        </div>
    )
}

export default Page