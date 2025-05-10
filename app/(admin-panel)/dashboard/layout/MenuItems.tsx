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


        ...((systemAdminRoles.includes(logggedInUserRole)) ? [{
          icon: <i className="pi pi-building" />,  // or another appropriate icon
          name: "Rooms",
          path: "/dashboard/rooms"
        }] : []),

        {
          icon: <i className="pi pi-calendar" />, // calendar fits for bookings
          name: "Bookings",
          path: "/dashboard/bookings"
        },


        ...(systemAdminRoles.includes(logggedInUserRole) ? [{
          icon: <i className="pi pi-comments" />,
          name: "FAQs",
          path: "/dashboard/faqs"
        }] : []),
        {
          icon: <i className="pi pi-users" />,
          name: "Users",
          path: "/dashboard/users",

        },
        ...(systemAdminRoles.includes(logggedInUserRole) ? [{
          icon: <i className="pi pi-cog" />,
          name: "Settings",
          subItems: [
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
