import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, User, Mail, Send, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

const NOT_ADMIN_MSG =
  'This account signed in successfully but is not authorised for admin access. ' +
  'Add your email to VITE_ADMIN_EMAILS and rebuild, or set the Firebase custom claim admin: true.';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, logout, sendPasswordlessLink, completePasswordlessSignIn, isAuthenticated, isAdmin, loading } = useAuthStore();
  const [error, setError]             = useState('');
  const [info, setInfo]               = useState('');
  const [loginMethod, setLoginMethod] = useState('password');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Already signed in as admin — skip the form.
  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [loading, isAuthenticated, isAdmin, navigate]);

  useEffect(() => {
    const handlePasswordless = async () => {
      const result = await completePasswordlessSignIn();
      if (result.success && result.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (result.success && !result.isAdmin) {
        setError(NOT_ADMIN_MSG);
        await logout();
      } else if (result.error) {
        setError(result.error);
      }
    };
    handlePasswordless();
  }, [completePasswordlessSignIn, logout, navigate]);

  const onSubmit = async (data) => {
    setError('');
    setInfo('');
    if (loginMethod === 'password') {
      if (!data.password) { setError('Password is required'); return; }
      const result = await login(data.email, data.password);
      if (result.success && result.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else if (result.success && !result.isAdmin) {
        setError(NOT_ADMIN_MSG);
        await logout();
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } else {
      const result = await sendPasswordlessLink(data.email);
      if (result.success) setInfo('Sign-in link sent to your email!');
      else setError(result.error || 'Failed to send sign-in link');
    }
  };

  if (loading) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-canvas min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock size={26} className="text-amber-700" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Access</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your store</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-card space-y-6">
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            {['password', 'link'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setLoginMethod(m)}
                className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${
                  loginMethod === m ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {m === 'password' ? 'Password' : 'Email Link'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {info && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">
                {info}
              </div>
            )}

            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                {...register('email')}
                placeholder="admin@starstore.com"
                className="pl-9"
                error={errors.email?.message}
              />
            </div>

            {loginMethod === 'password' && (
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className="pl-9"
                  error={errors.password?.message}
                />
              </div>
            )}

            <Button type="submit" variant="accent" size="lg" className="w-full gap-2 mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Processing…' :
                loginMethod === 'password'
                  ? <><Mail size={16} /> Sign In</>
                  : <><Send size={16} /> Send Magic Link</>
              }
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
          <Lock size={11} /> Secure encrypted admin access
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
