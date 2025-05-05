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
import { getAllRegionalOffices } from "@/services/regional-offices/regional-offices-service";
import { getAllCSOs, } from "@/services/csos/csos-service";

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
    // password: z.string().min(6, "Password must be at least 6 characters"),
    password: z.string().optional(), // ✅ make it optional first
    editing: z.boolean().optional().nullable(),
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
    status: z.enum(["active", "deactive"]),
    // regional_offices: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),
    regional_office: z
      .object({ id: z.number(), name: z.string() })
      .passthrough()
      .optional()
      .nullable(),
    cso: z
      .object({
        id: z.number().min(1, "CSO ID is required"),
        name: z.string().min(1, "CSO name is required"),
      })
      .passthrough()
      .optional()
      .nullable(),
    role: z.string().min(1, "Role is required"),
  }).superRefine((data, ctx) => {
    const ppdaRoles = ["PPDA Admin", "PPDA Officer"];
    const csoRoles = ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"];

    // if (ppdaRoles.includes(data.role) && (!data.regional_offices || data.regional_offices.length === 0)) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["regional_offices"],
    //     message: "Regional Offices are required for this role.",
    //   });
    // }

    if ((ppdaRoles.includes(data.role) || csoRoles.includes(data.role)) && !data.regional_office) {
      ctx.addIssue({
        code: "custom",
        path: ["regional_office"],
        message: "Regional Office is required for this role.",
      });
    }


    if (csoRoles.includes(data.role) && !data.cso) {
      ctx.addIssue({
        code: "custom",
        path: ["cso"],
        message: "CSO is required for this role.",
      });
    }

    // ✅ Conditionally require password if not editing
    if (data?.editing === true && (data?.password && data?.password?.length < 6)) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 6 characters",
      });
    }

    // make passsword a must when creating
    if ((data?.editing === false || !data?.editing) && ((data?.password ?? "").length < 6)) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 6 characters",
      });
    }
  });







const defaultValues: FormData = {

  name: "", // Empty string for user input
  email: "", // Empty email
  password: "", // Empty password
  gender: "Prefer not to say", // Default to 'Prefer not to say'
  // agree_to_terms: false, // Default to false (user must check it)
  phone: "", // Empty phone

  allow_notifications: null,
  status: "active", // Must be exactly "active" | "deactive"

  // regional_offices: undefined,
  regional_office: undefined,
  cso: undefined, // Required for local users
  role: "",
};



// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;




