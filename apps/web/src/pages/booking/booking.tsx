import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Button, Label, Input } from '@uhomes/ui-kit';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';
import { SVGs } from '@/assets/svgs/Index';
import { cn } from '@/lib/utils';
import { createBooking, type CreateBookingInput } from '@/services/booking';
import { getPropertyById, type SavedProperty } from '@/services/property';

interface BookingFormData {
  moveInDate: Date | null;
  gender: 'male' | 'female' | '';
  specialRequest: string;
}

// Controlled DatePicker component
function ControlledDatePicker({
  value,
  onChange,
  placeholder = 'select date',
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(value || undefined);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="relative flex gap-2">
      <Input
        value={value ? formatDate(value) : ''}
        placeholder={placeholder}
        readOnly
        className="text-sm leading-[100%] tracking-[0%] bg-background pr-10 cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={value || undefined}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              onChange(date || null);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Controlled Gender Combobox
function GenderCombobox({
  value,
  onChange,
}: {
  value: 'male' | 'female' | '';
  onChange: (value: 'male' | 'female') => void;
}) {
  const [open, setOpen] = useState(false);

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-md border border-[#E4E4E7] shadow-[0px_1px_2px_0px_#0000000D] px-3 py-1"
        >
          <span className="text-sm leading-[100%] tracking-[0%] text-[#71717A]">
            {value ? genders.find((gender) => gender.value === value)?.label : 'select your gender'}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search gender..." className="h-9" />
          <CommandList>
            <CommandEmpty>No gender found.</CommandEmpty>
            <CommandGroup>
              {genders.map((gender) => (
                <CommandItem
                  key={gender.value}
                  value={gender.value}
                  onSelect={() => {
                    onChange(gender.value as 'male' | 'female');
                    setOpen(false);
                  }}
                >
                  {gender.label}
                  <Check
                    className={cn('ml-auto', value === gender.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState<SavedProperty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moveOutDate, setMoveOutDate] = useState<Date>(new Date());

  const propertyId = (location.state as { propertyId?: string })?.propertyId;
  const calculatedDuration = '1 year';
  const calculatedAmount = property?.price ? property.price : 0;
  const propertyType = property?.roomType ? property.roomType : '';
  const propertyLabel =
    propertyType === 'single'
      ? 'Single Room'
      : propertyType === 'shared'
        ? 'Shared Room (2 persons)'
        : 'Self Contain';

  function addOneYear(date: Date | null): Date {
    let newDate = new Date();
    if (date) {
      newDate = new Date(date);
    }
    newDate.setFullYear(newDate.getFullYear() + 1);
    return newDate;
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      moveInDate: null,
      gender: '',
      specialRequest: '',
    },
  });

  const moveInDate = watch('moveInDate');

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError('Property ID is required');
        return;
      }

      try {
        const response = await getPropertyById(propertyId);
        if (response.data.status === 'success') {
          setProperty(response.data.data.property);
        }
      } catch (err) {
        setError('Failed to fetch property details');
        console.error(err);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Calculate duration and amount when dates change
  useEffect(() => {
    const newDate = addOneYear(moveInDate);
    setMoveOutDate(newDate);
  }, [moveInDate]);

  const onSubmit = async (data: BookingFormData) => {
    if (!propertyId || !property) {
      setError('Property information is missing');
      return;
    }

    if (!data.moveInDate) {
      setError('Please select move-in date');
      return;
    }

    if (!data.gender || (data.gender !== 'male' && data.gender !== 'female')) {
      setError('Please select your gender');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookingData: CreateBookingInput = {
        propertyid: propertyId,
        propertyType,
        moveInDate: data.moveInDate.toISOString(),
        moveOutDate: moveOutDate ? moveOutDate.toISOString() : '',
        duration: calculatedDuration,
        gender: data.gender,
        specialRequest: data.specialRequest || undefined,
        amount: calculatedAmount,
      };

      const response = await createBooking(bookingData);

      if (response.data.status === 'success') {
        // Navigate to checkout with booking data
        navigate('/students/booking/checkout', {
          state: {
            booking: response.data.data,
            property,
          },
        });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || 'Failed to create booking');
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:w-[680px] lg:rounded-xl lg:border lg:border-[#EAEAEA] lg:bg-white lg:shadow-[0px_2px_3px_1px_#0000001A] lg:p-4.5 lg:mx-auto">
      <h1 className="font-semibold text-lg leading-[130%] tracking-[0%] text-[#101828] mb-1">
        Secure Your Space
      </h1>
      <span className="font-medium text-sm leading-[120%] tracking-[0%] text-[#475467]">
        Fill in your details below to reserve a room.
      </span>

      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!property && !error && (
        <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-600">Loading property details...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-9 md:mt-9">
          <div>
            <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-9 mb-2 md:mt-0">
              Move-In Date *
            </Label>
            <Controller
              name="moveInDate"
              control={control}
              rules={{ required: 'Move-in date is required' }}
              render={({ field }) => (
                <ControlledDatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  placeholder="select move-in date"
                />
              )}
            />
            {errors.moveInDate && (
              <p className="text-xs text-red-500 mt-1">{errors.moveInDate.message}</p>
            )}
          </div>
          <div>
            <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6 mb-2 md:mt-0">
              Move-Out Date *
            </Label>
            <Input
              disabled
              type="text"
              value={moveOutDate.toDateString()}
              placeholder="Pick a date"
              className="rounded-md border border-[#E4E4E7] bg-[#F9F9F9] shadow-[0px_1px_2px_0px_#0000000D] px-3 py-1"
            />
          </div>
          <div>
            <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-9 mb-2 md:mt-0">
              Gender*
            </Label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field }) => (
                <GenderCombobox
                  value={field.value as 'male' | 'female' | ''}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
          </div>
          <div>
            <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-6 mb-2 md:mt-0">
              Duration
            </Label>
            <Input
              disabled
              type="text"
              value={calculatedDuration || 'auto-calculated'}
              placeholder="auto-calculated"
              className="rounded-md border border-[#E4E4E7] bg-[#F9F9F9] shadow-[0px_1px_2px_0px_#0000000D] px-3 py-1"
            />
          </div>
        </div>
        <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-9 mb-2">
          Property Type
        </Label>
        <Input
          disabled
          type="text"
          value={propertyLabel}
          className="rounded-md border border-[#E4E4E7] bg-[#F9F9F9] shadow-[0px_1px_2px_0px_#0000000D] px-3 py-1"
        />
        <Label className="text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-9 mb-2">
          Special Request
        </Label>
        <Controller
          name="specialRequest"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="e.g., Near window, Upper bunk"
              className="h-21.5 rounded-lg border border-[#E4E4E7] bg-white text-sm leading-[130%] tracking-[0%] align-middle text-[#999999] p-3"
            />
          )}
        />
        {calculatedAmount && (
          <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-600">
              Estimated Amount: ₦{calculatedAmount.toLocaleString()}
            </p>
          </div>
        )}
        <Button
          type="submit"
          disabled={loading || !property}
          className="w-full h-[45px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2 mt-9"
        >
          <SVGs.PropertyAdd />
          <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
            {loading ? 'Creating Booking...' : 'Proceed To Payment'}
          </span>
        </Button>
      </form>
    </div>
  );
}
