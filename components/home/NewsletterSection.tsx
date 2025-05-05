'use client'
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const NewsletterSection: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const toast = React.useRef<Toast>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter your email address',
                life: 3000
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid email address',
                life: 3000
            });
            return;
        }

        // Here you would normally send the email to your backend
        console.log('Subscribing email:', email);

        // Show success message
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Thank you for subscribing to our newsletter!',
            life: 3000
        });

        setSubmitted(true);
        setEmail('');

        // Reset form after 5 seconds
        setTimeout(() => {
            setSubmitted(false);
        }, 5000);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 py-16">
            <Toast ref={toast} />
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Subscribe Our<span className="text-orange-500">NEWSLETTER</span>
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                        <InputText
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-grow p-3"
                        />
                        <Button
                            type="submit"
                            label="SUBMIT"
                            className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 font-bold"
                            disabled={submitted}
                        />
                    </form>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-orange-500 p-8 text-white">
                        <h3 className="text-4xl font-bold mb-4">HOTELIER</h3>
                        <p className="mb-6">
                            Build a professional website for your hotel business and grab the attention of new visitors upon your site's launch.
                        </p>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-orange-500 pb-2">CONTACT</h4>
                            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start">
                                    <span className="mr-2">📍</span>
                                    <span>Kayunga, Uganda</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">📞</span>
                                    <span>+256 700 123456</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">✉️</span>
                                    <span>info@mingohotel.com</span>
                                </li>
                            </ul>
                            <div className="flex mt-4 space-x-2">
                                <a href="#" className="p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <FaFacebook />
                                </a>
                                <a href="#" className="p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <FaTwitter />
                                </a>
                                <a href="#" className="p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="p-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <FaLinkedin />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-orange-500 pb-2">COMPANY</h4>
                            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>About Us</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>Contact Us</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>Privacy Policy</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>Terms & Condition</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>Support</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b border-orange-500 pb-2">SERVICES</h4>
                            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>Food & Restaurant</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>Spa & Fitness</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>Sports & Gaming</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>Event & Party</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-500 transition-colors flex items-center">
                                        <span className="mr-2">▶</span>
                                        <span>GYM & Yoga</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterSection;