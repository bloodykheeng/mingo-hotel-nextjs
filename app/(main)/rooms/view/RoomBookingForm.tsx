"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import moment from "moment";
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
    room: any
}> = ({
    handleFormSubmit,
    formMutation,
    room
}) => {
        const {
            control,
            handleSubmit,
            formState: { errors }
        } = useForm<FormData>({
            defaultValues,
            resolver: zodResolver(bookingSchema),
        });

        const [showConfirmDialog, setShowConfirmDialog] = useState(false);
        const [pendingData, setPendingData] = useState<FormData | null>(null);

        const onSubmit = (data: FormData) => {
            setPendingData(data);
            setShowConfirmDialog(true);
        };

        const onConfirmSubmit = (e: any) => {
            e.preventDefault();
            handleFormSubmit(pendingData);
            setShowConfirmDialog(false);
        };

        const onCancelSubmit = () => {
            setShowConfirmDialog(false);
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 max-w-xl mx-auto">

                {/* Check-in */}
                <div>
                    <label className="block font-medium mb-1">Check-In Date & Time</label>
                    <Controller
                        name="check_in"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                value={field.value ? moment(field.value).toDate() : null}
                                onChange={(e) => field.onChange(e.value)}
                                className="w-full"
                                minDate={new Date()}
                                showIcon
                                showTime
                                hourFormat="12"
                                showButtonBar
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
                                value={field.value ? moment(field.value).toDate() : null}
                                onChange={(e) => field.onChange(e.value)}
                                className="w-full"
                                minDate={new Date()}
                                showIcon
                                showTime
                                hourFormat="12"
                                showButtonBar
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
                <Dialog
                    header="Confirm Booking Submission"
                    visible={showConfirmDialog}
                    maximizable
                    onHide={onCancelSubmit}
                    footer={
                        <div>
                            <Button label="Yes" onClick={onConfirmSubmit} />
                            <Button label="No" onClick={onCancelSubmit} className="p-button-secondary" />
                        </div>
                    }
                >
                    <p>Are you sure you want to submit this booking?</p>
                    {room && (
                        <p className="font-medium mt-2">Room: {room.name}</p>
                    )}
                    {pendingData?.check_in && pendingData?.check_out && (
                        <>
                            <p className="mt-1">
                                {moment(pendingData.check_in).format('MMMM D, YYYY h:mm A')} -{' '}
                                {moment(pendingData.check_out).format('MMMM D, YYYY h:mm A')}
                            </p>
                            <p className="text-sm">
                                Duration:{' '}
                                <strong>
                                    {moment(pendingData.check_out).diff(moment(pendingData.check_in), 'days')} night(s)
                                </strong>
                            </p>
                        </>
                    )}
                </Dialog>

            </form>
        );
    };

export default RoomBookingForm;
