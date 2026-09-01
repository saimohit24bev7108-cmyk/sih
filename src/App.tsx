import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PageWrapper } from '@/components/PageWrapper';
import { RequireAuth } from '@/components/RequireAuth';

// New pages
import { Home } from '@/pages/Home';
import { WhatWeOffer } from '@/pages/WhatWeOffer';
import { ChooseRole } from '@/pages/auth/ChooseRole';
import { ServiceOverview } from '@/pages/ServiceOverview';
import { FAQ } from '@/pages/FAQ';
import { Safety } from '@/pages/Safety';
import { AboutUs } from '@/pages/AboutUs';




// Existing Auth
import { CustomerLogin } from '@/pages/auth/CustomerLogin';
import { WorkerLogin } from '@/pages/auth/WorkerLogin';
import { AdminLogin } from '@/pages/auth/AdminLogin';
import { CustomerRegister } from '@/pages/auth/CustomerRegister';
import { WorkerRegister } from '@/pages/auth/WorkerRegister';
import { OTPVerify } from '@/pages/auth/OTPVerify';

// Customer
import { CustomerDashboard } from '@/pages/customer/CustomerDashboard';
import { ServiceCategories } from '@/pages/customer/ServiceCategories';
import { ServiceRequest } from '@/pages/customer/ServiceRequest';
import { WorkerListing } from '@/pages/customer/WorkerListing';
import { BookingPage } from '@/pages/customer/BookingPage';
import { BookingsPlaceholder } from '@/pages/customer/BookingsPlaceholder';

// Worker
import { WorkerDashboard } from '@/pages/worker/WorkerDashboard';
import { WorkerPlaceholder } from '@/pages/worker/WorkerPlaceholder';

// Admin
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminPlaceholder } from '@/pages/admin/AdminPlaceholder';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ===== New sitemap routes ===== */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
        <Route path="/safety" element={<PageWrapper><Safety /></PageWrapper>} />
        <Route path="/about-us" element={<PageWrapper><AboutUs /></PageWrapper>} />
        <Route path="/what-we-offer" element={<PageWrapper><WhatWeOffer /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><ChooseRole mode="login" /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><ChooseRole mode="register" /></PageWrapper>} />
        <Route path="/services/:category" element={<PageWrapper><ServiceOverview /></PageWrapper>} />

        {/* ===== Existing Auth - Customer ===== */}
        <Route path="/customer/login" element={<PageWrapper><CustomerLogin /></PageWrapper>} />
        <Route path="/customer/register" element={<PageWrapper><CustomerRegister /></PageWrapper>} />

        {/* ===== Existing Auth - Worker ===== */}
        <Route path="/worker/login" element={<PageWrapper><WorkerLogin /></PageWrapper>} />
        <Route path="/worker/register" element={<PageWrapper><WorkerRegister /></PageWrapper>} />

        {/* ===== Existing Auth - Admin ===== */}
        <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />

        {/* ===== OTP Verify ===== */}
        <Route path="/otp-verify/:role" element={<PageWrapper><OTPVerify /></PageWrapper>} />

        {/* ===== Customer Pages ===== */}
        <Route path="/customer/dashboard" element={<RequireAuth role="customer"><PageWrapper><CustomerDashboard /></PageWrapper></RequireAuth>} />
        <Route path="/customer/services" element={<RequireAuth role="customer"><PageWrapper><ServiceCategories /></PageWrapper></RequireAuth>} />
        <Route path="/customer/service-request/:category" element={<RequireAuth role="customer"><PageWrapper><ServiceRequest /></PageWrapper></RequireAuth>} />
        <Route path="/customer/workers/:category" element={<RequireAuth role="customer"><PageWrapper><WorkerListing /></PageWrapper></RequireAuth>} />
        <Route path="/customer/booking/:workerId" element={<RequireAuth role="customer"><PageWrapper><BookingPage /></PageWrapper></RequireAuth>} />
        <Route path="/customer/bookings" element={<RequireAuth role="customer"><PageWrapper><BookingsPlaceholder /></PageWrapper></RequireAuth>} />

        {/* ===== Worker Pages ===== */}
        <Route path="/worker/dashboard" element={<RequireAuth role="worker"><PageWrapper><WorkerDashboard /></PageWrapper></RequireAuth>} />
        <Route path="/worker/jobs" element={<RequireAuth role="worker"><PageWrapper><WorkerPlaceholder /></PageWrapper></RequireAuth>} />
        <Route path="/worker/earnings" element={<RequireAuth role="worker"><PageWrapper><WorkerPlaceholder /></PageWrapper></RequireAuth>} />
        <Route path="/worker/profile" element={<RequireAuth role="worker"><PageWrapper><WorkerPlaceholder /></PageWrapper></RequireAuth>} />

        {/* ===== Admin Pages ===== */}
        <Route path="/admin/dashboard" element={<RequireAuth role="admin"><PageWrapper><AdminDashboard /></PageWrapper></RequireAuth>} />
        <Route path="/admin/workers" element={<RequireAuth role="admin"><PageWrapper><AdminPlaceholder /></PageWrapper></RequireAuth>} />
        <Route path="/admin/bookings" element={<RequireAuth role="admin"><PageWrapper><AdminPlaceholder /></PageWrapper></RequireAuth>} />
        <Route path="/admin/disputes" element={<RequireAuth role="admin"><PageWrapper><AdminPlaceholder /></PageWrapper></RequireAuth>} />
        <Route path="/admin/verifications" element={<RequireAuth role="admin"><PageWrapper><AdminPlaceholder /></PageWrapper></RequireAuth>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
