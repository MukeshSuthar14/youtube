"use client"
import constants from "@/config/constants";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { VideoData } from "@/utils/types";

export default function Home({ apiUrl, baseUrl }: { apiUrl: string, baseUrl: string }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const token = Cookies.get('token');
  const [videos, setVideos] = useState<VideoData[] | null>(null);

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

  useEffect(() => {
    constants.API_URI(true).then(url => {
      setVideoUrl(`${url}watch/`);
    });
    getVideos();
  }, []);

  const getVideos = async () => {
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
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {videos && videos.map((_, i) => (
          <Link key={i} href={`/watch/${_?.slug}`} onMouseEnter={() => playVideo(_, i)} onMouseLeave={() => pauseVideo(_, i)}>
            <div
              className="p-4 rounded shadow"
              style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            >
              {_?.videoPlay ?
                <video className="h-40 mb-2 rounded" src={videoUrl + _?.slug + "?token=" + token as string} {...{ autoPlay: _?.videoPlay === true }} controlsList="nodownload" />
                :
                <div className="bg-gray-300 h-40 mb-2 rounded">
                  <img
                    className="bg-gray-300 h-40 mb-2 rounded"
                    src={`${baseUrl}thumbnails/${_?.thumbnailUrl}`}
                    width={500}
                    height={200}
                    alt={`${_?.title}`}
                  />
                </div>
              }
              <h3 className="text-lg font-bold">{_?.title}</h3>
              <p className="text-sm text-gray-500">{_?.channelName} · {_?.views || 0} views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
