'use client'

import React from "react";
import Image from "next/image";

const AboutUsPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            {/* Hero Section */}
            <div className="relative w-full h-64 md:h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/70 to-amber-500/70 z-10"></div>
                <div className="w-full h-full bg-[url('/images/hotel-facade.jpg')] bg-cover bg-center"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Mingo Hotel Kayunga</h1>
                    <p className="text-xl md:text-2xl">Your Home Away From Home</p>
                </div>
            </div>

            {/* Welcome Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-center">Welcome to Mingo Hotel Kayunga Ltd</h2>
                    <div className="w-24 h-1 bg-blue-600 mb-8"></div>
                    <p className="text-lg text-center max-w-3xl">
                        Nestled in the heart of Kayunga, Uganda, our exquisite 2-star hotel seamlessly combines
                        modern amenities with a touch of local charm. Whether you're a weary traveler seeking
                        respite or an explorer on a quest for new horizons, Mingo Hotel Kayunga Ltd promises
                        an unforgettable stay.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="text-blue-600 text-3xl mb-4">
                            <i className="pi pi-map-marker"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Prime Location</h3>
                        <p>
                            Situated just 44 km away from the renowned Mehta Golf Club, our hotel boasts a prime
                            location that allows guests to bask in the beauty of Uganda's landscapes.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="text-blue-600 text-3xl mb-4">
                            <i className="pi pi-home"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Comfortable Rooms</h3>
                        <p>
                            Step into your room and you'll be welcomed by a flat-screen TV and, in select rooms,
                            a charming balcony that offers panoramic views of the surroundings.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div className="text-blue-600 text-3xl mb-4">
                            <i className="pi pi-clock"></i>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">24/7 Service</h3>
                        <p>
                            Our 24-hour front desk ensures your needs are met at any time, while complimentary
                            private parking adds convenience to your stay.
                        </p>
                    </div>
                </div>

                {/* Experience Section */}
                <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-6">A Culinary Journey to Remember</h2>
                        <p className="mb-4">
                            The gastronomic experience at Mingo Hotel Kayunga Ltd is a journey that titillates your
                            taste buds. Indulge in delectable dishes at the hotel's restaurant, where every bite is
                            a fusion of flavors that showcase the region's culinary prowess.
                        </p>
                        <p>
                            Whether you're a connoisseur of local delicacies or have an affinity for international
                            cuisines, our diverse menu caters to every palate.
                        </p>
                    </div>
                    <div className="md:w-1/2 h-72 relative rounded-lg overflow-hidden shadow-lg">
                        <div className="w-full h-full bg-[url('/images/hotel-restaurant.jpg')] bg-cover bg-center"></div>
                    </div>
                </div>

                {/* Explore Section */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-16">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-6">Beyond the Hotel: Explore Kayunga</h2>
                        <p className="mb-4">
                            Mingo Hotel Kayunga Ltd serves as a gateway to a world of exploration. The iconic Source
                            of the Nile – Speke Monument is just 47 km away, offering a chance to witness the majesty
                            of one of Uganda's natural wonders.
                        </p>
                        <p>
                            For golf enthusiasts, Jinja Golf Course, a mere 49 km from the hotel, presents an
                            opportunity to indulge in a leisurely game amidst breathtaking landscapes.
                        </p>
                    </div>
                    <div className="md:w-1/2 h-72 relative rounded-lg overflow-hidden shadow-lg">
                        <div className="w-full h-full bg-[url('/images/kayunga-scenery.jpg')] bg-cover bg-center"></div>
                    </div>
                </div>

                {/* History Section */}
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Our History</h2>
                    <div className="w-24 h-1 bg-blue-600 mb-8 mx-auto"></div>
                    <p className="text-lg mb-6">
                        Since its inception on November 5, 2022, Mingo Hotel Kayunga Ltd has been extending warm
                        Ugandan hospitality to guests from around the world.
                    </p>
                    <p className="text-lg">
                        The hotel's commitment to excellence and unwavering dedication to providing top-notch
                        services has earned it a special place in the hearts of those who have experienced its charm.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;