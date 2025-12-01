import { SVGs } from '@/assets/svgs/Index';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
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
  TextField,
} from '@uhomes/ui-kit';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';
import SuccessAnimation from '@/assets/pngs/Success Animation.png';
import { DialogFooter } from '@/components/ui/dialog';
import {
  amenities,
  Checkboxes,
  frameworks,
  type IAddNewProperty,
} from '@/pages/students/constants';
import { Controller, useForm } from 'react-hook-form';

const AddNewProperty = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IAddNewProperty>({
    defaultValues: {
      propertyTitle: '',
      location: '',
      roomTypes: '',
      amenities: [],
      roomsAvailable: '',
      description: '',
      propertyImages: [],
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, onChange: (files: File[]) => void) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 10);
    onChange(droppedFiles);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange?: (files: File[]) => void // optional for <Controller>
  ) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    // Prevent more than 10 images
    if (files.length + newFiles.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    const combined = [...files, ...newFiles];

    // Update local state for preview
    setFiles(combined);

    // Update react-hook-form
    setValue('propertyImages', combined, { shouldValidate: true });

    // If Controller is used, also update it
    if (onChange) {
      onChange(combined);
    }
  };

  const removeFile = (index: number, files: File[], onChange: (files: File[]) => void) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const onSubmit = (data: IAddNewProperty) => {
    console.log('FORM SUBMITTED', data);
  };

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

      <DialogContent className="md:w-[674px] md:h-[90vh] overflow-auto md:rounded-xl md:p-6 bg-white md:space-y-12">
        {/*  FORM STARTS HERE  */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:space-y-6">
          <div>
            <h2 className="font-semibold text-[18px] leading-[130%] text-[#101828]">
              Add New Property
            </h2>
            <p className="text-[#475467] font-medium text-sm leading-[120%]">
              List a new property for students to book
            </p>
          </div>

          {/* PROPERTY INFO */}
          <div className="grid items-center grid-cols-2 gap-6">
            <TextField
              name="propertyTitle"
              control={control}
              label="Property Title *"
              rules={{ required: 'Property Title is required' }}
              placeholder="e.g., Modern 2-Bedroom Apartment"
            />

            <TextField
              name="location"
              control={control}
              label="Location *"
              rules={{ required: 'Location is required' }}
              placeholder="e.g., Lekki phase 1, Lagos"
            />
          </div>

          {/* ROOM TYPES */}
          <div className="space-y-4">
            <Label className="text-[#09090B] font-normal text-sm font-inter">Room Types *</Label>

            <div className="flex items-center justify-between">
              {Checkboxes.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={item.name}
                    {...register('roomTypes', { required: 'Select 1 room type' })}
                    className="peer hidden"
                  />
                  <div className="w-4 h-4 border rounded peer-checked:bg-[#3E78FF] peer-checked:border-[#3E78FF]">
                    {/* White check mark when selected */}
                    <svg
                      className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{item.name}</span>
                </label>
              ))}
            </div>

            {errors.roomTypes && <p className="text-xs text-red-500">{errors.roomTypes.message}</p>}
          </div>

          {/* SINGLE ROOM + ROOMS AVAILABLE */}
          <div className="grid items-center grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <Label className="text-[#09090B] font-inter text-sm">Single Room *</Label>

              <div className="flex items-center justify-between border border-[#E4E4E7] rounded-md px-3 py-2">
                <span className="text-[#71717A] font-inter text-sm">150000</span>
                <span className="text-[#09090B] font-inter text-xs">Per Semester</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Label className="text-[#09090B] font-inter text-sm">Rooms Available *</Label>

              <Controller
                name="roomsAvailable"
                control={control}
                rules={{ required: 'Rooms available is required' }}
                render={({ field }) => (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between text-sm font-inter text-[#71717A]"
                      >
                        {field.value
                          ? frameworks.find((i) => i.value === field.value)?.label
                          : 'Select rooms'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {frameworks.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  field.onChange(item.value);
                                  setOpen(false);
                                }}
                                className="font-inter"
                              >
                                {item.label}

                                <Check
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value === item.value ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />

              {errors.roomsAvailable && (
                <p className="text-xs text-red-500">{errors.roomsAvailable.message}</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label className="text-[#09090B] font-normal text-sm font-inter">Description *</Label>
            <Textarea
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe the property features..."
              className="h-[86px] text-[#999999] font-inter text-sm border border-[#E4E4E7] rounded-xl resize-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description.message}</p>
            )}
          </div>

          {/* IMAGES UPLOAD */}
          <Controller
            name="propertyImages"
            control={control}
            rules={{
              required: 'Please upload at least 1 image',
              validate: (files) => files.length <= 10 || 'Maximum 10 images allowed',
            }}
            render={({ field: { onChange, value } }) => (
              <div>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, onChange)}
                  className={`
                relative w-full h-32 border-2 border-dashed rounded-xl
                transition-all duration-300 ease-in-out
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
                flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer
                ${value.length > 0 ? 'bg-green-50 border-green-400' : ''}
              `}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, onChange)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  <div className="flex flex-col items-center space-y-4">
                    <SVGs.Upload className="w-10 h-10 text-blue-600" />
                    <p className="text-[#939393] text-sm">
                      Click to upload or drag up to 10 images.
                    </p>
                    {value.length > 0 && (
                      <p className="text-xs text-green-600">{value.length} selected</p>
                    )}
                  </div>
                </div>

                {errors.propertyImages && (
                  <p className="text-red-500 text-xs mt-1">{errors.propertyImages.message}</p>
                )}

                {/* Preview */}
                {value.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {value.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(index, value, onChange)}
                          className="absolute -top-2 -right-2 bg-white shadow-md hover:bg-gray-100 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          />

          {/* AMENITIES */}
          <div className="space-y-4">
            <Label className="text-[#09090B] text-sm font-inter">Amenities *</Label>

            <div className="grid grid-cols-3 items-center space-y-[18px]">
              {amenities.map((item) => (
                <label key={item.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    value={item.name}
                    {...register('amenities', { required: 'Select at least 1 amenity' })}
                    className="hidden peer"
                  />
                  <div className="w-4 h-4 border rounded peer-checked:bg-[#3E78FF] peer-checked:border-[#3E78FF]"></div>
                  <span className="text-sm">{item.name}</span>
                </label>
              ))}

              {errors.amenities && (
                <p className="text-red-500 text-xs">{errors.amenities.message}</p>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="submit"
                className="w-[131px] border border-[#E5E5E5] rounded-[6px] font-inter py-2 px-4"
              >
                {' '}
                <span className="text-[#09090B] font-medium text-sm">Cancel</span>{' '}
              </Button>
            </DialogClose>

            {/* SUBMIT BUTTON */}
            <Button
              variant="outline"
              className="flex gap-x-2 rounded border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
            >
              <SVGs.AddProperty />
              <span className="font-medium text-sm text-white">Add Property</span>
            </Button>
          </div>
        </form>
        {/* END FORM */}
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
