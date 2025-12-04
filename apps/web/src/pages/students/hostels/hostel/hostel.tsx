import { Button, Textarea } from '@uhomes/ui-kit';

import Badge from '@/shared/badge';
import LikeButton from '@/shared/like-button';
import { HostelCard } from '@/shared/hostel-card';
import { badges, topBadges } from '@/pages/students/constants';
import { SVGs } from '@/assets/svgs/Index';
import HostelImage from '@/assets/pngs/hostel-image-3.png';
import { useNavigate } from 'react-router-dom';
import {
  availableRooms,
  studentReviews,
  paginationPlaceholders,
  commentButtons,
  receiptDetails,
  breakdowns,
} from './mocks';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function Hostel() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/students/hostels');
  };

  return (
    <>
      <div className="flex gap-x-9 items-center pl-4 md:pl-8 mt-5 md:mt-0 lg:mt-5">
        <Button
          variant="outline"
          className="w-11 h-11 rounded-full border border-[#E5E5E5] p-0 cursor-pointer"
          onClick={handleGoBack}
        >
          <SVGs.ChevronLeft />
        </Button>

        <h1 className="font-semibold text-base leading-[120%] tracking-[0%] text-black">
          Find Hostels
        </h1>
      </div>

      <div className="border-t border-t-[#E4E4E4] mt-5"></div>

      <div className="lg:p-8">
        <div className="lg:flex lg:gap-x-[25px] justify-between lg:items-start">
          <div className="lg:w-[68.09%] lg:grow">
            <div className="flex justify-between mt-12 lg:mt-3">
              <div>
                <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-black">
                  Novena Hostel
                </h1>
                <div className="flex gap-x-1.5 items-center mt-2">
                  <SVGs.Location />
                  <span className="text-sm leading-[100%] tracking-[0%] align-middle text-[#09090B]">
                    Miracle Jct, Ifite-Awka 420116, Anambra
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-10 h-10 rounded-full border border-[#E5E5E5]">
                <SVGs.Share />
              </Button>
            </div>
            <div className="relative h-[505px] rounded overflow-hidden mt-4">
              <img src={HostelImage} alt="" className="w-full h-full" />
              <div className="absolute left-4 right-4 top-3.5 flex justify-between items-center">
                <div className="flex gap-x-1.5 items-center">
                  {topBadges.map((topBadge) => (
                    <Badge key={topBadge.id} Icon={topBadge.Icon} text={topBadge.text} />
                  ))}
                </div>
                <LikeButton />
              </div>
            </div>
            <div className="flex justify-between items-center px-5 mt-2">
              <Button variant="ghost" className="w-fit p-0 m-0">
                <SVGs.ChevronLeft />
              </Button>
              <div className="flex gap-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`relative w-19.5 h-19.5 rounded overflow-hidden md:w-39.5 md:h-24 ${i === 0 ? 'border-[1.5px] border-[#141B34]' : ''} ${i === 1 ? 'hidden md:block' : ''}`}
                  >
                    <img src={HostelImage} alt="" className="w-full h-full" />
                    <div
                      className={`absolute left-0 right-0 top-0 bottom-0 justify-center items-center bg-[#000000CC] ${i === 3 ? 'flex' : 'hidden'}`}
                    >
                      <span className="font-medium text-xs leading-[100%] tracking-[0%] align-middle text-white">
                        +6
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-fit p-0 m-0">
                <SVGs.ChevronLeft className="rotate-180" />
              </Button>
            </div>
            <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-6 md:mt-9">
              Description
            </h2>
            <p className="text-sm leading-[150%] tracking-[0%] text-black mt-3">
              Enjoy comfortable living at Novena Hostel, just minutes from UNIZIK. Each room comes
              with free WIFI, air-conditioning, and a private bathroom. The hostel provides free
              on-site parking, a washing machine, and a shared dining area. With spacious balconies,
              tiled floors, and comfortable seating spaces, Novena Hostel offers a calm and homely
              environment for relaxation and study. Ideally located in the heart of Ifite-Awka, just
              a short distance from Nnamdi Azikiwe University (UNIZIK), Novena Hostel provides quick
              access to nearby supermarkets, eateries, and local attractions. It’s a convenient
              choice for students looking for comfort, safety, and proximity to campus life.
            </p>
            <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-4 lg:mt-9">
              Available Rooms
            </h2>
            <div className="grid grid-cols-1 gap-3 md:w-[73.74%] md:grid-cols-2 mt-3">
              {availableRooms.map((availableRoom) => (
                <div key={availableRoom.id} className="rounded-md border border-[#EAEAEA] p-2">
                  <span className="text-xs leading-[100%] tracking-[0%] text-[#71717A]">
                    {availableRoom.description}
                  </span>
                  <div className="leading-[100%] tracking-[0%] mt-4">
                    <span className="font-semibold text-xl text-[#09090B]">
                      {availableRoom.price}
                    </span>{' '}
                    <span className="text-sm text-[#71717A]">per semester</span>
                  </div>
                  <div className="w-fit flex items-center rounded-full bg-[#F3F3F3] px-1.5 py-0.5 mt-2">
                    <span className="text-xs leading-[100%] tracking-[0%] text-[#71717A] text-center align-middle">
                      2 rooms left
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-4 lg:mt-9">
              Amenities:
            </h2>
            <div className="flex gap-2 mt-3">
              {badges.map((badge) => (
                <Badge key={badge.id} Icon={badge.Icon} text={badge.text} />
              ))}
            </div>
            <Button className="w-full h-[37px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2 mt-4 lg:mt-9">
              <SVGs.PropertyAdd />
              <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                Book Now
              </span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger className="hidden w-full mt-4">
                <Button
                  variant="outline"
                  className="w-full h-10 gap-x-2 rounded-lg border-[#DCDCDC] bg-[#F8F8F9]"
                >
                  <SVGs.Invoice />
                  <span className="font-medium text-sm leading-[150%] tracking-[0%] text-[#09090B]">
                    View Receipt
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[510px] max-h-screen rounded-[10px] bg-white gap-0 p-6 overflow-y-scroll">
                <AlertDialogHeader className="gap-0">
                  <AlertDialogTitle className="flex gap-x-2 justify-center items-center">
                    <SVGs.UHome />
                    <span className="font-bold text-lg leading-6 tracking-normal align-middle text-[#1F1E1E]">
                      HOMES
                    </span>
                  </AlertDialogTitle>
                  <div className="border-t-[0.5px] border-t-[#DCDCDC] mt-2" />
                  <AlertDialogDescription className="mt-3">
                    <h1 className="font-medium text-lg leading-7 tracking-[0%] text-black text-center">
                      Booking Payment Receipt
                    </h1>
                    <div className="font-medium text-2xl leading-7 tracking-[0%] text-black text-center mt-4">
                      ₦280,000.00
                    </div>
                    <div className="w-fit flex gap-x-2.5 items-center rounded-md bg-[#1DB4691F] px-2 py-0.5 mx-auto mt-4">
                      <div className="size-2 rounded-full bg-[#11A75C]" />
                      <span className="text-sm leading-5.5 tracking-[0%] text-[#11A75C]">
                        Successful
                      </span>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="bg-[#F9FBFF] p-4 mt-6">
                  {receiptDetails.map((receiptDetail) => (
                    <div key={receiptDetail.id} className={receiptDetail.id === 1 ? '' : 'mt-6'}>
                      <h4 className="font-light text-sm leading-[100%] tracking-[0%] text-[#727272]">
                        {receiptDetail.header}
                      </h4>
                      <div className="flex gap-x-2.5 items-center font-Bricolage font-medium text-sm leading-[100%] tracking-[0%] text-[#09090B] mt-2">
                        <span>{receiptDetail.textOne}</span>
                        <span
                          className={
                            receiptDetail.id === 3 || receiptDetail.id === 4 ? 'hidden' : ''
                          }
                        >
                          -
                        </span>
                        <span
                          className={
                            receiptDetail.id === 3 || receiptDetail.id === 4 ? 'hidden' : ''
                          }
                        >
                          {receiptDetail.textTwo}
                        </span>
                        <Button
                          variant="ghost"
                          className={`size-4 ${receiptDetail.id === 3 ? '' : 'hidden'}`}
                        >
                          <SVGs.Copy />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-t-[#DCDCDC] mt-6" />
                  <h3 className="font-medium text-sm leading-6 tracking-[0%] align-middle text-[#09090B] text-center mt-6">
                    Cost breakdown
                  </h3>
                  {breakdowns.map((breakdown) => (
                    <div key={breakdown.id} className="flex justify-between items-center mt-4">
                      <span className="font-medium text-sm leading-7 tracking-[0%] align-middle text-[#09090B]">
                        {breakdown.name}
                      </span>
                      <span className="text-sm leading-7 tracking-[0%] text-right align-middle text-[#09090B]">
                        {breakdown.value}
                      </span>
                    </div>
                  ))}
                  <div className="flex gap-x-2.5 rounded-lg bg-[#EFF3FD] px-3 py-2 mt-6">
                    <SVGs.Exclamation />
                    <div>
                      <h3 className="font-semibold text-sm leading-[150%] tracking-[0%] align-middle text-[#3E78FF]">
                        Rent is due in 12 months
                      </h3>
                      <p className="text-sm leading-[120%] tracking-[0%] align-middle text-[#3E78FF] mt-2.5">
                        Your current rent expires on December 26, 2026. Renew early to keep your
                        room secured.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-10 gap-x-2 rounded-[5px] border-[#E4E4E4] mt-4"
                  >
                    <SVGs.CreditCard />
                    <span className="font-medium text-sm leading-[150%] tracking-[0%] text-[#141B34]">
                      Renew
                    </span>
                  </Button>
                </div>
                <AlertDialogFooter className="mt-15">
                  <AlertDialogCancel className="h-[37px] rounded-md border border-[#E5E5E5] md:w-[131px]">
                    <span className="font-medium text-sm leading-[100%] tracking-[0%] text-[#09090B]">
                      Close
                    </span>
                  </AlertDialogCancel>
                  <AlertDialogAction className="h-[37px] rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4">
                    <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                      Download Receipt
                    </span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="rounded-[10px] border border-[#93A2C30D] shadow-[1px_1px_8px_0px_#00000014] lg:w-[30.07%] lg:max-w-[409px] lg:shrink-0 p-10 pt-3 md:px-4 lg:px-10 lg:pt-3 lg:pb-10 mt-[41px] lg:mt-0">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-lg leading-[100%] tracking-[0%] text-black">
                Students Review
              </h1>
              <div className="flex gap-x-1 items-center">
                <SVGs.StarHalf />
                <div className="text-sm leading-[100%] tracking-[0%] align-middle">
                  <span className="font-semibold">4.5</span> <span>(84)</span>
                </div>
              </div>
            </div>
            {studentReviews.map((review) => (
              <div key={review.id} className={`${review.id === 1 ? 'mt-8' : 'mt-12'}`}>
                <div className="flex gap-x-4 items-center">
                  <span className="text-sm leading-[100%] tracking-[0%] text-[#09090B]">
                    {review.name}
                  </span>
                  <SVGs.Dot />
                  <span className="text-xs leading-[100%] tracking-[0%] text-[#AFAFAF]">
                    {review.date}
                  </span>
                </div>
                <review.rating className="mt-2.5" />
                <p className="text-sm leading-[100%] tracking-[0%] text-[#AFAFAF] mt-2.5">
                  {review.review}
                </p>
              </div>
            ))}
            <div className="w-fit flex gap-x-5 items-center lg:w-full mx-auto mt-8">
              <Button variant="ghost">
                <SVGs.ChevronLeft />
              </Button>

              <div className="flex gap-x-6 items-center lg:gap-x-0">
                {paginationPlaceholders.map((placeholder) => (
                  <Button
                    key={placeholder.id}
                    variant="secondary"
                    className={`group size-11 rounded-full ${placeholder.id === 1 ? 'bg-[#3E78FF]' : 'bg-[#F7F7F7]'}`}
                  >
                    <span
                      className={`text-base leading-[150%] tracking-[0%] align-middle group-hover:text-black ${placeholder.id === 1 ? 'text-white' : 'text-[#737373]'}`}
                    >
                      {placeholder.content}
                    </span>
                  </Button>
                ))}
              </div>

              <Button variant="ghost">
                <SVGs.ChevronLeft className="rotate-180" />
              </Button>
            </div>
            <div className="hidden mt-8">
              <h1 className="font-semibold text-base leading-[120%] tracking-[0%] text-[#09090B]">
                Rate Your Stay Experience
              </h1>
              <p className="text-sm leading-[120%] tracking-[0%] text-[#09090B] mt-2">
                Your feedback helps us improve and guide other students in choosing the right hostel
                or apartment.
              </p>
              <div className="flex justify-between items-center rounded-[5px] border border-[#E4E4E4EE] bg-white md:gap-x-9 md:justify-center p-4 mt-6">
                {[...Array(5)].map((_, i) => (
                  <SVGs.StarBlank key={i} className="text-[#141B34] hover:cursor-pointer" />
                ))}
              </div>
              <div className="flex flex-wrap gap-4 items-center md:w-[95%] lg:w-full mt-4">
                {commentButtons.map((commentButton) => (
                  <Button
                    key={commentButton.id}
                    variant="secondary"
                    className="rounded-full bg-[#F4F4F5] hover:cursor-pointer px-2 py-1"
                  >
                    <span className="text-sm leading-[150%] tracking-[0%] text-[#3D3D3D]">
                      {commentButton.text}
                    </span>
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Share your thoughts"
                className="h-[106px] rounded-[5px] border-[#E4E4E4EE] bg-white bricolage-grotesque text-sm leading-[150%] tracking-[0%] text-[#AFAFAF] focus:text-black px-4 py-2 mt-4"
              />
              <Button className="w-full h-[37px] rounded-[5px] bg-[#3E78FF] mt-4">
                <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                  Comment
                </span>
              </Button>
            </div>
          </div>
        </div>

        <h1 className="font-semibold text-lg leading-[150%] tracking-[0%] text-black mt-20">
          Hostels Like This
        </h1>

        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:grid-cols-2 lg:grid-cols-3 lg:gap-12 lg:border-none lg:bg-inherit p-4 lg:p-0 mt-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:border-none p-4 md:p-0"
            >
              <HostelCard />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