const RowForm: React.FC<{ handleFormSubmit: (FormData: FormData | null) => any, formMutation: any, initialData: FormData, usersCategory: string, }> = ({ handleFormSubmit, formMutation, initialData = defaultValues, usersCategory }) => {
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
  })

  const router = useRouter();

  console.log("🚀Form ~ errors:", errors)


  const allValuesInForm = getValues();
  console.log("🚀 ~ allValuesInForm:", allValuesInForm)

  const role = watch("role");
  const showRegionalOffices = ["PPDA Admin", "PPDA Officer"].includes(role) || ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"].includes(role);
  const showCSO = ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"].includes(role);

  const regional_office = watch("regional_office");



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





  //============ Auto Complete States =================


  const [dropdownRegionalOffices, setDropdownRegionalOffices] = useState([]);
  const [dropdownCSOs, setDropdownCSOs] = useState([]);
  const [dropdownRoles, setDropdownRoles] = useState([]);

  // ✅ Fetch roles from API
  const rolesQuery = useQuery({
    queryKey: ["roles", usersCategory],
    queryFn: (queryParams) => getAllUserAssignableRoles({ ...queryParams, usersCategory }),
  });
  console.log("🚀 ~ rolesQuery:", rolesQuery)

  useHandleQueryError(rolesQuery);


  // ✅ Fetch regional offices from API
  const regionalOfficesQuery = useQuery({
    queryKey: ["regional-offices"],
    queryFn: () => getAllRegionalOffices(),
  });

  useHandleQueryError(regionalOfficesQuery);

  // ✅ Fetch CSOs from API
  const csosQuery = useQuery({
    queryKey: ["csos", "regional_office", regional_office],
    queryFn: () => getAllCSOs({ regional_office_id: regional_office?.id }),
    enabled: !!regional_office && showCSO
  });

  useHandleQueryError(csosQuery);



  // ✅ Dropdown Options
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Deactive", value: "deactive" },
  ];






  const [termsVisible, setTermsVisible] = useState(false);



  return (
    <>

      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4 items-center">

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

          {/* Phone Number */}
          <div className="p-field">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Phone Number</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputMask
                  {...field}
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

          {/* Status */}
          <div className="p-field">
            <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => <Dropdown {...field} options={statusOptions} className="w-full" />}
            />
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

          <div className="p-field">
            <label htmlFor="role" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Role
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => {
                // ✅ Handle search & filtering
                const fetchRoleSuggestions = (event: any) => {
                  const query = event.query.toLowerCase();
                  // Get the currently selected role (single value)
                  const selectedRole = field.value || null;
                  // Filter out the already selected option
                  const filtered =
                    rolesQuery?.data?.data?.filter(
                      (role: string) =>
                        role.toLowerCase().includes(query) &&
                        role !== selectedRole // Exclude selected one
                    ) || [];

                  setDropdownRoles(filtered);
                };


                return (
                  <AutoComplete
                    {...field}
                    multiple={false} // ✅ Single-select mode
                    suggestions={dropdownRoles}
                    completeMethod={fetchRoleSuggestions} // ✅ Enables search filtering
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);

                      setDropdownRegionalOffices([])
                      setDropdownCSOs([]);

                      // Clear in form state
                      setValue("regional_office", null);
                      setValue("cso", null);
                    }}
                    dropdown
                    disabled={rolesQuery?.isLoading}
                    placeholder="Select Role"
                    className={`w-full ${errors.role ? "p-invalid" : ""}`}
                  />
                );
              }}
            />
            {errors.role && <small className="p-error">{errors?.role?.message?.toString()}</small>}
            {rolesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
          </div>

          {/* {showRegionalOffices && (
            <>
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Regional Offices</label>
                <Controller
                  name="regional_offices"
                  control={control}
                  render={({ field }) => {
                    // ✅ Handle search & filtering
                    const fetchRegionalOfficeSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const filtered =
                        regionalOfficesQuery?.data?.data?.data?.filter((office: any) =>
                          office?.name?.toLowerCase().includes(query)
                        ) || [];
                      setDropdownRegionalOffices(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple // ✅ Multi-select mode
                        suggestions={dropdownRegionalOffices}
                        completeMethod={fetchRegionalOfficeSuggestions} // ✅ Enables search filtering
                        field="name"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder="Search & Select Regional Offices"
                        className={`w-full ${errors.regional_offices ? "p-invalid" : ""}`}
                        disabled={regionalOfficesQuery?.isLoading}
                        dropdown
                      />
                    );
                  }}
                />
                {errors.regional_offices && <small className="p-error">{errors?.regional_offices?.message?.toString()}</small>}
                {regionalOfficesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
              </div>
            </>
          )} */}


          {showRegionalOffices && (
            <div className="p-field col-span-3">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">Regional Office</label>
              <Controller
                name="regional_office"
                control={control}
                render={({ field }) => {
                  // ✅ Handle search & filtering
                  const fetchRegionalOfficeSuggestions = (event: any) => {
                    const query = event.query.toLowerCase();

                    // Get the currently selected regional office (single object)
                    const selectedId = field.value?.id || null;

                    // Filter out the already selected option
                    const filtered =
                      regionalOfficesQuery?.data?.data?.data?.filter(
                        (office: any) =>
                          office?.name?.toLowerCase().includes(query) &&
                          office.id !== selectedId // Exclude selected one
                      ) || [];

                    setDropdownRegionalOffices(filtered);
                  };

                  return (
                    <AutoComplete
                      {...field}
                      suggestions={dropdownRegionalOffices}
                      completeMethod={fetchRegionalOfficeSuggestions} // ✅ Enables search filtering
                      field="name"
                      value={field.value || null} // Ensure value is null when not selected
                      onChange={(e) => {
                        field.onChange(e.value)

                        setDropdownCSOs([]);

                        // Clear in form state
                        setValue("cso", null);

                      }}
                      placeholder="Search & Select Regional Office"
                      className={`w-full ${errors.regional_office ? "p-invalid" : ""}`}
                      disabled={regionalOfficesQuery?.isLoading}
                      dropdown
                    />
                  );
                }}
              />
              {errors.regional_office && <small className="p-error">{errors?.regional_office?.message?.toString()}</small>}
              {regionalOfficesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
            </div>
          )}




          {showCSO && (
            <>
              <div className="p-field col-span-3">
                <label htmlFor="cso" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Civil Society Organization (CSO)
                </label>
                <Controller
                  name="cso"
                  control={control}
                  render={({ field }) => {
                    // ✅ Handle search & filtering
                    const fetchSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();

                      // Get the currently selected CSO (single object)
                      const selectedId = field.value?.id || null;

                      // Filter out the already selected CSO
                      const filtered =
                        csosQuery?.data?.data?.data?.filter(
                          (cso: any) =>
                            cso?.name?.toLowerCase().includes(query) &&
                            cso.id !== selectedId // Exclude selected one
                        ) || [];

                      setDropdownCSOs(filtered);
                    };


                    return (
                      <AutoComplete
                        {...field}
                        multiple={false} // ✅ Single-select mode
                        suggestions={dropdownCSOs}
                        completeMethod={fetchSuggestions} // ✅ Enables search filtering
                        field="name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        dropdown
                        disabled={csosQuery?.isLoading || !regional_office}
                        placeholder="Select CSO"
                        className={`w-full ${errors.cso ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.cso && <small className="p-error">{errors?.cso?.message?.toString()}</small>}
                {csosQuery?.isLoading && regional_office && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
              </div>
            </>
          )}




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
