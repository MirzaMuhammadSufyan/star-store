import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = React.useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    const success = login(data.username, data.password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-premium-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-premium-purple/30">
            <Lock className="text-premium-purple" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-white/50 text-sm">Please sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <Input
              {...register('username')}
              placeholder="Username"
              className="pl-12"
              error={errors.username?.message}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <Input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="pl-12"
              error={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-4 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-white/20">
          Secure encrypted access enabled
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
