import SignupPage from "@/components/SignUpPage";
import { Metadata } from "next";
import "./page.css";

export const metadata: Metadata = {
  title: "Sign Up | YouTube",
  description: "Video Straming Platform",
  authors: { name: "Mukesh Suthar" },
  keywords: "youtube",
};

export default function Login() {
  return (
    <SignupPage/>
  );
}
