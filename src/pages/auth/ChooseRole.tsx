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
  const topRoles = roles.filter(role => role.id !== 'admin');
  const adminRole = mode === 'login' ? LOGIN_ROLES.find(role => role.id === 'admin') : undefined;

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
      <div className="flex-1 w-full px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center">
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 leading-tight">
              {mode === 'login' ? 'Log in as' : 'Register as'}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600">
              {mode === 'login' ? 'Choose your role to continue' : 'Select how you want to join FixFlow'}
            </p>
          </div>

          <div className="w-full flex justify-center">
            <div className="grid w-full max-w-[760px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              {topRoles.map((role, index) => (
                <motion.button
                  key={role.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.32, delay: index * 0.08, ease: 'easeOut' }
                  }
                  whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  onClick={() => handleRoleSelect(role.path, role.id)}
                  className={`group flex h-full min-h-[220px] w-full max-w-[330px] flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition-all justify-self-center ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,0.08)]'
                      : 'border-blue-100 bg-blue-50/50 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <motion.div
                    className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                      selectedRole === role.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                    whileHover={reduceMotion ? undefined : { rotate: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {role.icon}
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-blue-900">{role.label}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{role.desc}</p>
                  </div>
                </motion.button>
              ))}

              {adminRole && (
                <motion.button
                  key={adminRole.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.32, delay: topRoles.length * 0.08, ease: 'easeOut' }
                  }
                  whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  onClick={() => handleRoleSelect(adminRole.path, adminRole.id)}
                  className={`group flex h-full min-h-[220px] w-full max-w-[330px] flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition-all justify-self-center md:col-span-2 ${
                    selectedRole === adminRole.id
                      ? 'border-blue-500 bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,0.08)]'
                      : 'border-blue-100 bg-blue-50/50 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <motion.div
                    className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                      selectedRole === adminRole.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                    }`}
                    whileHover={reduceMotion ? undefined : { rotate: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {adminRole.icon}
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-blue-900">{adminRole.label}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{adminRole.desc}</p>
                  </div>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
