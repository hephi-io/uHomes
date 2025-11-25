import { SVGs } from "@/assets/svgs/Index"
import { amenities, Checkboxes, frameworks, frameworks2 } from "@/pages/students/constants"
import {
    Input,
    Label,
    Button,
    Checkbox,
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
} from "@uhomes/ui-kit"
import {ChevronsUpDown } from "lucide-react"
import { useState } from "react"

const SMNewProperty = () => {
    const [roomsOpen, setRoomsOpen] = useState(false);
    const [roomsValue, setRoomsValue] = useState("");

    const [availableOpen, setAvailableOpen] = useState(false);
    const [availableValue, setAvailableValue] = useState("");

    return (
        <div className="md:hidden">
            <div className="p-4 ">
                <div className="w-11 h-11 flex items-center justify-center rounded-full border border-[#E5E5E5] p-3 cursor-pointer">
                    <SVGs.chevronDown className="w-4 h-4 text-[#737373]" />
                </div>
            </div>
            <div className="px-6 pb-12 space-y-6">
                <div className="space-y-1">
                    <h2 className="text-[#101828] font-semibold text-lg leading-[130%]">Add New Property</h2>
                    <p className="text-[#475467] font-medium text-sm leading-[120%]">List a new property for students to book</p>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label className="text-[#09090B] font-Bricolage font-normal text-sm">Property Title *</Label>
                    <Input className="border border-[#E4E4E7] rounded-md py-1 px-3 placeholder:  text-[#71717A] font-normal text-sm" placeholder="e.g., Modern 2-Bedroom Apartment" />
                </div>

                <div className="flex flex-col space-y-2">
                    <Label className="text-[#09090B] font-Bricolage font-normal text-sm">Location *</Label>
                    <Input className="border border-[#E4E4E7] rounded-md py-1 px-3 placeholder:  text-[#71717A] font-normal text-sm" placeholder="e.g., Lekki phase 1, Lagos" />
                </div>


                <div className="flex flex-col space-y-2">
                    <Label className="text-[#09090B] font-inter font-normal text-sm">Rooms Available*</Label>
                    <Popover open={availableOpen} onOpenChange={setAvailableOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={availableOpen}
                                className="justify-between font-inter text-[#71717A] text-sm font-normal"
                            >
                                {availableValue
                                    ? frameworks2.find((f) => f.value === availableValue)?.label
                                    : "3"}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className=" p-0">
                            <Command>
                                <CommandList>
                                    <CommandGroup>
                                        {frameworks2.map((f) => (
                                            <CommandItem
                                                key={f.value}
                                                value={f.value}
                                                onSelect={(currentValue) => {
                                                    setAvailableValue(currentValue);
                                                    setAvailableOpen(false);
                                                }}
                                            >
                                                {f.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                </div>


                <div className="space-y-6">
                    <div className="space-y-4">
                        <Label className="text-[#09090B] font-normal text-sm font-inter">Room Types</Label>
                        <div className="grid grid-cols-2 space-y-6">
                            {Checkboxes.map((item) => (
                                <div key={item.id} className="flex gap-3 items-center ">
                                    <Checkbox />
                                    <span className="text-[#09090B] font-inter text-sm">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid items-center grid-cols-1 gap-6">
                        <div className="flex flex-col space-y-2">
                            <Label className="text-[#09090B] font-inter font-normal text-sm">Single Room*</Label>
                            {/* <Input className="border border-[#E4E4E7] rounded-md py-1 px-3 placeholder:  text-[#71717A] font-normal text-sm" placeholder="e.g., Modern 2-Bedroom Apartment" /> */}
                            <div className="flex items-center justify-between border border-[#E4E4E7] rounded-md  px-3 py-2">
                                <span className="text-[#71717A] font-inter text-sm">150000</span>
                                <span className="text-[#09090B] font-inter text-xs">Price per Semester </span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label className="text-[#09090B] font-inter font-normal text-sm">Rooms Available*</Label>
                            <Popover open={roomsOpen} onOpenChange={setRoomsOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={roomsOpen}
                                        className="justify-between font-inter text-[#71717A] text-sm font-normal"
                                    >
                                        {roomsValue
                                            ? frameworks.find((f) => f.value === roomsValue)?.label
                                            : "150000"}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="p-0">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {frameworks.map((f) => (
                                                    <CommandItem
                                                        key={f.value}
                                                        value={f.value}
                                                        onSelect={(currentValue) => {
                                                            setRoomsValue(currentValue);
                                                            setRoomsOpen(false);
                                                        }}
                                                    >
                                                        {f.label}
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
                    <Textarea placeholder="Describe the property features, location benefits, etc." className=" h-[118px] text-[#999999] font-inter text-sm leading-[130%] border border-[#E4E4E7] rounded-xl resize-none p-3" />
                </div>

                <div className="space-y-2">
                    <Label className="text-[#09090B] font-normal text-sm font-inter">Property Images *</Label>
                    <div>
                        <div
                            className={`
          relative w-full  border-2 border-dashed rounded-xl
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

                            <div className="flex flex-col items-center space-y-4 py-[19px]">
                                <div>
                                    <SVGs.Upload className='w-10 h-10 text-blue-600' />
                                </div>
                                <p className=" text-center text-[#939393] font-normal text-sm leading-[130%]">Click to upload or drag and drop up to 10 images here.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[#09090B] font-normal text-sm font-inter">Amenities </Label>
                    <div className="grid grid-cols-2 items-center space-y-[18px] ">
                        {amenities.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <Checkbox />
                                <span className="text-[#09090B] font-inter text-sm capitalize">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between ">
                    <Button variant="outline" className="w-[131px] border border-[#E5E5E5] rounded-[6px] font-inter py-2 px-4"><span className="text-[#09090B] font-medium text-sm">Cancel</span></Button>
                    <Button
                        variant="outline"
                        className="flex gap-x-2 rounded border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
                    >
                        <SVGs.AddProperty />
                        <span className="font-medium text-sm text-white">Add Property</span>
                    </Button>
                </div>

            </div>


        </div>
    )
}

export default SMNewProperty