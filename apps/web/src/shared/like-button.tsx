import { useState } from 'react';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@uhomes/ui-kit';
import { SVGs } from '@/assets/svgs/Index';
import { saveProperty, unsaveProperty } from '@/services/property';

interface LikeButtonProps {
  propertyId: string;
  isSaved?: boolean;
  onToggle?: (isSaved: boolean) => void;
  className?: string;
}

export default function LikeButton({
  propertyId,
  isSaved: initialSaved = false,
  onToggle,
  className = 'w-7 h-7 rounded-md border border-[#CECECE] bg-white p-0',
}: LikeButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events

    if (isLoading) return;

    try {
      setIsLoading(true);

      if (isSaved) {
        await unsaveProperty(propertyId);
        setIsSaved(false);
        toast.success('Property removed from favorites');
        onToggle?.(false);
      } else {
        await saveProperty(propertyId);
        setIsSaved(true);
        toast.success('Property added to favorites');
        onToggle?.(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to update favorites. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred.');
      }
      console.error('Toggle favorite error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className={className} onClick={handleToggle} disabled={isLoading}>
      <SVGs.Favorite className={isSaved ? 'fill-red-500' : ''} />
    </Button>
  );
}
