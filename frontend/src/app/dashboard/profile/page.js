"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { User, Mail, Shield, Calendar, Save, Lock } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    api.get("/auth/profile").then((res) => {
      setUser(res.data);
      setFirstName(res.data.firstName || "");
      setLastName(res.data.lastName || "");
      setEmail(res.data.email || "");
    }).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/auth/profile", { firstName, lastName });
      setUser(res.data.user || res.data);
      addToast("Profile updated", "success");
    } catch (err) {
      addToast(err.response?.data?.message || err.message, "error");
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { addToast("Passwords don't match", "error"); return; }
    if (newPassword.length < 8) { addToast("Password must be at least 8 characters", "error"); return; }
    setChangingPassword(true);
    try {
      await api.patch("/auth/password", { currentPassword, newPassword });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      addToast("Password changed", "success");
    } catch (err) {
      addToast(err.response?.data?.message || err.message, "error");
    }
    setChangingPassword(false);
  };

  if (!user) return <div className="max-w-2xl mx-auto space-y-6">{[1, 2].map((i) => <div key={i} className="h-64 skeleton rounded-xl" />)}</div>;

  const roleLabels = { SUPER_ADMIN: "Super Admin", ORGANIZER: "Organizer", COUPLE: "Couple", GUEST: "Guest" };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-light text-deep-brown">Profile</h1>
        <p className="text-warm-gray text-sm mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="h-16 w-16 rounded-full bg-champagne flex items-center justify-center text-xl font-display text-deep-brown">
            {firstName[0]}{lastName[0]}
          </div>
          <div>
            <h2 className="font-display text-2xl text-deep-brown">{firstName} {lastName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs text-warm-gray"><Shield className="h-3 w-3" /> {roleLabels[user.role] || user.role}</span>
              <span className="text-xs text-warm-gray">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-warm-gray"><Calendar className="h-3 w-3" /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="font-medium text-deep-brown flex items-center gap-2"><User className="h-4 w-4" /> Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-deep-brown mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-gray" />
              <input type="email" value={email} disabled className="h-10 w-full pl-10 pr-4 rounded-lg border border-border bg-warm-white text-warm-gray text-sm cursor-not-allowed" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving}><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-border p-8">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h3 className="font-medium text-deep-brown flex items-center gap-2"><Lock className="h-4 w-4" /> Change Password</h3>
          <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="outline" loading={changingPassword}><Lock className="h-4 w-4 mr-2" /> Update Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
