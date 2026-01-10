import {
  Button,
  Label,
  TextField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  CommandGroup,
  CommandItem,
  CommandList,
  Command,
  cn,
} from '@uhomes/ui-kit';
import { Controller, useForm } from 'react-hook-form';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { nigerianBanks } from '@/constants/banks';
import { getCurrentUser, updatePaymentSetup } from '@/services/auth';
import { useAuth } from '@/contexts/auth-context';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface PaymentForm {
  account_number: string;
  account_name: string;
  select_Bank: string;
  alternative_email: string;
  emailOption: 'account' | 'alternative';
}

const PaymentSetup = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [open, setOpen] = useState(false);
  const { user, refreshUser } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentForm>({
    defaultValues: {
      account_number: '',
      account_name: '',
      select_Bank: '',
      alternative_email: '',
      emailOption: 'account',
    },
  });

  const emailOption = watch('emailOption');

  // Fetch user data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);
        const { data: userResponse } = await getCurrentUser();
        const userData = userResponse.data;

        // Determine email option based on whether alternative email exists
        const hasAlternativeEmail = !!userData.alternativeEmail;
        const emailOptionValue = hasAlternativeEmail ? 'alternative' : 'account';

        // Populate form with user data
        reset({
          account_number: userData.accountNumber || '',
          account_name: userData.accountName || '',
          select_Bank: userData.bank || '',
          alternative_email: userData.alternativeEmail || '',
          emailOption: emailOptionValue,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Failed to load user data';
          toast.error(errorMessage);
        } else {
          toast.error('An unexpected error occurred');
        }
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [reset]);

  const onSubmit = async (data: PaymentForm) => {
    try {
      setLoading(true);

      // Prepare payload based on email option
      const payload: {
        accountNumber?: string;
        accountName?: string;
        bank?: string;
        alternativeEmail?: string;
      } = {
        accountNumber: data.account_number || undefined,
        accountName: data.account_name || undefined,
        bank: data.select_Bank || undefined,
      };

      // Only include alternative email if that option is selected
      if (data.emailOption === 'alternative') {
        payload.alternativeEmail = data.alternative_email || undefined;
      } else {
        // Clear alternative email if account email is selected
        payload.alternativeEmail = undefined;
      }

      await updatePaymentSetup(payload);

      // Refresh user data
      await refreshUser();

      toast.success('Payment setup updated successfully');
    } catch (error) {
      console.error('Error updating payment setup:', error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to update payment setup';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-[#3E78FF]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">
      {/* BANK INFO */}
      <div className="space-y-6 w-[880px]">
        <div>
          <h2 className="font-medium text-[#101828] text-sm mb-1">Bank Information</h2>
          <h3 className="text-[#475467] text-sm">
            Update your bank information and manage how your payments are handled across all
            bookings.
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            name="account_number"
            control={control}
            label="Account number"
            placeholder="1418443089"
            rules={{ required: 'Account number is required' }}
          />

          <TextField
            name="account_name"
            control={control}
            label="Account name"
            placeholder="Melodie Ezeani"
            rules={{ required: 'Account name is required' }}
          />

          {/* BANK SELECT */}
          <div className="flex flex-col space-y-2">
            <Label className="text-[#09090B] font-inter text-sm">Select Bank</Label>

            <Controller
              name="select_Bank"
              control={control}
              rules={{ required: 'Bank is required' }}
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
                        ? nigerianBanks.find((i) => i.value === field.value)?.label
                        : 'Select Bank'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[200px] lg:w-[400px] p-0">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {nigerianBanks.map((item) => (
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

            {errors.select_Bank && (
              <p className="text-xs text-red-500">{errors.select_Bank.message}</p>
            )}
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
          <h3 className="text-[#475467] text-sm">Where should booking invoices be sent?</h3>
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
                  checked={field.value === 'account'}
                  onChange={field.onChange}
                  className="mt-1 h-4 w-4 border-gray-400"
                />
              )}
            />

            <div>
              <h2 className="font-medium text-sm text-[#101828] leading-[150%]">
                Send to my account email
              </h2>
              <p className="text-[#475467] text-sm leading-[150%]">{user?.email || 'N/A'}</p>
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
                  checked={field.value === 'alternative'}
                  onChange={field.onChange}
                  className="mt-1 h-4 w-4 border-gray-400"
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col space-y-2">
                <Label className="text-[#09090B] font-inter text-sm">
                  Send to an alternative email
                </Label>
                <Controller
                  name="alternative_email"
                  control={control}
                  rules={{
                    required: emailOption === 'alternative' ? 'Email is required' : false,
                    pattern:
                      emailOption === 'alternative'
                        ? {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address',
                          }
                        : undefined,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="ezeanimelody@email.com"
                      disabled={emailOption !== 'alternative'}
                      className={`h-12 px-4 rounded-md border border-[#E5E5E5] text-sm font-inter text-[#09090B] focus:outline-none focus:ring-2 focus:ring-[#3E78FF] focus:border-transparent ${
                        emailOption !== 'alternative'
                          ? 'bg-gray-100 cursor-not-allowed opacity-60'
                          : 'bg-white'
                      }`}
                    />
                  )}
                />
                {errors.alternative_email && (
                  <p className="text-xs text-red-500">{errors.alternative_email.message}</p>
                )}
              </div>

              <div className="pt-6">
                <Button
                  variant="outline"
                  disabled={emailOption !== 'alternative'}
                  className="w-[185px] h-[38px] cursor-pointer rounded-md border border-[#D8D8D8]"
                >
                  <span className="text-sm font-medium text-[#404D61]">Change email</span>
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
        disabled={loading}
        className="bg-[#3E78FF] cursor-pointer w-[188px] h-12 text-white border px-4 py-2 font-medium text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 mr-2 animate-spin text-white" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
};

export default PaymentSetup;
