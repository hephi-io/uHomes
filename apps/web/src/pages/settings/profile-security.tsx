import { SVGs } from '@/assets/svgs/Index';
import { Button, TextField } from '@uhomes/ui-kit';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
  getCurrentUser,
  updateUser,
  getNINVerificationStatus,
  uploadProfilePicture,
  type TNINVerificationStatus,
} from '@/services/auth';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

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
  const [fetchingData, setFetchingData] = useState(true);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const { user, refreshUser } = useAuth();
  const [ninStatus, setNinStatus] = useState<TNINVerificationStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { control, handleSubmit, reset, watch } = useForm<SettingsForm>({
    defaultValues: {
      First_name: '',
      Last_name: '',
      Email: '',
      Phone_number: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Fetch user data and NIN status on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);

        // Fetch current user data
        const { data: userResponse } = await getCurrentUser();
        const userData = userResponse.data;

        // Split fullName into first and last name
        const nameParts = userData.fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Populate form with user data
        reset({
          First_name: firstName,
          Last_name: lastName,
          Email: userData.email,
          Phone_number: userData.phoneNumber,
          password: '',
          confirmPassword: '',
        });

        // Fetch NIN verification status
        try {
          const { data: ninResponse } = await getNINVerificationStatus();
          setNinStatus(ninResponse.data);
        } catch (error) {
          // NIN status might not be available for all users, so we don't show error
          console.warn('NIN verification status not available:', error);
        }
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

  const onSubmit = async (data: SettingsForm) => {
    if (!user?._id) {
      toast.error('User not found. Please try logging in again.');
      return;
    }

    // Validate password match if passwords are provided
    if (data.password || data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (data.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }

    try {
      setLoading(true);

      // Prepare update payload
      const updatePayload: {
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        password?: string;
      } = {};

      // Only include fields that have changed
      const fullName = `${data.First_name} ${data.Last_name}`.trim();
      if (fullName !== user.fullName) {
        updatePayload.fullName = fullName;
      }
      if (data.Email !== user.email) {
        updatePayload.email = data.Email;
      }
      if (data.Phone_number !== user.phoneNumber) {
        updatePayload.phoneNumber = data.Phone_number;
      }
      if (data.password) {
        updatePayload.password = data.password;
      }

      // Only make API call if there are changes
      if (Object.keys(updatePayload).length === 0) {
        toast.success('No changes to save');
        setLoading(false);
        return;
      }

      // Update user
      await updateUser(user._id, updatePayload);

      // Refresh user data in auth context
      await refreshUser();

      // Clear password fields after successful update
      reset({
        ...data,
        password: '',
        confirmPassword: '',
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to update profile';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size too large. Please upload an image smaller than 5MB.');
      return;
    }

    try {
      setUploadingPicture(true);
      await uploadProfilePicture(file);

      // Refresh user data to get updated profile picture
      await refreshUser();

      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to upload profile picture';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-[#3E78FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-9">
      {/* Profile Top */}
      <div className="flex items-center gap-9">
        <div className="flex gap-3 items-center">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <SVGs.ProfilePic />
            )}
          </div>

          <h2 className="text-[#3A374B] font-bold text-base">{user?.fullName || 'User'}</h2>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handlePictureUpload}
          className="hidden"
          disabled={uploadingPicture}
        />

        <Button
          variant="outline"
          className="w-[191px] h-[38px] gap-x-2 rounded-md border border-[#D8D8D8]"
          onClick={handleUploadButtonClick}
          disabled={uploadingPicture}
        >
          {uploadingPicture ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium text-[#404D61]">Uploading...</span>
            </>
          ) : (
            <>
              <SVGs.ImageUpload className="w-5 h-5" />
              <span className="text-sm font-medium text-[#404D61]">Upload new picture</span>
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-9">
        {/* Basic Information */}
        <div className="space-y-6 w-[880px]">
          <div>
            <h2 className="font-medium text-[#101828] text-sm mb-1">Basic Information</h2>
            <h3 className="text-[#475467] text-sm">Manage your identity information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              name="First_name"
              control={control}
              label="First name"
              placeholder="Melody"
              rules={{ required: 'First name is required' }}
            />

            <TextField
              name="Last_name"
              control={control}
              label="Last name"
              placeholder="Ezeani"
              rules={{ required: 'Last name is required' }}
            />

            <TextField
              name="Email"
              control={control}
              label="Email"
              placeholder="ezeanimelody@email.com"
              rules={{ required: 'Email is required' }}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-6 w-[880px]">
          <div>
            <h2 className="font-medium text-[#101828] text-sm mb-1">Contact Number</h2>
            <h3 className="text-[#475467] text-sm">Manage your account phone number</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              name="Phone_number"
              control={control}
              label="Phone number"
              placeholder="+2348023456789"
              rules={{ required: 'Phone number is required' }}
            />

            <div className="pt-6">
              <Button
                variant="outline"
                className="w-[185px] h-[38px]
                    rounded-md border border-[#D8D8D8]"
              >
                <span className="text-sm font-medium text-[#404D61]">Change phone number</span>
              </Button>
            </div>
          </div>
        </div>

        {/* National ID */}
        {ninStatus && ninStatus.hasDocument && (
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

                    <span className="text-xs text-gray-500">Document uploaded</span>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                    ninStatus.verificationStatus === 'verified'
                      ? 'border-green-200 bg-green-50'
                      : ninStatus.verificationStatus === 'rejected'
                        ? 'border-red-200 bg-red-50'
                        : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <SVGs.HalfTime
                    className={`w-4 h-4 ${
                      ninStatus.verificationStatus === 'verified'
                        ? 'text-green-600'
                        : ninStatus.verificationStatus === 'rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      ninStatus.verificationStatus === 'verified'
                        ? 'text-green-700'
                        : ninStatus.verificationStatus === 'rejected'
                          ? 'text-red-700'
                          : 'text-[#894B00]'
                    }`}
                  >
                    {ninStatus.verificationStatus === 'verified'
                      ? 'Verified'
                      : ninStatus.verificationStatus === 'rejected'
                        ? 'Rejected'
                        : 'Pending Review'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password */}
        <div className="space-y-6 w-[880px]">
          <div>
            <h2 className="font-medium text-[#101828] text-sm mb-1">Password</h2>
            <h3 className="text-[#475467] text-sm">Modify your current password</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              name="password"
              control={control}
              label="Password"
              type="password"
              placeholder="Enter new password (leave empty to keep current)"
              rules={{
                required: confirmPassword ? 'Password is required when confirming' : false,
                validate: (value) => {
                  if (confirmPassword && !value) {
                    return 'Password is required when confirming';
                  }
                  if (value && value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return true;
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
                required: password ? 'Please confirm your password' : false,
                validate: (value) => {
                  if (password && !value) {
                    return 'Please confirm your password';
                  }
                  if (password && value && value !== password) {
                    return 'Passwords do not match';
                  }
                  return true;
                },
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
  );
};

export default ProfileSecurity;
