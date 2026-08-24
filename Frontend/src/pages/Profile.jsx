import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Check,
  Pencil,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Code2,
  RefreshCw,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import UserAvatar from '../components/UserAvatar';
import profileService from '../services/profileService';
import settingService from '../services/settingService';

export default function Profile() {
  const { user, updateUser, reloadProfile } = useAuth();
  const { settings, updateConnectedAccount, gfgStats, reloadGfgStats } = useData();

  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || localStorage.getItem('prepflow_avatarUrl') || ''
  );
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState(
    user?.username || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User')
  );
  const [email, setEmail] = useState(user?.email || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || '');
  const [college, setCollege] = useState(user?.collegeName || user?.college || '');
  const [currentYear, setCurrentYear] = useState(user?.currentYear || '');

  useEffect(() => {
    if (user) {
      setFullName(user.username || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''));
      setEmail(user.email || '');
      setTargetRole(user.targetRole || '');
      setCollege(user.collegeName || user.college || '');
      setCurrentYear(user.currentYear || '');
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const [activeEditField, setActiveEditField] = useState(null);
  const [backupValue, setBackupValue] = useState('');
  const [savedFieldMsg, setSavedFieldMsg] = useState(null);
  const [fieldErrorMsg, setFieldErrorMsg] = useState(null);

  const [refreshingPlatform, setRefreshingPlatform] = useState(false);
  const currentGfgHandle = user?.gfgName || settings.connectedAccounts?.gfg?.username || '';
  const [gfgUsernameInput, setGfgUsernameInput] = useState(currentGfgHandle);
  const [isEditingGfg, setIsEditingGfg] = useState(false);
  const [cphSuccessMsg, setCphSuccessMsg] = useState('');

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const targetRoleRef = useRef(null);
  const collegeRef = useRef(null);
  const currentYearRef = useRef(null);

  useEffect(() => {
    if (activeEditField === 'fullName') fullNameRef.current?.focus();
    else if (activeEditField === 'email') emailRef.current?.focus();
    else if (activeEditField === 'targetRole') targetRoleRef.current?.focus();
    else if (activeEditField === 'college') collegeRef.current?.focus();
    else if (activeEditField === 'currentYear') currentYearRef.current?.focus();
  }, [activeEditField]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/i) && !file.type.startsWith('image/')) {
      alert('Please select a valid image file (.png, .jpg, .jpeg).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setAvatarUrl(dataUrl);
        localStorage.setItem('prepflow_avatarUrl', dataUrl);
        updateUser({ avatarUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = (fieldName, currentValue) => {
    setActiveEditField(fieldName);
    setBackupValue(currentValue);
    setFieldErrorMsg(null);
  };

  const handleCancelEdit = (fieldName) => {
    if (fieldName === 'fullName') setFullName(backupValue);
    else if (fieldName === 'email') setEmail(backupValue);
    else if (fieldName === 'targetRole') setTargetRole(backupValue);
    else if (fieldName === 'college') setCollege(backupValue);
    else if (fieldName === 'currentYear') setCurrentYear(backupValue);

    setActiveEditField(null);
    setBackupValue('');
    setFieldErrorMsg(null);
  };

  const handleSaveField = async (fieldName) => {
    setActiveEditField(null);
    setFieldErrorMsg(null);

    const payload = {};
    const localUserUpdate = {};

    if (fieldName === 'fullName') {
      const val = fullName.trim();
      payload.username = val;
      payload.name = val;
      payload.fullName = val;
      localUserUpdate.username = val;
      localUserUpdate.name = val;
    } else if (fieldName === 'targetRole') {
      const val = targetRole.trim();
      payload.targetRole = val;
      payload.role = val;
      payload.desiredRole = val;
      localUserUpdate.targetRole = val;
      localUserUpdate.role = val;
    } else if (fieldName === 'college') {
      const val = college.trim();
      payload.collegeName = val;
      payload.college = val;
      payload.university = val;
      localUserUpdate.collegeName = val;
      localUserUpdate.college = val;
    } else if (fieldName === 'currentYear') {
      const val = currentYear.trim();
      payload.currentYear = val;
      payload.year = val;
      localUserUpdate.currentYear = val;
      localUserUpdate.year = val;
    }

    try {
      const res = await profileService.updateProfile(payload);
      const updatedUser = res?.user || res?.data || res?.updatedUser || localUserUpdate;
      updateUser(updatedUser);
      await reloadProfile();
      setSavedFieldMsg(fieldName);
      setTimeout(() => setSavedFieldMsg(null), 2500);
    } catch (err) {
      console.error(`Failed to update ${fieldName}:`, err);
      setFieldErrorMsg(err?.response?.data?.message || err?.message || 'Failed to update profile');
      handleCancelEdit(fieldName);
    }
  };

  const handleRefreshCph = async () => {
    setRefreshingPlatform(true);
    try {
      await reloadGfgStats();
      setCphSuccessMsg('GFG statistics synced!');
      setTimeout(() => setCphSuccessMsg(''), 2500);
    } catch (e) {
      setCphSuccessMsg('Sync completed');
      setTimeout(() => setCphSuccessMsg(''), 2500);
    } finally {
      setRefreshingPlatform(false);
    }
  };

  const handleSaveGfgHandle = async () => {
    const handle = gfgUsernameInput.trim();
    if (!handle) return;
    try {
      const payload = {
        gfgName: handle,
        gfgUsername: handle,
        gfg: handle,
        geeksforgeeks: handle,
      };
      const res = await profileService.updateProfile(payload);
      const updatedUser = res?.user || res?.data || { gfgName: handle, gfgUsername: handle, gfg: handle };
      updateUser(updatedUser);
      await updateConnectedAccount('gfg', handle);
      setIsEditingGfg(false);
      setCphSuccessMsg('GeeksforGeeks handle updated!');
      setTimeout(() => setCphSuccessMsg(''), 2500);
    } catch (e) {
      console.error('Failed to update GFG handle:', e);
      setCphSuccessMsg(e?.response?.data?.message || 'Failed to update GFG handle');
    }
  };

  const [toastNotice, setToastNotice] = useState(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [pwError, setPwError] = useState('');
  const [pwSuccessMsg, setPwSuccessMsg] = useState('');
  const [isChangingPw, setIsChangingPw] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccessMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwError('All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('New password and confirm password do not match.');
      return;
    }

    try {
      setIsChangingPw(true);
      const res = await settingService.changePassword({
        oldPassword,
        newPassword,
      });

      setPwSuccessMsg(res.message || 'Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwSuccessMsg(''), 4500);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to update password. Please verify your current password.';
      setPwError(message);
    } finally {
      setIsChangingPw(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Toast Notification Banner */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium">{toastNotice}</span>
          <button
            onClick={() => setToastNotice(null)}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal details, connected coding handles, and security settings.
          </p>
        </div>

        <UserAvatar user={user} name={fullName} size="md" />
      </div>

      {fieldErrorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{fieldErrorMsg}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <Card className="p-6 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <UserAvatar
            user={user}
            name={fullName}
            size="2xl"
            className="ring-4 ring-slate-100 dark:ring-slate-800"
          />

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{fullName}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {targetRole || 'Software Engineer Candidate'} • {college || 'College not set'}
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Information Form Card */}
      <Card className="p-6 border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Personal Information</h3>

        <div className="space-y-4">
          {/* Full Name Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Username / Display Name
              </label>
              {savedFieldMsg === 'fullName' && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Updated
                </span>
              )}
            </div>
            <div className="relative">
              <input
                ref={fullNameRef}
                type="text"
                readOnly={activeEditField !== 'fullName'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveField('fullName');
                  if (e.key === 'Escape') handleCancelEdit('fullName');
                }}
                className={`w-full pl-4 pr-20 py-2.5 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 transition-all ${
                  activeEditField === 'fullName'
                    ? 'bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xs focus:outline-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 cursor-default'
                }`}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {activeEditField === 'fullName' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveField('fullName')}
                      className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                      title="Save"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelEdit('fullName')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartEdit('fullName', fullName)}
                    className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit field"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Email Field (Read Only) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address (Verified)
              </label>
            </div>
            <input
              ref={emailRef}
              type="email"
              readOnly
              value={email}
              className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Target Role Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Role
                </label>
                {savedFieldMsg === 'targetRole' && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Updated
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  ref={targetRoleRef}
                  type="text"
                  readOnly={activeEditField !== 'targetRole'}
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveField('targetRole');
                    if (e.key === 'Escape') handleCancelEdit('targetRole');
                  }}
                  placeholder="e.g. Software Engineer"
                  className={`w-full pl-4 pr-16 py-2.5 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 transition-all ${
                    activeEditField === 'targetRole'
                      ? 'bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xs focus:outline-none'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 cursor-default'
                  }`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {activeEditField === 'targetRole' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveField('targetRole')}
                        className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 cursor-pointer"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelEdit('targetRole')}
                        className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit('targetRole', targetRole)}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* College / University Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  College / University
                </label>
                {savedFieldMsg === 'college' && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Updated
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  ref={collegeRef}
                  type="text"
                  readOnly={activeEditField !== 'college'}
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveField('college');
                    if (e.key === 'Escape') handleCancelEdit('college');
                  }}
                  placeholder="e.g. ABC Institute"
                  className={`w-full pl-4 pr-16 py-2.5 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 transition-all ${
                    activeEditField === 'college'
                      ? 'bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xs focus:outline-none'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 cursor-default'
                  }`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {activeEditField === 'college' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveField('college')}
                        className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 cursor-pointer"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelEdit('college')}
                        className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit('college', college)}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Current Year */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Current Year
                </label>
                {savedFieldMsg === 'currentYear' && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Updated
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  ref={currentYearRef}
                  type="text"
                  readOnly={activeEditField !== 'currentYear'}
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveField('currentYear');
                    if (e.key === 'Escape') handleCancelEdit('currentYear');
                  }}
                  placeholder="e.g. 3rd Year"
                  className={`w-full pl-4 pr-16 py-2.5 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 transition-all ${
                    activeEditField === 'currentYear'
                      ? 'bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xs focus:outline-none'
                      : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 cursor-default'
                  }`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {activeEditField === 'currentYear' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveField('currentYear')}
                        className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 cursor-pointer"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelEdit('currentYear')}
                        className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit('currentYear', currentYear)}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Coding Accounts / Coding Platform Handles Section */}
      <Card className="p-6 space-y-4 border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Coding Platform Handles</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect your GeeksforGeeks (GFG) username to automatically sync your progress.
              </p>
            </div>
          </div>
          {cphSuccessMsg && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> {cphSuccessMsg}
            </span>
          )}
        </div>

        <div className="space-y-3 pt-1">
          {/* GeeksforGeeks Handle Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${currentGfgHandle ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">GeeksforGeeks</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentGfgHandle
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {currentGfgHandle ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Username: <strong className="text-slate-700 dark:text-slate-200">@{currentGfgHandle || 'not_set'}</strong> • {refreshingPlatform ? 'Syncing...' : 'Synced with backend'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditingGfg(!isEditingGfg)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{isEditingGfg ? 'Cancel' : 'Edit Handle'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRefreshCph}
                  disabled={refreshingPlatform}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingPlatform ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              </div>
            </div>

            {/* Inline edit form for GFG */}
            {isEditingGfg && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">@</span>
                  <input
                    type="text"
                    value={gfgUsernameInput}
                    onChange={(e) => setGfgUsernameInput(e.target.value)}
                    placeholder="Enter GeeksforGeeks handle (e.g. arjun_28)"
                    className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveGfgHandle}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Change Password Form Card */}
      <Card className="p-6 border-slate-200 dark:border-slate-800" id="change-password-section">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Change Password</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Ensure your account is protected with a secure password.
        </p>

        {/* Error Alert */}
        {pwError && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{pwError}</span>
          </div>
        )}

        {/* Success Alert */}
        {pwSuccessMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">{pwSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showOldPw ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  if (pwError) setPwError('');
                }}
                placeholder="Enter current password"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOldPw(!showOldPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showOldPw ? 'Hide password' : 'Show password'}
              >
                {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm Password side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (pwError) setPwError('');
                  }}
                  placeholder="At least 6 characters"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showNewPw ? 'Hide password' : 'Show password'}
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (pwError) setPwError('');
                  }}
                  placeholder="Re-enter new password"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showConfirmPw ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPw}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isChangingPw ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
