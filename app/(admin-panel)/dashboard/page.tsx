import React from "react";
import type { Metadata } from "next";



import { TabView, TabPanel } from "primereact/tabview";

import StatisticsCards from "@/components/admin-panel/dashboard/statistics-cards/StatisticsCards"



// Metadata must be in a separate file for app router or used in a page.tsx file
export const metadata: Metadata = {
  title: "Mingo Hotel Kayunga Ltd",
  description: "Mingo Hotel Kayunga Ltd is a 2-star hotel in Kayunga, Uganda, offering modern comfort, traditional charm, and access to top regional attractions.",
  keywords: [
    "Mingo Hotel",
    "Kayunga Hotels",
    "Uganda Travel",
    "Affordable Accommodation",
    "Hotel with Restaurant",
    "Tourism in Kayunga",
    "Source of the Nile",
    "Mehta Golf Club",
  ],
  robots: "index, follow",
};


export default function Dashboard() {
  return (
    <div className="p-4">
      <StatisticsCards />
    </div>
  );
}