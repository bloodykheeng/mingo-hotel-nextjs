'use client'
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

interface StaffMember {
    id: number;
    name: string;
    designation: string;
    image: string;
    socialMedia: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
}

// Sample data for Mingo Hotel Kayunga staff based on the screenshot
const staffData: StaffMember[] = [
    {
        id: 1,
        name: "Stephen Mukasa",
        designation: "General Manager",
        image: "/assets/img/team-1.jpg",
        socialMedia: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    },
    {
        id: 2,
        name: "David Kasozi",
        designation: "Executive Chef",
        image: "/assets/img/team-2.jpg",
        socialMedia: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    },
    {
        id: 3,
        name: "Paul Kamya",
        designation: "Guest Relations",
        image: "/assets/img/team-3.jpg",
        socialMedia: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    },
    {
        id: 4,
        name: "John Kato",
        designation: "Housekeeping Manager",
        image: "/assets/img/team-4.jpg",
        socialMedia: {
            facebook: "#",
            twitter: "#",
            instagram: "#"
        }
    }
];

const TeamStaffSection: React.FC = () => {
    return (
        <div className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">OUR TEAM</h2>
                    <div className="w-24 h-1 bg-orange-500 mx-auto my-4"></div>
                    <h3 className="text-4xl font-bold mb-4">Explore Our <span className="text-orange-500">STAFFS</span></h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {staffData.map((staff) => (
                        <div key={staff.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="relative h-80 overflow-hidden">
                                <img
                                    src={staff.image}
                                    alt={staff.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/placeholder-person.jpg';
                                    }}
                                />
                            </div>
                            <div className="p-6 text-center">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{staff.name}</h4>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{staff.designation}</p>
                                <div className="flex justify-center gap-3 mt-4">
                                    {staff.socialMedia.facebook && (
                                        <a
                                            href={staff.socialMedia.facebook}
                                            className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors"
                                            aria-label={`${staff.name}'s Facebook`}
                                        >
                                            <FaFacebook />
                                        </a>
                                    )}
                                    {staff.socialMedia.twitter && (
                                        <a
                                            href={staff.socialMedia.twitter}
                                            className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors"
                                            aria-label={`${staff.name}'s Twitter`}
                                        >
                                            <FaTwitter />
                                        </a>
                                    )}
                                    {staff.socialMedia.instagram && (
                                        <a
                                            href={staff.socialMedia.instagram}
                                            className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors"
                                            aria-label={`${staff.name}'s Instagram`}
                                        >
                                            <FaInstagram />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamStaffSection;