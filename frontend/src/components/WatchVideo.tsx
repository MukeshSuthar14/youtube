"use client"
import constants from "@/config/constants";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { VideoData } from "@/utils/types";
import moment from "moment";

export default function WatchVideo({ id, apiUrl, baseUrl, siteUrl, currentVideo }: { id: string, apiUrl: string, baseUrl: string, siteUrl: string, currentVideo: VideoData }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const token = Cookies.get('token');
    const [videos, setVideos] = useState<VideoData[] | null>(null);

    const videoInfo = async () => {
        const result = await fetch(`${apiUrl}videos`, {
            headers: {
                "Authorization": token as string
            }
        });
        const response = await result.json();
        if (result?.status && result?.status === 200) {
            setVideos(response?.videos);
        }
        return;
    }

    useEffect(() => {
        videoInfo();
        constants.API_URI(true).then(url => {
            setVideoUrl(`${url}watch/${id}?token=${token}`);
        });
        // (videoRef.current as HTMLVideoElement).onload = () => {
        //     videoRef.current.play();
        // };
        const handleLoadedData = () => {
            // Attempt to play after load
            // videoRef.current.muted = false;
            // videoRef.current.volume = 1.0;

            (videoRef.current as HTMLVideoElement).play().catch((error: Error) => {
                console.error('Playback failed:', error);
            });
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', handleLoadedData);
        }

        // setTimeout(() => {
        //     videoRef.current.muted = false;
        //     videoRef.current.volume = 1.0;
        // }, 1000);

        return () => {
            videoRef.current?.removeEventListener('loadeddata', handleLoadedData);
        };
    }, []);

    const playVideo = async (video: VideoData, index: number) => {
        videos && setVideos(videos.map((v, i) => {
            if (i === index) {
                return {
                    ...v,
                    videoPlay: true
                }
            }
            return {
                ...v,
                videoPlay: false
            }
        }));
    }
    const pauseVideo = async (video: VideoData, index: number) => {
        videos && setVideos(videos.map((v, i) => {
            if (i === index) {
                return {
                    ...v,
                    videoPlay: false
                }
            }
            return v;
        }));
    }

    return (
        <div
            className="flex flex-col lg:flex-row gap-6"
            style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
            }}
        >
            {/* Left: Main Video Area */}
            <div className="flex-1">
                {/* Video Player */}
                {token ?
                    <video ref={videoRef} className="w-full aspect-video bg-black rounded mb-4" src={videoUrl as string} controls autoPlay controlsList="nodownload" />
                    :
                    <div className="w-full aspect-video bg-black rounded mb-4">
                        <p className="text-white text-center pt-40">
                        </p>
                    </div>
                }

                {/* Video Title */}
                <h1 className="text-xl font-semibold mb-2">
                    {currentVideo?.title}
                </h1>

                {/* Video Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-500 mb-4">
                    <span>{currentVideo?.views || 0} views • {moment(currentVideo?.date).format("MMM D, YYYY")}</span>
                    <div className="flex gap-4 mt-2 sm:mt-0">
                        <span className="hover:text-[var(--color)] cursor-pointer">👍 {currentVideo?.likes || 0}</span>
                        <span className="hover:text-[var(--color)] cursor-pointer">👎 {currentVideo?.dislikes || 0}</span>
                        <span className="hover:text-[var(--color)] cursor-pointer">🔗 Share</span>
                    </div>
                </div>

                {/* Channel Info */}
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row border-t border-gray-300 pt-4 mb-6">
                    <Link href={`${siteUrl}@${currentVideo?.chaanelUrl}`} className="flex items-center gap-4">
                        <img
                            src={`${baseUrl}images/${currentVideo?.channelImage}`}
                            className="rounded-full w-10 h-10"
                            alt="Go To Channel"
                        />
                        <div>
                            <h3 className="font-semibold">{currentVideo?.channelName}</h3>
                            <p className="text-sm text-gray-500">{currentVideo?.subscribers || 0} subscribers</p>
                        </div>
                    </Link>
                    <button className="mt-3 sm:mt-0 px-4 py-1.5 bg-[var(--color)] text-white rounded font-semibold">
                        Subscribe
                    </button>
                </div>

                {/* Description */}
                <div className="bg-gray-100 dark:bg-[#1f1f1f] rounded p-4 text-sm">
                    <p className="mb-2">
                        {currentVideo?.description}
                    </p>
                    <p className="text-gray-500">{currentVideo?.tags && currentVideo?.tags?.length > 0 && currentVideo?.tags?.map(v => `#${v}`).join(' ')}</p>
                </div>
            </div>

            {/* Right: Suggested Videos */}
            <div className="w-full lg:w-80 space-y-4">
                {videos && videos.map((_, i) => (
                    <Link className="flex gap-3" key={i} href={`/watch/${_?.slug}`} onMouseEnter={() => playVideo(_, i)} onMouseLeave={() => pauseVideo(_, i)}>
                        {_?.videoPlay ?
                            <video className="w-36 h-20 bg-300 rounded" src={baseUrl + "watch/" + _?.slug + "?token=" + token as string} {...{ autoPlay: _?.videoPlay === true }} controlsList="nodownload" muted/>
                            :
                            <div className="w-36 h-20 bg-gray-300 rounded">
                                <img
                                    className="w-36 h-20 bg-gray-300 rounded"
                                    src={`${baseUrl}thumbnails/${_?.thumbnailUrl}`}
                                    width={500}
                                    height={200}
                                    alt={`${_?.title}`}
                                />
                            </div>}
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm">{_?.title}</h4>
                            <p className="text-xs text-gray-500">{_?.channelName}</p>
                            <p className="text-xs text-gray-500">{_?.views || 0} views</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
