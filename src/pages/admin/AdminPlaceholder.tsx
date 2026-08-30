import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, CalendarCheck, CheckCircle2, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { adminStats, mockBookings, mockWorkers } from '@/data/mockData';
import { cardItemFade, getAdaptiveStagger, hoverLift } from '@/lib/motion';

export function AdminPlaceholder() {
  const location = useLocation();
  const currentPage = location.pathname.split('/').pop() || 'dashboard';
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto overflow-x-hidden">
        {currentPage === 'workers' && <WorkersView reduceMotion={reduceMotion} />}
        {currentPage === 'bookings' && <BookingsView reduceMotion={reduceMotion} />}
        {currentPage === 'disputes' && <DisputesView />}
        {currentPage === 'verifications' && <VerificationsView />}
        {currentPage === 'dashboard' && <DashboardView reduceMotion={reduceMotion} />}
      </div>
    </DashboardLayout>
  );
}

function DashboardView({ reduceMotion }: { reduceMotion: boolean }) {
  const statCards: Array<{ title: string; value: number; icon: React.ReactNode; tone: keyof typeof toneMap }> = [
    { title: 'Total Workers', value: adminStats.totalWorkers, icon: <Users size={18} />, tone: 'blue' },
    { title: 'Active Bookings', value: adminStats.activeBookings, icon: <CalendarCheck size={18} />, tone: 'amber' },
    { title: 'Completed Today', value: adminStats.completedToday, icon: <CheckCircle2 size={18} />, tone: 'green' },
    { title: 'Pending Verifications', value: adminStats.pendingVerifications, icon: <ShieldCheck size={18} />, tone: 'violet' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Admin Dashboard</h1>

      <motion.div initial="initial" animate="animate" variants={getAdaptiveStagger(statCards.length)} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <motion.div key={stat.title} variants={cardItemFade} whileHover={reduceMotion ? undefined : hoverLift} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{stat.title}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${toneMap[stat.tone]}`}>{stat.icon}</div>
            </div>
            <p className="text-2xl font-bold text-[hsl(var(--card-foreground))]">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4">Service Distribution</h2>
        <div className="space-y-4">
          {adminStats.serviceDistribution.map((service) => (
            <div key={service.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[hsl(var(--card-foreground))] font-medium">{service.name}</span>
                <span className="text-[hsl(var(--muted-foreground))]">{service.count} workers ({service.percentage}%)</span>
              </div>
              <div className="h-2.5 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                <div className="h-full bg-[hsl(var(--primary))] rounded-full transition-all" style={{ width: `${service.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkersView({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Workers</h1>
      <div className="space-y-4">
        {mockWorkers.map((worker, index) => (
          <motion.div key={worker.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: index * 0.04 }} whileHover={reduceMotion ? undefined : hoverLift} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={worker.photo} alt={worker.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[hsl(var(--card-foreground))]">{worker.name}</p>
                    {worker.verified && <ShieldCheck size={16} className="text-green-600" />}
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{worker.experience} experience · {worker.distance} away</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">⭐ {worker.rating}</span>
                <button className="px-3 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium">View profile</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BookingsView({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Bookings</h1>
      <motion.div initial="initial" animate="animate" variants={getAdaptiveStagger(mockBookings.length)} className="space-y-4">
        {mockBookings.map((booking) => (
          <motion.div key={booking.id} variants={cardItemFade} whileHover={reduceMotion ? undefined : hoverLift} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-[hsl(var(--card-foreground))]">{booking.service}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{booking.worker} · {booking.date} at {booking.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[hsl(var(--card-foreground))]">{booking.amount}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[booking.status] ?? 'bg-slate-100 text-slate-600'}`}>{booking.status}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function DisputesView() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Disputes</h1>
      <div className="space-y-4">
        {[
          { issue: 'Worker delayed without notice', customer: 'Priya Sharma', priority: 'High' },
          { issue: 'Billing discrepancy for electrical repair', customer: 'Amit Verma', priority: 'Medium' },
        ].map((item) => (
          <div key={item.issue} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-[hsl(var(--card-foreground))]">{item.issue}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Customer: {item.customer}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.priority}
                </span>
                <button className="px-3 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium">Review</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerificationsView() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Verifications</h1>
      <div className="space-y-4">
        {[
          { name: 'Rohit Mehta', role: 'Carpenter', status: 'Pending ID check' },
          { name: 'Neha Iyer', role: 'Cleaner', status: 'Background check cleared' },
        ].map((item) => (
          <div key={item.name} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-[hsl(var(--card-foreground))]">{item.name}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{item.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${item.status.includes('cleared') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {item.status.includes('cleared') ? <UserCheck size={12} /> : <AlertTriangle size={12} />}
                  {item.status}
                </span>
                <button className="px-3 py-2 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm font-medium">Inspect</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const toneMap = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  violet: 'bg-violet-50 text-violet-600',
};

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  upcoming: 'bg-amber-100 text-amber-700',
};
