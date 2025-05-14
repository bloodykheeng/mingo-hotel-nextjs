'use client'
import React from 'react'
import Carousel from './Carousel'
import BookingForm from './BookingForm';
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

            <BookingForm />

            <AboutUs
                hotelName="Mingo Hotel Kayunga"
                description="Nestled in the heart of Kayunga, Uganda, Mingo Hotel Kayunga Ltd is your home away from home.
                Established in 2022, we blend modern amenities with warm Ugandan hospitality, offering
                exceptional comfort, convenience, and unforgettable local charm. Whether you're traveling for
                leisure or business, our hotel promises a stay like no other."
            />
            {/* <RoomsSection /> */}
            <RoomCategoriesSection />
            <ServicesSection />
            <TestimonialsSection />
            <TeamStaffSection />
            {/* <NewsletterSection /> */}
            <Newsletter />
            <Footer />
        </div>
    )
}

export default HomePage