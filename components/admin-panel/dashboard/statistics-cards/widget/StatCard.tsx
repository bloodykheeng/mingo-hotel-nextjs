import React from 'react'
import numeral from "numeral";
import CountUp from 'react-countup';
import Link from 'next/link';

// Define the type for our statistics items
interface StatItem {
    title: string;
    link: string;
    icon: string;
    bgColor: string;
    textColor: string;
    message: string;
    count: number;
}

// Map backend color classes to complete Tailwind classes
const bgColorMap: Record<string, string> = {
    'bg-blue-600': 'bg-blue-600 hover:bg-blue-500',
    'bg-blue-500': 'bg-blue-500 hover:bg-blue-400',
    'bg-blue-400': 'bg-blue-400 hover:bg-blue-300',
    'bg-green-600': 'bg-green-600 hover:bg-green-500',
    'bg-red-600': 'bg-red-600 hover:bg-red-500',
    'bg-gray-600': 'bg-gray-600 hover:bg-gray-500',
    'bg-orange-500': 'bg-orange-500 hover:bg-orange-400',
    'bg-orange-400': 'bg-orange-400 hover:bg-orange-300',
    'bg-yellow-500': 'bg-yellow-500 hover:bg-yellow-400',
    'bg-purple-600': 'bg-purple-600 hover:bg-purple-500',
    'bg-teal-500': 'bg-teal-500 hover:bg-teal-400',
    // Default color if none matches
    'default': 'bg-blue-600 hover:bg-blue-500'
};

const textColorMap: Record<string, string> = {
    'text-white': 'text-white',
    'text-black': 'text-black',
    // Default text color
    'default': 'text-white'
};

const formatNumber = (number: number) => {
    return numeral(number).format("0.[00]a"); // e.g., 3.5k, 3.45m, 3.4b
};



function StatCard({ title, link, count, icon, bgColor, textColor, message }: StatItem) {

    // Get the complete classes or use defaults
    const bgColorClass = bgColorMap[bgColor] || bgColorMap['default'];
    const textColorClass = textColorMap[textColor] || textColorMap['default'];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex justify-between items-center">
                <div>
                    {/* <div className="text-gray-600 dark:text-gray-300 text-sm mb-1" title={message}>
                        {title}
                    </div> */}
                    {link ? (
                        <Link href={link}>
                            <div className="text-blue-600 hover:underline dark:text-blue-400 text-sm font-medium mb-1" title={message}>
                                {title}
                            </div>
                        </Link>
                    ) : (
                        <div className="text-gray-600 dark:text-gray-300 text-sm mb-1" title={message}>
                            {title}
                        </div>
                    )}


                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {/* {formatNumber(count)} */}
                        <CountUp end={count} formattingFn={formatNumber} duration={2} />
                    </div>
                </div>

                <div className={`${bgColor} p-3 rounded-lg`}>
                    <i className={`pi ${icon} ${textColor} text-xl`} />
                </div>
            </div>
        </div>
    )

}

export default StatCard