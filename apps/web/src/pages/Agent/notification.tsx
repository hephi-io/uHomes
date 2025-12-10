import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@uhomes/ui-kit';
import { SVGs } from '@/assets/svgs/Index';
const Notification = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="hidden w-10 h-10 justify-center items-center rounded-full border border-[#00000033] bg-[#F8F8F8] lg:flex">
          <SVGs.Notification />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="py-6 rounded-xl w-[675px]">
        <div className="px-4 flex justify-between items-center">
          <h2 className="text-[#09090B] font-semibold text-2xl leading-[120%]">Notifications</h2>
          <DropdownMenuItem className="flex  gap-1.5 items-center">
            <span className="text-[#26203B] text-[13px]">clear all</span>
            <SVGs.XIcon className="w-[13px] h-[13px]" />
          </DropdownMenuItem>
        </div>

        <div className="border-y border-[#0000001A] flex justify-between items-center p-4 my-3">
          <div className="flex justify-between items-center gap-3">
            <div className="border border-[#3E78FF] rounded-4xl bg-[#3E78FF17] py-1.5 px-2 flex gap-2 items-center ">
              <span className="text-[#3E78FF] font-medium text-sm leading-6">All</span>
              <p className="rounded-[12px] bg-[#3E78FF] border-[#00000000] py-1 px-2  text-sm leading-4 text-white">
                {' '}
                10
              </p>
            </div>
            <p className="text-[#71717A] text-sm leading-6">Unread (36)</p>
            <p className="text-[#71717A] text-sm leading-6">Bookings (14)</p>
            <p className="text-[#71717A] text-sm leading-6">Transactions (22)</p>
          </div>

          <Button className="rounded-xl  border  border-[#0000001A] hover:bg-white cursor-pointer py-1 px-2 flex items-center gap-2 bg-white">
            <span className="text-[#09090B] text-xs leading-5">Mark all read</span>
            <SVGs.Marked className="w-3 h-3" />
          </Button>
        </div>

        <div className="py-3 px-4 space-y-4">
          <div className="space-y-3">
            <p className="text-[#71717A] text-sm">Today</p>
            <div className="border border-[#0000000F] rounded-xl p-3 flex gap-4 items-start">
              <div className="relative w-[34px] h-[34px] rounded-3xl flex justify-center items-center p-2 bg-[#3E78FF]">
                {/* LETTER OR ICON */}
                <span className="text-white text-base leading-[18px]">A</span>

                {/* BADGE */}
                <div className="absolute  -right-2.5 -bottom-1.5 bg-[#EEE5F5]  w-[22px] h-[22px] rounded-full  flex justify-center items-center">
                  <SVGs.miniHouse className="w-3 h-3 text-[#8C31DC]" />
                </div>
              </div>

              {/* New Booking Request */}
              <div className="space-y-4 w-full">
                <div className="flex justify-between  items-center ">
                  <div className="flex items-center gap-2.5 whitespace-nowrap ">
                    <h2 className="capitalize text-[#09090B] font-semibold text-sm leading-[18px]">
                      New Booking Request
                    </h2>

                    {/* Notification Dot */}
                    <div className="w-3 h-3 bg-[#3E78FF] rounded-full"></div>
                  </div>

                  <p className="text-[#71717A] text-sm leading-[18px] capitalize">Dec 1st</p>
                </div>

                <p className="text-[#09090B] text-sm leading-6">
                  A student has submitted a booking request for Novena Hostel — Single Room. Review
                  and approve it.
                </p>
              </div>
            </div>
            <div className="border border-[#0000000F] rounded-xl p-3 flex gap-4 items-start">
              <div className="relative w-[34px] h-[34px] rounded-3xl flex justify-center items-center p-2 bg-[#3E78FF]">
                <span className="text-white text-base leading-[18px]">A</span>
                <div className="absolute  -right-2.5 -bottom-1.5 bg-[#F0F9F6]  w-[22px] h-[22px] rounded-full  flex justify-center items-center">
                  <SVGs.Published className="w-3 h-3" />
                </div>
              </div>
              <div className="space-y-4 w-full">
                <div className="flex justify-between  items-center  ">
                  <div className="flex items-center gap-2.5 whitespace-nowrap ">
                    <h2 className="capitalize text-[#09090B] font-semibold text-sm leading-[18px]">
                      Listing Successfully Published
                    </h2>
                    <div className="w-3 h-3 bg-[#3E78FF] rounded-full"></div>
                  </div>
                  <p className="text-[#71717A] text-sm leading-[18px] capitalize">Dec 1st</p>
                </div>
                <p className="text-[#09090B] text-sm leading-6">
                  Your property Serenity Lodge Hostel is now live and visible to students.
                </p>
              </div>
            </div>
            <div className="border border-[#0000000F] rounded-xl p-3 flex gap-4 items-start">
              <div className="relative w-[34px] h-[34px] rounded-3xl flex justify-center items-center p-2 bg-[#3E78FF]">
                <span className="text-white text-base leading-[18px]">A</span>
                <div className="absolute  -right-2.5 -bottom-1.5 bg-[#F0F9F6]  w-[22px] h-[22px] rounded-full  flex justify-center items-center">
                  <SVGs.CreditCard className="w-3 h-3" />
                </div>
              </div>
              <div className="space-y-4 w-full">
                <div className="flex justify-between  items-center  ">
                  <div className="flex items-center gap-2.5 whitespace-nowrap ">
                    <h2 className="capitalize text-[#09090B] font-semibold text-sm leading-[18px]">
                      Escrow Payment Confirmed
                    </h2>
                    <div className="w-3 h-3 bg-[#3E78FF] rounded-full"></div>
                  </div>
                  <p className="text-[#71717A] text-sm leading-[18px] capitalize">Nov 29th</p>
                </div>
                <p className="text-[#09090B] text-sm leading-6">
                  Payment for booking <span className="font-bold">#BK20261104-108</span> has been
                  have been released to your account.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-3 px-4 space-y-4">
          <div className="space-y-3">
            <p className="text-[#71717A] text-sm">Last 7 days</p>
            <div className="border border-[#0000000F] rounded-xl p-3 flex gap-4 items-start">
              <div className="relative w-[34px] h-[34px] rounded-3xl flex justify-center items-center p-2 bg-[#3E78FF]">
                {/* LETTER OR ICON */}
                <span className="text-white text-base leading-[18px]">R</span>

                {/* BADGE */}
                <div className="absolute  -right-2.5 -bottom-1.5 bg-[#FFFDF3]  w-[22px] h-[22px] rounded-full  flex justify-center items-center">
                  <SVGs.StartOutline className="w-3 h-3 text-[#8C31DC]" />
                </div>
              </div>

              {/* New Booking Request */}
              <div className="space-y-4 w-full">
                <div className="flex justify-between  items-center ">
                  <div className="flex items-center gap-2.5 whitespace-nowrap ">
                    <h2 className="capitalize text-[#09090B] font-semibold text-sm leading-[18px]">
                      New Review Received
                    </h2>

                    {/* Notification Dot */}
                    <div className="w-3 h-3 bg-[#3E78FF] rounded-full"></div>
                  </div>

                  <p className="text-[#71717A] text-sm leading-[18px] capitalize">Dec 1st</p>
                </div>

                <p className="text-[#09090B] text-sm leading-6">
                  A student left a rating for Novena Hostel. Tap to view the feedback.
                </p>
              </div>
            </div>

            <div className="border border-[#0000000F] rounded-xl p-3 flex gap-4 items-start">
              <div className="relative w-[34px] h-[34px] rounded-3xl flex justify-center items-center p-2 bg-[#3E78FF]">
                <span className="text-white text-base leading-[18px]">A</span>
                <div className="absolute  -right-2.5 -bottom-1.5 bg-[#F0F9F6]  w-[22px] h-[22px] rounded-full  flex justify-center items-center">
                  <SVGs.CreditCard className="w-3 h-3" />
                </div>
              </div>
              <div className="space-y-4 w-full">
                <div className="flex justify-between  items-center  ">
                  <div className="flex items-center gap-2.5 whitespace-nowrap ">
                    <h2 className="capitalize text-[#09090B] font-semibold text-sm leading-[18px]">
                      Escrow Payment Confirmed
                    </h2>
                    <div className="w-3 h-3 bg-[#3E78FF] rounded-full"></div>
                  </div>
                  <p className="text-[#71717A] text-sm leading-[18px] capitalize">Nov 29th</p>
                </div>
                <p className="text-[#09090B] text-sm leading-6">
                  Payment for booking <span className="font-bold">#BK20261104-108</span> has been
                  secured in escrow. You can now proceed with approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
