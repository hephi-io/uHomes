import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';
import { resendVerification } from '@/services/auth';

const VerifyFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [email, setEmail] = useState<string>('');

  const error = searchParams.get('error') || 'Verification failed';

  useEffect(() => {
    // Try to get email from localStorage (stored during signup)
    const storedEmail = localStorage.getItem('signupEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  const handleResendCode = async () => {
    if (!email) {
      alert('Email not found. Please sign up again.');
      navigate('/auth');
      return;
    }

    try {
      setResendLoading(true);
      await resendVerification(email);
      setResendSuccess(true);
      setTimeout(() => {
        navigate('/auth/Verify-Account?origin=create-account');
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center   bg-white  p-4 md:p-10 rounded-none md:rounded-2xl">
      <div className=" w-full md:p-8 mb-9">
        <div className="flex justify-center items-center">
          <div className="p-2 bg-[#EDEDED] rounded-xl">
            <SVGs.UHome className="w-[46.4px] h-[45px]" />
          </div>
        </div>

        <div className="text-center mt-9">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage mb-2">
            Verification Failed
          </h2>
          <p className="pt-2 font-normal text-sm text-zinc-500 mb-4">{error}</p>
          <p className="pt-2 font-normal text-sm text-zinc-500 mb-9">
            The verification link may have expired or is invalid. Please request a new verification
            code.
          </p>

          {resendSuccess ? (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">
              Verification code sent! Redirecting...
            </div>
          ) : (
            <Button
              onClick={handleResendCode}
              variant="outline"
              disabled={resendLoading || !email}
              className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : 'Resend Verification Code'}
            </Button>
          )}

          <Button
            onClick={handleGoToLogin}
            variant="outline"
            className="bg-transparent text-[#3E78FF] border border-[#3E78FF] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VerifyFailed;
