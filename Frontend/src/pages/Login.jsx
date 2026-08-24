import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, ArrowRight, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import profileService from '../services/profileService';
import { validateIdentifier, validateLoginPassword, validateLoginForm } from '../utils/validators';

export default function Login() {
  const location = useLocation();
  const [identifier, setIdentifier] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedSuccessMsg, setVerifiedSuccessMsg] = useState(
    location.state?.verified ? 'Email verified successfully! You can now log in.' : ''
  );

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateSingleField = (field, value) => {
    let err = null;
    if (field === 'identifier') {
      err = validateIdentifier(value);
    } else if (field === 'password') {
      err = validateLoginPassword(value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setVerifiedSuccessMsg('');

    setTouched({ identifier: true, password: true });

    const validation = validateLoginForm({ identifier, password });
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);

    try {
      const data = await authService.login(identifier.trim(), password);

      let fullUser = data.user || {
        email: identifier.includes('@') ? identifier : undefined,
        username: identifier,
      };
      try {
        const profileRes = await profileService.getProfile();
        if (profileRes.user) {
          fullUser = profileRes.user;
        }
      } catch (profErr) {
        console.warn('Profile fetch after login:', profErr);
      }

      login(fullUser, data.accessToken);
      navigate('/home');
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError(
          'Cannot connect to the backend server. Please make sure your backend is running (default: http://localhost:5000) or check VITE_API_URL in .env.'
        );
      } else {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Invalid credentials. Please check your username/email and password.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-sm">
            <Layers className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">PrepFlow</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Please enter your details.
          </p>
        </div>

        {verifiedSuccessMsg && (
          <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{verifiedSuccessMsg}</span>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-2xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => {
                  const val = e.target.value;
                  setIdentifier(val);
                  if (touched.identifier || fieldErrors.identifier) {
                    validateSingleField('identifier', val);
                  }
                }}
                onBlur={(e) => handleBlur('identifier', e.target.value)}
                placeholder="Enter username or email address"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                  fieldErrors.identifier
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-slate-900 transition-all`}
              />
            </div>
            {fieldErrors.identifier && (
              <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                <span>•</span> {fieldErrors.identifier}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  if (touched.password || fieldErrors.password) {
                    validateSingleField('password', val);
                  }
                }}
                onBlur={(e) => handleBlur('password', e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                  fieldErrors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                } rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-slate-900 transition-all`}
              />
            </div>
            {fieldErrors.password && (
              <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                <span>•</span> {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
