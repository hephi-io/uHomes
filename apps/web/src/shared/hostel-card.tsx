import Badge from '@/shared/badge';
import { Button } from '@uhomes/ui-kit';
import { SVGs } from '@/assets/svgs/Index';
import { topBadges, badges } from '@/pages/students/constants';
import HostelImage from '@/assets/pngs/hostel-image.jpg';

export default function HostelCard() {
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
            <SVGs.Favorite />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-lg leading-[120%] tracking-[0%] text-black md:text-xl">
            Premium Student Lodge
          </h1>
          <div className="flex gap-x-1 items-center">
            <SVGs.HalfStar />
            <div className="font-semibold text-sm leading-[100%] tracking-[0%] align-middle text-black">
              4.5 <span className="font-normal">(24)</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-x-1.5 items-center">
            <SVGs.Location />
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
            <SVGs.View />
          </Button>
        </div>
      </div>
    </div>
  );
}
