import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { mockWorkers } from '@/data/mockData';
import { ArrowLeft, Star, BadgeCheck, MapPin, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

export function BookingPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const worker = mockWorkers.find(w => w.id === workerId);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');

  if (!worker) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-lg text-[hsl(var(--muted-foreground))]">Worker not found.</p>
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-xl font-extrabold text-[hsl(var(--card-foreground))] mb-6">Book Service</h1>

          {/* Worker Summary */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-[hsl(var(--secondary))] mb-6">
            <img
              src={worker.photo}
              alt={worker.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[hsl(var(--border))]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{worker.name}</h3>
                {worker.verified && <BadgeCheck size={16} className="text-[hsl(var(--primary))]" />}
              </div>
              <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))] mt-1">
                <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /> {worker.rating}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {worker.distance}</span>
              </div>
              <p className="text-sm font-semibold text-[hsl(var(--primary))] mt-1">{worker.priceRange}</p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                <Calendar size={16} /> Preferred Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                <Clock size={16} /> Preferred Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                <MapPin size={16} /> Service Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
              />
            </div>

            <button
              onClick={() => {
                alert('Booking confirmed! (Demo only)');
                navigate('/customer/dashboard');
              }}
              className="w-full py-3.5 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-opacity"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
