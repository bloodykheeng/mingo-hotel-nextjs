'use client'

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const footerData = {
    contact: [
        { icon: '📍', text: 'Kayunga, Uganda' },
        { icon: '📞', text: '+256 700 123456' },
        { icon: '✉️', text: 'info@mingohotel.com' },
    ],
    company: ['About Us', 'Contact Us', 'Privacy Policy', 'Terms & Condition', 'Support'],
    services: ['Food & Restaurant', 'Spa & Fitness', 'Sports & Gaming', 'Event & Party', 'GYM & Yoga'],
};

const Footer: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 pt-0 pb-16">
            <div className="container mx-auto px-4 pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-orange-500 p-8 text-white">
                    <h3 className="text-4xl font-bold mb-4">Mingo Hotel</h3>
                    <p>
                        Mingo Hotel Kayunga Ltd stands out as a delightful choice. Nestled in the heart of Kayunga, Uganda, this exquisite 2-star hotel seamlessly combines modern amenities with a touch of local charm. Whether you’re a weary traveler seeking respite or an explorer on a quest for new horizons, Mingo Hotel Kayunga Ltd promises an unforgettable stay.
                    </p>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* CONTACT */}
                    <div>
                        <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-orange-500 pb-2">CONTACT</h4>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                            {footerData.contact.map((item, idx) => (
                                <li key={idx} className="flex items-start">
                                    <span className="mr-2">{item.icon}</span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex mt-4 space-x-2">
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-orange-500 pb-2">COMPANY</h4>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                            {footerData.company.map((item, idx) => (
                                <li key={idx}>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>{item}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SERVICES */}
                    <div>
                        <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-orange-500 pb-2">SERVICES</h4>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                            {footerData.services.map((item, idx) => (
                                <li key={idx}>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>{item}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
