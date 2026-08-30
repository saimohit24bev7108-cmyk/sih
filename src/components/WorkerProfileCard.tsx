import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tapScale, hoverLift } from '@/lib/motion';

interface WorkerProfileCardProps {
  id: string;
  name: string;
  photo: string;
  rating: number;
  distance: string;
  experience: string;
  priceRange: string;
  verified: boolean;
  completedJobs: number;
  className?: string;
}

export function WorkerProfileCard({
  id, name, photo, rating, distance, experience, priceRange, verified, completedJobs, className
}: WorkerProfileCardProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn(
      'rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm hover:shadow-md transition-shadow',
      className
    )}>
      <div className="flex items-start gap-4">
        <img
          src={photo}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[hsl(var(--border))]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[hsl(var(--card-foreground))] truncate">{name}</h3>
            {verified && (
              <BadgeCheck size={18} className="text-[hsl(var(--primary))] shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-[hsl(var(--muted-foreground))]">({completedJobs} jobs)</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="flex items-center gap-1"><MapPin size={12} />{distance}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{experience}</span>
          </div>
          <p className="text-sm font-semibold text-[hsl(var(--primary))] mt-2">{priceRange}</p>
        </div>
      </div>
      <motion.button
        whileTap={reduceMotion ? undefined : tapScale}
        whileHover={reduceMotion ? undefined : hoverLift}
        onClick={() => navigate(`/customer/booking/${id}`)}
        className="w-full mt-4 py-2.5 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Book Now
      </motion.button>
    </div>
  );
}
