'use client';

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ContactFormData } from "../ContactUs";

interface RowFormProps {
    handleFormSubmit: (formData: ContactFormData | null) => void;
    formMutation: {
        isPending: boolean;
        isError: boolean;
        isSuccess: boolean;
    };
    initialData: ContactFormData;
}

const RowForm: React.FC<RowFormProps> = ({
    handleFormSubmit,
    formMutation,
    initialData
}) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState<ContactFormData | null>(null);

    const formSchema = z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 digits"),
        message: z.string().min(10, "Message must be at least 10 characters"),
    });

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<ContactFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = (data: ContactFormData) => {
        setPendingData(data);
        setShowConfirmDialog(true);
    };

    const onConfirmSubmit = () => {
        handleFormSubmit(pendingData);
        setShowConfirmDialog(false);
    };

    const onCancelSubmit = () => {
        setShowConfirmDialog(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div className="p-field">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Full Name*
                    </label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={`w-full p-inputtext-sm ${fieldState.error ? 'p-invalid' : ''}`}
                                    placeholder="Enter your full name"
                                />
                                {fieldState.error && (
                                    <small className="p-error">{fieldState.error.message}</small>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Email Field */}
                <div className="p-field">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Email Address*
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={`w-full p-inputtext-sm ${fieldState.error ? 'p-invalid' : ''}`}
                                    placeholder="Enter your email address"
                                />
                                {fieldState.error && (
                                    <small className="p-error">{fieldState.error.message}</small>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Phone Field */}
                <div className="p-field">
                    <label htmlFor="phone" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Phone Number*
                    </label>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={`w-full p-inputtext-sm ${fieldState.error ? 'p-invalid' : ''}`}
                                    placeholder="Enter your phone number"
                                />
                                {fieldState.error && (
                                    <small className="p-error">{fieldState.error.message}</small>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Message Field */}
                <div className="p-field">
                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
                        Message*
                    </label>
                    <Controller
                        name="message"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <InputTextarea
                                    id={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    rows={5}
                                    autoResize
                                    className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                                    placeholder="How can we help you?"
                                />
                                {fieldState.error && (
                                    <small className="p-error">{fieldState.error.message}</small>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    label="Send Message"
                    icon={formMutation?.isPending ? "pi pi-spin pi-spinner" : "pi pi-send"}
                    className="w-full p-3 text-lg"
                    disabled={formMutation.isPending}
                />
            </form>

            <Dialog
                header="Confirm Submission"
                visible={showConfirmDialog}
                onHide={onCancelSubmit}
                footer={
                    <div>
                        <Button label="Send Message" icon="pi pi-check" onClick={onConfirmSubmit} />
                        <Button label="Cancel" icon="pi pi-times" onClick={onCancelSubmit} className="p-button-text" />
                    </div>
                }
            >
                <p>Are you sure you want to send this message?</p>
            </Dialog>
        </>
    );
};

export default RowForm;