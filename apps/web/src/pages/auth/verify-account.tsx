import { useNavigate } from 'react-router-dom';

import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';

const VerifyAccount = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/auth/reset-password');
  };

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
          </div>

          <div className="mt-9 mb-6">
            <InputOTP maxLength={6} className="w-full">
              <InputOTPGroup className="w-full">
                <InputOTPSlot index={0} className="w-1/6" />
                <InputOTPSlot index={1} className="w-1/6" />
                <InputOTPSlot index={2} className="w-1/6" />
                <InputOTPSlot index={3} className="w-1/6" />
                <InputOTPSlot index={4} className="w-1/6" />
                <InputOTPSlot index={5} className="w-1/6" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleContinue}
            type="submit"
            variant="outline"
            className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer mb-9"
          >
            Continue
          </Button>

          <div className="flex justify-between items-center">
            <button className="flex items-center gap-1 bg-[#F4F4F4] h-6 px-1.5 rounded-full cursor-pointer">
              <SVGs.RefreshCircle />

              <span className="text-[#26203B] font-normal text-xs">Resend code</span>
            </button>

            <span className="text-[#FA3507] font-bold text-[13px]">00.59s</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyAccount;
