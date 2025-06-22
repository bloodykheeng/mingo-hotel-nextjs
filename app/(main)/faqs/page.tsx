import Head from 'next/head';
import FaqsListing from "./FaqsListing";

const FaqsPage = () => {
    return (
        <>
            <Head>
                <title>FAQs Mingo Hotel</title>
                <meta
                    name="description"
                    content="Learn more about Mingo Hotel, a cozy 5-star hotel in Kayunga, Uganda, offering modern amenities, warm hospitality, and access to top attractions like the Source of the Nile and Mehta Golf Club."
                />
            </Head>
            <FaqsListing />
        </>
    );
};

export default FaqsPage;
