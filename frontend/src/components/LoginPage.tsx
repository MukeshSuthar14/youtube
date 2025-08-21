"use client";
import constants from "@/config/constants";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Handle login here (API call etc.)
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const result = await fetch(`${await constants.API_URI()}login`, {
      method: "POST",
      body: formData
    });
    const response = await result.json();
    if (result?.status && result?.status === 200) {
      Cookies.set('token', response?.token, { expires: 365 });
      Cookies.set('profileImage', response?.profileImage, { expires: 365 });
      alert(response?.message);
      router.push('/');
    } else {
      alert(response?.message);
    }
    return;
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/10 p-8 rounded-2xl shadow-lg backdrop-blur" method="POST">
        <div className="flex justify-center items-center" style={{ width: "100%" }}>
          <Image
            src="/youtube.svg"
            alt="YouTube logo"
            width={180}
            height={38}
            priority
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
