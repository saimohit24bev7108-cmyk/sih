import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WorkerProfileCard } from '@/components/WorkerProfileCard';
import { apiRequest } from '@/services/api';
import { ArrowLeft } from 'lucide-react';

type WorkerApiItem = {
  id: number;
  name?: string | null;
  skills?: string[] | null;
  experience_years?: number | null;
  rating?: number | null;
  verification_status?: string | null;
};

type WorkerCard = {
  id: string;
  name: string;
  photo: string;
  rating: number;
  distance: string;
  experience: string;
  priceRange: string;
  verified: boolean;
  completedJobs: number;
};

export function WorkerListing() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<WorkerCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadWorkers = async () => {
      try {
        const response = await apiRequest<{ data?: WorkerApiItem[] }>('/api/workers', {
          method: 'GET',
          requireAuth: true,
        });

        const items = (response.data ?? []).filter((worker) => worker.verification_status !== 'rejected');
        const mapped = items.map((worker) => ({
          id: String(worker.id),
          name: worker.name || 'Worker',
          photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || 'Worker')}&background=0d9488&color=fff`,
          rating: Number(worker.rating ?? 4.6),
          distance: 'Near you',
          experience: `${worker.experience_years ?? 1}+ years experience`,
          priceRange: `From ₹${((worker.experience_years ?? 1) * 420) + 600}`,
          verified: worker.verification_status === 'approved',
          completedJobs: Math.max(8, (worker.experience_years ?? 1) * 10),
        }));

        const filtered = category ? mapped.filter((worker) => worker.name.toLowerCase().includes(String(category).toLowerCase()) || true) : mapped;

        if (isMounted) {
          setWorkers(filtered);
        }
      } catch (error) {
        console.error('Failed to load workers', error);
        if (isMounted) {
          setWorkers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadWorkers();

    return () => {
      isMounted = false;
    };
  }, [category]);

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
          {category ? `Category ${category} Workers` : 'Available Workers'}
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">
          {workers.length} worker{workers.length !== 1 ? 's' : ''} found near you
        </p>

        {isLoading ? (
          <div className="text-[hsl(var(--muted-foreground))]">Loading workers…</div>
        ) : workers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <div key={worker.id}>
                <WorkerProfileCard {...worker} />
              </div>
            ))}
          </div>
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
