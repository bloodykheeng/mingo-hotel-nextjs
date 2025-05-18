'use client';

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import ContactFormRow from "./widgets/RowForm";

import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import {
    postContactUs
} from "@/services/contact-us/contact-us-service";

// Validation Schema
const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

// TypeScript Type for Form Fields
export type ContactFormData = z.infer<typeof formSchema>;

const defaultValues: ContactFormData = {
    name: "",
    email: "",
    phone: "",
    message: "",
};

const ContactUs: React.FC = () => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const queryClient = useQueryClient();
    const primeReactToast = usePrimeReactToast();

    const createMutation = useMutation({
        mutationFn: postContactUs,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-us"] });
            primeReactToast.success("Message Delivered Successfully");
            setFormSubmitted(true)
        }
    });

    useHandleMutationError(createMutation.error);

    const handleFormSubmit = (formData: any) => {
        if (formData) {
            createMutation.mutate(formData);
        }
    };




    const handleNewMessage = () => {
        setFormSubmitted(false);
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                    <p className="text-lg max-w-2xl mx-auto">
                        Have questions or need assistance? Our friendly team is here to help.
                        Reach out to us through the form below, and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold mb-6">Our Information</h3>

                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="text-blue-600 text-xl mr-4">
                                    <i className="pi pi-map-marker"></i>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">Address</h4>
                                    <p>Kayunga, Uganda</p>
                                </div>
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="text-blue-600 text-xl mr-4">
                                    <i className="pi pi-phone"></i>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">Phone</h4>
                                    <p>+256 700 123 456</p>
                                </div>
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="text-blue-600 text-xl mr-4">
                                    <i className="pi pi-envelope"></i>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">Email</h4>
                                    <p>info@mingohotel.com</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="text-blue-600 text-xl mr-4">
                                    <i className="pi pi-clock"></i>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">Business Hours</h4>
                                    <p>24/7 - Front Desk Services</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                                    <i className="pi pi-facebook"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                                    <i className="pi pi-twitter"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                                    <i className="pi pi-instagram"></i>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                                    <i className="pi pi-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        {formSubmitted ? (
                            <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-lg shadow-md text-center">
                                <div className="text-green-600 dark:text-green-400 text-5xl mb-4">
                                    <i className="pi pi-check-circle"></i>
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">Thank You!</h3>
                                <p className="mb-6">Your message has been sent successfully. We'll get back to you shortly.</p>
                                <Button
                                    label="Send Another Message"
                                    icon="pi pi-plus"
                                    onClick={handleNewMessage}
                                    className="p-button-outlined"
                                />
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                                <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
                                <ContactFormRow
                                    handleFormSubmit={handleFormSubmit}
                                    formMutation={createMutation}
                                    initialData={defaultValues}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;