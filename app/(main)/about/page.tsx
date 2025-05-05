import Head from 'next/head';
import AboutTabs from "./AboutTabs";

const AboutPage = () => {
    return (
        <>
            <Head>
                <title>About Mingo Hotel Kayunga Ltd</title>
                <meta
                    name="description"
                    content="Learn more about Mingo Hotel Kayunga Ltd, a cozy 2-star hotel in Kayunga, Uganda, offering modern amenities, warm hospitality, and access to top attractions like the Source of the Nile and Mehta Golf Club."
                />
            </Head>

            <AboutTabs />
        </>
    );
};

export default AboutPage;
