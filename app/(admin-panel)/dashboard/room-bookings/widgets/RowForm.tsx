"use client";

import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useRouter } from 'nextjs-toploader/app';
import { Dialog } from "primereact/dialog";
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";
import { useQuery } from "@tanstack/react-query";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import {
  getAllRooms,
} from "@/services/rooms/rooms-service";
import moment from "moment";

import useAuthContext from "@/providers/AuthProvider";

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

// ✅ Validation Schema
const formSchema = z.object({
  room: z
    .object({
      id: z.number().min(1, "Room is required"),
      name: z.string().min(1, "Room name is required"),
    })
    .passthrough()
    .nullable()
    .optional()
    .superRefine((val, ctx) => requireField(val, ctx, "Room is required")),
  check_in: z.any().nullable().superRefine((val, ctx) => requireField(val, ctx, "Check-in date")),
  check_out: z.any().nullable().superRefine((val, ctx) => requireField(val, ctx, "Check-out date")),
  // status: z.enum(["new", "accepted", "declined"], {
  //   required_error: "Status is required",
  // }),
  status: z.string({
    required_error: "Status is required",
  }),
  number_of_adults: z.number({
    required_error: "Number of adults is required",
  }).min(1, "At least 1 adult is required"),
  number_of_children: z.number({
    required_error: "Number of children is required",
  }).min(0, "Number of children must be zero or greater"),
  description: z.string().optional(),
}).superRefine((data, ctx) => {
  if (
    data.check_in &&
    data.check_out &&
    moment(data.check_out).isSameOrBefore(data.check_in)
  ) {
    ctx.addIssue({
      path: ["check_out"],
      code: z.ZodIssueCode.custom,
      message: "Check-out must be after check-in",
    });
  }
});

