export const serviceCategories = [
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', description: 'Pipe repairs, leaks, installations', color: 'bg-blue-100 text-blue-700' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', description: 'Wiring, switches, appliance repairs', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', description: 'Deep cleaning, regular maintenance', color: 'bg-green-100 text-green-700' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚', description: 'Furniture repair, woodwork', color: 'bg-amber-100 text-amber-700' },
  { id: 'painting', name: 'Painting', icon: '🎨', description: 'Interior & exterior painting', color: 'bg-purple-100 text-purple-700' },
  { id: 'repairs', name: 'General Repairs', icon: '🔨', description: 'Appliance & home repairs', color: 'bg-red-100 text-red-700' },
];

export const mockWorkers = [
  { id: 'w1', name: 'Rajesh Kumar', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', rating: 4.8, distance: '1.2 km', experience: '8 years', priceRange: '₹300-500/hr', category: 'plumbing', verified: true, completedJobs: 342 },
  { id: 'w2', name: 'Amit Sharma', photo: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=100&h=100&fit=crop', rating: 4.6, distance: '2.5 km', experience: '5 years', priceRange: '₹250-400/hr', category: 'electrical', verified: true, completedJobs: 218 },
  { id: 'w3', name: 'Suresh Patel', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop', rating: 4.9, distance: '0.8 km', experience: '12 years', priceRange: '₹400-600/hr', category: 'carpentry', verified: true, completedJobs: 567 },
  { id: 'w4', name: 'Vikram Singh', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop', rating: 4.5, distance: '3.1 km', experience: '6 years', priceRange: '₹200-350/hr', category: 'painting', verified: true, completedJobs: 189 },
  { id: 'w5', name: 'Deepa Nair', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', rating: 4.7, distance: '1.8 km', experience: '4 years', priceRange: '₹250-400/hr', category: 'cleaning', verified: true, completedJobs: 156 },
  { id: 'w6', name: 'Manoj Tiwari', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', rating: 4.4, distance: '4.2 km', experience: '3 years', priceRange: '₹200-300/hr', category: 'repairs', verified: false, completedJobs: 98 },
];

export const mockBookings = [
  { id: 'b1', service: 'Plumbing', worker: 'Rajesh Kumar', date: '2026-08-25', time: '10:00 AM', status: 'completed', amount: '₹450' },
  { id: 'b2', service: 'Electrical', worker: 'Amit Sharma', date: '2026-08-27', time: '2:00 PM', status: 'in-progress', amount: '₹350' },
  { id: 'b3', service: 'Cleaning', worker: 'Deepa Nair', date: '2026-08-29', time: '9:00 AM', status: 'upcoming', amount: '₹300' },
];

export const mockJobRequests = [
  { id: 'j1', customer: 'Priya Sharma', service: 'Pipe Leak Repair', category: 'plumbing', location: 'Koramangala, Bangalore', date: '2026-08-28', time: '11:00 AM', budget: '₹400-500', description: 'Kitchen sink pipe is leaking badly' },
  { id: 'j2', customer: 'Anita Desai', service: 'Switch Replacement', category: 'electrical', location: 'Indiranagar, Bangalore', date: '2026-08-28', time: '3:00 PM', budget: '₹200-300', description: 'Need to replace 3 faulty switches in bedroom' },
  { id: 'j3', customer: 'Ravi Menon', service: 'Bathroom Deep Clean', category: 'cleaning', location: 'HSR Layout, Bangalore', date: '2026-08-29', time: '10:00 AM', budget: '₹500-700', description: '2 bathroom deep cleaning required' },
];

export const adminStats = {
  totalWorkers: 1247,
  activeBookings: 89,
  completedToday: 34,
  pendingVerifications: 12,
  totalRevenue: '₹2,45,670',
  disputesOpen: 3,
  serviceDistribution: [
    { name: 'Plumbing', count: 312, percentage: 25 },
    { name: 'Electrical', count: 249, percentage: 20 },
    { name: 'Cleaning', count: 224, percentage: 18 },
    { name: 'Carpentry', count: 187, percentage: 15 },
    { name: 'Painting', count: 150, percentage: 12 },
    { name: 'General Repairs', count: 125, percentage: 10 },
  ],
};

export const workerEarnings = {
  today: '₹1,250',
  thisWeek: '₹8,400',
  thisMonth: '₹32,500',
  totalJobs: 342,
  rating: 4.8,
  completionRate: '96%',
};

export const workerBadgeImages = [
  { src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', alt: 'Worker 1' },
  { src: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=100&h=100&fit=crop', alt: 'Worker 2' },
  { src: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop', alt: 'Worker 3' },
  { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop', alt: 'Worker 4' },
  { src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', alt: 'Worker 5' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', alt: 'Worker 6' },
  { src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop', alt: 'Worker 7' },
];
