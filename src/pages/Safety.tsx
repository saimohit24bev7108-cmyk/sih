import { motion, useReducedMotion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, UserCheck, Lock, Phone } from 'lucide-react';

const VIEWPORT = { once: true, amount: 0.2 } as const;

const SAFETY_POINTS = [
  { icon: <UserCheck size={24} className="text-blue-600" />, title: 'Verified Workers', description: 'Every worker undergoes ID verification and a background check before joining the platform.' },
  { icon: <ShieldCheck size={24} className="text-blue-600" />, title: 'Skill Assessment', description: 'Workers are assessed for their skills before being allowed to take on service requests.' },
  { icon: <Lock size={24} className="text-blue-600" />, title: 'Secure Payments', description: 'All payments are processed securely within the app, with no cash handling required.' },
  { icon: <Phone size={24} className="text-blue-600" />, title: '24/7 Support', description: 'Our support team is available around the clock to help with any safety concerns during a service.' },
  { icon: <ShieldCheck size={24} className="text-blue-600" />, title: 'Live Tracking', description: 'Track your assigned worker in real time from the moment they accept your booking.' },
  { icon: <UserCheck size={24} className="text-blue-600" />, title: 'Rating & Feedback', description: 'Every service is rated by the customer, keeping workers accountable and service quality high.' },
];

export function Safety() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-32">
        <h1 className="text-3xl font-extrabold text-black mb-8">Your Safety Is Our Priority</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SAFETY_POINTS.map((point, index) => (
            <motion.div
              key={index}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.36, delay: index * 0.1, ease: 'easeOut' }
              }
              whileHover={reduceMotion ? undefined : { y: -4, boxShadow: '0 12px 24px rgba(15,23,42,0.08)' }}
              className="p-5 rounded-xl border border-gray-200"
            >
              <div className="mb-3">{point.icon}</div>
              <h3 className="font-semibold text-black mb-1">{point.title}</h3>
              <p className="text-sm text-gray-700">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}