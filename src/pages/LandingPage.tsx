import { useNavigate } from 'react-router-dom';
import { Shield, Users, Wallet, ArrowRight, Wrench, Zap, Sparkles, CalendarCheck, BadgeCheck, Lock, Download, Smartphone } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-2">
          <Wrench size={28} className="text-[hsl(var(--primary))]" />
          <span className="text-xl font-bold text-[hsl(var(--foreground))]">FixFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/customer/login')}
            className="px-4 py-2 text-sm font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))] rounded-lg transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/customer/register')}
            className="px-4 py-2 text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg hover:opacity-90 transition-opacity"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-sm font-medium mb-6">
          <Sparkles size={16} />
          Cooperative-powered. Community-driven.
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[hsl(var(--foreground))] leading-tight">
          Trusted Home Services,{' '}
          <span className="text-[hsl(var(--primary))]">One Tap Away</span>
        </h1>
        <p className="mt-6 text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
          Connect with verified local plumbers, electricians, cleaners, and more.
          Fair wages. Transparent pricing. Community-governed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button
            onClick={() => navigate('/customer/register')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(var(--primary))]/25"
          >
            I Need a Service <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/worker/register')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-xl font-semibold text-base hover:bg-[hsl(var(--primary))]/5 transition-colors"
          >
            Join as a Worker <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Role Selection */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center text-[hsl(var(--foreground))] mb-8">Choose Your Role</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <RoleCard
            title="Customer"
            description="Find and book verified service professionals for your home"
            icon={<Users size={32} />}
            loginPath="/customer/login"
            registerPath="/customer/register"
            navigate={navigate}
          />
          <RoleCard
            title="Worker"
            description="Join our cooperative, get fair jobs, and grow your career"
            icon={<Wrench size={32} />}
            loginPath="/worker/login"
            registerPath="/worker/register"
            navigate={navigate}
          />
          <RoleCard
            title="Admin"
            description="Manage platform operations, workers, and disputes"
            icon={<Shield size={32} />}
            loginPath="/admin/login"
            navigate={navigate}
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-[hsl(var(--secondary))] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[hsl(var(--foreground))] mb-12">Why FixFlow?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield size={28} className="text-[hsl(var(--primary))]" />}
              title="Verified Workers"
              description="Every worker is ID-verified, skill-assessed, and background-checked."
            />
            <FeatureCard
              icon={<Wallet size={28} className="text-[hsl(var(--primary))]" />}
              title="Fair & Transparent"
              description="Cooperative model ensures fair wages, no hidden fees, and worker governance."
            />
            <FeatureCard
              icon={<Zap size={28} className="text-[hsl(var(--primary))]" />}
              title="Quick Matching"
              description="AI-powered matching finds the best available worker near you instantly."
            />
          </div>
        </div>
      </section>

      {/* Our Services — 2-row x 3-column grid with images */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-8">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'electrical', name: 'Electrical', desc: 'Safe wiring, repairs & installation', color: 'bg-yellow-400', icon: '⚡', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop' },
            { id: 'plumbing', name: 'Plumbing', desc: 'Leak fixes, pipe repairs & more', color: 'bg-blue-500', icon: '💧', img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=200&fit=crop' },
            { id: 'painting', name: 'Painting', desc: 'Wall painting, texture & polish work', color: 'bg-teal-500', icon: '🖌️', img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=200&fit=crop' },
            { id: 'carpentry', name: 'Carpentry', desc: 'Furniture, fittings & woodwork', color: 'bg-blue-600', icon: '🪚', img: 'https://images.unsplash.com/photo-1601564921647-b446839a013f?w=300&h=200&fit=crop' },
            { id: 'cleaning', name: 'Cleaning', desc: 'Home, office & deep cleaning services', color: 'bg-indigo-500', icon: '🧹', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop' },
            { id: 'repairs', name: 'Appliances Repair', desc: 'AC, fan, fridge & other appliances', color: 'bg-blue-500', icon: '⚙️', img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop' },
          ].map((svc) => (
            <button
              key={svc.id}
              onClick={() => navigate(`/services/${svc.id}`)}
              className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden hover:shadow-lg hover:border-[hsl(var(--primary))]/30 transition-all text-left"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={svc.img} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 text-xl">{svc.icon}</div>
              </div>
              <div className="p-4 border-t-4" style={{ borderTopColor: 'hsl(var(--primary))' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 rounded-full ${svc.color} flex items-center justify-center text-white text-xs`}>
                    {svc.icon}
                  </div>
                  <h3 className="font-bold text-[hsl(var(--card-foreground))]">{svc.name}</h3>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{svc.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* What We Offer — order: Easy Booking, Verified Professionals, Secure Payments */}
      <section className="bg-[hsl(var(--secondary))] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-10">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Easy Booking */}
            <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=400&h=250&fit=crop"
                alt="Easy Booking"
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarCheck size={20} className="text-green-600" />
                  <h3 className="font-bold text-[hsl(var(--card-foreground))]">Easy Booking</h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Book in minutes, choose time, and get it done.</p>
              </div>
            </div>
            {/* Verified Professionals */}
            <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop"
                alt="Verified Professionals"
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck size={20} className="text-blue-600" />
                  <h3 className="font-bold text-[hsl(var(--card-foreground))]">Verified Professionals</h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Background checked local experts you can trust.</p>
              </div>
            </div>
            {/* Secure Payments */}
            <div className="rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop"
                alt="Secure Payments"
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={20} className="text-amber-600" />
                  <h3 className="font-bold text-[hsl(var(--card-foreground))]">Secure Payments</h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Safe, transparent payments with digital receipts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Now — order: Worker App, Customer App */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Download Now</h2>
          <p className="text-[hsl(var(--muted-foreground))] mt-1">Your home services, on the go.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-5 p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
              <Wrench size={28} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[hsl(var(--card-foreground))]">FixFlow Worker App</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">Get jobs, manage bookings and grow your business.</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-sm font-semibold hover:opacity-90 transition-opacity shrink-0">
              <Download size={16} />
              App Store
            </button>
          </div>
          <div className="flex items-center gap-5 p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
              <Smartphone size={28} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[hsl(var(--card-foreground))]">FixFlow Customer App</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">Book services, track status and manage all in one place.</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-sm font-semibold hover:opacity-90 transition-opacity shrink-0">
              <Download size={16} />
              Google Play
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))]">
        <p>&copy; 2026 FixFlow — Cooperative Gig Services Platform. SIH26089.</p>
      </footer>
    </div>
  );
}

function RoleCard({ title, description, icon, loginPath, registerPath, navigate }: {
  title: string; description: string; icon: React.ReactNode;
  loginPath: string; registerPath?: string; navigate: (path: string) => void;
}) {
  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center hover:shadow-lg transition-shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-2">{title}</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-5">{description}</p>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate(loginPath)}
          className="w-full py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Login as {title}
        </button>
        {registerPath && (
          <button
            onClick={() => navigate(registerPath)}
            className="w-full py-2 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm font-medium hover:bg-[hsl(var(--accent))] transition-colors"
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--card))] shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">{title}</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
    </div>
  );
}
