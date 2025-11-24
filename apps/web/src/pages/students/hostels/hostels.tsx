import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
} from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';
import { HostelCard } from '@/shared/hostel-card';

export function Hostels() {
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

              <SVGs.MagnifyingGlass className="absolute left-3 top-0 bottom-0 my-auto" />
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
              <SVGs.FunnelFree className="text-white" />
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
