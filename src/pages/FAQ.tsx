import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
  { question: 'How do I book a service?', answer: 'Choose a service category on the home page, pick a worker, and confirm your booking details.' },
  { question: 'Are workers verified?', answer: 'Yes, every worker is ID-verified and skill-assessed before joining the platform.' },
  { question: 'How do payments work?', answer: 'Payments are made securely through the app after the service is completed.' },
  { question: 'What if I am not satisfied with the service?', answer: 'You can raise a dispute through the app and our support team will help resolve it.' },
  { question: 'Is there a cancellation fee?', answer: 'Cancellations made well before the scheduled time are free; late cancellations may incur a small fee.' },
    { question: 'How do I become a worker on FixFlow?', answer: 'Sign up through the "Join as a Worker" option, complete ID verification, and submit your skill details for approval.' },
  { question: 'What areas do you currently serve?', answer: 'We are currently expanding city by city — check the booking page to see if your area is covered.' },
  { question: 'Can I choose a specific worker for my service?', answer: 'Yes, you can view worker profiles and ratings before confirming your booking.' },
  { question: 'Is my personal information kept private?', answer: 'Yes, your data is only shared with the assigned worker for service coordination and is never sold to third parties.' },
    { question: 'Can I reschedule a booking?', answer: 'Yes, you can reschedule from the Bookings section up to a few hours before the appointment.' },
  { question: 'Do you offer services on weekends?', answer: 'Yes, workers are available all seven days, subject to individual availability.' },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-black mb-8">Frequently Asked Questions</h1>
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.3, delay: index * 0.06, ease: 'easeOut' }
                }
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <motion.button
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-4 py-3 font-semibold text-black bg-gray-50 hover:bg-gray-100 flex items-center justify-between gap-3"
                >
                  <span>{faq.question}</span>
                  <motion.span
                    animate={reduceMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="inline-flex"
                  >
                    <ChevronDown size={18} className="text-gray-600" />
                  </motion.span>
                </motion.button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                      animate={reduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 1, height: 'auto' }}
                      exit={reduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 text-sm text-black">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}