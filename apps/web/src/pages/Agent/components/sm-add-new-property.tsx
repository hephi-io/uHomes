import { SVGs } from '@/assets/svgs/Index';
import {
  amenities,
  Checkboxes,
  frameworks,
  type IAddNewProperty,
} from '@/pages/students/constants';
import {
  Label,
  Button,
  Textarea,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  // CommandEmpty,
  CommandGroup,
  // CommandInput,
  CommandItem,
  CommandList,
  TextField,
  cn,
} from '@uhomes/ui-kit';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProperty, updateProperty, getPropertyById } from '@/services/property';
import { useEffect } from 'react';

interface AddNewPropertyProps {
  propertyId?: string;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

const SMNewProperty = ({ propertyId, onSuccess, mode = 'create' }: AddNewPropertyProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use controlled open state if provided, otherwise use internal state
  const [loadingProperty, setLoadingProperty] = useState(false);

  const navigate = useNavigate();
  const {
    control,
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (mode === 'edit' && propertyId) {
      const loadProperty = async () => {
        setLoadingProperty(true);
        try {
          const response = await getPropertyById(propertyId);
          if (response.data.status === 'success') {
            const property = response.data.data.property;

            // Set form values
            setValue('propertyTitle', property.title);
            setValue('location', property.location);
            setValue('description', property.description);

            // Set room types
            if (property.roomTypes) {
              if (property.roomTypes.single) {
                setValue('roomTypes', 'Single Room');
              } else if (property.roomTypes.shared) {
                setValue('roomTypes', 'Shared Room');
              } else if (property.roomTypes.selfContain) {
                setValue('roomTypes', 'Self Contain');
              }
            }

            // Set rooms available
            if (property.roomsAvailable) {
              setValue('roomsAvailable', property.roomsAvailable.toString());
            }

            // Set amenities
            if (
              property.amenities &&
              typeof property.amenities === 'object' &&
              !Array.isArray(property.amenities)
            ) {
              const amenityArray: string[] = [];
              if (property.amenities.wifi) amenityArray.push('Wifi');
              if (property.amenities.kitchen) amenityArray.push('Kitchen');
              if (property.amenities.parking) amenityArray.push('Parking');
              if (property.amenities.security) amenityArray.push('Security');
              if (property.amenities.power24_7) amenityArray.push('24/7 Power');
              if (property.amenities.gym) amenityArray.push('Gym');
              setValue('amenities', amenityArray);
            }

            // Set existing images
            if (property.images && Array.isArray(property.images)) {
              const imageUrls = property.images.map((img) =>
                typeof img === 'string' ? img : img.url
              );
              setExistingImages(imageUrls);
            }
          }
        } catch {
          setErrorMessage('Failed to load property data');
        } finally {
          setLoadingProperty(false);
        }
      };
      loadProperty();
    } else if (mode === 'create') {
      // Reset form for create mode
      reset();
      setFiles([]);
      setExistingImages([]);
    }
  }, [propertyId, mode, setValue, reset]);

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
    setFiles(combined);
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

  const onSubmit = async (data: IAddNewProperty) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();

      formData.append('title', data.propertyTitle);
      formData.append('location', data.location);
      formData.append('description', data.description);

      const price = 150000;
      formData.append('pricePerSemester', price.toString());

      const roomTypesObj: Record<string, { price: number }> = {};
      const roomTypeMap: Record<string, string> = {
        'Single Room': 'single',
        'Shared Room': 'shared',
        'Self Contain': 'selfContain',
      };
      const selectedRoomType = roomTypeMap[data.roomTypes];
      if (selectedRoomType) {
        roomTypesObj[selectedRoomType] = { price };
      }
      formData.append('roomTypes', JSON.stringify(roomTypesObj));

      let roomsAvailable = 1;
      if (data.roomsAvailable) {
        const parsed = parseInt(data.roomsAvailable, 10);
        if (!isNaN(parsed)) {
          roomsAvailable = parsed;
        } else {
          const framework = frameworks.find((f) => f.value === data.roomsAvailable);

          if (framework) {
            // Try to extract number from label (e.g., "5 rooms" -> 5)
            const match = framework.label.match(/\d+/);
            if (match) {
              roomsAvailable = parseInt(match[0], 10);
            }
          }
        }
      }
      formData.append('roomsAvailable', roomsAvailable.toString());

