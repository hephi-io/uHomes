import { Outlet } from 'react-router-dom';

import { Button } from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';

export default function BookingLayout() {
  return (
    <div className="md:px-8 lg:pb-8">
      <div className="flex gap-x-9 items-center mt-4">
        <Button variant="outline" className="size-11 rounded-full border-[#E5E5E5]">
          <SVGs.ChevronLeft />
        </Button>
        <h1 className="font-semibold text-base leading-[120%] tracking-[0%] text-[#09090B]">
          Booking
        </h1>
      </div>
      <div className="flex justify-between items-center md:w-[86.70%] lg:w-[43.47%] md:mx-auto mt-9">
        <div className="md:flex md:gap-x-3 md:items-center">
          <SVGs.ContactBook className="text-[#3E78FF] mx-auto mb-1" />
          <span className="text-xs leading-5 tracking-[0%] align-middle text-[#3E78FF]">
            Booking
          </span>
        </div>
        <SVGs.Dashes className="text-[#A7A7A7] md:hidden" />
        <SVGs.DashesMedium className="hidden text-[#A7A7A7] md:block" />
        <div className="md:flex md:gap-x-3 md:items-center">
          <SVGs.CreditCard className="mx-auto mb-1 text-[#A7A7A7]" />
          <span className="text-xs leading-5 tracking-[0%] align-middle text-[#A7A7A7]">
            Payment
          </span>
        </div>
        <SVGs.Dashes className="text-[#A7A7A7] md:hidden" />
        <SVGs.DashesMedium className="hidden text-[#A7A7A7] md:block" />
        <div className="md:flex md:gap-x-3 md:items-center">
          <SVGs.CheckmarkCircle className="mx-auto mb-1 text-[#A7A7A7]" />
          <span className="text-xs leading-5 tracking-[0%] align-middle text-[#A7A7A7]">
            Complete
          </span>
        </div>
      </div>
      <div className="rounded-xl border border-[#E4E7EC] bg-white shadow-[0px_1px_2px_0px_#1018280D] p-4 mt-9">
        <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] p-4.5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
