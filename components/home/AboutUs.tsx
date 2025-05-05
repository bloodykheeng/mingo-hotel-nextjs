import React from 'react';

interface StatsItemProps {
    icon: string;
    count: string;
    label: string;
}

const StatsItem: React.FC<StatsItemProps> = ({ icon, count, label }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-8 border border-gray-100 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-4">
                <div className="text-orange-500 text-2xl">
                    {icon === 'hotel' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    )}
                    {icon === 'staff' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                    {icon === 'clients' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )}
                </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{count}</h2>
            <p className="text-gray-600 dark:text-gray-300">{label}</p>
        </div>

    );
};

interface AboutUsProps {
    hotelName: string;
    description: string;
}

const AboutUs: React.FC<AboutUsProps> = ({ hotelName, description }) => {
    return (
        <section className="py-16 ">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-1/2">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1 relative inline-block">
                                ABOUT US
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-500"></span>
                            </h3>
                        </div>
                        <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                            Welcome to <span className="text-orange-500">{hotelName}</span>
                        </h2>
                        <p className="text-gray-700 dark:text-white mb-8">
                            {description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatsItem icon="hotel" count="7861" label="Rooms" />
                            <StatsItem icon="staff" count="1234" label="Staffs" />
                            <StatsItem icon="clients" count="4321" label="Clients" />
                        </div>
                    </div>

                    <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                        <div className="rounded overflow-hidden flex justify-end">
                            <img
                                src="/assets/img/about-1.jpg"
                                alt="Hotel pool view"
                                className="w-[75%] object-cover transition-transform duration-500 hover:scale-110"
                                style={{ marginTop: "25%" }}
                            />
                        </div>
                        <div className="rounded overflow-hidden">
                            <img
                                src="/assets/img/about-2.jpg"
                                alt="Beach resort"
                                className="w-[100%]  object-cover transition-transform duration-500 hover:scale-110"
                            />
                        </div>
                        <div className="rounded overflow-hidden flex justify-end">
                            <img
                                src="/assets/img/about-3.jpg"
                                alt="Luxury villas"
                                className="w-[50%]  object-cover transition-transform duration-500 hover:scale-110"
                                style={{ marginBottom: "25%" }}
                            />
                        </div>
                        <div className="rounded overflow-hidden">
                            <img
                                src="/assets/img/about-4.jpg"
                                alt="Spa service"
                                className="w-[75%]  object-cover transition-transform duration-500 hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;