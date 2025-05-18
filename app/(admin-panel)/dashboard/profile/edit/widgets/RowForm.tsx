"use client";

import "regenerator-runtime/runtime";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputMask } from "primereact/inputmask";

//
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";
import { RadioButton } from "primereact/radiobutton";



import { getAllUserAssignableRoles } from "@/services/users/user-roles-service";


import useHandleQueryError from "@/hooks/useHandleQueryError";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



import { useRouter } from 'nextjs-toploader/app';



import { Dialog } from "primereact/dialog";

import Link from "next/link";

import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";


// ✅ Validation Schema
const formSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    address: z.string().min(3, "Address must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    gender: z.enum(["Male", "Female", "Prefer not to say"], {
      required_error: "Please select your gender",
    }),
    phone: z.string()
      // .min(10, "Phone number must be at least 10 digits")
      // .max(15, "Phone number is too long")
      // .regex(/^\+\d{3}\d{3}\d{3}\d{3}$/, "Invalid phone number format. Please use a valid phonenumber eg: (+256) 123 123 123"),
      .regex(/^\d{12}$/, "Invalid phone number. Must be 12 digits only, e.g., 256123123123"),
    // agree_to_terms: z.boolean().refine((val) => val === true, {
    //   message: "You must agree to the Terms & Conditions",
    // }),
    allow_notifications: z.boolean().optional().nullable(),

  });


const defaultValues: FormData = {

  name: "", // Empty string for user input
  address: "",
  email: "", // Empty email
  password: "", // Empty password
  gender: "Prefer not to say", // Default to 'Prefer not to say'
  // agree_to_terms: false, // Default to false (user must check it)
  phone: "", // Empty phone

  allow_notifications: null,

};



// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const RowForm: React.FC<{ handleFormSubmit: (FormData: FormData | null) => any, formMutation: any, initialData: FormData, }> = ({ handleFormSubmit, formMutation, initialData = defaultValues, }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors }

  } = useForm<FormData>({ resolver: zodResolver(formSchema), defaultValues: initialData })

  const router = useRouter();

  console.log("🚀Form ~ errors:", errors)


  const allValuesInForm = getValues();
  console.log("🚀 ~ allValuesInForm:", allValuesInForm)





  // ===================================  ✅ Handle Form Submission =============================
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    setPendingData(data)
    setShowConfirmDialog(true);
  };

  //======================= Confirm Submit ================================


  const onConfirmSubmit = (e: any) => {
    e.preventDefault();
    handleFormSubmit(pendingData);
    setShowConfirmDialog(false);
  };

  const onCancelSubmit = (e?: any) => {
    e.preventDefault();
    setShowConfirmDialog(false);
  };




  const [termsVisible, setTermsVisible] = useState(false);



  return (
    <>

      <form
        onSubmit={handleSubmit(onSubmit)}
      >
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
                  // mask="+999999999999" // Format: (+XXX) XXX XXX XXX
                  // placeholder="(+256) 123 123 123"
                  mask="999999999999" // Just 12 digits
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
                      <RadioButton inputId={option} value={option} onChange={(e) => field.onChange(e.value)} checked={field.value === option} />
                    )}
                  />
                  <label htmlFor={option} className="ml-2 text-color">{option}</label>
                </div>
              ))}
            </div>
            {errors.gender && <small className="p-error">{errors.gender.message}</small>}
          </div>

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
              render={({ field }) =>
                <Password
                  {...field} toggleMask
                  className={`w-full ${errors.password ? "p-invalid" : ""}`}
                  pt={{
                    iconField: {
                      root: {
                        style: { width: "100%", },

                      },
                      style: { width: "100%", },
                    },
                    input: {
                      style: { width: "100%", },
                    },
                    root: {
                      style: { width: "100%" },
                    },
                    showIcon: { style: { right: "0.25rem", } },
                    hideIcon: { style: { right: "0.25rem", } },
                  }}
                  feedback={true} // Set to true if you want password strength indicator
                  promptLabel="Choose a password"
                  weakLabel="Too simple"
                  mediumLabel="Average complexity"
                  strongLabel="Complex password" />
              }
            />
            {errors.password && <small className="p-error">{errors.password.message}</small>}
          </div>






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
