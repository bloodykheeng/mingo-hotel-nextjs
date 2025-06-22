'use client'

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

// PrimeReact Components
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputSwitch } from "primereact/inputswitch";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";

// Icons
import { PrimeIcons } from "primereact/api";

import { useRouter } from "next/navigation";

// Services
import {
    getAllFeatures,
} from "@/services/features/features-service";

import {
    getAllRoomCategorys,
    getRoomCategorysById,
    postRoomCategorys,
    updateRoomCategorys,
    deleteRoomCategoryById,
    postToBulkDestroyRoomCategorys,
} from "@/services/room-categories/room-categories-service";

import useHandleQueryError from "@/hooks/useHandleQueryError";

// Filter form schema
const filterSchema = z.object({
    room_type: z.enum(["accommodation", "conference", ""]).optional().nullable(),
    booked: z.boolean().optional(),
    stars: z.number().min(0).max(5).optional(),
    features: z.array(z.object({ id: z.number(), name: z.string() })).optional().nullable(),
    room_categories: z
        .array(z.object({ id: z.number(), name: z.string() }))
        .optional()
        .nullable(),
    number_of_adults: z.number().min(0).optional().nullable(),
    number_of_children: z.number().min(0).optional().nullable(),
    search: z.string().optional(),
});

// Type for form values
export type FilterFormValues = z.infer<typeof filterSchema>;

// Default filter values
export const defaultFilterValues: FilterFormValues = {
    // room_type: null,
    // booked: true,
    // stars: null,
    // features: [],
    // number_of_adults: 0,
    // number_of_children: 0,
    search: "",
};

interface RoomFiltersProps {
    onFilterSubmit: (filters: FilterFormValues) => void;
    onSearchChange?: (search: string) => void;
    initialValues?: FilterFormValues;
}

