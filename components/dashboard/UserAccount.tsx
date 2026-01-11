import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User, Mail, Calendar, LogOut, Shield, Building2 } from 'lucide-react';

interface UserAccountProps {
  companyName?: string;
  onLogout: () => void;
}

const UserAccount: React.FC<UserAccountProps> = ({ companyName, onLogout }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    onLogout();
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
            <p className="text-slate-600">Manage your account information and preferences</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <User size={32} />
          </div>
        </div>
      </div>

      {/* User Information Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          Account Information
        </h2>

        <div className="space-y-6">
          {/* Profile Picture and Name */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}
              </h3>
              <p className="text-slate-600 mt-1">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
              <p className="text-lg text-slate-900 mt-1">{user?.emailAddresses[0]?.emailAddress || 'N/A'}</p>
              {user?.emailAddresses[0]?.verification?.status === 'verified' && (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          {/* Account Created */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Member Since</label>
              <p className="text-lg text-slate-900 mt-1">{formatDate(user?.createdAt)}</p>
            </div>
          </div>

          {/* Company */}
          {companyName && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Company</label>
                <p className="text-lg text-slate-900 mt-1">{companyName}</p>
              </div>
            </div>
          )}

          {/* User ID */}
          <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Shield className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wide">User ID</label>
              <p className="text-sm text-slate-600 mt-1 font-mono break-all">{user?.id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-red-200 bg-red-50/30">
        <h2 className="text-xl font-bold text-red-900 mb-4">Sign Out</h2>
        <p className="text-red-700 mb-6">
          Sign out of your account. You'll need to sign in again to access your dashboard.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
};

export default UserAccount;

