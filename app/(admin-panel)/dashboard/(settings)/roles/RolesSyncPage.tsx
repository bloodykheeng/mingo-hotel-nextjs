'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllRolesAndModifiedPermissionsService } from '@/services/roles/roles-service';
import RoleForm from './widgets/RowForm';
import useHandleQueryError from '@/hooks/useHandleQueryError';

// Types
interface Role {
    role: string;
    permissions: Permission[];
}

interface Permission {
    name: string;
    value: boolean;
}

const RolesSyncPage: React.FC = () => {
    const getAllRolesAndModifiedPermissionsQuery = useQuery<{ data: Role[] }>({
        queryKey: ['roles-with-modified-permissions'],
        queryFn: getAllRolesAndModifiedPermissionsService,
    });

    // Use the custom hook to handle errors
    useHandleQueryError(getAllRolesAndModifiedPermissionsQuery);

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Easily Manage Permissions under Roles</h2>

            {getAllRolesAndModifiedPermissionsQuery?.isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                getAllRolesAndModifiedPermissionsQuery?.data?.data && <RoleForm rolesAndModifiedPermissionData={getAllRolesAndModifiedPermissionsQuery?.data.data} />
            )}
        </div>
    );
};

export default RolesSyncPage;