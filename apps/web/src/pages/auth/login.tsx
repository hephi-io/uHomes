import { useState } from 'react';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Button, TextField } from '@uhomes/ui-kit';

import { login } from '@/services/auth';
import { token } from '@/utils';

interface LoginForm {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  currentPassword: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (payload: LoginForm) => {
    const { email, password } = payload;

    try {
      setLoading(true);
      const { data } = await login({ email, password });
      token.login(data.data.token);

      // Navigate based on user type
      const userType = data.data.user?.userType?.type;

      if (userType === 'agent') {
        navigate('/agent-dashboard');
      } else if (userType === 'student') {
        navigate('/students/dashboard');
      } else {
        navigate('/agent-dashboard'); // Default fallback
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Uh oh! Something went wrong:', error.response?.data?.error || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage">Login to Account</h2>
        <p className="pt-2 font-normal text-sm text-zinc-500">
          Connect with verified agents for safe hostel rentals
        </p>
      </div>

      <div className="pt-9">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <TextField
              name="email"
              control={control}
              label="Email"
              placeholder="Enter your email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Enter a valid email address',
                },
              }}
            />

            <div className="space-y-2">
              <TextField
                name="password"
                control={control}
                label="Password"
                type="password"
                placeholder="Enter your password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
              />

              <div className="flex justify-end">
                <Link to="/auth/forgot-password" className=" text-[#71717A] font-normal text-base">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="outline"
              className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-md cursor-pointer"
            >
              {loading ? (
                <Loader2 className="size-5 mr-2 animate-spin text-white" />
              ) : (
                <span>Log In</span>
              )}
            </Button>
          </div>
        </form>

        {/* Terms */}
        <div className="mt-6 max-w-xs w-full mx-auto">
          <p className="font-normal text-sm text-zinc-400 text-center">
            By clicking continue, you agree to our{' '}
            <span className="underline">Terms of Service</span> and{' '}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
