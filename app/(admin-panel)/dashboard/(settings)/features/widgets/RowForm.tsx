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
});

// ✅ Default Form Values
const defaultValues: FormData = {
  name: "",
  icon: null,
  photo: null,
  photo_url: null,
  status: 'active',
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

    // ✅ PrimeReact Icon Options
    const iconOptions = [
      { label: "pi pi-wifi", value: "pi pi-wifi" },
      { label: "pi pi-heart", value: "pi pi-heart" },
      { label: "pi pi-star", value: "pi pi-star" },
      { label: "pi pi-home", value: "pi pi-home" },
      { label: "pi pi-car", value: "pi pi-car" },
      { label: "pi pi-desktop", value: "pi pi-desktop" },
      { label: "pi pi-gift", value: "pi pi-gift" },
      { label: "pi pi-sun", value: "pi pi-sun" },
      { label: "pi pi-moon", value: "pi pi-moon" },
      { label: "pi pi-info-circle", value: "pi pi-info-circle" },
      { label: "pi pi-check-circle", value: "pi pi-check-circle" },
      { label: "pi pi-key", value: "pi pi-key" },
      { label: "pi pi-lock", value: "pi pi-lock" },
      { label: "pi pi-camera", value: "pi pi-camera" },
      { label: "pi pi-video", value: "pi pi-video" },
      { label: "pi pi-map", value: "pi pi-map" },
      { label: "pi pi-phone", value: "pi pi-phone" },
      { label: "pi pi-envelope", value: "pi pi-envelope" },
      { label: "pi pi-calendar", value: "pi pi-calendar" },
      { label: "pi pi-clock", value: "pi pi-clock" },
      { label: "pi pi-globe", value: "pi pi-globe" },
      { label: "pi pi-language", value: "pi pi-language" },
      { label: "pi pi-users", value: "pi pi-users" },
      { label: "pi pi-user", value: "pi pi-user" },
      { label: "pi pi-cog", value: "pi pi-cog" },
      { label: "pi pi-wrench", value: "pi pi-wrench" },
      { label: "pi pi-bolt", value: "pi pi-bolt" },
      { label: "pi pi-shopping-cart", value: "pi pi-shopping-cart" },
      { label: "pi pi-tag", value: "pi pi-tag" },
      { label: "pi pi-ticket", value: "pi pi-ticket" },
      { label: "pi pi-thumbs-up", value: "pi pi-thumbs-up" },
      { label: "pi pi-bell", value: "pi pi-bell" },
      { label: "pi pi-bookmark", value: "pi pi-bookmark" },
      { label: "pi pi-book", value: "pi pi-book" },
      { label: "pi pi-briefcase", value: "pi pi-briefcase" },
      { label: "pi pi-coffee", value: "pi pi-coffee" },
      { label: "pi pi-compass", value: "pi pi-compass" },
      { label: "pi pi-credit-card", value: "pi pi-credit-card" },
      { label: "pi pi-database", value: "pi pi-database" },
      { label: "pi pi-flag", value: "pi pi-flag" },
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
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Feature Name</label>
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

            {/* Icon */}
            <div className="col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Icon</label>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={field.value}
                    options={iconOptions}
                    onChange={(e) => field.onChange(e.value)}
                    itemTemplate={iconTemplate}
                    valueTemplate={selectedIconTemplate}
                    placeholder="Select an icon"
                    className="w-full"
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