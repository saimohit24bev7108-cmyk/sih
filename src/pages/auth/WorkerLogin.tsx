import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Phone, Mail, ArrowLeft } from 'lucide-react';

export function WorkerLogin() {
  const [mode, setMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handlePasswordLogin = async () => {
    try {
      await login('worker', { email, password, role: 'worker' });
      navigate('/worker/dashboard');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: mobile, purpose: 'login' }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Could not send OTP');
      }
      navigate('/otp-verify/worker', { state: { phoneNumber: mobile } });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not send OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: 'easeOut' }}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8 shadow-sm"
        >
          <h1 className="text-2xl font-extrabold text-[hsl(var(--card-foreground))] text-center mb-2">Worker Login</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-6">Sign in to manage your jobs</p>

          <div className="flex rounded-lg bg-[hsl(var(--secondary))] p-1 mb-6">
            <button
              onClick={() => setMode('password')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'password'
                  ? 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm'
                  : 'text-[hsl(var(--muted-foreground))]'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setMode('otp')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'otp'
                  ? 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-sm'
                  : 'text-[hsl(var(--muted-foreground))]'
              }`}
            >
              OTP
            </button>
          </div>

          {mode === 'password' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Email or Mobile</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm transition-all duration-200 focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm transition-all duration-200 focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button className="text-xs text-[hsl(var(--primary))] hover:underline">Forgot Password?</button>
              </div>
              <motion.button
                onClick={handlePasswordLogin}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full py-3 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-opacity"
              >
                Login
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm transition-all duration-200 focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  />
                </div>
              </div>
              <motion.button
                onClick={handleSendOTP}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full py-3 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-opacity"
              >
                Send OTP
              </motion.button>
            </div>
          )}

          <p className="text-sm text-center text-[hsl(var(--muted-foreground))] mt-6">
            Don't have an account?{' '}
            <Link to="/worker/register" className="text-[hsl(var(--primary))] font-semibold hover:underline">Register</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
