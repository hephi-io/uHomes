import { Button, Input } from '@uhomes/ui-kit';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@uhomes/ui-kit';
import MagnifyingGlass from '@/assets/svgs/magnifying-glass.svg?react';
import Funnel from '@/assets/svgs/funnel-free.svg?react';
import HostelImage from '@/assets/pngs/hostel-image.jpg';
import StarHalf from '@/assets/svgs/students/star-half.svg?react';
import Location from '@/assets/svgs/students/location.svg?react';
import Wifi from '@/assets/svgs/wifi.svg?react';
import Security from '@/assets/svgs/security.svg?react';
import Car from '@/assets/svgs/car.svg?react';
import Droplet from '@/assets/svgs/droplet.svg?react';
import Zap from '@/assets/svgs/zap.svg?react';
import View from '@/assets/svgs/view.svg?react';
import CheckmarkBadge from '@/assets/svgs/checkmark-badge.svg?react';
import SecurityOne from '@/assets/svgs/security-one.svg?react';
import Favorite from '@/assets/svgs/favorite.svg?react';

export default function FindHostels() {
  return (
    <>
      <div className="lg:px-8 lg:py-5">
        <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-black md:text-2xl lg:text-3xl">
          Find Your Perfect Hostel
        </h1>
        <p className="text-[13px] leading-[120%] tracking-[0%] text-[#71717A] md:text-sm mt-1">
          Discover verified hostels near your campus, easily, safely, and within your budget.
        </p>
      </div>
      <div className="hidden lg:block lg:border-t lg:border-t-[#E4E4E4]"></div>
      <div className="lg:p-8">
        <div className="rounded-xl border border-[#E4E4E4] md:flex md:gap-x-2.5 md:items-center lg:justify-between p-6 mt-6 md:mt-9 lg:mt-0">
          <div className="md:w-[52.16%] md:flex md:gap-x-2.5 md:items-center lg:w-[620px]">
            <div className="relative md:w-full">
              <Input
                type="search"
                placeholder="Search hostels"
                className="rounded-[5px] border border-[#E1E1E1] text-sm leading-[150%] tracking-[0%] text-[#09090B] pl-11 pr-3 py-2.5"
              />
              <MagnifyingGlass className="absolute left-3 top-0 bottom-0 my-auto" />
            </div>
            <Select>
              <SelectTrigger className="w-full rounded-[5px] border border-[#E1E1E1] text-sm leading-[100%] tracking-[0%] text-[#09090B] md:w-full px-3 py-2.5 mt-2.5 md:mt-0">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="hidden lg:flex w-full rounded-[5px] border border-[#E1E1E1] text-sm leading-[100%] tracking-[0%] text-[#09090B] px-3 py-2.5">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center md:justify-start md:gap-x-2.5 md:grow lg:grow-0 mt-2.5 md:mt-0">
            <Select>
              <SelectTrigger className="w-[39.11%] rounded-[5px] border border-[#E1E1E1] text-sm leading-[100%] tracking-[0%] text-[#09090B] md:grow lg:hidden px-3 py-2.5">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-[39.11%] gap-x-2 items-center rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] md:w-fit px-4 py-2">
              <Funnel className="text-white" />
              <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                Apply Filters
              </span>
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-[#E4E7EC] bg-white shadow-[0px_1px_2px_0px_#1018280D] mt-4">
          <div className="flex justify-between items-center px-4 pt-7.5 pb-4 lg:p-4">
            <h1 className="font-semibold text-lg leading-[120%] tracking-[0%] text-black md:text-xl">
              6 Hostels Available
            </h1>
            <Select>
              <SelectTrigger className="w-[149px] rounded border border-[#AFAFAF] text-sm leading-[100%] tracking-[0%] text-[#09090B] px-3 py-2.5">
                <SelectValue placeholder="Highest Rated" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border-t border-t-[#E4E7EC]"></div>
          <div className="lg:p-4">
            <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 p-4">
              {[...Array(6)].map((_, i) => (
                <HostelCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Badge({ Icon, text }: { Icon: any; text: string }) {
  return (
    <div className="flex gap-x-1 items-center rounded-full bg-[#F4F4F5] px-2 py-1">
      <Icon />
      <span className="text-[11px] leading-[150%] tracking-[0%] text-[#3D3D3D]">{text}</span>
    </div>
  );
}

export function HostelCard() {
  const badges = [
    { id: 1, Icon: Wifi, text: 'WiFi' },
    { id: 2, Icon: Security, text: 'Security' },
    { id: 3, Icon: Car, text: 'Parking' },
    { id: 4, Icon: Droplet, text: 'Water' },
    { id: 5, Icon: Zap, text: 'Power' },
  ];

  const topBadges = [
    { id: 1, Icon: CheckmarkBadge, text: 'Available' },
    { id: 2, Icon: SecurityOne, text: 'Verified' },
  ];

  return (
    <div className="rounded-xl border border-[#F4F4F4] bg-white overflow-hidden">
      <div className="relative h-[206px]">
        <img src={HostelImage} alt="" className="w-full h-full object-fill" />
        <div className="absolute left-4 top-4 lg:right-4 lg:flex lg:justify-between lg:items-center">
          <div className="flex gap-x-1.5 items-center">
            {topBadges.map((topBadge) => (
              <Badge key={topBadge.id} Icon={topBadge.Icon} text={topBadge.text} />
            ))}
          </div>
          <Button
            variant="outline"
            className="hidden lg:flex lg:w-7 lg:h-7 rounded-md border border-[#CECECE] bg-white"
          >
            <Favorite />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-lg leading-[120%] tracking-[0%] text-black md:text-xl">
            Premium Student Lodge
          </h1>
          <div className="flex gap-x-1 items-center">
            <StarHalf />
            <div className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-black">
              4.5 <span className="font-normal">(24)</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-x-1.5 items-center">
            <Location />
            <span className="text-xs leading-[100%] tracking-[0%] align-middle text-[#09090B]">
              5 mins from UNIZIK
            </span>
          </div>
          <div className="flex gap-x-1 items-center text-xs leading-[100%] tracking-[0%] align-middle">
            <span className="text-[#71717A]">Agent:</span>
            <span className="text-[#09090B]">Chidi Okafor</span>
          </div>
        </div>
        <div className="w-[70%] flex flex-wrap gap-2 items-center md:w-[80%] lg:w-full mt-6">
          {badges.map((badge) => (
            <Badge key={badge.id} Icon={badge.Icon} text={badge.text} />
          ))}
        </div>
        <div className="font-bold text-lg leading-[100%] tracking-[0%] text-[#09090B] md:text-xl mt-6">
          ₦250,000 <span className="font-normal text-[13px] text-[#71717A]">per semester</span>
        </div>
        <div className="flex gap-x-2 items-center mt-4">
          <Button
            variant="outline"
            className="grow rounded-[5px] border border-[#E4E4E4EE] bg-white px-4 py-2"
          >
            <span className="font-medium text-sm leading-[150%] tracking-[0%] text-[#09090B]">
              View Details
            </span>
          </Button>
          <Button variant="outline" className="rounded-md border border-[#E4E4E4] px-4 py-2">
            <View />
          </Button>
        </div>
      </div>
    </div>
  );
}
