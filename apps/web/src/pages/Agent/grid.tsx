import Frame from '@/assets/pngs/Frame.png';
import { SVGs } from '@/assets/svgs/Index';
import { Button, Checkbox } from '@uhomes/ui-kit';
import { useState } from 'react';
import { images } from '../students/constants';
const Grid = () => {
  const [listingProperty] = useState<null | number>(2);
  const [selectedImage, setSelectedImage] = useState(0);



  const remainingCount = images.length - 3;

  return (
    <div>
      {listingProperty ? (
        <div className="p-4 rounded-lg ">
          <div className="grid md:grid-1 w-full lg:grid-cols-2 gap-4 ">

             {[...Array(5)].map((_, i) => (
            <div key={i} className="flex  gap-4 items-start p-4 border border-[#F4F4F4]">
              <div>
                <Checkbox/>
              </div>
              <div className=" w-[226px] md:w-[651px]">
                <div className="flex gap-6 flex-col md:flex-row ">
                  {/* Left: Image + Thumbnails */}
                  <div className="flex flex-col ">
                    {/* Main Image */}
                    <div className="w-full md:w-[140px]  flex-1 rounded-lg">
                      <img
                        src={images[selectedImage].url}
                        alt={images[selectedImage].alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="mt-1 flex gap-1">
                      {images.slice(0, 3).map((image, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`rounded-lg  overflow-hidden transition-all border ${
                            selectedImage === idx
                              ? 'border-blue-500 ring-1 ring-blue-300'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image.thumb}
                            alt={image.alt}
                            className="w-full h-full md:w-8 md:h-8 object-cover"
                          />
                        </button>
                      ))}

                      {/* More Images Button */}
                      {remainingCount > 0 && (
                        <button
                          onClick={() => setSelectedImage(3)}
                          className="relative rounded-lg  overflow-hidden bg-black/90 hover:bg-black/90 transition-all w-full h-10 md:w-8 md:h-8 flex items-center justify-center"
                        >
                          <img
                            src={images[3].thumb}
                            alt={images[3].alt}
                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                          />
                          <span className="text-white text-xs font-semibold relative z-10">
                            +{remainingCount}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="font-normal tex-xs capitalize text-[#09090B]">Apartment</p>
                      <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                        Emerates Lodge
                      </h4>
                    </div>
                    <div>
                      <p className="font-normal tex-xs capitalize text-[#09090B]">Location</p>
                      <div className="flex items-center gap-1.5">
                        <SVGs.Location />
                        <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                          Ifite Road, Awka
                        </h4>
                      </div>
                    </div>
                    <div>
                      <p className="font-normal tex-xs capitalize text-[#09090B]">Bookings</p>
                      <h4 className="capitalize text-[#09090B] font-semibold text-sm">₦180,000</h4>
                    </div>
                    <div>
                      <p className="font-normal tex-xs capitalize text-[#09090B]">Price</p>
                      <h4 className="capitalize text-[#09090B] font-semibold text-sm">3</h4>
                    </div>
                    <div>
                      <p className="font-normal tex-xs capitalize text-[#09090B]">Rating</p>
                      <div className="flex items-center gap-1.5">
                        <SVGs.HalfStar />
                        <h4 className="capitalize text-[#09090B] font-semibold text-sm">
                          4.5 (24)
                        </h4>
                      </div>
                    </div>
                    <div>
                      <p className="font-normal tex-xs capitalize text-[#09090B]">Amenities</p>
                      <h4 className="capitalize text-[#09090B] font-semibold text-sm">4 items</h4>
                    </div>
                  </div>
                </div>

                {/* Optional: Action Buttons */}
                <div className="flex  gap-4 mt-6">
                  <button className="text-gray-500 hover:text-blue-600 transition">
                    <SVGs.Pencil />
                  </button>
                  <div className="border border-[#D5D5D5DD] "></div>
                  <button className="text-red-500 hover:text-red-600 transition">
                    <SVGs.Trash />
                  </button>
                </div>
              </div>
            </div>
             ))}
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
    </div>
  );
};

export default Grid;
