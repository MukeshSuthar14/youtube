import Layout from "@/components/Layout";
import UploadVideoPage from "@/components/UploadVideoPage";
import constants from "@/config/constants";

export default async function page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const apiUrl = await constants.API_URI();

    return (
        <Layout>
            <UploadVideoPage id={id} apiUrl={apiUrl} />
        </Layout>
    )
}