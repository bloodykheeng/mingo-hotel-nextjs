'use client'

import React, { useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { useInfiniteQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";

// Services and Hooks
import {
    getAllRooms,
    getRoomsById,
} from "@/services/rooms/rooms-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

// Lottie Animations
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import SnailErrorLottie from "@/assets/lottie-files/snail-error-lottie.json";
import SkeletonLoadingLottie from "@/assets/lottie-files/SkeletonLoadingLottie.json";
import NoDataLottie from "@/assets/lottie-files/nodata.json";

// Components
import Newsletter from '@/components/home/Newsletter';
import Footer from '@/components/home/Footer';
import RoomFilters from './RoomFilters';
import { FilterFormValues, defaultFilterValues } from './RoomFilters';
import { Rating } from "primereact/rating";

import { Accordion, AccordionTab } from 'primereact/accordion';

function RoomsListing() {
    const router = useRouter();
    const [filters, setFilters] = useState<FilterFormValues>(defaultFilterValues);

    // Fetch Rooms data using useInfiniteQuery with filters
    const {
        data,
        isError,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["rooms", "paginate", filters],
        queryFn: ({ pageParam = 1 }) => getAllRooms({
            page: pageParam,
            search: filters.search,
            paginate: true,
            // room_type: filters.room_type,
            // booked: filters.booked,
            // stars: filters.stars,
            // number_of_adults: filters.number_of_adults,
            // number_of_children: filters.number_of_children,
            // features: filters.features?.map(f => f.id) || []
        }),
        getNextPageParam: (lastPage) => {
            const lastPageData = lastPage?.data?.data;
            return lastPageData?.current_page < lastPageData?.last_page ? lastPageData.current_page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    useHandleQueryError({ isError });

    // Interface for Room data structure based on backend model
    interface Room {
        id: number;
        name: string;
        description: string;
        room_type: string;
        status: string;
        price: number;
        stars: number;
        booked: boolean;
        number_of_adults: number;
        number_of_children: number;
        room_features: Array<{
            id: number;
            feature: {
                id: number;
                name: string;
                icon: string;
                status: string;
            }
        }>;
        room_attachments: Array<{
            id: number;
            type: string;
            file_path: string;
            caption: string;
        }>;
        created_at: string;
        updated_at: string;
    }

    // Flatten the paginated data
    const roomsData: Room[] = data?.pages?.flatMap(page => page?.data?.data?.data) || [];

    // Handle filter submission
    const handleFilterSubmit = (data: FilterFormValues) => {
        setFilters(data);
    };

    // Navigate to room details
    const handleViewDetails = (roomId: number) => {
        router.push(`/rooms/${roomId}`);
    };

    // Get room image from attachments
    const getRoomImage = (room: Room) => {
        const photoAttachment = room.room_attachments?.find(
            attachment => attachment.type.toLowerCase() === 'photo'
        );

        return photoAttachment
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${photoAttachment.file_path}`
            : "https://via.placeholder.com/600x400?text=No+Image";
    };

    // Get first 3 room features
    const getTopFeatures = (room: Room) => {
        return room.room_features?.slice(0, 3) || [];
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">


            {/* Hero Section */}
            <div className="relative h-96 w-full overflow-hidden">
                {/* Background Image */}
                <img
                    src="/assets/img/carousel-1.jpg"
                    alt="Rooms Background"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />

                {/* Dark overlay - only visible in dark mode */}
                <div className="hidden dark:block absolute inset-0 bg-[#0F172B] opacity-70 z-10"></div>


                {/* Content above overlay */}
                <div className="absolute top-0 left-0 w-full h-full z-20 flex flex-col justify-center items-center text-white">
                    <h1 className="text-5xl font-bold mb-4">Our Rooms</h1>
                    <div className="flex items-center space-x-2">
                        <a href="/" className="hover:text-orange-500">HOME</a>
                        <span>/</span>
                        <span>ROOMS</span>
                    </div>
                </div>
            </div>





            {/* Our Rooms Section */}
            <div className="container mx-auto px-4 py-16">
                {isError ? (
                    <div className="flex justify-center">
                        <div className="max-w-md">
                            <Lottie animationData={SnailErrorLottie} loop autoplay />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-12">
                            <div className="text-orange-500 mb-2">OUR ROOMS</div>
                            <h2 className="text-4xl font-bold dark:text-white">Explore Our <span className="text-orange-500">ROOMS</span></h2>
                        </div>

                        {/* Room Filters Component */}
                        <Accordion multiple={false} className="mb-4">
                            <AccordionTab header="Room Filters">
                                <RoomFilters
                                    onFilterSubmit={handleFilterSubmit}
                                    initialValues={filters}
                                />
                            </AccordionTab>
                        </Accordion>

                        {/* Rooms Grid */}
                        {roomsData.length === 0 && !isLoading ? (
                            <div className="flex justify-center">
                                <div className="max-w-md">
                                    <Lottie animationData={NoDataLottie} loop autoplay />
                                    <p className="text-center text-gray-600 dark:text-gray-300 mt-4">No rooms found matching your criteria</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {roomsData.map((room) => (
                                    <div key={room.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                                        <div className="relative">
                                            <img
                                                src={getRoomImage(room)}
                                                alt={room.name}
                                                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4 bg-orange-500 text-white py-1 px-3 font-medium">
                                                ${room.price}/night
                                            </div>
                                            {room.booked && (
                                                <div className="absolute top-4 right-4 bg-red-500 text-white py-1 px-3 font-medium">
                                                    Booked
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{room.name}</h3>

                                            {/* Stars Rating */}
                                            <div className="flex mb-3">
                                                <Rating value={room.stars} readOnly cancel={false} />
                                            </div>

                                            {/* Room Features */}
                                            <div className="flex mb-4 text-gray-600 dark:text-gray-300 text-sm flex-wrap">
                                                {getTopFeatures(room).map((featureObj, index) => (
                                                    <div key={featureObj.id} className="flex items-center mr-4 mb-2">
                                                        <i className={`${featureObj.feature.icon} text-orange-500 mr-2 text-lg`}></i>
                                                        {featureObj.feature.name}
                                                    </div>
                                                ))}
                                                {room.room_features && room.room_features.length > 3 && (
                                                    <div className="flex items-center mr-4 mb-2 text-orange-500">
                                                        +{room.room_features.length - 3} more
                                                    </div>
                                                )}
                                            </div>

                                            {/* Room Info */}
                                            <div className="flex mb-3 text-gray-600 dark:text-gray-300 text-sm">
                                                <div className="flex items-center mr-4">
                                                    <i className="pi pi-user text-orange-500 mr-2"></i>
                                                    {room.number_of_adults} adult{room.number_of_adults !== 1 ? 's' : ''}
                                                </div>
                                                {room.number_of_children > 0 && (
                                                    <div className="flex items-center">
                                                        <i className="pi pi-users text-orange-500 mr-2"></i>
                                                        {room.number_of_children} child{room.number_of_children !== 1 ? 'ren' : ''}
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{room.description}</p>

                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleViewDetails(room.id)}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 inline-block transition duration-300 rounded"
                                                >
                                                    VIEW DETAIL
                                                </button>
                                                <button
                                                    className={`${room.booked ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'} text-white px-6 py-2 inline-block transition duration-300 rounded`}
                                                    disabled={room.booked}
                                                >
                                                    {room.booked ? 'UNAVAILABLE' : 'BOOK NOW'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Loading Spinner */}
                        {isLoading && (
                            <div className="flex justify-center items-center p-8">
                                <div className="max-w-md">
                                    <Lottie animationData={SkeletonLoadingLottie} loop autoplay />
                                </div>
                            </div>
                        )}

                        {/* Load More Button */}
                        {hasNextPage && (
                            <div className="flex justify-center mt-10">
                                <button
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 inline-block transition duration-300 rounded"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                >
                                    {isFetchingNextPage ? (
                                        <div className="flex items-center">
                                            <ProgressSpinner style={{ width: "20px", height: "20px" }} strokeWidth="4" />
                                            <span className="ml-2">Loading more rooms...</span>
                                        </div>
                                    ) : "Load More"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Newsletter and Footer Components */}
            <Newsletter />
            <Footer />
        </div>
    );
}

export default RoomsListing;