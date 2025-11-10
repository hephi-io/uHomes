import { Button } from '@uhomes/ui-kit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@uhomes/ui-kit';
import { HostelCard } from '@/pages/students/find-hostels';
import Notification from '@/assets/svgs/notification.svg?react';
import ProfilePic from '@/assets/svgs/profile-pic.svg?react';
import Note from '@/assets/svgs/note.svg?react';
import MoneyBag from '@/assets/svgs/money-bag.svg?react';
import Building from '@/assets/svgs/building.svg?react';
import FunnelSimple from '@/assets/svgs/funnel-simple.svg?react';
import Funnel from '@/assets/svgs/funnel.svg?react';
import NoBookings from '@/assets/pngs/no-bookings.png';
import HostelImageTwo from '@/assets/pngs/hostel-image-2.png';
import HostelImage from '@/assets/pngs/hostel-image.jpg';
import Location from '@/assets/svgs/location.svg?react';
import View from '@/assets/svgs/view.svg?react';
import Download from '@/assets/svgs/download.svg?react';
import Contact from '@/assets/svgs/contact.svg?react';

export default function StudentDashboard() {
  const cards = [
    {
      id: 1,
      cardStyle: 'border-[#BFF0FC] from-[#D8F6FF] mt-6 md:mt-0',
      headingTwo: 'Active Bookings',
      Icon: Note,
      number: '4',
      headingThree: 'Awaiting review',
    },
    {
      id: 2,
      cardStyle: 'border-[#BCF5D5] from-[#C8FFDC] mt-4 md:mt-0',
      headingTwo: 'Total Spent',
      Icon: MoneyBag,
      number: '₦500,000',
      headingThree: 'Paid bookings',
    },
  ];

  const tabTriggers = [
    { id: 1, name: 'My Bookings' },
    { id: 2, name: 'Saved Properties' },
  ];

  const funnelIcons = [
    {
      id: 1,
      Icon: FunnelSimple,
      label: 'Sort By',
    },
    {
      id: 2,
      Icon: Funnel,
      label: 'Filter',
    },
  ];

  return (
    <>
      <h1 className="hidden lg:block lg:font-semibold lg:text-2xl lg:leading-[120%] lg:tracking-[0%] lg:text-black lg:px-8 lg:py-5">
        Dashboard
      </h1>
      <div className="hidden lg:block lg:border-t lg:border-[#E4E4E4]"></div>
      <div className="lg:p-8 lg:pt-11">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <ProfilePic />
            <div>
              <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-[#000000] md:text-[22px]">
                Hi, Tony 👋🏽
              </h1>
              <p className="text-[13px] leading-[120%] tracking-[0%] text-[#000000] md:text-sm mt-1">
                Ready to find your next hostel?
              </p>
            </div>
          </div>
          <div className="w-10 h-10 flex justify-center items-center rounded-full border border-[#00000033] bg-[#F8F8F8] lg:hidden">
            <Notification />
          </div>
        </div>
        <div className="hidden lg:block lg:border-t lg:border-[#E4E4E4] lg:mt-8"></div>
        <div className="md:grid md:grid-cols-2 md:gap-x-4 lg:w-[696px] md:mt-9 lg:mt-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`h-[200px] flex flex-col justify-between rounded border bg-linear-to-b to-[#FFFFFF] ${card.cardStyle} p-6`}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-sm leading-[150%] tracking-[0%] text-[#727272]">
                  {card.headingTwo}
                </h2>
                <div className="w-10 h-10 flex justify-center items-center rounded bg-white">
                  <card.Icon />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-2xl leading-[100%] tracking-[0%] text-[#09090B]">
                  {card.number}
                </h1>
                <h3 className="text-[13px] leading-[100%] tracking-[0%] text-[#71717A] mt-2.5">
                  {card.headingThree}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#E4E7EC] bg-white shadow-[0px_1px_2px_0px_#1018280D] lg:p-0 mt-4 md:mt-9 lg:mt-4">
          <div className="flex justify-between items-center md:hidden px-4 pt-4">
            <div className="flex gap-x-2 items-center">
              {funnelIcons.map((funnelIcon) => (
                <Button
                  key={funnelIcon.id}
                  variant="outline"
                  className="h-8 rounded border border-[#E4E4E4] bg-white px-3"
                >
                  <funnelIcon.Icon />
                </Button>
              ))}
            </div>
            <FindHostels />
          </div>
          <Tabs defaultValue="My Bookings" className="gap-0 mt-4 md:mt-0">
            <div className="md:flex md:justify-between md:items-center px-4 md:pt-4">
              <TabsList className="w-full h-10 rounded-md bg-[#F4F4F5] md:w-[316px] p-1 m-0">
                {tabTriggers.map((tabTrigger) => (
                  <TabsTrigger
                    key={tabTrigger.id}
                    value={tabTrigger.name}
                    className="data-[state=active]:rounded data-[state=active]:bg-white data-[state=active]:shadow-[0px_1px_3px_0px_#0000001A,0px_1px_2px_-1px_#0000001A] data-[state=active]:text-[#09090B] font-medium text-sm leading-5 tracking-[0%] text-center align-middle text-[#71717A]"
                  >
                    {tabTrigger.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="hidden md:flex md:gap-x-4 md:items-center">
                {funnelIcons.map((funnelIcon) => (
                  <Button
                    key={funnelIcon.id}
                    variant="outline"
                    className="h-[37px] gap-x-2 items-center rounded border border-[#E4E4E4] bg-white px-3"
                  >
                    <funnelIcon.Icon />
                    <span className="font-medium text-sm leading-[150%] tracking-[0%] text-black">
                      {funnelIcon.label}
                    </span>
                  </Button>
                ))}
                <FindHostels />
              </div>
            </div>
            <div className="hidden lg:block lg:border-t lg:border-t-[#E4E7EC] lg:mt-4"></div>
            <TabsContent value="My Bookings">
              <div className="px-4 pb-4 lg:pt-4">
                <div className="rounded border border-[#F4F4F4] bg-[#FDFDFD] md:h-[475px] md:flex md:flex-col md:items-center md:justify-center lg:h-[390px] p-6 mt-4 lg:m-0">
                  <img
                    src={NoBookings}
                    alt=""
                    className="w-full md:w-[364.52px] md:h-40 lg:w-[364.62px]"
                  />
                  <p className="w-fit font-medium text-sm leading-5 tracking-[0%] text-[#878FA1] mx-auto mt-9">
                    You currently have no bookings
                  </p>
                  <div className="w-fit mx-auto mt-6 md:mt-8">
                    <FindHostels />
                  </div>
                </div>
              </div>
              <div className="hidden overflow-x-scroll lg:overflow-hidden px-4 pb-4 lg:pt-4">
                <div className="w-[1337px] grid grid-cols-1 gap-4 rounded border border-[#F4F4F4] bg-[#FDFDFD] lg:w-full p-4 mt-4 lg:mt-0">
                  {[...Array(3)].map((_, i) => (
                    <HostelDetail key={i} />
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="Saved Properties" className="lg:p-4">
              <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 p-4">
                {[...Array(4)].map((_, i) => (
                  <HostelCard key={i} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function FindHostels() {
  return (
    <Button className="h-[37px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4">
      <Building />
      <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
        Find Hostels
      </span>
    </Button>
  );
}

function HostelDetail() {
  const hostelDetails = [
    {
      id: 1,
      label: 'Booking ID',
      text: 'UH-2024-001',
    },
    {
      id: 2,
      label: 'Apartment',
      text: 'Modern 2-Bedroom Hostel Near UNIZIK',
    },
    {
      id: 3,
      label: 'Designated Agent',
      text: 'Chidi Okafor',
    },
    {
      id: 4,
      label: 'Location',
      text: 'Awka, Anambra',
    },
    {
      id: 5,
      label: 'Duration',
      text: '12 months',
    },
    {
      id: 6,
      label: 'Move-Out Date',
      text: '2024-01-15',
    },
    {
      id: 7,
      label: 'Move-in Date',
      text: '2024-02-01',
    },
  ];

  const hostelDetailButtons = [
    { id: 1, Icon: View, text: 'View Property' },
    { id: 2, Icon: Download, text: 'Download Receipt' },
    { id: 3, Icon: Contact, text: 'Contact Agent' },
  ];

  return (
    <div className="border border-[#F4F4F4] bg-white p-4">
      <div className="flex gap-x-20 justify-between">
        <div className="w-[140px] shrink-0">
          <div className="h-20 rounded overflow-hidden">
            <img src={HostelImageTwo} alt="" className="w-full h-full object-fill" />
          </div>
          <div className="h-8 grid grid-cols-4 gap-1 mt-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative h-full rounded overflow-hidden">
                <img src={HostelImage} alt="" className="w-full h-full object-fill" />
                <div
                  className={
                    i === 3
                      ? 'absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center bg-[#000000CC]'
                      : 'hidden'
                  }
                >
                  <span className="font-medium text-xs leading-[100%] tracking-[0%] align-middle text-white">
                    +8
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full grid grid-cols-4 gap-x-20">
          {hostelDetails.map((hostelDetail) => (
            <div key={hostelDetail.id}>
              <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
                {hostelDetail.label}
              </span>
              <div className="flex gap-x-1.5 items-center mt-1">
                <Location className={hostelDetail.id === 4 ? '' : 'hidden'} />
                <h1 className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B]">
                  {hostelDetail.text}
                </h1>
              </div>
            </div>
          ))}
        </div>
        <div className="w-fit">
          <h1 className="font-bold text-xl leading-[100%] tracking-[0%] text-[#09090B]">
            ₦250,000
          </h1>
          <div className="h-7 flex justify-center items-center rounded-full px-4 bg-[#08AF4E4D] mt-1">
            <span className="text-[13px] leading-[100%] tracking-[0%] text-[#026F2F]">
              Confirmed
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-x-2 items-center mt-12">
        {hostelDetailButtons.map((hostelDetailButton) => (
          <Button
            key={hostelDetailButton.id}
            variant="outline"
            className="gap-x-2 rounded-lg border border-[#DCDCDC] bg-[#F8F8F9] px-4 py-2"
          >
            <hostelDetailButton.Icon />
            <span className="font-medium text-xs leading-[150%] tracking-[0%] text-[#3D3D3D]">
              {hostelDetailButton.text}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
