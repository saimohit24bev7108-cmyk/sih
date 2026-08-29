import { DashboardLayout } from '@/components/DashboardLayout';
import { mockBookings } from '@/data/mockData';

export function BookingsPlaceholder() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-6">My Bookings</h1>
        <div className="space-y-3">
          {mockBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            >
              <div>
                <p className="font-medium text-[hsl(var(--card-foreground))]">{booking.service}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{booking.worker} · {booking.date} at {booking.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{booking.amount}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
