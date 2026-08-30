import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Zap, Droplet, PaintRoller, Hammer, Sparkles, Settings, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { tapScale, hoverLift, cardContainerStagger, cardItemFade } from '@/lib/motion';

const VIEWPORT = { once: true, amount: 0.2 } as const;

const SERVICES = [
  { id: 'electrical', name: 'Electrical', desc: 'Safe wiring, repairs &\ninstallation', icon: <Zap size={20} className="fill-current" />, img: '/w_elec.png' },
  { id: 'plumbing', name: 'Plumbing', desc: 'Leak fixes, pipe\nrepairs & more', icon: <Droplet size={20} className="fill-current" />, img: '/w_plumb.png' },
  { id: 'painting', name: 'Painting', desc: 'Wall painting, texture\n& polish work', icon: <PaintRoller size={20} className="fill-current" />, img: '/w_paint.png' },
  { id: 'carpentry', name: 'Carpentry', desc: 'Furniture, fittings &\nwoodwork', icon: <Hammer size={20} className="fill-current" />, img: '/w_carp.png' },
  { id: 'cleaning', name: 'Cleaning', desc: 'Home, office & deep\ncleaning services', icon: <Sparkles size={20} className="fill-current" />, img: '/w_clean.png' },
  { id: 'repairs', name: 'Appliances Repair', desc: 'AC, fan, fridge &\nother appliances', icon: <Settings size={20} className="fill-current" />, img: '/w_repair.png' },
];

export function Home() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const revealTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: 'easeOut' as const };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <motion.section
        className="bg-gradient-to-br from-blue-50/60 to-white dark:from-gray-800/60 dark:to-gray-900 pt-8 pb-16"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={revealTransition}
      >
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 lg:px-12 max-w-[1440px] mx-auto gap-8 lg:gap-12">
          <motion.div
            className="w-full md:w-[58%] lg:w-[60%] text-center md:text-left mt-6 md:mt-10"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.08 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-600 text-sm font-semibold mb-8 border border-blue-200">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                <HomeIcon size={12} />
              </span>
              Cooperative-powered. Community-driven.
            </div>
            <h1 className="text-[clamp(2.7rem,4vw,5rem)] font-extrabold text-[#1a202c] dark:text-white leading-[0.96] tracking-[-0.04em] mb-4 max-w-[700px] md:max-w-[760px] lg:max-w-[820px]">
              <span className="block">Trusted Home Services,</span>
              <span className="block text-blue-600">One Tap Away</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed max-w-[620px] md:max-w-[700px] font-medium text-left md:text-left mx-auto md:mx-0">
              Connect with verified local plumbers, electricians, cleaners, and more.
              Fair wages. Transparent pricing. Community-governed.

              Book background-checked professionals for any repair or project.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <motion.button
                whileTap={reduceMotion ? undefined : tapScale}
                whileHover={reduceMotion ? undefined : hoverLift}
                onClick={() => navigate('/register?role=customer')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-[15px]"
              >
                I Need a Service <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileTap={reduceMotion ? undefined : tapScale}
                whileHover={reduceMotion ? undefined : hoverLift}
                onClick={() => navigate('/register?role=worker')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-blue-600 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[15px] bg-white dark:bg-gray-800"
              >
                Join as a Worker <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-[42%] lg:w-[40%] max-w-[760px] shrink-0 flex justify-center md:justify-end"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.14 }}
          >
            <div className="w-full max-w-[620px] rounded-[40%] overflow-hidden bg-white shadow-2xl shadow-blue-900/10 border-4 border-white">
              <img
                src="/hero_workers.png"
                alt="Home service workers"
                className="w-full h-auto object-cover block"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services */}
      <motion.section
        id="services"
        className="relative overflow-hidden px-6 md:px-12 py-16 bg-gradient-to-b from-sky-50 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={revealTransition}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),transparent_28%)]" />
        <div className="relative max-w-[1400px] mx-auto">
          <h2 className="text-[28px] font-bold text-[#1a202c] dark:text-white mb-2">Our Services</h2>
          <div className="w-12 h-1 bg-yellow-400 mb-10 rounded-full" />
          <motion.div
            initial="initial"
            animate="animate"
            variants={cardContainerStagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SERVICES.map((svc) => (
              <motion.button
                key={svc.id}
                variants={cardItemFade}
                whileTap={reduceMotion ? undefined : tapScale}
                whileHover={reduceMotion ? undefined : hoverLift}
                onClick={() => navigate(`/services/${svc.id}`)}
                className="group rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-0.5 transition-all text-left flex justify-between overflow-hidden backdrop-blur-sm"
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-semibold text-[17px] text-blue-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{svc.name}</h3>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-snug whitespace-pre-line">{svc.desc}</p>
                  </div>
                  <motion.div
                    className="w-9 h-9 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white mt-6"
                    whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  >
                    {svc.icon}
                  </motion.div>
                </div>
                <div className="w-[160px] flex items-end justify-end pt-4 pr-2">
                  <motion.img
                    src={svc.img}
                    alt={svc.name}
                    whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="max-h-[140px] object-contain drop-shadow-md"
                  />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
