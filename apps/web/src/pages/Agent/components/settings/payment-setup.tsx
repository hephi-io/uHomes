import {
  Button, Label, TextField, Popover,
  PopoverContent,
  PopoverTrigger,
  CommandGroup,
  CommandItem,
  CommandList,
  Command,
  cn,
} from "@uhomes/ui-kit";
import { Controller, useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { frameworks } from "@/pages/students/constants";

interface PaymentForm {
  account_number: string;
  account_name: string;
  select_Bank: string;
  alternative_email: string;
  emailOption: "account" | "alternative";
}

const PaymentSetup = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentForm>({
    defaultValues: {
      account_number: "",
      account_name: "",
      select_Bank: "",
      alternative_email: "",
      emailOption: "account",
    },
  });

  const emailOption = watch("emailOption");

  const onSubmit = (data: PaymentForm) => {
    setLoading(true);
    console.log("Form submitted:", data);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">

      {/* BANK INFO */}
      <div className="space-y-6 w-[880px]">
        <div>
          <h2 className="font-medium text-[#101828] text-sm mb-1">
            Bank Information
          </h2>
          <h3 className="text-[#475467] text-sm">
            Update your bank information and manage how your payments are handled across all bookings.
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            name="account_number"
            control={control}
            label="Account number"
            placeholder="1418443089"
            rules={{ required: "Account number is required" }}
          />

          <TextField
            name="account_name"
            control={control}
            label="Account name"
            placeholder="Melodie Ezeani"
            rules={{ required: "Account name is required" }}
          />

          {/* BANK SELECT */}
          <div className="flex flex-col space-y-2">
            <Label className="text-[#09090B] font-inter text-sm">Select Bank</Label>

            <Controller
              name="select_Bank"
              control={control}
              rules={{ required: "Bank is required" }}
              render={({ field }) => (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-center  cursor-pointer h-12 text-sm font-inter text-[#71717A]"
                    >
                      {field.value
                        ? frameworks.find((i) => i.value === field.value)?.label
                        : "Select Bank"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[200px] lg:w-[400px] p-0">
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
                                  "ml-auto h-4 w-4",
                                  field.value === item.value
                                    ? "opacity-100"
                                    : "opacity-0"
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

            {errors.select_Bank && (
              <p className="text-xs text-red-500">{errors.select_Bank.message}</p>
            )}
          </div>

          <div className="pt-7">
            <Button type="submit" variant="outline" className="bg-white cursor-pointer w-[188px] h-12 text-[#404D61] border px-4 py-2 leading-[100%] font-medium text-sm rounded-md" >
              {loading ?
                (<Loader2 className="size-5 mr-2 animate-spin text-white" />)
                : (<span>Save Changes</span>)
              }
            </Button>
          </div>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="w-[432px] bg-[#EFF3FD] rounded-lg py-6 px-4">
        <p className="text-[#3E78FF] font-medium text-sm">
          Your payouts will be transferred to this account once escrow is released.
        </p>
      </div>

      {/* CONTACT EMAIL */}
      <div className="space-y-6 w-[880px]">
        <div>
          <h2 className="font-medium text-[#101828] text-sm mb-1">Contact email</h2>
          <h3 className="text-[#475467] text-sm">
            Where should booking invoices be sent?
          </h3>
        </div>

        <div className="space-y-7 w-[673px]">

          {/* OPTION 1 */}
          <label className="flex gap-4 items-start cursor-pointer">
            <Controller
              name="emailOption"
              control={control}
              render={({ field }) => (
                <input
                  type="radio"
                  value="account"
                  checked={field.value === "account"}
                  onChange={field.onChange}
                  className="mt-1 h-4 w-4 border-gray-400"
                />
              )}
            />

            <div>
              <h2 className="font-medium text-sm text-[#101828] leading-[150%]">
                Send to my account email
              </h2>
              <p className="text-[#475467] text-sm leading-[150%]">
                cynthiadymphna04@gmail.com
              </p>
            </div>
          </label>

          {/* OPTION 2 */}
          <label className="flex gap-4 items-start cursor-pointer w-[673px]">
            <Controller
              name="emailOption"
              control={control}
              render={({ field }) => (
                <input
                  type="radio"
                  value="alternative"
                  checked={field.value === "alternative"}
                  onChange={field.onChange}
                  className="mt-1 h-4 w-4 border-gray-400"
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4 w-full">
              <TextField
                name="alternative_email"
                control={control}
                label="Send to an alternative email"
                placeholder="ezeanimelody@email.com"
                // disabled={emailOption !== "alternative"}
                rules={{
                  validate: (v) =>
                    emailOption === "alternative"
                      ? !!v || "Email is required"
                      : true,
                }}
              />

              <div className="pt-6">
                <Button
                  variant="outline"
                  disabled={emailOption !== "alternative"}
                  className="w-[185px] h-[38px] cursor-pointer rounded-md border border-[#D8D8D8]"
                >
                  <span className="text-sm font-medium text-[#404D61]">
                    Change email
                  </span>
                </Button>
              </div>
            </div>
          </label>

          {errors.emailOption && (
            <p className="text-xs text-red-500">{errors.emailOption.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="outline"
        className="bg-[#3E78FF] cursor-pointer w-[188px] h-12 text-white border px-4 py-2 font-medium text-sm rounded-md"
      >
        {loading ? (
          <Loader2 className="size-5 mr-2 animate-spin text-white" />
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
};

export default PaymentSetup;
