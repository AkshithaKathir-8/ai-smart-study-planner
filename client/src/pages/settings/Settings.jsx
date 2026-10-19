import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

import {
  User,
  Bell,
  Shield,
  Save,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Mail,
  UserRound,
  Camera,
} from "lucide-react";

function Settings() {
  const { user, login } = useAuth();

  const [notifications, setNotifications] =
    useState(
      user?.notificationsEnabled ?? true
    );

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [uploadingPhoto, setUploadingPhoto] =
    useState(false);

  const [passwordVisibility, setPasswordVisibility] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const [profileMessage, setProfileMessage] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const getSessionToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  const getRememberMe = () => {
    return !!localStorage.getItem("token");
  };

  const refreshUserSession = (updatedUser) => {
    const token = getSessionToken();
    const rememberMe = getRememberMe();

    login(
      updatedUser,
      token,
      rememberMe
    );
  };

  const getProfileImageUrl = () => {
    if (!user?.profileImage) {
      return "";
    }

    return `https://ai-smart-study-planner-dhc6.onrender.com${user.profileImage}`;
  };

  const getUserInitial = () => {
    return (
      user?.name?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setProfileMessage("");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });

    setPasswordMessage("");
  };

  const handleSave = async () => {
    if (!profile.name.trim()) {
      setProfileMessage(
        "Please enter your name."
      );
      return;
    }

    if (!profile.email.trim()) {
      setProfileMessage(
        "Please enter your email address."
      );
      return;
    }

    try {
      setSavingProfile(true);
      setProfileMessage("");

      const response = await api.put(
        "/user/profile",
        {
          name: profile.name.trim(),
          email: profile.email.trim(),
        }
      );

      const updatedUser =
        response.data.user;

      refreshUserSession(updatedUser);

      setProfile({
        name: updatedUser?.name || "",
        email: updatedUser?.email || "",
      });

      setProfileMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      setProfileMessage(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProfilePhotoChange = async (
    e
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setProfileMessage(
        "Only JPG, PNG, and WebP images are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileMessage(
        "Profile photo must be smaller than 5 MB."
      );

      e.target.value = "";
      return;
    }

    try {
      setUploadingPhoto(true);
      setProfileMessage("");

      const formData = new FormData();

      formData.append(
        "profileImage",
        file
      );

      const response = await api.post(
        "/user/profile-image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const updatedUser =
        response.data.user;

      refreshUserSession(updatedUser);

      setProfileMessage(
        "Profile photo updated successfully."
      );
    } catch (error) {
      setProfileMessage(
        error.response?.data?.message ||
          "Failed to upload profile photo."
      );
    } finally {
      setUploadingPhoto(false);

      e.target.value = "";
    }
  };

  const handleNotificationToggle =
    async () => {
      const newValue =
        !notifications;

      try {
        setNotifications(newValue);

        const response =
          await api.put(
            "/user/profile",
            {
              name: profile.name,
              email: profile.email,
              notificationsEnabled:
                newValue,
            }
          );

        const updatedUser =
          response.data.user;

        refreshUserSession(updatedUser);
      } catch (error) {
        setNotifications(
          notifications
        );

        alert(
          error.response?.data?.message ||
            "Failed to update notification settings."
        );
      }
    };

  const handleChangePassword =
    async () => {
      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        setPasswordMessage(
          "Please fill in all password fields."
        );
        return;
      }

      if (
        passwordData.newPassword.length <
        6
      ) {
        setPasswordMessage(
          "New password must be at least 6 characters."
        );
        return;
      }

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        setPasswordMessage(
          "New passwords do not match."
        );
        return;
      }

      try {
        setChangingPassword(true);
        setPasswordMessage("");

        await api.put(
          "/user/change-password",
          {
            currentPassword:
              passwordData.currentPassword,
            newPassword:
              passwordData.newPassword,
          }
        );

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setPasswordMessage(
          "Password changed successfully."
        );
      } catch (error) {
        setPasswordMessage(
          error.response?.data?.message ||
            "Failed to change password."
        );
      } finally {
        setChangingPassword(false);
      }
    };

  const togglePasswordVisibility = (
    field
  ) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]:
        !passwordVisibility[field],
    });
  };

  const inputClass =
    "w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3.5 text-slate-700 outline-none transition focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

  const passwordInputClass =
    "w-full border border-slate-200 bg-slate-50 rounded-2xl pl-4 pr-12 py-3.5 text-slate-700 outline-none transition focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50";

  return (
    <MainLayout>
      <div className="max-w-5xl space-y-8 pb-10">

        {/* HEADER */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600">
              <User size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Settings
              </h1>

              <p className="text-slate-500 mt-1">
                Manage your Kortex account and
                preferences.
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 to-white">
            <div className="flex items-center gap-4">

              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Profile
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update your basic account information.
                </p>
              </div>

            </div>
          </div>

          <div className="p-8">

            {/* PROFILE PHOTO */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">

              <div className="relative flex-shrink-0">

                <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-indigo-50">

                  {user?.profileImage ? (
                    <img
                      src={getProfileImageUrl()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {getUserInitial()}
                    </span>
                  )}

                </div>

                <label
                  htmlFor="profileImage"
                  className="
                    absolute
                    bottom-0
                    right-0
                    flex
                    items-center
                    justify-center
                    w-9
                    h-9
                    rounded-full
                    bg-indigo-600
                    text-white
                    border-4
                    border-white
                    cursor-pointer
                    shadow-md
                    hover:bg-indigo-700
                    transition
                  "
                  title="Change profile photo"
                >
                  <Camera size={16} />
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={
                    handleProfilePhotoChange
                  }
                  className="hidden"
                  disabled={uploadingPhoto}
                />

              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Profile Photo
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Upload a JPG, PNG, or WebP image.
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Maximum file size: 5 MB.
                </p>

                <label
                  htmlFor="profileImage"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    mt-3
                    px-4
                    py-2.5
                    rounded-xl
                    bg-indigo-50
                    text-indigo-700
                    font-semibold
                    text-sm
                    cursor-pointer
                    hover:bg-indigo-100
                    transition
                  "
                >
                  <Camera size={16} />

                  {uploadingPhoto
                    ? "Uploading..."
                    : "Change Photo"}
                </label>
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* NAME */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User size={15} />
                  Name
                </label>

                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Mail size={15} />
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </div>

            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-7">

              <button
                onClick={handleSave}
                disabled={savingProfile}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-gradient-to-r
                  from-indigo-600
                  to-violet-600
                  text-white
                  px-6
                  py-3
                  rounded-2xl
                  font-semibold
                  shadow-md
                  shadow-indigo-100
                  hover:shadow-lg
                  hover:-translate-y-0.5
                  transition-all
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  disabled:hover:translate-y-0
                "
              >
                <Save size={18} />

                {savingProfile
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              {profileMessage && (
                <div
                  className={`flex items-center gap-2 text-sm font-medium ${
                    profileMessage.includes(
                      "successfully"
                    )
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {profileMessage.includes(
                    "successfully"
                  ) && (
                    <CheckCircle2
                      size={17}
                    />
                  )}

                  {profileMessage}
                </div>
              )}

            </div>

          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-8">

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-violet-100 text-violet-600 flex-shrink-0">
                <Bell size={21} />
              </div>

              <div className="flex-1">

                <h2 className="text-xl font-bold text-slate-800">
                  Notifications
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Control study reminders and
                  notification preferences.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  handleNotificationToggle
                }
                aria-label="Toggle notifications"
                className={`
                  relative
                  flex-shrink-0
                  w-14
                  h-8
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    notifications
                      ? "bg-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-slate-300"
                  }
                `}
              >
                <span
                  className={`
                    absolute
                    top-1
                    w-6
                    h-6
                    bg-white
                    rounded-full
                    shadow-sm
                    transition-all
                    duration-300
                    ${
                      notifications
                        ? "left-7"
                        : "left-1"
                    }
                  `}
                />
              </button>

            </div>

            <div
              className={`
                mt-6
                rounded-2xl
                px-4
                py-3
                text-sm
                ${
                  notifications
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-slate-50 text-slate-500"
                }
              `}
            >
              {notifications
                ? "Study reminders and notifications are enabled."
                : "Study reminders and notifications are currently disabled."}
            </div>

          </div>
        </section>

        {/* SECURITY */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 to-white">

            <div className="flex items-center gap-4">

              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600">
                <Shield size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Account Security
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Keep your Kortex account secure.
                </p>
              </div>

            </div>

          </div>

          <div className="p-8">

            <div className="max-w-xl space-y-5">

              {/* CURRENT PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Password
                </label>

                <div className="relative">

                  <input
                    type={
                      passwordVisibility.current
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter your current password"
                    className={
                      passwordInputClass
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(
                        "current"
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {passwordVisibility.current ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      passwordVisibility.new
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter a new password"
                    className={
                      passwordInputClass
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(
                        "new"
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {passwordVisibility.new ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Password must be at least 6
                  characters.
                </p>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      passwordVisibility.confirm
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Confirm your new password"
                    className={
                      passwordInputClass
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      togglePasswordVisibility(
                        "confirm"
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {passwordVisibility.confirm ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>
              </div>

              {/* PASSWORD BUTTON + MESSAGE */}
              <div className="pt-2">

                <button
                  type="button"
                  onClick={
                    handleChangePassword
                  }
                  disabled={
                    changingPassword
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-emerald-600
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-semibold
                    shadow-md
                    shadow-emerald-100
                    hover:bg-emerald-700
                    hover:shadow-lg
                    hover:-translate-y-0.5
                    transition-all
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    disabled:hover:translate-y-0
                  "
                >
                  <Lock size={18} />

                  {changingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </button>

                {passwordMessage && (
                  <div
                    className={`flex items-center gap-2 text-sm font-medium mt-4 ${
                      passwordMessage.includes(
                        "successfully"
                      )
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {passwordMessage.includes(
                      "successfully"
                    ) && (
                      <CheckCircle2
                        size={17}
                      />
                    )}

                    {passwordMessage}
                  </div>
                )}

              </div>

            </div>

          </div>
        </section>

      </div>
    </MainLayout>
  );
}

export default Settings;