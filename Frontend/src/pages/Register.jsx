import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Lock,
  Mail,
  User,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Code2,
  KeyRound,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import authService from '../services/authService';
import {
  validateName,
  validateEmail,
  validateRegisterPassword,
  validateConfirmPassword,
  validateCurrentYear,
  validateTargetRole,
  validateCollege,
  validateGfgHandle,
  validateRegisterForm,
} from '../utils/validators';

export default function Register() {
  const [step, setStep] = useState('register'); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentYear, setCurrentYear] = useState('3');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [collegeName, setCollegeName] = useState('');
  const [gfgName, setGfgName] = useState('');

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const [otp, setOtp] = useState('');
  const [otpSentMsg, setOtpSentMsg] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateSingleField = (field, value, currentValues = {}) => {
    let err = null;
    switch (field) {
      case 'name':
        err = validateName(value);
        break;
      case 'email':
        err = validateEmail(value);
        break;
      case 'password':
        err = validateRegisterPassword(value);
        break;
      case 'confirmPassword':
        err = validateConfirmPassword(currentValues.password ?? password, value);
        break;
      case 'currentYear':
        err = validateCurrentYear(value);
        break;
      case 'targetRole':
        err = validateTargetRole(value);
        break;
      case 'college':
        err = validateCollege(value);
        break;
      case 'gfgHandle':
        err = validateGfgHandle(value);
        break;
      default:
        break;
    }

    setFieldErrors((prev) => {
      const updated = { ...prev };
      if (err) {
        updated[field] = err;
      } else {
        delete updated[field];
      }
      return updated;
    });

    return err;
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateSingleField(field, value);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      currentYear: true,
      targetRole: true,
      college: true,
      gfgHandle: true,
    });

    const validation = validateRegisterForm({
      name: username,
      email,
      password,
      confirmPassword,
      currentYear,
      targetRole,
      college: collegeName,
      gfgHandle: gfgName,
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);

    try {
      const payload = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        currentYear: Number(currentYear),
        targetRole: targetRole.trim() || 'Software Engineer',
        collegeName: collegeName.trim() || undefined,
        gfgName: gfgName.trim() || undefined,
      };

      const res = await authService.register(payload);
      setOtpSentMsg(res.message || 'OTP sent successfully to your email.');
      setStep('otp');
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError(
          'Cannot connect to the backend server. Please make sure your backend is running (default: http://localhost:5000) or check VITE_API_URL in .env.'
        );
      } else {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Registration failed. Please verify your details.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setError('');
    setLoading(true);

    try {
      await authService.verifyOtp(email.trim().toLowerCase(), otp.trim());
      setVerifiedSuccess(true);

      try {
        await authService.login(email.trim().toLowerCase(), password);
        setTimeout(() => {
          window.location.href = '/home';
        }, 1500);
      } catch {
        setTimeout(() => {
          navigate('/login', { state: { email: email.trim().toLowerCase(), verified: true } });
        }, 1500);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid or expired OTP. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        currentYear: Number(currentYear),
        targetRole: targetRole.trim() || 'Software Engineer',
        collegeName: collegeName.trim() || undefined,
        gfgName: gfgName.trim() || undefined,
      };
      const res = await authService.register(payload);
      setOtpSentMsg(res.message || 'New OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 font-sans py-12">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
            <Layers className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">PrepFlow</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {step === 'register'
              ? 'Create your account to start your preparation journey.'
              : 'Verify your email to activate your account.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-2xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {step === 'otp' ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            {otpSentMsg && (
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-2xl text-xs flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{otpSentMsg} (sent to <strong>{email}</strong>)</span>
              </div>
            )}

            {verifiedSuccess ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Account Verified Successfully!</p>
                  <p className="mt-0.5">Redirecting to your dashboard...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      autoFocus
                      maxLength={8}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base tracking-widest font-mono text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !otp.trim()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('register')}
                    className="text-slate-500 dark:text-slate-400 hover:underline cursor-pointer"
                  >
                    ← Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in duration-200">
            {/* Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUsername(val);
                      if (touched.name || fieldErrors.name) {
                        validateSingleField('name', val);
                      }
                    }}
                    onBlur={(e) => handleBlur('name', e.target.value)}
                    placeholder="Arjun Kumar"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      if (touched.email || fieldErrors.email) {
                        validateSingleField('email', val);
                      }
                    }}
                    onBlur={(e) => handleBlur('email', e.target.value)}
                    placeholder="arjun@example.com"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {fieldErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPassword(val);
                      if (touched.password || fieldErrors.password) {
                        validateSingleField('password', val);
                      }
                      if (touched.confirmPassword || fieldErrors.confirmPassword) {
                        validateSingleField('confirmPassword', confirmPassword, { password: val });
                      }
                    }}
                    onBlur={(e) => handleBlur('password', e.target.value)}
                    placeholder="Min 6 chars, 1 uppercase, 1 special"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
                  />
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfirmPassword(val);
                      if (touched.confirmPassword || fieldErrors.confirmPassword) {
                        validateSingleField('confirmPassword', val, { password });
                      }
                    }}
                    onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Current Year & Target Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current College Year <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={currentYear}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurrentYear(val);
                      if (touched.currentYear || fieldErrors.currentYear) {
                        validateSingleField('currentYear', val);
                      }
                    }}
                    onBlur={(e) => handleBlur('currentYear', e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.currentYear
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2`}
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                {fieldErrors.currentYear && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {fieldErrors.currentYear}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTargetRole(val);
                      if (touched.targetRole || fieldErrors.targetRole) {
                        validateSingleField('targetRole', val);
                      }
                    }}
                    onBlur={(e) => handleBlur('targetRole', e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.targetRole
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
                  />
                </div>
                {fieldErrors.targetRole && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {fieldErrors.targetRole}
                  </p>
                )}
              </div>
            </div>

            {/* College Name & GFG Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College / University <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCollegeName(val);
                    if (touched.college || fieldErrors.college) {
                      validateSingleField('college', val);
                    }
                  }}
                  onBlur={(e) => handleBlur('college', e.target.value)}
                  placeholder="e.g. IIT / NIT / DBIT"
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    fieldErrors.college
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                  } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
                />
                {fieldErrors.college && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {fieldErrors.college}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GFG Handle (Optional)
                </label>
                <div className="relative">
                  <Code2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={gfgName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGfgName(val);
                      if (touched.gfgHandle || fieldErrors.gfgHandle) {
                        validateSingleField('gfgHandle', val);
                      }
                    }}
                    onBlur={(e) => handleBlur('gfgHandle', e.target.value)}
                    placeholder="GFG username (if any)"
                    className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                      fieldErrors.gfgHandle
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                    } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
                  />
                </div>
                {fieldErrors.gfgHandle && (
                  <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                    <span>•</span> {fieldErrors.gfgHandle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Sending Verification Code...' : 'Create Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
