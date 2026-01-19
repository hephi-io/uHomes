import { SVGs } from '@/assets/svgs/Index';
import { Button, Textarea } from '@uhomes/ui-kit';
import SuccessAnimation from '@/assets/pngs/Success Animation.png';

const Viewdetails = () => {
  return (
    <>
      <div className="bg-white min-h-[90vh] overflow-auto  rounded-[8px]  p-6 space-y-12">
        <div className="space-y-6">
          <div className="border-b  border-[#E0E0E0] pb-4">
            <h2 className="text-[#101828] font-semibold text-lg leading-[130%]">
              Transaction Reference
            </h2>
            <h4 className="text-[#475467] font-semibold text-lg leading-[130%]">
              TXN-20251104-108
            </h4>
          </div>

          <div className="bg-[#FAFAFA] p-3 flex items-center justify-between">
            <div className="flex items-center flex-col space-y-2">
              <div className="w-[52px] h-[52px]  rounded-full bg-[#D9E4FF] flex items-center justify-center">
                <SVGs.Person className="text-[#3E78FF] w-6 h-6" />
              </div>
              <h2 className="text-[#09090B] font-normal text-sm">Student Name</h2>
              <h2 className="text-[#999999] font-normal text-sm leading-[120%]">Cynthia Chidera</h2>
            </div>

            <div className="flex items-center flex-col space-y-2">
              <div className="w-[52px] h-[52px]  rounded-full  flex items-center justify-center">
                <SVGs.ArrowRight />
              </div>
              <h2 className="text-[#09090B] font-normal text-sm">Payment Amount</h2>
              <h2 className="text-[#09090B] font-semibold text-2xl leading-[120%]">₦280,000</h2>
            </div>

            <div className="flex items-center flex-col space-y-2">
              <div className="w-[52px] h-[52px]  rounded-full bg-[#D9E4FF] flex items-center justify-center">
                <SVGs.Person className="text-[#7112C4] w-6 h-6" />
              </div>
              <h2 className="text-[#09090B] font-normal text-sm">Agent</h2>
              <h2 className="text-[#999999] font-normal text-sm leading-[120%]">
                cynthia@gmail.com
              </h2>
            </div>
          </div>

          <div>
            <h2 className="text-[#101828] font-medium text-base leading-[130%] mb-2">
              Booking Details
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-[301px] space-y-2">
                <h3 className="text-[#09090B] font-normal text-sm leading-[100%]">Apartment</h3>
                <p className="text-[#999999] font-normal text-sm leading-[120%]">Emerates Lodge</p>
              </div>
              <div className="w-[301px] space-y-2">
                <h3 className="text-[#09090B] font-normal text-sm leading-[100%]">Location </h3>
                <p className="text-[#999999] font-normal text-sm leading-[120%]">
                  4, Ifite Road, Awka
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#E0E0E0]"></div>

          <div>
            <h2 className="text-[#101828] font-medium text-base leading-[130%] mb-2">
              Payment Breakdown
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-[301px] space-y-2">
                <h3 className="text-[#09090B] font-normal text-sm leading-[100%]">Rent</h3>
                <p className="text-[#999999] font-normal text-sm leading-[120%]">₦240,000</p>
              </div>
              <div className="w-[301px] space-y-2">
                <h3 className="text-[#09090B] font-normal text-sm leading-[100%]">
                  Service charge{' '}
                </h3>
                <p className="text-[#999999] font-normal text-sm leading-[120%]">₦10,000</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <div className="w-[301px] space-y-2">
                <h3 className="text-[#09090B] font-normal text-sm leading-[100%]">Caution fee</h3>
                <p className="text-[#999999] font-normal text-sm leading-[120%]">₦20,000</p>
              </div>
              <div className="w-[301px] space-y-2">
                <h3 className="text-[#09090B] font-normal text-sm leading-[100%]">
                  Agreement fee{' '}
                </h3>
                <p className="text-[#999999] font-normal text-sm leading-[120%]">₦10,000</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[#09090B] font-normal text-sm leading-[100%] mb-2">
              Review Notes (optional - will be sent to the agent via email)
            </h2>
            <Textarea
              placeholder="Add notes or feedback about this application"
              className="h-[86px] text-[#999999] font-inter text-sm border border-[#E4E4E7] rounded-xl resize-none"
            />
          </div>
        </div>
        <div className="p-6 bg-[#F9FAFB] border-t border-gray-100 flex justify-between items-center">
          <Button variant="outline" className="px-8 border-gray-200 text-gray-600 font-bold h-11">
            close
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="px-8 border-red-100 text-[#F04438] hover:bg-red-50 font-bold h-11"
            >
              Reject
            </Button>
            <Button className="px-8 bg-[#3E78FF] text-white font-bold h-11">Approve</Button>
          </div>
        </div>
      </div>
      <EscrowPaymentReleased />
    </>
  );
};

export default Viewdetails;

const EscrowPaymentReleased = () => {
  return (
    <div className="w-[443px] rounded-[10px] border-2 border-[#3E78FF0D] bg-white p-6 space-y-9">
      {/* Image */}
      <div className="w-[256px] h-[229px] mx-auto">
        <img
          src={SuccessAnimation}
          alt="Listing Added Successfully"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text */}
      <div className="w-[394px] space-y-2 mx-auto text-center">
        <h2 className="text-[#09090B] font-semibold text-2xl leading-[42px]">
          Escrow Payment Released
        </h2>
        <p className="text-[#61646B] font-normal text-sm leading-5">
          This payment has been successfully released from escrow.
        </p>

        <div className="flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <SVGs.Contact2 className="w-4 h-4" />
            <h2 className="text-[#09090B] font-normal text-base leading-6">Call Agent</h2>
          </div>
          <div className="bg-[#A7A7A7] w-0.5 py-2 "></div>
          <div className="flex items-center gap-2">
            <SVGs.Download className="w-4 h-4" />
            <h2 className="text-[#09090B] font-normal text-base leading-6">Download receipt</h2>
          </div>
        </div>
      </div>

      {/* Button */}
      <div>
        <Button
          variant="outline"
          className="w-full bg-[#3E78FF] hover:bg-[#3E78FF] border border-[#E4E4E4EE] py-2 px-4 rounded-[5px]"
        >
          <span className="text-white font-medium text-base leading-[26px]">
            Return to Dashbaord
          </span>
        </Button>
      </div>
    </div>
  );
};
