import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { serviceCategories } from '@/data/mockData';
import { Upload, ArrowLeft } from 'lucide-react';

export function ServiceRequest() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const categoryData = serviceCategories.find(c => c.id === category);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            {categoryData && (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${categoryData.color}`}>
                {categoryData.icon}
              </div>
            )}
            <div>
              <h1 className="text-xl font-extrabold text-[hsl(var(--card-foreground))]">
                {categoryData?.name || 'Service'} Request
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {categoryData?.description}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Describe your problem
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us what's wrong in detail. The more you describe, the better we can match you with the right worker..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Upload Photos (optional)
              </label>
              <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center hover:border-[hsl(var(--primary))]/50 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-[hsl(var(--muted-foreground))] mb-2" />
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Click to upload or drag & drop</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/customer/workers/${category}`)}
              className="w-full py-3 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-opacity"
            >
              Continue — Find Workers
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