function RoomFilters({ onFilterSubmit, onSearchChange, initialValues = defaultFilterValues }: RoomFiltersProps) {

    const router = useRouter();

    // Form setup with react-hook-form and zod validation
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset,
        formState: { errors }
    } = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: initialValues
    });

    console.log("🚀 ~ RoomFilters ~ errors:", errors)

    // Fetch Room Features for filter dropdown
    const featuresQuery = useQuery({
        queryKey: ["features"],
        queryFn: () => getAllFeatures(),
    });
    useHandleQueryError(featuresQuery);

    // Fetch Room Categories for filter dropdown
    const roomCategoriesQuery = useQuery({
        queryKey: ["room-categories"],
        queryFn: () => getAllRoomCategorys(),
    });
    useHandleQueryError(roomCategoriesQuery);

    // Handle filter submission
    const submitFilters = (data: FilterFormValues) => {
        console.log("🚀 ~ testting submitFilters ~ data:", data)
        onFilterSubmit(data);
    };

    // Handle search change with debounce
    const handleSearchChange = (value: string) => {
        setValue('search', value);
        // Could add debounce here if needed
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    // Suggestions state
    const [featureSuggestions, setFeatureSuggestions] = useState([]);
    const [roomCategorySuggestions, setRoomCategorySuggestions] = useState([]);

    // Reset all filters
    const handleReset = () => {
        reset(defaultFilterValues);
        // Trigger filter submission with default values
        onFilterSubmit(defaultFilterValues);

        // Clear URL query params
        router.replace(window.location.pathname); // removes all ?query=params
    };

    // Room type options
    const roomTypeOptions = [
        { label: "Accommodation", value: "accommodation" },
        { label: "Conference", value: "conference" }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Filter Rooms</h3>
            <form onSubmit={handleSubmit(submitFilters)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Room Type */}
                <div className="col-span-1">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Room Type</label>
                    <Controller
                        name="room_type"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                options={roomTypeOptions}
                                value={field.value}
                                onChange={field.onChange}
                                className="w-full"
                                placeholder="Select Room Type"
                            />
                        )}
                    />
                </div>

                {/* Room Categories */}
                <div className="col-span-1">
                    <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                        Room Categories
                    </label>
                    <Controller
                        name="room_categories"
                        control={control}
                        render={({ field }) => {
                            const fetchCategorySuggestions = (event: any) => {
                                const query = event.query.toLowerCase();

                                // Get the IDs of all currently selected categories
                                const selectedIds = Array.isArray(field.value)
                                    ? field.value.map((item) => item.id)
                                    : [];

                                const filtered =
                                    roomCategoriesQuery?.data?.data?.data?.filter(
                                        (category: any) =>
                                            category?.name?.toLowerCase().includes(query) &&
                                            !selectedIds.includes(category.id)
                                    ) || [];

                                setRoomCategorySuggestions(filtered);
                            };

                            return (
                                <AutoComplete
                                    {...field}
                                    multiple
                                    suggestions={roomCategorySuggestions}
                                    completeMethod={fetchCategorySuggestions}
                                    field="name"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    placeholder="Search & Select Room Categories"
                                    className={`w-full ${errors.room_categories ? "p-invalid" : ""}`}
                                    disabled={roomCategoriesQuery?.isLoading}
                                    dropdown
                                />
                            );
                        }}
                    />
                    {errors.room_categories && (
                        <small className="p-error">{errors?.room_categories?.message?.toString()}</small>
                    )}
                    {roomCategoriesQuery?.isLoading && (
                        <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />
                    )}
                </div>


                {/* Room Features */}
                <div className="col-span-1">
                    <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                        Room Features
                    </label>
                    <Controller
                        name="features"
                        control={control}
                        render={({ field }) => {
                            const fetchFeatureSuggestions = (event: any) => {
                                const query = event.query.toLowerCase();

                                // Get the IDs of all currently selected features
                                const selectedIds = Array.isArray(field.value)
                                    ? field.value.map((item) => item.id)
                                    : [];

                                const filtered =
                                    featuresQuery?.data?.data?.data?.filter(
                                        (feature: any) =>
                                            feature?.name?.toLowerCase().includes(query) &&
                                            !selectedIds.includes(feature.id)
                                    ) || [];

                                setFeatureSuggestions(filtered);
                            };

                            return (
                                <AutoComplete
                                    {...field}
                                    multiple
                                    suggestions={featureSuggestions}
                                    completeMethod={fetchFeatureSuggestions}
                                    field="name"
                                    value={field.value}
                                    onChange={(e) => {
                                        const value = e.value;
                                        field.onChange(value);

                                    }}
                                    placeholder="Search & Select Features"
                                    className={`w-full ${errors.features ? "p-invalid" : ""}`}
                                    disabled={featuresQuery?.isLoading}
                                    dropdown
                                />
                            );
                        }}
                    />
                    {errors.features && (
                        <small className="p-error">{errors?.features?.message?.toString()}</small>
                    )}
                    {featuresQuery?.isLoading && (
                        <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />
                    )}
                </div>


                {/* Search */}
                <div className="col-span-1">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Search</label>
                    <div className="flex">
                        <Controller
                            name="search"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="search"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l focus:outline-none"
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleSearchChange(e.target.value);
                                    }}
                                    placeholder="Search Rooms"
                                />
                            )}
                        />
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-4 py-2 rounded-r"
                        >
                            <i className={PrimeIcons.SEARCH}></i>
                        </button>
                    </div>
                </div>

                {/* Stars */}
                <div className="col-span-1">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Stars</label>
                    <Controller
                        name="stars"
                        control={control}
                        render={({ field }) => (
                            <Rating
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                cancel={false}
                                className="flex"
                            />
                        )}
                    />
                </div>

                {/* Booked Status */}
                <div className="col-span-1">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Include Booked Rooms</label>
                    <Controller
                        name="booked"
                        control={control}
                        render={({ field }) => (
                            <InputSwitch
                                checked={!!field.value}
                                onChange={(e) => field.onChange(e.value)}
                            />
                        )}
                    />
                </div>

                {/* Number of Adults */}
                <div className="col-span-1">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Adults</label>
                    <Controller
                        name="number_of_adults"
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                value={field.value ? Number(field.value) : undefined}
                                onChange={(e) => field.onChange(e.value ? Number(e.value) : undefined)}
                                min={0}
                                showButtons
                                buttonLayout="horizontal"
                                decrementButtonClassName="p-button-danger"
                                incrementButtonClassName="p-button-success"
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus"
                                className="w-full"
                            />
                        )}
                    />
                </div>

                {/* Number of Children */}
                <div className="col-span-1">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Children</label>
                    <Controller
                        name="number_of_children"
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                value={field.value ? Number(field.value) : undefined}
                                onChange={(e) => field.onChange(e.value ? Number(e.value) : undefined)}
                                min={0}
                                showButtons
                                buttonLayout="horizontal"
                                decrementButtonClassName="p-button-danger"
                                incrementButtonClassName="p-button-success"
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus"
                                className="w-full"
                            />
                        )}
                    />
                </div>



                {/* Submit and Reset Buttons */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 flex gap-2 justify-end">
                    <Button
                        type="button"
                        label="Reset"
                        icon="pi pi-refresh"
                        className="p-button-outlined"
                        onClick={handleReset}
                    />
                    <Button
                        type="submit"
                        label="Apply Filters"
                        icon="pi pi-filter"
                        className="p-button-primary"
                    />
                </div>
            </form>
        </div>
    );
}

export default RoomFilters;