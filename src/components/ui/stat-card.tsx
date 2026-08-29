import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm',
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{title}</p>
          <p className="text-2xl font-bold mt-1 text-[hsl(var(--card-foreground))]">{value}</p>
          {trend && (
            <p className={cn('text-xs mt-1', trendUp ? 'text-green-600' : 'text-red-500')}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}
