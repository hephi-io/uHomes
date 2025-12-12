import { SVGs } from "@/assets/svgs/Index";
import { Button, TextField } from "@uhomes/ui-kit";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface SettingsForm {
  First_name: string;
  Last_name: string;
  Email: string;
  Phone_number: string;
  password: string;
  confirmPassword: string;
}


const ProfileSecurity = () => {
     const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
  } = useForm<SettingsForm>({
    defaultValues: {
      First_name: "",
      Last_name: "",
      Email: "",
      Phone_number: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SettingsForm) => {
    setLoading(true);
    console.log("Form submitted:", data);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
     <div className="space-y-9">
          {/* Profile Top */}
          <div className="flex items-center gap-9">
            <div className="flex gap-3 items-center">
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <SVGs.ProfilePic />
              </div>

              <h2 className="text-[#3A374B] font-bold text-base">
                Brian Fortune
              </h2>
            </div>

            <Button
              variant="outline"
              className="w-[191px] h-[38px] gap-x-2 rounded-md border border-[#D8D8D8]"
            >
              <SVGs.ImageUpload className="w-5 h-5" />
              <span className="text-sm font-medium text-[#404D61]">
                Upload new picture
              </span>
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">

            {/* Basic Information */}
            <div className="space-y-6 w-[880px]">
              <div>
                <h2 className="font-medium text-[#101828] text-sm mb-1">
                  Basic Information
                </h2>
                <h3 className="text-[#475467] text-sm">
                  Manage your identity information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="First_name"
                  control={control}
                  label="First name"
                  placeholder="Melody"
                  rules={{ required: "First name is required" }}
                />

                <TextField
                  name="Last_name"
                  control={control}
                  label="Last name"
                  placeholder="Ezeani"
                  rules={{ required: "Last name is required" }}
                />

                <TextField
                  name="Email"
                  control={control}
                  label="Email"
                  placeholder="ezeanimelody@email.com"
                  rules={{ required: "Email is required" }}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-6 w-[880px]">
              <div>
                <h2 className="font-medium text-[#101828] text-sm mb-1">
                  Contact Number
                </h2>
                <h3 className="text-[#475467] text-sm">
                  Manage your account phone number
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="Phone_number"
                  control={control}
                  label="Phone number"
                  placeholder="+2348023456789"
                  rules={{ required: "Phone number is required" }}
                />

                <div className="pt-6">
                  <Button
                    variant="outline"
                    className="w-[185px] h-[38px]
                    rounded-md border border-[#D8D8D8]"
                  >
                    <span className="text-sm font-medium text-[#404D61]">
                      Change phone number
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {/* National ID */}
            <div className="space-y-4 w-[679px]">
              <h2 className="font-medium text-[#101828] text-sm mb-1">National ID</h2>

              <div className="bg-[#FAFAFA] rounded-lg p-3">
                <div className="flex items-center justify-between gap-4">

                  {/* File Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center">
                      <SVGs.National />
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-sm text-[#101828]">National_ID.jpg</p>

                      <div className="w-1.5 h-1.5 bg-[#101828] rounded-full"></div>

                      <span className="text-xs text-gray-500">1.18 MB</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-200 bg-yellow-50">
                    <SVGs.HalfTime className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-[#894B00]">Pending Review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-6 w-[880px]">
              <div>
                <h2 className="font-medium text-[#101828] text-sm mb-1">
                  Password
                </h2>
                <h3 className="text-[#475467] text-sm">
                  Modify your current password
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="password"
                  control={control}
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                />

                <TextField
                  name="confirmPassword"
                  control={control}
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  rules={{
                    required: "Please confirm your password",
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                className="bg-[#3E78FF] cursor-pointer w-[188px] h-12 text-white border px-4 py-2 font-medium text-sm rounded-md"
              >
                {loading ? (
                  <Loader2 className="size-5 mr-2 animate-spin text-white" />
                ) : (
                  <span>Save Changes</span>
                )}
              </Button>
            </div>
          </form>
        </div>
  )
}

export default ProfileSecurity