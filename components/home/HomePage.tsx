'use client'
import React from 'react'
import Carousel from './hero-slider/Carousel'
import CreateBooking from './room-booking/CreateBooking';
import AboutUs from './AboutUs';
import ServicesSection from './ServicesSection';
import RoomsSection from './RoomsSection'
import TestimonialsSection from './TestimonialsSection';
import TeamStaffSection from './TeamStaffSection';
import NewsletterSection from './NewsletterSection';

import RoomCategoriesSection from "./room-categories/RoomCategoriesSection"

import Newsletter from './Newsletter';
import Footer from './Footer';


function HomePage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <Carousel />

            <CreateBooking />

            <AboutUs
                hotelName="Mingo Hotel Uganda"
                // description="Nestled in the heart of Uganda, Uganda, Mingo Hotel Uganda Ltd is your home away from home.
                // Established in 2022, we blend modern amenities with warm Ugandan hospitality, offering
                // exceptional comfort, convenience, and unforgettable local charm. Whether you're traveling for
                // leisure or business, our hotel promises a stay like no other."

                description={`Welcome to Mingo Hotel — A place to stay, your cozy
Retreat in the heart of Kayunga district. Whether you're here for business or leisure, we offer the perfect balance of comfort, convenience, and warm hospitality.

We provide modern amenities to make your stay as comfortable as possible, including free WI-FI, DSTV entertainment, rooftop service for relaxation, ample parking space. We are also proud to offer spacious conference halls — ideal for meetings, workshops, corporate events, and private functions, fully equipped to meet your business and event needs.

Our clean and spacious rooms are designed to give you the restful experience you deserve.

At Mingo Hotel, we're proud of our delicious meals freshly prepared daily to suit all tastes. Whether you're craving local flavors or international cuisine, our kitchen has something for everyone.

Experience a welcoming atmosphere, personalized service, and true Ugandan hospitality.`}


            />
            {/* <RoomsSection /> */}
            <RoomCategoriesSection />
            <ServicesSection />
            <TestimonialsSection />
            {/* <TeamStaffSection /> */}
            {/* <NewsletterSection /> */}
            {/* <Newsletter /> */}
            <Footer />
        </div>
    )
}

export default HomePage