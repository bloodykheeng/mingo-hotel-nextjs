'use client'

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";

// Icons
import { FaStar, FaHotel, FaDoorOpen, FaWifi } from 'react-icons/fa';

// Services
import { getAllRoomCategorys } from "@/services/room-categories/room-categories-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

import RoomCategoryCard from "./RoomCategoryCard"

// Lottie Animations
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import SkeletonLoadingLottie from "@/assets/lottie-files/SkeletonLoadingLottie.json";
import SnailErrorLottie from "@/assets/lottie-files/snail-error-lottie.json";

interface RoomCategoryProps {
    id: string;
    name: string;
    description: string;
    status: string;
    price: number;
    photo_url: string;
}



const RoomCategoriesSection: React.FC = () => {
    // Fetch room categories
    const getRoomCategoriesQuery = useQuery({
        queryKey: ['roomCategories'],
        queryFn: getAllRoomCategorys
    });

    useHandleQueryError(getRoomCategoriesQuery);

    const roomCategories = getRoomCategoriesQuery?.data?.data || [];

    // Fallback data in case API call fails or returns empty
    const fallbackCategories: RoomCategoryProps[] = [
        {
            id: "1",
            name: "Luxury Suite",
            description: "Premium luxury suites with exceptional amenities and breathtaking views.",
            status: "active",
            price: 250,
            photo_url: "/assets/img/room-1.jpg"
        },
        {
            id: "2",
            name: "Deluxe Room",
            description: "Spacious deluxe rooms offering comfort and style for the discerning traveler.",
            status: "active",
            price: 180,
            photo_url: "/assets/img/room-2.jpg"
        },
        {
            id: "3",
            name: "Standard Room",
            description: "Comfortable standard rooms with all essential amenities for a pleasant stay.",
            status: "active",
            price: 120,
            photo_url: "/assets/img/room-3.jpg"
        }
    ];

    // If loading, show loading animation
    if (getRoomCategoriesQuery.isLoading) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800 py-16 flex justify-center items-center">
                <div className="max-w-md">
                    <Lottie animationData={SkeletonLoadingLottie} loop autoplay />
                    <p className="text-center text-gray-600 dark:text-gray-300 mt-4">Loading room categories...</p>
                </div>
            </div>
        );
    }

    // If error, show error animation and fallback data
    const displayCategories = getRoomCategoriesQuery.isError || roomCategories.length === 0
        ? fallbackCategories
        : roomCategories;

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h6 className="text-orange-500 text-sm font-bold uppercase tracking-wider mb-2">Room Categories</h6>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Explore Our <span className="text-orange-500">CATEGORIES</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
                        Browse our selection of room categories to find your perfect accommodation
                    </p>
                </div>

                {/* {getRoomCategoriesQuery.isError && (
                    <div className="flex justify-center mb-8">
                        <div className="max-w-xs">
                            <Lottie animationData={SnailErrorLottie} loop autoplay />
                            <p className="text-center text-gray-600 dark:text-gray-300">
                                Couldn't load room categories. Showing sample data instead.
                            </p>
                        </div>
                    </div>
                )} */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayCategories.map((category: RoomCategoryProps, index: number) => (
                        <RoomCategoryCard key={index} {...category} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomCategoriesSection;