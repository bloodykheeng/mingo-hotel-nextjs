'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';

import { getRoomsById } from '@/services/rooms/rooms-service';
import useHandleQueryError from '@/hooks/useHandleQueryError';
import useAuthContext from '@/providers/AuthProvider';

import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import SnailErrorLottie from '@/assets/lottie-files/snail-error-lottie.json';

interface Room {
    id: string;
    title: string;
    description: string;
    location: string;
    attachments: RoomAttachment[];
}

interface RoomAttachment {
    id: string;
    url: string;
    type: string; // e.g. "Photos", "Videos"
}

interface RoomDetailsProps {
    roomId: string;
}

export default function RoomDetails({ roomId }: RoomDetailsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [bookingDates, setBookingDates] = React.useState<Date[]>([]);

    const { getUserQuery } = useAuthContext();
    const loggedInUserData = getUserQuery?.data?.data;

    const { data: roomData, isLoading, isError } = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => getRoomsById(roomId),
    });

    useHandleQueryError({ isError });

    const room: Room | undefined = roomData?.data?.data;

    const photoAttachments = room?.attachments?.filter(att => att.type.toLowerCase() === 'photos') || [];
    const videoAttachments = room?.attachments?.filter(att => att.type.toLowerCase() === 'videos') || [];

    const handleGoBack = () => {
        router.back();
    };

    const handleBookNow = () => {
        if (!loggedInUserData) {
            // Redirect to login with redirect param
            router.push(`/login?redirect=/rooms/${roomId}`);
            return;
        }

        if (bookingDates.length !== 2) {
            alert("Please select check-in and check-out dates");
            return;
        }

        alert(`Booking request for ${room?.title} from ${bookingDates[0].toLocaleDateString()} to ${bookingDates[1].toLocaleDateString()}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                <span className="ml-2">Loading room details...</span>
            </div>
        );
    }

    if (isError || !room) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="max-w-md">
                    <Lottie animationData={SnailErrorLottie} loop autoplay />
                </div>
                <Button label="Go Back" icon="pi pi-arrow-left" onClick={handleGoBack} className="mt-4" />
            </div>
        );
    }

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{room.title}</h1>
            <p className="text-gray-600 mb-2">{room.location}</p>

            {/* Image Slider */}
            {photoAttachments.length > 0 && (
                <div className="mb-6">
                    <Slider {...sliderSettings}>
                        {photoAttachments.map(photo => (
                            <div key={photo.id}>
                                <img
                                    src={photo.url}
                                    alt="Room photo"
                                    className="rounded-xl max-h-[500px] object-cover w-full"
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            )}

            {/* Videos */}
            {videoAttachments.length > 0 && (
                <div className="mb-6 space-y-4">
                    {videoAttachments.map(video => (
                        <video key={video.id} controls className="rounded-xl w-full max-h-[500px]">
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ))}
                </div>
            )}

            {/* Tabs with description and date picker */}
            <TabView>
                <TabPanel header="Description">
                    <p className="text-gray-800">{room.description}</p>
                </TabPanel>
                <TabPanel header="Book">
                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium">Select check-in and check-out dates</label>
                        <Calendar
                            selectionMode="range"
                            value={bookingDates}
                            onChange={(e) => setBookingDates(e.value as Date[])}
                            className="w-full"
                            readOnlyInput
                        />
                        <Button
                            label={loggedInUserData ? "Book Now" : "Login to Book"}
                            onClick={handleBookNow}
                            className="mt-4 w-full"
                        />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
}
