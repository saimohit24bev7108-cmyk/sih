import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Users, Wrench, Shield } from 'lucide-react';
import { useState } from 'react';

interface ChooseRoleProps {
  mode: 'login' | 'register';
}

const LOGIN_ROLES = [
  { id: 'customer', label: 'Customer', desc: 'Book and manage home services', icon: <Users size={28} />, path: '/customer/login' },
  { id: 'worker', label: 'Worker', desc: 'Accept jobs and manage earnings', icon: <Wrench size={28} />, path: '/worker/login' },
  { id: 'admin', label: 'Admin', desc: 'Manage platform operations', icon: <Shield size={28} />, path: '/admin/login' },
];

const REGISTER_ROLES = [
  { id: 'customer', label: 'Customer', desc: 'Book and manage home services', icon: <Users size={28} />, path: '/customer/register' },
  { id: 'worker', label: 'Worker', desc: 'Join the cooperative and grow', icon: <Wrench size={28} />, path: '/worker/register' },
];

export function ChooseRole({ mode }: ChooseRoleProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const preselectedRole = searchParams.get('role');
  const roles = mode === 'login' ? LOGIN_ROLES : REGISTER_ROLES;

  if (preselectedRole) {
    const match = roles.find(r => r.id === preselectedRole);
    if (match) {
      setTimeout(() => navigate(match.path, { replace: true }), 0);
      return null;
    }
  }

  const handleRoleSelect = (rolePath: string, roleId: string) => {
    setSelectedRole(roleId);
    window.setTimeout(() => navigate(rolePath), 180);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-blue-900 text-center mb-2">
            {mode === 'login' ? 'Log in as' : 'Register as'}
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            {mode === 'login' ? 'Choose your role to continue' : 'Select how you want to join FixFlow'}
          </p>
          <div className="flex flex-col gap-4">
            {roles.map((role, index) => (
              <motion.button
                key={role.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.32, delay: index * 0.08, ease: 'easeOut' }
                }
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => handleRoleSelect(role.path, role.id)}
                className={`flex items-center gap-4 w-full p-5 rounded-xl border-2 text-left group transition-all ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,0.08)]'
                    : 'border-blue-100 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <motion.div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    selectedRole === role.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                  }`}
                  whileHover={reduceMotion ? undefined : { rotate: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {role.icon}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-blue-900">{role.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{role.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
