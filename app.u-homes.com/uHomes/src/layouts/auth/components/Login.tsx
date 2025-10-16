import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EyeOff from "@/assets/svgs/eye-off.svg?react"
import { Button } from "@/components/ui/button"

const Login = () => {
  return (
    <div>
      <div className="text-center">
        <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage">Login to Account</h2>
        <p className="pt-2 font-normal text-sm text-zinc-500">
          Connect with verified agents for safe hostel rentals
        </p>
      </div>

      <div className="pt-9">
        <div className="space-y-6">

          {/* Email */}
          <div>
            <Label htmlFor="email" className="font-normal text-sm text-zinc-950 mb-2.5 block">
              Email address:
            </Label>
            <Input
              id="email"
              type="email"
              className="border border-zinc-200 font-normal text-sm placeholder:text-[#71717A]"
              placeholder="name@example.com"
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
                placeholder="enter your  password"
              />
              <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 cursor-pointer" />
            </div>
          </div>



          <Button
            type="submit"
            variant="outline"
            className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-md cursor-pointer"
          >
            Log In
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

export default Login