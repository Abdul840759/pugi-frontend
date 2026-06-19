import { useState, useRef } from 'react';
import { Camera, User, Mail, Lock, Sun, Moon, Monitor } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { userService } from '@/services/userService';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export function LearnerSettingsPage() {
  const { user, updateUser } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await userService.updateProfile({ name, email });
      updateUser({ name: updated.name, email: updated.email });
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await userService.changePassword({ oldPassword, newPassword });
      showToast('Password changed successfully', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be under 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadingAvatar(true);
      try {
        const result = await userService.uploadAvatar(base64);
        updateUser({ avatar: result.avatar });
        showToast('Avatar updated successfully', 'success');
      } catch (err: any) {
        showToast(err?.response?.data?.message || 'Failed to upload avatar', 'error');
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Avatar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={user?.avatar} name={user?.name} size="lg" />
            <button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Camera size={12} />
            </button>
          </div>
          <div>
            <Button onClick={handleAvatarClick} disabled={uploadingAvatar} variant="secondary">
              {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
            </Button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG. Max 2MB.</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User size={16} />}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />}
          />
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock size={16} />}
          />
          <Button type="submit" disabled={savingPassword}>
            {savingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors
                ${theme === value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }`}
            >
              <Icon size={20} className={theme === value ? 'text-blue-500' : 'text-gray-400'} />
              <span className={`text-sm font-medium ${theme === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
