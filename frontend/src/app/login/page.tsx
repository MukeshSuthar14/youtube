import LoginPage from "@/components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | YouTube",
  description: "Video Straming Platform",
  authors: { name: "Mukesh Suthar" },
  keywords: "youtube",
};

export default function Login() {
  return (
    <LoginPage/>
  );
}
