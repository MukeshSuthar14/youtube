'use client';
import constants from '@/config/constants';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { UserInfo, VideoData } from '@/utils/types';
import Cookies from 'js-cookie';

const tabs = ['Home', 'Videos', 'About'];

export default function ChannelPage({
    userInfo,
    siteUrl,
    apiUrl
}: {
    userInfo: UserInfo,
    siteUrl: string,
    apiUrl: string
}) {
    const [activeTab, setActiveTab] = useState('Home');
    const [videos, setVideos] = useState<VideoData[] | null>(null);

    const getVideos = async () => {
        const result = await fetch(`${apiUrl}channel/video/${userInfo?.id}`, {
            method: "GET",
            headers: {
                "Authorization": Cookies.get('token') as string
            }
        });
        const response = await result.json();
        if (result?.status && result?.status === 200) {
            setVideos(response?.videos);
        } else {
            alert(response?.message);
        }
    }

    useEffect(() => {
        if (["Home", "Videos"].includes(activeTab)) {
            // getVideos();
        }
    }, [activeTab]);

    return (
        <div
            style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
            }}
        >
            {/* Channel Banner */}
            <div className="h-48 bg-gray-300 dark:bg-gray-800 w-full">
                {apiUrl && <img
                    src={`${apiUrl}banners/${userInfo?.bannerImage}`}
                    className="h-48 bg-gray-300 dark:bg-gray-800 w-full"
                    alt="Channel Avatar"
                />}
            </div>

            {/* Channel Info */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-300">
                {apiUrl && <img
                    src={`${apiUrl}images/${userInfo?.profileImage}`}
                    className="w-20 h-20 rounded-full border-4 border-white -mt-10"
                    alt="Channel Avatar"
                />}
                <div>
                    <h2 className="text-2xl font-bold">{userInfo?.name}</h2>
                    <p className="text-sm text-gray-500">{userInfo?.subscribers || 0} subscribers · {userInfo?.totalVideo || 0} videos</p>
                </div>
                <Link
                    href={`${siteUrl}upload`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-sm"
                    style={{
                        backgroundColor: 'var(--foreground)',
                        color: 'var(--background)',
                    }}
                >
                    <span className="text-xl leading-none">+</span>
                    <span>Create</span>
                </Link>

            </div>

            {/* Tabs */}
            <div className="flex gap-6 px-6 pt-4 border-b border-gray-300">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`pb-2 font-medium ${activeTab === tab
                            ? 'border-b-2 border-[var(--color)] text-[var(--color)]'
                            : 'text-gray-500'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Featured Video */}
            {activeTab === 'Home' && (
                <section className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Featured Video</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="bg-gray-300 dark:bg-[#1a1a1a] w-full md:w-2/3 h-52 md:h-64 rounded"></div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold">Learn Tailwind CSS in 20 Minutes</h4>
                            <p className="text-sm text-gray-500 mt-2">
                                A complete beginner’s guide to Tailwind CSS and how to use it in your projects.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Channel Videos Grid */}
            {(activeTab === 'Home' || activeTab === 'Videos') && (
                <section className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                        {activeTab === 'Videos' ? 'All Videos' : 'Recent Uploads'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {userInfo?.videos && userInfo?.videos.map((_, i) => (
                            <div key={i} className="rounded shadow p-3 bg-gray-100 dark:bg-[#1a1a1a]">
                                <div className="bg-gray-300 h-40 mb-2 rounded"></div>
                                <h4 className="text-sm font-semibold">Video Title {i + 1}</h4>
                                <p className="text-xs text-gray-500">120K views · 2 weeks ago</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* About Tab */}
            {activeTab === 'About' && (
                <section className="p-6">
                    <h3 className="text-xl font-semibold mb-5">About</h3>
                    <h5 className="text-lg font-semibold mb-2">Description</h5>
                    <p className="text-sm text-gray-500 max-w-xl mb-6">
                        {userInfo?.description}
                    </p>
                    <h5 className="text-lg font-semibold mb-2">Channel</h5>
                    <p className="text-sm text-gray-500 max-w-xl mb-6">
                        <Link href={`${siteUrl}@${userInfo?.customUrl}`}>{`${siteUrl}@${userInfo?.customUrl}`}</Link>
                    </p>
                    <h5 className="text-lg font-semibold mb-2">Joined On</h5>
                    <p className="text-sm text-gray-500 max-w-xl mb-6">
                        {moment(userInfo?.createdAt).format("DD MMM YYYY").toString()}
                    </p>
                    <h5 className="text-lg font-semibold mb-2">Subscribers</h5>
                    <p className="text-sm text-gray-500 max-w-xl mb-6">
                        {userInfo?.subscribers}
                    </p>
                    <h5 className="text-lg font-semibold mb-2">Total Views</h5>
                    <p className="text-sm text-gray-500 max-w-xl mb-6">
                        {userInfo?.totalViews}
                    </p>
                </section>
            )}
        </div>
    );
}
