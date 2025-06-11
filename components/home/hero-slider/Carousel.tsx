'use client'
import React, { useRef, JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'nextjs-toploader/app';
import dynamic from "next/dynamic";

import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Services
import { getAllHeroSliders } from "@/services/hero-sliders/hero-sliders-service";
import useHandleQueryError from "@/hooks/useHandleQueryError";

// Lottie Animations
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import SkeletonLoadingLottie from "@/assets/lottie-files/SkeletonLoadingLottie.json";

// Define TypeScript interfaces
interface CarouselItem {
    img: string;
    title: string;
    subtitle: string;
    btn1?: string | null;
    btn2?: string | null;
    btn1Link?: string | null;
    btn2Link?: string | null;
}

interface HeroSliderProps {
    id: string;
    title: string;
    description: string;
    button_link_one?: string | null;
    button_link_two?: string | null;
    photo_url: string;
    status?: string;
}

interface ArrowProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Carousel(): JSX.Element {
    const sliderRef = useRef<Slider | null>(null);
    const router = useRouter();

    // Link options for dynamic button names
    const linkOptions = [
        { label: "ROOMS", value: "/rooms" },
        { label: "ABOUT", value: "/about" },
        { label: "FAQS", value: "/faqs" },
        { label: "LOGIN", value: "/login" },
        { label: "REGISTER", value: "/register" },
        { label: "CONTACT", value: "/contact" },
        { label: "SERVICES", value: "/services" },
        { label: "GALLERY", value: "/gallery" },
        { label: "BOOK NOW", value: "/booking" },
        { label: "EXPLORE MORE", value: "/explore" },
        { label: "LEARN MORE", value: "/about" },
        { label: "VIEW ROOMS", value: "/rooms" },
        { label: "MAKE RESERVATION", value: "/booking" },
        { label: "TAKE TOUR", value: "/tour" },
    ];

    // Function to get button label from link
    const getButtonLabel = (link: string | null | undefined): string | null => {
        if (!link) return null;
        const option = linkOptions.find(opt => opt.value === link);
        return option?.label || null;
    };

    // Fetch hero sliders
    const getHeroSlidersQuery = useQuery({
        queryKey: ['hero-sliders'],
        queryFn: getAllHeroSliders
    });

    useHandleQueryError(getHeroSlidersQuery);

    const heroSliders = getHeroSlidersQuery?.data?.data?.data || [];

    // Transform API data to match carousel format
    const transformedSliders: CarouselItem[] = heroSliders.map((slider: HeroSliderProps, index: number) => ({
        img: `${process.env.NEXT_PUBLIC_BASE_URL}${slider.photo_url}`,
        title: slider.title || 'Welcome to Mingo Hotel',
        subtitle: slider.description || 'LUXURY ACCOMMODATION',
        btn1: getButtonLabel(slider.button_link_one),
        btn2: getButtonLabel(slider.button_link_two),
        btn1Link: slider.button_link_one,
        btn2Link: slider.button_link_two,
    }));

    // Debug: Log the API response to check structure
    console.log('Hero Sliders API Response:', getHeroSlidersQuery?.data);
    console.log('Hero Sliders Data:', heroSliders);
    console.log('Transformed Sliders:', transformedSliders);

    // Fallback data in case API call fails or returns empty
    const fallbackCarouselData: CarouselItem[] = [
        {
            img: "/mingo-hotel/slider-photos/mingo-hotel-day-gate-view.jpg",
            title: "A Grand Welcome Awaits at Mingo Hotel",
            subtitle: "ELEGANCE RIGHT FROM THE GATE",
            btn1: "EXPLORE HOTEL",
            btn2: "BOOK NOW",
            btn1Link: "/about",
            btn2Link: "/rooms",
        },
        {
            img: "/mingo-hotel/slider-photos/master-room-1.jpg",
            title: "Luxury Accommodation for Unmatched Comfort",
            subtitle: "RELAX IN OUR MASTER SUITES",
            btn1: "VIEW ROOMS",
            btn2: "BOOK YOUR STAY",
            btn1Link: "/rooms",
            btn2Link: "/rooms",
        },
        {
            img: "/mingo-hotel/slider-photos/mingo-hotel-day-view.jpg",
            title: "Discover Tranquility in the Heart of Kayunga",
            subtitle: "MINGO HOTEL DAYTIME SERENITY",
            btn1: "LEARN MORE",
            btn2: "BOOK NOW",
            btn1Link: "/rooms",
            btn2Link: "/rooms",
        },
        {
            img: "/mingo-hotel/slider-photos/master-room-2.jpg",
            title: "Designed for Your Ultimate Rest",
            subtitle: "SPACIOUS & STYLISH ROOMS",
            btn1: "OUR ROOMS",
            btn2: "MAKE A RESERVATION",
            btn1Link: "/rooms",
            btn2Link: "/rooms",
        },
        {
            img: "/mingo-hotel/slider-photos/mingo-hotel-night-view.jpg",
            title: "Mingo Hotel at Night — A View to Remember",
            subtitle: "LUXURY THAT SHINES THROUGH",
            btn1: "TAKE A TOUR",
            btn2: "BOOK A STAY",
            btn1Link: "/about",
            btn2Link: "/rooms",
        },
        {
            img: "/mingo-hotel/slider-photos/mingo-hotel-transport.jpg",
            title: "Reliable Transport, Exceptional Service",
            subtitle: "ARRIVE IN STYLE WITH MINGO HOTEL",
            btn1: "OUR SERVICES",
            btn2: "CONTACT US",
            btn1Link: "/about",
            btn2Link: "/about",
        },
    ];

    // If loading, show loading animation
    if (getHeroSlidersQuery.isLoading) {
        return (
            <div className="relative w-full h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
                <div className="max-w-md">
                    <Lottie animationData={SkeletonLoadingLottie} loop autoplay />
                    <p className="text-center text-gray-800 dark:text-white mt-4">Loading carousel...</p>
                </div>
            </div>
        );
    }

    // Use fallback data if API fails or returns empty
    const displayCarouselData = getHeroSlidersQuery.isError || transformedSliders.length === 0
        ? fallbackCarouselData
        : transformedSliders;

    // Debug: Log final display data
    console.log('Display Carousel Data:', displayCarouselData);

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

    const settings = {
        dots: false,
        infinite: displayCarouselData.length > 3,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };

    return (
        <div className="relative">
            <Slider ref={sliderRef} {...settings}>
                {displayCarouselData.map((item, index) => {
                    // Check if any buttons exist
                    const hasBtn1 = item.btn1 && item.btn1Link;
                    const hasBtn2 = item.btn2 && item.btn2Link;
                    const hasAnyButtons = hasBtn1 || hasBtn2;

                    return (
                        <div key={`carousel-${index}-${item.title}`} className="relative w-full h-screen overflow-hidden">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 h-[100%]"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                                <div className="max-w-4xl">
                                    <h3 className="text-lg md:text-xl font-medium mb-4 tracking-widest relative">
                                        <span className="inline-block relative px-8">
                                            {item.subtitle}
                                            <span className="absolute left-0 top-1/2 h-0.5 w-6 bg-orange-500"></span>
                                            <span className="absolute right-0 top-1/2 h-0.5 w-6 bg-orange-500"></span>
                                        </span>
                                    </h3>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
                                        {item.title}
                                    </h1>

                                    {/* Only show buttons container if at least one button exists */}
                                    {hasAnyButtons && (
                                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                                            {hasBtn1 && (
                                                <button
                                                    onClick={() => router.push(item.btn1Link!)}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 transition duration-300"
                                                >
                                                    {item.btn1}
                                                </button>
                                            )}
                                            {hasBtn2 && (
                                                <button
                                                    onClick={() => router.push(item.btn2Link!)}
                                                    className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-8 transition duration-300"
                                                >
                                                    {item.btn2}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}