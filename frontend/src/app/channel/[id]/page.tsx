import ChannelPage from "@/components/ChannelPage";
import Layout from "@/components/Layout";
import constants from "@/config/constants";
import { cookies } from 'next/headers';
import { cache } from 'react';

const getChannel = cache(async (id: string) => {
    const cookieStore = await cookies();
    const token: string | undefined = cookieStore.get('token')?.value;
    const result = await fetch(`${await constants.API_URI()}channel/${id}`, {
        headers: {
            "Authorization": token as string
        }
    });
    const response = await result.json();
    if (result?.status && result?.status === 200) {
        return response;
    } else {
        return null;
    }
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const userInfo = await getChannel(id);

    return {
        title: `${userInfo?.name} - YouTube`,
        description: `${userInfo?.description}`
    }
}

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const userInfo = await getChannel(id);
    const siteUrl = await constants?.SITE_URL();
    const apiUrl = await constants?.API_URI();
    console.log(userInfo);
    return (
        <Layout>
            <ChannelPage userInfo={userInfo} siteUrl={siteUrl} apiUrl={apiUrl}/>
        </Layout>
    )
}
