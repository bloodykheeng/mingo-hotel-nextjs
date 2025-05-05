"use client";

import "regenerator-runtime/runtime";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
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
        checkInDate: z.any().nullable(),
        checkOutDate: z.any().nullable(),
        adults: z.number(),
        children: z.number(),
    })
    .superRefine((data, ctx) => {
        requireField(data.checkInDate, ctx, "Check-in date");
        requireField(data.checkOutDate, ctx, "Check-out date");
        requireField(data.adults, ctx, "Number of adults");

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

export default function BookingForm() {
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
        console.log("Form Submitted:", data);
    };

    return (
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
                    />
                </div>
            </form>
        </div>
    );
}
