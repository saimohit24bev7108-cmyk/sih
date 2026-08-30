import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
  type Transition,
} from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Users,
  Target,
  Heart,
  ArrowRight,
  ClipboardList,
  UserCheck,
  BadgeCheck,
  CheckCircle2,
} from 'lucide-react';

const VIEWPORT = { once: true, amount: 0.25 } as const;

const EASE_OUT = 'easeOut' as const;

function fadeUp(reduceMotion: boolean | null, delay = 0) {
  const transition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.4, delay, ease: EASE_OUT };

  if (reduceMotion) {
    return {
      initial: false as const,
      viewport: VIEWPORT,
      transition,
    };
  }

  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    transition,
  };
}

const VALUE_CARDS = [
  {
    title: 'Who We Are',
    description: 'A community-driven platform connecting customers with trusted local workers.',
    icon: Users,
  },
  {
    title: 'Our Mission',
    description: 'To make quality home services accessible while ensuring fair earnings for workers.',
    icon: Target,
  },
  {
    title: 'Our Values',
    description: 'Trust, transparency, and fairness for both customers and workers.',
    icon: Heart,
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Request a service',
    description: 'Tell us what you need — plumbing, electrical, cleaning, and more.',
    icon: ClipboardList,
  },
  {
    step: '02',
    title: 'Get matched',
    description: 'We connect you with a nearby verified professional who fits the job.',
    icon: UserCheck,
  },
  {
    step: '03',
    title: 'Job done',
    description: 'The work is completed, you pay securely, and both sides leave a rating.',
    icon: BadgeCheck,
  },
];

const WORKER_CHECKS = [
  'Fair earnings',
  'Verified workers',
  'Transparent governance',
  'Community-driven',
];

const STATS = [
  { value: 500, suffix: '+', label: 'Verified Workers' },
  { value: 10000, suffix: '+', label: 'Services Completed' },
  { value: 6, suffix: '', label: 'Service Categories' },
];

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
};

const iconHover = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.08, rotate: 8 },
};

function AnimatedStat({
  value,
  suffix,
  label,
  reduceMotion,
}: {
  value: number;
  suffix: string;
  label: string;
  reduceMotion: boolean | null;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.45,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, value, reduceMotion]);

  return (
    <div className="text-center px-4">
      <p ref={ref} className="text-2xl md:text-3xl font-extrabold text-blue-600 tracking-tight">
        {`${display.toLocaleString('en-IN')}${suffix}`}
      </p>
      <p className="text-sm text-gray-500 font-medium mt-1">{label}</p>
    </div>
  );
}

export function AboutUs() {
  const reduceMotion = useReducedMotion();
  const hoverScale = reduceMotion ? undefined : { scale: 1.03 };
  const tapScale = reduceMotion ? undefined : { scale: 0.97 };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <motion.div {...fadeUp(reduceMotion)}>
          <h1 className="text-3xl font-extrabold text-black mb-6">About FixFlow</h1>
          <p className="text-gray-700 mb-8">
            FixFlow is a cooperative gig services platform connecting customers with verified local
            professionals for home services like plumbing, electrical work, cleaning, carpentry, painting,
            and appliance repair. Built on a cooperative model, we ensure fair wages and transparent
            governance for the workers who power our platform.
          </p>
          <motion.button
            type="button"
            onClick={scrollToHowItWorks}
            whileHover={hoverScale}
            whileTap={tapScale}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-[15px]"
          >
            Explore FixFlow <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-gray-100"
          {...fadeUp(reduceMotion, 0.08)}
        >
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} reduceMotion={reduceMotion} />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {VALUE_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} {...fadeUp(reduceMotion, index * 0.12)}>
                <motion.div
                  className="h-full p-5 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-shadow"
                  initial="rest"
                  animate="rest"
                  whileHover={reduceMotion ? undefined : 'hover'}
                  variants={reduceMotion ? undefined : cardHover}
                  transition={{ duration: 0.25 }}
                >
                  <motion.div
                    className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-3"
                    variants={reduceMotion ? undefined : iconHover}
                    transition={{ duration: 0.25 }}
                  >
                    <Icon size={24} className="text-blue-600" />
                  </motion.div>
                  <h3 className="font-semibold text-black mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-700">{card.description}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="max-w-3xl mx-auto px-6 pb-16 scroll-mt-24">
        <motion.div {...fadeUp(reduceMotion)}>
          <h2 className="text-2xl font-bold text-black mb-2">How FixFlow Works</h2>
          <div className="w-12 h-1 bg-yellow-400 mb-8 rounded-full" />
        </motion.div>

        <div className="relative">
          <div
            className="hidden sm:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-blue-100 overflow-hidden"
            aria-hidden
          >
            <motion.div
              className="h-full bg-blue-500 origin-left"
              initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.45, delay: 0.45, ease: EASE_OUT }
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {HOW_IT_WORKS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.step} {...fadeUp(reduceMotion, index * 0.15)}>
                  <motion.div
                    className="h-full p-5 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-shadow"
                    initial="rest"
                    animate="rest"
                    whileHover={reduceMotion ? undefined : 'hover'}
                    variants={reduceMotion ? undefined : cardHover}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <motion.div
                        className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center"
                        variants={reduceMotion ? undefined : iconHover}
                        transition={{ duration: 0.25 }}
                      >
                        <Icon size={22} className="text-blue-600" />
                      </motion.div>
                      <span className="text-sm font-bold text-blue-600">{item.step}</span>
                    </div>
                    <h3 className="font-semibold text-black mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-32">
        <motion.div
          className="p-6 rounded-xl border border-gray-200"
          {...fadeUp(reduceMotion)}
        >
          <h2 className="text-2xl font-bold text-black mb-2">Built for workers</h2>
          <p className="text-sm text-gray-700 mb-6">
            FixFlow is a cooperative: workers share in the platform, not just complete jobs on it.
          </p>
          <ul className="space-y-3">
            {WORKER_CHECKS.map((item, index) => (
              <motion.li
                key={item}
                className="flex items-center gap-3 text-sm text-gray-800"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.3, delay: 0.12 + index * 0.12, ease: EASE_OUT }
                }
              >
                <motion.span
                  className="inline-flex shrink-0"
                  initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                  whileInView={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.25, delay: 0.18 + index * 0.12, ease: EASE_OUT }
                  }
                >
                  <CheckCircle2 size={18} className="text-blue-600" />
                </motion.span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
