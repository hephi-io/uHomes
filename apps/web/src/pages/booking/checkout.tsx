import { Label, Button } from '@uhomes/ui-kit';
import DatePicker from '@/shared/date-picker';
import { SVGs } from '@/assets/svgs/Index';
import { Checkbox } from '@/components/ui/checkbox';
import HostelImage from '@/assets/pngs/hostel-image-2.png';

export default function Checkout() {
  const summaries = [
    { id: 1, item: 'Room Type ', value: 'Shared Room' },
    { id: 2, item: 'Move-in Date', value: '16/12/2025' },
    { id: 3, item: 'Move-out Date', value: '26/12/2026' },
    { id: 4, item: 'Duration', value: '12 months' },
    { id: 5, item: 'Agent', value: 'Chidi Okafor' },
  ];

  const breakdowns = [
    { id: 1, item: 'Rent', value: '₦20,000' },
    { id: 2, item: 'Service charge', value: '₦10,000' },
    { id: 3, item: 'Caution fee', value: '₦20,000' },
    { id: 4, item: 'Agreement fee (one-time)', value: '₦10,000' },
  ];

  return (
    <>
      <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-[#09090B]">
        Booking Summary
      </h1>
      {summaries.map((summary) => (
        <div
          key={summary.id}
          className={`flex justify-between items-center ${summary.id === 1 ? 'mt-9' : 'mt-4'}`}
        >
          <Text>{summary.item}</Text>
          <Text>{summary.value}</Text>
        </div>
      ))}
      <Label className="text-sm leading-[120%] tracking-[0%] align-middle text-[#09090B] mt-9 mb-4">
        Choose your inspection date/time
      </Label>
      <DatePicker />
      <div className="flex gap-x-2.5 items-center rounded-lg bg-[#EFF3FD] p-3 mt-9">
        <SVGs.Exclamation />
        <span className="text-sm leading-[120%] tracking-[0%] align-middle text-[#3E78FF]">
          Payment will be securely held in escrow until you confirm check-in.
        </span>
      </div>
      <div className="flex gap-x-2.5 mt-9">
        <Checkbox className="size-4.5 border-[#09090B]" />
        <Label className="text-sm leading-[120%] tracking-[0%] text-[#09090B]">
          I understand that my payment will be held in escrow until check-in is confirmed.
        </Label>
      </div>
      <div className="flex gap-x-2.5 mt-4">
        <Checkbox className="size-4.5 border-[#09090B]" />
        <Label className="block text-sm leading-[120%] tracking-[0%] text-[#09090B]">
          I have read and agreed to the{' '}
          <a className="underline text-[#3E78FF] hover:cursor-pointer">Terms & Conditions</a> and
          the <a className="underline text-[#3E78FF] hover:cursor-pointer">Privacy Policy</a> of
          Uhomes
        </Label>
      </div>
      <Button className="w-full h-[45px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2 mt-9">
        <SVGs.PropertyAdd />
        <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
          Proceed To Payment
        </span>
      </Button>
      <div className="h-[132px] rounded overflow-hidden mt-16">
        <img src={HostelImage} alt="" className="size-full object-cover" />
      </div>
      <h2 className="font-semibold text-lg leading-[18.19px] tracking-[0%] align-middle text-[#09090B] mt-[13px]">
        Novena Hostel, Port Harcourt
      </h2>
      <div className="flex gap-x-[6.5px] items-center mt-3">
        <SVGs.Location />
        <span className="text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B]">
          Miracle Jct, Ifite-Awka 420116, Anambra
        </span>
      </div>
      <div className="flex gap-x-4 items-center mt-3">
        <div className="flex gap-x-2 items-center">
          <SVGs.Bed />
          <span className="text-xs leading-[15.59px] tracking-[0%] align-middle text-[#09090B]">
            84 Reviews
          </span>
        </div>
        <div className="flex gap-x-1 items-center">
          <SVGs.Star />
          <span className="text-sm leading-[15.59px] tracking-[0%] align-middle text-[#09090B]">
            4.3
          </span>
        </div>
      </div>
      <div className="border-t border-t-[#DCDCDC] mt-4"></div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">
          Rent price
        </span>
        <h1 className="font-semibold text-2xl leading-10.5 tracking-[0%] align-middle text-[#09090B]">
          N240,000
        </h1>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">
          Duration
        </span>
        <span className="font-semibold text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">
          Yearly
        </span>
      </div>
      <div className="border-t border-t-[#DCDCDC] mt-4"></div>
      <h3 className="text-sm leading-6 tracking-[0%] text-center align-middle text-[#09090B] mt-4">
        Cost breakdown
      </h3>
      {breakdowns.map((breakdown) => (
        <div key={breakdown.id} className="flex justify-between items-center mt-4">
          <span className="text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">
            {breakdown.item}
          </span>
          <span className="text-sm leading-7 tracking-[0%] text-right align-middle text-[#09090B]">
            {breakdown.value}
          </span>
        </div>
      ))}
      <div className="border-t border-t-[#DCDCDC] mt-4"></div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">Total</span>
        <h1 className="font-semibold text-2xl leading-10.5 tracking-[0%] align-middle text-[#09090B]">
          N280,000
        </h1>
      </div>
      <div className="flex gap-x-2 justify-center items-center mt-12 mb-3">
        <SVGs.AiLock />
        <span className="font-semibold text-sm leading-[120%] tracking-[0%] text-[#999999]">
          Payments are secured and encrypted
        </span>
      </div>
    </>
  );
}

function Text({ children }: { children: string }) {
  return <span className="text-sm leading-[120%] tracking-[0%] text-[#09090B]">{children}</span>;
}
