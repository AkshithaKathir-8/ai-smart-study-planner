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
} from "lucide-react";

function Settings() {
  const { user, login } = useAuth();

  const [notifications, setNotifications] = useState(
    user?.notificationsEnabled ?? true
  );

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changingPassword, setChangingPassword] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/user/profile", {
        name: profile.name,
        email: profile.email,
      });

      const updatedUser = response.data.user;

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const rememberMe = !!localStorage.getItem("token");

      login(updatedUser, token, rememberMe);

      alert("Settings saved successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update settings."
      );
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      await api.put("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Password changed successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl space-y-8">

        {/* Header */}

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Settings
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your Kortex account and preferences.
          </p>
        </div>

        {/* Profile */}

        <div className="bg-white rounded-3xl border shadow-sm p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600">
              <User size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Profile
              </h2>

              <p className="text-sm text-slate-500">
                Update your basic information.
              </p>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name
              </label>

              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-slate-200
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-slate-200
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                "
              />
            </div>

          </div>

          <button
            onClick={handleSave}
            className="
              mt-6
              flex
              items-center
              gap-2
              bg-indigo-600
              text-white
              px-6
              py-3
              rounded-2xl
              font-semibold
              hover:bg-indigo-700
              transition
            "
          >
            <Save size={18} />
            Save Changes
          </button>

        </div>

        {/* Notifications */}

        <div className="bg-white rounded-3xl border shadow-sm p-8">

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-2xl bg-purple-100 text-purple-600">
              <Bell size={22} />
            </div>

            <div className="flex-1">

              <h2 className="text-xl font-bold text-slate-800">
                Notifications
              </h2>

              <p className="text-sm text-slate-500">
                Control study reminders and notifications.
              </p>

            </div>

            <button
              onClick={async () => {
                const newValue = !notifications;

                try {
                  setNotifications(newValue);

                  const response = await api.put(
                    "/user/profile",
                    {
                      name: profile.name,
                      email: profile.email,
                      notificationsEnabled: newValue,
                    }
                  );

                  const updatedUser =
                    response.data.user;

                  const token =
                    localStorage.getItem("token") ||
                    sessionStorage.getItem("token");

                  const rememberMe =
                    !!localStorage.getItem("token");

                  login(
                    updatedUser,
                    token,
                    rememberMe
                  );
                } catch (error) {
                  setNotifications(notifications);

                  alert(
                    error.response?.data?.message ||
                      "Failed to update notification settings."
                  );
                }
              }}
              className={`
                relative
                w-14
                h-8
                rounded-full
                transition
                ${
                  notifications
                    ? "bg-indigo-600"
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
                  transition
                  ${
                    notifications
                      ? "left-7"
                      : "left-1"
                  }
                `}
              />
            </button>

          </div>

        </div>

        {/* Account Security */}

        <div className="bg-white rounded-3xl border shadow-sm p-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
              <Shield size={22} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Account Security
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Change your password and keep your account secure.
              </p>

            </div>

          </div>

          <div className="space-y-5 max-w-xl">

            {/* Current Password */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                className="
                  w-full
                  border
                  border-slate-200
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              />
            </div>

            {/* New Password */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter a new password"
                className="
                  w-full
                  border
                  border-slate-200
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              />

              <p className="text-xs text-slate-400 mt-2">
                Password must be at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                className="
                  w-full
                  border
                  border-slate-200
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                "
              />
            </div>

            {/* Change Password Button */}

            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="
                flex
                items-center
                gap-2
                bg-emerald-600
                text-white
                px-6
                py-3
                rounded-2xl
                font-semibold
                hover:bg-emerald-700
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              <Lock size={18} />

              {changingPassword
                ? "Changing Password..."
                : "Change Password"}
            </button>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Settings;