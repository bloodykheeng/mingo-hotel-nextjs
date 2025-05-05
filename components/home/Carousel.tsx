import React, { useRef, JSX } from "react";
import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Define TypeScript interfaces
interface CarouselItem {
    img: string;
    title: string;
    subtitle: string;
    btn1: string;
    btn2: string;
}

interface ArrowProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const carouselData: CarouselItem[] = [
    {
        img: "/assets/img/carousel-1.jpg",
        title: "Welcome to Mingo Hotel Where Comfort Meets Class",
        subtitle: "YOUR HOME AWAY FROM HOME",
        btn1: "OUR ROOMS",
        btn2: "BOOK NOW",
    },
    {
        img: "/assets/img/carousel-2.jpg",
        title: "Experience Elegance at Mingo Hotel",
        subtitle: "LUXURY REDEFINED",
        btn1: "VIEW ROOMS",
        btn2: "MAKE A RESERVATION",
    },
];


export default function Carousel(): JSX.Element {
    const sliderRef = useRef<Slider | null>(null);

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
        infinite: true,
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
                {carouselData.map((item, index) => (
                    <div key={index} className="relative w-full h-screen overflow-hidden">
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
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 transition duration-300">
                                        {item.btn1}
                                    </button>
                                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-8 transition duration-300">
                                        {item.btn2}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}