import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';
import { verifyAccount, verifyAccountViaUrl, resendVerification } from '@/services/auth';
import { useAuth } from '@/contexts/auth-context';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const { login: loginAuth } = useAuth();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [verifyingUrl, setVerifyingUrl] = useState(false);

  const handleUrlVerification = useCallback(
    async (token: string) => {
      try {
        setVerifyingUrl(true);
        setError('');
        const { data } = await verifyAccountViaUrl(token);

        // Use auth context login
        loginAuth(data.data.token, data.data.user);

        navigate('/auth/verify-success');
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { data?: { message?: string }; message?: string } };
          message?: string;
        };
        const errorMessage =
          error.response?.data?.data?.message ||
          error.response?.data?.message ||
          error.message ||
          'Verification failed';
        setError(errorMessage);
        setVerifyingUrl(false);
      }
    },
    [loginAuth, navigate]
  );

  useEffect(() => {
    // Get email from localStorage (stored during signup)
    const storedEmail = localStorage.getItem('signupEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Check if we're verifying via URL (token in query params)
    const token = searchParams.get('token');
    if (token) {
      handleUrlVerification(token);
    }
  }, [searchParams, handleUrlVerification]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOTPChange = (value: string) => {
    setCode(value);
    setError('');
    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      handleVerify(value);
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code;
    if (codeToVerify.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    if (!email) {
      setError('Email not found. Please sign up again.');
      navigate('/auth');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { data } = await verifyAccount(email, codeToVerify);

      // Use auth context login
      loginAuth(data.data.token, data.data.user);

      localStorage.removeItem('signupEmail');
      navigate('/auth/verify-success');
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { data?: { message?: string }; message?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.data?.message ||
        error.response?.data?.message ||
        error.message ||
        'Verification failed. Please check your code and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email not found. Please sign up again.');
      navigate('/auth');
      return;
    }

    if (countdown > 0) {
      return;
    }

    try {
      setResendLoading(true);
      setError('');
      await resendVerification(email);
      setCountdown(60); // 60 second countdown
      setCode(''); // Clear current code
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { data?: { message?: string }; message?: string } };
      };
      const errorMessage =
        error.response?.data?.data?.message ||
        error.response?.data?.message ||
        'Failed to resend verification code';
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}.${secs.toString().padStart(2, '0')}`;
  };

  if (verifyingUrl) {
    return (
      <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center   bg-white  p-4 md:p-10 rounded-none md:rounded-2xl">
        <div className=" w-full md:p-8 mb-9">
          <div className="flex justify-center items-center">
            <div className="p-2 bg-[#EDEDED] rounded-xl">
              <SVGs.UHome className="w-[46.4px] h-[45px]" />
            </div>
          </div>
          <div className="text-center mt-9">
            <Loader2 className="size-8 animate-spin text-[#3E78FF] mx-auto mb-4" />
            <p className="font-normal text-sm text-zinc-500">Verifying your account...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center   bg-white  p-4 md:p-10 rounded-none md:rounded-2xl">
      <div className=" w-full md:p-8 mb-9">
        <div className="flex justify-center items-center">
          <div className="p-2 bg-[#EDEDED] rounded-xl">
            <SVGs.UHome className="w-[46.4px] h-[45px]" />
          </div>
        </div>

        <div className="">
          <div className="text-center  mt-9">
            <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage">Verification</h2>
            <p className="pt-2 font-normal text-sm text-zinc-500">
              Enter the 6 digit OTP sent to your email address
            </p>
            {email && <p className="pt-1 font-normal text-xs text-zinc-400">{email}</p>}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm text-center">
              {error}
            </div>
          )}

          <div className="mt-9 mb-6">
            <InputOTP
              maxLength={6}
              className="w-full gap-2"
              value={code}
              onChange={handleOTPChange}
              disabled={loading}
            >
              <InputOTPGroup className="w-full flex gap-3">
                <InputOTPSlot index={0} className="h-12 w-12 rounded-md border text-xl" />
                <InputOTPSlot index={1} className="h-12 w-12 rounded-md border text-xl" />
                <InputOTPSlot index={2} className="h-12 w-12 rounded-md border text-xl" />
                <InputOTPSlot index={3} className="h-12 w-12 rounded-md border text-xl" />
                <InputOTPSlot index={4} className="h-12 w-12 rounded-md border text-xl" />
                <InputOTPSlot index={5} className="h-12 w-12 rounded-md border text-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={() => handleVerify()}
            type="button"
            variant="outline"
            disabled={loading || code.length !== 6}
            className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer mb-9 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin inline" />
                Verifying...
              </>
            ) : (
              'Continue'
            )}
          </Button>

          <div className="flex justify-between items-center">
            <button
              className="flex items-center gap-1 bg-[#F4F4F4] h-6 px-1.5 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
            >
              <SVGs.RefreshCircle />
              <span className="text-[#26203B] font-normal text-xs">
                {resendLoading ? 'Sending...' : 'Resend code'}
              </span>
            </button>

            {countdown > 0 && (
              <span className="text-[#FA3507] font-bold text-[13px]">
                {formatCountdown(countdown)}s
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyAccount;
