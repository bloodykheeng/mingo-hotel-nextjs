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
    getAllFaqs,
    getFaqsById,
    postFaqs,
    updateFaqs,
    deleteFaqById,
    postToBulkDestroyFaqs,
} from "@/services/faqs/faqs-service";

import useHandleQueryError from "@/hooks/useHandleQueryError";

import MaterialUiLoaderLottie from "@/assets/oag-lotties/material-ui-loading-lottie.json";
import SnailErrorLottie from "@/assets/oag-lotties/snail-error-lottie.json";
// import SateLiteLottie from "@/assets/oag-lotties/satelite-loading-lottie.json";
// import FileLoadingLottie from "@/assets/oag-lotties/FileLoadingLottie.json";
import SkeletonLoadingLottie from "@/assets/oag-lotties/SkeletonLoadingLottie.json";
import NoDataLottie from "@/assets/oag-lotties/nodata.json";


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
    const getAllFaqsQuery = useQuery({
        queryKey: ["faqs", currentPage, rowsPerPage, globalSearchTearm, "paginate"], // Include page and search term in query key
        queryFn: (queryprops) => getAllFaqs({ ...queryprops, page: currentPage, rowsPerPage, search: globalSearchTearm, paginate: true }),
    });
    console.log("🚀 ~ RecordsList ~ getAllFaqsQuery:", getAllFaqsQuery)

    useHandleQueryError(getAllFaqsQuery);



    // Extract data and pagination details from the query result
    const tableData = getAllFaqsQuery?.data?.data?.data?.data || [];
    const totalRecords = getAllFaqsQuery?.data?.data?.data?.total || 0;
    const perPage = getAllFaqsQuery?.data?.data?.data?.per_page || 5;
    const lastPage = getAllFaqsQuery?.data?.data?.data?.last_page || 1;



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


    // PDE Types type with nested fields and passthrough for any other fields
    type ColDefn = {
        id: number;
        question: string;
        answer?: string; // Added description field
        status: "active" | "deactive"; // Restricted to Active/Deactive
        created_at: string;
        updated_at: string;
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
    const columns: ColumnConfig<ColDefn>[] = [
        {
            field: "question",
            header: "Question",
            body: (rowData) => <span className="font-semibold">{rowData?.question}</span>
        },
        {
            field: "answer",
            header: "Answer",
            body: (rowData) => <span className="text-gray-600">{rowData?.answer || "N/A"}</span>
        },
        {
            field: "status",
            header: "Status",
            body: (rowData) => (
                <span
                    className={`px-2 py-1 rounded ${rowData.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}
                >
                    {rowData.status}
                </span>
            )
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
        {getAllFaqsQuery?.isError ? (
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
                                    loading={getAllFaqsQuery.isLoading}
                                    onPageChange={onPageChange}
                                    emptyMessage="No FAQs found."
                                    headerContent={
                                        <div className="flex flex-wrap gap-2 items-center justify-between">
                                            <h4 className="m-0">FAQs List</h4>
                                            <div className="p-inputgroup w-full md:w-30rem lg:w-30rem">
                                                <InputText
                                                    type="search"
                                                    value={globalSearch}
                                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                                    placeholder="Search FAQs"
                                                />
                                                <Button icon="pi pi-search" className="p-button-primary" onClick={handleSearch} />
                                            </div>
                                        </div>
                                    }
                                    fileName="FAQs Export"

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
