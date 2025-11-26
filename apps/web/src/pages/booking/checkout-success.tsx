import { SVGs } from '@/assets/svgs/Index';
import { Button } from '@uhomes/ui-kit';

export default function CheckoutSuccess() {
  return (
    <>
      <div className="w-[78.53%] h-[229px] mx-auto">
        <iframe
          src="https://lottie.host/embed/3bf9aba4-99cc-46e7-ad75-d85ad835c705/6M52xDtGMr.lottie"
          className="size-full"
        ></iframe>
      </div>
      <h1 className="font-semibold text-2xl leading-10.5 tracking-[0%] text-center align-middle text-[#09090B] mt-9">
        Booking Completed
      </h1>
      <p className="text-sm leading-5 tracking-[0%] text-center align-middle text-[#61646B] mt-2">
        Your payment has been received and your booking has been completed
      </p>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-x-2 items-center hover:cursor-pointer">
          <SVGs.Contact />
          <span className="text-base leading-6 tracking-[0%] align-middle text-[#09090B]">
            Call Agent
          </span>
        </div>
        <div className="h-6 border-r border-r-[#A7A7A7]" />
        <div className="flex gap-x-2 items-center hover:cursor-pointer">
          <SVGs.Download />
          <span className="text-base leading-6 tracking-[0%] align-middle text-[#09090B]">
            Download receipt
          </span>
        </div>
      </div>
      <Button className="w-full h-10.5 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] mt-9">
        <span className="font-medium text-base leading-[26px] tracking-[0%] align-middle text-white">
          Return to My Bookings
        </span>
      </Button>
    </>
  );
}
