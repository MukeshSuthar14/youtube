import Layout from "@/components/Layout";
import WatchVideo from "@/components/WatchVideo";
import constants from "@/config/constants";
import { cookies } from "next/headers";
import { cache } from 'react';

const getCurrentVideo = cache(async (id: string) => {
  const cookieStore = await cookies();
  const token: string | undefined = cookieStore.get('token')?.value;
  const apiUrl = await constants.API_URI();
  let result = await fetch(`${apiUrl}video/${id}`, {
    headers: {
      "Authorization": token as string
    }
  });
  let response = await result.json();
  if (result?.status && result?.status === 200) {
    return response;
  }
  return null;
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id }: { id: string } = await params;
  const currentVideo = await getCurrentVideo(id);

  return {
    title: `${currentVideo?.video?.title || 'Video'} - YouTube`,
    description: `${currentVideo?.video?.description}`
  };
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }: { id: string } = await params;
  const apiUrl = await constants.API_URI();
  const baseUrl = await constants.API_URI(true);
  const siteUrl = await constants.SITE_URL();
  const currentVideo = await getCurrentVideo(id);

  return (
    <Layout>
      <WatchVideo id={id} apiUrl={apiUrl} baseUrl={baseUrl} siteUrl={siteUrl} currentVideo={currentVideo?.video} />
    </Layout>
  );
}
