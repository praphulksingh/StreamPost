import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/user.service";
import { FiSettings, FiCamera, FiLock, FiUser } from "react-icons/fi";

const Settings = () => {
  const { user } = useAuth();
  
  // States for loaders and messages
  const [loading, setLoading] = useState({ info: false, password: false, avatar: false, cover: false });
  const [messages, setMessages] = useState({ info: "", password: "", images: "" });

  // Forms
  const { register: regInfo, handleSubmit: submitInfo } = useForm({
    defaultValues: { fullName: user?.fullName, email: user?.email }
  });
  const { register: regPass, handleSubmit: submitPass, reset: resetPass } = useForm();

  const handleUpdateInfo = async (data) => {
    setLoading({ ...loading, info: true });
    try {
      await userService.updateAccountDetails(data);
      setMessages({ ...messages, info: "Profile updated successfully! Refresh to see changes globally." });
    } catch (err) {
      setMessages({ ...messages, info: err.response?.data?.message || "Update failed." });
    } finally {
      setLoading({ ...loading, info: false });
    }
  };

  const handleChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setMessages({ ...messages, password: "New passwords do not match." });
      return;
    }
    setLoading({ ...loading, password: true });
    try {
      await userService.changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword });
      setMessages({ ...messages, password: "Password changed successfully!" });
      resetPass();
    } catch (err) {
      setMessages({ ...messages, password: err.response?.data?.message || "Failed to change password." });
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    setLoading({ ...loading, [type]: true });
    setMessages({ ...messages, images: `Uploading new ${type}...` });

    try {
      if (type === "avatar") {
        formData.append("avatar", file);
        await userService.updateAvatar(formData);
      } else {
        formData.append("coverImage", file);
        await userService.updateCoverImage(formData);
      }
      setMessages({ ...messages, images: `${type} updated successfully! Refresh to see changes.` });
    } catch (err) {
      setMessages({ ...messages, images: `Failed to upload ${type}.` });
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4">
      <div className="flex items-center gap-3 mb-8 border-b border-brand-secondary pb-4 mt-6">
        <FiSettings className="text-3xl text-brand-accent" />
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* --- IMAGE UPLOADS --- */}
        <section className="bg-brand-secondary/20 border border-brand-secondary rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FiCamera /> Channel Images</h2>
          {messages.images && <p className="text-brand-accent text-sm mb-4">{messages.images}</p>}
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-text mb-2">Update Avatar</label>
              <div className="flex items-center gap-4">
                <img src={user?.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "avatar")} disabled={loading.avatar}
                  className="text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-secondary file:text-white hover:file:bg-brand-accent cursor-pointer" />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-brand-text mb-2">Update Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "cover")} disabled={loading.cover}
                className="text-sm text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-secondary file:text-white hover:file:bg-brand-accent cursor-pointer w-full" />
            </div>
          </div>
        </section>

        {/* --- PERSONAL INFO --- */}
        <section className="bg-brand-secondary/20 border border-brand-secondary rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FiUser /> Personal Information</h2>
          {messages.info && <p className="text-brand-accent text-sm mb-4">{messages.info}</p>}
          
          <form onSubmit={submitInfo(handleUpdateInfo)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Full Name</label>
              <input {...regInfo("fullName", { required: true })} className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Email</label>
              <input type="email" {...regInfo("email", { required: true })} className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent" />
            </div>
            <button type="submit" disabled={loading.info} className="bg-brand-secondary hover:bg-white/10 text-white font-medium px-6 py-2 rounded-lg transition-colors">
              {loading.info ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* --- CHANGE PASSWORD --- */}
        <section className="bg-brand-secondary/20 border border-brand-secondary rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FiLock /> Change Password</h2>
          {messages.password && <p className="text-brand-accent text-sm mb-4">{messages.password}</p>}
          
          <form onSubmit={submitPass(handleChangePassword)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Current Password</label>
              <input type="password" {...regPass("oldPassword", { required: true })} className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">New Password</label>
              <input type="password" {...regPass("newPassword", { required: true })} className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Confirm New Password</label>
              <input type="password" {...regPass("confirmPassword", { required: true })} className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 text-white outline-none focus:border-brand-accent" />
            </div>
            <button type="submit" disabled={loading.password} className="bg-brand-accent hover:bg-opacity-90 text-white font-medium px-6 py-2 rounded-lg transition-colors">
              {loading.password ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

      </div>
    </div>
  );
};

export default Settings;