"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import PhotoUploadPicker from "@/components/admin-panel/fileUploadPicker/PhotoUploadPicker";

import moment from 'moment';

// ✅ Validation Schema
const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format").nullable().optional(),
    address: z.string().min(3, "Address must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    gender: z.enum(["Male", "Female", "Prefer not to say"], {
        required_error: "Please select your gender",
    }).nullable(),
    phone: z.string()
        .regex(/^\d{12}$/, "Invalid phone number. Must be 12 digits only, e.g., 256123123123")
        .nullable().optional(),
    allow_notifications: z.boolean().default(true),
    status: z.enum(["active", "deactive"]).default("active"),
    agree: z.boolean().refine((val) => val === true, {
        message: "You must agree to the Terms & Conditions",
    }),
    nationality: z.string().nullable().optional(),
    age: z.number().int().positive().nullable().optional(),
    date_of_birth: z.date().nullable().optional(),
    photo: z.object({
        file: z.instanceof(File).optional(),
        previewUrl: z.string(),
        status: z.enum(["new", "existing"])
    }).nullable().optional(),
    photo_url: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
    // Validate date_of_birth is in the past
    if (data.date_of_birth && data.date_of_birth > new Date()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Date of birth must be in the past",
            path: ["date_of_birth"]
        });
    }

    // You can add additional validations here if needed
    // For example, ensuring age is reasonable (e.g., < 120 years)
    if (data.date_of_birth) {
        const calculatedAge = moment().diff(moment(data.date_of_birth), 'years');
        if (calculatedAge > 120) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Age cannot be greater than 120 years",
                path: ["date_of_birth"]
            });
        }
    }
});

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
    name: "",
    address: "",
    email: "",
    password: "",
    gender: "Prefer not to say",
    phone: null,
    allow_notifications: true,
    status: "active",
    agree: false,
    nationality: null,
    age: null,
    date_of_birth: null,
    photo: null,
    photo_url: null,
};

