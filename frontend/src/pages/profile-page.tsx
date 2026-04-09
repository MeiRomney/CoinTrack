import { useState } from "react";
import { useUserProfile } from "../hooks/use-user-profile";
import { Button } from "../ui-kits/button";
import { Input } from "../ui-kits/input";
import { CameraIcon } from "@heroicons/react/24/solid";

export function ProfilePage() {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    profilePhotoUrl: profile?.profilePhotoUrl || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      profilePhotoUrl: profile?.profilePhotoUrl || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error loading profile: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
        {/* Avatar Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            <img
              src={
                formData.profilePhotoUrl ||
                profile?.profilePhotoUrl ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600">
                <CameraIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Username (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={profile?.username || ""}
              disabled
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              disabled={!isEditing}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 disabled:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={!isEditing}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 disabled:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
            />
          </div>

          {/* Profile Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Photo URL
            </label>
            <input
              type="url"
              value={formData.profilePhotoUrl}
              onChange={(e) =>
                handleInputChange("profilePhotoUrl", e.target.value)
              }
              disabled={!isEditing}
              placeholder="https://example.com/photo.jpg"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 disabled:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-700"
            />
          </div>

          {/* Organization (Read-only) */}
          {profile?.organizationId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Organization
              </label>
              <input
                type="text"
                value={profile.organizationId}
                disabled
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          )}

          {/* Roles (Read-only) */}
          {profile?.roles && profile.roles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Roles
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Account Created
                </p>
                <p className="text-gray-900 dark:text-gray-100">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-gray-100">
                  {profile?.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