      // Amenities - transform array of strings to object with boolean flags
      const amenitiesObj = {
        wifi: false,
        kitchen: false,
        security: false,
        parking: false,
        power24_7: false,
        gym: false,
      };

      // Map amenity strings to object keys (case-insensitive)
      const amenityMap: Record<string, keyof typeof amenitiesObj> = {
        wifi: 'wifi',
        kitchen: 'kitchen',
        parking: 'parking',
        security: 'security',
        '24/7 power': 'power24_7',
        gym: 'gym',
      };

      if (Array.isArray(data.amenities)) {
        data.amenities.forEach((amenity) => {
          const normalizedAmenity = amenity.toLowerCase().trim();
          const key = amenityMap[normalizedAmenity];
          if (key) {
            amenitiesObj[key] = true;
          }
        });
      }
      formData.append('amenities', JSON.stringify(amenitiesObj));

      // Images - append each file
      if (data.propertyImages && data.propertyImages.length > 0) {
        data.propertyImages.forEach((file) => {
          formData.append('images', file);
        });
      }

      // Call API
      if (mode === 'edit' && propertyId) {
        await updateProperty(propertyId, formData);
      } else {
        await createProperty(formData);
      }

      // Success - show success dialog and reset form
      // setShowSuccessDialog(true);
      reset();
      setFiles([]);
      setExistingImages([]);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error('Error creating property:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (error as { message?: string })?.message ||
        `Failed to ${mode === 'edit' ? 'update' : 'create'} property. Please try again.`;
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:hidden">
      <div className="p-4 ">
        <div
          className="w-11 h-11 flex items-center justify-center rounded-full border border-[#E5E5E5] p-3 cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <SVGs.chevronDown className="w-4 h-4 text-[#737373]" />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-12 space-y-6">
        <div className="space-y-1">
          <h2 className="font-semibold text-[18px] leading-[130%] text-[#101828]">
            {mode === 'edit' ? 'Edit Property' : 'Add New Property'}
          </h2>
          <p className="text-[#475467] font-medium text-sm leading-[120%]">
            {mode === 'edit'
              ? 'Update your property listing details'
              : 'List a new property for students to book'}
          </p>
        </div>

        {loadingProperty && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">Loading property data...</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

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
        <div className="flex flex-col space-y-2">
          <Label className="text-[#09090B] font-inter font-normal text-sm">Single Room *</Label>
          {/* <Input className="border border-[#E4E4E7] rounded-md py-1 px-3 placeholder:  text-[#71717A] font-normal text-sm" placeholder="e.g., Modern 2-Bedroom Apartment" /> */}
          <div className="flex items-center justify-between border border-[#E4E4E7] rounded-md  px-3 py-2">
            <span className="text-[#71717A] font-inter text-sm">150000</span>
            <span className="text-[#09090B] font-inter text-xs">Price per Semester </span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-[#09090B] font-normal text-sm font-inter">Room Types</Label>
            <div className="grid grid-cols-2 space-y-6">
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
                    className=" justify-between text-sm font-inter text-[#71717A]"
                  >
                    {field.value
                      ? frameworks.find((i) => i.value === field.value)?.label
                      : 'Select rooms'}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0">
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
                  <p className="text-[#939393] text-sm">Click to upload or drag up to 10 images.</p>
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
              {/* Preview - Existing Images (Edit Mode) */}
              {existingImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={imageUrl}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        />

        <div className="space-y-4">
          <Label className="text-[#09090B] font-normal text-sm font-inter">Amenities </Label>
          <div className="grid grid-cols-2 items-center space-y-[18px] ">
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

            {errors.amenities && <p className="text-red-500 text-xs">{errors.amenities.message}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between ">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-[131px] border border-[#E5E5E5] rounded-[6px] font-inter py-2 px-4"
          >
            <span className="text-[#09090B] font-medium text-sm">Cancel</span>
          </Button>
          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting || loadingProperty}
            className="flex gap-x-2 rounded border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
          >
            <SVGs.AddProperty />
            <span className="font-medium text-sm text-white">
              {isSubmitting
                ? mode === 'edit'
                  ? 'Updating...'
                  : 'Adding...'
                : mode === 'edit'
                  ? 'Update Property'
                  : 'Add Property'}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SMNewProperty;
