import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ===== New sitemap routes ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/what-we-offer" element={<WhatWeOffer />} />
          <Route path="/login" element={<ChooseRole mode="login" />} />
          
          <Route path="/register" element={<ChooseRole mode="register" />} />
          <Route path="/services/:category" element={<ServiceOverview />} />

          {/* ===== Existing Auth - Customer ===== */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />

          {/* ===== Existing Auth - Worker ===== */}
          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route path="/worker/register" element={<WorkerRegister />} />

          {/* ===== Existing Auth - Admin ===== */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ===== OTP Verify ===== */}
          <Route path="/otp-verify/:role" element={<OTPVerify />} />

          {/* ===== Customer Pages ===== */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/services" element={<ServiceCategories />} />
          <Route path="/customer/service-request/:category" element={<ServiceRequest />} />
          <Route path="/customer/workers/:category" element={<WorkerListing />} />
          <Route path="/customer/booking/:workerId" element={<BookingPage />} />
          <Route path="/customer/bookings" element={<BookingsPlaceholder />} />

          {/* ===== Worker Pages ===== */}
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/jobs" element={<WorkerPlaceholder />} />
          <Route path="/worker/earnings" element={<WorkerPlaceholder />} />
          <Route path="/worker/profile" element={<WorkerPlaceholder />} />

          {/* ===== Admin Pages ===== */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/workers" element={<AdminPlaceholder />} />
          <Route path="/admin/bookings" element={<AdminPlaceholder />} />
          <Route path="/admin/disputes" element={<AdminPlaceholder />} />
          <Route path="/admin/verifications" element={<AdminPlaceholder />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
