import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import { Metadata } from "next";

import HomePage from "@/components/home/HomePage"

export const metadata: Metadata = {
  title: "Mingo Hotel",
  description: "Mingo Hotel is a 5-star hotel in Kayunga, Uganda, offering modern comfort, traditional charm, and access to top regional attractions.",
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



export default function Home() {
  return (
    <>
      <ScrollUp />
      <HomePage />
      {/* <Features />
      <Brands />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Testimonials />
      <Pricing />
      <Blog />
      <Contact /> */}
    </>
  );
}
