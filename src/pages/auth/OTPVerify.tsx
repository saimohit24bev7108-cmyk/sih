import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export function OTPVerify() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
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

  const handleVerify = () => {
    const validRole = (role === 'customer' || role === 'worker') ? role : 'customer';
    login(validRole as UserRole);
    navigate(validRole === 'worker' ? '/worker/dashboard' : '/customer/dashboard');
  };

  const handleResend = () => {
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4">
      <div className="w-full max-w-md">
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
