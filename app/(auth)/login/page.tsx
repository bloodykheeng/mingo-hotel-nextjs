import React from 'react'
import LoginForm from "./LoginForm"

interface PageProps {
    params: Promise<{}>; // no dynamic route segments here
    searchParams: Promise<{
        returnPath?: string;

    }>;
}

async function LoginPage({ params, searchParams }: PageProps) {
    const { returnPath } = await searchParams;

    return (
        <div>
            <LoginForm returnPath={returnPath} />
        </div>
    )
}

export default LoginPage
