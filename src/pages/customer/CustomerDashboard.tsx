import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { serviceCategories, mockBookings } from '@/data/mockData';
import { getAdaptiveStagger, cardItemFade, tapScale, hoverLift } from '@/lib/motion';
import { CalendarCheck, Clock, CheckCircle, Search } from 'lucide-react';
import { useState } from 'react';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const reduceMotion = useReducedMotion();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Welcome back, Priya! 👋</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Active Bookings" value={1} icon={<Clock size={28} className="text-[hsl(var(--primary))]" />} />
          <StatCard title="Completed" value={12} icon={<CheckCircle size={28} className="text-green-500" />} />
          <StatCard title="Upcoming" value={2} icon={<CalendarCheck size={28} className="text-amber-500" />} />
        </div>

        {/* Problem Input */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 mb-8">
          <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-3">What do you need help with?</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe your problem... e.g. 'Kitchen sink is leaking'"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <motion.button
              whileTap={reduceMotion ? undefined : tapScale}
              whileHover={reduceMotion ? undefined : hoverLift}
              onClick={() => navigate('/customer/services')}
              className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shrink-0"
            >
              Find Help
            </motion.button>
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Service Categories</h2>
          <motion.div
            initial={reduceMotion ? false : 'initial'}
            animate={reduceMotion ? undefined : 'animate'}
            variants={getAdaptiveStagger(serviceCategories.length)}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
          >
            {serviceCategories.map((cat) => (
              <motion.button
                key={cat.id}
                variants={cardItemFade}
                whileTap={reduceMotion ? undefined : tapScale}
                whileHover={reduceMotion ? undefined : hoverLift}
                onClick={() => navigate(`/customer/service-request/${cat.id}`)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium text-[hsl(var(--card-foreground))]">{cat.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Recent Bookings */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Recent Bookings</h2>
          <motion.div
            initial={reduceMotion ? false : 'initial'}
            animate={reduceMotion ? undefined : 'animate'}
            variants={getAdaptiveStagger(mockBookings.length)}
            className="space-y-3"
          >
            {mockBookings.map((booking) => (
              <motion.div
                key={booking.id}
                variants={cardItemFade}
                whileHover={reduceMotion ? undefined : hoverLift}
                className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
              >
                <div>
                  <p className="font-medium text-[hsl(var(--card-foreground))]">{booking.service}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{booking.worker} · {booking.date} at {booking.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{booking.amount}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Track Current Service */}
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
          <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4">Track Current Service</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[hsl(var(--card-foreground))]">Electrical - Switch Replacement</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Amit Sharma is on the way · ETA: 15 mins</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                In Progress
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
