import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Zap, Droplet, PaintRoller, Hammer, Sparkles, Settings, ArrowRight, Home as HomeIcon } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50/60 to-white pt-8 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto gap-12">
          <div className="max-w-xl text-center md:text-left mt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-600 text-sm font-semibold mb-8 border border-blue-200">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                <HomeIcon size={12} />
              </span>
              Cooperative-powered. Community-driven.
            </div>
            <h1 className="text-5xl font-extrabold text-[#1a202c] leading-tight mb-4 tracking-tight">
              Trusted Home Services,<br/>
              <span className="text-blue-600">One Tap Away</span>
            </h1>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed max-w-lg font-medium">
              Connect with verified local plumbers, electricians, cleaners, and more.
              Fair wages. Transparent pricing. Community-governed.

              Book background-checked professionals for any repair or project. 
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <button
                onClick={() => navigate('/register?role=customer')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-[15px]"
              >
                I Need a Service <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/register?role=worker')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-gray-200 text-blue-600 font-semibold hover:bg-gray-50 transition-colors text-[15px] bg-white"
              >
                Join as a Worker <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 max-w-[800px] shrink-0">
            <div className="rounded-[40%] overflow-hidden bg-white shadow-2xl shadow-blue-900/10 border-4 border-white">
              <img
                src="/hero_workers.png"
                alt="Home service workers"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-[28px] font-bold text-[#1a202c] mb-2">Our Services</h2>
          <div className="w-12 h-1 bg-yellow-400 mb-10 rounded-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc, index) => (
              <motion.button
                key={svc.id}
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.38, delay: index * 0.1, ease: 'easeOut' }
                }
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => navigate(`/services/${svc.id}`)}
                className="group rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-0.5 transition-all text-left flex justify-between overflow-hidden"
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-semibold text-[17px] text-blue-900 mb-1 group-hover:text-blue-600 transition-colors">{svc.name}</h3>
                    <p className="text-[13px] text-gray-500 leading-snug whitespace-pre-line">{svc.desc}</p>
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
