import Header from './Header'
import Footer from './Footer'
import { cookies } from "next/headers";
import React from 'react'
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {

    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token || !token?.value) {
        redirect('/');
    }

    return (
        <>
            <Header />
            <main className="min-h-[80vh] px-4 py-6">
                {children}
            </main>
            <Footer />
        </>
    )
}