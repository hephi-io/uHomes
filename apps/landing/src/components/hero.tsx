import dashboardSm from '@/assets/jpgs/dashboard-sm.jpg';
import dashboardMd from '@/assets/jpgs/dashboard-md.jpg';
import dashboardLg from '@/assets/jpgs/dashboard-lg.jpg';
import FindHostelButton from './shared/find-hostel-button';

export default function Hero() {
  return (
    <>
      <div className="lg:flex">
        <div className="lg:w-[45.76%]">
          <div className="lg:w-[86.19%] mb-8">
            <h1 className="font-semibold text-[32px] leading-[120%] -tracking-[3px] text-[#171717] md:text-[64px] md:-tracking-[3.5px] md:text-center lg:text-[84px] lg:text-left">
              Your Ideal Campus Home Starts Here
            </h1>
            <p className="text-sm leading-[140%] tracking-normal text-[#5F5F5F] md:text-base md:text-center lg:text-lg lg:text-left mt-6">
              Secure, comfortable, and affordable student hostels designed to help you study, live,
              and thrive.
            </p>
          </div>
          <div className="md:w-fit md:mx-auto lg:mx-0">
            <FindHostelButton />
          </div>
          <div className="flex gap-x-2 items-center md:justify-center lg:justify-start mt-6">
            <span className="text-sm leading-5 -tracking-[1%] align-middle text-[#A3A3A3]">
              Want to talk or get a live demo?
            </span>
            <a
              href=""
              className="font-semibold text-sm leading-5 align-middle -tracking-[1%] text-[#525252]"
            >
              Get in touch <span className="tracking-[0%]">→</span>
            </a>
          </div>
        </div>
        <div className="h-[438px] rounded-[14px] overflow-hidden md:h-[821px] md:rounded-3xl lg:w-[54.24%] lg:rounded-none lg:rounded-tl-3xl lg:border-b-0 mt-6">
          <img src={dashboardSm} alt="" className="size-full object-fill md:hidden" />
          <img
            src={dashboardMd}
            alt=""
            className="hidden md:block md:size-full md:object-fill lg:hidden"
          />
          <img
            src={dashboardLg}
            alt=""
            className="hidden lg:block lg:size-full lg:object-fill outline outline-black"
          />
        </div>
      </div>
    </>
  );
}
