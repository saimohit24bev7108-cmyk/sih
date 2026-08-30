import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { serviceCategories } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';

const VIEWPORT = { once: true, amount: 0.2 } as const;

export function ServiceCategories() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto overflow-x-hidden">
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-2">Service Categories</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-8">Choose a category to find the right professional</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.38, delay: index * 0.1, ease: 'easeOut' }
              }
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              onClick={() => navigate(`/customer/service-request/${cat.id}`)}
              className="group flex items-start gap-4 p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-lg hover:border-[hsl(var(--primary))]/30 transition-all text-left"
            >
              <motion.div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${cat.color} shrink-0`}
                whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.08 }}
                transition={{ duration: 0.2 }}
              >
                {cat.icon}
              </motion.div>
              <div className="flex-1">
                <h3 className="font-semibold text-[hsl(var(--card-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{cat.description}</p>
              </div>
              <ArrowRight size={18} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] mt-1 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
