import React from 'react';

interface ServiceItemProps {
    icon: 'room' | 'food' | 'spa';
    title: string;
    description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon, title, description }) => {
    return (
        <div className="bg-white dark:bg-gray-900 hover:bg-orange-500 p-8 shadow-sm transition-all duration-300 hover:shadow-md text-center hover:text-white dark:text-white group">
            <div className="inline-flex items-center justify-center p-4 border border-orange-200 rounded-lg mb-6 group-hover:bg-white group-hover:text-orange-500 transition-all duration-300">
                <div className="text-orange-500 text-2xl group-hover:text-orange-500">
                    {icon === 'room' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    )}
                    {icon === 'food' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )}
                    {icon === 'spa' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    )}
                </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-50 group-hover:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-200 group-hover:text-white transition-all duration-300">
                {description || "Contrary to popular belief, ipsum is not simply random."}
            </p>
        </div>
    );
};


const ServicesSection: React.FC = () => {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h3 className="text-lg font-medium mb-4 tracking-widest relative inline-block">
                        <span className="inline-block relative px-8">
                            OUR SERVICES
                            <span className="absolute left-0 top-1/2 h-0.5 w-6 bg-orange-500"></span>
                            <span className="absolute right-0 top-1/2 h-0.5 w-6 bg-orange-500"></span>
                        </span>
                    </h3>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Explore Our <span className="text-orange-500">SERVICES</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ServiceItem
                        icon="room"
                        title="Rooms & Appartment"
                        description="Contrary to popular belief, ipsum is not simply random."
                    />
                    <ServiceItem
                        icon="food"
                        title="Food & Restaurant"
                        description="Contrary to popular belief, ipsum is not simply random."
                    />
                    <ServiceItem
                        icon="spa"
                        title="Spa & Fitness"
                        description="Contrary to popular belief, ipsum is not simply random."
                    />
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;