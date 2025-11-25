import UHome from '@/assets/svgs/u-home.svg?react';
import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from '@uhomes/ui-kit';
import { useNavigate } from 'react-router-dom';
import Refreshcircle from '@/assets/svgs/refresh-circle.svg?react';

const VerifyAccount = () => {
  const navigate = useNavigate();
  return (
    <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center   bg-white  p-4 md:p-10 rounded-none md:rounded-2xl">
      <div className=" w-full md:p-8 mb-9">
        <div className="flex justify-center items-center">
          <div className="p-2 bg-[#EDEDED] rounded-xl">
            <UHome className="w-[46.4px] h-[45px]" />
          </div>
        </div>
        <div className="">
          <div className="text-center  mt-9">
            <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage">Verification</h2>
            <p className="pt-2 font-normal text-sm text-zinc-500">
              Enter the 6 digit OTP sent to your email address
            </p>
          </div>

          <div className="py-9 space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                // pattern={/^\d{6}$/}
                className="gap-2"
              >
                <InputOTPGroup className="flex gap-3">
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
              onClick={() => navigate('/auth/reset-password')}
              type="submit"
              variant="outline"
              className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer"
            >
              Continue
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="flex items-center gap-1 rounded-[10000px] bg-[#F4F4F4]  cursor-pointer "
            >
              <Refreshcircle />
              <span className="text-[#26203B] font-normal text-xs">Resend code</span>
            </Button>
            <span className="text-[#FA3507] font-bold text-[13px]">00.59s</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyAccount;
