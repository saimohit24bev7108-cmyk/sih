import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { serviceCategories } from '@/data/mockData';

export function WorkerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleRegister = async () => {
    try {
      const trimmedName = name.trim();
      if (!trimmedName || !email || !mobile || !password || !confirmPassword) {
        alert('Please complete all fields');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      await login('worker', { name: trimmedName, email, phone_number: mobile, password, role: 'worker' });
      navigate('/worker/dashboard');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4 py-8">
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
          <h1 className="text-2xl font-extrabold text-[hsl(var(--card-foreground))] text-center mb-2">Join as a Worker</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-6">Register to join the cooperative</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm transition-all duration-200 focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm transition-all duration-200 focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Mobile Number</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm transition-all duration-200 focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm transition-all duration-200 focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Skills / Categories</label>
              <div className="flex flex-wrap gap-2">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleSkill(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedSkills.includes(cat.id)
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                        : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--accent))]'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <motion.button
              onClick={handleRegister}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full py-3 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-opacity"
            >
              Register as Worker
            </motion.button>
          </div>

          <p className="text-sm text-center text-[hsl(var(--muted-foreground))] mt-6">
            Already registered?{' '}
            <Link to="/worker/login" className="text-[hsl(var(--primary))] font-semibold hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
