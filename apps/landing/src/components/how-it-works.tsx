import { SVGs } from '../../../../packages/ui-kit/src/assets/svgs/Index';
import agentListings from '@/assets/pngs/agent-listings.png';

export default function HowItWorks() {
  const cards = [
    {
      id: 1,
      Icon: SVGs.Coins,
      header: 'Affordable Rooms',
      paragraph:
        'Private and shared rooms at student-friendly prices, with flexible payment options.',
    },
    {
      id: 2,
      Icon: SVGs.BuildingColorless,
      header: 'Modern Facilities',
      paragraph:
        '24/7 power, clean water, furnished rooms, high-speed WiFi, study lounges, kitchen areas, and recreational spaces.',
    },
    {
      id: 3,
      Icon: SVGs.SecurityLock,
      header: 'Secure Environment',
      paragraph: 'CCTV, gated compounds, and on-site security ensure your safety around the clock.',
    },
    {
      id: 4,
      Icon: SVGs.LocationStar,
      header: 'Campus-Friendly Locations',
      paragraph:
        'Hostels positioned close to major universities and polytechnics for easy access to classes and daily needs.',
    },
    {
      id: 5,
      Icon: SVGs.DribbleLogo,
      header: 'Verified Hostels Only',
      paragraph:
        'Every hostel on U-Homes is inspected and approved. No scams, no surprises, no hidden conditions.',
    },
  ];

  const stepCards = [
    {
      id: 1,
      header: 'Browse Available Hostels',
      paragraph: 'Choose from verified listings near your school.',
    },
    {
      id: 2,
      header: 'Book a Viewing or Request a Virtual Tour',
      paragraph: 'See the rooms, facilities, and environment before making a decision.',
    },
    {
      id: 3,
      header: 'Secure Your Space',
      paragraph: 'Make payment securely and get your digital confirmation.',
    },
    {
      id: 4,
      header: 'Move In With Ease',
      paragraph: 'Enjoy a comfortable, well-managed hostel for the entire academic session.',
    },
  ];

  return (
    <>
      <div className="border-b border-b-[#C4C4C4] lg:flex lg:flex-row-reverse lg:gap-x-[77px] lg:items-center px-[33px] pb-14 md:px-16.5 md:pb-28 lg:pl-33 lg:pr-0">
        <div>
          <h1 className="font-semibold text-[34px] -tracking-[1.5px] text-center text-black md:text-[44px] md:leading-[120%] lg:text-[54px] lg:leading-[63px] lg:text-left">
            Built for Trust & Safety
          </h1>
          <p className="text-sm leading-7.5 tracking-normal text-center text-[#6E6E6E] md:text-base lg:w-[77.04%] lg:text-lg lg:text-left mt-6">
            Every agent is verified with NIN, every payment is secured through escrow, and every
            review is from real students.
          </p>
          <div className="w-fit flex gap-x-2 items-center mx-auto mt-10 lg:mx-0">
            <div className="size-6 flex justify-center items-center rounded-full bg-[#0F60FF]">
              <SVGs.PlayIcon className="text-white" />
            </div>
            <span className="font-semibold text-sm leading-6.5 tracking-normal text-[#282828] md:text-base">
              See how it works
            </span>
          </div>
        </div>
        <div className="h-[414px] rounded-3xl bg-[#FAFAFA] md:h-[477px] md:flex md:justify-center md:items-center lg:w-[50.15%] mt-6 lg:mt-0">
          <div className="h-full rounded-3xl overflow-hidden md:w-[358px] md:h-[382px]">
            <img src={agentListings} alt="" className="size-full object-fill" />
          </div>
        </div>
      </div>
      <div className="border-b border-b-[#C4C4C4] md:grid md:grid-cols-2 md:gap-5.5 lg:grid-cols-3 lg:gap-3 px-[33px] py-14 md:px-16.5 md:py-28 lg:px-33">
        <h1 className="font-semibold text-[34px] -tracking-normal-[1.5px] text-black md:text-[44px] md:leading-[120%] lg:text-[54px] lg:leading-[63px]">
          A Better Student Housing Experience Starts Here
        </h1>
        {cards.map((card) => (
          <div key={card.id} className="rounded-2xl bg-[#F5F5F5] p-7 mt-5.5 md:mt-0">
            <div className="size-10 flex justify-center items-center rounded-[12px] bg-white">
              <card.Icon className={`text-[${card.id === 5 ? '#222222' : '#141B34'}]`} />
            </div>
            <h2 className="font-semibold text-lg -tracking-[0.5px] align-middle text-black md:leading-[150%] md:slashed-zero mt-30">
              {card.header}
            </h2>
            <p className="text-sm leading-[150%] -tracking-[0.3px] align-middle text-[#7C7C7C] md:slashed-zero lg:text-base mt-1">
              {card.paragraph}
            </p>
          </div>
        ))}
      </div>
      <div className="px-[33px] pt-28 md:px-16.5 lg:px-33">
        <h1 className="font-semibold text-[34px] leading-[120%] -tracking-[1.5px] text-center text-[#282828] md:text-[44px] lg:text-[54px] lg:leading-[63px]">
          Your Hostel, in Four Easy Steps
        </h1>
        <p className="text-sm leading-7.5 tracking-normal text-center text-[#5F6980] md:text-base lg:text-lg mt-6">
          Everything from viewing to move-in made quick and effortless.
        </p>
        <div className="lg:grid lg:grid-cols-2 lg:gap-3 lg:mt-20">
          {stepCards.map((stepCard) => (
            <div
              key={stepCard.id}
              className={`rounded-[20px] bg-[#F5F5F5] pl-8 pr-14 py-8 lg:mt-0 ${stepCard.id === 1 ? 'mt-20' : 'mt-3'}`}
            >
              <h1 className="w-fit font-Bricolage font-semibold text-[120px] bg-linear-to-b from-[#0F60FF] to-[#AFAFAF] bg-clip-text text-transparent md:text-[200px] ml-auto">
                {stepCard.id}
              </h1>
              <div>
                <h2 className="font-semibold text-base -tracking-[0.5px] align-middle slashed-zero text-black md:text-lg md:leading-[150%]">
                  {stepCard.header}
                </h2>
                <p className="text-sm leading-[150%] -tracking-[0.3px] align-middle slashed-zero text-[#7C7C7C] md:text-base mt-1">
                  {stepCard.paragraph}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
