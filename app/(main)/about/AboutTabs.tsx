'use client'

import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import AboutUsPage from './AboutUsPage';
import ContactUs from './contact-us/ContactUs';
import LocateUs from './locate-us/LocateUs';

const AboutTabs: React.FC = () => {
    return (
        <div className="md:p-1">
            <TabView>
                {/* About Us Tab */}
                <TabPanel header="About Us" className="dark:bg-dark">
                    <AboutUsPage />
                </TabPanel>

                {/* Contact Us Tab */}
                <TabPanel header="Contact Us" className="dark:bg-dark">
                    <ContactUs />
                </TabPanel>

                {/* Locate Us Tab */}
                <TabPanel header="Locate Us" className="dark:bg-dark">
                    <LocateUs />
                </TabPanel>
            </TabView>
        </div>
    );
};

export default AboutTabs;