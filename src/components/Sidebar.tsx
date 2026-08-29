import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';
import {
  LayoutDashboard, Wrench, CalendarCheck, Users, AlertTriangle,
  ShieldCheck, Briefcase, DollarSign, UserCircle, LogOut, Home
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

export function Sidebar() {
  const { role, userName, logout } = useAuth();
  const navigate = useNavigate();
  if (!role) return null;

  const items = navItems[role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] min-h-screen">
      <div className="p-6 border-b border-[hsl(var(--border))]">
        <NavLink to="/" className="flex items-center gap-2 text-[hsl(var(--primary))] font-bold text-xl">
          <Home size={24} />
          <span>FixFlow</span>
        </NavLink>
      </div>

      <div className="p-4 border-b border-[hsl(var(--border))]">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Logged in as</p>
        <p className="font-semibold text-[hsl(var(--card-foreground))]">{userName}</p>
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] capitalize">
          {role}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium'
                  : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[hsl(var(--border))]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[hsl(var(--destructive))] hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
