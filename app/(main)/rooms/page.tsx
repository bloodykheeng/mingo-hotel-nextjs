import Head from 'next/head';
import RoomsListing from "./RoomsListing";

interface PageProps {
    params: Promise<{}>; // no dynamic route segments here
    searchParams: Promise<{
        check_in?: string;
        check_out?: string;
        adults?: string;
        children?: string;
    }>;
}

async function RoomsPage({ params, searchParams }: PageProps) {
    const { check_in, check_out, adults, children } = await searchParams;

    return (
        <>
            <Head>
                <title>Rooms - Mongo Hotel</title>
                <meta
                    name="description"
                    content="Mingo hotel the best hotel in uganda"
                />
            </Head>
            <RoomsListing
                checkIn={check_in}
                checkOut={check_out}
                adults={adults}
                children={children}
            />
        </>
    );
};

export default RoomsPage;
