import Welcome from "@/components/Welcome";
import { cookies } from "next/headers";
import Layout from "@/components/Layout";
import Home from "@/components/Home";
import constants from "@/config/constants";

export default async function Page() {

  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  const apiUrl = await constants.API_URI();
  const baseUrl = await constants.API_URI(true);

  if (!token || !token?.value) {
    return (
      <Welcome/>
    );
  }
  
  return (
    <Layout>
      <Home apiUrl={apiUrl} baseUrl={baseUrl}/>
    </Layout>
  )
}
