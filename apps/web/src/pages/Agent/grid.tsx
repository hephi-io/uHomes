import Frame from '@/assets/pngs/Frame.png';
import { SVGs } from '@/assets/svgs/Index';
import { Button, Checkbox, Dialog, DialogContent } from '@uhomes/ui-kit';
import { DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import type { Property } from '@/shared/columns';
import AddNewProperty from './components/add-new-property';
import { deleteProperty } from '@/services/property';

interface GridProps {
  properties: Property[];
  onRefresh?: () => void | Promise<void>;
}

const Grid = ({ properties, onRefresh }: GridProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<Record<string, number>>({});
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (propertyId: string) => {
    setEditingPropertyId(propertyId);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProperty(propertyToDelete);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
      // Call refresh callback and wait for it to complete
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setEditingPropertyId(null);
    setEditDialogOpen(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingPropertyId(null);
    }
  };

  const getSelectedImage = (propertyId: string) => {
    return selectedImageIndex[propertyId] || 0;
  };

  const setSelectedImage = (propertyId: string, index: number) => {
    setSelectedImageIndex((prev) => ({ ...prev, [propertyId]: index }));
  };

  return (
    <div>
      {properties.length > 0 ? (
        <div className="p-4 rounded-lg ">
          <div className="grid md:grid-1 w-full lg:grid-cols-2 gap-4 ">
            {properties.map((property) => {
              const selectedImage = getSelectedImage(property.id);
              const propertyImages = property.images || [];
              const mainImage = propertyImages[selectedImage] || propertyImages[0] || '';
              const thumbnailImages = propertyImages.slice(0, 4);
              const remainingCount = propertyImages.length - 4;

              return (
                <div
                  key={property.id}
                  className="flex  gap-4 items-start p-4 border border-[#F4F4F4]"
                >
                  <div>
                    <Checkbox />
                  </div>
                  <div className=" w-[226px] md:w-[651px]">
                    <div className="flex gap-6 flex-col md:flex-row ">
                      {/* Left: Image + Thumbnails */}
                      <div className="flex flex-col">
                        {/* Main Image */}
                        <div className="w-full md:w-[140px] flex-1 rounded-lg overflow-hidden">
                          {mainImage && (
                            <img
                              src={mainImage}
                              alt={property.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </div>

                        {/* Thumbnail Strip */}
                        {thumbnailImages.length > 0 && (
                          <div className="mt-1 flex gap-1">
                            {thumbnailImages.slice(0, 3).map((image, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSelectedImage(property.id, idx)}
                                className={`rounded-lg overflow-hidden transition-all border shrink-0
            ${
              selectedImage === idx
                ? 'border-blue-500 ring-1 ring-blue-300'
                : 'border-transparent hover:border-gray-300'
            }`}
                              >
                                <img
                                  src={image}
                                  alt={`${property.name} ${idx + 1}`}
                                  className="w-10 h-10 md:w-8 md:h-8 object-cover"
                                />
                              </button>
                            ))}

                            {/* More Images Button */}
                            {remainingCount > 0 && (
                              <button
                                onClick={() => setSelectedImage(property.id, 3)}
                                className="relative rounded-lg overflow-hidden bg-black/90 hover:bg-black/90 transition-all
            w-10 h-10 md:w-8 md:h-8 shrink-0 flex items-center justify-center"
                              >
                                {thumbnailImages[3] && (
                                  <img
                                    src={thumbnailImages[3]}
                                    alt={`${property.name} more`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                                  />
                                )}
                                <span className="text-white text-xs font-semibold relative z-10">
                                  +{remainingCount}
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Right: Details */}
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="font-normal tex-xs capitalize text-[#09090B]">Apartment</p>
                          <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                            {property.name}
                          </h4>
                        </div>
                        <div>
                          <p className="font-normal tex-xs capitalize text-[#09090B]">Location</p>
                          <div className="flex items-center gap-1.5">
                            <SVGs.Location />
                            <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                              {property.location}
                            </h4>
                          </div>
                        </div>
                        <div>
                          <p className="font-normal tex-xs capitalize text-[#09090B]">Bookings</p>
                          <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                            {property.bookings}
                          </h4>
                        </div>
                        <div>
                          <p className="font-normal tex-xs capitalize text-[#09090B]">Price</p>
                          <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                            {property.price}
                          </h4>
                        </div>
                        <div>
                          <p className="font-normal tex-xs capitalize text-[#09090B]">Rating</p>
                          <div className="flex items-center gap-1.5">
                            <SVGs.HalfStar />
                            <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                              {property.rating}
                            </h4>
                          </div>
                        </div>
                        <div>
                          <p className="font-normal tex-xs capitalize text-[#09090B]">Amenities</p>
                          <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                            {property.amenities}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Optional: Action Buttons */}
                    <div className="flex  gap-4 mt-6">
                      <button
                        onClick={() => handleEdit(property.id)}
                        className="text-gray-500 hover:text-blue-600 transition"
                        title="Edit property"
                      >
                        <SVGs.Pencil />
                      </button>
                      <div className="border border-[#D5D5D5DD] "></div>
                      <button
                        onClick={() => handleDeleteClick(property.id)}
                        className="text-red-500 hover:text-red-600 transition"
                        title="Delete property"
                      >
                        <SVGs.Trash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border-[#F4F4F4] p-6 rounded-lg">
          <div className="flex justify-center flex-col items-center text-center">
            <div>
              <img src={Frame} alt="no listing available" className="w-[364.6px] h-40 mb-9" />
              <p className="text-[#878FA1] font-medium text-sm leading-5">
                You currently have no listing
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden lg:flex gap-x-2  mt-6 rounded border border-[#E4E4E4EE] bg-[#3E78FF] hover:bg-[#3E78FF] px-4 py-2"
            >
              <SVGs.AddProperty />
              <span className="font-medium text-sm text-white">Add Property</span>
            </Button>
          </div>
        </div>
      )}

      {/* Edit Property Dialog */}
      {editingPropertyId && (
        <AddNewProperty
          propertyId={editingPropertyId}
          mode="edit"
          open={editDialogOpen}
          onOpenChange={handleEditDialogClose}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[400px] rounded-[10px] bg-white p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-[#09090B] font-semibold text-xl">Delete Property</h2>
            <p className="text-[#61646B] font-normal text-sm">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setPropertyToDelete(null);
              }}
              disabled={isDeleting}
              className="border border-[#E5E5E5] rounded-[6px] font-inter py-2 px-4"
            >
              <span className="text-[#09090B] font-medium text-sm">Cancel</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 border border-red-600 rounded-[6px] font-inter py-2 px-4"
            >
              <span className="text-white font-medium text-sm">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Grid;
