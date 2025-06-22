'use client'

import React, { useState, useEffect, JSX } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Image from "next/image";

// Services and Hooks
import { getRoomsById } from "@/services/rooms/rooms-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import useAuthContext from "@/providers/AuthProvider";

// UI Components
import { Rating } from "primereact/rating";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';

import Link from "next/link";

import {
    FaWifi, FaTv, FaBed, FaCoffee, FaUtensils, FaConciergeBell, FaBath,
    FaSwimmingPool, FaParking, FaRProject, FaVolumeUp, FaSpa, FaCouch,
    FaDoorOpen, FaSnowflake, FaShower, FaPlane, FaCocktail, FaHotel
} from "react-icons/fa";

// Lottie Animations
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import SnailErrorLottie from "@/assets/lottie-files/snail-error-lottie.json";
import SkeletonLoadingLottie from "@/assets/lottie-files/SkeletonLoadingLottie.json";

// Components
import Newsletter from '@/components/home/Newsletter';
import Footer from '@/components/home/Footer';

import RoomBookingDialog from "./RoomBookingDialog"

interface RoomDetailsProps {
    roomId: string;
}

export default function RoomDetails({ roomId }: RoomDetailsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = React.useRef<Toast>(null);
    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    // Fetch room details
    const getRoomsByIdQuery = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => getRoomsById(roomId),
        enabled: !!roomId,
    });
    console.log("🚀 ~ RoomDetails ~ getRoomsByIdQuery:", getRoomsByIdQuery)

    useHandleQueryError(getRoomsByIdQuery);

    const room = getRoomsByIdQuery?.data?.data;
    console.log("🚀 ~ RoomDetails ~ room:", room)

    // Get room photos for slider
    const roomPhotos = room?.room_attachments?.filter(
        (attachment: any) => attachment?.type.toLowerCase() === 'picture'
    ) || [];

    // Get room videos
    const roomVideos = room?.room_attachments?.filter(
        (attachment: any) => attachment?.type.toLowerCase() === 'video'
    ) || [];

    interface ArrowProps {
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
    }


    // Custom arrow components
    const PrevArrow = (props: ArrowProps): JSX.Element => {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full"
                aria-label="Previous"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        );
    };

    const NextArrow = (props: ArrowProps): JSX.Element => {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 flex items-center justify-center rounded-full"
                aria-label="Next"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        );
    };

    // Slider settings for photos
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        adaptiveHeight: true,
        className: "rounded-lg overflow-hidden shadow-lg",
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };

    // Handle booking
    const handleBookNow = () => {
        if (!loggedInUserData) {
            // Save current path to redirect back after login
            const returnPath = `/rooms/view/?roomId=${roomId}`;
            router.push(`/login?returnPath=${encodeURIComponent(returnPath)}`);
            return;
        }

        // Handle actual booking logic if user is logged in
        if (room?.booked) {
            toast.current?.show({
                severity: 'error',
                summary: 'Room Unavailable',
                detail: 'This room is currently booked.',
                life: 3000
            });
            return;
        }

        // Navigate to booking page or show booking modal
        // router.push(`/booking?roomId=${roomId}`);
        setShowCreateBooking(true);
    };




    // =================== Creating a booking ==========================
    const [showCreateBooking, setShowCreateBooking] = useState(false);

    const handleCreateBooking = () => {
        setShowCreateBooking(true);
    };

    // Define a type for the icon values
    type IconKey = 'wifi' | 'tv' | 'bed' | 'breakfast' | 'dinner' | 'buffet' |
        'bathroom' | 'swimming pool' | 'parking' | 'projector' | 'speakers' |
        'massage' | 'sofa' | 'balcony' | 'fridge' | 'shower' | 'airport' |
        'rooftop' | 'double bed' | 'single room';

    // Use the same type for your iconMap
    const iconMap: Record<IconKey, React.ReactNode> = {
        wifi: <FaWifi />,
        tv: <FaTv />,
        bed: <FaBed />,
        breakfast: <FaCoffee />,
        dinner: <FaUtensils />,
        buffet: <FaConciergeBell />,
        bathroom: <FaBath />,
        "swimming pool": <FaSwimmingPool />,
        parking: <FaParking />,
        projector: <FaRProject />,
        speakers: <FaVolumeUp />,
        massage: <FaSpa />,
        sofa: <FaCouch />,
        balcony: <FaDoorOpen />,
        fridge: <FaSnowflake />,
        shower: <FaShower />,
        airport: <FaPlane />,
        rooftop: <FaCocktail />,
        "double bed": <FaBed />,
        "single room": <FaHotel />,
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <Toast ref={toast} />

            {/* Room Banner */}
            <div className="relative h-96 w-full overflow-hidden">
                {/* Background Image */}
                {/* <img
                    src={room?.photo_url ? `${process.env.NEXT_PUBLIC_BASE_URL}${room?.photo_url}` : roomPhotos?.length > 0
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}${roomPhotos[0]?.file_path}`
                        : "/mingo-hotel/slider-photos/mingo-hotel-day-view.jpg"}
                    alt={room?.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                /> */}

                <Image
                    src={room?.photo_url ? `${process.env.NEXT_PUBLIC_BASE_URL}${room?.photo_url}` : roomPhotos?.length > 0
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}${roomPhotos[0]?.file_path}`
                        : "/mingo-hotel/slider-photos/mingo-hotel-day-view.jpg"}
                    alt={room?.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={true}
                />



                {/* Dark overlay - only visible in dark mode */}
                <div className="hidden dark:block absolute inset-0 bg-[#0F172B] opacity-70 z-10"></div>

                {/* Status Badge */}
                <div className={`absolute top-8 right-8 z-20 text-white py-2 px-4 font-bold rounded-md ${room?.booked ? 'bg-red-500' : 'bg-green-500'}`}>
                    {room?.booked ? 'CURRENTLY BOOKED' : 'AVAILABLE'}
                </div>

                {/* Content above overlay */}
                <div className="absolute top-0 left-0 w-full h-full z-20 flex flex-col justify-center items-center text-white">
                    <h1 className="text-5xl font-bold mb-4">{room?.name}</h1>
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="hover:text-orange-500">HOME</Link>
                        <span>/</span>
                        <Link href="/rooms" className="hover:text-orange-500">ROOMS</Link>
                        <span>/</span>
                        <span>{room?.name}</span>
                    </div>
                </div>
            </div>

            {
                getRoomsByIdQuery?.isLoading ? (
                    <>
                        <div className="bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
                            <div className="max-w-md">
                                <Lottie animationData={SkeletonLoadingLottie} loop autoplay />
                                <p className="text-center text-gray-600 dark:text-gray-300 mt-4">Loading room details...</p>
                            </div>
                        </div>
                    </>
                ) :
                    getRoomsByIdQuery?.isError ?
                        (
                            <>
                                <div className="bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
                                    <div className="max-w-md">
                                        <Lottie animationData={SnailErrorLottie} loop autoplay />
                                        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">Error loading room details</p>
                                        <Button
                                            label="Go Back to Rooms"
                                            icon="pi pi-arrow-left"
                                            className="mt-4 mx-auto block"
                                            onClick={() => router.push('/rooms')}
                                        />
                                    </div>
                                </div>
                            </>
                        ) :
                        (
                            <>
                                {/* Room Details Section */}
                                <div className="container mx-auto px-4 py-16">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column: Room Images & Details */}
                                        <div className="lg:col-span-2">
                                            {/* Photo Slider */}
                                            {roomPhotos.length > 0 ? (
                                                <div className="mb-8">
                                                    <Slider {...sliderSettings}>
                                                        {roomPhotos.map((photo: any, index: number) => (
                                                            <div key={photo.id} className="relative h-96">
                                                                {/* <img
                                                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${photo.file_path}`}
                                                                    alt={photo.caption || `Room photo ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                /> */}

                                                                <Image
                                                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${photo.file_path}`}
                                                                    alt={photo.caption || `Room photo ${index + 1}`}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="100vw"
                                                                    priority={index === 0}
                                                                />
                                                                {photo.caption && (
                                                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                                                                        {photo.caption}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </Slider>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        <p className="text-gray-500 dark:text-gray-400">No photos available</p>
                                                    </div> */}

                                                    <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        {/* <img
                                                            src={
                                                                room?.photo_url
                                                                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${room.photo_url}`
                                                                    : "/assets/img/carousel-1.jpg"
                                                            }
                                                            alt="Room"
                                                            className="w-full h-full object-cover"
                                                        /> */}

                                                        <Image
                                                            src={
                                                                room?.photo_url
                                                                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${room.photo_url}`
                                                                    : "/assets/img/carousel-1.jpg"
                                                            }
                                                            alt="Room"
                                                            fill
                                                            className="object-cover"
                                                            sizes="100vw"
                                                            priority={true}
                                                        />
                                                    </div>
                                                </>

                                            )}

                                            {/* Room Tabs */}
                                            <TabView className="mb-8">
                                                <TabPanel header="Description" leftIcon="pi pi-file-edit mr-2">
                                                    <div className="p-4">
                                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                            {room.description}
                                                        </p>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel header="Features" leftIcon="pi pi-list mr-2">
                                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {room.room_features && room.room_features.length > 0 ? (
                                                            room.room_features.map((featureObj: any) => (
                                                                <div key={featureObj.id} className="flex items-center">
                                                                    <span className="text-orange-500 mr-3 text-xl">
                                                                        {iconMap[featureObj.feature.icon as IconKey] || <FaHotel />}
                                                                    </span>
                                                                    <span className="text-gray-700 dark:text-gray-300">
                                                                        {featureObj.feature.name}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-gray-500 dark:text-gray-400">No features listed</p>
                                                        )}
                                                    </div>
                                                </TabPanel>
                                                <TabPanel header="Videos" leftIcon="pi pi-video mr-2">
                                                    <div className="p-4 grid grid-cols-1 gap-6">
                                                        {roomVideos.length > 0 ? (
                                                            roomVideos.map((video: any) => (
                                                                <div key={video.id} className="rounded-lg overflow-hidden shadow-md">
                                                                    <video
                                                                        controls
                                                                        className="w-full"
                                                                    // poster={roomPhotos.length > 0 ? `${process.env.NEXT_PUBLIC_BASE_URL}${roomPhotos[0].file_path}` : undefined}
                                                                    >
                                                                        <source src={`${process.env.NEXT_PUBLIC_BASE_URL}${video.file_path}`} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                    {video.caption && (
                                                                        <div className="p-3 bg-gray-100 dark:bg-gray-800">
                                                                            <p className="text-gray-700 dark:text-gray-300">{video.caption}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-gray-500 dark:text-gray-400">No videos available</p>
                                                        )}
                                                    </div>
                                                </TabPanel>
                                            </TabView>
                                        </div>

                                        {/* Right Column: Booking Card */}
                                        <div className="lg:col-span-1">
                                            <Card className="shadow-lg">
                                                <div className="p-4">
                                                    <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Room Summary</h3>
                                                    <Divider />

                                                    {/* Price */}
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-gray-600 dark:text-gray-300">Price {room?.room_category?.name !== "Conference hall" && "per night"}:</span>
                                                        <span className="text-2xl font-bold text-orange-500">UGX {Number(room?.price).toLocaleString()}/night</span>
                                                    </div>

                                                    {/* Rating */}
                                                    <div className="flex items-center mb-4">
                                                        <span className="text-gray-600 dark:text-gray-300 mr-2">Rating:</span>
                                                        <Rating value={room.stars} readOnly cancel={false} />
                                                        <span className="ml-2 text-gray-600 dark:text-gray-300">({room.stars}/5)</span>
                                                    </div>

                                                    {/* Room Type */}
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-gray-600 dark:text-gray-300">Room Type:</span>
                                                        <span className="text-gray-800 dark:text-white">{room.room_type}</span>
                                                    </div>

                                                    {/* Capacity */}
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-gray-600 dark:text-gray-300">Capacity:</span>
                                                        <div className="flex items-center">
                                                            <div className="flex items-center mr-3">
                                                                <i className="pi pi-user text-orange-500 mr-2"></i>
                                                                <span className="text-gray-800 dark:text-white">
                                                                    {room.number_of_adults} adult{room.number_of_adults !== 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                            {room.number_of_children > 0 && (
                                                                <div className="flex items-center">
                                                                    <i className="pi pi-users text-orange-500 mr-2"></i>
                                                                    <span className="text-gray-800 dark:text-white">
                                                                        {room.number_of_children} child{room.number_of_children !== 1 ? 'ren' : ''}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="text-gray-600 dark:text-gray-300">Status:</span>
                                                        <Badge
                                                            value={room.booked ? "Booked" : "Available"}
                                                            severity={room.booked ? "danger" : "success"}
                                                        />
                                                    </div>

                                                    <Divider />

                                                    {/* Booking Button */}
                                                    <Button
                                                        label={loggedInUserData ? "Book Now" : "Login to Book"}
                                                        icon={loggedInUserData ? "pi pi-calendar-plus" : "pi pi-sign-in"}
                                                        className="w-full p-button-raised p-button-rounded"
                                                        disabled={room.booked}
                                                        onClick={handleBookNow}
                                                    />

                                                    {/* Login indicator */}
                                                    {!loggedInUserData && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
                                                            You need to login to book this room
                                                        </p>
                                                    )}

                                                    {/* Booking note */}
                                                    {room.booked && (
                                                        <p className="text-sm text-red-500 text-center mt-3">
                                                            This room is currently unavailable
                                                        </p>
                                                    )}
                                                </div>
                                            </Card>

                                            {/* Quick Info Card */}
                                            <Card className="shadow-lg mt-6">
                                                <div className="p-4">
                                                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Contact & Support</h3>
                                                    <Divider />

                                                    <div className="space-y-4">
                                                        <div className="flex items-center">
                                                            <i className="pi pi-phone text-orange-500 mr-3"></i>
                                                            <span className="text-gray-700 dark:text-gray-300">0705855551 or 0773383900</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <i className="pi pi-envelope text-orange-500 mr-3"></i>
                                                            <span className="text-gray-700 dark:text-gray-300">mingo927011@gmail.com</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <i className="pi pi-map-marker text-orange-500 mr-3"></i>
                                                            <span className="text-gray-700 dark:text-gray-300">Mingo Hotel Uganda</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
            }



            {/* Similar Rooms Section */}
            {/* This would be added here but would require additional data fetching */}

            {/* Newsletter and Footer Components */}
            {/* <Newsletter /> */}
            <Footer />


            <RoomBookingDialog
                visible={showCreateBooking}
                onHide={() => setShowCreateBooking(false)}
                initialData={room}
            />
        </div>
    );
}