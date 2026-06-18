import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, User, Mail, Send } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, sendPasswordlessLink, completePasswordlessSignIn } = useAuthStore();
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'link'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const handlePasswordless = async () => {
      const result = await completePasswordlessSignIn();
      if (result.success) {
        navigate('/admin/dashboard');
      } else if (result.error) {
        setError(result.error);
      }
    };
    handlePasswordless();
  }, [completePasswordlessSignIn, navigate]);

  const onSubmit = async (data) => {
    setError('');
    setInfo('');

    if (loginMethod === 'password') {
      if (!data.password) {
        setError('Password is required for this method');
        return;
      }
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } else {
      const result = await sendPasswordlessLink(data.email);
      if (result.success) {
        setInfo('Sign-in link sent to your email!');
      } else {
        setError(result.error || 'Failed to send sign-in link');
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md bg-white dark:bg-white/5"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
            <Lock className="text-orange-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold dark:text-white text-gray-900">Admin Access</h1>
          <p className="dark:text-white/50 text-gray-500 text-sm">Please sign in to manage your store</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-6 border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setLoginMethod('password')}
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'password' ? 'bg-white dark:bg-orange-500 shadow-md dark:text-white text-gray-900' : 'text-gray-400'}`}
          >
            Password
          </button>
          <button
            onClick={() => setLoginMethod('link')}
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${loginMethod === 'link' ? 'bg-white dark:bg-orange-500 shadow-md dark:text-white text-gray-900' : 'text-gray-400'}`}
          >
            Email Link
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          {info && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg text-sm text-center">
              {info}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" size={18} />
            <Input 
              {...register('email')}
              placeholder="Email"
              className="pl-12"
              error={errors.email?.message}
            />
          </div>

          {loginMethod === 'password' && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" size={18} />
              <Input
                {...register('password')}
                type="password"
                placeholder="Password"
                className="pl-12"
                error={errors.password?.message}
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full py-4 text-lg flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Processing...'
            ) : loginMethod === 'password' ? (
              <><Mail size={20} /> Sign In</>
            ) : (
              <><Send size={20} /> Send Magic Link</>
            )}
          </Button>
        </form>
        
        <p className="mt-8 text-center text-xs dark:text-white/20 text-gray-400">
          Secure encrypted access enabled
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
