import { Button, Label, Input } from '@uhomes/ui-kit';
import DatePicker from '@/shared/date-picker';
import { Combobox } from '@/shared/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SVGs } from '@/assets/svgs/Index';

import { useNavigate } from 'react-router-dom';

export default function Booking() {
  const navigate = useNavigate();

  return (
    <div className="lg:w-[680px] lg:rounded-xl lg:border lg:border-[#EAEAEA] lg:bg-white lg:shadow-[0px_2px_3px_1px_#0000001A] lg:p-4.5 lg:mx-auto">
      <h1 className="font-semibold text-lg leading-[130%] tracking-[0%] text-[#101828] mb-1">
        Secure Your Space
      </h1>
      <span className="font-medium text-sm leading-[120%] tracking-[0%] text-[#475467]">
        Fill in your details below to reserve a room.
      </span>
      <div className="md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-9 md:mt-9">
        <div>
          <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-9 mb-2 md:mt-0">
            Move-In Date *
          </Label>
          <DatePicker />
        </div>
        <div>
          <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6 mb-2 md:mt-0">
            Move-Out Date *
          </Label>
          <DatePicker />
        </div>
        <div>
          <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-9 mb-2 md:mt-0">
            Gender*
          </Label>
          <Combobox />
        </div>
        <div>
          <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6 mb-2 md:mt-0">
            Duration
          </Label>
          <Input
            disabled
            type="text"
            placeholder="auto-calculated"
            className="rounded-md border border-[#E4E4E7] bg-[#F9F9F9] shadow-[0px_1px_2px_0px_#0000000D] px-3 py-1"
          />
        </div>
      </div>
      <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-9 mb-2">
        Property Type*
      </Label>
      <Select>
        <SelectTrigger className="w-full rounded-md border border-[#E4E4E7] bg-white shadow-[0px_1px_2px_0px_#0000000D] px-3 py-1">
          <SelectValue
            placeholder="select property type"
            className="text-sm leading-[100%] tracking-[0%] text-[#71717A]"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-9 mb-2">
        Special Request *
      </Label>
      <Textarea
        placeholder="e.g., Near window, Upper bunk"
        className="h-21.5 rounded-lg border border-[#E4E4E7] bg-white text-sm leading-[130%] tracking-[0%] align-middle text-[#999999] p-3"
      />
      <Button
        onClick={() => navigate('checkout')}
        className="w-full h-[45px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2 mt-9"
      >
        <SVGs.PropertyAdd />
        <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
          Proceed To Payment
        </span>
      </Button>
    </div>
  );
}
