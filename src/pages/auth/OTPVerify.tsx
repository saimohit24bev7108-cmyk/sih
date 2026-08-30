import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export function OTPVerify() {
  const { role } = useParams<{ role: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState((location.state as { phoneNumber?: string } | null)?.phoneNumber ?? '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex(d => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleVerify = async () => {
    const validRole = (role === 'customer' || role === 'worker') ? role : 'customer';
    const code = otp.join('');
    if (!phoneNumber.trim()) {
      alert('Please enter the mobile number associated with the OTP');
      return;
    }
    if (code.length !== 6) {
      alert('Please enter the full 6-digit OTP');
      return;
    }

    try {
      await login(validRole as UserRole, {
        phone_number: phoneNumber,
        code,
        role: validRole as UserRole,
      });
      navigate(validRole === 'worker' ? '/worker/dashboard' : '/customer/dashboard');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'OTP verification failed');
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, purpose: 'login' }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Could not resend OTP');
      }
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not resend OTP');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-[hsl(var(--card-foreground))] text-center mb-2">Verify OTP</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center mb-8">
            Enter the 6-digit code sent to your mobile
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5">Mobile Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-sm transition-all duration-200 focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-lg border-2 border-[hsl(var(--input))] bg-[hsl(var(--background))] focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--ring))] transition-colors"
              />
            ))}
          </div>

          {/* Resend */}
          <div className="text-center mb-6">
            {countdown > 0 ? (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Resend in <span className="font-mono font-medium">00:{countdown.toString().padStart(2, '0')}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-[hsl(var(--primary))] font-medium hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            onClick={handleVerify}
            className="w-full py-3 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-opacity"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
}
