"use client";

import "regenerator-runtime/runtime";
import React, { useState, JSX } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRouter } from 'nextjs-toploader/app';
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

import {
  FaWifi,
  FaTv,
  FaBed,
  FaCoffee,
  FaUtensils,
  FaConciergeBell,
  FaBath,
  FaSwimmingPool,
  FaParking,
  FaRProject,
  FaVolumeUp,
  FaSpa,
} from "react-icons/fa";


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

    // Define a type for the icon values
    type IconKey = 'wifi' | 'tv' | 'bed' | 'breakfast' | 'dinner' | 'buffet' |
      'bathroom' | 'swimming pool' | 'parking' | 'projector' | 'speakers' | 'massage';

    // Define the option type
    interface IconOption {
      label: string;
      value: IconKey; // Now value must be one of the IconKey types
    }

    // Use the type for your array
    const iconOptions: IconOption[] = [
      { label: "Wi-Fi", value: "wifi" },
      { label: "TV", value: "tv" },
      { label: "Bed", value: "bed" },
      { label: "Breakfast", value: "breakfast" },
      { label: "Dinner", value: "dinner" },
      { label: "Buffet", value: "buffet" },
      { label: "Bathroom", value: "bathroom" },
      { label: "Swimming Pool", value: "swimming pool" },
      { label: "Parking", value: "parking" },
      { label: "Projector", value: "projector" },
      { label: "Speakers", value: "speakers" },
      { label: "Massage", value: "massage" },
    ];

    // Use the same type for your iconMap
    const iconMap: Record<IconKey, React.ReactNode> = {
      wifi: <FaWifi />,
      tv: <FaTv />,
      bed: <FaBed />,
      breakfast: <FaCoffee />,
      dinner: <FaUtensils />,
      buffet: <FaConciergeBell />,
      bathroom: <FaBath />,
      "swimming pool": <FaSwimmingPool />,
      parking: <FaParking />,
      projector: <FaRProject />,
      speakers: <FaVolumeUp />,
      massage: <FaSpa />,
    };

    // Template for the selected value
    const selectedIconTemplate = (option: IconOption | null) => {
      if (option) {
        return (
          <div className="flex items-center gap-2">
            {iconMap[option.value]}
            <span>{option.label}</span>
          </div>
        );
      }
      return <span>Select an icon</span>;
    };

    // Template for each item in the dropdown list
    const itemIconTemplate = (option: IconOption) => {
      return (
        <div className="flex items-center gap-2">
          {iconMap[option.value]}
          <span>{option.label}</span>
        </div>
      );
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
                    itemTemplate={itemIconTemplate}
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