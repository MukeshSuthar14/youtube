import Layout from "@/components/Layout";
import UploadVideoPage from "@/components/UploadVideoPage";
import constants from "@/config/constants";

export default async function page() {
    const apiUrl = await constants.API_URI();
    return (
        <Layout>
            <UploadVideoPage apiUrl={apiUrl} />
        </Layout>
    )
}