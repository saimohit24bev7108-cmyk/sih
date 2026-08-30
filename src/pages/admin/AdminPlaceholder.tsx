import { useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Construction } from 'lucide-react';

export function AdminPlaceholder() {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop() || 'Page';

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto text-center py-20 overflow-x-hidden">
        <Construction size={64} className="mx-auto text-[hsl(var(--muted-foreground))] mb-6" />
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] capitalize mb-2">{pageName}</h1>
        <p className="text-[hsl(var(--muted-foreground))]">This section is under development. Check back in Layer 2!</p>
      </div>
    </DashboardLayout>
  );
}
