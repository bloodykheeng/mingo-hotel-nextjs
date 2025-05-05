"use client";
import React, { useEffect, useRef, useState, useCallback, JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useSidebar } from "@/providers/SidebarContextProvider";
import {
  ChevronDownIcon,
  HorizontaLDots,
} from "@/icons/index";

import SidebarWidget from "./SidebarWidget";
import { getMenuItems, MenuItem } from "./MenuItems"
import useAuthContext from "@/providers/AuthProvider";



const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Gets "?usersCategory=cso_users"

  const { getUserQuery, logoutMutation } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;

  // Get filtered menu items based on the logged-in user
  const menuItems = getMenuItems(loggedInUserData);

  // Change this to use unique identifiers instead of category names
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [nestedOpenSubmenus, setNestedOpenSubmenus] = useState<Record<string, boolean>>({});

  // Check if a path is active
  // const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const isActive = useCallback((path: string) => {

    const fullPath = searchParams.toString() ? `${pathname}?${searchParams}` : pathname;

    console.log("🚀 ~ isActive ~ path:", path);
    console.log("🚀 ~ isActive ~ fullPath:", fullPath);

    // Handle exact matches
    if (path === fullPath) return true;

    // Handle dynamic routes and routes with query params
    if (path !== "/" && path !== "/dashboard" && fullPath.startsWith(path)) {
      // Ensure it's a true match by checking if the next character is "/" or end of string
      const nextChar = fullPath.charAt(path.length);
      console.log("🚀 ~ isActive ~ nextChar:", nextChar);
      if (nextChar === "/" || nextChar === "?" || nextChar === "") {
        return true;
      }
    }

    return false;
  }, [pathname, searchParams]);

  // Function to handle submenu toggle with unique identifiers
  const handleSubmenuToggle = (categoryIndex: number, itemIndex: number): void => {
    const menuKey = `${categoryIndex}-${itemIndex}`;

    setOpenSubmenus(prev => {
      const isCurrentlyOpen = prev[menuKey];

      // If closing a parent menu, also close all its nested submenus
      if (isCurrentlyOpen) {
        // Get all nested submenus that should be closed
        const keysToRemove = Object.keys(nestedOpenSubmenus).filter(key =>
          key.startsWith(`${categoryIndex}-${itemIndex}-`)
        );

        // Close nested submenus
        if (keysToRemove.length > 0) {
          const updatedNestedMenus = { ...nestedOpenSubmenus };
          keysToRemove.forEach(key => {
            updatedNestedMenus[key] = false;
          });
          setNestedOpenSubmenus(updatedNestedMenus);
        }
      }

      // Toggle the current submenu
      return {
        ...prev,
        [menuKey]: !isCurrentlyOpen
      };
    });
  };

  // Function to handle nested submenu toggle
  const handleNestedSubmenuToggle = (categoryIndex: number, itemIndex: number, subItemName: string): void => {
    const key = `${categoryIndex}-${itemIndex}-${subItemName}`;
    setNestedOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Effect to auto-open submenus based on current path
  useEffect(() => {
    // Reset all open menus when pathname changes
    const newOpenSubmenus: Record<string, boolean> = {};
    const newNestedOpenSubmenus: Record<string, boolean> = {};

    menuItems.forEach((category, categoryIndex) => {
      category.items.forEach((item, itemIndex) => {
        let shouldOpenParent = false;
        const menuKey = `${categoryIndex}-${itemIndex}`;

        // Check direct path
        if (item.path && isActive(item.path)) {
          shouldOpenParent = true;
        }

        // Check first level subitems
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            // Check direct subitem path
            if (subItem.path && isActive(subItem.path)) {
              shouldOpenParent = true;
            }

            // Check nested subitems
            if (subItem?.subItems) {
              subItem.subItems.forEach((nestedItem) => {
                if (nestedItem.path && isActive(nestedItem.path)) {
                  shouldOpenParent = true;
                  const key = `${categoryIndex}-${itemIndex}-${subItem.name}`;
                  newNestedOpenSubmenus[key] = true;
                }
              });
            }
          });
        }

        if (shouldOpenParent) {
          newOpenSubmenus[menuKey] = true;
        }
      });
    });

    setOpenSubmenus(newOpenSubmenus);
    setNestedOpenSubmenus(newNestedOpenSubmenus);
  }, [pathname, isActive]);

  // Render a single menu item with optional submenu
  const renderMenuItem = (item: MenuItem, categoryIndex: number, itemIndex: number): JSX.Element => {
    const hasSubItems = !!item.subItems;
    const menuKey = `${categoryIndex}-${itemIndex}`;
    const isSubmenuOpen = openSubmenus[menuKey];
    const isItemActive = item.path && isActive(item.path);

    // Check if any subitem is active
    const hasActiveSubitem = item.subItems?.some(subItem =>
      (subItem.path && isActive(subItem.path)) ||
      subItem.subItems?.some(nestedItem => nestedItem.path && isActive(nestedItem.path))
    );

    return (
      <li key={`${categoryIndex}-${itemIndex}-${item.name}`}>
        {hasSubItems ? (
          <div>
            <button
              onClick={() => handleSubmenuToggle(categoryIndex, itemIndex)}
              className={`menu-item group ${isSubmenuOpen || hasActiveSubitem ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <span>{item.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
              <ChevronDownIcon className={`ml-auto ${isSubmenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isSubmenuOpen && item.subItems && (
              <ul className="mt-2 ml-9">
                {item.subItems.map((subItem, subIndex) => {
                  const hasNestedItems = !!subItem.subItems;
                  const nestedKey = `${categoryIndex}-${itemIndex}-${subItem.name}`;
                  const isNestedOpen = nestedOpenSubmenus[nestedKey];
                  const isSubItemActive = subItem.path && isActive(subItem.path);

                  // Check if any nested subitem is active
                  const hasActiveNestedItem = subItem.subItems?.some(
                    nestedItem => nestedItem.path && isActive(nestedItem.path)
                  );

                  return (
                    <li key={`${categoryIndex}-${itemIndex}-${subIndex}-${subItem.name}`}>
                      {hasNestedItems ? (
                        <div>
                          <button
                            onClick={() => handleNestedSubmenuToggle(categoryIndex, itemIndex, subItem.name)}
                            className={`menu-dropdown-item flex justify-between items-center w-full hover:bg-gray-100 dark:hover:bg-gray-800 ${isNestedOpen || hasActiveNestedItem ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400" : ""
                              }`}
                          >
                            {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                            <span>{subItem.name}</span>
                            <ChevronDownIcon className={`ml-auto h-4 w-4 ${isNestedOpen ? "rotate-180" : ""}`} />
                          </button>

                          {isNestedOpen && subItem.subItems && (
                            <ul className="ml-4 mt-1">
                              {subItem.subItems.map((nestedItem, nestedIndex) => (
                                <li key={`${categoryIndex}-${itemIndex}-${subIndex}-${nestedIndex}-${nestedItem.name}`}>
                                  <Link
                                    href={nestedItem.path}
                                    className={`menu-dropdown-item hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive(nestedItem.path)
                                      ? "menu-dropdown-item-active bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                                      : ""
                                      }`}
                                  >
                                    {nestedItem.icon && <span className="mr-2">{nestedItem.icon}</span>}
                                    {nestedItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={subItem.path || "#"}
                          className={`menu-dropdown-item hover:bg-gray-100 dark:hover:bg-gray-800 ${subItem.path && isActive(subItem.path)
                            ? "menu-dropdown-item-active bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                            : ""
                            }`}
                        >
                          {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                          {subItem.name}
                          {subItem.pro && <span className="ml-auto text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded">PRO</span>}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          <Link
            href={item.path || "#"}
            className={`menu-item group ${item.path && isActive(item.path) ? "menu-item-active" : "menu-item-inactive"}`}
          >
            <span>{item.icon}</span>
            {(isExpanded || isHovered || isMobileOpen) && <span>{item.name}</span>}
          </Link>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-gray-200 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                src="/ppda/ppda_white-removebg-preview.png"
                alt="logo"
                width={140}
                height={30}
                style={{ height: "40px", width: "auto" }}
                className="w-full dark:hidden"
              />
              <Image
                src="/ppda/ppda_fb-removebg-preview.png"
                alt="logo"
                width={140}
                height={30}
                style={{ height: "40px", width: "auto" }}
                className="hidden w-full dark:block"
              />
            </>
          ) : (
            <>
              <Image
                src="/ppda/ppda_white-removebg-preview.png"
                alt="logo"
                width={80}
                height={30}
                style={{ height: "40px", width: "auto" }}
                className="w-full dark:hidden"
              />
              <Image
                src="/ppda/ppda_fb-removebg-preview.png"
                alt="logo"
                width={80}
                height={30}
                style={{ height: "40px", width: "auto" }}
                className="hidden w-full dark:block"
              />
            </>
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {menuItems.map((category, categoryIndex) => (
              <div key={category.category}>
                <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}>
                  {isExpanded || isHovered || isMobileOpen ? (
                    category.menu
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                <ul className="flex flex-col gap-4">
                  {category.items.map((item, itemIndex) =>
                    renderMenuItem(item, categoryIndex, itemIndex)
                  )}
                </ul>
              </div>
            ))}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;

