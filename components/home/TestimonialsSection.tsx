'use client'
import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaQuoteRight } from 'react-icons/fa';

interface TestimonialItem {
    id: number;
    name: string;
    profession: string;
    image: string;
    testimonial: string;
}

// Sample data for Mingo Hotel Kayunga based on the screenshot
const testimonialsData: TestimonialItem[] = [
    {
        id: 1,
        name: "David Mutumba",
        profession: "Business Traveler",
        image: "/assets/img/testimonial-1.jpg",
        testimonial: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos"
    },
    {
        id: 2,
        name: "Sarah Nalunga",
        profession: "Tourist",
        image: "/assets/img/testimonial-2.jpg",
        testimonial: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd et erat magna eos"
    }
];

const TestimonialsSection: React.FC = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="py-16 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hotel-exterior-blur.jpg)' }}>
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <Slider {...settings} className="testimonial-slider">
                        {testimonialsData.map((item) => (
                            <div key={item.id} className="px-4">
                                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                                    <div className="flex flex-col mb-4">
                                        <p className="text-gray-700 dark:text-gray-300 mb-6">{item.testimonial}</p>
                                        <div className="flex items-center mt-auto">
                                            <div className="w-16 h-16 mr-4 overflow-hidden rounded-full">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/images/placeholder-person.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-orange-500 text-lg">{item.name}</h4>
                                                <p className="text-gray-600 dark:text-gray-400">{item.profession}</p>
                                            </div>
                                            <FaQuoteRight className="ml-auto text-5xl text-orange-500 opacity-30" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;