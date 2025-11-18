import { Button } from '@uhomes/ui-kit';
import Badge from '@/shared/badge';
import LikeButton from '@/shared/like-button';
import HostelCard from '@/shared/hostel-card';
import { badges, topBadges } from '@/pages/students/constants';
import { SVGs } from '@/assets/svgs/Index';
import HostelImage from '@/assets/pngs/hostel-image-3.png';

export default function HostelDetail() {
  const availableRooms = [
    { id: 1, description: 'Single Room', price: '₦250,000' },
    { id: 2, description: 'Shared Room (2-person)', price: '₦125,000' },
  ];

  const studentReviews = [
    {
      id: 1,
      name: 'David',
      date: '21/10/2025',
      rating: SVGs.FiveStars,
      review:
        'Novena Hostel really made my stay at school easy. The rooms are clean, the environment is peaceful, and I love that there’s always light and water. Totally worth it!',
    },
    {
      id: 2,
      name: 'Esther',
      date: '21/8/2024',
      rating: SVGs.FourAndHalfStars,
      review:
        'I’ve stayed here for two sessions now, and it’s been great. The WIFI is fast, and the location is close to everything, food spots, school, and transport. Highly recommend.',
    },
    {
      id: 3,
      name: 'Amaka',
      date: '4/10/2023',
      rating: SVGs.FourAndHalfStars,
      review:
        'It’s my first hostel off campus, and I love it here! The place feels safe, neat, and comfortable. Plus, the balcony view is perfect for evening relaxation.',
    },
    {
      id: 4,
      name: 'Emeka',
      date: '23/4/2023',
      rating: SVGs.FiveStars,
      review: 'Very neat environment, highly recommended!',
    },
    {
      id: 5,
      name: 'Samuel',
      date: '3/6/2023',
      rating: SVGs.FiveStars,
      review: 'Very neat environment, highly recommended!',
    },
  ];

  return (
    <>
      <div className="flex gap-x-9 items-center pl-4 mt-5">
        <Button variant="outline" className="w-11 h-11 rounded-full border border-[#E5E5E5] p-0">
          <SVGs.ChevronLeft />
        </Button>
        <h1 className="font-semibold text-base leading-[120%] tracking-[0%] text-black">
          Find Hostels
        </h1>
      </div>
      <div className="border-t border-t-[#E4E4E4] mt-5"></div>
      <div className="flex justify-between mt-14">
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
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`relative w-19.5 h-19.5 rounded overflow-hidden ${i === 0 ? 'border-[1.5px] border-[#141B34]' : ''}`}
            >
              <img src={HostelImage} alt="" className="w-full h-full" />
              <div
                className={`absolute left-0 right-0 top-0 bottom-0 justify-center items-center bg-[#000000CC] ${i === 2 ? 'flex' : 'hidden'}`}
              >
                <span className="font-medium text-xs leading-[100%] align-middle text-white">
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
      <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-6">
        Description
      </h2>
      <p className="text-sm leading-[150%] tracking-[0%] text-black mt-3">
        Enjoy comfortable living at Novena Hostel, just minutes from UNIZIK. Each room comes with
        free WIFI, air-conditioning, and a private bathroom. The hostel provides free on-site
        parking, a washing machine, and a shared dining area. With spacious balconies, tiled floors,
        and comfortable seating spaces, Novena Hostel offers a calm and homely environment for
        relaxation and study. Ideally located in the heart of Ifite-Awka, just a short distance from
        Nnamdi Azikiwe University (UNIZIK), Novena Hostel provides quick access to nearby
        supermarkets, eateries, and local attractions. It’s a convenient choice for students looking
        for comfort, safety, and proximity to campus life.
      </p>
      <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-4">
        Available Rooms
      </h2>
      {availableRooms.map((availableRoom) => (
        <div key={availableRoom.id} className="rounded-md border border-[#EAEAEA] p-2 mt-3">
          <span className="text-xs leading-[100%] tracking-[0%] text-[#71717A]">
            {availableRoom.description}
          </span>
          <div className="leading-[100%] tracking-[0%] mt-4">
            <span className="font-semibold text-xl text-[#09090B]">{availableRoom.price}</span>{' '}
            <span className="text-sm text-[#71717A]">per semester</span>
          </div>
          <div className="w-fit flex items-center rounded-full bg-[#F3F3F3] px-1.5 py-0.5 mt-2">
            <span className="text-xs leading-[100%] tracking-[0%] text-[#71717A] text-center align-middle">
              2 rooms left
            </span>
          </div>
        </div>
      ))}
      <h2 className="font-semibold text-base leading-[150%] tracking-[0%] text-black mt-4">
        Amenities:
      </h2>
      <div className="flex gap-2 mt-3">
        {badges.map((badge) => (
          <Badge key={badge.id} Icon={badge.Icon} text={badge.text} />
        ))}
      </div>
      <Button className="w-full h-[37px] gap-x-2 rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] px-4 py-2 mt-4">
        <SVGs.PropertyAdd />
        <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
          Book Now
        </span>
      </Button>
      <div className="rounded-[10px] border border-[#93A2C30D] shadow-[1px_1px_8px_0px_#00000014] p-10 pt-3 mt-[41px]">
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
      </div>
      <h1 className="font-semibold text-lg leading-[150%] tracking-[0%] text-black mt-20">
        Hostels Like This
      </h1>
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] p-4 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] p-4">
            <HostelCard />
          </div>
        ))}
      </div>
    </>
  );
}
