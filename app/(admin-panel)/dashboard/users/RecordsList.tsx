'use client'
import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { DataTablePageEvent } from 'primereact/datatable';

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";


import { useRouter } from 'nextjs-toploader/app';

import {
    getAllUsers,
    getUserById,
    postUser,
    updateUser,
    deleteUserById
} from "@/services/users/users-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

import MaterialUiLoaderLottie from "@/assets/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/assets/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/assets/lottie-files/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/assets/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/assets/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/assets/lottie-files/nodata.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import InlineExpandableText from "@/components/helpers/InlineExpandableText"
import moment from 'moment'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";

import PrimeReactDataTable from "@/components/tables/PrimeReactDataTable"
import { fluentAsyncValidationResolver } from "@hookform/resolvers/fluentvalidation-ts/src/fluentvalidation-ts.js";

import DeleteRecordsDialog from "./DeleteRecordsDialog";
import RecordDetailsDialog from "./RecordDetailsDialog"
import CreateRecordDialog from "./CreateRecordDialog"
import EditRecordDialog from "./EditRecordDialog"


import useAuthContext from "@/providers/AuthProvider";

import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";



function RecordsList() {

    const primeReactToast = usePrimeReactToast();

    const { getUserQuery, logoutMutation } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    const router = useRouter();
    const [globalSearch, setGlobalSearch] = useState("");
    const [globalSearchTearm, setGlobalSearchTearm] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [first, setFirst] = useState(0); // Track the first row index for pagination
    const [rowsPerPage, setRowsPerPage] = useState(5)

    // Fetch data using useQuery
    const getAllUsersQuery = useQuery({
        queryKey: ["users", currentPage, rowsPerPage, globalSearchTearm, "paginate",], // Include page and search term in query key
        queryFn: (queryprops) => getAllUsers({ ...queryprops, page: currentPage, rowsPerPage, search: globalSearchTearm, paginate: true, }),
    });
    console.log("🚀 ~ RecordsList ~ getAllUsersQuery:", getAllUsersQuery)

    useHandleQueryError(getAllUsersQuery);



    // Extract data and pagination details from the query result
    const tableData = getAllUsersQuery?.data?.data?.data?.data || [];
    const totalRecords = getAllUsersQuery?.data?.data?.data?.total || 0;
    const perPage = getAllUsersQuery?.data?.data?.data?.per_page || 5;
    const lastPage = getAllUsersQuery?.data?.data?.data?.last_page || 1;



    const handleSearch = (e: any) => {
        e.preventDefault
        setGlobalSearchTearm(globalSearch)
    }


    // Helper function to format dates
    const formatDate = (date?: string): string =>
        date ? moment(date).format("MMMM Do YYYY") : "N/A";

    const header = (

        <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">

            <InputText
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search FAQs" />
            <Button icon="pi pi-search" className="p-button-primary" onClick={handleSearch} />
        </div>

    );

    // Handle page change in the DataTable
    const onPageChange = (event: DataTablePageEvent) => {
        console.log("🚀 ~ onPageChange ~ event:", event)

        const newPage = (event?.page ?? 0) + 1; // PrimeReact paginator is zero-based
        setFirst(event.first); // Update the first row index
        setCurrentPage(newPage); // Update the current page

        setRowsPerPage(event?.rows)
    };


    // User type with nested fields and passthrough for any other fields
    type User = {
        id: number;
        name: string;
        email: string;
        phone: string;
        role: string;
        status: string;
        gender: string;
        date_of_birth: string;
        photo_url?: string;
        created_at: string;
        updated_at: string;
        region?: { name: string };
        district?: { name: string };
        county?: { name: string };
        subcounty?: { name: string };
        parish?: { name: string };
        village?: { name: string };
        [key: string]: any; // Passthrough for any other fields
    };

    type ColumnConfig<T> = {
        field: string; // Using string instead of keyof T to allow for nested fields
        header: string;
        type?: "date" | "image" | string;
        body?: (rowData: T) => React.ReactNode;
        visible?: boolean;
    };

    // Utility function to get nested property value
    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };





    // Column definitions
    const userColumns: ColumnConfig<User>[] = [
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
        {
            field: "phone",
            header: "Phone",
            body: (rowData) => <InlineExpandableText text={rowData?.phone} maxLength={15} />,
            visible: false
        },
        { field: "role", header: "Role" },
        { field: "status", header: "Status" },
        { field: "gender", header: "Gender" },

        {
            field: "created_at",
            header: "Created At",
            type: "date",
            body: (rowData) => formatDate(rowData.created_at),
            visible: false
        },
        {
            field: "updated_at",
            header: "Updated At",
            type: "date",
            body: (rowData) => formatDate(rowData.updated_at),
            visible: false
        },
        {
            field: "photo_url",
            header: "Photo",
            type: "image",
            body: (rowData) => rowData.photo_url ? (
                <img
                    src={rowData.photo_url}
                    alt="User Photo"
                    width={50}
                    style={{ borderRadius: "4px" }}
                />
            ) : (
                "No Photo"
            ),
            visible: false
        }
    ];

    const [selectedItems, setSelectedItems] = useState<[]>([])
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    // Add this function to handle delete action
    const handleDelete = () => {
        console.log("clicked handle delete")
        setDeleteDialogVisible(true);
    };


    //================== viewing a record ================
    const [selectedItem, setSelectedItem] = useState<{} | null>(null)
    const [showRecordDetailsDialog, setShowRecordDetailsDialog] = useState(false);

    const handleViewRecord = <selectedItemObject extends {},>(Item: selectedItemObject) => {
        setSelectedItem(Item)
        setShowRecordDetailsDialog(true)
    }

    //=================== creating a record ==========================
    const [showCreateRecord, setShowCreateRecord] = useState(false)
    const handleCreateRecord = () => {
        setShowCreateRecord(true)
    }

    //=================== editing a record ==========================
    const [showEditRecord, setShowEditRecord] = useState(false)
    const handleEditRecord = (record: any) => {
        const loggedInRole = loggedInUserData?.role;
        const selectedRecordRole = record?.role;
        const isSameUser = record?.id === loggedInUserData?.id;

        // PPDA Admin editing restrictions
        if (loggedInRole === "PPDA Admin") {
            // can only edit CSO Admin, PPDA Officer, or their own record if also PPDA Admin
            if (selectedRecordRole === "PPDA Admin" && !isSameUser) {
                primeReactToast.warn("PPDA Admin can only edit their own record.");
                return;
            }

            if (selectedRecordRole !== "CSO Admin" && selectedRecordRole !== "PPDA Officer" && !isSameUser) {
                primeReactToast.warn("PPDA Admin can only edit CSO Admin, PPDA Officer, or Themselves.");
                return;
            }
        }

        // allowed
        setShowEditRecord(true);
        setSelectedItem(record);
    };





    return (<>
        {getAllUsersQuery?.isError ? (
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ maxWidth: "400px" }}>
                    <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
                </div>
            </div>
        ) : (
            <>
                <Card className="p-mt-3 p-shadow-2 overflow-auto">

                    {/* <div className="flex justify-content-between items-center">
                        <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>

                        <Button label="Back" severity="info" text raised onClick={() => router.back()} />
                    </div> */}


                    <div className="grid">
                        {/* {Array.isArray(faqsData) &&
                            faqsData?.length === 0 && (
                                <>
                                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ maxWidth: "400px" }}>
                                            <Lottie animationData={NoDataLottie} loop={true} autoplay={true} />
                                        </div>
                                    </div>
                                </>
                            )} */}

                        <div className="grid-cols-12 surface-border border-bottom-1">
                            <div className="col-12 flex justify-content-between align-items-center py-2 px-3">
                                <PrimeReactDataTable
                                    data={tableData}
                                    columns={userColumns}
                                    totalRecords={totalRecords}
                                    rows={perPage}
                                    first={first}
                                    loading={getAllUsersQuery.isLoading}
                                    onPageChange={onPageChange}
                                    emptyMessage="No users found."
                                    headerContent={
                                        <div className="flex flex-wrap gap-2 items-center justify-between">
                                            <h4 className="m-0">Users List</h4>
                                            <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                                                <InputText
                                                    type="search"
                                                    value={globalSearch}
                                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                                    placeholder="Search users"
                                                />
                                                <Button icon="pi pi-search" className="p-button-primary" onClick={handleSearch} />
                                            </div>
                                        </div>
                                    }
                                    fileName="users_export"

                                    // selection
                                    selection={loggedInUserData?.permissions?.some((permission: string) =>
                                        ["delete user"].includes(permission)
                                    )}
                                    selectedItems={selectedItems}
                                    setSelectedItems={(items) => setSelectedItems(items)}

                                    // deleting
                                    showDelete={!!loggedInUserData?.permissions?.includes("delete user")}
                                    handleDelete={handleDelete}

                                    // show records
                                    showViewRecord={!!loggedInUserData?.permissions?.includes("view user")}
                                    handleViewRecord={handleViewRecord}

                                    // craating a record
                                    showCreateRecord={!!loggedInUserData?.permissions?.includes("create user")}
                                    handleCreateRecord={handleCreateRecord}

                                    // editing a record
                                    showEditRecord={!!loggedInUserData?.permissions?.includes("edit user")}
                                    handleEditRecord={handleEditRecord}

                                />


                            </div>


                        </div>
                    </div>

                    <DeleteRecordsDialog
                        visible={deleteDialogVisible}
                        onHide={() => setDeleteDialogVisible(false)}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />

                    <RecordDetailsDialog
                        visible={showRecordDetailsDialog}
                        onHide={() => setShowRecordDetailsDialog(false)}
                        selectedRecord={selectedItem}
                    />

                    <CreateRecordDialog
                        visible={showCreateRecord}
                        onHide={() => setShowCreateRecord(false)}

                    />


                    <EditRecordDialog
                        visible={showEditRecord}
                        onHide={() => {
                            setSelectedItem(null)
                            setShowEditRecord(false)
                        }}
                        initialData={selectedItem}

                    />

                </Card>
            </>)}
    </>

    )


}

export default RecordsList
