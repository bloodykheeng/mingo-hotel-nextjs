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
import { Image } from 'primereact/image';


import { useRouter } from 'nextjs-toploader/app';

import {
    getAllRoomBookings,
    getRoomBookingsById,
    postRoomBookings,
    updateRoomBookings,
    deleteRoomBookingById,
    postToBulkDestroyRoomBookings,
} from "@/services/rooms/room-bookings-service";

import useHandleQueryError from "@/hooks/useHandleQueryError";

import MaterialUiLoaderLottie from "@/assets/lottie-files/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/assets/lottie-files/snail-error-lottie.json";
// import SateLiteLottie from "@/assets/lottie-files/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/assets/lottie-files/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/assets/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/assets/lottie-files/nodata.json";

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

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });


function RecordsList() {

    const router = useRouter();
    const [globalSearch, setGlobalSearch] = useState("");
    const [globalSearchTearm, setGlobalSearchTearm] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [first, setFirst] = useState(0); // Track the first row index for pagination
    const [rowsPerPage, setRowsPerPage] = useState(5)

    // Fetch data using useQuery
    const getAllRoomBookingsQuery = useQuery({
        queryKey: ["rooms", "room-booking", currentPage, rowsPerPage, globalSearchTearm, "paginate"], // Include page and search term in query key
        queryFn: (queryprops) => getAllRoomBookings({ ...queryprops, page: currentPage, rowsPerPage, search: globalSearchTearm, paginate: true }),
    });
    console.log("🚀 ~ RecordsList ~ getAllRoomBookingsQuery:", getAllRoomBookingsQuery)

    useHandleQueryError(getAllRoomBookingsQuery);



    // Extract data and pagination details from the query result
    const tableData = getAllRoomBookingsQuery?.data?.data?.data?.data || [];
    const totalRecords = getAllRoomBookingsQuery?.data?.data?.data?.total || 0;
    const perPage = getAllRoomBookingsQuery?.data?.data?.data?.per_page || 5;
    const lastPage = getAllRoomBookingsQuery?.data?.data?.data?.last_page || 1;



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
                placeholder="Search Room Booking" />
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


    // FormData reference from earlier:
    // type FormData = {
    //   name: string;
    //   abbreviation: string;
    //   designation: "Private" | "NGO";
    //   type: "Indigenous" | "Foreign";
    //   description?: string;
    //   status: "active" | "deactive";
    //   districts?: { id: string; name: string }[];
    // }

    // Corrected ColDefn type to align with FormData
    type ColDefn = {
        id: number;
        room: {
            id: number;
            name: string;
            photo_url?: string | null;
        };
        check_in: string;
        check_out: string;
        status: "new" | "accepted" | "declined";
        number_of_adults: number;
        number_of_children: number;
        description: string;
        created_at: string;
        updated_at: string;
        [key: string]: any; // Allow additional fields
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

    // Column definitions updated to include all relevant fields
    const columns: ColumnConfig<ColDefn>[] = [
        {
            field: "id",
            header: "ID",
            body: (rowData) => <span className="font-semibold">#{rowData.id}</span>
        },
        {
            field: "room.name",
            header: "Room",
            body: (rowData) => (
                <div className="flex items-center gap-2">
                    {rowData.room?.photo_url ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${rowData.room.photo_url}`}
                            alt={rowData.room.name}
                            className="h-8 w-8 object-cover rounded-full"
                            preview
                        />
                    ) : (
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <i className="pi pi-home text-gray-500"></i>
                        </div>
                    )}
                    <span className="font-medium">{rowData.room?.name || "N/A"}</span>
                </div>
            )
        },
        {
            field: "check_in",
            header: "Check In",
            type: "date",
            body: (rowData) => formatDate(rowData.check_in)
        },
        {
            field: "check_out",
            header: "Check Out",
            type: "date",
            body: (rowData) => formatDate(rowData.check_out)
        },
        {
            field: "status",
            header: "Status",
            body: (rowData) => {
                let statusClass = "";
                switch (rowData.status) {
                    case "new":
                        statusClass = "bg-blue-200 text-blue-800";
                        break;
                    case "accepted":
                        statusClass = "bg-green-200 text-green-800";
                        break;
                    case "declined":
                        statusClass = "bg-red-200 text-red-800";
                        break;
                    default:
                        statusClass = "bg-gray-200 text-gray-800";
                }

                return (
                    <span className={`px-2 py-1 rounded capitalize ${statusClass}`}>
                        {rowData.status}
                    </span>
                );
            }
        },
        {
            field: "number_of_adults",
            header: "Adults",
            body: (rowData) => (
                <div className="flex items-center gap-1">
                    <i className="pi pi-user text-gray-600"></i>
                    <span>{rowData.number_of_adults}</span>
                </div>
            )
        },
        {
            field: "number_of_children",
            header: "Children",
            body: (rowData) => (
                <div className="flex items-center gap-1">
                    <i className="pi pi-users text-gray-600"></i>
                    <span>{rowData.number_of_children}</span>
                </div>
            )
        },
        {
            field: "description",
            header: "Description",
            body: (rowData) => (
                <span className="text-gray-600">
                    {rowData.description ?
                        (rowData.description.length > 50 ?
                            `${rowData.description.substring(0, 50)}...` :
                            rowData.description) :
                        "N/A"}
                </span>
            ),
            visible: false
        },
        {
            field: "duration",
            header: "Duration",
            body: (rowData) => {
                if (!rowData.check_in || !rowData.check_out) return "N/A";

                const start = moment(rowData.check_in);
                const end = moment(rowData.check_out);
                const duration = moment.duration(end.diff(start));

                const days = Math.floor(duration.asDays());
                const hours = duration.hours();

                return (
                    <span>
                        {days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : ''}
                        {hours > 0 ? `${days > 0 ? ', ' : ''}${hours} hour${hours !== 1 ? 's' : ''}` : ''}
                    </span>
                );
            }
        },
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
        }
    ]


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

    const handleViewRecord = (Item: any) => {
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
        setShowEditRecord(true)
        setSelectedItem(record)
    }





    return (<>
        {getAllRoomBookingsQuery?.isError ? (
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ maxWidth: "400px" }}>
                    <Lottie animationData={SnailErrorLottie} loop={true} autoplay={true} />
                </div>
            </div>
        ) : (
            <>
                <Card className="p-mt-3 p-shadow-2 overflow-auto "
                    pt={{
                        body: { className: '!p-1 md:p-1 sm:p-1 lg:p-5' }
                    }}>

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
                                    columns={columns}
                                    totalRecords={totalRecords}
                                    rows={perPage}
                                    first={first}
                                    loading={getAllRoomBookingsQuery.isLoading}
                                    onPageChange={onPageChange}
                                    emptyMessage="No Room Booking's found."
                                    headerContent={
                                        <div className="flex flex-wrap gap-2 items-center justify-between">
                                            <h4 className="m-0">Room Booking's List</h4>
                                            <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                                                <InputText
                                                    type="search"
                                                    value={globalSearch}
                                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                                    placeholder="Search Room Booking's"
                                                />
                                                <Button icon="pi pi-search" className="p-button-primary" onClick={handleSearch} />
                                            </div>
                                        </div>
                                    }
                                    fileName="Room Booking's Export"

                                    // selection
                                    selection={true}
                                    selectedItems={selectedItems}
                                    setSelectedItems={(items) => setSelectedItems(items)}

                                    // deleting
                                    showDelete={true}
                                    handleDelete={handleDelete}

                                    // show records
                                    showViewRecord={true}
                                    handleViewRecord={handleViewRecord}

                                    // craating a record
                                    showCreateRecord={true}
                                    handleCreateRecord={handleCreateRecord}

                                    // editing a record
                                    showEditRecord={true}
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
