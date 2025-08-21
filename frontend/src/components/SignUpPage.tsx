"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import constants from "../config/constants";
import { useRouter } from 'next/navigation'

type FormValues = {
    name: string;
    email: string;
    password: string;
    profileImage: FileList;
    bannerImage: FileList;
    channelDescription: string;
    country: string;
    category: string;
    socialLinks: {
        twitter: string;
        instagram: string;
        website: string;
    };
};

export default function SignupPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValues>();

    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();
        for (const key in data) {
            if (key === "profileImage" || key === "bannerImage") {
                formData.append(key, data[key][0]); // FileList -> File
            } else if (key === "socialLinks") {
                const social = data[key];
                for (const socialKey in social) {
                    formData.append(`socialLinks[${socialKey}]`, social[socialKey as keyof typeof social]);
                }
            } else {
                formData.append(key, data[key as keyof typeof data] as string);
            }
        }

        // Post formData to backend
        const result = await fetch(`${await constants.API_URI()}register`, {
            method: "POST",
            body: formData
        });
        const response = await result.json();
        if (result?.status && result?.status === 200) {
            alert(response?.message);
            router.push('/');
        } else {
            alert(response?.message);
        }
        return;
    };

    // Image preview handlers
    const previewImage = (fileList: FileList, setter: (val: string) => void) => {
        const file = fileList[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center" style={{ background: "var(--background)", color: "var(--foreground)" }}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                method="post"
                className="w-full max-w-2xl bg-white/10 p-8 rounded-xl shadow-lg backdrop-blur space-y-6"
                encType="multipart/form-data"
            >
                <div className="flex justify-center items-center" style={{ width: "100%" }}>
                    <Image
                        src="/youtube.svg"
                        alt="YouTube logo"
                        width={180}
                        height={38}
                        priority
                    />
                </div>
                <h2 className="text-3xl font-bold text-center">Sign Up</h2>

                <Field label="Name" error={errors.name?.message}>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className="input"
                    />
                </Field>

                <Field label="Email" error={errors.email?.message}>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                        })}
                        className="input"
                    />
                </Field>

                <Field label="Password" error={errors.password?.message}>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 characters" },
                        })}
                        className="input"
                    />
                </Field>

                <Field label="Profile Image">
                    <input
                        type="file"
                        accept="image/*"
                        {...register("profileImage")}
                        className="file-input"
                        onChange={(e) => {
                            register("profileImage").onChange(e);
                            previewImage(e.target.files!, setProfilePreview);
                        }}
                    />
                    {profilePreview && <img src={profilePreview} className="preview-img" />}
                </Field>

                <Field label="Banner Image">
                    <input
                        type="file"
                        accept="image/*"
                        {...register("bannerImage")}
                        className="file-input"
                        onChange={(e) => {
                            register("bannerImage").onChange(e);
                            previewImage(e.target.files!, setBannerPreview);
                        }}
                    />
                    {bannerPreview && <img src={bannerPreview} className="preview-img" />}
                </Field>

                <Field label="Channel Description">
                    <textarea {...register("channelDescription")} className="input" rows={3} />
                </Field>

                <Field label="Country">
                    <input {...register("country")} className="input" />
                </Field>

                <Field label="Category" error={errors.category?.message}>
                    <select {...register("category", { required: "Category required" })} className="input">
                        <option value="">Select Category</option>
                        {["Education", "Music", "Gaming", "Tech", "Comedy"].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Twitter">
                        <input {...register("socialLinks.twitter")} className="input" />
                    </Field>
                    <Field label="Instagram">
                        <input {...register("socialLinks.instagram")} className="input" />
                    </Field>
                    <Field label="Website">
                        <input {...register("socialLinks.website")} className="input" />
                    </Field>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition">
                    Sign Up
                </button>
            </form>
        </div>
    );
}

const Field = ({
    label,
    children,
    error,
}: {
    label: string;
    children: React.ReactNode;
    error?: string;
}) => (
    <div>
        <label className="block mb-1 font-medium">{label}</label>
        {children}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);
