// import friends from '@/assets/jpgs/friends.jpg';
import FindHostelButton from './shared/find-hostel-button';
import { SVGs } from '../../../../packages/ui-kit/src/assets/svgs/Index';
// import findHostelImage from '@/assets/jpgs/find-hostel-image.jpg';
import findHostelSm from '@/assets/jpgs/find-hostel-sm.jpg';
import findHostelMd from '@/assets/jpgs/find-hostel-md.jpg';
import findHostelLg from '@/assets/jpgs/find-hostel-lg.jpg';
import friendsSm from '@/assets/jpgs/friends-sm.jpg';
import friendsMd from '@/assets/jpgs/friends-md.jpg';
import friendsLg from '@/assets/jpgs/friends-lg.jpg';

export default function About() {
  return (
    <>
      <div className="lg:flex lg:gap-x-3 px-[33px] md:px-[66px] lg:px-33">
        <div className="rounded-[20px] bg-[#F5F5F5] p-8">
          <div className="h-[173px] rounded-3xl bg-[#EAEAEA] overflow-hidden md:h-[390px]">
            <img src={friendsSm} alt="" className="size-full object-fill md:hidden" />
            <img
              src={friendsMd}
              alt=""
              className="hidden md:block md:size-full md:object-fill lg:hidden"
            />
            <img src={friendsLg} alt="" className="hidden lg:block lg:size-full lg:object-fill" />
          </div>
          <h1 className="font-medium text-2xl leading-[120%] -tracking-[0.5px] text-black md:w-[54.13%] md:text-[28px] lg:w-full lg:text-3xl my-8">
            Stay Where You Can Focus on What Truly Matters
          </h1>
          <FindHostelButton />
        </div>
        <div className="lg:grid lg:grid-cols-1 lg:gap-3">
          <div className="md:h-[229px] md:grid md:grid-cols-2 md:gap-3 lg:h-full md:mt-3 lg:mt-0">
            <div className="h-96 flex flex-col justify-between rounded-[20px] bg-[#F5F5F5] md:h-full p-8 mt-3 md:mt-0">
              <div className="w-fit flex gap-x-3 items-center rounded-full bg-white px-[13px] py-3">
                <SVGs.SecurityCheck />
                <span className="font-medium text-sm leading-[120%] -tracking-[0.5px] text-[#272525] md:text-base">
                  NIN Verified Agents
                </span>
              </div>
              <p className="font-medium text-2xl leading-[120%] -tracking-[0.5px] text-[#ABABAB] md:text-[28px] lg:text-3xl">
                <span className="text-black">Committed to your</span> privacy, security, and trust.
              </p>
            </div>
            <div className="h-96 flex flex-col justify-between rounded-[20px] bg-[#F5F5F5] md:h-full p-8 mt-3 md:mt-0">
              <div className="w-12.5 h-12 flex justify-center items-center rounded-[16.05px] bg-white shrink-0">
                <SVGs.Flash />
              </div>
              <div>
                <h1 className="font-medium text-[56px] leading-[120%] -tracking-[1px] text-black lg:text-6xl">
                  87%
                </h1>
                <p className="text-sm leading-[150%] -tracking-[0.2px] text-[#7C7C7C] mt-2">
                  of students get matched to a suitable hostel within 48 hours on U-Homes.
                </p>
              </div>
            </div>
          </div>
          <div className="h-96 flex flex-col justify-between rounded-[20px] bg-[#F5F5F5] md:h-fit lg:h-full p-8 mt-3 lg:mt-0">
            <div className="w-12.5 h-12 flex justify-center items-center rounded-[16.05px] bg-white">
              <SVGs.Clock />
            </div>
            <p className="font-medium text-2xl leading-[120%] -tracking-[0.5px] text-[#ABABAB] md:text-[28px] lg:text-3xl md:mt-2">
              <span className="text-black">
                3× higher success rate of finding verified accommodation
              </span>{' '}
              compared to walking around campus manually.
            </p>
          </div>
        </div>
      </div>
      <div className="border-y border-y-[#C4C4C4] px-[33px] md:px-16.5 lg:px-33 mt-14 md:mt-28">
        <div className="border-x border-x-[#C4C4C4] px-4 py-14 md:py-28">
          <h1 className="font-semibold text-[34px] leading-[120%] -tracking-[1.5px] text-[#282828] md:text-[44px] md:text-center lg:text-[54px] lg:leading-[63px]">
            A Better Way to Live on Campus
          </h1>
          <p className="text-sm leading-7 tracking-normal text-[#5F6980] md:text-base md:leading-7.5 md:text-center lg:w-[79.83%] lg:text-lg mt-6 lg:mx-auto">
            Finding good student accommodation shouldn’t be stressful. At U-Homes, we provide
            well-structured, safe, and fully serviced hostels that give you the comfort you need and
            the convenience you want, all within walking distance of your campus.
          </p>
          <div className="md:flex md:gap-x-7 md:justify-center md:items-center md:mt-10">
            <div className="flex gap-x-2 items-center mt-10 md:mt-0">
              <div className="size-6 flex justify-center items-center rounded-full bg-[#F6F6F6]">
                <SVGs.Check />
              </div>
              <span className="text-sm leading-6.5 tracking-normal text-[#282828] md:text-base">
                NIN Verified Agents
              </span>
            </div>
            <div className="flex gap-x-2 items-center mt-7 md:mt-0">
              <div className="size-6 flex justify-center items-center rounded-full bg-[#F6F6F6]">
                <SVGs.Check />
              </div>
              <span className="text-sm leading-6.5 tracking-normal text-[#282828] md:text-base">
                100% Secure
              </span>
            </div>
          </div>
          <div className="h-[177px] overflow-hidden md:h-[386px] lg:w-[79.83%] lg:h-[515px] mt-8.5 lg:mx-auto lg:mt-12">
            <img src={findHostelSm} className="size-full" />
            <img src={findHostelMd} className="hidden md:block md:size-full lg:hidden" />
            <img src={findHostelLg} className="hidden lg:block lg:size-full" />
          </div>
        </div>
      </div>
    </>
  );
}
