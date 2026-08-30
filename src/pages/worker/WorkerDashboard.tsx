import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { ImagesBadge } from '@/components/ui/images-badge';
import { mockJobRequests, workerEarnings, workerBadgeImages } from '@/data/mockData';
import { getAdaptiveStagger, cardItemFade, tapScale, hoverLift } from '@/lib/motion';
import { DollarSign, Star, TrendingUp, CheckCircle, MapPin, Calendar } from 'lucide-react';

export function WorkerDashboard() {
  const [available, setAvailable] = useState(true);
  const reduceMotion = useReducedMotion();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Worker Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[hsl(var(--muted-foreground))]">Availability</span>
            <motion.button
              whileTap={reduceMotion ? undefined : tapScale}
              whileHover={reduceMotion ? undefined : hoverLift}
              onClick={() => setAvailable(!available)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                available ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  available ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </motion.button>
            <span className={`text-sm font-medium ${available ? 'text-green-600' : 'text-gray-500'}`}>
              {available ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Cooperative Badge */}
        <div className="mb-6 flex justify-center sm:justify-start">
          <ImagesBadge
            images={workerBadgeImages}
            maxVisible={3}
            revealCount={2}
            label="326 Cooperative Members"
            size="md"
            shape="circle"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Today's Earnings" value={workerEarnings.today} icon={<DollarSign size={28} className="text-green-500" />} trend="+12% from yesterday" trendUp />
          <StatCard title="This Week" value={workerEarnings.thisWeek} icon={<TrendingUp size={28} className="text-[hsl(var(--primary))]" />} />
          <StatCard title="Rating" value={workerEarnings.rating} icon={<Star size={28} className="text-yellow-500" />} />
          <StatCard title="Completion Rate" value={workerEarnings.completionRate} icon={<CheckCircle size={28} className="text-green-500" />} />
        </div>

        {/* Earnings Summary */}
        <motion.div
          whileHover={reduceMotion ? undefined : hoverLift}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4">Earnings Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[hsl(var(--card-foreground))]">{workerEarnings.today}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Today</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[hsl(var(--card-foreground))]">{workerEarnings.thisWeek}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">This Week</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[hsl(var(--card-foreground))]">{workerEarnings.thisMonth}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">This Month</p>
            </div>
          </div>
        </motion.div>

        {/* Incoming Job Requests */}
        <div>
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Incoming Job Requests</h2>
          <motion.div
            initial={reduceMotion ? false : 'initial'}
            animate={reduceMotion ? undefined : 'animate'}
            variants={getAdaptiveStagger(mockJobRequests.length)}
            className="space-y-4"
          >
            {mockJobRequests.map((job) => (
              <motion.div
                key={job.id}
                variants={cardItemFade}
                whileHover={reduceMotion ? undefined : hoverLift}
                className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--card-foreground))]">{job.service}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{job.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />{job.date} at {job.time}</span>
                    </div>
                    <p className="text-sm font-medium text-[hsl(var(--primary))] mt-2">Budget: {job.budget}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <motion.button whileTap={reduceMotion ? undefined : tapScale} className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                      Accept
                    </motion.button>
                    <motion.button whileTap={reduceMotion ? undefined : tapScale} className="px-4 py-2 rounded-lg border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
                      Reject
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
