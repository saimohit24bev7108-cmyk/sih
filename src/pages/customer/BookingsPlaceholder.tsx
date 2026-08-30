import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock3, MapPin, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { mockBookings } from '@/data/mockData';

const statusStyles: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  upcoming: 'bg-amber-100 text-amber-700',
};

export function BookingsPlaceholder() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wide">Service history</p>
            <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mt-1">My Bookings</h1>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium">
            Book a new service
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatTile label="Active" value="1" icon={<Clock3 size={18} />} tone="blue" />
          <StatTile label="Completed" value="12" icon={<CheckCircle2 size={18} />} tone="green" />
          <StatTile label="Total Spent" value="₹4,750" icon={<Wallet size={18} />} tone="purple" />
        </div>

        <div className="space-y-4">
          {mockBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.06 }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] text-xl">
                    {booking.service === 'Plumbing' ? '🔧' : booking.service === 'Electrical' ? '⚡' : '🧹'}
                  </div>
                  <div>
                    <p className="font-semibold text-[hsl(var(--card-foreground))] text-lg">{booking.service}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">with {booking.worker}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <span className="inline-flex items-center gap-1"><Calendar size={12} />{booking.date}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 size={12} />{booking.time}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={12} />Bangalore</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:justify-end">
                  <span className="text-base font-bold text-[hsl(var(--card-foreground))]">{booking.amount}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[booking.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatTile({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: 'blue' | 'green' | 'purple' }) {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
          <p className="text-2xl font-bold text-[hsl(var(--card-foreground))] mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneClasses[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
