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

//
import { AutoComplete } from "primereact/autocomplete";
import { ProgressSpinner } from "primereact/progressspinner";
import { RadioButton } from "primereact/radiobutton";


import { getAllRegions } from "@/services/locations/regions-service";
import { getAllDistricts } from "@/services/locations/districts-service";
import { getAllCounty } from "@/services/locations/county-service";
import { getAllSubcounty } from "@/services/locations/subcounty-service";
import { getAllParish } from "@/services/locations/parish-service";
import { getAllVillage } from "@/services/locations/village-service";

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
    password: z.string().min(6, "Password must be at least 6 characters"),
    gender: z.enum(["Male", "Female", "Prefer not to say"], {
      required_error: "Please select your gender",
    }),
    // agree_to_terms: z.boolean().refine((val) => val === true, {
    //   message: "You must agree to the Terms & Conditions",
    // }),
    allow_notifications: z.boolean().optional().nullable(),
    regional_offices: z.array(z.object({ id: z.number(), name: z.string() }).passthrough()).optional(),
    cso: z
      .object({
        id: z.number().min(1, "CSO ID is required"),
        name: z.string().min(1, "CSO name is required"),
      })
      .passthrough()
      .optional()
      .nullable(),
    country: z
      .object({
        id: z.union([z.string(), z.number()]),
        name: z.string().min(1, "Country name is required"),
      })
      .passthrough()
      .optional()
      .nullable(),

    region: z
      .object({
        id: z.number().min(1, "Region ID is required"),
        name: z.string().min(1, "Region name is required"),
      })
      .passthrough()
      .optional()
      .nullable(),

    district: z
      .object({
        id: z.number().min(1, "District ID is required"),
        name: z.string().min(1, "District name is required"),
      })
      .passthrough()
      .optional()
      .nullable(),

    county: z
      .object({
        id: z.number().min(1, "County ID is required"),
        name: z.string().min(1, "County name is required"),
      })
      .optional()
      .nullable(),

    subcounty: z
      .object({
        id: z.number().min(1, "Subcounty ID is required"),
        name: z.string().min(1, "Subcounty name is required"),
      })
      .passthrough()
      .optional()
      .nullable(),

    parish: z
      .object({
        id: z.number().min(1, "Parish ID is required"),
        name: z.string().min(1, "Parish name is required"),
      })
      .passthrough()
      .optional()
      .nullable(),

    village: z
      .object({
        id: z.number().min(1, "Village ID is required"),
        name: z.string().min(1, "Village name is required"),
      })
      .passthrough()
      .optional()
      .nullable(),


  })


const defaultValues: FormData = {

  name: "", // Empty string for user input
  email: "", // Empty email
  password: "", // Empty password
  gender: "Prefer not to say", // Default to 'Prefer not to say'
  // agree_to_terms: false, // Default to false (user must check it)

  allow_notifications: null,

  regional_offices: undefined,
  cso: undefined, // Required for local users

  country: undefined, // Only needed for international users
  region: undefined, // Required for local users
  district: undefined, // Required for local users
  county: undefined, // Required for local users
  subcounty: undefined, // Required for local users
  parish: undefined, // Required for local users
  village: undefined, // Required for local users

};



// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const RowForm: React.FC<{ handleFormSubmit: (FormData: FormData | null) => any, formMutation: any, initialData: FormData }> = ({ handleFormSubmit, formMutation, initialData = defaultValues }) => {
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





  //============ Auto Complete States =================
  const [dropdownCountries, setDropdownCountries] = useState([]);


  const [dropdownRegions, setDropdownRegions] = useState([]);


  const [dropdownDistricts, setDropdownDistricts] = useState([]);

  const [dropdownCounties, setDropdownCounties] = useState([]);


  const [dropdownSubcounties, setDropdownSubcounties] = useState([]);

  const [dropdownParishes, setDropdownParishes] = useState([]);

  const [dropdownVillages, setDropdownVillages] = useState([]);



  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");
  const selectedCounty = watch("county");
  const selectedSubcounty = watch("subcounty");
  const selectedParish = watch("parish");


  const [dropdownRegionalOffices, setDropdownRegionalOffices] = useState([]);

  // ✅ Fetch regional offices from API
  const regionalOfficesQuery = useQuery({
    queryKey: ["regional-offices"],
    queryFn: () => getAllRegionalOffices(),
  });

  useHandleQueryError(regionalOfficesQuery);


  const [dropdownCSOs, setDropdownCSOs] = useState([]);

  // ✅ Fetch CSOs from API
  const csosQuery = useQuery({
    queryKey: ["csos"],
    queryFn: getAllCSOs,
  });

  useHandleQueryError(csosQuery);





  // Fetch regions
  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: getAllRegions,
  });
  useHandleQueryError(regionsQuery);

  // Fetch districts based on selected region
  const districtsQuery = useQuery({
    queryKey: ["districts", selectedRegion],
    queryFn: () => getAllDistricts({ region_id: selectedRegion?.id }),
    enabled: !!selectedRegion, // Ensures the query is run only when a region is selected
  });
  useHandleQueryError(districtsQuery);

  // Fetch counties based on selected district
  const countiesQuery = useQuery({
    queryKey: ["counties", selectedDistrict?.id], // Use selectedDistrict?.id
    queryFn: () => getAllCounty({ district_id: selectedDistrict?.id }),
    enabled: !!selectedDistrict?.id, // Ensure query runs only when ID is available
  });
  useHandleQueryError(countiesQuery);

  // Fetch subcounties based on selected county
  const subcountiesQuery = useQuery({
    queryKey: ["subcounties", selectedCounty?.id],
    queryFn: () => getAllSubcounty({ county_id: selectedCounty?.id }),
    enabled: !!selectedCounty?.id,
  });
  useHandleQueryError(subcountiesQuery);

  // Fetch parishes based on selected subcounty
  const parishesQuery = useQuery({
    queryKey: ["parishes", selectedSubcounty?.id],
    queryFn: () => getAllParish({ sub_county_id: selectedSubcounty?.id }),
    enabled: !!selectedSubcounty?.id,
  });
  useHandleQueryError(parishesQuery);

  // Fetch villages based on selected parish
  const villagesQuery = useQuery({
    queryKey: ["villages", selectedParish?.id],
    queryFn: () => getAllVillage({ parish_id: selectedParish?.id }),
    enabled: !!selectedParish?.id,
  });
  useHandleQueryError(villagesQuery);
  //=========================


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
                    showIcon: { style: { right: "0.2rem", } },
                    hideIcon: { style: { right: "0.2rem", } },
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


          <div className="p-field">
            <label htmlFor="cso" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Customer Service Officer (CSO)
            </label>
            <Controller
              name="cso"
              control={control}
              render={({ field }) => {
                // ✅ Handle search & filtering
                const fetchSuggestions = (event: any) => {
                  const query = event.query.toLowerCase();
                  const filtered =
                    csosQuery?.data?.data?.data?.filter((cso: any) =>
                      cso?.name?.toLowerCase().includes(query)
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
                    disabled={csosQuery?.isLoading}
                    placeholder="Select CSO"
                    className={`w-full ${errors.cso ? "p-invalid" : ""}`}
                  />
                );
              }}
            />
            {errors.cso && <small className="p-error">{errors?.cso?.message?.toString()}</small>}
            {csosQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
          </div>





          {/* ✅ Region AutoComplete */}
          <div className="p-field ">
            <label htmlFor="region" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Region
            </label>
            <Controller
              name="region"
              control={control}
              render={({ field }) => {
                const fetchSuggestions = (event: any) => {
                  const query = event.query.toLowerCase();
                  const filtered = regionsQuery?.data?.data?.data?.filter((region: any) =>
                    region?.name?.toLowerCase().includes(query)
                  );
                  setDropdownRegions(filtered);
                };

                return (
                  <AutoComplete
                    {...field}
                    multiple={false}
                    suggestions={dropdownRegions}
                    completeMethod={fetchSuggestions}
                    field="name"
                    value={field.value}
                    onChange={(e) => {

                      field.onChange(e.value)

                      // Clear Local Government dependent fields
                      setDropdownDistricts([]);
                      setDropdownCounties([]);
                      setDropdownSubcounties([]);
                      setDropdownParishes([]);
                      setDropdownVillages([]);

                      // Clear in form state
                      setValue("district", null);
                      setValue("county", null);
                      setValue("subcounty", null);
                      setValue("parish", null);
                      setValue("village", null);
                    }
                    }
                    dropdown
                    disabled={regionsQuery?.isLoading}
                    placeholder="Select region"
                    className={`w-full ${errors.region ? "p-invalid" : ""}`}
                  />
                );
              }}
            />
            {errors.region && <small className="p-error">{errors?.region?.message?.toString()}</small>}
            {regionsQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
          </div>

          {/* ✅ District AutoComplete */}
          <div className="p-field">
            <label htmlFor="district" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              District
            </label>
            <Controller
              name="district"
              control={control}
              render={({ field }) => {
                const fetchSuggestions = (event: any) => {
                  const query = event.query.toLowerCase();
                  const filtered = districtsQuery?.data?.data?.data?.filter((district: any) =>
                    district?.name?.toLowerCase().includes(query)
                  );
                  setDropdownDistricts(filtered);
                };

                return (
                  <AutoComplete
                    {...field}
                    multiple={false}
                    suggestions={dropdownDistricts}
                    completeMethod={fetchSuggestions}
                    field="name"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value)

                      // Clear Local Government dependent fields
                      setDropdownCounties([]);
                      setDropdownSubcounties([]);
                      setDropdownParishes([]);
                      setDropdownVillages([]);

                      // Clear in form state
                      setValue("county", null);
                      setValue("subcounty", null);
                      setValue("parish", null);
                      setValue("village", null);
                    }}
                    dropdown
                    disabled={districtsQuery?.isLoading}
                    placeholder="Select district"
                    className={`w-full ${errors.district ? "p-invalid" : ""}`}
                  />
                );
              }}
            />
            {errors.district && <small className="p-error">{errors?.district?.message?.toString()}</small>}
            {districtsQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
          </div>

          {/* ✅ County AutoComplete */}
          <div className="p-field">
            <label htmlFor="county" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              County
            </label>
            <Controller
              name="county"
              control={control}
              render={({ field }) => {
                const fetchSuggestions = (event: any) => {
                  const query = event.query.toLowerCase();
                  const filtered = countiesQuery?.data?.data?.data?.filter((county: any) =>
                    county?.name?.toLowerCase().includes(query)
                  );
                  setDropdownCounties(filtered);
                };

                return (
                  <AutoComplete
                    {...field}
                    multiple={false}
                    suggestions={dropdownCounties}
                    completeMethod={fetchSuggestions}
                    field="name"
                    value={field.value}
                    onChange={(e) => {

                      field.onChange(e.value)

                      // Clear Local Government dependent fields
                      setDropdownSubcounties([]);
                      setDropdownParishes([]);
                      setDropdownVillages([]);

                      // Clear in form state
                      setValue("subcounty", null);
                      setValue("parish", null);
                      setValue("village", null);
                    }}
                    dropdown
                    disabled={countiesQuery?.isLoading}
                    placeholder="Select county"
                    className={`w-full ${errors.county ? "p-invalid" : ""}`}
                  />
                );
              }}
            />
            {errors.county && <small className="p-error">{errors?.county?.message?.toString()}</small>}
            {countiesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
          </div>

          {/* ✅ Subcounty AutoComplete */}
          <div className="p-field">
            <label htmlFor="subcounty" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Subcounty
            </label>
            <Controller
              name="subcounty"
              control={control}
              render={({ field }) => {
                const fetchSuggestions = (event: any) => {
                  const query = event.query.toLowerCase();
                  const filtered = subcountiesQuery?.data?.data?.data?.filter((subcounty: any) =>
                    subcounty?.name?.toLowerCase().includes(query)
                  );
                  setDropdownSubcounties(filtered);
                };

                return (
                  <AutoComplete
                    {...field}
                    multiple={false}
                    suggestions={dropdownSubcounties}
                    completeMethod={fetchSuggestions}
                    field="name"
                    value={field.value}
                    onChange={(e) => {

                      field.onChange(e.value)

                      // Clear Local Government dependent fields
                      setDropdownParishes([]);
                      setDropdownVillages([]);

                      // Clear in form state
                      setValue("parish", null);
                      setValue("village", null);
                    }}
                    dropdown
                    disabled={subcountiesQuery?.isLoading}
                    placeholder="Select subcounty"
                    className={`w-full ${errors.subcounty ? "p-invalid" : ""}`}
                  />
                );
              }}
            />
            {errors.subcounty && <small className="p-error">{errors?.subcounty?.message?.toString()}</small>}
            {subcountiesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
          </div>

          {/* ✅ Parish AutoComplete */}
          <div className="p-field">
            <label htmlFor="parish" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Parish
            </label>
            <Controller
              name="parish"
              control={control}
              render={({ field }) => {
                const fetchSuggestions = (event: any) => {
                  const query = event.query.toLowerCase();
                  const filtered = parishesQuery?.data?.data?.data?.filter((parish: any) =>
                    parish?.name?.toLowerCase().includes(query)
                  );
                  setDropdownParishes(filtered);
                };

                return (
                  <AutoComplete
                    {...field}
                    multiple={false}
                    suggestions={dropdownParishes}
                    completeMethod={fetchSuggestions}
                    field="name"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value)

                      // Clear Local Government dependent fields
                      setDropdownVillages([]);

                      // Clear in form state
                      setValue("village", null);
                    }}
                    dropdown
                    disabled={parishesQuery?.isLoading}
                    placeholder="Select parish"
                    className={`w-full ${errors.parish ? "p-invalid" : ""}`}
                  />
                );
              }}
            />
            {errors.parish && <small className="p-error">{errors?.parish?.message?.toString()}</small>}
            {parishesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
          </div>

          {/* ✅ Village AutoComplete */}
          <div className="p-field">
            <label htmlFor="village" className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
              Village
            </label>
            <Controller
              name="village"
              control={control}
              render={({ field }) => {
                const fetchSuggestions = (event: any) => {
                  const query = event.query.toLowerCase();
                  const filtered = villagesQuery?.data?.data?.data?.filter((village: any) =>
                    village?.name?.toLowerCase().includes(query)
                  );
                  setDropdownVillages(filtered);
                };

                return (
                  <AutoComplete
                    {...field}
                    multiple={false}
                    suggestions={dropdownVillages}
                    completeMethod={fetchSuggestions}
                    field="name"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    dropdown
                    disabled={villagesQuery?.isLoading}
                    placeholder="Select village"
                    className={`w-full ${errors.village ? "p-invalid" : ""}`}
                  />
                );
              }}
            />
            {errors.village && <small className="p-error">{errors?.village?.message?.toString()}</small>}
            {villagesQuery?.isLoading && <ProgressSpinner style={{ width: "10px", height: "10px" }} strokeWidth="4" />}
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
