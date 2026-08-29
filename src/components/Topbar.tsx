import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';
import {
  LayoutDashboard, Wrench, CalendarCheck, Users, AlertTriangle,
  ShieldCheck, Briefcase, DollarSign, UserCircle, LogOut, Home, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems: Record<UserRole, { label: string; path: string; icon: React.ReactNode }[]> = {
  customer: [
    { label: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Services', path: '/customer/services', icon: <Wrench size={20} /> },
    { label: 'My Bookings', path: '/customer/bookings', icon: <CalendarCheck size={20} /> },
  ],
  worker: [
    { label: 'Dashboard', path: '/worker/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'My Jobs', path: '/worker/jobs', icon: <Briefcase size={20} /> },
    { label: 'Earnings', path: '/worker/earnings', icon: <DollarSign size={20} /> },
    { label: 'Profile', path: '/worker/profile', icon: <UserCircle size={20} /> },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Workers', path: '/admin/workers', icon: <Users size={20} /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { label: 'Disputes', path: '/admin/disputes', icon: <AlertTriangle size={20} /> },
    { label: 'Verifications', path: '/admin/verifications', icon: <ShieldCheck size={20} /> },
  ],
};

export function Topbar() {
  const { role, userName, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (!role) return null;

  const items = navItems[role];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <>
      <header className="md:hidden flex items-center justify-between p-4 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]">
        <NavLink to="/" className="flex items-center gap-2 text-[hsl(var(--primary))] font-bold text-lg">
          <Home size={22} />
          FixFlow
        </NavLink>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] capitalize">
            {role}
          </span>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[hsl(var(--foreground))]">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] p-4 space-y-1">
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Hello, {userName}</p>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[hsl(var(--destructive))] hover:bg-red-50 w-full transition-colors mt-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </>
  );
}
