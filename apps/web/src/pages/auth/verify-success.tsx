import { useNavigate } from 'react-router-dom';

import { Button } from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';
import { useAuth } from '@/contexts/auth-context';

const VerifySuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoToDashboard = () => {
    const userType = user?.userType?.type;

    if (userType === 'agent') {
      navigate('/onboarding-nin-verification');
    } else if (userType === 'student') {
      navigate('/students/dashboard');
    } else {
      navigate('/onboarding-nin-verification'); // Default fallback
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage mb-2">
            Email Verified!
          </h2>
          <p className="pt-2 font-normal text-sm text-zinc-500 mb-9">
            Your email address has been successfully verified. You can now access your dashboard.
          </p>

          <Button
            onClick={handleGoToDashboard}
            variant="outline"
            className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VerifySuccess;
