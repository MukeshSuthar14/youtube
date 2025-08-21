'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

const categories = [
    'Education',
    'Entertainment',
    'Music',
    'Gaming',
    'Sports',
    'News',
    'Tech',
    'Other',
] as const;

type Category = typeof categories[number];
type Visibility = 'public' | 'private' | 'unlisted';

interface UploadFormInputs {
    title: string;
    description?: string;
    videoFile: FileList;
    thumbnailFile?: FileList;
    category?: Category;
    tags?: string;
    isPublished: boolean;
    visibility: Visibility;
    country: string;
    city: string;
}

export default function UploadVideoPage({
    apiUrl,
    id = null
}: {
    apiUrl: string,
    id?: string | null
}) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UploadFormInputs>({
        defaultValues: {
            title: '',
            description: '',
            category: undefined,
            tags: '',
            isPublished: false,
            visibility: 'public',
            country: '',
            city: ''
        },
    });

    const onSubmit: SubmitHandler<UploadFormInputs> = async (data) => {
        // Convert tags string to array
        const tagsArray = data.tags
            ? data.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)
            : [];

        const videoFile = data.videoFile[0];
        const thumbnailFile = data.thumbnailFile ? data.thumbnailFile[0] : null;

        const payload = {
            ...data,
            tags: tagsArray,
            videoFile,
            thumbnailFile,
        };
        const formData = new FormData();
        for (const [key, value] of Object.entries(payload)) {
            formData.append(key, value as string);
        }
        
        const result = await fetch(`${apiUrl}video/${id ? "update": "add"}`, {
            method: id ? "PUT": "POST",
            headers: {
                "Authorization": Cookies.get('token') as string
            },
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

    const videoFile = watch('videoFile');
    const thumbnailFile = watch('thumbnailFile');

    return (
        <>
            <h1 style={{ textAlign: 'center' }} className="text-2xl font-bold mb-6 mt-6">Upload Video</h1>
            <div
                className="min-h-screen p-6 flex items-center justify-center"
                style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    encType="multipart/form-data"
                    style={{
                        width: "45rem"
                    }}
                >
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block mb-1 font-medium">
                            Title <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="title"
                            {...register('title', { required: 'Title is required' })}
                            type="text"
                            placeholder="Enter video title"
                            className={`w-full px-4 py-2 rounded border border-gray-600 bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color)] ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.title && (
                            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block mb-1 font-medium">
                            Description
                        </label>
                        <textarea
                            id="description"
                            {...register('description')}
                            rows={4}
                            placeholder="Enter video description"
                            className="w-full px-4 py-2 rounded border border-gray-600 bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color)]"
                        />
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label htmlFor="videoFile" className="block mb-1 font-medium">
                            Upload Video <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="videoFile"
                            type="file"
                            accept="video/*"
                            {...register('videoFile', {
                                required: 'Video file is required',
                                validate: {
                                    fileType: (files) =>
                                        files &&
                                            files[0] &&
                                            files[0].type.startsWith('video/')
                                            ? true
                                            : 'Please upload a valid video file',
                                },
                            })}
                            className={`block w-full text-sm  ${errors.videoFile ? 'border-red-500' : ''
                                }`}
                        />
                        {videoFile && videoFile.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">{videoFile[0].name}</p>
                        )}
                        {errors.videoFile && (
                            <p className="text-red-600 text-sm mt-1">{errors.videoFile.message}</p>
                        )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label htmlFor="thumbnailFile" className="block mb-1 font-medium">
                            Upload Thumbnail
                        </label>
                        <input
                            id="thumbnailFile"
                            type="file"
                            accept="image/*"
                            {...register('thumbnailFile')}
                            className={`block w-full text-sm ${errors.thumbnailFile ? 'border-red-500' : ''
                                }`}
                        />
                        {thumbnailFile && thumbnailFile.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">{thumbnailFile[0].name}</p>
                        )}
                        {errors.thumbnailFile && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.thumbnailFile.message}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block mb-1 font-medium">
                            Category
                        </label>
                        <select
                            id="category"
                            {...register('category')}
                            className="w-full px-4 py-2 rounded border border-gray-600 bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color)]"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select category
                            </option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block mb-1 font-medium">
                            Tags (comma separated)
                        </label>
                        <input
                            id="tags"
                            {...register('tags')}
                            type="text"
                            placeholder="e.g. tutorial, react, javascript"
                            className="w-full px-4 py-2 rounded border border-gray-600 bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color)]"
                        />
                    </div>

                    {/* Is Published */}
                    <div className="flex items-center gap-2">
                        <input
                            id="isPublished"
                            type="checkbox"
                            {...register('isPublished')}
                            className="w-4 h-4 rounded"
                        />
                        <label htmlFor="isPublished" className="font-medium">
                            Publish now
                        </label>
                    </div>

                    {/* Visibility */}
                    <fieldset>
                        <legend className="font-medium mb-2">Visibility</legend>
                        <div className="flex gap-6">
                            {(['public', 'private', 'unlisted'] as Visibility[]).map((v) => (
                                <label key={v} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value={v}
                                        {...register('visibility')}
                                        defaultChecked={v === 'public'}
                                        className="w-4 h-4"
                                    />
                                    <span className="capitalize">{v}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* Location */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="country" className="block mb-1 font-medium">
                                Country
                            </label>
                            <input
                                id="country"
                                {...register('country')}
                                type="text"
                                placeholder="Country"
                                className="w-full px-4 py-2 rounded border border-gray-600 bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color)]"
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="city" className="block mb-1 font-medium">
                                City
                            </label>
                            <input
                                id="city"
                                {...register('city')}
                                type="text"
                                placeholder="City"
                                className="w-full px-4 py-2 rounded border border-gray-600 bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color)]"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[var(--color)] text-white font-semibold rounded hover:bg-red-600 transition"
                    >
                        Upload
                    </button>
                </form>
            </div>
        </>
    );
}
