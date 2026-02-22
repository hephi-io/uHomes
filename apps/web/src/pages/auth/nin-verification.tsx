import UHome from '@/assets/svgs/u-home.svg?react';
import { Button, TextField } from '@uhomes/ui-kit';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { SVGs } from '@/assets/svgs/Index';
import Blobs from '@/assets/pngs/Blobs-Wrapper.png';
import { verifyNin } from '@/services/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface NIN {
  nin: string;
  document: File | null; // ✅ Changed from string to File
}

const NinVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NIN>({
    defaultValues: { nin: '', document: null },
  });

  const removeFile = () => {
    setFileName(null);
    setFileSize(null);
    setValue('document', null);
  };

  const onSubmit = async (data: NIN) => {
    const { nin, document } = data;

    if (!document) return;
    try {
      setLoading(true);
      await verifyNin(nin, document);
      toast.success('NIN verified successfully!');
      navigate('/agent-dashboard');
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'NIN verification failed. Please check your details and try again.';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      console.error('NIN verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="md:flex md:min-h-screen md:justify-center md:items-center font-Bricolage
             sm:bg-none md:bg-cover md:bg-center md:bg-no-repeat"
      style={{
        backgroundImage: `url(${Blobs})`,
      }}
    >
      <section className="md:w-[494px] w-full flex my-9 md:my-[108px] justify-center items-center bg-white p-4 md:p-2 rounded-none md:rounded-2xl">
        <div className="w-full md:p-8 mb-9">
          <div className="flex justify-center items-center">
            <div className="p-2 bg-[#EDEDED] rounded-xl">
              <UHome className="w-[46.4px] h-[45px]" />
            </div>
          </div>

          <div className="my-9 space-y-4">
            <div className="text-center">
              <h2 className="font-semibold text-2xl text-zinc-950 font-Bricolage">
                Complete NIN Verification
              </h2>
              <p className="pt-2 font-normal text-sm text-zinc-500">
                As part of our compliance and security standards, agents are required to verify
                their NIN
              </p>
            </div>

            <div className="pt-9">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <TextField
                    name="nin"
                    control={control}
                    label="NIN Number:"
                    placeholder="Enter your 11 digit NIN"
                    rules={{
                      required: 'NIN is required',
                      pattern: {
                        value: /^\d{11}$/,
                        message: 'NIN must be exactly 11 digits',
                      },
                    }}
                  />

                  {/* File Upload */}
                  <div className="flex flex-col mt-6 mb-0">
                    <label className="font-normal text-sm text-zinc-950 mb-2 block">
                      Upload National ID Card / Slip <span className="text-red-500">*</span>
                    </label>
                    {!fileName && (
                      <div
                        className={`relative flex items-center justify-center border bg-white rounded-md py-[34px] px-6 ${
                          errors.document?.message
                            ? 'border-red-500'
                            : 'border-[#E4E4E7] focus:border-[#4F61E8]'
                        }`}
                      >
                        <div className="flex flex-col space-y-3 items-center justify-center">
                          <SVGs.uIcon />
                          <div className="text-center space-y-2">
                            <p className="text-[#71717A] text-sm leading-[120%]">
                              Drag and drop your file here, or click to browse
                            </p>
                            <p className="text-[#6A7282] text-sm leading-[120%]">
                              Accepted formats: .jpg, .jpeg, .png only
                            </p>
                            <p className="text-[#6A7282] text-sm leading-[120%]">
                              Maximum file size: 5 MB
                            </p>
                          </div>
                          <div className="py-[3.5px] cursor-pointer">
                            <div className="border bg-white border-[#D8D8D8] rounded-[6px] py-3 px-4">
                              <span className="text-[#404D61] font-medium text-sm leading-[100%]">
                                Browse files
                              </span>
                            </div>
                          </div>
                        </div>

                        <Controller
                          name="document"
                          control={control}
                          rules={{
                            required: 'Document is required',
                            validate: {
                              fileType: (value) => {
                                if (!value) return true;
                                const file = value as File;
                                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

                                if (!allowedTypes.includes(file.type)) {
                                  return 'Only image files (.jpg, .jpeg, .png) are allowed';
                                }
                                return true;
                              },
                              fileSize: (value) => {
                                if (!value) return true;
                                const file = value as File;
                                const maxSize = 5 * 1024 * 1024; // 5MB in bytes

                                if (file.size > maxSize) {
                                  return 'File size must not exceed 5 MB';
                                }
                                return true;
                              },
                            },
                          }}
                          render={({ field }) => (
                            <>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    // Validate file type manually as well
                                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

                                    if (!allowedTypes.includes(file.type)) {
                                      // Clear the field and show error
                                      field.onChange(null);
                                      setFileName('');
                                      setFileSize(0);
                                      toast.error('File too large! Maximum file size is 5 MB.');
                                      // Trigger validation error
                                      return;
                                    }

                                    // Validate file size
                                    const maxSize = 5 * 1024 * 1024; // 5MB
                                    if (file.size > maxSize) {
                                      field.onChange(null);
                                      setFileName('');
                                      setFileSize(0);
                                      return;
                                    }

                                    // If valid, update state
                                    setFileName(file.name);
                                    setFileSize(file.size / (1024 * 1024));
                                    field.onChange(file);
                                  }
                                }}
                              />
                            </>
                          )}
                        />
                      </div>
                    )}
                    {errors.document?.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.document?.message}</p>
                    )}

                    {fileName && (
                      <div className="bg-[#FAFAFA] rounded-lg p-3 mb-4 flex gap-3">
                        <div className="bg-[#F3F4F6] rounded-[10px] w-10 h-10 flex items-center justify-center shrink-0">
                          <SVGs.Image />
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-[#101828] truncate max-w-[150px]">
                              {fileName}
                            </p>

                            <div className="w-1.5 h-1.5 bg-[#101828] rounded-full"></div>

                            <span className="text-xs text-gray-500">{fileSize?.toFixed(2)} MB</span>
                          </div>
                          <SVGs.XIcon className="cursor-pointer shrink-0" onClick={removeFile} />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="bg-[#3E78FF] mt-4 text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="size-5 mr-2 animate-spin text-white" />
                    ) : (
                      <span>Verify</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            <div className="pt-2">
              <p className="text-[#0F60FF] text-center text-sm leading-[100%]">
                All data is encrypted and processed securely in compliance with NIMC verification
                guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default NinVerification;
