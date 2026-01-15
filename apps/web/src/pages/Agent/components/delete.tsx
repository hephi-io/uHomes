import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTrigger } from '@uhomes/ui-kit';
import { SVGs } from '@/assets/svgs/Index';

const DeleteProperty = () => {
  const [step, setStep] = useState<'warning' | 'success'>('warning');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStep('warning');
      setIsDeleting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Add your delete API call here
      // await deleteProperty(propertyId)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStep('success');
    } catch (error) {
      console.error('Delete failed:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Property</Button>
      </DialogTrigger>

      <DialogContent className="p-8">
        {step === 'warning' ? (
          <WarningStep
            onCancel={() => setIsOpen(false)}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        ) : (
          <SuccessStep onClose={() => setIsOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

// Separate components for cleaner code
const WarningStep = ({
  onCancel,
  onConfirm,
  isDeleting,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => (
  <div className="space-y-8">
    <div className="flex items-center justify-center">
      <SVGs.CarbonWarninng className="w-14 h-14 text-amber-500" />
    </div>

    <div className="space-y-4 text-center">
      <h2 className="text-[#1E1E1E] font-bold text-lg leading-[120%]">
        Are you sure you want to delete this Listing?
      </h2>
      <p className="text-[#1E1E1E] font-normal text-sm leading-[140%]">
        Once deleted, admin will review your request before permanent deletion, hence the property
        will no longer be visible or accessible on the platform and cannot be undone.
      </p>
    </div>

    <div className="flex items-center gap-3">
      <Button onClick={onCancel} variant="outline" className="flex-1" disabled={isDeleting}>
        Cancel
      </Button>

      <Button onClick={onConfirm} variant="destructive" className="flex-1" disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete Listing'}
      </Button>
    </div>
  </div>
);

const SuccessStep = ({ onClose }: { onClose: () => void }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <div className="space-y-4 text-center px-8">
      <h2 className="text-[#1E1E1E] font-bold text-lg leading-[120%]">
        Delete Request Submitted Successfully!
      </h2>
      <p className="text-[#1E1E1E] font-normal text-sm leading-[140%]">
        Your delete request will be reviewed by U-Homes admin before permanent deletion.
      </p>
    </div>

    <Button onClick={onClose} variant="outline" className="w-full">
      Close
    </Button>
  </div>
);

export default DeleteProperty;
