import {
  Button,
  TextField,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@uhomes/ui-kit';
import { useForm } from 'react-hook-form';
import { SVGs } from '@/assets/svgs/Index';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { agentSignup } from '@/services/auth';
import { AxiosError } from 'axios';

interface SignupForm {
  role: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    // register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      role: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (Iuser: SignupForm) => {
    const { name, email, phone, password } = Iuser;
    const payload = { fullName: name, email, phoneNumber: phone, password };

    console.log(payload);
    try {
      setLoading(true);
      const { data } = await agentSignup(payload);
      console.log('successful:', data);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        console.error('Uh oh! Something went wrong:', error.response?.data?.error || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center">
        <h2 className="font-semibold text-2xl text-zinc-950">Create an Account</h2>
        <p className="pt-2 font-normal text-sm text-zinc-500">
          Manage your property listings and bookings
        </p>
      </div>
      <div className="pt-9 space-y-6">
        {/* Role Select */}
        <div>
          <label className="font-normal text-sm text-zinc-950 leading-[100%] mb-2.5 block">
            I want to join as:
          </label>
          <Select onValueChange={(value) => setValue('role', value)} value={watch('role')}>
            <SelectTrigger className="w-full py-1 px-3 rounded-md border border-zinc-200 flex justify-between items-center bg-white">
              {' '}
              <div className="flex gap-2 items-center">
                {' '}
                <SVGs.UserView /> <SelectValue placeholder="Select your role" />{' '}
              </div>{' '}
            </SelectTrigger>{' '}
            <SelectContent className="border bg-white border-zinc-200">
              {' '}
              <SelectGroup>
                {' '}
                <SelectItem value="owner">Property Owner</SelectItem>{' '}
                <SelectItem value="agent">Agent</SelectItem>{' '}
                <SelectItem value="tenant">Tenant</SelectItem>{' '}
              </SelectGroup>{' '}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
        </div>
        {/* Full Name */}
        <TextField
          name="name"
          control={control}
          label="Full Name"
          placeholder="Enter your full name"
          rules={{ required: 'Full name is required' }}
        />

        {/* Email */}
        <TextField
          name="email"
          control={control}
          label="Email Address"
          placeholder="Enter your email address"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Enter a valid email address',
            },
          }}
        />

        {/* Phone Number */}
        <TextField
          name="phone"
          control={control}
          label="Phone Number"
          placeholder="Enter your phone number"
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^[0-9]{10,}$/,
              message: 'Enter a valid phone number',
            },
          }}
        />

        {/* Password */}
        <TextField
          name="password"
          control={control}
          label="Password"
          type="password"
          placeholder="Create a password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
        />

        {/* Confirm Password */}
        <TextField
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          rules={{
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          }}
        />

        <Button
          type="submit"
          variant="outline"
          className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-md cursor-pointer"
        >
          {loading ? (
            <Loader2 className="size-5 mr-2 animate-spin text-white" />
          ) : (
            <span>Create Account</span>
          )}
        </Button>

        {/* Terms */}
        <div className="pt-6 max-w-xs w-full mx-auto">
          <p className="font-normal text-sm text-zinc-400 text-center">
            By clicking continue, you agree to our{' '}
            <span className="underline">Terms of Service</span> and{' '}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </form>
  );
};

export default Signup;
