import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { tapScale, hoverLift } from '@/lib/motion';

const BACKGROUNDS: Record<string, string> = {
  electrical: '/electric.png',
  plumbing: '/plumbing.png',
  painting: '/painting.png',
  carpentry: '/carpentry.png',
  cleaning: '/cleaning.png',
  repairs: '/repairs.png',
};

const SERVICE_INFO: Record<string, { name: string; description: string; includes: string[]; priceRange: string; icon: string; color: string; bg: string }> = {
  electrical: { name: 'Electrical', description: 'Safe wiring, repairs & installation from certified electricians.', includes: ['Wiring repairs', 'Switchboard installation', 'Fan/light fitting', 'Fault diagnosis'], priceRange: '₹250 – ₹1200', icon: '⚡', color: 'bg-yellow-400', bg: '/electric.jpg' },
  plumbing: { name: 'Plumbing', description: 'Leak fixes, pipe repairs & more from verified plumbers.', includes: ['Leak fixes', 'Pipe repairs', 'Tap installation', 'Drainage issues'], priceRange: '₹300 – ₹1500', icon: '💧', color: 'bg-blue-500', bg: '/plumbing.png' },
  painting: { name: 'Painting', description: 'Wall painting, texture & polish work by skilled painters.', includes: ['Interior painting', 'Texture work', 'Wall polish', 'Touch-ups'], priceRange: '₹400 – ₹2000', icon: '🖌️', color: 'bg-teal-500', bg: '/painting.png' },
  carpentry: { name: 'Carpentry', description: 'Furniture, fittings & woodwork by experienced carpenters.', includes: ['Furniture repair', 'Custom fittings', 'Door/window work', 'Woodwork'], priceRange: '₹350 – ₹1800', icon: '🪚', color: 'bg-blue-600', bg: '/carpentry.png' },
  cleaning: { name: 'Cleaning', description: 'Home, office & deep cleaning services.', includes: ['Deep cleaning', 'Kitchen cleaning', 'Bathroom cleaning', 'Move-in/out cleaning'], priceRange: '₹300 – ₹1200', icon: '🧹', color: 'bg-indigo-500', bg: '/cleaning.png' },
  repairs: { name: 'Appliances Repair', description: 'AC, fan, fridge & other appliance repairs.', includes: ['AC servicing', 'Fridge repair', 'Fan repair', 'Washing machine repair'], priceRange: '₹300 – ₹1500', icon: '⚙️', color: 'bg-blue-500', bg: '/repairs.png' },
};

export function ServiceOverview() {
  const { category = '' } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const reduceMotion = useReducedMotion();

  const service = SERVICE_INFO[category];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[hsl(var(--muted-foreground))]">Service not found.</p>
      </div>
    );
  }

  const handleRequestService = () => {
    if (isLoggedIn) {
      navigate(`/customer/service-request/${category}`);
    } else {
      navigate('/customer/login');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('${BACKGROUNDS[category]}')` }}
    >
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: 'easeOut' }}
        className="max-w-3xl px-6 py-16 ml-8 bg-white/90 rounded-2xl shadow-lg"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-black hover:opacity-70 mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${service.color}`}>
            {service.icon}
          </div>
          <h1 className="text-3xl font-extrabold text-black">{service.name}</h1>
        </div>
        <p className="text-black font-semibold mb-8">{service.description}</p>

        <div className="mb-8">
          <h2 className="font-bold text-black mb-3">What's included</h2>
          <ul className="grid grid-cols-2 gap-2">
            {service.includes.map((item, index) => (
              <motion.li
                key={item}
                initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.28, delay: index * 0.08, ease: 'easeOut' }
                }
                className="text-sm text-black font-semibold flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mb-10">
          <span className="text-sm text-black">Typical price range: </span>
          <span className="font-bold text-black">{service.priceRange}</span>
        </div>

        <motion.button
          onClick={handleRequestService}
          whileHover={reduceMotion ? undefined : hoverLift}
          whileTap={reduceMotion ? undefined : tapScale}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Request This Service <ArrowRight size={18} />
        </motion.button>
      </motion.section>
    </div>
  );
}