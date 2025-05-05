"use client";

import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from 'nextjs-toploader/app';
import { Dialog } from "primereact/dialog";

// ✅ Validation Schema
const formSchema = z.object({
  question: z.string().min(3, "Name must be at least 3 characters"),
  answer: z.string().optional(),
  status: z.enum(["active", "deactive"]),
});

const defaultValues: FormData = {
  question: "",
  answer: "",
  status: "active",
};

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const RowForm: React.FC<{ handleFormSubmit: (FormData: FormData | null) => any, formMutation: any, initialData: FormData }> = ({ handleFormSubmit, formMutation, initialData = defaultValues }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(formSchema), defaultValues: initialData });

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

  const onCancelSubmit = (e?: any) => {
    e.preventDefault();
    setShowConfirmDialog(false);
  };

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Deactive", value: "deactive" }
  ];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4 items-center">

          {/* Question */}
          <div className="col-span-3 flex justify-center pt-2">
            <div className="p-field w-full md:w-1/2">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Question</label>
              <Controller
                name="question"
                control={control}
                render={({ field }) => <InputTextarea {...field} className="w-full" rows={3} />}
              />
            </div>
          </div>

          {/* Answer */}
          <div className="col-span-3 flex justify-center pt-2">
            <div className="p-field w-full md:w-1/2">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Answer</label>
              <Controller
                name="answer"
                control={control}
                render={({ field }) => <InputTextarea {...field} className="w-full" rows={3} />}
              />
            </div>
          </div>

          {/* Status */}
          <div className="col-span-3 flex justify-center pt-2">
            <div className="p-field w-full md:w-1/2">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Dropdown {...field} options={statusOptions} className="w-full" />
                )}
              />
            </div>
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
        Are you sure you want to submit this data?
      </Dialog>
    </>
  );
};

export default RowForm;
