import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";
import { User, Bell, Shield, Save } from "lucide-react";

function Settings() {
  const { user, login } = useAuth();

const [notifications, setNotifications] = useState(
  user?.notificationsEnabled ?? true
);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
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

    const response = await api.put("/user/profile", {
      name: profile.name,
      email: profile.email,
      notificationsEnabled: newValue,
    });

    const updatedUser = response.data.user;

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const rememberMe = !!localStorage.getItem("token");

    login(updatedUser, token, rememberMe);
  } catch (error) {
    setNotifications(notifications);

    alert(
      error.response?.data?.message ||
        "Failed to update notification settings."
    );
  }
}}              className={`
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


        {/* Security */}

        <div className="bg-white rounded-3xl border shadow-sm p-8">

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
              <Shield size={22} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Account Security
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your Kortex account is protected using authentication.
              </p>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Settings;