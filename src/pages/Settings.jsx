import { useState } from "react";
import GlassCard from "../components/common/GlassCard";
import { useAuth } from "../context/AuthContext";
import { 
  User, Lock, Bell, Moon, Globe, CreditCard, 
  Save, Edit2, Shield, Mail, Phone, MapPin
} from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: user?.name || "David Rodriguez",
    email: user?.email || "david.rodriguez@example.com",
    phone: "+1 234 567 8903",
    address: "123 Delivery St, New York, NY 10001",
    role: user?.role || "driver",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    routeOptimizations: true,
    marketingEmails: false,
  });
  const [appearance, setAppearance] = useState({
    theme: "dark",
    compactMode: false,
    animations: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profileData);

  const handleSaveProfile = () => {
    setProfileData(tempProfile);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "security", label: "Security", icon: <Lock size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { id: "appearance", label: "Appearance", icon: <Moon size={16} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <span className="text-sm text-gray-400">{user?.role === "admin" ? "Admin" : "Driver"} Settings</span>
      </div>

      {/* Settings Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setTempProfile(profileData);
                }}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-lg hover:bg-green-500/30 transition"
              >
                <Save size={16} />
                Save Changes
              </button>
            )}
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {profileData.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{profileData.name}</h3>
              <p className="text-sm text-gray-400 capitalize">{profileData.role} Portal</p>
              <p className="text-xs text-gray-500">Member since 2024</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-white">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white">{profileData.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempProfile.phone}
                    onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white">{profileData.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.address}
                    onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-white">{profileData.address}</p>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-400">Update your password regularly for security</p>
                </div>
                <button className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition">
                  Change
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition">
                  Enable
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Active Sessions</h3>
                  <p className="text-sm text-gray-400">Manage devices where you're logged in</p>
                </div>
                <button className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500/30 transition">
                  View
                </button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Notifications Settings */}
      {activeTab === "notifications" && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">Receive updates via email</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                className={`w-12 h-6 rounded-full transition-all ${
                  notifications.emailNotifications ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all mt-0.5 ${
                  notifications.emailNotifications ? "translate-x-6" : "translate-x-0.5"
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-400">Real-time alerts on your device</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, pushNotifications: !notifications.pushNotifications })}
                className={`w-12 h-6 rounded-full transition-all ${
                  notifications.pushNotifications ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all mt-0.5 ${
                  notifications.pushNotifications ? "translate-x-6" : "translate-x-0.5"
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Order Updates</h3>
                <p className="text-sm text-gray-400">New orders and status changes</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, orderUpdates: !notifications.orderUpdates })}
                className={`w-12 h-6 rounded-full transition-all ${
                  notifications.orderUpdates ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all mt-0.5 ${
                  notifications.orderUpdates ? "translate-x-6" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Appearance Settings */}
      {activeTab === "appearance" && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
              <div className="flex gap-3">
                {["dark", "light", "system"].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setAppearance({ ...appearance, theme })}
                    className={`px-4 py-2 rounded-lg capitalize transition ${
                      appearance.theme === theme
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium">Compact Mode</h3>
                <p className="text-sm text-gray-400">Reduce spacing for more content</p>
              </div>
              <button
                onClick={() => setAppearance({ ...appearance, compactMode: !appearance.compactMode })}
                className={`w-12 h-6 rounded-full transition-all ${
                  appearance.compactMode ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all mt-0.5 ${
                  appearance.compactMode ? "translate-x-6" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Billing Settings */}
      {activeTab === "billing" && (
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-6">Billing & Payment</h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-medium">Current Plan</h3>
              <p className="text-2xl font-bold mt-2">Professional</p>
              <p className="text-sm text-gray-400">$49/month</p>
              <button className="mt-3 text-blue-400 hover:text-blue-300">Upgrade Plan →</button>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-medium">Payment Method</h3>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <CreditCard size={20} />
                  <span>•••• •••• •••• 4242</span>
                </div>
                <button className="text-blue-400 text-sm">Edit</button>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="font-medium">Billing History</h3>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span>March 2024</span>
                  <span>$49.00</span>
                  <span className="text-green-400">Paid</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>February 2024</span>
                  <span>$49.00</span>
                  <span className="text-green-400">Paid</span>
                </div>
              </div>
              <button className="mt-3 text-blue-400 text-sm">View All →</button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Settings;