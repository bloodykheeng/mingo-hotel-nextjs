"use client";

import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from 'nextjs-toploader/app';
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputTextarea } from "primereact/inputtextarea";


import PhotoUploadPicker from "@/components/admin-panel/fileUploadPicker/PhotoUploadPicker";

// ✅ Define Form Schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  icon: z.string().nullable().optional(),
  photo: z.object({
    file: z.instanceof(File).optional(),
    previewUrl: z.string(),
    status: z.enum(["new", "existing"])
  }).nullable().optional(),
  photo_url: z.string().nullable().optional(),
  status: z.enum(["active", "deactive"]),
  description: z.string().optional(),
});

// ✅ Default Form Values
const defaultValues: FormData = {
  name: "",
  photo: null,
  photo_url: null,
  status: 'active',
  description: "",
};

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const FeatureForm: React.FC<{
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



    // Custom template for displaying icons in dropdown
    const iconTemplate = (option: { label: string, value: string }) => {
      return (
        <div className="flex items-center gap-2">
          <i className={option.value}></i>
          <span>{option.label}</span>
        </div>
      );
    };

    // Selected icon value template
    const selectedIconTemplate = (option: { label: string, value: string }) => {
      if (option) {
        return (
          <div className="flex items-center gap-2">
            <i className={option.value}></i>
            <span>{option.label}</span>
          </div>
        );
      }
      return <span>Select an icon</span>;
    };

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4 items-center">
            {/* Name */}
            <div className="col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Room Category Name</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    className={`w-full ${errors.name ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.name && <small className="p-error">{errors.name.message}</small>}
            </div>

            {/* Description (Optional) */}
            <div className="col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Description <span className="text-sm text-gray-500">(optional)</span>
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    rows={4}
                    autoResize
                    className="w-full"
                    placeholder="Enter Room category description..."
                  />
                )}
              />
            </div>



            {/* Status */}
            <div className="col-span-3">
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
          Are you sure you want to submit this feature?
        </Dialog>
      </>
    );
  };

export default FeatureForm;