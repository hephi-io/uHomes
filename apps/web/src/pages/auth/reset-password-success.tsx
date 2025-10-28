import SuccessAnimation from '@/assets/pngs/Success Animation.png'

import UHome from '@/assets/svgs/u-home.svg?react';
import { Button } from '@uhomes/ui-kit';
import { useNavigate } from 'react-router-dom';

const ResetPasswordSuccess = () => {
    const navigate = useNavigate();
  return (
    <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center p-4   bg-white   md:p-10 rounded-none md:rounded-2xl">
      <div className=" w-full md:p-8">
        <div className="flex justify-center items-center">
          <div className="p-2 bg-[#EDEDED] rounded-xl">
            <UHome className="w-[46.4px] h-[45px]" />
          </div>
        </div>

        <div className=" mt-9 md:my-9">
          <div className="text-center">
            <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage">
              Password Reset Successful
            </h2>
            <p className="font-normal text-sm text-zinc-500">
              You can now log in using your new credentials.
            </p>
          </div>

          <div className="">
            <div className="md:py-9">
            <div className='my-[106px] w-[256px] h-[229px] mx-auto  md:mb-6 md:my-0'>
                <img src={SuccessAnimation} alt="Success Animation" className='w-full h-full object-cover' />
              </div>
              <Button
              onClick={() => navigate('/auth')}
                type="submit"
                variant="outline"
                className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-md cursor-pointer"
              >
                Proceed To Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordSuccess;
