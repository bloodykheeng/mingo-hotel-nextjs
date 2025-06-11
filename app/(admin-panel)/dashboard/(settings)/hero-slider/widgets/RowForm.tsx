"use client";

import "regenerator-runtime/runtime";
import React, { useState, JSX } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useRouter } from 'nextjs-toploader/app';
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

import PhotoUploadPicker from "@/components/admin-panel/fileUploadPicker/PhotoUploadPicker";

// ✅ Define Form Schema
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().nullable().optional(),
  button_link_one: z.string().nullable().optional(),
  button_link_two: z.string().nullable().optional(),
  photo: z.object({
    file: z.instanceof(File).optional(),
    previewUrl: z.string(),
    status: z.enum(["new", "existing"])
  }).nullable().optional(),
  photo_url: z.string().nullable().optional(),
  status: z.enum(["active", "deactive"]),
});

// ✅ Default Form Values
const defaultValues: FormData = {
  title: "",
  description: null,
  button_link_one: null,
  button_link_two: null,
  photo: null,
  photo_url: null,
  status: 'active',
};

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const HeroSliderForm: React.FC<{
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
      control,
      watch,
      setValue,
      formState: { errors }
    } = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData
    });

    const router = useRouter();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingData, setPendingData] = useState<FormData | null>(null);

    // Get current photo from form state
    const photo = watch("photo");
    // Get existing photo path
    const existingPhoto = watch("photo_url");

    const onSubmit = (data: FormData) => {
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

    // ✅ Dropdown Options
    const statusOptions = [
      { label: "Active", value: "active" },
      { label: "Deactive", value: "deactive" },
    ];

    const linkOptions = [
      { label: "Rooms", value: "/rooms" },
      { label: "About", value: "/about" },
      { label: "FAQs", value: "/faqs" },
      { label: "Login", value: "/login" },
      { label: "Register", value: "/register" },
    ];

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4 items-center">
            {/* Title */}
            <div className="col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Title</label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    className={`w-full ${errors.title ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.title && <small className="p-error">{errors.title.message}</small>}
            </div>

            {/* Description */}
            <div className="col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    value={field.value || ""}
                    rows={4}
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* Button Link One */}
            <div className="col-span-3 md:col-span-1">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Button Link One</label>
              <Controller
                name="button_link_one"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={field.value}
                    options={linkOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Select a link"
                    className="w-full"
                    showClear
                  />
                )}
              />
            </div>

            {/* Button Link Two */}
            <div className="col-span-3 md:col-span-1">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Button Link Two</label>
              <Controller
                name="button_link_two"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={field.value}
                    options={linkOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Select a link"
                    className="w-full"
                    showClear
                  />
                )}
              />
            </div>

            {/* Status */}
            <div className="col-span-3 md:col-span-1">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={field.value}
                    options={statusOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Select status"
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* Photo Upload */}
            <div className="sm:col-span-3 md:col-span-3 lg:col-span-3">
              <PhotoUploadPicker
                setValue={setValue}
                photo={photo}
                existingPhoto={existingPhoto}
                fieldName="photo"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-3 flex justify-center pt-2">
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
              <Button label="No" onClick={onCancelSubmit} className="p-button-secondary" />
            </div>
          }
        >
          Are you sure you want to submit this hero slider?
        </Dialog>
      </>
    );
  };

export default HeroSliderForm;