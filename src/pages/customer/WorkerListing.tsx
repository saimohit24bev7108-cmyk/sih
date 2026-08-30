import { motion, useReducedMotion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WorkerProfileCard } from '@/components/WorkerProfileCard';
import { mockWorkers, serviceCategories } from '@/data/mockData';
import { getAdaptiveStagger, cardItemFade } from '@/lib/motion';
import { ArrowLeft } from 'lucide-react';

export function WorkerListing() {
  const { category } = useParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const categoryData = serviceCategories.find(c => c.id === category);
  const workers = category ? mockWorkers.filter(w => w.category === category) : mockWorkers;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto overflow-x-hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-2">
          {categoryData ? `${categoryData.name} Workers` : 'Available Workers'}
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">
          {workers.length} worker{workers.length !== 1 ? 's' : ''} found near you
        </p>

        {workers.length > 0 ? (
          <motion.div
            initial={reduceMotion ? false : 'initial'}
            animate={reduceMotion ? undefined : 'animate'}
            variants={getAdaptiveStagger(workers.length)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {workers.map((worker) => (
              <motion.div key={worker.id} variants={cardItemFade}>
                <WorkerProfileCard {...worker} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-[hsl(var(--muted-foreground))]">No workers found for this category.</p>
            <button
              onClick={() => navigate('/customer/services')}
              className="mt-4 px-6 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Browse All Categories
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
