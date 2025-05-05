import React from 'react';

interface RoomProps {
    image: string;
    price: number;
    title: string;
    description: string;
    beds: number;
    baths: number;
    hasWifi: boolean;
}

const RoomCard: React.FC<RoomProps> = ({
    image,
    price,
    title,
    description,
    beds,
    baths,
    hasWifi
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-orange-500 text-white py-1 px-3 font-medium">
                    ${price}/night
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{title}</h3>
                <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <svg
                            key={index}
                            className="w-5 h-5 text-orange-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                <div className="flex mb-4 text-gray-600 text-sm">
                    <div className="flex items-center mr-4">
                        <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                        {beds} bed
                    </div>
                    <div className="flex items-center mr-4">
                        <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {baths} bath
                    </div>
                    {hasWifi && (
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                            Wifi
                        </div>
                    )}
                </div>

                <p className="text-gray-600 dark:text-white mb-6">{description}</p>

                <div className="flex space-x-4">
                    <a
                        href="#"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 inline-block transition duration-300
                   dark:bg-orange-600 dark:hover:bg-orange-700"
                    >
                        VIEW DETAIL
                    </a>
                    <a
                        href="#"
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 inline-block transition duration-300
                   dark:bg-gray-100 dark:hover:bg-gray-300 dark:text-gray-900"
                    >
                        BOOK NOW
                    </a>
                </div>

            </div>
        </div>
    );
};

const RoomsSection: React.FC = () => {
    const rooms: RoomProps[] = [
        {
            image: "/assets/img/room-1.jpg",
            price: 110,
            title: "Junior Suit",
            description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.",
            beds: 3,
            baths: 2,
            hasWifi: true
        },
        {
            image: "/assets/img/room-2.jpg",
            price: 110,
            title: "Executive Suite",
            description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.",
            beds: 3,
            baths: 2,
            hasWifi: true
        },
        {
            image: "/assets/img/room-3.jpg",
            price: 110,
            title: "Super Deluxe",
            description: "Erat ipsum justo amet duo et elitr dolor, est duo duo eos lorem sed diam stet diam sed stet lorem.",
            beds: 3,
            baths: 2,
            hasWifi: true
        }
    ];

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold">
                        Explore Our <span className="text-orange-500">ROOMS</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room, index) => (
                        <RoomCard key={index} {...room} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomsSection;