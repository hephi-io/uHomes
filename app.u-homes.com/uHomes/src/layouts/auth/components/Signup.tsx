import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import UserView from "@/assets/svgs/user-view.svg?react"
import EyeOff from "@/assets/svgs/eye-off.svg?react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Signup = () => {
    return (
        <div>
            <div className="text-center">
                <h2 className="font-semibold text-2xl text-zinc-950">Create an Account</h2>
                <p className="pt-2 font-normal text-sm text-zinc-500">
                    Manage your property listings and bookings
                </p>
            </div>

            <div className="pt-9">
                <div className="space-y-6">
                    {/* Role Select */}
                    <div>
                        <Label className="font-normal text-sm text-zinc-950 leading-[100%] mb-2.5 block">
                            I want to join as:
                        </Label>
                        <Select>
                            <SelectTrigger className="w-full py-1 px-3 rounded-md border border-zinc-200 flex justify-between items-center bg-white">
                                <div className="flex gap-2 items-center">
                                    <UserView />
                                    <SelectValue placeholder="Select your role" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="border bg-white border-zinc-200">
                                <SelectGroup>
                                    <SelectLabel className="font-normal text-sm text-[#09090B]">
                                        Property Owner
                                    </SelectLabel>
                                    <SelectItem value="owner">Property Owner</SelectItem>
                                    <SelectItem value="agent">Agent</SelectItem>
                                    <SelectItem value="tenant">Tenant</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Full Name */}
                    <div>
                        <Label htmlFor="name" className="font-normal text-sm text-zinc-950 mb-2.5 block">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            className="border border-zinc-200 font-normal text-sm placeholder:text-[#71717A]"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email" className="font-normal text-sm text-zinc-950 mb-2.5 block">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            className="border border-zinc-200 font-normal text-sm placeholder:text-[#71717A]"
                            placeholder="Enter your email address"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <Label htmlFor="phone" className="font-normal text-sm text-zinc-950 mb-2.5 block">
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            type="text"
                            className="border border-zinc-200 font-normal text-sm placeholder:text-[#71717A]"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2.5">
                        <Label htmlFor="password" className="font-normal text-sm text-zinc-950">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                className="w-full border border-zinc-200 font-normal text-sm placeholder:text-[#71717A] rounded-md py-2.5 pl-3 pr-10"
                                placeholder="Create a password"
                            />
                            <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 cursor-pointer" />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-2.5">
                        <Label htmlFor="confirm-password" className="font-normal text-sm text-zinc-950">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type="password"
                                className="w-full border border-zinc-200 font-normal text-sm placeholder:text-[#71717A] rounded-md py-2.5 pl-3 pr-10"
                                placeholder="Confirm your password"
                            />
                            <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 cursor-pointer" />
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="outline"
                        className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-md cursor-pointer"
                    >
                        Create Account
                    </Button>
                </div>

                {/* Terms */}
                <div className="pt-6 max-w-xs w-full mx-auto">
                    <p className="font-normal text-sm text-zinc-400 text-center">
                        By clicking continue, you agree to our{" "}
                        <span className="underline">Terms of Service</span> and{" "}
                        <span className="underline">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup
