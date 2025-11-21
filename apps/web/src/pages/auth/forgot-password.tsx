import UHome from '@/assets/svgs/u-home.svg?react';
import { forgotPassword } from '@/services/auth';
import { Button, TextField } from '@uhomes/ui-kit';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useState } from 'react';

interface ForgotPasswordForm {
  email: string;
}
const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<ForgotPasswordForm>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    const { email } = data;
    try {
      setLoading(true);
      const response = await forgotPassword(email);
      console.log('Forgot password response:', response);

      // If the request is successful
      navigate('/auth/Verify-Account');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Uh oh! Something went wrong:', error.response?.data?.error || error.message);
      } else {
        console.error('Network error or server not responding');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center   bg-white  p-4 md:p-10 rounded-none md:rounded-2xl">
      <div className=" w-full md:p-8 mb-9">
        <div className="flex justify-center items-center">
          <div className="p-2 bg-[#EDEDED] rounded-xl">
            <UHome className="w-[46.4px] h-[45px]" />
          </div>
        </div>

        <div className="my-9">
          <div className="text-center">
            <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage">Forget Password</h2>
            <p className="pt-2 font-normal text-sm text-zinc-500">
              Enter the email linked to your account to reset your password
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

                <Button
                  type="submit"
                  variant="outline"
                  className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="size-5 mr-2 animate-spin text-white" />
                  ) : (
                    <span>Continue</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
