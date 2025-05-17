"use client";

import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { z } from "zod";
import moment from "moment";

// ✅ Custom helper to validate required fields
const requireField = (val: any, ctx: z.RefinementCtx, fieldName: string) => {
    if (!val) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${fieldName} is required`,
        });
        return z.NEVER;
    }
    return val;
};

// ✅ Zod schema using superRefine and requireField
const bookingSchema = z
    .object({
        checkInDate: z.any().nullable().superRefine((val, ctx) => requireField(val, ctx, "Check-in date")),
        checkOutDate: z.any().nullable().superRefine((val, ctx) => requireField(val, ctx, "Check-out date")),
        adults: z.number().superRefine((val, ctx) => requireField(val, ctx, "Number of adults")),
        children: z.number(),
    })
    .superRefine((data, ctx) => {
        if (
            data.checkInDate &&
            data.checkOutDate &&
            moment(data.checkOutDate).isSameOrBefore(data.checkInDate)
        ) {
            ctx.addIssue({
                path: ["checkOutDate"],
                code: z.ZodIssueCode.custom,
                message: "Check-out must be after check-in",
            });
        }
    });

type BookingFormData = z.infer<typeof bookingSchema>;

const adultOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1} ${i === 0 ? "Adult" : "Adults"}`,
    value: i + 1,
}));

const childOptions = Array.from({ length: 11 }, (_, i) => ({
    label: `${i} ${i === 1 ? "Child" : "Children"}`,
    value: i,
}));

type BookingFormProps = {
    handleFormSubmit: (formData: BookingFormData | null) => any;
    formMutation: any;
    initialData?: BookingFormData;
};

const BookingForm: React.FC<BookingFormProps> = ({ handleFormSubmit, formMutation }) => {
    // Add state for confirmation dialog
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState<BookingFormData | null>(null);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            checkInDate: null,
            checkOutDate: null,
            adults: 1,
            children: 0,
        },
    });

    const onSubmit = (data: BookingFormData) => {
        // Store the data and show confirmation dialog
        setPendingData(data);
        setShowConfirmDialog(true);
    };

    const onConfirmSubmit = (e: any) => {
        e.preventDefault();
        handleFormSubmit(pendingData);
        setShowConfirmDialog(false);
    };

    const onCancelSubmit = (e?: any) => {
        e?.preventDefault();
        setShowConfirmDialog(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-md p-6 -mt-16 relative z-10 mx-4 lg:mx-auto max-w-6xl">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
                    {/* Check In */}
                    <div className="flex-1">
                        <Controller
                            name="checkInDate"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    {...field}
                                    value={field.value ? moment(field.value).toDate() : null}
                                    onChange={(e) => field.onChange(e.value)}
                                    placeholder="Check in"
                                    className="w-full"
                                    minDate={new Date()}
                                    showIcon
                                    showTime
                                    hourFormat="12"
                                    showButtonBar
                                />
                            )}
                        />
                        {errors.checkInDate && <p className="text-red-500 text-sm">{errors?.checkInDate?.message?.toString()}</p>}
                    </div>

                    {/* Check Out */}
                    <div className="flex-1">
                        <Controller
                            name="checkOutDate"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    {...field}
                                    value={field.value ? moment(field.value).toDate() : null}
                                    onChange={(e) => field.onChange(e.value)}
                                    placeholder="Check out"
                                    className="w-full"
                                    minDate={new Date()}
                                    showIcon
                                    showTime
                                    hourFormat="12"
                                    showButtonBar
                                />
                            )}
                        />
                        {errors.checkOutDate && <p className="text-red-500 text-sm">{errors?.checkOutDate?.message?.toString()}</p>}
                    </div>

                    {/* Adults */}
                    <div className="flex-1">
                        <Controller
                            name="adults"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={adultOptions}
                                    placeholder="Adult"
                                    className="w-full"
                                />
                            )}
                        />
                        {errors.adults && <p className="text-red-500 text-sm">{errors.adults.message}</p>}
                    </div>

                    {/* Children */}
                    <div className="flex-1">
                        <Controller
                            name="children"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={childOptions}
                                    placeholder="Child"
                                    className="w-full"
                                />
                            )}
                        />
                        {errors.children && <p className="text-red-500 text-sm">{errors.children.message}</p>}
                    </div>

                    {/* Submit */}
                    <div className="flex-1">
                        <Button
                            type="submit"
                            label="SUBMIT"
                            className="w-full bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 text-white font-medium py-3 px-4"
                            disabled={formMutation?.isLoading ? true : false}
                        />
                    </div>
                </form>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                header="Confirm Availability Check"
                visible={showConfirmDialog}
                maximizable
                onHide={onCancelSubmit}
                footer={
                    <div>
                        <Button label="Yes, Check Now" onClick={onConfirmSubmit} className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600" />
                        <Button label="Cancel" onClick={onCancelSubmit} className="p-button-secondary" />
                    </div>
                }
            >
                <div className="p-4">
                    <p className="text-lg mb-4">Are you sure you want to check for a room that matches the selected criteria?</p>

                    {pendingData && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-semibold">Check-in:</p>
                                <p>{pendingData.checkInDate ? moment(pendingData.checkInDate).format('MMMM D, YYYY h:mm A') : 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Check-out:</p>
                                <p>{pendingData.checkOutDate ? moment(pendingData.checkOutDate).format('MMMM D, YYYY h:mm A') : 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Adults:</p>
                                <p>{pendingData.adults}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Children:</p>
                                <p>{pendingData.children}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    );
}

export default BookingForm