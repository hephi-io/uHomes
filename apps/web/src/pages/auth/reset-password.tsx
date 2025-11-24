import UHome from '@/assets/svgs/u-home.svg?react';
import { Button, TextField } from '@uhomes/ui-kit';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Warning from '@/assets/svgs/warning.svg?react';
import { useState } from 'react';
import { resetPassword } from '@/services/auth';
import { Loader2 } from 'lucide-react';

interface IResetPassword {
  password: string;
  confirmPassword: string;
}
const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm<IResetPassword>({
    defaultValues: { password: '', confirmPassword: '' },
  });
  const password = watch('password');
  const token = 'ttt';
  const onSubmit = async (data: IResetPassword) => {
    const { password } = data;

    try {
      setLoading(true);
      await resetPassword(token, password, password);

      navigate('/auth/reset-password-success');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center   bg-white  p-4 md:p-10 rounded-none md:rounded-2xl">
      <div className=" w-full md:p-8">
        <div className="flex justify-center items-center">
          <div className="p-2 bg-[#EDEDED] rounded-xl">
            <UHome className="w-[46.4px] h-[45px]" />
          </div>
        </div>

        <div className="mt-9">
          <div className="text-center">
            <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage">Reset Password</h2>
            <p className="pt-2 font-normal text-sm text-zinc-500">
              Create a new password to replace the old one.
            </p>
          </div>
        </div>
        <div className="py-9">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <TextField
                name="password"
                control={control}
                label="Create new password"
                placeholder="enter password"
                type="password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
              />
              <div className="space-y-3">
                <TextField
                  name="confirmPassword"
                  control={control}
                  label="Re-enter new password"
                  type="password"
                  placeholder="Confirm your password"
                  rules={{
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  }}
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Warning />
                    <span className="text-[#5A5A5A] font-normal text-xs">
                      Password Strength : Weak
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Warning />
                    <span className="text-[#5A5A5A] font-normal text-xs">
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Warning />
                    <span className="text-[#5A5A5A] font-normal text-xs">
                      Contains a number or symbol
                    </span>
                  </div>
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
                  <span>Complete</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
