"use client";

import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useRouter } from 'nextjs-toploader/app';
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";
import { Checkbox } from "primereact/checkbox";

import {
  getAllFeatures,
} from "@/services/features/features-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import { useQuery } from "@tanstack/react-query";

import { getAllRoomCategorys } from "@/services/room-categories/room-categories-service";

import PhotoUploadPicker from "@/components/admin-panel/fileUploadPicker/PhotoUploadPicker";
import FileUploaderPicker from "@/components/admin-panel/fileUploadPicker/FileUploadPicker";

/**
 * Helper function to validate required fields in a Zod schema
 * @param val The value to validate
 * @param ctx The Zod context for error reporting
 * @param fieldName The name of the field for the error message
 * @returns The value if valid, z.NEVER if invalid
 */
const requireField = (val: any, ctx: z.RefinementCtx, fieldName: string) => {
  if (!!val === false) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} is required`,
    });
    return z.NEVER;
  }
  return val;
};

// ✅ Define Form Schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["active", "deactive"]),
  room_type: z.string(),
  room_category: z.object({ id: z.number(), name: z.string() })
    .nullable()
    .superRefine((val, ctx) => requireField(val, ctx, "Room Category is required")),
  price: z.number().min(0, "Price must be a positive number"),
  stars: z.number().min(0).max(5, "Stars must be between 0 and 5"),
  booked: z.boolean().default(false),
  number_of_adults: z.number().min(1, "At least 1 adult required"),
  number_of_children: z.number().min(0, "Number of children cannot be negative"),
  features: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),
  photo: z.object({
    file: z.instanceof(File).optional(),
    previewUrl: z.string(),
    status: z.enum(["new", "existing"])
  }).nullable().optional(),
  photo_url: z.string().nullable().optional(),
  attachments: z
    .array(
      z.object({
        type: z.string(),
        file: z.instanceof(File).optional(),
        previewUrl: z.string(),
        caption: z.string().optional(),
        status: z.string().optional(),
        existing_attachment_id: z.number().optional(),
        file_path: z.string().optional()
      })
    )
    .optional(),
  room_attachments: z.array(
    z.object({
      id: z.number().optional(),
      room_id: z.number().optional().nullable(),
      type: z.string(),
      file_path: z.string(),
      caption: z.string().optional().nullable(),
      created_by: z.number().optional().nullable(),
      updated_by: z.number().optional().nullable(),
    })
  ).optional(),
});

// ✅ Default Form Values
const defaultValues: FormData = {
  name: "",
  description: "",
  status: 'active',
  room_type: 'accommodation',
  room_category: null,
  price: 0,
  stars: 0,
  booked: false,
  number_of_adults: 1,
  number_of_children: 0,
  photo_url: null,
  features: [],
  attachments: [],
  room_attachments: []
};

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;


const RoomForm: React.FC<{
  handleFormSubmit: (FormData: FormData | null) => any,
  formMutation: any,
  initialData?: FormData,
  existingAttachments?: any[]
}> = ({
  handleFormSubmit,
  formMutation,
  initialData = defaultValues,
  existingAttachments = []
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

    // Watch values
    const features = watch("features");
    const attachments = watch("attachments") || [];
    const selectedRoomCategory = watch("room_category");

    // Get current photo from form state
    const photo = watch("photo");
    // Get existing photo path
    const existingPhoto = watch("photo_url");

    // Features dropdown state
    const [dropdownFeatures, setDropdownFeatures] = useState([]);
    const [roomCategorySuggestions, setRoomCategorySuggestions] = useState([]);

    // ✅ Fetch features from API
    const featuresQuery = useQuery({
      queryKey: ["features"],
      queryFn: () => getAllFeatures(),
    });

    useHandleQueryError(featuresQuery);

    // Query to fetch all room categories
    const roomCategoriesQuery = useQuery({
      queryKey: ["room-categories"],
      queryFn: getAllRoomCategorys,
    });

    useHandleQueryError(roomCategoriesQuery);

    // Merge existing attachments with current ones
    useEffect(() => {
      // Convert room existing attachments to UploadedFile format
      const existingIds = new Set(
        attachments
          .map(a => a.existing_attachment_id)
          .filter(id => !!id)
      );

      const filteredExisting = existingAttachments
        .filter(attachment => !existingIds.has(attachment.id))
        .map(attachment => ({
          type: attachment.type,
          previewUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${attachment.file_path}`,
          ...(attachment.caption ? { caption: attachment.caption } : {}),
          status: "existing",
          existing_attachment_id: attachment.id,
          file_path: attachment.file_path
        }));

      const mergedAttachments = [...attachments, ...filteredExisting];
      setValue("attachments", mergedAttachments);
    }, []);

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

    const roomTypeOptions = [
      { label: "Accommodation", value: "accommodation" },
      { label: "Conference Hall", value: "conference_hall" },
    ];

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 items-center">
            {/* Room Type */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Room Type</label>
              <Controller
                name="room_type"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    value={field.value}
                    options={roomTypeOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Select room type"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Room Category
              </label>
              <Controller
                name="room_category"
                control={control}
                render={({ field }) => {
                  // Handler to fetch suggestions filtered by input
                  const fetchRoomCategorySuggestions = (event: any) => {
                    const query = event.query.toLowerCase();

                    // Exclude the currently selected room category from suggestions
                    const selectedId = field.value?.id || null;

                    const filtered =
                      roomCategoriesQuery?.data?.data?.data?.filter(
                        (item: any) =>
                          item?.name?.toLowerCase().includes(query) &&
                          item.id !== selectedId
                      ) || [];

                    setRoomCategorySuggestions(filtered);
                  };

                  return (
                    <AutoComplete
                      {...field}
                      multiple={false}
                      suggestions={roomCategorySuggestions}
                      completeMethod={fetchRoomCategorySuggestions}
                      field="name"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);

                        // Clear other dependent suggestions or fields here if any
                        // e.g. setDistrictSuggestions([]); setValue("district", null); etc.
                      }}
                      dropdown
                      disabled={roomCategoriesQuery?.isLoading}
                      placeholder="Search & Select Room Category"
                      className={`w-full ${errors.room_category ? "p-invalid" : ""}`}
                    />
                  );
                }}
              />
              {errors.room_category && (
                <small className="p-error">{errors.room_category.message?.toString()}</small>
              )}
              {roomCategoriesQuery?.isLoading && (
                <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />
              )}
            </div>



            {/* Name */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Room Name</label>
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

            {/* Description */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <InputTextarea
                    {...field}
                    className={`w-full ${errors.description ? "p-invalid" : ""}`}
                    rows={3}
                  />
                )}
              />
              {errors.description && <small className="p-error">{errors.description.message}</small>}
            </div>

            {/* Status */}
            <div className="col-span-1">
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

            {/* Price */}
            <div className="col-span-1">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Price</label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    inputId={field.name}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    mode="currency"
                    currency="UGX"
                    locale="en-UG"
                    className={`w-full ${errors.price ? "p-invalid" : ""}`}
                  />

                )}
              />
              {errors.price && <small className="p-error">{errors.price.message}</small>}
            </div>

            {/* Stars */}
            <div className="col-span-1">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Stars</label>
              <Controller
                name="stars"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Rating
                    value={value}
                    onChange={(e) => onChange(e.value)}
                    cancel={false}
                    className={errors.stars ? "p-invalid" : ""}
                  />
                )}
              />
              {errors.stars && <small className="p-error">{errors.stars.message}</small>}
            </div>

            {/* Booked Status */}
            <div className="col-span-1">
              <div className="flex items-center mt-6">
                <Controller
                  name="booked"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onChange={(e) => onChange(e.checked)}
                      className="mr-2"
                    />
                  )}
                />
                <label className="text-gray-900 dark:text-gray-100 font-medium">Currently Booked</label>
              </div>
            </div>

            {/* Number of Adults */}
            <div className="col-span-1">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Number of Adults</label>
              <Controller
                name="number_of_adults"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    inputId={field.name}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    showButtons
                    min={1}
                    className={`w-full ${errors.number_of_adults ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.number_of_adults && <small className="p-error">{errors.number_of_adults.message}</small>}
            </div>

            {/* Number of Children */}
            <div className="col-span-1">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Number of Children</label>
              <Controller
                name="number_of_children"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    inputId={field.name}
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    showButtons
                    min={0}
                    className={`w-full ${errors.number_of_children ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.number_of_children && <small className="p-error">{errors.number_of_children.message}</small>}
            </div>

            {/* Features - AutoComplete Multiple Select */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Room Features</label>
              <Controller
                name="features"
                control={control}
                render={({ field }) => {
                  // ✅ Handle search & filtering
                  const fetchFeatureSuggestions = (event: any) => {
                    const query = event.query.toLowerCase();

                    // Get the currently selected features
                    const selectedIds = field.value?.map((feature: any) => feature.id) || [];

                    // Filter out already selected options
                    const filtered =
                      featuresQuery?.data?.data?.data?.filter(
                        (feature: any) =>
                          feature?.name?.toLowerCase().includes(query) &&
                          !selectedIds.includes(feature.id) // Exclude selected ones
                      ) || [];

                    setDropdownFeatures(filtered);
                  };

                  return (
                    <AutoComplete
                      {...field}
                      multiple // ✅ Multi-select mode
                      suggestions={dropdownFeatures}
                      completeMethod={fetchFeatureSuggestions} // ✅ Enables search filtering
                      field="name"
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      placeholder="Search & Select Room Features"
                      className={`w-full ${errors.features ? "p-invalid" : ""}`}
                      disabled={featuresQuery?.isLoading}
                      dropdown
                    />
                  );
                }}
              />
              {errors.features && <small className="p-error">{errors?.features?.message?.toString()}</small>}
              {featuresQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
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

            {/* File Upload */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <FileUploaderPicker setValue={setValue} attachments={attachments} />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center pt-2">
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
          Are you sure you want to submit this room data?
        </Dialog>
      </>
    );
  };

export default RoomForm;