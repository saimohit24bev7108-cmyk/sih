import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Briefcase, Calendar, CheckCircle2, MapPin, ShieldCheck, Star, TrendingUp, UserCircle, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { mockJobRequests, workerEarnings, workerBadgeImages } from '@/data/mockData';
import { cardItemFade, getAdaptiveStagger, hoverLift, tapScale } from '@/lib/motion';

export function WorkerPlaceholder() {
  const location = useLocation();
  const currentPage = location.pathname.split('/').pop() || 'jobs';
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto overflow-x-hidden">
        {currentPage === 'jobs' && <JobsView reduceMotion={reduceMotion} />}
        {currentPage === 'earnings' && <EarningsView reduceMotion={reduceMotion} />}
        {currentPage === 'profile' && <ProfileView reduceMotion={reduceMotion} />}
      </div>
    </DashboardLayout>
  );
}

function JobsView({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-[hsl(var(--primary))] uppercase tracking-wide">Gig queue</p>
          <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mt-1">My Jobs</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available
        </div>
      </div>

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
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-xl">{job.category === 'plumbing' ? '🔧' : job.category === 'electrical' ? '⚡' : '🧹'}</span>
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--card-foreground))] text-lg">{job.service}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{job.customer}</p>
                  </div>
                </div>

                <p className="text-sm text-[hsl(var(--muted-foreground))]">{job.description}</p>

                <div className="flex flex-wrap gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="inline-flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                  <span className="inline-flex items-center gap-1"><Calendar size={12} />{job.date} · {job.time}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 shrink-0">
                <div className="rounded-xl bg-[hsl(var(--secondary))]/10 px-3 py-2 text-sm font-medium text-[hsl(var(--primary))]">
                  Budget: {job.budget}
                </div>
                <div className="flex gap-2">
                  <motion.button whileTap={reduceMotion ? undefined : tapScale} className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                    Accept
                  </motion.button>
                  <motion.button whileTap={reduceMotion ? undefined : tapScale} className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
                    Reject
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function EarningsView({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Earnings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Today's Earnings" value={workerEarnings.today} icon={<Wallet size={18} />} tone="green" />
        <MetricCard label="This Week" value={workerEarnings.thisWeek} icon={<TrendingUp size={18} />} tone="blue" />
        <MetricCard label="This Month" value={workerEarnings.thisMonth} icon={<Briefcase size={18} />} tone="violet" />
        <MetricCard label="Total Jobs" value={String(workerEarnings.totalJobs)} icon={<CheckCircle2 size={18} />} tone="amber" />
      </div>

      <motion.div whileHover={reduceMotion ? undefined : hoverLift} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4">Payout breakdown</h2>

        <div className="space-y-4">
          {[
            { label: 'Completed jobs', value: '₹6,750', detail: '12 jobs this week' },
            { label: 'Pending settlements', value: '₹1,200', detail: 'Due in 2 days' },
            { label: 'Referral bonus', value: '₹450', detail: '2 peer referrals' },
          ].map((entry) => (
            <div key={entry.label} className="flex items-center justify-between rounded-xl bg-[hsl(var(--secondary))]/5 px-4 py-3">
              <div>
                <p className="font-medium text-[hsl(var(--card-foreground))]">{entry.label}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{entry.detail}</p>
              </div>
              <span className="text-lg font-bold text-[hsl(var(--card-foreground))]">{entry.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ProfileView({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">Profile</h1>

      <motion.div whileHover={reduceMotion ? undefined : hoverLift} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img src={workerBadgeImages[0].src} alt="Worker profile" className="w-20 h-20 rounded-full object-cover ring-4 ring-[hsl(var(--primary))]/10" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[hsl(var(--card-foreground))]">Rajesh Kumar</h2>
              <ShieldCheck size={18} className="text-green-600" />
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Verified plumber · 8 years experience</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span>4.8 rating</span>
              <span>•</span>
              <span>342 jobs completed</span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--primary))] font-medium hover:bg-[hsl(var(--primary))]/5 transition-colors">
            Edit profile
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {['Pipe fitting', 'Leak repair', 'Bathroom fixtures', 'Water heater', 'Emergency service'].map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-full bg-[hsl(var(--secondary))]/10 text-[hsl(var(--primary))] text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-4">Availability</h3>
          <div className="space-y-3 text-sm text-[hsl(var(--muted-foreground))]">
            <div className="flex items-center justify-between rounded-xl bg-[hsl(var(--secondary))]/5 px-3 py-2">
              <span className="inline-flex items-center gap-2"><UserCircle size={16} /> Today</span>
              <span className="font-medium text-green-600">Open for jobs</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[hsl(var(--secondary))]/5 px-3 py-2">
              <span>Area coverage</span>
              <span className="font-medium text-[hsl(var(--card-foreground))]">Koramangala, HSR</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[hsl(var(--secondary))]/5 px-3 py-2">
              <span>Response time</span>
              <span className="font-medium text-[hsl(var(--card-foreground))]">Within 20 mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: 'green' | 'blue' | 'violet' | 'amber' }) {
  const toneClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${toneClasses[tone]}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-[hsl(var(--card-foreground))]">{value}</p>
    </div>
  );
}
