import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { register } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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

import { SVGs } from '@/assets/svgs/Index';

interface SignupForm {
  type: 'student' | 'agent' | 'admin';
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  university?: string;
  yearOfStudy?: '100' | '200' | '300' | '400' | '500';
}

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      type: 'agent',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      university: '',
      yearOfStudy: undefined,
    },
  });

  const password = watch('password');
  const selectedType = watch('type');

  const onSubmit = async (user: SignupForm) => {
    const { name, email, phone, password, type, university, yearOfStudy } = user;
    const payload = {
      fullName: name,
      email,
      phoneNumber: phone,
      password,
      type,
      ...(type === 'student' && { university, yearOfStudy }),
    };

    try {
      setLoading(true);
      await register(payload);
      // Store email for verification page
      localStorage.setItem('signupEmail', email);
      navigate('/auth/verify-account');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data.data.error);
        const errorMessage =
          error.response?.data?.data.error || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      console.error('Registration error:', error);
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
        {/* Type Select */}
        <div>
          <label className="font-normal text-sm text-zinc-950 leading-[100%] mb-2.5 block">
            I want to join as:
          </label>
          <Select
            onValueChange={(value) => setValue('type', value as 'student' | 'agent' | 'admin')}
            value={watch('type')}
          >
            <SelectTrigger className="w-full py-1 px-3 rounded-md border border-zinc-200 flex justify-between items-center bg-white">
              {' '}
              <div className="flex gap-2 items-center">
                {' '}
                <SVGs.UserView /> <SelectValue placeholder="Select your type" />{' '}
              </div>{' '}
            </SelectTrigger>{' '}
            <SelectContent className="border bg-white border-zinc-200">
              {' '}
              <SelectGroup>
                {' '}
                <SelectItem value="agent">Agent</SelectItem>{' '}
                <SelectItem value="student">Student</SelectItem>{' '}
              </SelectGroup>{' '}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
        </div>

        {/* Student-specific fields */}
        {selectedType === 'student' && (
          <>
            <TextField
              name="university"
              control={control}
              label="University"
              placeholder="Enter your university"
              rules={{ required: 'University is required for students' }}
            />
            <div>
              <label className="font-normal text-sm text-zinc-950 leading-[100%] mb-2.5 block">
                Year of Study
              </label>
              <Select
                onValueChange={(value) =>
                  setValue('yearOfStudy', value as '100' | '200' | '300' | '400' | '500')
                }
                value={watch('yearOfStudy')}
              >
                <SelectTrigger className="w-full py-1 px-3 rounded-md border border-zinc-200 flex justify-between items-center bg-white">
                  <SelectValue placeholder="Select year of study" />
                </SelectTrigger>
                <SelectContent className="border bg-white border-zinc-200">
                  <SelectGroup>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                    <SelectItem value="500">500 Level</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.yearOfStudy && (
                <p className="text-xs text-red-500 mt-1">{errors.yearOfStudy.message}</p>
              )}
            </div>
          </>
        )}
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
