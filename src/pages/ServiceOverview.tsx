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
      <div className="min-h-screen flex items-center justify-center overflow-x-hidden">
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
      className="min-h-screen overflow-x-hidden bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.08), rgba(0,0,0,0.06)), url('${BACKGROUNDS[category]}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="min-h-screen px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-14 flex items-center justify-start">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[820px] rounded-[32px] bg-white/75 backdrop-blur-[2px] shadow-[0_30px_80px_rgba(15,23,42,0.18)] px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-12 xl:py-14"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-black hover:opacity-70 mb-7"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md ${service.color}`}>
              {service.icon}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold text-black leading-[0.95] tracking-[-0.04em]">
              {service.name}
            </h1>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-black font-medium leading-snug mb-8 max-w-[620px]">
            {service.description}
          </p>

          <div className="mb-8">
            <h2 className="font-bold text-2xl sm:text-3xl text-black mb-4">What's included</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-[620px]">
              {service.includes.map((item, index) => (
                <motion.li
                  key={item}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.28, delay: index * 0.08, ease: 'easeOut' }
                  }
                  className="text-base sm:text-lg text-black font-semibold flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="mb-10">
            <span className="text-lg sm:text-xl text-black">Typical price range: </span>
            <span className="text-lg sm:text-xl font-extrabold text-black">{service.priceRange}</span>
          </div>

          <motion.button
            onClick={handleRequestService}
            whileHover={reduceMotion ? undefined : hoverLift}
            whileTap={reduceMotion ? undefined : tapScale}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl text-lg sm:text-xl font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            Request This Service <ArrowRight size={20} />
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
}