const defaultValues = {
  room: null,
  check_in: null,
  check_out: null,
  status: "new",
  number_of_adults: 1,
  number_of_children: 0,
  description: "",
};

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const RowForm: React.FC<{
  handleFormSubmit: (FormData: FormData | null) => any,
  formMutation: any,
  initialData?: FormData,
}> = ({ handleFormSubmit, formMutation, initialData = defaultValues }) => {

  const { getUserQuery, logoutMutation } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;


  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  // Watch check-in date to set minimum date for check-out
  const checkInDate = watch("check_in");

  // ✅ Auto Complete States
  const [dropdownRooms, setDropdownRooms] = useState([]);

  // ✅ Fetch Rooms
  const roomsQuery = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
  });

  useHandleQueryError(roomsQuery);

  const router = useRouter();
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

  const statusOptions = [
    { label: "New", value: "new" },
    { label: "Accepted", value: "accepted" },
    { label: "Declined", value: "declined" }
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 items-center">
          {/* ✅ Room AutoComplete */}
          <div className="lg:col-span-3 flex justify-center pt-2">
            <div className="p-field w-full">
              <label htmlFor="room_id" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Room
              </label>
              <Controller
                name="room"
                control={control}
                render={({ field }) => {
                  const fetchSuggestions = (event: any) => {
                    const query = event.query.toLowerCase();
                    const filtered = roomsQuery?.data?.data?.data?.filter((room: any) =>
                      room?.name?.toLowerCase().includes(query)
                    );
                    setDropdownRooms(filtered);
                  };

                  return (
                    <AutoComplete
                      {...field}
                      multiple={false}
                      suggestions={dropdownRooms}
                      completeMethod={fetchSuggestions}
                      field="name"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      dropdown
                      disabled={roomsQuery?.isLoading}
                      placeholder="Select Room"
                      className={`w-full ${errors.room ? "p-invalid" : ""}`}
                    />
                  );
                }}
              />
              {errors.room && <small className="p-error">{errors?.room?.message?.toString()}</small>}
              {roomsQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
            </div>
          </div>

          {/* Check In Date */}
          <div className="flex justify-center pt-2">
            <div className="p-field w-full">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Check In</label>
              <Controller
                name="check_in"
                control={control}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    value={field.value ? moment(field.value).toDate() : null}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Check in"
                    className={`w-full ${errors.check_in ? "p-invalid" : ""}`}
                    minDate={new Date()}
                    showIcon
                    showTime
                    hourFormat="12"
                    showButtonBar
                  />
                )}
              />
              {errors.check_in && <small className="p-error">{errors?.check_in?.message?.toString()}</small>}
            </div>
          </div>

          {/* Check Out Date */}
          <div className="flex justify-center pt-2">
            <div className="p-field w-full">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Check Out</label>
              <Controller
                name="check_out"
                control={control}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    value={field.value ? moment(field.value).toDate() : null}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Check out"
                    className={`w-full ${errors.check_out ? "p-invalid" : ""}`}
                    minDate={checkInDate ? moment(checkInDate).toDate() : new Date()}
                    showIcon
                    showTime
                    hourFormat="12"
                    showButtonBar
                  />
                )}
              />
              {errors.check_out && <small className="p-error">{errors?.check_out?.message?.toString()}</small>}
            </div>
          </div>

          {/* Status Dropdown */}

          {loggedInUserData?.role === "System Admin" && (
            <>
              <div className="flex justify-center pt-2">
                <div className="p-field w-full">
                  <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        options={statusOptions}
                        className={`w-full ${errors.status ? "p-invalid" : ""}`}
                        placeholder="Select Status"
                      />
                    )}
                  />
                  {errors.status && <small className="p-error">{errors?.status?.message?.toString()}</small>}
                </div>
              </div>
            </>
          )}


          {/* Number of Adults */}
          <div className="flex justify-center pt-2">
            <div className="p-field w-full">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Number of Adults</label>
              <Controller
                name="number_of_adults"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    value={field.value ? Number(field.value) : undefined}
                    onChange={(e) => field.onChange(e.value ? Number(e.value) : undefined)}
                    min={1}
                    className={`w-full ${errors.number_of_adults ? "p-invalid" : ""}`}
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClassName="p-button-danger"
                    incrementButtonClassName="p-button-success"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                  />
                )}
              />
              {errors.number_of_adults && <small className="p-error">{errors?.number_of_adults?.message?.toString()}</small>}
            </div>
          </div>

          {/* Number of Children */}
          <div className="flex justify-center pt-2">
            <div className="p-field w-full">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Number of Children</label>
              <Controller
                name="number_of_children"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    value={field.value ? Number(field.value) : undefined}
                    onChange={(e) => field.onChange(e.value ? Number(e.value) : undefined)}
                    min={0}
                    className={`w-full ${errors.number_of_children ? "p-invalid" : ""}`}
                    showButtons
                    buttonLayout="horizontal"
                    decrementButtonClassName="p-button-danger"
                    incrementButtonClassName="p-button-success"
                    incrementButtonIcon="pi pi-plus"
                    decrementButtonIcon="pi pi-minus"
                  />
                )}
              />
              {errors.number_of_children && <small className="p-error">{errors?.number_of_children?.message?.toString()}</small>}
            </div>
          </div>

          {/* Description */}
          <div className="lg:col-span-3 flex justify-center pt-2">
            <div className="p-field w-full">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Description</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <InputTextarea {...field} className="w-full" rows={3} />}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="lg:col-span-3 flex justify-center pt-4">
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
        {pendingData?.room && (
          <p className="font-medium mt-2">Room: {pendingData.room.name}</p>
        )}
        {pendingData?.check_in && pendingData?.check_out && (
          <p className="mt-1">
            {moment(pendingData.check_in).format('MMMM D, YYYY h:mm A')} - {moment(pendingData.check_out).format('MMMM D, YYYY h:mm A')}
          </p>
        )}
      </Dialog>
    </>
  );
};

export default RowForm;