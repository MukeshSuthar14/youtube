"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import constants from "@/config/constants";
import { UserInfo } from "@/utils/types";

export default function YouPage() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [apiUrl, setApiUrl] = useState<string | null>(null);

    const getUserDetails = async () => {
        setApiUrl(await constants.API_URI(true));
        const result = await fetch(`${await constants.API_URI()}user`, {
            headers: {
                "Authorization": Cookies.get('token') as string
            }
        });
        const response = await result.json();
        if (result?.status && result?.status === 200) {
            setUserInfo(response);
        } else {
            alert(response?.message);
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div
            className="space-y-10"
            style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
            }}
        >
            {/* Channel Header */}
            <Link href={`/channel/${userInfo?.id}`}>
                <div className="flex items-center gap-6 p-4 border-b border-gray-300">
                    {(apiUrl && userInfo?.profileImage) && <img
                        src={`${apiUrl}images/${userInfo?.profileImage}`}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border"
                    />}
                    <div>
                        <h2 className="text-2xl font-bold">{userInfo?.name}</h2>
                        <p className="text-sm text-gray-500">{userInfo?.subscribers} subscribers · {userInfo?.totalViews} views</p>
                    </div>
                </div>
            </Link>

            {/* Section: History */}
            <section className="px-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">History</h3>
                    <button className="text-sm text-[var(--color)] hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Link key={i} href={`/watch/${i}`}>
                            <div className="rounded shadow p-3 bg-gray-100 dark:bg-[#1a1a1a]">
                                <div className="bg-gray-300 h-40 mb-2 rounded"></div>
                                <h4 className="text-sm font-semibold">Watched Video {i + 1}</h4>
                                <p className="text-xs text-gray-500">Channel Name · 120K views</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Section: Watch Later */}
            <section className="px-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Watch Later</h3>
                    <button className="text-sm text-[var(--color)] hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Link key={i} href={`/watch/${i}`}>
                            <div className="rounded shadow p-3 bg-gray-100 dark:bg-[#1a1a1a]">
                                <div className="bg-gray-300 h-40 mb-2 rounded"></div>
                                <h4 className="text-sm font-semibold">Saved Video {i + 1}</h4>
                                <p className="text-xs text-gray-500">Channel Name · 250K views</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Section: Liked Videos */}
            <section className="px-4 pb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Liked Videos</h3>
                    <button className="text-sm text-[var(--color)] hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Link key={i} href={`/watch/${i}`}>
                            <div className="rounded shadow p-3 bg-gray-100 dark:bg-[#1a1a1a]">
                                <div className="bg-gray-300 h-40 mb-2 rounded"></div>
                                <h4 className="text-sm font-semibold">Liked Video {i + 1}</h4>
                                <p className="text-xs text-gray-500">Channel Name · 90K views</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
