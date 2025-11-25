import { SVGs } from '@/assets/svgs/Index';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTrigger,
  Input,
  Label,
  Textarea,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  DialogClose,
  // CommandEmpty,
  CommandGroup,
  // CommandInput,
  CommandItem,
  CommandList,
  cn,
} from '@uhomes/ui-kit';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import SuccessAnimation from '@/assets/pngs/Success Animation.png';
import { DialogFooter } from '@/components/ui/dialog';
import { amenities, Checkboxes, frameworks } from '@/pages/students/constants';

const AddNewProperty = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="outline"
          className="flex gap-x-2 rounded border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
        >
          <SVGs.AddProperty />
          <span className="font-medium text-sm text-white">Add Property</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[674px] md:h-[90vh] overflow-auto  md:rounded-xl md:p-6 bg-white md:space-y-12">
        <div className="md:space-y-6">
          <div>
            <h2 className="font-semibold text-[18px] leading-[130%] text-[#101828]">
              Add New Property
            </h2>
            <p className="text-[#475467] font-medium text-sm leading-[120%]">
              List a new property for students to book
            </p>
          </div>
          <div className="grid items-center grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <Label className="text-[#09090B] font-inter font-normal text-sm">
                Property Title *
              </Label>
              <Input
                className="border border-[#E4E4E7] rounded-md py-1 px-3 placeholder:  text-[#71717A] font-normal text-sm"
                placeholder="e.g., Modern 2-Bedroom Apartment"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-[#09090B] font-inter font-normal text-sm">Location *</Label>
              <Input
                className="border border-[#E4E4E7] rounded-md py-1 px-3 placeholder:  text-[#71717A] font-normal text-sm"
                placeholder="e.g., Lekki phase 1, Lagos"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[#09090B] font-normal text-sm font-inter">Room Types</Label>
              <div className="flex items-center justify-between">
                {Checkboxes.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center ">
                    <Checkbox />
                    <span className="text-[#09090B] font-inter text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid items-center grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label className="text-[#09090B] font-inter font-normal text-sm">
                  Single Room*
                </Label>
                {/* <Input className="border border-[#E4E4E7] rounded-md py-1 px-3 placeholder:  text-[#71717A] font-normal text-sm" placeholder="e.g., Modern 2-Bedroom Apartment" /> */}
                <div className="flex items-center justify-between border border-[#E4E4E7] rounded-md  px-3 py-2">
                  <span className="text-[#71717A] font-inter text-sm">150000</span>
                  <span className="text-[#09090B] font-inter text-xs">Price per Semester </span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Label className="text-[#09090B] font-inter font-normal text-sm">
                  Rooms Available*
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between font-inter text-[#71717A] text-sm font-normal"
                    >
                      {value
                        ? frameworks.find((framework) => framework.value === value)?.label
                        : '3'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      {/* <CommandInput placeholder="Search framework..." className="h-9" /> */}
                      <CommandList>
                        {/* <CommandEmpty>No framework found.</CommandEmpty> */}
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              className="font-inter"
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? '' : currentValue);
                                setOpen(false);
                              }}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  value === framework.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#09090B] font-normal text-sm font-inter">Description *</Label>
            <Textarea
              placeholder="Describe the property features, location benefits, etc."
              className=" h-[86px] text-[#999999] font-inter text-sm leading-[130%] border border-[#E4E4E7] rounded-xl resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#09090B] font-normal text-sm font-inter">
              Property Images *
            </Label>
            <div>
              <div
                className={`
          relative w-full h-[120px] border-2 border-dashed rounded-xl
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center
          bg-[#FAFAFA] cursor-pointer
        `}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="flex flex-col items-center space-y-4">
                  <div>
                    <SVGs.Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-[#939393] font-normal text-sm leading-[130%]">
                    Click to upload or drag and drop up to 10 images here.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Label className="text-[#09090B] font-normal text-sm font-inter">Amenities </Label>
            <div className="grid grid-cols-3 items-center space-y-[18px] ">
              {amenities.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox />
                  <span className="text-[#09090B] font-inter text-sm capitalize">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-[131px] border border-[#E5E5E5] rounded-[6px] font-inter py-2 px-4"
            >
              <span className="text-[#09090B] font-medium text-sm">Cancel</span>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <ListingAddedSuccessfully />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewProperty;

export const ListingAddedSuccessfully = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-x-2 rounded border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
        >
          <SVGs.AddProperty />
          <span className="font-medium text-sm text-white">Add Property</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[443px] rounded-[10px] border-2 border-[#3E78FF0D] bg-white p-6 space-y-9">
        {/* Image */}
        <div className="w-[256px] h-[229px] mx-auto">
          <img
            src={SuccessAnimation}
            alt="Listing Added Successfully"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="w-[394px] space-y-2 mx-auto text-center">
          <h2 className="text-[#09090B] font-semibold text-2xl leading-[42px]">
            Listing Added Successfully
          </h2>
          <p className="text-[#61646B] font-normal text-sm leading-5">
            You have successfully created a new property listing. You can now monitor bookings from
            your dashboard.
          </p>
        </div>

        {/* Button */}
        <DialogFooter>
          <Button
            variant="outline"
            className="w-full bg-[#3E78FF] hover:bg-[#3E78FF] border border-[#E4E4E4EE] py-2 px-4 rounded-[5px]"
          >
            <span className="text-white  font-medium text-base leading-[26px]">
              Return to My Listings
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
