import Head from 'next/head';
import RoomsListing from "./RoomsListing";

const RoomsPage = () => {
    return (
        <>
            <Head>
                <title>Rooms - Mongo Hotel</title>
                <meta
                    name="description"
                    content="Mingo hotel the best hotel in uganda"
                />
            </Head>
            <RoomsListing />
        </>
    );
};

export default RoomsPage;
