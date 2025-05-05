import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "@/icons/index";

// Type definitions for menu items
interface NestedMenuItem {
  icon: React.ReactNode;
  name: string;
  path: string;
  pro?: boolean;
}

interface SubMenuItem {
  icon: React.ReactNode;
  name: string;
  path?: string;
  pro?: boolean;
  subItems?: NestedMenuItem[];
}

export interface MenuItem {
  icon: React.ReactNode;
  name: string;
  path?: string;
  subItems?: SubMenuItem[];
}

interface MenuCategory {
  category: string;
  menu: string;
  items: MenuItem[];
}






export const getMenuItems = (logggedInUser: any): MenuCategory[] => {

  const logggedInUserRole = logggedInUser?.role;

  const systemAdminRoles = ["System Admin"];

  const ppdaRoles = ["PPDA Admin", "PPDA Officer"]

  const CsoRoles = ["CSO Admin", "CSO Monitor", "CSO Verifier", "CSO Approver"]

  const menuItems: MenuCategory[] = [
    {
      category: "main",
      menu: "Main Menu",
      items: [
        {
          icon: <i className="pi pi-objects-column" />,
          name: "Dashboard",
          path: "/dashboard"
        },

        {
          icon: <i className="pi pi-briefcase" />,
          name: "Projects",
          path: "/dashboard/projects"
        },
        {
          icon: <i className="pi pi-file-check" />,
          name: "Reports",
          path: "/dashboard/reports"
        },
        ...((ppdaRoles.includes(logggedInUserRole) || systemAdminRoles.includes(logggedInUserRole)) ? [{
          icon: <i className="pi pi-users" />,
          name: "CSOs",
          path: "/dashboard/csos"
        }] : []),

        ...((systemAdminRoles.includes(logggedInUserRole)) ? [{
          icon: <i className="pi pi-chart-bar" />,
          name: "Polls",
          path: "/dashboard/polls"
        }] : []),

        ...((systemAdminRoles.includes(logggedInUserRole)) ? [{
          icon: <i className="pi pi-bell" />,
          name: "Notifications",
          path: "/dashboard/notifications"
        }] : []),

        ...(systemAdminRoles.includes(logggedInUserRole) ? [{
          icon: <i className="pi pi-comments" />,
          name: "FAQs",
          path: "/dashboard/faqs"
        }] : []),
        {
          icon: <i className="pi pi-user" />,
          name: "Users",
          subItems: [
            {
              icon: <i className="pi pi-users" />,
              name: "CSO Users",
              path: "/dashboard/users?usersCategory=cso_users"
            },
            ...((ppdaRoles.includes(logggedInUserRole) || systemAdminRoles.includes(logggedInUserRole)) ? [{
              icon: <i className="pi pi-users" />,
              name: "PPDA Users",
              path: "/dashboard/users?usersCategory=ppda_users"
            }] : []),
          ]
        },
        ...(systemAdminRoles.includes(logggedInUserRole) ? [{
          icon: <i className="pi pi-cog" />,
          name: "Settings",
          subItems: [
            {
              icon: <i className="pi pi-map" />,
              name: "Location",
              subItems: [
                {
                  icon: <i className="pi pi-paperclip" />,
                  name: "Regions",
                  path: "/dashboard/regions"
                },
                {
                  icon: <i className="pi pi-map-marker" />,
                  name: "Districts",
                  path: "/dashboard/districts"
                },
                {
                  icon: <i className="pi pi-cog" />,
                  name: "County",
                  path: "/dashboard/counties"
                },
                {
                  icon: <i className="pi pi-map" />,
                  name: "Sub-Counties",
                  path: "/dashboard/subcounties"
                },
                {
                  icon: <i className="pi pi-compass" />,
                  name: "Parishes",
                  path: "/dashboard/parishes"
                },
                {
                  icon: <i className="pi pi-home" />,
                  name: "Villages",
                  path: "/dashboard/villages"
                }
              ]
            },

            {
              icon: <i className="pi pi-box" />,
              name: "Procurement",
              subItems: [
                {
                  icon: <i className="pi pi-tag" />,
                  name: "Procurement Types",
                  path: "/dashboard/procurement-types"
                },
                {
                  icon: <i className="pi pi-cog" />,
                  name: "Procurement Methods",
                  path: "/dashboard/procurement-methods"
                },]
            },
            {
              icon: <i className="pi pi-briefcase" />,
              name: "PDES",
              subItems: [
                {
                  icon: <i className="pi pi-paperclip" />,
                  name: "PDE Types",
                  path: "/dashboard/pde-types"
                },
                {
                  icon: <i className="pi pi-cog" />,
                  name: "PDE Categories",
                  path: "/dashboard/pde-categories"
                },
                {
                  icon: <i className="pi pi-briefcase" />,
                  name: "PDEs",
                  path: "/dashboard/pdes"
                },

              ]
            },
            {
              icon: <i className="pi pi-th-large" />,
              name: "Sectors",
              path: "/dashboard/sectors"
            },
            {
              icon: <i className="pi pi-building" />,
              name: "Regional Offices",
              path: "/dashboard/regional-offices"
            },
            {
              icon: <i className="pi pi-users" />,
              name: "Roles",
              path: "/dashboard/roles"
            },
            {
              icon: <i className="pi pi-book" />,
              name: "Audit Trail",
              path: "/dashboard/audit-trail"
            }

          ]
        }] : [])
        ,

        ...(["System Admin", "PPDA Admin", "CSO Admin"].includes(logggedInUserRole) ? [{
          icon: <i className="pi pi-folder" />,
          name: "File Share",
          path: "/dashboard/file-share"
        }] : []),


        {
          icon: <i className="pi pi-book" />,
          name: "User Manual",
          path: "/dashboard/user-manual"
        }
      ]
    },
    // {
    //   category: "others",
    //   menu: "Other Features",
    //   items: [
    //     {
    //       icon: <PieChartIcon />,
    //       name: "Charts",
    //       subItems: [
    //         {
    //           icon: <i className="pi pi-chart-line" />,
    //           name: "Line Chart",
    //           path: "/line-chart",
    //           pro: false
    //         },
    //         {
    //           icon: <i className="pi pi-chart-bar" />,
    //           name: "Bar Chart",
    //           path: "/bar-chart",
    //           pro: false
    //         }
    //       ]
    //     },
    //     {
    //       icon: <BoxCubeIcon />,
    //       name: "UI Elements",
    //       subItems: [
    //         {
    //           icon: <i className="pi pi-exclamation-circle" />,
    //           name: "Alerts",
    //           path: "/alerts",
    //           pro: false
    //         },
    //         {
    //           icon: <i className="pi pi-user" />,
    //           name: "Avatar",
    //           path: "/avatars",
    //           pro: false
    //         },
    //         {
    //           icon: <i className="pi pi-tag" />,
    //           name: "Badge",
    //           path: "/badge",
    //           pro: false
    //         },
    //         {
    //           icon: <i className="pi pi-th-large" />,
    //           name: "Buttons",
    //           path: "/buttons",
    //           pro: false
    //         },
    //         {
    //           icon: <i className="pi pi-image" />,
    //           name: "Images",
    //           path: "/images",
    //           pro: false
    //         },
    //         {
    //           icon: <i className="pi pi-video" />,
    //           name: "Videos",
    //           path: "/videos",
    //           pro: false
    //         }
    //       ]
    //     },
    //     {
    //       icon: <PlugInIcon />,
    //       name: "Authentication",
    //       subItems: [
    //         {
    //           icon: <i className="pi pi-sign-in" />,
    //           name: "Sign In",
    //           path: "/signin",
    //           pro: false
    //         },
    //         {
    //           icon: <i className="pi pi-user-plus" />,
    //           name: "Sign Up",
    //           path: "/signup",
    //           pro: false
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   category: "extras",
    //   menu: "Extras",
    //   items: [
    //     {
    //       icon: <i className="pi pi-wrench" />,
    //       name: "Tools",
    //       subItems: [
    //         {
    //           icon: <i className="pi pi-server" />,
    //           name: "API Tester",
    //           path: "/extras/api-tester"
    //         },
    //         {
    //           icon: <i className="pi pi-bug" />,
    //           name: "Debugger",
    //           path: "/extras/debugger"
    //         }
    //       ]
    //     },
    //     {
    //       icon: <i className="pi pi-calendar" />,
    //       name: "Events",
    //       subItems: [
    //         {
    //           icon: <i className="pi pi-calendar-plus" />,
    //           name: "Upcoming Events",
    //           path: "/extras/events/upcoming"
    //         },
    //         {
    //           icon: <i className="pi pi-calendar-times" />,
    //           name: "Past Events",
    //           path: "/extras/events/past"
    //         }
    //       ]
    //     }
    //   ]
    // }
  ];

  return menuItems;

};