const RowForm: React.FC<{
    handleFormSubmit: (FormData: FormData | null) => any,
    formMutation: any,
    initialData?: FormData
}> = ({
    handleFormSubmit,
    formMutation,
    initialData = defaultValues
}) => {
        const {
            register,
            handleSubmit,
            setValue,
            getValues,
            watch,
            control,
            formState: { errors }
        } = useForm<FormData>({
            resolver: zodResolver(formSchema),
            defaultValues: initialData
        });

        console.log("🚀Form ~ errors:", errors);

        const allValuesInForm = getValues();
        console.log("🚀 ~ allValuesInForm:", allValuesInForm);

        // Get current photo and logo from form state
        const photo = watch("photo");
        const existingPhoto = watch("photo_url");

        // State for Terms & Conditions dialog
        const [termsVisible, setTermsVisible] = useState(false);

        // ===================================  ✅ Handle Form Submission =============================
        const [showConfirmDialog, setShowConfirmDialog] = useState(false);
        const [pendingData, setPendingData] = useState<FormData | null>(null);

        const onSubmit = (data: FormData) => {
            setPendingData(data);
            setShowConfirmDialog(true);
        };

        //======================= Confirm Submit ================================
        const onConfirmSubmit = (e: any) => {
            e.preventDefault();
            handleFormSubmit(pendingData);
            setShowConfirmDialog(false);
        };

        const onCancelSubmit = (e?: any) => {
            e?.preventDefault();
            setShowConfirmDialog(false);
        };

        // Status options
        const statusOptions = [
            { label: 'Active', value: 'active' },
            { label: 'Deactive', value: 'deactive' }
        ];

        // Nationality options (simplified list)
        const nationalityOptions = [
            { label: 'Ugandan', value: 'Ugandan' },
            { label: 'Kenyan', value: 'Kenyan' },
            { label: 'Tanzanian', value: 'Tanzanian' },
            { label: 'American', value: 'American' },
            { label: 'British', value: 'British' },
            { label: 'Other', value: 'Other' }
        ];

        return (
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 items-center">
                        {/* Name */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Name</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => <InputText {...field} className={`w-full ${errors.name ? "p-invalid" : ""}`} />}
                            />
                            {errors.name && <small className="p-error">{errors.name.message}</small>}
                        </div>

                        {/* Email */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Email</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => <InputText {...field} type="email" className={`w-full ${errors.email ? "p-invalid" : ""}`} />}
                            />
                            {errors.email && <small className="p-error">{errors.email.message}</small>}
                        </div>

                        {/* address*/}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Address</label>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => <InputText {...field} className={`w-full ${errors.address ? "p-invalid" : ""}`} />}
                            />
                            {errors.address && <small className="p-error">{errors.address.message}</small>}
                        </div>

                        {/* Phone Number */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Phone Number</label>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <InputMask
                                        {...field}
                                        mask="999999999999"
                                        placeholder="256123123123"
                                        className={`w-full ${errors.phone ? "p-invalid" : ""}`}
                                    />
                                )}
                            />
                            {errors.phone && <small className="p-error">{errors.phone.message}</small>}
                        </div>

                        {/* Gender */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Gender</label>
                            <div className="flex flex-col gap-2">
                                {["Male", "Female", "Prefer not to say"].map((option) => (
                                    <div key={option} className="flex items-center">
                                        <Controller
                                            name="gender"
                                            control={control}
                                            render={({ field }) => (
                                                <RadioButton
                                                    inputId={option}
                                                    value={option}
                                                    onChange={(e) => field.onChange(e.value)}
                                                    checked={field.value === option}
                                                />
                                            )}
                                        />
                                        <label htmlFor={option} className="ml-2 text-color">{option}</label>
                                    </div>
                                ))}
                            </div>
                            {errors.gender && <small className="p-error">{errors.gender.message}</small>}
                        </div>

                        {/* Nationality */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Nationality</label>
                            <Controller
                                name="nationality"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        {...field}
                                        options={nationalityOptions}
                                        placeholder="Select Nationality"
                                        className={`w-full ${errors.nationality ? "p-invalid" : ""}`}
                                    />
                                )}
                            />
                            {errors.nationality && <small className="p-error">{errors.nationality.message}</small>}
                        </div>

                        {/* Date of Birth */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Date of Birth</label>
                            <Controller
                                name="date_of_birth"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        {...field}
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        monthNavigator
                                        yearNavigator
                                        yearRange="1900:2025"
                                        className={`w-full ${errors.date_of_birth ? "p-invalid" : ""}`}
                                        value={field.value ? moment(field.value).toDate() : null}
                                        onChange={(e) => {
                                            e.value ? field.onChange(moment(e.value).toDate()) : null;

                                            const dateValue = e.value ? moment(e.value).toDate() : null;

                                            const calculateAge = (birthDate: any) => {
                                                if (!birthDate) return null;

                                                const birth = moment(birthDate);
                                                const now = moment();

                                                return now.diff(birth, 'years');
                                            };

                                            const age = calculateAge(dateValue)

                                            console.log("🚀 ~  testing on change age :", age)
                                            console.log("🚀 ~  testing on change age : e.value", dateValue)

                                            setValue('age', age);
                                        }}
                                    />
                                )}
                            />
                            {errors.date_of_birth && <small className="p-error">{errors.date_of_birth.message}</small>}
                        </div>

                        {/* Age */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Age</label>
                            <Controller
                                name="age"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        {...field}
                                        min={0}
                                        max={120}
                                        className={`w-full ${errors.age ? "p-invalid" : ""}`}
                                        disabled={true}
                                    />
                                )}
                            />
                            {errors.age && <small className="p-error">{errors.age.message}</small>}
                        </div>



                        {/* Status */}
                        {/* <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Status</label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        {...field}
                                        options={statusOptions}
                                        className={`w-full ${errors.status ? "p-invalid" : ""}`}
                                    />
                                )}
                            />
                            {errors.status && <small className="p-error">{errors.status.message}</small>}
                        </div> */}

                        {/* Allow Notifications */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Allow Notifications</label>
                            <Controller
                                name="allow_notifications"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        inputId="allow_notifications"
                                        checked={!!field.value}
                                        onChange={(e) => field.onChange(!!e.checked)}
                                        className={errors.allow_notifications ? "p-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.allow_notifications && (
                                <small className="p-error">{errors.allow_notifications.message}</small>
                            )}
                        </div>



                        {/* Password */}
                        <div className="p-field">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Password</label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        toggleMask
                                        className={`w-full ${errors.password ? "p-invalid" : ""}`}
                                        pt={{
                                            iconField: {
                                                root: { style: { width: "100%" } },
                                                style: { width: "100%" }
                                            },
                                            input: { style: { width: "100%" } },
                                            root: { style: { width: "100%" } },
                                            showIcon: { style: { right: "0.25rem" } },
                                            hideIcon: { style: { right: "0.25rem" } }
                                        }}
                                        feedback={true}
                                        promptLabel="Choose a password"
                                        weakLabel="Too simple"
                                        mediumLabel="Average complexity"
                                        strongLabel="Complex password"
                                    />
                                )}
                            />
                            {errors.password && <small className="p-error">{errors.password.message}</small>}
                        </div>

                        {/* Photo Upload */}
                        <div className="sm:col-span-3 md:col-span-3 lg:col-span-3">
                            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Photo</label>
                            <PhotoUploadPicker
                                setValue={setValue}
                                photo={photo}
                                existingPhoto={existingPhoto}
                                fieldName="photo"
                            />
                        </div>

                        {/* Terms Agreement */}
                        <div className="p-field">
                            <div className="flex items-center">
                                <Controller
                                    name="agree"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            inputId="agree"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.checked)}
                                            className={errors.agree ? "p-invalid" : ""}
                                        />
                                    )}
                                />
                                <label htmlFor="agree" className="ml-2 text-color">
                                    I agree to the <span
                                        className="text-blue-600 cursor-pointer hover:underline"
                                        onClick={() => setTermsVisible(true)}
                                    >
                                        Terms and Conditions
                                    </span>
                                </label>
                            </div>
                            {errors.agree && <small className="p-error">{errors.agree.message}</small>}
                        </div>

                        {/* Terms and Conditions Dialog */}
                        <Dialog
                            header="Terms and Conditions"
                            visible={termsVisible}
                            style={{ width: '80vw', maxWidth: '900px' }}
                            onHide={() => setTermsVisible(false)}
                            footer={
                                <div className="flex justify-end">
                                    <Button
                                        label="I Agree"
                                        onClick={() => {
                                            setValue("agree", true);
                                            setTermsVisible(false);
                                        }}
                                        className="p-button-success mr-2"
                                    />
                                    <Button
                                        label="Close"
                                        onClick={() => setTermsVisible(false)}
                                        className="p-button-secondary"
                                    />
                                </div>
                            }
                        >
                            <div className="max-h-96 overflow-y-auto px-2">
                                <h2 className="text-xl font-bold mb-4">Mingo Hotel Terms and Conditions</h2>

                                <h3 className="text-lg font-semibold mt-4">1. Acceptance of Terms</h3>
                                <p className="mb-3">By accessing or using the Mingo Hotel website and services, you agree to be bound by these Terms and Conditions.</p>

                                <h3 className="text-lg font-semibold mt-4">2. User Registration</h3>
                                <p className="mb-3">Users must provide accurate and complete information when registering an account. You are responsible for maintaining the confidentiality of your account information.</p>

                                <h3 className="text-lg font-semibold mt-4">3. Privacy Policy</h3>
                                <p className="mb-3">Your use of our services is also governed by our Privacy Policy, which details how we collect, use, and protect your personal information.</p>

                                <h3 className="text-lg font-semibold mt-4">4. Booking and Reservations</h3>
                                <p className="mb-3">Reservations are subject to availability and may require a valid credit card for confirmation. Cancellation policies vary by room type and rate plan.</p>

                                <h3 className="text-lg font-semibold mt-4">5. User Conduct</h3>
                                <p className="mb-3">Users agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.</p>

                                <h3 className="text-lg font-semibold mt-4">6. Intellectual Property</h3>
                                <p className="mb-3">All content on the Mingo Hotel website, including text, graphics, logos, and software, is the property of Mingo Hotel and is protected by copyright laws.</p>

                                <h3 className="text-lg font-semibold mt-4">7. Limitation of Liability</h3>
                                <p className="mb-3">Mingo Hotel shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>

                                <h3 className="text-lg font-semibold mt-4">8. Changes to Terms</h3>
                                <p className="mb-3">Mingo Hotel reserves the right to modify these Terms and Conditions at any time. Continued use of the service after such changes constitutes acceptance of the new terms.</p>

                                <h3 className="text-lg font-semibold mt-4">9. Governing Law</h3>
                                <p className="mb-3">These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Mingo Hotel is established.</p>

                                <h3 className="text-lg font-semibold mt-4">10. Contact Information</h3>
                                <p className="mb-3">For questions about these Terms, please contact us at legal@mingohotel.com.</p>

                                <p className="mt-6 text-sm">Last updated: May 06, 2025</p>
                            </div>
                        </Dialog>

                        {/* Submit Button */}
                        <div className="col-span-full flex justify-center pt-2">
                            <Button
                                type="submit"
                                label="Submit"
                                icon={formMutation?.isPending ? "pi pi-spin pi-spinner" : "pi pi-save"}
                                className="w-full md:w-1/2 p-3 text-xl"
                                disabled={formMutation?.isPending}
                            />
                        </div>
                    </div>
                </form>

                {/* Confirmation Dialog */}
                <Dialog
                    header="Confirm Submission"
                    visible={showConfirmDialog}
                    maximizable
                    onHide={onCancelSubmit}
                    footer={
                        <div>
                            <Button label="Yes" onClick={onConfirmSubmit} />
                            <Button
                                label="No"
                                onClick={onCancelSubmit}
                                className="p-button-secondary"
                            />
                        </div>
                    }
                >
                    Are you sure you want to Submit this data?
                </Dialog>
            </>
        );
    };

export default RowForm;