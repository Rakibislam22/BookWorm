'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiBook, FiMail, FiLock, FiUser, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { postUser } from '@/actions/server/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        photo: '',
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: fd,
            });

            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, photo: data.url });
                setPhotoFile(file);
                toast.success('Photo uploaded successfully');
            } else {
                toast.error('Failed to upload photo');
            }
        } catch {
            toast.error('Error uploading photo');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = postUser(formData); // ✅ direct call

            if (data.success) {
                toast.success('Registration successful!');
                router.push(
                    data.user.role === 'admin'
                        ? '/admin/dashboard'
                        : '/my-library'
                );
                router.refresh();
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black px-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl space-y-8">

                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <FiBook className="h-12 w-12 text-amber-500" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-100">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Or{' '}
                        <Link
                            href="/login"
                            className="font-medium text-amber-500 hover:text-amber-400 transition"
                        >
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-1 relative">
                                <FiUser className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <FiMail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <FiLock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <input
                                    type="password"
                                    minLength={6}
                                    required
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                        </div>

                        {/* Photo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Profile Photo (Optional)
                            </label>
                            <div className="mt-1 flex items-center space-x-4">
                                <label className="cursor-pointer">
                                    <div className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-md bg-gray-800 hover:bg-gray-700 transition">
                                        <FiUpload className="h-5 w-5 text-amber-500" />
                                        <span className="text-sm text-gray-300">
                                            {uploading
                                                ? 'Uploading...'
                                                : photoFile
                                                    ? photoFile.name
                                                    : 'Choose file'}
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>

                                {formData.photo && (
                                    <img
                                        src={formData.photo}
                                        alt="Profile"
                                        className="h-12 w-12 rounded-full object-cover border border-gray-700"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full py-2 rounded-md font-medium text-black bg-amber-500 hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
