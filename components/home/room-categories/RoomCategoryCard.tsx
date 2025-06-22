'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

import Image from "next/image";

// Icons
import { FaStar, FaHotel, FaDoorOpen, FaWifi } from 'react-icons/fa';


interface RoomCategoryProps {
    id: string;
    name: string;
    description: string;
    status: string;
    price: number;
    photo_url: string;
}

const RoomCategoryCard: React.FC<RoomCategoryProps> = ({
    id,
    name,
    description,
    status,
    price,
    photo_url
}) => {
    const router = useRouter();

    const handleViewRooms = () => {
        router.push(`/rooms?roomCategoryId=${encodeURIComponent(id)}`);
    };

    // Default image if photo_url is not available
    const imageUrl = photo_url ? `${process.env.NEXT_PUBLIC_BASE_URL}${photo_url}` : "/assets/img/room-1.jpg";

    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden rounded-lg">
            <div className="relative h-64">

                {/* <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                /> */}

                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                />

                {/* <div className="absolute top-4 left-4 bg-orange-500 text-white py-1 px-3 font-medium">
                    UGX {price}/night
                </div>
                {status && (
                    <div className={`absolute top-4 right-4 py-1 px-3 font-medium ${status.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-red-500'
                        } text-white`}>
                        {status}
                    </div>
                )} */}
            </div>

            <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{name}</h3>
                {/* <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar key={index} className="w-5 h-5 text-orange-500" />
                    ))}
                </div>

                <div className="flex mb-4 text-gray-600 dark:text-gray-300 text-sm">
                    <div className="flex items-center mr-4">
                        <FaHotel className="w-5 h-5 text-orange-500 mr-2" />
                        Room Category
                    </div>
                    <div className="flex items-center">
                        <FaDoorOpen className="w-5 h-5 text-orange-500 mr-2" />
                        Various Rooms
                    </div>
                </div> */}

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {description || "Luxurious room category with premium amenities and exceptional comfort."}
                </p>

                <div className="flex space-x-4">
                    <button
                        onClick={handleViewRooms}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 inline-block transition duration-300
                        dark:bg-orange-600 dark:hover:bg-orange-700"
                    >
                        VIEW ROOMS
                    </button>
                    <button
                        onClick={handleViewRooms}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 inline-block transition duration-300
                        dark:bg-gray-100 dark:hover:bg-gray-300 dark:text-gray-900"
                    >
                        BOOK NOW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCategoryCard