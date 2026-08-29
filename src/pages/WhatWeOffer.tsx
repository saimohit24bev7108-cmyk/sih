import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BadgeCheck, CalendarCheck, Lock, MapPin, Download, Smartphone, Wrench } from 'lucide-react';

export function WhatWeOffer() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* What We Offer */}
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">What We Offer</h2>
          <div className="w-16 h-1 bg-yellow-400 rounded mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Verified Professionals */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop"
                alt="Verified Professionals"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-blue-900 mb-1">Verified Professionals</h3>
                <p className="text-xs text-gray-500">Background checked local experts you can trust.</p>
                <BadgeCheck size={20} className="text-blue-600 mt-3" />
              </div>
            </div>
            {/* Easy Booking */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=400&h=250&fit=crop"
                alt="Easy Booking"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-blue-900 mb-1">Easy Booking</h3>
                <p className="text-xs text-gray-500">Book in minutes, choose time, and get it done.</p>
                <CalendarCheck size={20} className="text-green-600 mt-3" />
              </div>
            </div>
            {/* Secure Payments */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop"
                alt="Secure Payments"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-blue-900 mb-1">Secure Payments</h3>
                <p className="text-xs text-gray-500">Safe, transparent payments with digital receipts.</p>
                <Lock size={20} className="text-amber-600 mt-3" />
              </div>
            </div>
            {/* Service Tracking */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=250&fit=crop"
                alt="Service Tracking"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-blue-900 mb-1">Service Tracking</h3>
                <p className="text-xs text-gray-500">Track your worker in real-time from booking to completion.</p>
                <MapPin size={20} className="text-red-500 mt-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Now */}
      <section className="px-6 md:px-10 py-16 bg-blue-50/40 border-t border-blue-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-1">Download Now</h2>
          <p className="text-gray-500 text-sm mb-8">Your home services, on the go.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-5 p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                <Smartphone size={28} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">FixFlow Customer App</h3>
                <p className="text-xs text-gray-500 mt-0.5">Book services, track status and manage all in one place.</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shrink-0">
                <Download size={14} />
                Google Play
              </button>
            </div>
            <div className="flex items-center gap-5 p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                <Wrench size={28} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">FixFlow Worker App</h3>
                <p className="text-xs text-gray-500 mt-0.5">Get jobs, manage bookings and grow your business.</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition-colors shrink-0">
                <Download size={14} />
                App Store
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
