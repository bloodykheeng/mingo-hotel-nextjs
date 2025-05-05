"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { OverlayPanel } from "primereact/overlaypanel";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import useAuthContext from "@/providers/AuthProvider";

import { Sidebar } from 'primereact/sidebar';
import { Divider } from 'primereact/divider';


import Image from 'next/image'

import { useRouter } from 'nextjs-toploader/app';

export default function UserDropdown() {
  const { getUserQuery, logoutMutation } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;
  const overlayPanelRef = useRef<OverlayPanel>(null);

  const [profileSidebarVisible, setProfileSidebarVisible] = useState(false);

  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!logoutMutation.isPending) {
      logoutMutation.mutate();
      // overlayPanelRef?.current?.hide();
    }
  };


  // Define role groups for conditional rendering
  const showRegionalOffices = ["PPDA Admin", "PPDA Officer"].includes(loggedInUserData?.role) ||
    ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"].includes(loggedInUserData?.role);

  const showCSO = ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"].includes(loggedInUserData?.role);

  return (
    <div className="relative">
      <Button
        onClick={(e) => overlayPanelRef?.current?.toggle(e)}
        className="p-button-text flex items-center text-gray-700 dark:text-gray-400 bg-transparent border-none"
        aria-label="User menu"
      >
        <div className="mr-3 overflow-hidden rounded-full h-11 w-11 flex justify-center items-center">


          {/* User Avatar - Show CSO logo if applicable */}
          {showCSO && loggedInUserData?.cso?.logo_url ? (
            <>
              <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 ">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${loggedInUserData?.cso.logo_url}`}
                  alt="CSO Logo"
                  height={100} // 100% of container height (24 = 96px)
                  width={100}   // Set width to 0, Tailwind won't apply width so we control it manually
                  style={{ height: 'auto', width: '100%' }}
                />
              </div>



              {/* <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${loggedInUserData?.cso.logo_url}`}
                  alt="CSO Logo"
                  className="w-24 h-auto object-cover"
                />
              </div> */}
            </>

          ) : (
            <Avatar
              icon="pi pi-user"
              shape="circle"
              size="large"
              className={`!bg-white dark:!bg-bg-dark ${loggedInUserData ? "!text-blue-700" : "!text-gray-500"}`}
            />
          )}
        </div>

        <span
          className="block mr-1 font-medium text-theme-sm max-w-[10ch] truncate cursor-pointer"
          title={getUserQuery.isLoading ? "Loading..." : loggedInUserData?.name || "No user"}
        >
          {getUserQuery.isLoading ? (
            <ProgressSpinner style={{ width: "20px", height: "20px" }} strokeWidth="8" />
          ) : (
            loggedInUserData?.name || "No user"
          )}
        </span>

        <i className="pi pi-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-200"></i>
      </Button>

      <OverlayPanel
        ref={overlayPanelRef}
        pt={{
          content: { className: '!p-0.5' }
        }}
        showCloseIcon={false}
        dismissable
      >
        <div className="w-[260px] overflow-hidden">
          {/* User Info */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800">
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
              {loggedInUserData?.name}
            </span>
            {/* <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              {loggedInUserData?.email}
            </span> */}
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              {loggedInUserData?.role}
            </span>

            {showRegionalOffices && (<small className="mt-0.5 block text-[10px] text-gray-500 dark:text-gray-400">
              {loggedInUserData?.regional_office?.name}
            </small>)}

            {showCSO && (<small className="mt-0.5 block text-[10px] text-gray-500 dark:text-gray-400">
              {loggedInUserData?.cso?.name}
            </small>)}

          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col gap-1 pt-2 pb-2 border-b border-gray-200 dark:border-gray-800">
            <li>
              <div
                className="flex items-center gap-3 px-3 py-2 font-medium cursor-pointer text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                onClick={() => {
                  setProfileSidebarVisible(true);
                  overlayPanelRef?.current?.hide();
                }}
              >
                <i className="pi pi-user text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"></i>
                View profile
              </div>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                onClick={() => {
                  // router.push(`/profile`)
                  overlayPanelRef?.current?.hide()

                }}
              >
                <i className="pi pi-user-edit text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"></i>
                Edit profile
              </Link>
            </li>
            {/* <li>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                onClick={() => overlayPanelRef?.current?.hide()}
              >
                <i className="pi pi-cog text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"></i>
                Account settings
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                onClick={() => overlayPanelRef?.current?.hide()}
              >
                <i className="pi pi-info-circle text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"></i>
                Support
              </Link>
            </li> */}
          </ul>

          {/* Logout Link */}
          <div className="p-2">
            <Link
              href="#"
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2 font-medium rounded-lg group text-theme-sm
                ${logoutMutation.isPending ? "cursor-not-allowed opacity-50" : "text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"}`}
              aria-disabled={logoutMutation.isPending}
            >
              <i className="pi pi-sign-out text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"></i>
              {logoutMutation.isPending ? "Logging out..." : "Sign out"}
            </Link>
          </div>
        </div>
      </OverlayPanel>


      {/* Profile Sidebar */}
      <Sidebar
        visible={profileSidebarVisible}
        position="right"
        onHide={() => setProfileSidebarVisible(false)}
        className="p-sidebar-sm"
        pt={{
          header: { className: 'flex justify-between items-center' },
          content: { className: 'p-0' }
        }}
        header={
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-bold m-0">User Profile</h2>
          </div>
        }
      >
        <div className="p-4">
          <div className="flex flex-col items-center justify-center mb-4">
            {/* User Avatar - Show CSO logo if applicable */}
            {showCSO && loggedInUserData?.cso?.logo_url ? (
              <Avatar
                image={`${process.env.NEXT_PUBLIC_BASE_URL}${loggedInUserData?.cso?.logo_url}`}
                size="xlarge"
                shape="circle"
                className="mb-3"
              />
            ) : (
              <Avatar
                icon="pi pi-user"
                size="xlarge"
                shape="circle"
                className="mb-3"
              />
            )}

            <h3 className="text-xl font-semibold mb-1">{loggedInUserData?.name || "N/A"}</h3>
            <p className="text-gray-600 dark:text-gray-400">{loggedInUserData?.role || "User"}</p>

          </div>


          <Divider />

          {/* Personal Information */}
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-3 border-b pb-1">Personal Information</h4>
            <div className="grid grid-cols-1 gap-y-3">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Full Name: </span>
                <span className="mt-1">{loggedInUserData?.name || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Email: </span>
                <span className="mt-1">{loggedInUserData?.email || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Phone: </span>
                <span className="mt-1">{loggedInUserData?.phone || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Gender: </span>
                <span className="mt-1">{loggedInUserData?.gender || "Prefer not to say"}</span>
              </div>
              <div className="flex items-start gap-2">

                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Notifications: </span>
                  {loggedInUserData?.allow_notifications ? (
                    <i className="pi pi-check-circle text-green-500 mt-1" />
                  ) : (
                    <i className="pi pi-times-circle text-red-500 mt-1" />
                  )}
                  <span className="mt-1">
                    {loggedInUserData?.allow_notifications ? " Enabled" : " Disabled"}
                  </span>
                </div>
              </div>

              {/* Regional Office Info - Only show if applicable */}
              {showRegionalOffices && (
                <div className="mt-1">
                  <strong>Regional office :</strong>   <span >{loggedInUserData?.regional_office?.name || "N/A"}</span>
                </div>
              )}

              {/* CSO Info - Only show if applicable */}
              {showCSO && (
                <div className="mt-1">
                  <strong>CSO :</strong>   <span>{loggedInUserData?.cso?.name || "N/A"}</span>
                </div>
              )}

            </div>
          </div>



          <div className="mt-6 flex justify-center">
            <Button
              label="Edit Profile"
              icon="pi pi-user-edit"
              className="p-button-outlined"
              onClick={() => {
                router.push('/dashboard/profile/edit');
                setProfileSidebarVisible(false);
              }}
            />
          </div>
        </div>
      </Sidebar>
    </div>
  );
}