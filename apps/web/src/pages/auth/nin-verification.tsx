import UHome from '@/assets/svgs/u-home.svg?react';
import { Button, TextField } from '@uhomes/ui-kit';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { SVGs } from '@/assets/svgs/Index';
import Blobs from '@/assets/pngs/Blobs-Wrapper.png';

interface NIN {
  nin: string;
  nationalId: File | null;
}

const NinVerification = () => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  //   const navigate = useNavigate();
  const { control, handleSubmit, setValue } = useForm<NIN>({
    defaultValues: { nin: '', nationalId: null },
  });

  // Watch the nationalId for UI
  // const nationalId = watch('nationalId');

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //         setFileName(file.name);
  //         setFileSize(file.size / (1024 * 1024)); // size in MB
  //         setValue('nationalId', file); // update react-hook-form
  //     }
  // };

  const removeFile = () => {
    setFileName(null);
    setFileSize(null);
    setValue('nationalId', null);
  };

  const onSubmit = async (data: NIN) => {
    // const { nin } = data;
    console.log(data);
    try {
      setLoading(true);
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
    <section
      className="md:flex md:min-h-screen md:justify-center md:items-center font-Bricolage
             sm:bg-none md:bg-cover md:bg-center md:bg-no-repeat"
      style={{
        backgroundImage: `url(${Blobs})`,
      }}
    >
      <section className="md:w-[494px] w-full flex  my-9 md:my-[108px] justify-center items-center   bg-white  p-4 md:p-2 rounded-none md:rounded-2xl">
        <div className=" w-full md:p-8 mb-9">
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
                      required: 'nin is required',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Enter a valid nin number',
                      },
                    }}
                  />

                  {/* File Upload */}
                  <div className="flex flex-col mt-6 mb-0">
                    <label className="font-normal text-sm text-zinc-950 mb-2  block">
                      Upload National ID Card / Slip <span className="text-red-500">*</span>
                    </label>
                    {!fileName && (
                      <div className=" relative mb-4 flex items-center justify-center border-[#E4E4E7] border bg-white rounded-md py-[34px] px-6">
                        <div className="flex flex-col space-y-3 items-center justify-center">
                          <SVGs.uIcon />
                          <div className="text-center space-y-2">
                            <p className="text-[#71717A] text-sm leading-[120%]">
                              Drag and drop your file here, or click to browse
                            </p>
                            <p className="text-[#6A7282] text-sm leading-[120%]">
                              Accepted formats: .pdf, .jpg, .jpeg, .png
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
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                      </div>
                    )}

                    {fileName && (
                      <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                        <div>
                          <span className="font-medium">{fileName}</span>
                          <span className="ml-2 text-gray-500 text-sm">
                            • {fileSize?.toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 font-bold"
                        >
                          X
                        </button>
                      </div>
                    )}

                    <div className="bg-[#FAFAFA] rounded-lg  p-3 mb-4  flex">
                      <div className="bg-[#F3F4F6] rounded-[10px] w-10 h-10 flex items-center justify-center">
                        <SVGs.Image />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-[#101828]">National_ID.jpg</p>

                          <div className="w-1.5 h-1.5 bg-[#101828] rounded-full"></div>

                          <span className="text-xs text-gray-500">1.18 MB</span>
                        </div>
                        <SVGs.XIcon className="cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="bg-[#3E78FF] text-white border border-[#E4E4E4EE] px-4 py-2 w-full font-medium text-sm rounded-[5px] cursor-pointer"
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
                {' '}
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
