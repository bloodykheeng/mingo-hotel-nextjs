'use client';

import React from "react";
import dynamic from "next/dynamic";
import { Card } from "primereact/card";

// Dynamically import MapComponent with no SSR
const MapComponent = dynamic(() => import("./widgets/MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl text-gray-500 dark:text-gray-400">Loading map...</div>
        </div>
    )
});

const LocateUs: React.FC = () => {
    // Coordinates for Mingo Hotel in Kayunga, Uganda
    const hotelLocation = {
        lat: 0.7766, // Replace with actual coordinates
        lng: 32.8909, // Replace with actual coordinates
        name: "Mingo Hotel Kayunga Ltd"
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Find Us</h2>
                    <p className="text-lg max-w-2xl mx-auto">
                        Located in the heart of Kayunga, Uganda, Mingo Hotel offers easy access to local attractions and
                        is conveniently situated for both business and leisure travelers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Map Column */}
                    <div className="md:col-span-2">
                        <div className="rounded-lg overflow-hidden shadow-lg h-[500px]">
                            <MapComponent location={hotelLocation} />
                        </div>
                    </div>

                    {/* Info Column */}
                    <div className="space-y-6">
                        <Card title="Address" className="shadow-md">
                            <div className="flex items-start">
                                <i className="pi pi-map-marker text-blue-600 text-xl mt-1 mr-4"></i>
                                <div>
                                    <p>Mingo Hotel Kayunga Ltd</p>
                                    <p>Kayunga District</p>
                                    <p>Uganda</p>
                                </div>
                            </div>
                        </Card>

                        <Card title="Nearby Attractions" className="shadow-md">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <i className="pi pi-circle-fill text-blue-600 text-xs mt-2 mr-2"></i>
                                    <div>
                                        <p className="font-medium">Mehta Golf Club</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">44 km from hotel</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <i className="pi pi-circle-fill text-blue-600 text-xs mt-2 mr-2"></i>
                                    <div>
                                        <p className="font-medium">Source of the Nile – Speke Monument</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">47 km from hotel</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <i className="pi pi-circle-fill text-blue-600 text-xs mt-2 mr-2"></i>
                                    <div>
                                        <p className="font-medium">Jinja Golf Course</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">49 km from hotel</p>
                                    </div>
                                </li>
                            </ul>
                        </Card>

                        <Card title="Transportation" className="shadow-md">
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <i className="pi pi-car text-blue-600 text-base mt-1 mr-3"></i>
                                    <div>
                                        <p className="font-medium">Free Private Parking</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Available on-site</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <i className="pi pi-send text-blue-600 text-base mt-1 mr-3"></i>
                                    <div>
                                        <p className="font-medium">Airport</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Entebbe International Airport (105 km)</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <i className="pi pi-taxi text-blue-600 text-base mt-1 mr-3"></i>
                                    <div>
                                        <p className="font-medium">Taxi Service</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Available on request</p>
                                    </div>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocateUs;