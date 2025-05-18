import React from 'react';
import { MdHotel, MdRestaurantMenu, MdMeetingRoom } from 'react-icons/md';

interface ServiceItemProps {
    icon: 'room' | 'restaurant' | 'conference';
    title: string;
    description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon, title, description }) => {
    const renderIcon = () => {
        switch (icon) {
            case 'room':
                return <MdHotel className="text-orange-500 text-4xl group-hover:text-orange-500" />;
            case 'restaurant':
                return <MdRestaurantMenu className="text-orange-500 text-4xl group-hover:text-orange-500" />;
            case 'conference':
                return <MdMeetingRoom className="text-orange-500 text-4xl group-hover:text-orange-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 hover:bg-orange-500 p-8 shadow-sm transition-all duration-300 hover:shadow-md text-center hover:text-white dark:text-white group">
            <div className="inline-flex items-center justify-center p-4 border border-orange-200 rounded-lg mb-6 group-hover:bg-white transition-all duration-300">
                {renderIcon()}
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-50 group-hover:text-white">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-200 group-hover:text-white transition-all duration-300">
                {description}
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
                        Explore Our <span className="text-orange-500">Services</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ServiceItem
                        icon="room"
                        title="Comfortable Rooms"
                        description="Enjoy a peaceful stay in our well-appointed rooms designed to blend comfort with convenience."
                    />
                    <ServiceItem
                        icon="restaurant"
                        title="Dining Experience"
                        description="Delight in a rich menu of local and international cuisine crafted by experienced chefs."
                    />
                    <ServiceItem
                        icon="conference"
                        title="Conference Facilities"
                        description="Host your meetings or events in our modern and spacious conference rooms tailored for productivity."
                    />
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
