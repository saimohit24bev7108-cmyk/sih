import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { adminStats } from '@/data/mockData';
import { cardContainerStagger, cardItemFade } from '@/lib/motion';
import { Users, CalendarCheck, CheckCircle, ShieldAlert, DollarSign, AlertTriangle } from 'lucide-react';

export function AdminDashboard() {
  const statCards = [
    {
      title: 'Total Workers',
      value: adminStats.totalWorkers,
      icon: <Users size={28} className="text-[hsl(var(--primary))]" />,
      trend: '+23 this week',
      trendUp: true,
    },
    {
      title: 'Active Bookings',
      value: adminStats.activeBookings,
      icon: <CalendarCheck size={28} className="text-amber-500" />,
    },
    {
      title: 'Completed Today',
      value: adminStats.completedToday,
      icon: <CheckCircle size={28} className="text-green-500" />,
      trend: '+5 from yesterday',
      trendUp: true,
    },
    {
      title: 'Pending Verifications',
      value: adminStats.pendingVerifications,
      icon: <ShieldAlert size={28} className="text-orange-500" />,
    },
    {
      title: 'Total Revenue',
      value: adminStats.totalRevenue,
      icon: <DollarSign size={28} className="text-green-600" />,
      trend: '+18% this month',
      trendUp: true,
    },
    {
      title: 'Open Disputes',
      value: adminStats.disputesOpen,
      icon: <AlertTriangle size={28} className="text-red-500" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={cardContainerStagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {statCards.map((stat) => (
            <motion.div key={stat.title} variants={cardItemFade}>
              <StatCard title={stat.title} value={stat.value} icon={stat.icon} trend={stat.trend} trendUp={stat.trendUp} />
            </motion.div>
          ))}
        </motion.div>

        {/* Service Distribution */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4">Service Distribution</h2>
          <div className="space-y-4">
            {adminStats.serviceDistribution.map((service) => (
              <div key={service.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[hsl(var(--card-foreground))] font-medium">{service.name}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">{service.count} workers ({service.percentage}%)</span>
                </div>
                <div className="h-2.5 bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[hsl(var(--primary))] rounded-full transition-all"
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
