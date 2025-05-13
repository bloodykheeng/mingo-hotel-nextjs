"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

// ✅ Form Validation Schema
const bookingSchema = z.object({
    check_in: z.date({ required_error: "Check-in is required" }),
    check_out: z.date({ required_error: "Check-out is required" }),
    number_of_adults: z.number().min(1, "At least one adult required"),
    number_of_children: z.number().min(0, "Cannot be negative"),
    description: z.string().optional(),
});

// ✅ Typescript Types
type FormData = z.infer<typeof bookingSchema>;

// ✅ Default Values
const defaultValues: FormData = {
    check_in: new Date(),
    check_out: new Date(),
    number_of_adults: 1,
    number_of_children: 0,
    description: "",
};

const RoomBookingForm: React.FC<{
    handleFormSubmit: (FormData: FormData | null) => any,
    formMutation: any,
}> = ({
    handleFormSubmit,
    formMutation,
}) => {
        const {
            control,
            handleSubmit,
            formState: { errors }
        } = useForm<FormData>({
            defaultValues,
            resolver: zodResolver(bookingSchema),
        });

        return (
            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4 max-w-xl mx-auto">

                {/* Check-in */}
                <div>
                    <label className="block font-medium mb-1">Check-In Date & Time</label>
                    <Controller
                        name="check_in"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                showTime
                                showIcon
                                className="w-full"
                            />
                        )}
                    />
                    {errors.check_in && <small className="p-error">{errors.check_in.message}</small>}
                </div>

                {/* Check-out */}
                <div>
                    <label className="block font-medium mb-1">Check-Out Date & Time</label>
                    <Controller
                        name="check_out"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                showTime
                                showIcon
                                className="w-full"
                            />
                        )}
                    />
                    {errors.check_out && <small className="p-error">{errors.check_out.message}</small>}
                </div>

                {/* Adults */}
                <div>
                    <label className="block font-medium mb-1">Number of Adults</label>
                    <Controller
                        name="number_of_adults"
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value)}
                                min={1}
                                className="w-full"
                            />
                        )}
                    />
                    {errors.number_of_adults && <small className="p-error">{errors.number_of_adults.message}</small>}
                </div>

                {/* Children */}
                <div>
                    <label className="block font-medium mb-1">Number of Children</label>
                    <Controller
                        name="number_of_children"
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value)}
                                min={0}
                                className="w-full"
                            />
                        )}
                    />
                    {errors.number_of_children && <small className="p-error">{errors.number_of_children.message}</small>}
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <InputTextarea
                                {...field}
                                rows={3}
                                autoResize
                                className="w-full"
                                placeholder="Optional notes..."
                            />
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <Button label="Submit Booking" type="submit" className="w-full" />
                </div>
            </form>
        );
    };

export default RoomBookingForm;
